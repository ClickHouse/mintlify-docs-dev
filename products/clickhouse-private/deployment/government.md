---
title: "ClickHouse Government"
slug: "docs/products/clickhouse-private/government"
sidebarTitle: "Government"
---

### Prerequisites

* The [ClickHouse Private AWS Technical Setup Guide](/docs/products/clickhouse-private/aws) has been followed for setting up the AWS resources (do not do the Kubernetes Resources section) with the following considerations for FIPS:
  * The **S3 bucket created here cannot contain any periods** (`.`) when using FIPS as the S3 FIPS endpoints require virtual-host-style which will not work when the bucket name contains periods.
* Use the following version tags:
  * clickhouse-server
    * `<<SERVER_TAG>>-fips`
  * clickhouse-keeper
    * `<<KEEPER_TAG>>`
  * clickhouse-operator
    * `main-<<OPERATOR_TAG>>`
  * helm/clickhouse-operator-helm
    * `<<OPERATOR_TAG>>`
  * helm/onprem-clickhouse-cluster
    * `<<CR_HELM_TAG>>`

### Setup Tasks

* [Create certificates](#creating-certificates-with-openssl) for the following:
  * Certificate authority (if applicable, for example if you are self-signing)
    * Name: `ca.crt`
  * Certificates:
    * Requirements for certificates:
      * They must be signed by the certificate authority created above or your existing certificate authority. If using an existing certificate authority, you must have access to the certificate so that it can be installed.
      * If FIPS compliance is required, they must be created using FIPS compliant algorithms and environments
      * You will need access to the public key (certificate) and the private key
      * The subject alternative names (SANs) must have the following entries:
        * `*.c-${CLUSTER_NAME}-{server|keeper}-headless.ns-${CLUSTER_NAME}.svc.cluster.local` \- components in the cluster will use this DNS domain to communicate with each other. If your Kubernetes has a different domain name (`.cluster.local`), please replace it with your Kubernetes domain name
          * `${CLUSTER_NAME}` is the name of the cluster you are creating
          * `{server|keeper}` indicates that either `server` or `keeper` should be used here depending on if the certificate is being installed in `clickhouse-server` or `clickhouse-keeper`, respectively
          * Example for cluster name `default-xx-01`:
            * Server: `*.c-default-xx-01-server-headless.ns-default-xx-01.svc.cluster.local`
            * Keeper: `*.c-default-xx-01-keeper-headless.ns-default-xx-01.svc.cluster.local`
    * Certificates to create:
      * One for connections to clickhouse-server
        * Private key name: `server.key`
        * Public key name: `server.crt`
      * One for connections from clickhouse-server (e.g. to clickhouse-keeper and other https sources like dictionaries)
        * Private key name: `client.key`
        * Public key name: `client.crt`
      * One for connections to clickhouse-keeper
        * Private key name: `keeper.key`
        * Public key name: `keeper.crt`
* [Install VolumeSnapshot CRDs](/docs/products/clickhouse-private/aws#install-volumesnapshot-crds)
* [Install StorageClass via Helm Chart](/docs/products/clickhouse-private/aws#install-storageclass-via-helm) if you do not wish to use a custom or existing StorageClass
* [Install operator via Helm chart](#install-operator-via-helm)
* [Create Kubernetes secrets from generated certificates](#create-kubernetes-certificate-secrets)
* [Create the clickhousecluster custom resource](#clickhousecluster-cr)
  * [Accessing the cluster and verifying installation](#install-validation)

### Technical Details

#### Creating Certificates With OpenSSL

The following shows how you can create self-signed certificates using OpenSSL. Please make sure that this method of creating and signing certificates is inline with your security policies before using in a production setting. Before proceeding you must [choose a cluster name](/docs/products/clickhouse-private/aws#naming-your-clickhouse-cluster) and it must be used later when [creating your cluster](#clickhousecluster-cr). **A unique set of certificates (excluding the CA certificate) must be created for each ClickHouse cluster being provisioned**.

This assumes you want a FIPS compliant certificate and that you have docker installed with access to the redhat docker image repository. If successful, this will generate a certificate authority that can be used for signing and certificate verification, and three sets of certificates (one for clickhouse-keeper, clickhouse-server, and clickhouse-server client usage). You will need to keep the `*.crt` (certificate/public key) files and the `*.key` (private key) files from each directory (`ca/`, `server/`, `keeper/`, and `client/`).

If you have your own certificate authority that you will be signing with, you can exclude the CA certificate generation from the script and mount your own CA certificate into the docker image to use it for signing. Use a copy of this CA certificate in later steps of this setup guide when they refer to `ca.crt` (eg when creating the Kubernetes secrets).

Note that the certificates generated below expire after 365 days. Please update this to fit your security requirements and please make a reminder to regenerate them before they expire.

```
# update the variables below as needed:


CLUSTER_NAME=default-xx-01
KUBERNETES_DOMAIN=cluster.local
COUNTRY=US
STATE=YourState
CITY=YourCity
ORG=YourOrganization
ORG_UNIT=YourOrganizationalUnit
CN=YourRootCA

docker run -it --rm \
  -v $(pwd):/certs \
  registry.access.redhat.com/ubi8/ubi \
  /bin/bash -c "
    set -e

    # Install required packages
    dnf -y install openssl crypto-policies-scripts

    # Enable FIPS mode
    fips-mode-setup --enable

    # Create directory structure in the mounted volume
    mkdir -p /certs/{ca,server,keeper,client}

    # Generate CA certificate
    cd /certs/ca
    openssl genrsa -out ca.key 3072

    cat > ca.cnf << EOF
[ req ]
distinguished_name = req_distinguished_name
req_extensions     = v3_ca
prompt             = no

[ req_distinguished_name ]
C  = ${COUNTRY}
ST = ${STATE}
L  = ${CITY}
O  = ${ORG}
OU = ${ORG_UNIT}
CN = ${CN}

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer:always
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
EOF

    openssl req -new -x509 -days 3650 -key ca.key -out ca.crt -config ca.cnf

    # Generate server certificate
    cd /certs/server

    cat > server.cnf << EOF
[ req ]
distinguished_name = req_distinguished_name
req_extensions     = v3_req
prompt             = no

[ req_distinguished_name ]
C  = ${COUNTRY}
ST = ${STATE}
L  = ${CITY}
O  = ${ORG}
OU = ${ORG_UNIT}
CN = clickhouse-server

[ v3_req ]
subjectKeyIdentifier = hash
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = *.c-${CLUSTER_NAME}-server-headless.ns-${CLUSTER_NAME}.svc.${KUBERNETES_DOMAIN}
EOF

    openssl genrsa -out server.key 3072
    openssl req -new -key server.key -out server.csr -config server.cnf
    openssl x509 -req -days 365 -in server.csr -CA /certs/ca/ca.crt -CAkey /certs/ca/ca.key \
      -CAcreateserial -out server.crt -extensions v3_req -extfile server.cnf

    # Generate keeper certificate
    cd /certs/keeper

    cat > keeper.cnf << EOF
[ req ]
distinguished_name = req_distinguished_name
req_extensions     = v3_req
prompt             = no

[ req_distinguished_name ]
C  = ${COUNTRY}
ST = ${STATE}
L  = ${CITY}
O  = ${ORG}
OU = ${ORG_UNIT}
CN = clickhouse-keeper

[ v3_req ]
subjectKeyIdentifier = hash
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = *.c-${CLUSTER_NAME}-keeper-headless.ns-${CLUSTER_NAME}.svc.${KUBERNETES_DOMAIN}
EOF

    openssl genrsa -out keeper.key 3072
    openssl req -new -key keeper.key -out keeper.csr -config keeper.cnf
    openssl x509 -req -days 365 -in keeper.csr -CA /certs/ca/ca.crt -CAkey /certs/ca/ca.key \
      -CAcreateserial -out keeper.crt -extensions v3_req -extfile keeper.cnf

    # Generate client certificate
    cd /certs/client

    cat > client.cnf << EOF
[ req ]
distinguished_name = req_distinguished_name
req_extensions     = v3_req
prompt             = no

[ req_distinguished_name ]
C  = ${COUNTRY}
ST = ${STATE}
L  = ${CITY}
O  = ${ORG}
OU = ${ORG_UNIT}
CN = clickhouse-client

[ v3_req ]
subjectKeyIdentifier = hash
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
EOF

    openssl genrsa -out client.key 3072
    openssl req -new -key client.key -out client.csr -config client.cnf
    openssl x509 -req -days 365 -in client.csr -CA /certs/ca/ca.crt -CAkey /certs/ca/ca.key \
      -CAcreateserial -out client.crt -extensions v3_req -extfile client.cnf

    # Fix permissions
    chmod -R 755 /certs

    # Verify FIPS compliance
    echo 'Verifying FIPS compliance of generated certificates:'
    openssl version
    openssl rsa -in /certs/server/server.key -text -noout | grep 'Private-Key'
    openssl x509 -in /certs/server/server.crt -text -noout | grep 'Signature Algorithm'

    # Show success message
    echo 'FIPS-compliant certificates have been generated successfully!'
  "
```

#### Install Operator via Helm

Update version, ECR host, and availability zones (as determined by created VPC) as needed.

```
# update ECR_HOST as needed
ECR_HOST=0000000000.dkr-ecr-fips.us-west-2.on.aws

# should use the version of the operator's helm chart, not of the operator itself (eg <<OPERATOR_TAG>>, not main-<<OPERATOR_TAG>>)
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

#### Create Kubernetes Certificate Secrets

Secrets must be installed in the same Kubernetes namespace where the ClickHouse cluster will run. If your cluster name is `default-xx-01`, then the namespace it will run in will be `ns-default-xx-01`. Ensure this namespace exists and update the `CERT_DIR` and `CLUSTER_NAME` variables below before executing the commands.

The secrets must be named generated below with the key names as specified, **do not change the secret names or key names**.

```
CERT_DIR=.
CLUSTER_NAME=default-xx-01

# server
kubectl create secret generic -n ns-${CLUSTER_NAME} ${CLUSTER_NAME}-server-cert-secret \
  --from-file=ca.crt="$CERT_DIR/ca/ca.crt" \
  --from-file=server.crt="$CERT_DIR/server/server.crt" \
  --from-file=server.key="$CERT_DIR/server/server.key" \
  --from-file=client.crt="$CERT_DIR/client/client.crt" \
  --from-file=client.key="$CERT_DIR/client/client.key"

# keeper
kubectl create secret generic -n ns-${CLUSTER_NAME} ${CLUSTER_NAME}-keeper-cert-secret \
  --from-file=ca.crt="$CERT_DIR/ca/ca.crt" \
  --from-file=keeper.crt="$CERT_DIR/keeper/keeper.crt" \
  --from-file=keeper.key="$CERT_DIR/keeper/keeper.key"
```

#### Clickhousecluster CR

Be sure to use the correct FIPS version of the endpoints below for ECR and S3 which can be found [here](https://aws.amazon.com/compliance/fips/).

```
# this will be the `default` user's password
PASSWORD='My super secret p@$$w0rd'
HASHED_PASSWORD=`echo -n $PASSWORD | shasum -a 256 | awk '{printf $1}' | base64`

# update values below as needed,
# the ecr host should be the one in your account
# the s3 bucket should be the one created earlier
CLUSTER_NAME=default-xx-01
ECR_HOST=0000000000.dkr-ecr-fips.us-west-2.on.aws
SA_IAM_ROLE_ARN=arn:aws:iam::0000000000:role/CH-S3-${CLUSTER_NAME}-uw2-00-Role

S3_BUCKET_REGION=us-gov-west-1
S3_BUCKET_URL=https://my-clickhouse-data.us-gov-west-1.amazonaws.com
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

# update this depending on if your certificates are self-signed:
SERVER_SELF_SIGNED=true
KEEPER_SELF_SIGNED=true

CHART_VERSION=<<CR_HELM_TAG>>

# As a general rule, set cache size to 80-90% of the available SSD cache disk size.
# For example for type m6id.2xlarge with 1x474 NVMe it should be set to 379Gi (~80%)
CACHE_DISK_SIZE_GI=379Gi

helm install $CLUSTER_NAME \    oci://$ECR_HOST/helm/onprem-clickhouse-cluster \
    --version=$CHART_VERSION \
    -n ns-$CLUSTER_NAME \
    --create-namespace \
    --set-json="account.hashedPassword=\"$HASHED_PASSWORD\"" \
    --set-json="server.image.repository=\"$ECR_HOST/clickhouse-server\"" \
    --set-json="server.storage.s3.endpoint=\"$S3_BUCKET_URL\"" \
    --set-json="server.storage.s3.region=\"$S3_BUCKET_REGION\"" \
    --set-json="server.storage.s3.bucketName=\"$S3_BUCKET_NAME\"" \
    --set-json="server.storage.s3.keyPrefix=\"$S3_KEY_PREFIX\"" \
    --set-json='server.arm64=true \
    --set-json="server.image.tag=\"<<SERVER_TAG>>-fips\"" \
    --set-json="server.podPolicy.nodeSelector.clickhouseGroup=\"$SERVER_NG_GROUP\"" \
    --set-json="server.openSSL.enabled=true" \
    --set-json="server.openSSL.required=true" \
    --set-json="server.openSSL.selfSigned=$SERVER_SELF_SIGNED" \
    --set-json="keeper.image.repository=\"$ECR_HOST/clickhouse-keeper\"" \
    --set-json='keeper.arm64=true \
    --set-json="keeper.image.tag=\"<<KEEPER_TAG>>\"" \
    --set-json="keeper.podPolicy.nodeSelector.clickhouseGroup=\"$KEEPER_NG_GROUP\"" \
    --set-json="keeper.openSSL.enabled=true" \
    --set-json="keeper.openSSL.required=true" \
    --set-json="keeper.openSSL.selfSigned=$KEEPER_SELF_SIGNED" \
    --set-json="serviceAccount.annotations={\"eks.amazonaws.com/role-arn\":\"$SA_IAM_ROLE_ARN\"}" \
    --set-json='server.tolerations=[{"effect":"NoSchedule","key":"clickhouse.com/do-not-schedule","operator":"Exists"}]' \
    --set-json='keeper.tolerations=[{"effect":"NoSchedule","key":"clickhouse.com/do-not-schedule","operator":"Exists"}]' \
    --set-json="server.ssdCacheConfiguration.cacheDiskSize=\"$CACHE_DISK_SIZE_GI\"" \
    --set-json="server.podPolicy.resources.limits.cpu=\"$SERVER_CPU\"" \
    --set-json="server.podPolicy.resources.limits.memory=\"$SERVER_MEMORY\"" \
    --set-json="server.podPolicy.resources.requests.cpu=\"$SERVER_CPU\"" \
    --set-json="server.podPolicy.resources.requests.memory=\"$SERVER_MEMORY\"" \
    --set-json="keeper.podPolicy.resources.limits.cpu=\"$KEEPER_CPU\"" \
    --set-json="keeper.podPolicy.resources.limits.memory=\"$KEEPER_MEMORY\"" \
    --set-json="keeper.podPolicy.resources.requests.cpu=\"$KEEPER_CPU\"" \
    --set-json="keeper.podPolicy.resources.requests.memory=\"$KEEPER_MEMORY\""

```

### Install Validation

#### Port-forward the ClickHouse service to your local machine

To forward traffic from your local machine to the c-default-xx-01-server-any service, run:

```
kubectl port-forward svc/c-default-xx-01-server-any 9440:9440 -n ns-default-xx-01
```

This will forward port `9440` on the service to port `9440` on your local machine. You can now access the ClickHouse HTTP interface on `https://localhost:9440`.

#### Access ClickHouse and run query

Once the port is forwarded, you can connect to ClickHouse locally using a tool like clickhouse-client with the following configuration file. Be sure to update the path to your `ca.crt` file.

```
# client-config.xml
<config>
    <openSSL>
        <client>
            <caConfig>/path/to/certs/ca.crt</caConfig>
        </client>
    </openSSL>
</config>


clickhouse client --host localhost --port 9440 --password $PASSWORD --secure --config=client-config.xml
```

and run a simple query:

```
clickhouse-cloud :) select 1;
```

You should see output like this:

```
SELECT 1
Query id: 825591bf-a8e5-4995-ac9f-afb864854ba2
   ┌─1─┐
1. │ 1  │
   └───┘
1 row in set. Elapsed: 0.001 sec.
```