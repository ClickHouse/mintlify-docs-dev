---
description: 'Step-by-step guide to create your first BigQuery ClickPipe.'
slug: /integrations/clickpipes/bigquery/get-started
title: 'Creating your first BigQuery ClickPipe'
---


## Pre-requisites

* You must have privileges to manage [service accounts](https://docs.cloud.google.com/iam/docs/service-account-overview) and [IAM roles](https://docs.cloud.google.com/iam/docs/roles-overview) in your GCP project, or get assistance from an administrator. We recommend creating a dedicated service account with the minimum required set of [permissions](/integrations/clickpipes/bigquery/overview#permissions) following the [official documentation](https://docs.cloud.google.com/iam/docs/service-accounts-create).

* The initial load process requires a user-provided Google Cloud Storage (GCS) bucket for staging. We recommend creating a dedicated bucket for your ClickPipe following the [official documentation](https://docs.cloud.google.com/storage/docs/creating-buckets). In the future, the intermediary bucket will be provided and managed by ClickPipes.

## 1. Select the data source

1. In ClickHouse Cloud, select **Data sources** in the main navigation menu and click **Create ClickPipe**.

    <Image img={require('./images/cp_step0.png')} alt="Select imports" size="lg" border/>

2. Click the **BigQuery** tile.

    <Image img={require('./images/cp_step1.png')} alt="Select BigQuery tile" size="lg" border/>

## 2. Setup your ClickPipe connection

To setup a new ClickPipe, you must provide details on how to connect to and authenticate with your BigQuery data warehouse, as well as a staging GCS bucket.

1. Upload the `.json` key for the service account you created for ClickPipes. Ensure the service account has the minimum required set of [permissions](/integrations/clickpipes/bigquery/overview#permissions).

    <Image img={require('./images/cp_step2.png')} alt="Upload service account key" size="lg" border/>

2. Select the **Replication method**. In Private Preview, the only supported option is [**Initial load only**](/integrations/clickpipes/bigquery/overview#initial-load).

3. Provide the path to the GCS bucket for staging data during the initial load.

4. Click **Next** to validate.

## 3. Configure your ClickPipe

Depending on the size of your BigQuery dataset, or the total size of the tables you want to sync, you might need to adjust the default ingestion settings for the ClickPipe.

## 4. Configure tables

1. Select the ClickHouse database where you want the BigQuery tables to be replicated to. You can select an existing database or create a new one.

2. Select the tables and, optionally, the columns you want to replicate. Only datasets that the provided service account has access to will be listed.

    <Image img={require('./images/cp_step3.png')} alt="Permissions" size="lg" border/>

3. For each selected table, make sure to define a custom sorting key under **Advanced settings** > **Use a custom sorting key**. In the future, the sorting key will be automatically inferred based on existing clustering or partitioning keys in the upstream database.

    <Warning>
    You **must** define a sorting key for the replicated tables in order to optimize query performance in ClickHouse. Otherwise, the sorting key will be set as `tuple()`, which means no primary index will be created and ClickHouse will perform full table scans for all queries on the table.
    </Warning>

    <Image img={require('./images/cp_step4.png')} alt="Permissions" size="lg" border/>

## 5. Configure permissions

Finally, you can configure permissions for the internal ClickPipes user.

**Permissions:** ClickPipes will create a dedicated user for writing data into a destination table. You can select a role for this internal user using a custom role or one of the predefined roles:
- `Full access`: full access to the cluster. Required if you use materialized views or dictionary with the destination table.
- `Only destination`: insert permissions to the destination table only.

## 6. Complete setup

Click **Create ClickPipe** to complete the setup. You'll be redirected to the overview page, where you can the progress of the initial load and click through to see the details for your BigQuery ClickPipes.

<Image img={require('./images/cp_step5.png')} alt="Permissions" size="lg" border/>