---
title: "ClickHouse Private on AWS"
slug: "docs/products/clickhouse-private/aws"
sidebarTitle: "AWS"
---

## Set up Tasks

### AWS Resources

* [Create IAM role to pull images from private clickhouse ECR](#cloud-formation-to-create-iam-role-to-pull-images)
* Create ECR repositories to host copies of our artifacts in your own ECR, this guide assumes you will use the names below as your ECR repo names. Please use the specified tag of each artifact.
* [Copy ECR artifacts from our ECR to your ECR repository](#copy-ecr-artifacts)
* [Create VPC](#example-vpc-configuration)
* [Create EKS cluster](#creating-eks-cluster)
  * Requires the following components:
    * CNI of your choosing (must use ipv4), eg [Amazon VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s)
      * If using Amazon VPC CNI we recommend using IRSA, you can follow this guide using the ipv4 instructions: [https://docs.aws.amazon.com/eks/latest/userguide/cni-iam-role.html](https://docs.aws.amazon.com/eks/latest/userguide/cni-iam-role.html)
    * EBS CSI Driver, eg [aws-ebs-csi-driver](#install-aws-ebs-csi-driver)
    * DNS, eg CoreDNS
    * Recommended: Autoscaling, may require components such as [cluster autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)
  * Associate with previously created VPC
  * Node groups
    * **All nodes require [IMDS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) for authentication**
    * For keeper and server node groups, **create one node group per AZ if you wish to support cluster autoscaler** across AZs as recommended [here](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#i-have-a-couple-of-pending-pods-but-there-was-no-scale-up), otherwise they can be created as single node groups with the appropriate AZ subnets
    * Keeper node group
      * AMI image:
        * x86: AL2023\_x86\_64
        * arm64: AL2023\_ARM\_64
      * Disk size: 20gb
      * If not using autoscaling, min and desired nodes should be 3 per ClickHouse cluster
      * Recommended instance type: `m7g.2xlarge`
      * Kubernetes labels
        * x86: `clickhouseGroup: keeper`
        * arm64: `clickhouseGroup: keeper-arm64`
      * Kubernetes taints
        * `clickhouse.com/do-not-schedule: true, NoSchedule`
        * arm64: [`clickhouse.com/arch`](http://clickhouse.com/arch)`: arm64, NoSchedule`
      * Tags
        * May be required by cluster-autoscaler, if being used
          * Example:
            * `k8s.io/cluster-autoscaler/enabled: true`
            * `k8s.io/cluster-autoscaler/$CLUSTER_NAME: owned`
    * Server node group
      * AMI image
        * x86: AL2023\_x86\_64
        * arm64: AL2023\_ARM\_64
      * Disk size: 20gb
      * [EC2 Launch Template for Node Group](#ec2-launch-template-for-node-group-server))
      * If not using autoscaling, min and desired nodes should be equal to the desired number of ClickHouse replicas
      * Recommended instance type: `m7gd.16xlarge`
        * **Strongly recommended to use a "d" series instance** (eg `m7gd.*`) which includes NVME SSD that will be used by ClickHouse as a cache
          * For instances with NVME SSD, use a [custom launch template](#ec2-launch-template-for-node-group-server) to automatically mount the NVME SSD
      * Kubernetes labels
        * x86: `clickhouseGroup: server`
        * arm64: `clickhouseGroup: server-arm64`
      * Kubernetes taints
        * `clickhouse.com/do-not-schedule: true, NoSchedule`
        * arm64: [`clickhouse.com/arch`](http://clickhouse.com/arch)`: arm64, NoSchedule`
      * Tags
        * May be required by cluster-autoscaler, if being used
          * Example:
            * `k8s.io/cluster-autoscaler/enabled: true`
            * `k8s.io/cluster-autoscaler/$CLUSTER_NAME: owned`
    * x86 node group to run x86 other processes (operator, ...)
      * Can be an existing node group if the EKS cluster already exists as long as it is x86 compatible with a minimum size of xlarge nodes
      * For new node group
        * AMI image: AL2023\_x86\_64
        * Disk size: 20gb
        * Instance size: minimum xlarge
        * Instance type: any x86 compatible type
* Create OIDC provider for EKS cluster
* Create S3 bucket (S3 standard class) with encryption enabled
  * Bucket should be in same region as EKS cluster
  * You can create a bucket per provisioned clickhouse cluster, or use a single bucket but requires a unique prefix per ClickHouse cluster (defined in clickhouse CR/helm chart)
* Create NLB, required if ingress outside of the Kubernetes cluster is needed
  * If an NLB is needed**, it should be provisioned per clickhouse cluster**, unless something like [istio](https://istio.io/) will route the requests to the correct cluster
  * Create route 53 entries, can be done in an automated fashion with something like [external-dns](https://github.com/kubernetes-sigs/external-dns) (setup instructions not included in this doc) using Kubernetes annotations
* Create IAM roles:
  * **The role(s) below should be using [a trust policy similar to this](#example-trust-policy) (ie they should use IRSA) unless otherwise specified**
  * clickhouse-server/keeper role
    * **This role is needed per provisioned ClickHouse cluster**
    * Naming convention should be `CH-S3-$NAME-$REGION-$ORDINAL-Role`
      * `$NAME`, cluster name, eg `default-xx-01`
      * `$REGION`, identifies the region of the cluster to avoid naming conflicts across regions if the same cluster name is used.
        * The full region name isn't needed and could result in a role name that is past the allowed limits. Feel free to use a shortened name such as `uw2` for `us-west-2`
      * `$ORDINAL`, reserved, set to `00`
      * Example role name for service named `default-xx-01` in us-west-2: `CH-S3-default-xx-01-uw2-00-Role`
    * Bucket permissions
      * Minimal permissions are: `s3:*`, `s3:ListBucket` on bucket resource

### Kubernetes Resources

* [Install VolumeSnapshot CRDs](#install-volumesnapshot-crds)
* [Install StorageClass via Helm Chart](#install-storageclass-via-helm) if you do not wish to use a custom or existing StorageClass
* [Install operator via Helm chart](#install-operator-via-helm)
* [Create clickhousecluster resource](#clickhousecluster-cr) (repeat per ClickHouse cluster being provisioned)
* [Accessing the Cluster and Verifying Installation](#install-validation)
* [Hydra setup (Compute compute separation)](#hydra-setup)

## Technical Details

### Example VPC Configuration

* IPv4 CIDR block: 10.20.0.0/16
* No IPv6 CIDR block
* Tenancy: Default
* Number of AZs: 3, should be a minimum of 3 for HA between AZs
* Public Subnets:
  * us-west-2a: 10.20.192.0/20
  * us-west-2b: 10.20.208.0/20
  * us-west-2c: 10.20.224.0/20
* Private Subnets:
  * us-west-2a: 10.20.0.0/18
  * us-west-2b: 10.20.64.0/18
  * us-west-2c: 10.20.128.0/18
* NAT Gateways: 1 per AZ
* VPC endpoints: S3 gateway
* DNS Options:
  * Enable DNS hostnames: true
  * Enable DNS resolution: true

### Copy ECR Artifacts

**We highly recommend using [skopeo](https://github.com/containers/skopeo) for copying the images** as it will retain all of the architectures in the docker images. Be sure to set the `TARGET_REGION` and `TARGET_ECR_REPO` below to your ECR region and host.

```bash
SOURCE_REGION=us-east-1
SOURCE_ECR_REPO=349290138304.dkr.ecr.$SOURCE_REGION.amazonaws.com

TARGET_REGION=us-west-2
TARGET_ECR_REPO=0000000000.dkr.ecr.$TARGET_REGION.amazonaws.com

# log into our (authentication process may differ for customer)
aws ecr get-login-password --region $SOURCE_REGION | skopeo login --username AWS --password-stdin $SOURCE_ECR_REPO

# log into the target AWS repo (authentication process may differ for customer)
aws ecr get-login-password --region $TARGET_REGION | skopeo login --username AWS --password-stdin $TARGET_ECR_REPO

# copy each image to target ECR, be sure to include the --all flag
skopeo copy --all docker://$SOURCE_ECR_REPO/clickhouse-server:<<SERVER_TAG>> docker://$TARGET_ECR_REPO/clickhouse-server:<<SERVER_TAG>>
skopeo copy --all docker://$SOURCE_ECR_REPO/clickhouse-keeper:<<KEEPER_TAG>> docker://$TARGET_ECR_REPO/clickhouse-keeper:<<KEEPER_TAG>>
skopeo copy --all docker://$SOURCE_ECR_REPO/clickhouse-operator:main-<<OPERATOR_TAG>> docker://$TARGET_ECR_REPO/clickhouse-operator:<<OPERATOR_TAG>>
skopeo copy --all docker://$SOURCE_ECR_REPO/helm/clickhouse-operator-helm:<<OPERATOR_TAG>> docker://$TARGET_ECR_REPO/helm/clickhouse-operator-helm:<<OPERATOR_TAG>>
skopeo copy --all docker://$SOURCE_ECR_REPO/helm/onprem-clickhouse-cluster:<<CR_HELM_TAG>> docker://$TARGET_ECR_REPO/helm/onprem-clickhouse-cluster:<<CR_HELM_TAG>>
```

### Creating EKS Cluster

Requires cluster IAM role and node IAM roles. The roles created using the "Create recommended role" button using the default permissions in the AWS console UI is sufficient.

Run the following to add new EKS cluster to kubeconfig:

```bash
REGION=us-west-2
EKS_CLUSTER_NAME=eks-clickhouse

aws eks update-kubeconfig --region $REGION --name=$EKS_CLUSTER_NAME
```

### Cloud Formation to create IAM role to pull images

Requires an IAM role to pull images from a ClickHouse private ECR. The role is created using the CloudFormation template. Once the role ARN is created, **you need to provide the ARN (see output) to the ClickHouse team**.

**CloudFormation**

```yaml expandable
AWSTemplateFormatVersion: 2010-09-09
Description: This CloudFormation template creates the ClickHouseAirgapECRPullRole.

Resources:
  ClickHouseAirgapECRPullRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: ClickHouseAirgapECRPullRole
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              AWS: !Sub "arn:aws:iam::${AWS::AccountId}:root"
            Action:
              - sts:AssumeRole
          - Effect: Allow
            Principal:
              Service:
                - ec2.amazonaws.com
            Action:
              - sts:AssumeRole
      Policies:
        - PolicyName: ClickHouseAirgapECRPullPolicy
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Effect: Allow
                Action:
                  - ecr:GetDownloadUrlForLayer
                  - ecr:BatchGetImage
                  - ecr:BatchCheckLayerAvailability
                  - ecr:DescribeImages
                  - ecr:ListImages
                Resource:
                  - arn:aws:ecr:us-east-1:349290138304:repository/*
              - Effect: Allow
                Action:
                  - ecr:GetAuthorizationToken
                Resource:
                  - "*"

Outputs:
  RoleArn:
    Description: IAM Role ARN for pulling images from all ECR repositories
    Value: !GetAtt ClickHouseAirgapECRPullRole.Arn

```

### EC2 Launch Template for Node Group Server

Before creating a server node group, it's recommended to create an EC2 launch template to provision the node with an SSD disk for caching ClickHouse queries.

The template should contain the script below. **Note that there may be existing data in the launch template, if previously created, which should remain**. In this case, be sure the different files are separated by the specified boundary.

**Advanced details  (User data**):

```bash expandable
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"

#!/bin/bash
sudo sysctl net.ipv4.tcp_fin_timeout=15
sudo sysctl net.ipv4.tcp_keepalive_time=15


function build_raid() {
set -x
mapfile -t SSD_NVME_DEVICE_LIST < <(nvme list | grep "Amazon EC2 NVMe Instance Storage" | cut -d " " -f 1 || true)
SSD_NVME_DEVICE_COUNT=${#SSD_NVME_DEVICE_LIST[@]}
RAID_DEVICE=${RAID_DEVICE:-/dev/md0}
RAID_CHUNK_SIZE=${RAID_CHUNK_SIZE:-512}              # Kilo Bytes
FILESYSTEM_BLOCK_SIZE=${FILESYSTEM_BLOCK_SIZE:-4096} # Bytes
STRIDE=$((RAID_CHUNK_SIZE * 1024 / FILESYSTEM_BLOCK_SIZE))
STRIPE_WIDTH=$((SSD_NVME_DEVICE_COUNT * STRIDE))
BLK_LABEL=ssdcache
MD_DEV_LABEL=dpssdcache


# If mount is present in fstab - exit
grep "${BLK_LABEL}" /etc/fstab && return 0


nvme list
echo "${SSD_NVME_DEVICE_COUNT}" "${SSD_NVME_DEVICE_LIST[*]}"

# Perform provisioning based on nvme device count
case  "${SSD_NVME_DEVICE_COUNT}" in
"0")
  echo 'No devices found of type "Amazon EC2 NVMe Instance Storage"'
  echo "Maybe your node selectors are not set correct"
  return 0
  ;;
"1")
  mkfs.ext4 -L "${BLK_LABEL}" -m 0 -b "${FILESYSTEM_BLOCK_SIZE}" "${SSD_NVME_DEVICE_LIST[0]}"
  ;;
*)
  mdadm --create --verbose "${RAID_DEVICE}" --name="${MD_DEV_LABEL}" --level=0 -c "${RAID_CHUNK_SIZE}" \
    --raid-devices="${#SSD_NVME_DEVICE_LIST[@]}" "${SSD_NVME_DEVICE_LIST[@]}"

  while mdadm --detail "${RAID_DEVICE}" | grep -q -ioE 'State :.*resyncing'
  do
    echo "Raid is resyncing.."
    sleep 1
  done
  echo "Raid0 device  ${RAID_DEVICE} has been created with disks  ${SSD_NVME_DEVICE_LIST[*]}"
  mkfs.ext4 -L "${BLK_LABEL}" -m 0 -b "${FILESYSTEM_BLOCK_SIZE}" -E "stride=${STRIDE},stripe-width=${STRIPE_WIDTH}" "${RAID_DEVICE}"
  ;;
esac

# Mount it & add to fstab
# UUID is used to be compatible with EKS NVME proviioner tool
DEV_NAME=$(blkid -s UUID -o value -L "${BLK_LABEL}")
UUID=$(blkid -s UUID -o value "${DEV_NAME}")
# Make sure UUID is defined
test -z ${UUID} && return 1
mkdir -p /pv-disks/"${UUID}" /nvme/
test -h /nvme/disk || ln -fs /pv-disks/"${UUID}" /nvme/disk

cat<<EOF | tee -a /etc/fstab

LABEL=${BLK_LABEL} /pv-disks/${UUID} ext4 defaults,noatime,discard,nobarrier  0 0
EOF
mount -a
set +x
}

yum install -y nvme-cli mdadm
build_raid
mountpoint /nvme/disk/ || systemctl stop kubelet

--==MYBOUNDARY==--
```

### Logging into ECR from Helm

This may be needed to be able to pull helm charts from ECR using the Helm CLI. Update the variables as needed.

```bash
ECR_HOST=0000000000.dkr.ecr.us-west-2.amazonaws.com
REGION=us-west-2

 aws ecr get-login-password \
  --region $REGION | helm registry login \
  --username AWS \
  --password-stdin $ECR_HOST
```

### Install StorageClass via Helm

If a StorageClass is needed, it's recommended to install these clickhouse-operator dependencies via the provided Helm chart separately from the actual clickhousecluster CR creation so that if multiple CRs are created, the dependencies are not tied to any cluster and will not be removed if that cluster is deleted. **This step only needs to be done if you do not have a custom or an existing StorageClass CR** that you plan on using for clickhouser-server and clickhouse-keeper.

```bash
# update ECR_HOST as needed
ECR_HOST=0000000000.dkr.ecr.us-west-2.amazonaws.com
CHART_VERSION=<<CR_HELM_TAG>>

helm install clickhouse-prerequisites \
    oci://$ECR_HOST/helm/onprem-clickhouse-cluster \
    --version=$CHART_VERSION \
    -n default \
    --set-json="storageClass.create=true" \
    --set-json="createCluster=false" \
    --set-json="serviceAccount.create=false"
```

### Install Operator via Helm

Update version, ECR host, and availability zones (as determined by created VPC) as needed.

```bash expandable
# update ECR_HOST as needed
ECR_HOST=0000000000.dkr.ecr.us-west-2.amazonaws.com

# should use the version of the operator's helm chart, not of the operator itself (eg <<OPERATOR_TAG>>, not main.<<OPERATOR_TAG>>)
OPERATOR_VERSION=<<OPERATOR_TAG>>

# set AZs as determined by VPC subnets
AZ_LIST='["us-west-2a","us-west-2b","us-west-2c"]'

helm install clickhouse-operator \
   oci://$ECR_HOST/helm/clickhouse-operator-helm \
   --version=$OPERATOR_VERSION \
   --create-namespace \
   -n clickhouse-operator-system \
   --set-json="image.repository=\"$ECR_HOST/clickhouse-operator\"" \
   --set-json='cilium.enabled=false' \
   --set-json='idleScalerEnabled=false' \
   --set-json='webhooks.enabled=false' \
   --set-json='operator.debug=true' \
   --set-json='operator.metricsScraper.enabled=false' \
   --set-json="operator.availabilityZones=$AZ_LIST" \
   --set-json='operator.featureFlags.backupOnASeparatePod=true' \
   --set-json='operator.featureFlags.serverCMEKEnabled=true'
```

##### Install Operator via Kustomize

If you are using kustomize, you need to explicitly provide `namespaceOperator` with the namespace where you want to install the operator (default namespace name: `clickhouse-operator-system`) as part of the values due to a known issue: [https://github.com/kubernetes-sigs/kustomize/issues/5566](https://github.com/kubernetes-sigs/kustomize/issues/5566).

### Install aws-ebs-csi-driver

Requires an IAM role with the following:

* Use managed policy `arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy`
* For trust policy, it's recommended to use sts:AssumeRoleWithWebIdentity with EKS cluster's OIDC provider ([example](#example-trust-policy))
* Selected role name must match annotation on service account that runs the aws-ebs-csi-driver
  * Example name: `ClickHouse_EksEbsCsiDriverRole`

Following  [Helm installation](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/install.md#helm) guide with additional values to attach the IAM role to the service account:

```bash
# update role name as needed
AWS_EBS_CSI_DRIVER_IAM_ROLE_ARN=arn:aws:iam::0000000000:role/ClickHouse_EksEbsCsiDriverRole

helm upgrade --install aws-ebs-csi-driver \
--namespace kube-system \
aws-ebs-csi-driver/aws-ebs-csi-driver \
--set-json="controller.serviceAccount.annotations={\"eks.amazonaws.com/role-arn\":\"$AWS_EBS_CSI_DRIVER_IAM_ROLE_ARN\"}"
```

### Install VolumeSnapshot CRDs

Currently these are required by our operator, but not currently used in your setup.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml
```

### Example Trust Policy

Be sure to use the correct namespace, service account name, and OIDC provider. The namespace and service account name will differ depending on which role is being configured.

```json expandable
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::0000000000:oidc-provider/oidc.eks.us-west-2.amazonaws.com/id/XXXXXXXXXXXXXXXXXXXXX"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.us-west-2.amazonaws.com/id/XXXXXXXXXXXXXXXXXXXXX:aud": "sts.amazonaws.com",
"oidc.eks.us-west-2.amazonaws.com/id/XXXXXXXXXXXXXXXXXXXXX:sub": "system:serviceaccount:$NAMESPACE:$K8S_SERVICE_ACCOUNT"
                }
            }
        }
    ]
}

```

### Naming Your ClickHouse Cluster

For each ClickHouse cluster being provisioned, select a **cluster name that is unique** within the target EKS cluster. This name will be used in various AWS and Kubernetes resources and will be used to uniquely identify the cluster.

1. The naming convention should be `$DESCRIPTOR-$LETTERS-$ORDINAL`
   1. $DESCRIPTOR \- some descriptive name of the cluster consisting of letters only
   2. $LETTERS \- reserved, select any two letters, for simplicity, `xx` will work
   3. $ORDINAL \- incrementing ordinal for clusters with the same descriptor starting with `01`
2. Example name: `default-xx-01`

### Clickhousecluster CR

Note the values below should be reviewed and updated for a production environment (eg resources, feature flags, server configurations, ...). See the [section about naming](#naming-your-clickhouse-cluster) before setting the `CLUSTER_NAME`.
Generate the password hash for the given `$PASSWORD` using the following command (os x) then pass it to the `account.hashedPassword` value of the Helm chart:

```bash expandable
# this will be the `default` user's password
PASSWORD='My super secret p@$$w0rd'
HASHED_PASSWORD=`echo -n $PASSWORD | shasum -a 256 | awk '{printf $1}' | base64`

# update values below as needed,
# the ecr host should be the one in your account
# the s3 bucket should be the one created earlier
CLUSTER_NAME=default-xx-01
ECR_HOST=0000000000.dkr.ecr.us-west-2.amazonaws.com
SA_IAM_ROLE_ARN=arn:aws:iam::0000000000:role/CH-S3-${CLUSTER_NAME}-uw2-00-Role
S3_BUCKET_NAME=my-clickhouse-data

# s3 key prefix can use any UUID value, but must be unique for all clusters storing data in the bucket specified above
S3_KEY_PREFIX=ch-s3-$(uuidgen | tr '[:upper:]' '[:lower:]')

# these should match the clickhouseGroup label value added to the node group
SERVER_NG_GROUP=server-arm64
KEEPER_NG_GROUP=keeper-arm64

# these values should change depending on selected instance sizes
# be sure to take daemon set requirements into account when setting CPU and MEMORY values
SERVER_CPU=64
SERVER_MEMORY=256Gi
KEEPER_CPU=4
KEEPER_MEMORY=16Gi

CHART_VERSION=<<CR_HELM_TAG>>

# bytesPerGiRAM is a scaling factor used to automatically calculate the disk cache size.
# As a general rule, set cache size to 80-90% of the available SSD cache disk size.
# When you set bytesPerGiRAM in the Helm chart, the following formula is used during pod startup:
#
# CONFIG_DISK_CACHE_SIZE = bytesPerGiRAM * pod_memory_limit
#
# For example:
# bytesPerGiRAM = 11.3Gi
# pod_memory_limit = 250Gi
# CONFIG_DISK_CACHE_SIZE = 11.3 * 250 = 2825Gi
CACHE_BYTES_PER_GI_RAM=11Gi


helm install $CLUSTER_NAME \    oci://$ECR_HOST/helm/onprem-clickhouse-cluster \
    --version=$CHART_VERSION \
    -n ns-$CLUSTER_NAME \
    --create-namespace \
    --set-json="account.hashedPassword=\"$HASHED_PASSWORD\"" \
    --set-json="server.image.repository=\"$ECR_HOST/clickhouse-server\"" \
    --set-json="server.storage.s3.bucketName=\"$S3_BUCKET_NAME\"" \
    --set-json="server.storage.s3.keyPrefix=\"$S3_KEY_PREFIX\"" \
    --set-json='server.arm64=true' \
    --set-json="server.image.tag=\"<<SERVER_TAG>>\"" \
    --set-json="server.podPolicy.nodeSelector.clickhouseGroup=\"$SERVER_NG_GROUP\"" \
    --set-json="keeper.image.repository=\"$ECR_HOST/clickhouse-keeper\"" \
    --set-json='keeper.arm64=true' \
    --set-json="keeper.image.tag=\"<<KEEPER_TAG>>\"" \
    --set-json="keeper.podPolicy.nodeSelector.clickhouseGroup=\"$KEEPER_NG_GROUP\"" \
    --set-json="serviceAccount.annotations={\"eks.amazonaws.com/role-arn\":\"$SA_IAM_ROLE_ARN\"}" \
    --set-json='server.tolerations=[{"effect":"NoSchedule","key":"clickhouse.com/do-not-schedule","operator":"Exists"}]' \
    --set-json='keeper.tolerations=[{"effect":"NoSchedule","key":"clickhouse.com/do-not-schedule","operator":"Exists"}]' \
    --set-json="server.ssdCacheConfiguration.bytesPerGiRAM=\"$CACHE_BYTES_PER_GI_RAM\"" \
    --set-json="server.podPolicy.resources.limits.cpu=\"$SERVER_CPU\"" \
    --set-json="server.podPolicy.resources.limits.memory=\"$SERVER_MEMORY\"" \
    --set-json="server.podPolicy.resources.requests.cpu=\"$SERVER_CPU\"" \
    --set-json="server.podPolicy.resources.requests.memory=\"$SERVER_MEMORY\"" \
    --set-json="keeper.podPolicy.resources.limits.cpu=\"$KEEPER_CPU\"" \
    --set-json="keeper.podPolicy.resources.limits.memory=\"$KEEPER_MEMORY\"" \
    --set-json="keeper.podPolicy.resources.requests.cpu=\"$KEEPER_CPU\"" \
    --set-json="keeper.podPolicy.resources.requests.memory=\"$KEEPER_MEMORY\""
```

## Hydra setup

The idea is to create multiple node groups inside one ClickHouse cluster. Every such node group will have a different number of nodes (with different amounts of memory) and a separate endpoint. Such node groups will have a single keeper instance and a single data set / folder in the shared S3 bucket.

### Provisioning Hydra children instances

##### Prerequisites

The operator should be [installed](#install-operator-via-helm) with the Hydra feature enabled by setting (default false):

```bash
--set operator.featureFlags.privateHydraEnabled="true"
```

##### Setup

*Before creating child instances, you need to choose an existing and/or create a new parent ClickHouse cluster, so you should know in advance the parent **name** and **namespace** for the children.*

To create a new child service, follow the [same instructions](#clickhousecluster-cr) for creating a service, and simply add new Helm values when creating the `ClickHouseCluster` custom resource (CR):

```bash
--set-json='parentCluster.name="c-${PARENT_NAME}'"'
--set-json='parentCluster.namespace="ns-'${PARENT_NAME}'"'
```

**PARENT\_NAME** \-  existing or new parent ClickHouse cluster name.

Optionally, if you want the new child to be read-only (by default false), you can add:

```bash
--set-json='isReadonly=true'
```

### Limitations

1. You can't provision child instances if the parent instance is stopped, terminated, or idled.
2. If you want to delete the parent cluster, you must delete the child instances first.

## Install Validation

### Preflight Checks

An optional preflight check exists using [Troubleshoot](https://troubleshoot.sh/), a Kubernetes plugin for cluster diagnostics.

To install the required plugins you can use Krew:

```console
kubectl krew install preflight
```

or refer to the [documentation](https://troubleshoot.sh/docs/) of Troubleshoot for other installation options.

ClickHouse provides a Helm Chart (`helm/preflight-check`) that can be copied to your ECR and rendered locally to generate the preflight spec, which is then passed to `kubectl preflight`.

##### Copying the Preflight Check Helm Chart

Add the preflight chart to the [ECR copy step](#copy-ecr-artifacts):

```bash
skopeo copy --all docker://$SOURCE_ECR_REPO/helm/preflight-check:<<PREFLIGHT_CHART_TAG>> docker://$TARGET_ECR_REPO/helm/preflight-check:<<PREFLIGHT_CHART_TAG>>
```

##### Running the Preflight Checks

Use `helm template` to render the preflight spec, then pipe it directly to `kubectl preflight`. Set `CLUSTER_NAME` to the name of the ClickHouse cluster you want to validate (see [Naming Your ClickHouse Cluster](#naming-your-clickhouse-cluster)):

```bash
ECR_HOST=0000000000.dkr.ecr.us-west-2.amazonaws.com
CHART_VERSION=<<PREFLIGHT_CHART_TAG>>
CLUSTER_NAME=default-xx-01

helm template clickhouse-preflight \
    oci://$ECR_HOST/helm/preflight-check \
    --version=$CHART_VERSION \
    --set preflight.clickhouseClusterName=$CLUSTER_NAME | \
kubectl preflight -
```

This validates the requirements for running the ClickHouse Operator & deploying a ClickHouse cluster. It validates if the required node labels are
present, if the Storage Class is correctly configured, etc.

The output shows the different preflight checks and their status:
![Preflight Example](./images/preflight-example.png)

You can scroll through the output and validate each check passed. If a check fails, it indicates a (potential) issue with the setup that can cause
problems with successfully running a ClickHouse cluster. The checks include recommendations on what to do to fix the issue.

To validate against a storage class other than the default (`gp3-encrypted`), override it with an additional `--set` flag:

```bash
    --set preflight.checks.prerequisites.storageClassName=<your-storage-class>
```

##### Required Permissions

The user or service account executing `kubectl preflight` must be able to read cluster-level and namespace-level resources. At minimum the following access is required:

| Scope | Resources |
|---|---|
| Cluster-wide | `nodes`, `namespaces`, `persistentvolumes`, `storageclasses`, `customresourcedefinitions` |
| Operator namespace (`clickhouse-operator-system`) | `deployments`, `replicasets`, `pods`, `services`, `configmaps`, `events` |
| Cluster namespace (`ns-<cluster-name>`) | `statefulsets`, `pods`, `persistentvolumeclaims`, `services`, `configmaps`, `events` |

In practice, a principal with the built-in `view` ClusterRole plus `view` access to the relevant namespaces is sufficient. A cluster-admin binding will also work and is simpler to configure for one-off validation runs.

### Port-forward the ClickHouse service to your local machine

To forward traffic from your local machine to the c-default-xx-01-server-any service, run:

```bash
kubectl port-forward svc/c-default-xx-01-server-any 9000:9000 -n ns-default-xx-01
```

This will forward port `9000` on the service to port `9000` on your local machine. You can now access the ClickHouse HTTP interface on `http://localhost:9000`.

### Access ClickHouse and run query

Once the port is forwarded, you can connect to ClickHouse locally using a tool like clickhouse-client.

```bash
clickhouse client --host localhost --port 9000 --password $PASSWORD
```

and run a simple query:

```sql
clickhouse-cloud :) select 1;
```

You should see output like this:

```text
SELECT 1
Query id: 825591bf-a8e5-4995-ac9f-afb864854ba2
   ┌─1─┐
1. │ 1  │
   └───┘
1 row in set. Elapsed: 0.001 sec.
```