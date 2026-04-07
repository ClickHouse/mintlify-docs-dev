---
title: "ClickHouse Private API"
slug: "docs/products/clickhouse-private/api"
---

### Introduction

#### Starting with the Clickhouse Private API

The Clickhouse Private API provides support for common operations to manage your Clickhouse Cluster, such as making backups or providing support
for vertical scaling.

It is a standalone optional component that can be added to your environment to simplify management.

#### Installation

The ClickHouse Private API is packaged as a Docker image and Helm chart that must be copied to your private ECR repository and installed in your EKS cluster.

##### Prerequisites

- ClickHouse Operator must be installed (see [Install Operator via Helm](/docs/products/clickhouse-private/aws#install-operator-via-helm))
- At least one ClickHouse cluster deployed (see [ClickHouseCluster CR](/docs/products/clickhouse-private/aws#clickhousecluster-cr))
- Access to ClickHouse private ECR repository
- Target ECR repository created in your AWS account:
  - `airgap-management`
  - `helm/airgap-management`

##### Copy ECR Artifacts for Private API

**We highly recommend using [skopeo](https://github.com/containers/skopeo) for copying the images** as it will retain all of the architectures in the docker images. Be sure to set the `TARGET_REGION` and `TARGET_ECR_REPO` below to your ECR region and host.

```bash
SOURCE_REGION=us-east-1
SOURCE_ECR_REPO=349290138304.dkr.ecr.$SOURCE_REGION.amazonaws.com

TARGET_REGION=us-west-2
TARGET_ECR_REPO=0000000000.dkr.ecr.$TARGET_REGION.amazonaws.com

# log into our ECR
aws ecr get-login-password --region $SOURCE_REGION | skopeo login --username AWS --password-stdin $SOURCE_ECR_REPO

# log into the target AWS repo
aws ecr get-login-password --region $TARGET_REGION | skopeo login --username AWS --password-stdin $TARGET_ECR_REPO

# copy each image to target ECR, be sure to include the --all flag
skopeo copy --all docker://$SOURCE_ECR_REPO/airgap-management:<<API_TAG>> docker://$TARGET_ECR_REPO/airgap-management:<<API_TAG>>
skopeo copy --all docker://$SOURCE_ECR_REPO/helm/airgap-management:<<API_HELM_TAG>> docker://$TARGET_ECR_REPO/helm/airgap-management:<<API_HELM_TAG>>
```

##### Install Private API via Helm

The Private API should be installed in a dedicated namespace. Update the ECR host, version tags, and authentication settings as needed.

```bash
# update ECR_HOST as needed
ECR_HOST=0000000000.dkr.ecr.us-west-2.amazonaws.com

# should use the version of the API's helm chart
API_HELM_VERSION=<<API_HELM_TAG>>

# set the API image tag
API_IMAGE_TAG=<<API_TAG>>

helm install clickhouse-private-api \
   oci://$ECR_HOST/helm/airgap-management \
   --version=$API_HELM_VERSION \
   --create-namespace \
   -n clickhouse-private-api \
   --set-json="image.repository=\"$ECR_HOST/airgap-management\"" \
   --set-json="image.tag=\"$API_IMAGE_TAG\""
```

**Note on Authentication:**
- By default, basic authentication is disabled. For production environments, it is possible to enable basic authentication by setting `api.basicAuth.enabled=true` and providing secure credentials.
- The username and password should be stored securely and rotated regularly according to your organization's security policies.

##### Verify Installation

Check that the Private API pod is running:

```bash
kubectl get pods -n clickhouse-private-api
```

You should see output similar to:

```
NAME                                    READY   STATUS    RESTARTS   AGE
clickhouse-private-api-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
```

Verify the API is accessible by port-forwarding the service:

```bash
kubectl port-forward svc/clickhouse-private-api-airgap-management 8080:8080 -n clickhouse-private-api
```

Test the API health endpoint:

```bash
curl http://localhost:8080/readiness
```

If authentication is enabled, include credentials:

```bash
curl -u admin:YOUR_SECURE_PASSWORD_HERE http://localhost:8080/readiness
```

##### Configuration Options

The following key configuration options are available via Helm values:

- `image.repository`: ECR repository for the Private API image
- `image.tag`: Image tag to deploy
- `api.port`: Port on which the API listens (default: 8080)
- `api.basicAuth.enabled`: Enable HTTP basic authentication (default: false)
- `api.basicAuth.username`: Username for basic auth (default: "admin")
- `api.basicAuth.password`: Password for basic auth (default: "changeme")
- `serviceAccount.enabled`: Create a service account for the API (default: true)
- `serviceAccount.annotations`: Annotations for the service account (e.g., for IRSA)

For a complete list of configuration options, refer to the Helm chart's `README.md`.

### API Tutorials

#### Tutorial: Managing backups through the API

The Clickhouse Private API provides support to simplify managing backups. The `api/v1/backups` REST resource is available to interact with
backups of a deployed Clickhouse Cluster.

For this guide we will assume you can reach the API via `http://localhost:8080/`, for example by port-forwarding the Kubernetes pod. We will be using [curl](https://curl.se/) to interact with the API and make HTTP requests. We will also assume a Clickhouse Cluster named default-xx-01 was deployed (see [the setup guide](/docs/products/clickhouse-private/aws) for more details on how to deploy a Clickhouse Cluster).

Let's first create a backup. Create a full backup as follows:

backup.json
```json
{
    "incremental": false
}
```

CURL command
```sh
curl -X POST "http://localhost:8080/api/v1/backups?instance_id=default-xx-01" \
    -H "Content-Type: application/json" \
    --data-binary "@backup.json"
```

To specify the Clickhouse Cluster on which to create the backup, the `instance_id` query parameter is used. This using the Clickhouse Cluster name used during the deployment.

This will create a full backup as opposed to an incremental backup, as specified by the `incremental` field in the body. Additionally the backupObject can be used to specify what tables or databases you want to backup. In this case, we use `type` Common, indicating all tables and databases.

The response will contain information on the created backup, including a UUID that can be used to refer to the backup.

Behind the scenes the API will create a `Backup` object inside of the namespace of the Clickhouse Cluster.
The Clickhouse Operator will watch for the `Backup` in the Clickhouse Cluster namespace and if a new `Backup` object is created, the operator will execute the relevant Backup SQL statement on the cluster and monitor the status (using the system tables).

That UUID of the backup can be used to monitor the state of the backup through the API:

```sh
curl "http://localhost:8080/api/v1/backups/{uuid}?instance_id=default-xx-01
```

This will return the backup object, and the `status` field can be used to obtain information on the backup. If the backup completed successfully, the `state` field will return `Ready`.

Additionally, you can watch all backups created as follows:

```sh
curl "http://localhost:8080/api/v1/backups?instance_id=default-xx-01"
```

#### Tutorial: Vertically scaling Clickhouse clusters through the API

The Clickhouse Private API provides support to vertically scale your Clickhouse Cluster by adjusting CPU and memory resources. The `api/v1/instances/{instance_id}/scale` REST resource is available to modify the resource allocation of a deployed Clickhouse Cluster.

For this guide we will assume you can reach the API via `http://localhost:8080/`, for example by port-forwarding the Kubernetes pod. We will be using [curl](https://curl.se/) to interact with the API and make HTTP requests. We will also assume a Clickhouse Cluster named default-xx-01 was deployed (see [the setup guide](/docs/products/clickhouse-private/aws) for more details on how to deploy a Clickhouse Cluster).

Let's scale a cluster by adjusting its resources. Create a scale request as follows:

scale.json
```json
{
  "vertical": {
    "resources": {
        "cpu": "4",
        "memory": "16Gi"
    }
  }
}
```

CURL command
```sh
curl -X POST "http://localhost:8080/api/v1/instances/default-xx-01/scale" \
    -H "Content-Type: application/json" \
    --data-binary "@scale.json"
```

To specify the Clickhouse Cluster to scale, the `instance_id` path parameter is used. This uses the Clickhouse Cluster name used during the deployment.

The `resources` field specifies the CPU and memory allocation for the cluster. Both CPU and memory are specified using Kubernetes resource quantity format (e.g., "4" for 4 CPU cores, "16Gi" for 16 gibibytes of memory).

**Important**: The API enforces a 1:4 CPU to memory ratio (1 CPU core per 4 GiB of memory) with a 5% margin. If you provide only one resource type, the API will automatically derive the other to maintain this ratio. For example, specifying only `"memory": "16Gi"` will automatically set CPU to 4 cores.

Clickhouse scales great with added resources and generally it is recommended to scale Clickhouse up before considering scaling out (Horizontal Scaling). Clickhouse will use every core available to improve the query performance.

Behind the scenes, the API will update the `ServerPodPolicy` of the `ClickhouseCluster`  custom resource in Kubernetes. The Clickhouse Operator will detect this change and trigger a rolling-restart of the Stateful Sets managing the Clickhouse server with the new resource allocation.

**Important**: Unlike Clickhouse cloud, in Clickhouse Private the vertical scaling feature does not use [Make Before Break (MBB) scaling](https://clickhouse.com/docs/manage/scaling#how-scaling-works-in-clickhouse-cloud). This means that potentially vertical scaling can cause disruptions to the service as a rolling restart is applied to the StatefulSets managing the Clickhouse Server.

#### Tutorial: Resetting the main Clickhouse user password.

The Clickhouse Private API provides support to reset the password for ClickHouse cluster users. The `api/v1/instances/{instance_id}/reset-user-password` endpoint is available to update user credentials on a deployed Clickhouse Cluster.

For this guide we will assume you can reach the API via `http://localhost:8080/`, for example by port-forwarding the Kubernetes pod. We will be using [curl](https://curl.se/) to interact with the API and make HTTP requests. We will also assume a Clickhouse Cluster named default-xx-01 was deployed (see [the setup guide](/docs/products/clickhouse-private/aws) for more details on how to deploy a Clickhouse Cluster).

**Important**: Password resets cannot be performed on Hydra child instances. If you need to reset the password for a Hydra child instance, you must reset it on the parent instance instead.

Before resetting the password, you need to generate a hashed password. The API requires the password to be hashed using SHA-256 (or another supported hashing function) and then base64-encoded. Generate the hashed password as follows:

```sh
# this will be the new password for the user
PASSWORD='My super secret p@$$w0rd'
HASHED_PASSWORD=$(echo -n $PASSWORD | shasum -a 256 | awk '{printf $1}' | base64)
```

Now create a password reset request. The request body should contain the hashed password:

password_reset.json
```json
{
  "user_hashed_password": "<base64-encoded-sha256-hash>",
  "hashing_function": "sha256",
  "username": "default"
}
```

The fields are:
- `user_hashed_password` (required): The base64-encoded hash of the new password
- `hashing_function` (optional): The hashing algorithm used. Defaults to `"sha256"` if not provided
- `username` (optional): The username to reset the password for. Defaults to `"default"` if not provided

CURL command:
```sh
curl -X POST "http://localhost:8080/api/v1/instances/default-xx-01/reset-user-password" \
    -H "Content-Type: application/json" \
    --data-binary "@password_reset.json"
```

To specify the Clickhouse Cluster to reset the password for, the `instance_id` path parameter is used. This uses the Clickhouse Cluster name used during the deployment.

If the request is successful, you will receive a response:
```json
{
  "message": "User password reset successfully"
}
```

Behind the scenes, the API updates the `CustomerAccount` field in the `ClickhouseCluster` custom resource in Kubernetes. The Clickhouse Operator will detect this change and update the user credentials in the ClickHouse cluster accordingly.

**Note**: The password reset will take effect after the operator processes the change. You can verify the password was updated by attempting to connect to the cluster with the new password.

### How-To

#### How-to: Check the current state of a Clickhouse Cluster and monitor state transitions.

The Clickhouse Private API exposes an endpoint: `http://{api_base_url}/api/v1/instances/{instance_id}/status` to validate the current state of the specified Clickhouse Cluster.

The status endpoint returns a JSON with the following fields:
- `state`: the current state of the Clickhouse Cluster.
- `previousState`: The state the Clikckhouse Cluster transitioned from.
- `message`: The message associated with the state transition. This contains details on why the cluster transitioned stated.
- `stateProvidedBy`: Which process was responisible for causing the state transition.

There are several cases where this endpoint can be useful. For example:
- You triggered a vertical scaling operation through the API and want to know if the operator has completed the scaling operation.
- You reset the user password and want to know whether the API has applied the changes to the entire cluster.

#### How-to: Incremental Backups

Incremental backups can be used to only backup all data since the last backup. This reduces the total storage needed to

Incremental backups are always created as a chain of backups, where each backup refers the last backup, with a full backup as the starting point.

They can be created as follows, assuming you have already created a previous backup:

```json
{
    "incremental": true,
    "baseBackupUuid": <uuid of previous backup>
}
```

```sh
curl -X POST "http://localhost:8080/api/v1/backups?instance_id=default-xx-01" \
    -H "Content-Type: application/json" \
    --data-binary "@backup.json"
```

To find the last successful backup & find the UUID, the List backups API (`http://localhost:8080/api/v1/backups`) supports query parameters to find the last successful backup: `http://localhost:8080/api/v1/backups?instance_id=default-xx-01&status__state__eq=Ready&sort=status__effictiveFinishTime&limit=1 | jq -r '.[].id'`.

#### How-to: Scheduling Backups

Scheduling backups is simple using Kubernetes CronJobs:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: clickhouse-daily-backup
  namespace: clickhouse-private-api
spec:
  schedule: "0 2 * * *"  # Run daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: curlimages/curl:latest
            command:
            - /bin/sh
            - -c
            - |
              curl -X POST "http://clickhouse-private-api-airgap-management:8080/api/v1/backups?instance_id=default-xx-01" \
                -H "Content-Type: application/json" \
                -d '{
                  "incremental": false
                }'
          restartPolicy: OnFailure
```

The above CronJob schedules a full backup to be handled daily at 2 AM. It assumes the Private API is reachable via `http://clickhouse-private-api-airgap-management:8080`.

#### How-To: Backing up only specific tables or databases

It is possible to control what tables & databases get backed up. This is controlled through the `databases` and `tables`
fields in the request body.

Note that for the `tables` field, fully qualified table names are required (i.e. `db.table`).

To create a backup with only specific databases and tables, use the following request:

```json
{
    "incremental": false,
    "databases": ["mydb"],
    "tables": ["mydb2.table"]
}
```

```sh
curl -X POST "http://localhost:8080/api/v1/backups?instance_id=default-xx-01" \
    -H "Content-Type: application/json" \
    --data-binary "@backup.json"
```

#### How-To: Restoring Backups

For restoration of Backups it is recommended to spin up a new Clickhouse Cluster (following the steps to [create a ClickhouseCluster resource](/docs/products/clickhouse-private/aws#clickhousecluster-cr)) and restore to the new Cluster to avoid overloading the original Cluster.

The API exposes an endpoint `api/v1/backups/<uuid>/restore?instance_id=default-xx-01&target_instance_id=default-xx-02` that triggers a restoration of the given backup on the target instance. This will perform a `RESTORE ALL` of the backup on the target instance.

For safety reasons this API disallows restoration on the same instance.

Alternatively, you can manually restore a backup, which gives more fine-grained control over what to restore. For example database `example` you can run the following SQL statement:

```sql
RESTORE DATABASE example
AS example_restored
FROM S3('https://<bucket_name>.s3.amazonaws.com/backups/<uuid>')
```

This will restore database `example` from the backup with the given uuid as a new database named `example_restored`.

#### How-To: Manage the Lifecycle of Backups on S3

To manage the lifecycle of backups, there are several considerations to take into account:

- How long do you want to retain your backups? E.g. do you need to keep historical backups for compliance reasons? How much are you willing to pay for the storage?
- If you created incremental backups, ensuring the full backup chain is available.

In general two approaches exist for managing lifecycles on S3:
- Using S3 Lifecycles
- Manually deleting Backups, e.g. using a cronjob.

An example Lifecycle Policy on S3 can be found below:

```json
{
  "Rules": [
    {
      "ID": "ClickHouseBackupLifecycle",
      "Prefix": "backups/",
      "Status": "Enabled",
      "Transitions": [
        { "Days": 7, "StorageClass": "STANDARD_IA" },
        { "Days": 30, "StorageClass": "GLACIER_IR" }
      ],
      "Expiration": { "Days": 90 }
    }
  ]
}
```

This backup moves any backup after 7 days to a lower S3 tier (Intelligent Archive) and to Glacier after 30 days. After 90 days the backups will deleted.

S3 Lifecycle Policies are not able to monitor the backups that are part of a backup chain. E.g. if in the above example we had deleted backups after 7 days and only made a full
backup every 14 days, we would break the backup chain and this leads to broken backups.

Therefore we recommend to be careful in how you choose to implement the Lifecycle management of your backups and it is always a good idea to regularly test if you can restore your backups.

#### How-To: Understanding resource quantity formats

The API accepts Kubernetes resource quantity formats for CPU and memory:

**CPU quantities:**
- Integer values: `"4"` (4 CPU cores)
- Decimal values: `"2.5"` (2.5 CPU cores)
- Millicores: `"500m"` (0.5 CPU cores)

**Memory quantities:**
- Binary units: `"16Gi"` (16 gibibytes), `"4096Mi"` (4096 mebibytes)
- Decimal units: `"16G"` (16 gigabytes), `"16000M"` (16000 megabytes)

Note that binary units (Ki, Mi, Gi) are recommended for memory to align with Kubernetes conventions.