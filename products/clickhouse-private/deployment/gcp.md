---
title: "ClickHouse Private on GCP"
slug: "docs/products/clickhouse-private/gcp"
sidebarTitle: "GCP"
---

## Overview

This guide covers deploying ClickHouse Private on Google Cloud Platform (GCP) using Google Kubernetes Engine (GKE). It adapts the standard AWS deployment process for GCP-specific services including Artifact Registry, GCS with S3-compatible API, and Workload Identity.

This guide supports both **standard** and **FIPS 140-2 compliant** deployments. FIPS-specific steps and configuration are marked with **(FIPS)** throughout. Set `ENABLE_FIPS=true` in `00-env.sh` to enable FIPS mode.

## Prerequisites

- GCP Project with billing enabled
- `gcloud` CLI installed and authenticated
- `kubectl` installed
- `helm` v3.x installed
- `skopeo` installed (for copying container images)
- AWS credentials with read access to ClickHouse ECR (for image copying)
- **Bastion host** in the VPC for accessing the private cluster
- **Deployer service account** with appropriate permissions (see below)
- **(FIPS)** Access to Red Hat UBI8 container image (pulled via GKE for certificate generation)

---

## Creating a Service Account for ClickHouse Deployment

In FedRAMP environments where direct user authentication is restricted, create a service account for impersonation.

### Option 1: Via GCP Console

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **+ CREATE SERVICE ACCOUNT**
3. Enter:
   - **Name:** `clickhouse-deployer`
   - **ID:** `clickhouse-deployer`
   - **Description:** `Service account for deploying ClickHouse infrastructure`
4. Click **CREATE AND CONTINUE**
5. Add the following roles:

| Role | Purpose |
|------|---------|
| `roles/compute.networkAdmin` | Create/manage VPC, subnets, NAT, routers |
| `roles/container.admin` | Create/manage GKE clusters and node pools |
| `roles/storage.admin` | Create/manage GCS buckets |
| `roles/iam.serviceAccountAdmin` | Create/manage service accounts |
| `roles/iam.serviceAccountUser` | Use service accounts for workload identity |
| `roles/iam.workloadIdentityUser` | Configure workload identity bindings |
| `roles/artifactregistry.admin` | Create/manage Artifact Registry repos |
| `roles/resourcemanager.projectIamAdmin` | Manage IAM policies on the project |

6. Click **CONTINUE** → **DONE**

**Grant Token Creator Permission:**

1. Click on the newly created `clickhouse-deployer` service account
2. Go to **PERMISSIONS** tab
3. Click **GRANT ACCESS**
4. Add principal: `<COMPUTE_SERVICE_ACCOUNT>@developer.gserviceaccount.com` (your bastion's service account)
5. Assign role: `roles/iam.serviceAccountTokenCreator`
6. Click **SAVE**

### Option 2: Via CLI (requires IAM admin access)

```bash expandable
PROJECT_ID=your-project-id
SA_EMAIL=clickhouse-deployer@${PROJECT_ID}.iam.gserviceaccount.com
COMPUTE_SA=<COMPUTE_PROJECT_NUMBER>-compute@developer.gserviceaccount.com

# Create service account
gcloud iam service-accounts create clickhouse-deployer \
  --display-name="ClickHouse Deployer" \
  --project=${PROJECT_ID}

# Grant roles
for role in \
  roles/compute.networkAdmin \
  roles/container.admin \
  roles/storage.admin \
  roles/iam.serviceAccountAdmin \
  roles/iam.serviceAccountUser \
  roles/iam.workloadIdentityUser \
  roles/artifactregistry.admin \
  roles/resourcemanager.projectIamAdmin
do
  gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="${role}"
done

# Allow compute SA to impersonate it
gcloud iam service-accounts add-iam-policy-binding ${SA_EMAIL} \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/iam.serviceAccountTokenCreator" \
  --project=${PROJECT_ID}
```

### Configure Impersonation on Bastion

Add this to your `00-env.sh` or run before executing scripts:

```bash
# Set impersonation for deployer service account
gcloud config set auth/impersonate_service_account clickhouse-deployer@${GCP_PROJECT}.iam.gserviceaccount.com

# Verify it works
gcloud compute networks list --project=${GCP_PROJECT}
```

To clear impersonation later:

```bash
gcloud config unset auth/impersonate_service_account
```

## Set up Tasks

### GCP Resources

0. [Set Environment Variables](#00-environment-variables) - `00-env.sh`
1. [Create Artifact Registry Repository](#01-create-artifact-registry) - `01-artifact-registry.sh`
2. [Copy Container Artifacts](#02-copy-container-images) - `02-copy-images.sh`
3. [Configure VPC and GKE Subnet](#03-configure-vpc-and-subnet) - `03-vpc-subnet.sh`
4. [Create Cloud NAT](#04-create-cloud-nat) - `04-cloud-nat.sh`
5. [Create GCP Service Account](#05-create-gcp-service-account) - `05-service-account.sh`
6. [Create GCS Bucket](#06-create-gcs-bucket) - `06-gcs-bucket.sh`
7. [Create GKE Cluster](#07-create-gke-cluster) - `07-gke-cluster.sh`
   - **Enable Private Nodes** (`--enable-private-nodes`)
   - **Enable Private Endpoint** (`--enable-private-endpoint`) - No public API access (FedRAMP)
   - **Enable Workload Identity** (`--workload-pool=$PROJECT_ID.svc.id.goog`)
8. [Create Node Pools](#08-create-node-pools) - `08-node-pools.sh`
9. [Deploy Local SSD DaemonSet](#09-local-ssd-daemonset) - `09-local-ssd-daemonset.sh`
10. [Add Topology Labels to Nodes](#10-add-topology-labels) - `10-topology-labels.sh`

### Kubernetes Resources

11. [Install VolumeSnapshot CRDs](#11-install-volumesnapshot-crds) - `11-volumesnapshot-crds.sh`
12. [Set up Workload Identity](#12-workload-identity-setup) - `12-workload-identity.sh`
13. [Install StorageClass](#13-install-storageclass) - `13-storageclass.sh` (optional - can use built-in `premium-rwo`)

### FIPS-Specific Steps (skip if `ENABLE_FIPS=false`)

14. **(FIPS)** [Create FIPS-Compliant Certificates](#14-create-fips-certificates) - `14-create-fips-certs.sh`
15. **(FIPS)** [Create Kubernetes Certificate Secrets](#15-create-certificate-secrets) - `15-create-cert-secrets.sh`

### Deploy ClickHouse

16. [Install Operator via Helm](#16-install-operator) - `16-install-operator.sh`
17. [Create ClickHouseCluster Resource](#17-install-clickhouse-cluster) - `17-install-cluster.sh`
18. [Bind Workload Identity to Helm SA](#18-bind-workload-identity-to-helm-sa) - `18-bind-helm-workload-identity.sh`
19. [Verify Installation](#19-verify-installation)

---

## 00. Environment Variables

**File: `00-env.sh`**

```bash expandable
#!/bin/bash
# ============================================
# ClickHouse Private GCP - Environment Setup
# ============================================
# Update these values for your environment

# GCP Project and Region
export GCP_PROJECT=your-project-id
export GCP_REGION=us-central1
export GCP_ZONES="us-central1-a,us-central1-b,us-central1-c"

# GKE Cluster
export GKE_CLUSTER_NAME=clickhouse-cluster

# ClickHouse Cluster (can have multiple per GKE cluster)
export CLUSTER_NAME=default-xx-01
export NAMESPACE=ns-${CLUSTER_NAME}

# Networking - Use existing VPC where bastion resides
export VPC_NAME=clickhouse-vpc
export SUBNET_NAME=gke-subnet
export SUBNET_RANGE=10.1.0.0/24
export POD_RANGE=10.244.0.0/14         # Must be on /14 boundary (3rd octet divisible by 4)
export SERVICE_RANGE=10.252.0.0/20     # Must be on /20 boundary
export MASTER_IPV4_CIDR=172.16.0.0/28  # For private cluster control plane
export BASTION_SUBNET_RANGE=10.0.0.0/24  # Bastion subnet (for master-authorized-networks)

# Storage
export BUCKET_NAME=clickhouse-data-${GCP_PROJECT}
export S3_KEY_PREFIX=ch-s3-$(uuidgen | tr '[:upper:]' '[:lower:]')

# Service Accounts
export GSA_NAME=clickhouse
export GSA_EMAIL=${GSA_NAME}@${GCP_PROJECT}.iam.gserviceaccount.com
export KSA_NAME=clickhouse

# Artifact Registry
export GAR_REPO_NAME=clickhouse
export GAR_HOST=${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT}/${GAR_REPO_NAME}

# FIPS Configuration (set to true for FIPS 140-2 compliance)
export ENABLE_FIPS=false

# Image Versions - FIPS mode uses FIPS-compliant builds
if [ "$ENABLE_FIPS" = "true" ]; then
  export CLICKHOUSE_SERVER_VERSION=25.8.1.9104-fips
  export CLICKHOUSE_KEEPER_VERSION=26.1.1.1493
else
  export CLICKHOUSE_SERVER_VERSION=25.8.1.9104
  export CLICKHOUSE_KEEPER_VERSION=25.10.1.6624
fi
export CLICKHOUSE_OPERATOR_VERSION=main-1.16067.1
export OPERATOR_HELM_VERSION=1.16067.1
export CLUSTER_HELM_VERSION=1.1.155

# AWS ECR Source (for copying images)
export SOURCE_ECR_REGION=us-east-1
export SOURCE_ECR_REPO=349290138304.dkr.ecr.${SOURCE_ECR_REGION}.amazonaws.com
export AWS_PROFILE=clickhouse-ecr

# Node Pool Configuration
export KEEPER_MACHINE_TYPE=n2-standard-4      # n2-standard-8 recommended for production
export SERVER_MACHINE_TYPE=n2-standard-8      # n2-standard-64 recommended for production
export DEFAULT_MACHINE_TYPE=n2-standard-4

# Resource Limits (adjust based on instance sizes)
export SERVER_CPU=4                           # Match to machine type
export SERVER_MEMORY=16Gi                     # Match to machine type
export KEEPER_CPU=2
export KEEPER_MEMORY=8Gi

# Cache Configuration
export CACHE_BYTES_PER_GI_RAM=11Gi

# FIPS Certificate Configuration (only used when ENABLE_FIPS=true)
if [ "$ENABLE_FIPS" = "true" ]; then
  export KUBERNETES_DOMAIN=cluster.local
  export CERT_DIR=./certs
  export SELF_SIGNED=true  # Set to false if using existing CA
fi

# ClickHouse Password
# For production/FIPS: use Secret Manager instead:
#   export CLICKHOUSE_PASSWORD=$(gcloud secrets versions access latest --secret=clickhouse-password --project=${GCP_PROJECT})
export CLICKHOUSE_PASSWORD='change-me-not-for-production'

echo "=========================================="
echo "Environment Variables Set"
echo "=========================================="
echo "GCP Project:     ${GCP_PROJECT}"
echo "GCP Region:      ${GCP_REGION}"
echo "GKE Cluster:     ${GKE_CLUSTER_NAME}"
echo "CH Cluster:      ${CLUSTER_NAME}"
echo "Namespace:       ${NAMESPACE}"
echo "VPC:             ${VPC_NAME}"
echo "Subnet:          ${SUBNET_NAME}"
echo "Bucket:          ${BUCKET_NAME}"
echo "GAR Host:        ${GAR_HOST}"
echo "FIPS Mode:       ${ENABLE_FIPS}"
echo "=========================================="
```

**Important:** Source this file before running other scripts:
```bash
source ./00-env.sh
```

---

## 01. Create Artifact Registry

**File: `01-artifact-registry.sh`**

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "01. Creating Artifact Registry"
echo "=========================================="

# Create repository
echo "Creating repository: ${GAR_REPO_NAME}..."
if gcloud artifacts repositories describe ${GAR_REPO_NAME} \
  --location=${GCP_REGION} \
  --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ Repository already exists"
else
  gcloud artifacts repositories create ${GAR_REPO_NAME} \
    --repository-format=docker \
    --location=${GCP_REGION} \
    --description="ClickHouse container images" \
    --project=${GCP_PROJECT}
  echo "   ✓ Repository created"
fi

# Configure Docker authentication
echo ""
echo "Configuring Docker authentication..."
gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev --quiet
echo "   ✓ Docker authentication configured"

echo ""
echo "=========================================="
echo "✅ Artifact Registry Setup Complete!"
echo "=========================================="
echo ""
echo "Repository URL: ${GAR_HOST}"
```

---

## 02. Copy Container Images

**File: `02-copy-images.sh`**

Requires [skopeo](https://github.com/containers/skopeo) to retain all architectures.

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "02. Copying ClickHouse Images"
echo "=========================================="

# Verify AWS profile exists
if ! aws configure list --profile ${AWS_PROFILE} &>/dev/null; then
  echo "ERROR: AWS profile '${AWS_PROFILE}' not found"
  echo "To create the profile, run: aws configure --profile ${AWS_PROFILE}"
  exit 1
fi

# Authenticate to source ECR
echo "Authenticating to AWS ECR..."
aws ecr get-login-password --region ${SOURCE_ECR_REGION} --profile ${AWS_PROFILE} | \
  skopeo login --username AWS --password-stdin ${SOURCE_ECR_REPO}
echo "✓ ECR authentication successful"

# Authenticate to GCP Artifact Registry
echo "Authenticating to GCP Artifact Registry..."
gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev --quiet
echo "✓ GAR authentication successful"

echo ""
echo "Copying images..."

echo "1/5 Copying ClickHouse Server ${CLICKHOUSE_SERVER_VERSION}..."
skopeo copy --all \
  docker://${SOURCE_ECR_REPO}/clickhouse-server:${CLICKHOUSE_SERVER_VERSION} \
  docker://${GAR_HOST}/clickhouse-server:${CLICKHOUSE_SERVER_VERSION}
echo "✓ Server copied"

echo "2/5 Copying ClickHouse Keeper ${CLICKHOUSE_KEEPER_VERSION}..."
skopeo copy --all \
  docker://${SOURCE_ECR_REPO}/clickhouse-keeper:${CLICKHOUSE_KEEPER_VERSION} \
  docker://${GAR_HOST}/clickhouse-keeper:${CLICKHOUSE_KEEPER_VERSION}
echo "✓ Keeper copied"

echo "3/5 Copying ClickHouse Operator ${CLICKHOUSE_OPERATOR_VERSION}..."
skopeo copy --all \
  docker://${SOURCE_ECR_REPO}/clickhouse-operator:${CLICKHOUSE_OPERATOR_VERSION} \
  docker://${GAR_HOST}/clickhouse-operator:${CLICKHOUSE_OPERATOR_VERSION}
echo "✓ Operator copied"

echo "4/5 Copying Operator Helm Chart ${OPERATOR_HELM_VERSION}..."
skopeo copy --all \
  docker://${SOURCE_ECR_REPO}/helm/clickhouse-operator-helm:${OPERATOR_HELM_VERSION} \
  docker://${GAR_HOST}/helm/clickhouse-operator-helm:${OPERATOR_HELM_VERSION}
echo "✓ Operator Helm chart copied"

echo "5/5 Copying Cluster Helm Chart ${CLUSTER_HELM_VERSION}..."
skopeo copy --all \
  docker://${SOURCE_ECR_REPO}/helm/onprem-clickhouse-cluster:${CLUSTER_HELM_VERSION} \
  docker://${GAR_HOST}/helm/onprem-clickhouse-cluster:${CLUSTER_HELM_VERSION}
echo "✓ Cluster Helm chart copied"

echo ""
echo "=========================================="
echo "✅ All images copied successfully!"
echo "=========================================="

# Verify
echo ""
echo "Verifying images in Artifact Registry..."
gcloud artifacts docker images list ${GAR_HOST} --format="table(package,version)"
```

---

## 03. Configure VPC and Subnet

**File: `03-vpc-subnet.sh`**

This script assumes you have an existing VPC with a bastion host. It creates or updates the GKE subnet with required secondary ranges.

**Important: CIDR Boundary Requirements**
- `/14` blocks: Third octet must be divisible by 4 (e.g., `10.244.0.0`, NOT `10.245.0.0`)
- `/20` blocks: Fourth octet must be 0, third octet on 16-boundary (e.g., `10.252.0.0`)

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "03. Configuring VPC and GKE Subnet"
echo "=========================================="

# Check if VPC exists
echo "Checking VPC: ${VPC_NAME}..."
if gcloud compute networks describe ${VPC_NAME} --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ VPC exists"
else
  echo "   Creating VPC..."
  gcloud compute networks create ${VPC_NAME} \
    --subnet-mode=custom \
    --project=${GCP_PROJECT}
  echo "   ✓ VPC created"
fi

# Check if GKE subnet exists
echo ""
echo "Checking GKE subnet: ${SUBNET_NAME}..."
if gcloud compute networks subnets describe ${SUBNET_NAME} --region=${GCP_REGION} --project=${GCP_PROJECT} &>/dev/null; then
  # Subnet exists - check for secondary ranges
  EXISTING_SECONDARY=$(gcloud compute networks subnets describe ${SUBNET_NAME} \
    --region=${GCP_REGION} \
    --project=${GCP_PROJECT} \
    --format="value(secondaryIpRanges.rangeName)" 2>/dev/null | grep -E "^pods$" || true)
  
  if [ -z "$EXISTING_SECONDARY" ]; then
    echo "   ⚠️ Subnet exists but missing secondary ranges"
    echo "   Adding secondary ranges for pods and services..."
    gcloud compute networks subnets update ${SUBNET_NAME} \
      --region=${GCP_REGION} \
      --add-secondary-ranges=pods=${POD_RANGE},services=${SERVICE_RANGE} \
      --project=${GCP_PROJECT}
    echo "   ✓ Secondary ranges added"
  else
    echo "   ✓ Subnet exists with secondary ranges"
  fi
else
  echo "   Creating GKE subnet..."
  gcloud compute networks subnets create ${SUBNET_NAME} \
    --network=${VPC_NAME} \
    --region=${GCP_REGION} \
    --range=${SUBNET_RANGE} \
    --secondary-range=pods=${POD_RANGE},services=${SERVICE_RANGE} \
    --enable-private-ip-google-access \
    --project=${GCP_PROJECT}
  echo "   ✓ Subnet created"
fi

# Enable Private Google Access
echo ""
echo "Ensuring Private Google Access is enabled..."
gcloud compute networks subnets update ${SUBNET_NAME} \
  --region=${GCP_REGION} \
  --enable-private-ip-google-access \
  --project=${GCP_PROJECT} 2>/dev/null || true
echo "   ✓ Private Google Access enabled"

echo ""
echo "=========================================="
echo "✅ VPC/Subnet Configuration Complete!"
echo "=========================================="
echo ""
echo "VPC:          ${VPC_NAME}"
echo "GKE Subnet:   ${SUBNET_NAME} (${SUBNET_RANGE})"
echo "Pods:         ${POD_RANGE}"
echo "Services:     ${SERVICE_RANGE}"
echo "Bastion:      ${BASTION_SUBNET_RANGE}"
```

---

## 04. Create Cloud NAT

**File: `04-cloud-nat.sh`**

Private GKE nodes require Cloud NAT for outbound internet access (pulling images, etc.).

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "04. Creating Cloud NAT for Private Nodes"
echo "=========================================="

# Create Cloud Router
echo "Creating Cloud Router..."
if gcloud compute routers describe clickhouse-router --region=${GCP_REGION} --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ Router already exists"
else
  gcloud compute routers create clickhouse-router \
    --network=${VPC_NAME} \
    --region=${GCP_REGION} \
    --project=${GCP_PROJECT}
  echo "   ✓ Router created"
fi

# Create Cloud NAT
echo ""
echo "Creating Cloud NAT..."
if gcloud compute routers nats describe clickhouse-nat --router=clickhouse-router --region=${GCP_REGION} --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ NAT already exists"
else
  gcloud compute routers nats create clickhouse-nat \
    --router=clickhouse-router \
    --region=${GCP_REGION} \
    --nat-all-subnet-ip-ranges \
    --auto-allocate-nat-external-ips \
    --enable-logging \
    --log-filter=ERRORS_ONLY \
    --project=${GCP_PROJECT}
  echo "   ✓ NAT created"
fi

echo ""
echo "=========================================="
echo "✅ Cloud NAT Setup Complete!"
echo "=========================================="
echo ""
echo "Router: clickhouse-router"
echo "NAT:    clickhouse-nat"
echo "Region: ${GCP_REGION}"
```

---

## 05. Create GCP Service Account

**File: `05-service-account.sh`**

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "05. Creating GCP Service Account"
echo "=========================================="

echo "Creating service account: ${GSA_NAME}..."
if gcloud iam service-accounts describe ${GSA_EMAIL} --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ Service account already exists"
else
  gcloud iam service-accounts create ${GSA_NAME} \
    --project=${GCP_PROJECT} \
    --display-name="ClickHouse Workload Identity Service Account"
  echo "   ✓ Service account created"
fi

echo ""
echo "=========================================="
echo "✅ Service Account Created!"
echo "=========================================="
echo ""
echo "Service Account: ${GSA_EMAIL}"
```

---

## 06. Create GCS Bucket

**File: `06-gcs-bucket.sh`**

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "06. Creating GCS Bucket"
echo "=========================================="

# Create bucket
echo "Creating GCS bucket: ${BUCKET_NAME}..."
if gcloud storage ls gs://${BUCKET_NAME}/ --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ Bucket already exists"
else
  gcloud storage buckets create gs://${BUCKET_NAME} \
    --project=${GCP_PROJECT} \
    --default-storage-class=STANDARD \
    --location=${GCP_REGION} \
    --uniform-bucket-level-access
  echo "   ✓ Bucket created"
fi

# Enable uniform bucket-level access
echo ""
echo "Enabling uniform bucket-level access..."
gcloud storage buckets update gs://${BUCKET_NAME} --uniform-bucket-level-access
echo "   ✓ Uniform access enabled"

# Grant permissions to service account
echo ""
echo "Granting permissions to service account..."
gcloud storage buckets add-iam-policy-binding gs://${BUCKET_NAME} --member=serviceAccount:${GSA_EMAIL} --role=roles/storage.objectAdmin
gcloud storage buckets add-iam-policy-binding gs://${BUCKET_NAME} --member=serviceAccount:${GSA_EMAIL} --role=roles/storage.legacyBucketReader
echo "   ✓ Permissions granted"

echo ""
echo "=========================================="
echo "✅ GCS Bucket Setup Complete!"
echo "=========================================="
echo ""
echo "Bucket:   ${BUCKET_NAME}"
echo "Region:   ${GCP_REGION}"
echo "Endpoint: https://storage.googleapis.com"
```

---

## 07. Create GKE Cluster

**File: `07-gke-cluster.sh`**

Creates a **fully private GKE cluster** for FedRAMP compliance:
- Worker nodes have only internal IPs
- Control plane has **only a private endpoint**
- All access must come from within the VPC (via bastion)

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "07. Creating Private GKE Cluster"
echo "=========================================="

echo "Creating cluster: ${GKE_CLUSTER_NAME}..."
if gcloud container clusters describe ${GKE_CLUSTER_NAME} --region=${GCP_REGION} --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ Cluster already exists"
else
  gcloud container clusters create ${GKE_CLUSTER_NAME} \
    --region=${GCP_REGION} \
    --node-locations=${GCP_ZONES} \
    --network=${VPC_NAME} \
    --subnetwork=${SUBNET_NAME} \
    --cluster-secondary-range-name=pods \
    --services-secondary-range-name=services \
    --enable-ip-alias \
    --enable-private-nodes \
    --enable-private-endpoint \
    --master-ipv4-cidr=${MASTER_IPV4_CIDR} \
    --enable-master-authorized-networks \
    --master-authorized-networks=${SUBNET_RANGE},${BASTION_SUBNET_RANGE} \
    --workload-pool=${GCP_PROJECT}.svc.id.goog \
    --num-nodes=1 \
    --machine-type=${DEFAULT_MACHINE_TYPE} \
    --disk-type=pd-standard \
    --disk-size=50 \
    --project=${GCP_PROJECT}
  echo "   ✓ Cluster created"
fi

# Get credentials (must be run from within VPC / bastion)
echo ""
echo "Getting cluster credentials..."
gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} \
  --region=${GCP_REGION} \
  --internal-ip \
  --project=${GCP_PROJECT}
echo "   ✓ Credentials configured"

# Verify access
echo ""
echo "Verifying cluster access..."
kubectl get nodes

echo ""
echo "=========================================="
echo "✅ Private GKE Cluster Ready!"
echo "=========================================="
echo ""
echo "Cluster:     ${GKE_CLUSTER_NAME}"
echo "Region:      ${GCP_REGION}"
echo "Master CIDR: ${MASTER_IPV4_CIDR}"
echo ""
echo "Private cluster settings:"
echo "  - Nodes have internal IPs only"
echo "  - Control plane has NO public endpoint"
echo "  - kubectl requires bastion access"
```

**Private Cluster Settings:**

| Setting | Value | Purpose |
|---------|-------|---------|
| `--enable-private-nodes` | Required | Nodes get internal IPs only |
| `--enable-private-endpoint` | Required | Control plane has no public IP (FedRAMP) |
| `--master-ipv4-cidr` | `172.16.0.0/28` | Control plane IP range |
| `--enable-master-authorized-networks` | Required | Enable network restrictions |
| `--master-authorized-networks` | GKE + Bastion subnets | CIDRs allowed to access control plane |

### Accessing the Private Cluster

With `--enable-private-endpoint`, the cluster API is **only accessible from within the VPC**.

**From the Bastion Host:**

```bash
# Get cluster credentials
gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} \
  --region=${GCP_REGION} \
  --internal-ip \
  --project=${GCP_PROJECT}

# Verify access
kubectl get nodes
```

---

## 08. Create Node Pools

**File: `08-node-pools.sh`**

| Node Pool | Machine Type | Disk | Labels | Taints |
|-----------|--------------|------|--------|--------|
| Keeper | n2-standard-4 (dev) / n2-standard-8 (prod) | 20GB pd-ssd | `clickhouseGroup=keeper` | `clickhouse.com/do-not-schedule:NoSchedule` |
| Server | n2-standard-8 (dev) / n2-standard-64 (prod) | 20GB pd-standard + local SSD | `clickhouseGroup=server` | `clickhouse.com/do-not-schedule:NoSchedule` |

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "08. Creating Node Pools"
echo "=========================================="

# Keeper Node Pool
echo "Creating Keeper node pool..."
if gcloud container node-pools describe keeper-pool --cluster=${GKE_CLUSTER_NAME} --region=${GCP_REGION} --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ Keeper pool already exists"
else
  gcloud container node-pools create keeper-pool \
    --cluster=${GKE_CLUSTER_NAME} \
    --region=${GCP_REGION} \
    --node-locations=${GCP_ZONES} \
    --machine-type=${KEEPER_MACHINE_TYPE} \
    --disk-type=pd-ssd \
    --disk-size=20 \
    --num-nodes=1 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=3 \
    --workload-metadata=GKE_METADATA \
    --node-labels=clickhouseGroup=keeper \
    --node-taints=clickhouse.com/do-not-schedule=true:NoSchedule \
    --project=${GCP_PROJECT}
  echo "   ✓ Keeper pool created"
fi

# Server Node Pool (with Local SSD)
# NOTE: GKE does not allow --metadata-from-file=startup-script on node pools
# (reserved key). Local SSD formatting/mounting is handled by the DaemonSet in Step 10.
echo ""
echo "Creating Server node pool..."
if gcloud container node-pools describe server-pool --cluster=${GKE_CLUSTER_NAME} --region=${GCP_REGION} --project=${GCP_PROJECT} &>/dev/null; then
  echo "   ✓ Server pool already exists"
else
  gcloud container node-pools create server-pool \
    --cluster=${GKE_CLUSTER_NAME} \
    --region=${GCP_REGION} \
    --node-locations=${GCP_ZONES} \
    --machine-type=${SERVER_MACHINE_TYPE} \
    --local-ssd-count=1 \
    --disk-type=pd-standard \
    --disk-size=20 \
    --num-nodes=1 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=10 \
    --workload-metadata=GKE_METADATA \
    --node-labels=clickhouseGroup=server \
    --node-taints=clickhouse.com/do-not-schedule=true:NoSchedule \
    --project=${GCP_PROJECT}
  echo "   ✓ Server pool created"
fi

echo ""
echo "=========================================="
echo "✅ Node Pools Created!"
echo "=========================================="
kubectl get nodes -L clickhouseGroup
```

---

## 09. Local SSD DaemonSet

**File: `09-local-ssd-daemonset.sh`**

GKE Container-Optimized OS (COS) has a read-only root filesystem, so we cannot create `/nvme`. Instead, we mount the local SSD at `/mnt/disks/ssd0` and configure ClickHouse to use that path.

**Note:** GKE does not allow `--metadata-from-file=startup-script` on node pools (reserved key), so a DaemonSet is required to format and mount the local SSD.

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "09. Deploying Local SSD DaemonSet"
echo "=========================================="

kubectl apply -f - <<'EOF'
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: local-ssd-setup
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: local-ssd-setup
  template:
    metadata:
      labels:
        app: local-ssd-setup
    spec:
      hostPID: true
      nodeSelector:
        clickhouseGroup: server
      tolerations:
      - key: "clickhouse.com/do-not-schedule"
        operator: "Exists"
        effect: "NoSchedule"
      initContainers:
      - name: setup-ssd
        image: busybox:1.36
        command:
        - /bin/sh
        - -c
        - |
          set -e
          
          # Use nsenter to run commands on the host
          nsenter -t 1 -m -- /bin/sh -c '
            # Find local SSD device
            if [ -b /dev/disk/by-id/google-local-nvme-ssd-0 ]; then
              DEV=/dev/disk/by-id/google-local-nvme-ssd-0
            elif [ -b /dev/disk/by-id/google-local-ssd-0 ]; then
              DEV=/dev/disk/by-id/google-local-ssd-0
            else
              echo "No local SSD found"
              exit 0
            fi
            
            mkdir -p /mnt/disks/ssd0
            
            # Format if needed
            if ! blkid $DEV 2>/dev/null | grep -q ext4; then
              echo "Formatting $DEV..."
              mkfs.ext4 -F $DEV
            fi
            
            # Mount if needed
            if ! mountpoint -q /mnt/disks/ssd0; then
              echo "Mounting $DEV to /mnt/disks/ssd0..."
              mount $DEV /mnt/disks/ssd0
            fi
            chmod 755 /mnt/disks/ssd0
            
            echo "Local SSD ready at /mnt/disks/ssd0"
            df -h /mnt/disks/ssd0
          '
        securityContext:
          privileged: true
      containers:
      - name: pause
        image: gcr.io/google-containers/pause:3.2
EOF

echo ""
echo "Waiting for DaemonSet to be ready..."
sleep 15
kubectl get ds -n kube-system local-ssd-setup
kubectl get pods -n kube-system -l app=local-ssd-setup
kubectl logs -n kube-system -l app=local-ssd-setup -c setup-ssd

echo ""
echo "=========================================="
echo "✓ Local SSD DaemonSet Deployed!"
echo "=========================================="
echo ""
echo "IMPORTANT: The SSD is mounted at /mnt/disks/ssd0"
echo "You must configure ClickHouse to use this path"
echo "instead of /nvme/disk (GKE COS has read-only root)"
```

**Important Notes:**
- GKE Container-Optimized OS has a **read-only root filesystem** - cannot create `/nvme`
- Local SSD is mounted at `/mnt/disks/ssd0`
- Uses `busybox:1.36` image (no internet required for apt-get)
- Uses `nsenter` to run commands on the host filesystem
- DaemonSet must be deployed **before** the ClickHouse cluster to avoid race conditions

---

## 10. Add Topology Labels

**File: `10-topology-labels.sh`**

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "10. Adding Topology Labels to Nodes"
echo "=========================================="

# Label keeper nodes
echo "Labeling keeper nodes..."
for node in $(kubectl get nodes -l clickhouseGroup=keeper -o name); do
  kubectl label $node topologyZone=c-${CLUSTER_NAME}-keeper --overwrite
  echo "   ✓ Labeled: $node"
done

# Label server nodes
echo ""
echo "Labeling server nodes..."
for node in $(kubectl get nodes -l clickhouseGroup=server -o name); do
  kubectl label $node topologyZone=c-${CLUSTER_NAME}-server --overwrite
  echo "   ✓ Labeled: $node"
done

echo ""
echo "=========================================="
echo "✅ Topology Labels Applied!"
echo "=========================================="
kubectl get nodes -L clickhouseGroup,topologyZone
```

---

## 11. Install VolumeSnapshot CRDs

**File: `11-volumesnapshot-crds.sh`**

```bash
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "11. Installing VolumeSnapshot CRDs"
echo "=========================================="

kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml

echo ""
echo "=========================================="
echo "✅ VolumeSnapshot CRDs Installed!"
echo "=========================================="
```

---

## 12. Workload Identity Setup

**File: `12-workload-identity.sh`**

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "12. Setting Up Workload Identity"
echo "=========================================="

# Create namespace
echo "Creating namespace: ${NAMESPACE}..."
kubectl create namespace ${NAMESPACE} 2>/dev/null || echo "   Namespace exists"

# Create Kubernetes Service Account
echo ""
echo "Creating Kubernetes Service Account..."
kubectl create serviceaccount ${KSA_NAME} -n ${NAMESPACE} 2>/dev/null || echo "   KSA exists"

# Annotate KSA with GSA email
kubectl annotate serviceaccount ${KSA_NAME} \
  -n ${NAMESPACE} \
  iam.gke.io/gcp-service-account=${GSA_EMAIL} \
  --overwrite
echo "   ✓ KSA annotated"

# Bind Workload Identity
echo ""
echo "Binding Workload Identity..."
gcloud iam service-accounts add-iam-policy-binding ${GSA_EMAIL} \
  --project=${GCP_PROJECT} \
  --role=roles/iam.workloadIdentityUser \
  --member="serviceAccount:${GCP_PROJECT}.svc.id.goog[${NAMESPACE}/${KSA_NAME}]" \
  --quiet
echo "   ✓ Workload Identity bound for ${KSA_NAME}"

# Also bind the 'default' ServiceAccount
echo ""
echo "Binding 'default' ServiceAccount..."
kubectl annotate serviceaccount default \
  -n ${NAMESPACE} \
  iam.gke.io/gcp-service-account=${GSA_EMAIL} \
  --overwrite

gcloud iam service-accounts add-iam-policy-binding ${GSA_EMAIL} \
  --project=${GCP_PROJECT} \
  --role=roles/iam.workloadIdentityUser \
  --member="serviceAccount:${GCP_PROJECT}.svc.id.goog[${NAMESPACE}/default]" \
  --quiet
echo "   ✓ Workload Identity bound for default"

# Grant Artifact Registry read access
echo ""
echo "Granting Artifact Registry access..."
gcloud artifacts repositories add-iam-policy-binding ${GAR_REPO_NAME} \
  --location=${GCP_REGION} \
  --member="serviceAccount:${GSA_EMAIL}" \
  --role="roles/artifactregistry.reader" \
  --project=${GCP_PROJECT} --quiet
echo "   ✓ Artifact Registry access granted"

echo ""
echo "=========================================="
echo "✅ Workload Identity Setup Complete!"
echo "=========================================="
echo ""
echo "GCP SA:       ${GSA_EMAIL}"
echo "K8s SA:       ${KSA_NAME}"
echo "Namespace:    ${NAMESPACE}"
```

**Workload Identity Alignment:**

| Component | Value |
|-----------|-------|
| GCP Service Account | `clickhouse@$PROJECT.iam.gserviceaccount.com` |
| K8s ServiceAccount (manual) | `clickhouse` in namespace `ns-$CLUSTER_NAME` |
| K8s ServiceAccount (helm-created) | `ch-$CLUSTER_NAME-sa` in namespace `ns-$CLUSTER_NAME` |
| K8s SA annotation | `iam.gke.io/gcp-service-account=<GSA_EMAIL>` |
| IAM binding member | `serviceAccount:$PROJECT.svc.id.goog[<namespace>/<ksa>]` |

---

## 13. Install StorageClass

**File: `13-storageclass.sh`** (Optional)

**Note:** GKE uses `topology.gke.io/zone` instead of `topology.kubernetes.io/zone`.

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "13. Installing StorageClass"
echo "=========================================="

# Authenticate to Helm registry (no https:// prefix)
gcloud auth print-access-token | helm registry login \
  -u oauth2accesstoken \
  --password-stdin \
  ${GCP_REGION}-docker.pkg.dev

# Convert zones to JSON array
ZONES_ARRAY=$(echo ${GCP_ZONES} | tr ',' '\n' | sed 's/.*/"&"/' | tr '\n' ',' | sed 's/,$//')

helm install clickhouse-prerequisites \
    oci://${GAR_HOST}/helm/onprem-clickhouse-cluster \
    --version=${CLUSTER_HELM_VERSION} \
    -n default \
    --set-json="storageClass.create=true" \
    --set-json="storageClass.provisioner=\"pd.csi.storage.gke.io\"" \
    --set-json="storageClass.parameters.type=\"pd-ssd\"" \
    --set-json="storageClass.allowedTopologies[0].matchLabelExpressions[0].key=\"topology.gke.io/zone\"" \
    --set-json="storageClass.allowedTopologies[0].matchLabelExpressions[0].values=[${ZONES_ARRAY}]" \
    --set-json="createCluster=false" \
    --set-json="serviceAccount.create=false"

# The helm chart bundles an AWS gp3-encrypted StorageClass by default — remove it
kubectl delete storageclass gp3-encrypted --ignore-not-found

echo ""
echo "=========================================="
echo "✅ StorageClass Installed!"
echo "=========================================="
kubectl get storageclass
```

---

## 14. Create FIPS Certificates (FIPS only)

**File: `14-create-fips-certs.sh`** — Skip this step if `ENABLE_FIPS=false`.

FIPS-compliant certificates must be generated using FIPS-approved algorithms in a FIPS-enabled environment. This script runs a Red Hat UBI8 pod on the GKE cluster with FIPS crypto policy enabled, then copies the generated certificates back to the bastion via `kubectl cp`.

**Requirements:**
- RSA 3072-bit minimum key size
- SHA-256 or higher signature algorithm
- Subject Alternative Names (SANs) must include cluster DNS names
- `kubectl` access to the GKE cluster (no `docker` required)

**Certificate Types:**

| Certificate | Files | Purpose | SANs Required |
|-------------|-------|---------|---------------|
| CA | `ca/ca.crt`, `ca/ca.key` | Certificate authority | N/A |
| Server | `server/server.crt`, `server/server.key` | Connections to clickhouse-server | `*.c-${CLUSTER_NAME}-server-headless.ns-${CLUSTER_NAME}.svc.${KUBERNETES_DOMAIN}` |
| Client | `client/client.crt`, `client/client.key` | Connections from clickhouse-server | None required |
| Keeper | `keeper/keeper.crt`, `keeper/keeper.key` | Connections to clickhouse-keeper | `*.c-${CLUSTER_NAME}-keeper-headless.ns-${CLUSTER_NAME}.svc.${KUBERNETES_DOMAIN}` |

The script performs these steps:
1. Creates a ConfigMap with the cert generation script
2. Runs a UBI8 pod with an initContainer that installs OpenSSL, sets FIPS crypto policy via `update-crypto-policies --set FIPS`, and generates all certificates
3. Copies the certificates back to the bastion via `kubectl cp`
4. Cleans up the pod and ConfigMap

See [fips/14-create-fips-certs.sh](fips/14-create-fips-certs.sh) for the full script.

**Important Notes:**
- Certificates expire after 365 days by default — adjust `CERT_VALIDITY` as needed
- CA certificate expires after 3650 days (10 years)
- Uses RSA 3072-bit keys (FIPS-compliant minimum)
- Keep private keys (`*.key` files) secure and never commit to version control

---

## 15. Create Certificate Secrets (FIPS only)

**File: `15-create-cert-secrets.sh`** — Skip this step if `ENABLE_FIPS=false`.

Create Kubernetes secrets containing the FIPS-compliant certificates. Secrets must be in the same namespace as the ClickHouse cluster.

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "15. Creating Certificate Secrets"
echo "=========================================="

# Create namespace if it doesn't exist
kubectl create namespace ${NAMESPACE} 2>/dev/null || echo "   Namespace exists"

# Create server certificate secret
echo ""
echo "Creating server certificate secret..."
kubectl create secret generic -n ${NAMESPACE} ${CLUSTER_NAME}-server-cert-secret \
  --from-file=ca.crt="${CERT_DIR}/ca/ca.crt" \
  --from-file=server.crt="${CERT_DIR}/server/server.crt" \
  --from-file=server.key="${CERT_DIR}/server/server.key" \
  --from-file=client.crt="${CERT_DIR}/client/client.crt" \
  --from-file=client.key="${CERT_DIR}/client/client.key" \
  --dry-run=client -o yaml | kubectl apply -f -
echo "   ✓ Server certificate secret created"

# Create keeper certificate secret
echo ""
echo "Creating keeper certificate secret..."
kubectl create secret generic -n ${NAMESPACE} ${CLUSTER_NAME}-keeper-cert-secret \
  --from-file=ca.crt="${CERT_DIR}/ca/ca.crt" \
  --from-file=keeper.crt="${CERT_DIR}/keeper/keeper.crt" \
  --from-file=keeper.key="${CERT_DIR}/keeper/keeper.key" \
  --dry-run=client -o yaml | kubectl apply -f -
echo "   ✓ Keeper certificate secret created"

echo ""
echo "=========================================="
echo "✅ Certificate Secrets Created!"
echo "=========================================="
```

**Secret Structure:**

| Secret Name | Keys | Purpose |
|-------------|------|---------|
| `${CLUSTER_NAME}-server-cert-secret` | `ca.crt`, `server.crt`, `server.key`, `client.crt`, `client.key` | Server TLS and outbound client connections |
| `${CLUSTER_NAME}-keeper-cert-secret` | `ca.crt`, `keeper.crt`, `keeper.key` | Keeper TLS |

---

## 16. Install Operator

**File: `16-install-operator.sh`**

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "16. Installing ClickHouse Operator"
echo "=========================================="

# Authenticate to Helm registry (no https:// prefix)
gcloud auth print-access-token | helm registry login \
  -u oauth2accesstoken \
  --password-stdin \
  ${GCP_REGION}-docker.pkg.dev

# Convert zones to JSON array
ZONES_ARRAY=$(echo ${GCP_ZONES} | tr ',' '\n' | sed 's/.*/"&"/' | tr '\n' ',' | sed 's/,$//')

helm install clickhouse-operator \
   oci://${GAR_HOST}/helm/clickhouse-operator-helm \
   --version=${OPERATOR_HELM_VERSION} \
   --create-namespace \
   -n clickhouse-operator-system \
   --set-json="image.repository=\"${GAR_HOST}/clickhouse-operator\"" \
   --set-json="image.tag=\"${CLICKHOUSE_OPERATOR_VERSION}\"" \
   --set-json='cilium.enabled=false' \
   --set-json='idleScalerEnabled=false' \
   --set-json='webhooks.enabled=false' \
   --set-json='operator.debug=true' \
   --set-json='operator.metricsScraper.enabled=false' \
   --set-json="operator.availabilityZones=[${ZONES_ARRAY}]" \
   --set-json='operator.featureFlags.backupOnASeparatePod=true' \
   --set-json='operator.featureFlags.serverCMEKEnabled=true' \
   --set-json='storageClass.create=false'

echo ""
echo "Waiting for operator to be ready..."
kubectl wait --for=condition=ready pod \
  -l app=clickhouse-operator \
  -n clickhouse-operator-system \
  --timeout=300s

echo ""
echo "=========================================="
echo "✅ Operator Installation Complete!"
echo "=========================================="
kubectl get pods -n clickhouse-operator-system
```

---

## 17. Install ClickHouse Cluster

**File: `17-install-cluster.sh`**

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "17. Installing ClickHouse Cluster"
echo "=========================================="

# Generate password hash
if command -v sha256sum &> /dev/null; then
  HASHED_PASSWORD=$(echo -n "${CLICKHOUSE_PASSWORD}" | sha256sum | awk '{printf $1}' | base64 | tr -d '\n')
else
  HASHED_PASSWORD=$(echo -n "${CLICKHOUSE_PASSWORD}" | shasum -a 256 | awk '{printf $1}' | base64 | tr -d '\n')
fi

echo "Cluster Configuration:"
echo "  Name:      ${CLUSTER_NAME}"
echo "  Namespace: ${NAMESPACE}"
echo "  Bucket:    gs://${BUCKET_NAME}"
echo "  Prefix:    ${S3_KEY_PREFIX}"
echo ""

# Build FIPS flags if enabled
FIPS_FLAGS=()
if [ "$ENABLE_FIPS" = "true" ]; then
  FIPS_FLAGS=(
    --set-json='server.openSSL.enabled=true'
    --set-json='server.openSSL.required=true'
    --set-json="server.openSSL.selfSigned=${SELF_SIGNED}"
    --set-json='keeper.openSSL.enabled=true'
    --set-json='keeper.openSSL.required=true'
    --set-json="keeper.openSSL.selfSigned=${SELF_SIGNED}"
  )
  echo "FIPS OpenSSL flags: ${#FIPS_FLAGS[@]} flags added"
fi

# Authenticate to Helm registry (no https:// prefix)
gcloud auth print-access-token | helm registry login \
  -u oauth2accesstoken \
  --password-stdin \
  ${GCP_REGION}-docker.pkg.dev

helm install ${CLUSTER_NAME} \
    oci://${GAR_HOST}/helm/onprem-clickhouse-cluster \
    --version=${CLUSTER_HELM_VERSION} \
    -n ${NAMESPACE} \
    --create-namespace \
    --set-json="storageClass.create=false" \
    --set-json="storageClass.name=\"premium-rwo\"" \
    --set-json="account.hashedPassword=\"${HASHED_PASSWORD}\"" \
    \
    --set-json="server.image.repository=\"${GAR_HOST}/clickhouse-server\"" \
    --set-json="server.image.tag=\"${CLICKHOUSE_SERVER_VERSION}\"" \
    --set-json="server.storage.s3.endpoint=\"https://storage.googleapis.com\"" \
    --set-json="server.storage.s3.bucketName=\"${BUCKET_NAME}\"" \
    --set-json="server.storage.s3.keyPrefix=\"${S3_KEY_PREFIX}\"" \
    --set-json="server.storage.s3.region=\"auto\"" \
    --set-json="server.storage.s3.useEnvironmentCredentials=true" \
    --set-json="server.storage.storageClassName=\"premium-rwo\"" \
    \
    --set-json="server.config.storage_configuration.disks.diskPlainRewritableForSystemTables.http_client=\"gcp_oauth\"" \
    --set-json="server.config.storage_configuration.disks.s3WithKeeperSystemDisk.http_client=\"gcp_oauth\"" \
    --set-json="server.config.storage_configuration.disks.s3WithKeeperSystemDisk.path=\"/var/lib/clickhouse/disks/s3_with_keeper_system/\"" \
    --set-json="server.config.storage_configuration.disks.s3disk.http_client=\"gcp_oauth\"" \
    --set-json="server.config.storage_configuration.disks.s3WithKeeperDisk.http_client=\"gcp_oauth\"" \
    \
    "${FIPS_FLAGS[@]}" \
    \
    --set-json="server.ssdCacheConfiguration.bytesPerGiRAM=\"${CACHE_BYTES_PER_GI_RAM}\"" \
    --set-json="server.ssdCacheConfiguration.hostPathBaseDirectory=\"/mnt/disks/ssd0/\"" \
    \
    --set-json="server.podPolicy.nodeSelector.clickhouseGroup=\"server\"" \
    --set-json="server.podPolicy.resources.limits.cpu=\"${SERVER_CPU}\"" \
    --set-json="server.podPolicy.resources.limits.memory=\"${SERVER_MEMORY}\"" \
    --set-json="server.podPolicy.resources.requests.cpu=\"${SERVER_CPU}\"" \
    --set-json="server.podPolicy.resources.requests.memory=\"${SERVER_MEMORY}\"" \
    --set-json='server.tolerations=[{"effect":"NoSchedule","key":"clickhouse.com/do-not-schedule","operator":"Exists"}]' \
    \
    --set-json="keeper.image.repository=\"${GAR_HOST}/clickhouse-keeper\"" \
    --set-json="keeper.image.tag=\"${CLICKHOUSE_KEEPER_VERSION}\"" \
    --set-json="keeper.storage.s3.endpoint=\"https://storage.googleapis.com\"" \
    --set-json="keeper.storage.s3.bucketName=\"${BUCKET_NAME}\"" \
    --set-json="keeper.storage.s3.keyPrefix=\"${S3_KEY_PREFIX}\"" \
    --set-json="keeper.storage.s3.region=\"auto\"" \
    --set-json="keeper.storage.s3.useEnvironmentCredentials=true" \
    --set-json="keeper.storage.storageClassName=\"premium-rwo\"" \
    \
    --set-json="keeper.config.storage_configuration.disks.s3_keeper_log_disk.http_client=\"gcp_oauth\"" \
    --set-json="keeper.config.storage_configuration.disks.s3_keeper_snapshot_disk.http_client=\"gcp_oauth\"" \
    \
    --set-json="keeper.podPolicy.nodeSelector.clickhouseGroup=\"keeper\"" \
    --set-json="keeper.podPolicy.resources.limits.cpu=\"${KEEPER_CPU}\"" \
    --set-json="keeper.podPolicy.resources.limits.memory=\"${KEEPER_MEMORY}\"" \
    --set-json="keeper.podPolicy.resources.requests.cpu=\"${KEEPER_CPU}\"" \
    --set-json="keeper.podPolicy.resources.requests.memory=\"${KEEPER_MEMORY}\"" \
    --set-json='keeper.tolerations=[{"effect":"NoSchedule","key":"clickhouse.com/do-not-schedule","operator":"Exists"}]'

echo ""
echo "=========================================="
echo "✅ ClickHouse Cluster Deployment Complete!"
echo "=========================================="
echo ""
echo "The operator automatically configured SSD cache volumes."
echo ""
echo "⚠️  Next step: Run ./18-bind-helm-workload-identity.sh"
echo "   Pods will fail to access GCS until Workload Identity is bound."
echo ""
echo "Monitor pods:"
echo "  kubectl get pods -n ${NAMESPACE} -w"
echo ""
echo "Verify SSD cache is mounted:"
echo "  kubectl exec -n ${NAMESPACE} \$(kubectl get pods -n ${NAMESPACE} -l clickhouseGroup=server -o name | head -1) -- df -h | grep cache"
```

**Important GCP-specific settings:**
- `storageClass.create=false`: Don't create AWS StorageClass
- `storageClass.name="premium-rwo"`: Use GCP's built-in SSD StorageClass
- `server.storage.s3.endpoint`: `https://storage.googleapis.com` for GCS S3-compatible API
- `server.storage.s3.useEnvironmentCredentials=true`: Required for Workload Identity
- `keeper.storage.s3.useEnvironmentCredentials=true`: **Must also be set for keeper!**

**(FIPS) OpenSSL settings** (automatically included when `ENABLE_FIPS=true`):

| Setting | Value | Purpose |
|---------|-------|---------|
| `server.openSSL.enabled` | `true` | Enable TLS on server |
| `server.openSSL.required` | `true` | Reject non-TLS connections |
| `server.openSSL.selfSigned` | `true`/`false` | Self-signed or CA-signed certs |
| `keeper.openSSL.enabled` | `true` | Enable TLS on keeper |
| `keeper.openSSL.required` | `true` | Reject non-TLS connections on keeper |

---

## 18. Bind Workload Identity to Helm SA

**File: `18-bind-helm-workload-identity.sh`**

The helm chart creates its own service account (`ch-${CLUSTER_NAME}-sa`). You must bind Workload Identity to this SA for GCS access.

**Important:** The keeper and server pods created during step 17 start _before_ this Workload Identity binding exists, so they will fail with GCS 403 Access Denied errors. This script automatically restarts the pods after binding so they pick up the new credentials.

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "18. Binding Workload Identity to Helm SA"
echo "=========================================="

# Wait for Helm SA to be created
echo "Waiting for Helm service account to be created..."
timeout=300
elapsed=0
while ! kubectl get serviceaccount ch-${CLUSTER_NAME}-sa -n ${NAMESPACE} &>/dev/null; do
  if [ $elapsed -ge $timeout ]; then
    echo "ERROR: Timeout waiting for Helm service account"
    exit 1
  fi
  sleep 5
  elapsed=$((elapsed + 5))
  echo "  Waiting... (${elapsed}s)"
done
echo "   ✓ Helm service account found"

# Annotate the helm-created SA
echo ""
echo "Annotating Helm service account..."
kubectl annotate serviceaccount ch-${CLUSTER_NAME}-sa \
  -n ${NAMESPACE} \
  iam.gke.io/gcp-service-account=${GSA_EMAIL} \
  --overwrite
echo "   ✓ Service account annotated"

# Bind Workload Identity
echo ""
echo "Binding Workload Identity..."
gcloud iam service-accounts add-iam-policy-binding ${GSA_EMAIL} \
  --project=${GCP_PROJECT} \
  --role=roles/iam.workloadIdentityUser \
  --member="serviceAccount:${GCP_PROJECT}.svc.id.goog[${NAMESPACE}/ch-${CLUSTER_NAME}-sa]" \
  --quiet
echo "   ✓ Workload Identity bound"

echo ""
echo "Verifying annotation..."
kubectl get sa ch-${CLUSTER_NAME}-sa -n ${NAMESPACE} -o yaml | grep -A3 annotations

# Restart pods so they pick up the new Workload Identity credentials.
# Pods created during step 17 started before the binding existed, so they
# do not have GCP credentials and will fail with 403 on GCS.
echo ""
echo "Restarting keeper and server pods to pick up Workload Identity..."
kubectl delete pods -n ${NAMESPACE} -l clickhouseGroup=keeper --wait=false 2>/dev/null || true
kubectl delete pods -n ${NAMESPACE} -l clickhouseGroup=server --wait=false 2>/dev/null || true
echo "   ✓ Pods restarting"

echo ""
echo "Waiting for keeper pods to be ready..."
kubectl wait --for=condition=ready pod \
  -l clickhouseGroup=keeper \
  -n ${NAMESPACE} \
  --timeout=600s
echo "   ✓ Keeper pods ready"

echo ""
echo "Waiting for server pods to be created..."
echo "   (The operator creates servers after keepers are healthy)"
timeout=600
elapsed=0
while ! kubectl get pods -n ${NAMESPACE} -l clickhouseGroup=server -o name 2>/dev/null | grep -q .; do
  if [ $elapsed -ge $timeout ]; then
    echo "ERROR: Timeout waiting for server pods to be created"
    echo "  kubectl get pods -n ${NAMESPACE}"
    exit 1
  fi
  sleep 10
  elapsed=$((elapsed + 10))
  echo "  Waiting for server pods... (${elapsed}s)"
done

echo "Waiting for server pods to be ready..."
kubectl wait --for=condition=ready pod \
  -l clickhouseGroup=server \
  -n ${NAMESPACE} \
  --timeout=600s
echo "   ✓ Server pods ready"

echo ""
echo "=========================================="
echo "✅ Workload Identity bound to Helm SA!"
echo "=========================================="
echo ""
kubectl get pods -n ${NAMESPACE}
```

---

## 19. Verify Installation

**Standard mode** (no TLS):

```bash
# Port-forward the ClickHouse native port
kubectl port-forward svc/c-${CLUSTER_NAME}-server-any 9000:9000 -n ${NAMESPACE} &

# Connect with clickhouse-client
clickhouse client --host localhost --port 9000 --password "${CLICKHOUSE_PASSWORD}"
```

**(FIPS) TLS mode** — With `openSSL.required=true`, ClickHouse only accepts connections on secure ports. Use port **9440** (native TLS) instead of 9000:

```bash
# Port-forward the ClickHouse secure native port
kubectl port-forward svc/c-${CLUSTER_NAME}-server-any 9440:9440 -n ${NAMESPACE} &

# Connect with self-signed certs
clickhouse client --host localhost --port 9440 \
  --password "${CLICKHOUSE_PASSWORD}" \
  --secure \
  --accept-invalid-certificate
```

The `--accept-invalid-certificate` flag is needed because we use self-signed certificates. For production with proper CA-signed certs, specify the CA certificate explicitly:

```bash
clickhouse client --host localhost --port 9440 \
  --password "${CLICKHOUSE_PASSWORD}" \
  --secure \
  --config-file <(cat <<'EOF'
<config>
    <openSSL>
        <client>
            <caConfig>./certs/ca/ca.crt</caConfig>
        </client>
    </openSSL>
</config>
EOF
)
```

**Run a test query:**

```sql
SELECT 1;
```

Expected output:

```
   ┌─1─┐
1. │ 1 │
   └───┘
1 row in set. Elapsed: 0.001 sec.
```

**Important (FIPS):** Port 9000 (plaintext native) and 8123 (plaintext HTTP) will refuse connections when `openSSL.required=true`. Use port 9440 (native TLS) or 8443 (HTTPS) instead.

---

## Appendix: AWS to GCP Component Mapping

| AWS Component | GCP Equivalent | Key Differences |
|---------------|----------------|-----------------|
| ECR | Artifact Registry | Use `gcloud auth configure-docker` |
| S3 | GCS with S3 API | Endpoint: `https://storage.googleapis.com` |
| IAM Role (IRSA) | Workload Identity | Annotate KSA with `iam.gke.io/gcp-service-account` |
| HMAC Keys | Workload Identity | Use `useEnvironmentCredentials=true` |
| EBS CSI Driver | GCE PD CSI Driver | Pre-installed, provisioner: `pd.csi.storage.gke.io` |
| Availability Zones | GKE Zones | Topology key: `topology.gke.io/zone` |
| NLB | GCP Load Balancer | Use `type: LoadBalancer` annotation |

---

## Appendix: FIPS-Specific Considerations

> **Note:** This section only applies when `ENABLE_FIPS=true` is set in `00-env.sh`.

### Certificate Requirements

FIPS compliance requires:
- Minimum RSA 3072-bit keys
- FIPS-approved signature algorithms (SHA-256 or higher)
- Certificates generated in FIPS-enabled environment (Red Hat UBI8)
- Proper certificate chain validation

### OpenSSL Configuration

Both server and keeper must have:
- `openSSL.enabled=true` - Enable TLS
- `openSSL.required=true` - Enforce TLS (reject non-TLS connections)
- `openSSL.selfSigned=true` - For self-signed certificates (set `false` if using proper CA)

### Key Differences from Standard GCP Installation

| Setting | Standard | FIPS |
|---------|----------|------|
| Server image tag | `25.8.1.9104` | `25.8.1.9104-fips` |
| Keeper image tag | `25.10.1.6624` | `26.1.1.1493` |
| OpenSSL enabled | Not set | `true` |
| OpenSSL required | Not set | `true` |
| TLS certificates | Not required | Required (RSA 3072-bit) |
| Client connection port | `9000` (native) | `9440` (native TLS) |
| HTTP port | `8123` | `8443` (HTTPS) |
| Client `--secure` flag | Not needed | Required |
| Self-signed cert flag | N/A | `--accept-invalid-certificate` |

---

## Appendix: Troubleshooting

### Certificate Verification Failures (FIPS)

If you see errors like "certificate verify failed":

1. Verify CA certificate is correct:
```bash
openssl x509 -in ${CERT_DIR}/ca/ca.crt -text -noout
```

2. Verify server certificate SANs:
```bash
openssl x509 -in ${CERT_DIR}/server/server.crt -text -noout | grep -A5 "Subject Alternative Name"
```

3. Check secret contents:
```bash
kubectl get secret ${CLUSTER_NAME}-server-cert-secret -n ${NAMESPACE} -o yaml
```

### FIPS Mode Verification

Verify FIPS compliance of generated certificates:

```bash
# Check key size
openssl rsa -in ${CERT_DIR}/server/server.key -text -noout | grep "Private-Key"

# Verify signature algorithm
openssl x509 -in ${CERT_DIR}/server/server.crt -text -noout | grep "Signature Algorithm"
```

Should show:
- Private key: 3072-bit
- Signature Algorithm: sha256WithRSAEncryption (or higher)

### Pods stuck in Pending - Node Selector Issues

```bash
kubectl get nodes --show-labels | grep clickhouseGroup

# Add missing labels
kubectl label node <node-name> clickhouseGroup=keeper
kubectl label node <node-name> topologyZone=c-${CLUSTER_NAME}-keeper
```

### Private Nodes Cannot Pull Images

Verify Cloud NAT is configured:

```bash
gcloud compute routers nats list \
  --router=clickhouse-router \
  --region=${GCP_REGION} \
  --project=${GCP_PROJECT}
```

### GCS Access Denied Errors (403)

The most common cause is a **Workload Identity race condition**: pods start during the Helm install (Step 17) before the Helm-created SA (`ch-${CLUSTER_NAME}-sa`) has its Workload Identity binding applied in Step 18. Step 18 now handles this automatically by restarting pods after binding.

If you still see 403 errors:

```bash
# 1. Verify Workload Identity annotation on the Helm-created SA
kubectl get sa ch-${CLUSTER_NAME}-sa -n ${NAMESPACE} -o yaml | grep -A5 annotations

# 2. Verify IAM binding
gcloud iam service-accounts get-iam-policy ${GSA_EMAIL}

# 3. Verify GCS bucket permissions for the GSA
gcloud storage buckets get-iam-policy gs://${BUCKET_NAME} | grep ${GSA_EMAIL}

# 4. Test from inside pod (should return the GSA email)
kubectl exec -it <pod-name> -n ${NAMESPACE} -- curl -s -H "Metadata-Flavor: Google" \
  http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/email

# 5. Restart pods to pick up credentials (if step 18 was run after pods started)
kubectl delete pods -n ${NAMESPACE} -l clickhouseGroup=keeper
kubectl delete pods -n ${NAMESPACE} -l clickhouseGroup=server
```

### Cannot Access Cluster from Bastion

Verify bastion subnet is in authorized networks:

```bash
gcloud container clusters describe ${GKE_CLUSTER_NAME} \
  --region=${GCP_REGION} \
  --project=${GCP_PROJECT} \
  --format="yaml(masterAuthorizedNetworksConfig)"

# Add bastion subnet if missing
gcloud container clusters update ${GKE_CLUSTER_NAME} \
  --region=${GCP_REGION} \
  --enable-master-authorized-networks \
  --master-authorized-networks=${SUBNET_RANGE},${BASTION_SUBNET_RANGE} \
  --project=${GCP_PROJECT}
```

### Connection Refused on Port 9000 (FIPS)

With FIPS TLS enabled (`openSSL.required=true`), ClickHouse does not accept plaintext connections. Port 9000 (native) and 8123 (HTTP) will refuse connections. Use the secure ports instead:

| Protocol | Plaintext Port | TLS Port |
|----------|---------------|----------|
| Native | 9000 | **9440** |
| HTTP | 8123 | **8443** |

```bash
# Wrong - connection refused
kubectl port-forward svc/c-${CLUSTER_NAME}-server-any 9000:9000 -n ${NAMESPACE}
clickhouse client --host localhost --port 9000

# Correct
kubectl port-forward svc/c-${CLUSTER_NAME}-server-any 9440:9440 -n ${NAMESPACE}
clickhouse client --host localhost --port 9440 --secure --accept-invalid-certificate
```

### Helm Registry Login Fails

`helm registry login` does **not** accept `https://` prefix:

```bash
# Wrong - will fail with "invalid registry"
gcloud auth print-access-token | helm registry login \
  -u oauth2accesstoken --password-stdin \
  https://${GCP_REGION}-docker.pkg.dev

# Correct
gcloud auth print-access-token | helm registry login \
  -u oauth2accesstoken --password-stdin \
  ${GCP_REGION}-docker.pkg.dev
```

### Validate SSD Cache script
`validate-ssd-cache.sh`

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "17. Validating SSD Cache Configuration"
echo "=========================================="

echo ""
echo "1. Checking DaemonSet status..."
DS_READY=$(kubectl get ds local-ssd-setup -n kube-system -o jsonpath='{.status.numberReady}')
DS_DESIRED=$(kubectl get ds local-ssd-setup -n kube-system -o jsonpath='{.status.desiredNumberScheduled}')

if [ "$DS_READY" = "$DS_DESIRED" ]; then
  echo "✅ DaemonSet ready: $DS_READY/$DS_DESIRED pods"
else
  echo "❌ DaemonSet not ready: $DS_READY/$DS_DESIRED pods"
  exit 1
fi

echo ""
echo "2. Checking ClickHouseCluster SSD configuration..."
SSD_CONFIG=$(kubectl get clickhousecluster c-${CLUSTER_NAME} -n ${NAMESPACE} -o jsonpath='{.spec.ssdCacheConfiguration}')

if echo "$SSD_CONFIG" | jq -e '.hostPathBaseDirectory == "/mnt/disks/ssd0/"' > /dev/null; then
  echo "✅ SSD cache configured in CRD:"
  echo "$SSD_CONFIG" | jq .
else
  echo "❌ SSD cache not properly configured"
  exit 1
fi

echo ""
echo "3. Waiting for server pods to be ready..."
kubectl wait --for=condition=ready pod \
  -l clickhouseGroup=server \
  -n ${NAMESPACE} \
  --timeout=300s

echo ""
echo "4. Checking pod volume mounts..."
SERVER_POD=$(kubectl get pods -n ${NAMESPACE} -l clickhouseGroup=server -o name | head -1)
echo "Checking pod: $SERVER_POD"

CACHE_MOUNT=$(kubectl get $SERVER_POD -n ${NAMESPACE} -o jsonpath='{.spec.containers[0].volumeMounts}' | jq '.[] | select(.name == "ch-cache-volume")')

if [ -n "$CACHE_MOUNT" ]; then
  echo "✅ Cache volume mounted:"
  echo "$CACHE_MOUNT" | jq .
else
  echo "❌ Cache volume not found in pod"
  exit 1
fi

echo ""
echo "5. Checking pod volume definition..."
CACHE_VOL=$(kubectl get $SERVER_POD -n ${NAMESPACE} -o jsonpath='{.spec.volumes}' | jq '.[] | select(.name == "ch-cache-volume")')

if [ -n "$CACHE_VOL" ]; then
  echo "✅ Cache volume defined:"
  echo "$CACHE_VOL" | jq .
else
  echo "❌ Cache volume not found in pod spec"
  exit 1
fi

echo ""
echo "6. Verifying cache is accessible inside container..."
if kubectl exec -n ${NAMESPACE} $SERVER_POD -- df -h /mnt/clickhouse-cache 2>/dev/null; then
  echo "✅ Cache directory accessible and mounted"
else
  echo "❌ Cache directory not accessible"
  exit 1
fi

echo ""
echo "7. Checking cache usage in ClickHouse..."
echo "Connecting to ClickHouse to verify cache configuration..."

# Build client connection flags
CLIENT_FLAGS=(--password="${CLICKHOUSE_PASSWORD}")
if [ "$ENABLE_FIPS" = "true" ]; then
  # In FIPS mode, OpenSSL is required — find the CA cert and configure TLS
  CA_CERT_PATH=$(kubectl exec -n ${NAMESPACE} $SERVER_POD -- \
    find /etc -name "ca.crt" -type f 2>/dev/null | head -1)
  if [ -z "$CA_CERT_PATH" ]; then
    echo "❌ Could not find CA cert inside container"
    exit 1
  fi
  echo "Using CA cert: $CA_CERT_PATH"

  CLIENT_FLAGS+=(--secure --config-file=/tmp/ch-client-ssl.xml)
  kubectl exec -n ${NAMESPACE} $SERVER_POD -- bash -c "cat > /tmp/ch-client-ssl.xml << EOF
<clickhouse>
  <openSSL>
    <client>
      <caConfig>${CA_CERT_PATH}</caConfig>
    </client>
  </openSSL>
</clickhouse>
EOF"
fi

# Query filesystem cache settings (the SSD cache is a filesystem cache layer
# on top of ObjectStorage disks, so it appears in system.filesystem_cache_settings
# rather than as a standalone disk in system.disks)
CACHE_INFO=$(kubectl exec -n ${NAMESPACE} $SERVER_POD -- clickhouse-client "${CLIENT_FLAGS[@]}" -q "
SELECT
    cache_name,
    path,
    formatReadableSize(max_size) as max_size,
    formatReadableSize(current_size) as current_size,
    current_elements_num,
    is_initialized
FROM system.filesystem_cache_settings
FORMAT Vertical
" 2>/dev/null) || true

if [ -n "$CACHE_INFO" ]; then
  echo "✅ Filesystem cache active in ClickHouse:"
  echo "$CACHE_INFO"
else
  echo "⚠️  Could not query ClickHouse cache info (cluster may still be initializing)"
fi

echo ""
echo "=========================================="
echo "✅ SSD Cache Validation Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  • DaemonSet mounted SSD at: /mnt/disks/ssd0 (on host)"
echo "  • Operator created volume:  ch-cache-volume"
echo "  • Container mount point:    /mnt/clickhouse-cache"
echo "  • Cache size configured:    ${CACHE_BYTES_PER_GI_RAM} per GiB RAM"
echo ""
echo "The SSD cache is fully configured and operational!"
```

### Query cache status
`query-cache-status.sh`

```bash expandable
#!/bin/bash
set -e
source ./00-env.sh

echo "=========================================="
echo "Querying ClickHouse Cache Status"
echo "=========================================="

SERVER_POD=$(kubectl get pods -n ${NAMESPACE} -l clickhouseGroup=server -o name | head -1)

if [ -z "$SERVER_POD" ]; then
  echo "❌ No server pods found"
  exit 1
fi

echo "Using pod: $SERVER_POD"
echo ""

# Build client connection flags
CLIENT_FLAGS=(--password="${CLICKHOUSE_PASSWORD}")
if [ "$ENABLE_FIPS" = "true" ]; then
  # In FIPS mode, OpenSSL is required — find the CA cert and configure TLS
  CA_CERT_PATH=$(kubectl exec -n ${NAMESPACE} $SERVER_POD -- \
    find /etc -name "ca.crt" -type f 2>/dev/null | head -1)
  if [ -z "$CA_CERT_PATH" ]; then
    echo "❌ Could not find CA cert inside container"
    exit 1
  fi
  echo "Using CA cert: $CA_CERT_PATH"

  CLIENT_FLAGS+=(--secure --config-file=/tmp/ch-client-ssl.xml)
  kubectl exec -n ${NAMESPACE} $SERVER_POD -- bash -c "cat > /tmp/ch-client-ssl.xml << EOF
<clickhouse>
  <openSSL>
    <client>
      <caConfig>${CA_CERT_PATH}</caConfig>
    </client>
  </openSSL>
</clickhouse>
EOF"
fi

# Function to run ClickHouse query
run_query() {
  local query="$1"
  kubectl exec -n ${NAMESPACE} $SERVER_POD -- \
    clickhouse-client "${CLIENT_FLAGS[@]}" -q "$query"
}

echo "=========================================="
echo "1. Checking All Disks"
echo "=========================================="
run_query "
SELECT 
    name,
    path,
    formatReadableSize(free_space) as free_space,
    formatReadableSize(total_space) as total_space,
    formatReadableSize(unreserved_space) as unreserved_space,
    type
FROM system.disks 
ORDER BY name
FORMAT Pretty
"

echo ""
echo "=========================================="
echo "2. Checking Storage Policies"
echo "=========================================="
run_query "
SELECT 
    policy_name,
    volume_name,
    volume_priority,
    disks,
    max_data_part_size,
    move_factor
FROM system.storage_policies
FORMAT Pretty
"

echo ""
echo "=========================================="
echo "3. Checking Cache-Related Disks"
echo "=========================================="
echo "Looking for disks with 'cache' in path or name..."
run_query "
SELECT 
    name,
    path,
    type,
    formatReadableSize(total_space) as total_space,
    formatReadableSize(free_space) as free_space
FROM system.disks 
WHERE path LIKE '%cache%' OR name LIKE '%cache%'
FORMAT Vertical
"

echo ""
echo "=========================================="
echo "4. Checking Filesystem Cache Configuration"
echo "=========================================="
run_query "
SELECT 
    name,
    value,
    changed,
    description
FROM system.settings
WHERE name LIKE '%cache%' AND name LIKE '%filesystem%'
ORDER BY name
FORMAT Pretty
"

echo ""
echo "=========================================="
echo "5. Checking System Metrics for Cache"
echo "=========================================="
run_query "
SELECT 
    metric,
    value,
    description
FROM system.metrics
WHERE metric LIKE '%Cache%' OR metric LIKE '%cache%'
ORDER BY metric
FORMAT Pretty
"

echo ""
echo "=========================================="
echo "6. Checking Async Metrics for Cache"
echo "=========================================="
run_query "
SELECT 
    metric,
    value
FROM system.asynchronous_metrics
WHERE metric LIKE '%Cache%' OR metric LIKE '%cache%'
ORDER BY metric
FORMAT Pretty
"

echo ""
echo "=========================================="
echo "7. Creating Test Table to Verify Cache Usage"
echo "=========================================="

echo "Creating test database and table..."
run_query "CREATE DATABASE IF NOT EXISTS test"

run_query "
DROP TABLE IF EXISTS test.cache_test
"

run_query "
CREATE TABLE test.cache_test
(
    id UInt64,
    data String
)
ENGINE = MergeTree()
ORDER BY id
SETTINGS storage_policy = 'default'
"

echo "✓ Test table created"

echo ""
echo "Inserting test data..."
run_query "
INSERT INTO test.cache_test 
SELECT 
    number,
    repeat('x', 1000)
FROM numbers(100000)
"
echo "✓ Inserted 100K rows"

echo ""
echo "Running query to trigger cache usage..."
run_query "SELECT count() FROM test.cache_test" > /dev/null
run_query "SELECT count() FROM test.cache_test WHERE id < 50000" > /dev/null
echo "✓ Queries executed"

echo ""
echo "=========================================="
echo "8. Checking Cache Statistics After Queries"
echo "=========================================="
run_query "
SELECT 
    metric,
    value
FROM system.asynchronous_metrics
WHERE metric LIKE '%FilesystemCache%'
ORDER BY metric
FORMAT Pretty
"

echo ""
echo "=========================================="
echo "9. Checking Query Cache (if enabled)"
echo "=========================================="
run_query "
SELECT 
    query,
    result_size,
    formatReadableSize(result_size) as result_size_readable,
    stale
FROM system.query_cache
LIMIT 5
FORMAT Pretty
" || echo "Query cache may not be enabled or no cached queries"

echo ""
echo "=========================================="
echo "10. Verifying Physical Cache Directory"
echo "=========================================="
echo "Checking /mnt/clickhouse-cache inside container..."
kubectl exec -n ${NAMESPACE} $SERVER_POD -- sh -c "
  echo 'Mount point:'
  df -h /mnt/clickhouse-cache 2>/dev/null || echo 'Not mounted'
  echo ''
  echo 'Directory contents:'
  ls -lah /mnt/clickhouse-cache/ 2>/dev/null || echo 'Cannot access'
  echo ''
  echo 'Disk usage:'
  du -sh /mnt/clickhouse-cache/* 2>/dev/null || echo 'No cache files yet'
"

echo ""
echo "=========================================="
echo "✅ Cache Status Query Complete"
echo "=========================================="
echo ""
echo "Key indicators of working SSD cache:"
echo "  1. Disk with type 'cache' or path containing 'cache'"
echo "  2. FilesystemCacheSize > 0 in async metrics"
echo "  3. /mnt/clickhouse-cache is mounted and accessible"
echo "  4. Cache files present in /mnt/clickhouse-cache/"
echo ""
echo "To clean up test data:"
echo "  kubectl exec -n ${NAMESPACE} $SERVER_POD -- clickhouse-client --password=\"\${CLICKHOUSE_PASSWORD}\" -q 'DROP TABLE test.cache_test'"
```

---

## Security Best Practices

1. **Certificate Management** (FIPS)
   - Rotate certificates before expiration (default: 365 days)
   - Store private keys securely (use secrets management)
   - Never commit certificates to version control
   - Use proper CA-signed certificates in production

2. **Network Security**
   - Use private GKE cluster with no public endpoint
   - Restrict master-authorized-networks to bastion and GKE subnets
   - Enable VPC flow logs
   - Use Cloud NAT for controlled outbound access

3. **Access Control**
   - Use Workload Identity instead of static credentials
   - Enable Kubernetes RBAC
   - Audit access logs regularly
   - Use service account impersonation for deployment

4. **Monitoring**
   - Monitor certificate expiration dates (FIPS)
   - Set up alerts for failed TLS connections (FIPS)
   - Monitor GCS access patterns
   - Enable Cloud Audit Logging
