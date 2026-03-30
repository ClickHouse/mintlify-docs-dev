---
description: 'Step-by-step guide to create your first Google Cloud Storage ClickPipe.'
slug: /integrations/clickpipes/object-storage/gcs/get-started
title: 'Creating your first Google Cloud Storage ClickPipe'
---


The GCS ClickPipe provides a fully-managed and resilient way to ingest data from Google Cloud Storage (GCS). It supports both **one-time** and **continuous ingestion** with exactly-once semantics.

GCS ClickPipes can be deployed and managed manually using the ClickPipes UI, as well as programmatically using [OpenAPI](https://clickhouse.com/docs/cloud/manage/api/swagger#tag/ClickPipes/paths/~1v1~1organizations~1%7BorganizationId%7D~1services~1%7BserviceId%7D~1clickpipes/post) and [Terraform](https://registry.terraform.io/providers/ClickHouse/clickhouse/3.8.1-alpha1/docs/resources/clickpipe).

## Select the data source

**1.** In ClickHouse Cloud, select **Data sources** in the main navigation menu and click **Create ClickPipe**.

<Image src="/images/integrations/data-ingestion/clickpipes/cp_step0.png" alt="Select imports" width="600" />

**2.** Click the **Google Cloud Storage** tile.

<Image src="/images/integrations/data-ingestion/clickpipes/object-storage/google-cloud-storage/cp_step1.png" alt="Select imports" width="600" />

## Setup your ClickPipe connection

**1.** To setup a new ClickPipe, you must provide details on how to connect to and authenticate with your object storage service.

<Image src="/images/integrations/data-ingestion/clickpipes/object-storage/azure-blob-storage/cp_step2.png" alt="Fill out connection details" width="600" />

* **GCS file path**: The GCS ClickPipe uses the Cloud Storage [XML API](https://docs.cloud.google.com/storage/docs/interoperability) for interoperability, which requires the `storage.googleapis.com` endpoint:

    ```bash
    https://storage.googleapis.com/bucket-name/key-name
    ```

    You can use POSIX wildcards to match multiple files or prefixes. See the [reference documentation](/integrations/clickpipes/object-storage/gcs/overview#file-pattern-matching) for guidance on supported patterns.

**2.** Click **Incoming data**. ClickPipes will fetch metadata from your bucket for the next step.

## Select data format

The UI will display a list of files in the specified bucket.
Select your data format (we currently support a subset of ClickHouse formats) and if you want to enable continuous ingestion.
See the "continuous ingest" section in the overview page for more details.

<Image src="/images/integrations/data-ingestion/clickpipes/cp_step3_object_storage.png" alt="Set data format and topic" width="600" />

## Configure table, schema and settings

In the next step, you can select whether you want to ingest data into a new ClickHouse table or reuse an existing one.
Follow the instructions in the screen to modify your table name, schema, and settings.
You can see a real-time preview of your changes in the sample table at the top.

<Image src="/images/integrations/data-ingestion/clickpipes/cp_step4a.png" alt="Set table, schema, and settings" width="600" />

You can also customize the advanced settings using the controls provided

<Image src="/images/integrations/data-ingestion/clickpipes/cp_step4a3.png" alt="Set advanced controls" width="600" />

Alternatively, you can decide to ingest your data in an existing ClickHouse table.
In that case, the UI will allow you to map fields from the source to the ClickHouse fields in the selected destination table.

<Image src="/images/integrations/data-ingestion/clickpipes/cp_step4b.png" alt="Use an existing table" width="600" />

<Info>
You can also map [virtual columns](/sql-reference/table-functions/s3#virtual-columns), like `_path` or `_size`, to fields.
</Info>

## Configure permissions

Finally, you can configure permissions for the internal ClickPipes user.

**Permissions:** ClickPipes will create a dedicated user for writing data into a destination table. You can select a role for this internal user using a custom role or one of the predefined role:
- `Full access`: with the full access to the cluster. Required if you use materialized view or Dictionary with the destination table.
- `Only destination table`: with the `INSERT` permissions to the destination table only.

<Image src="/images/integrations/data-ingestion/clickpipes/cp_step5.png" alt="Permissions" width="600" />

## Complete setup

By clicking on "Complete Setup", the system will register your ClickPipe, and you'll be able to see it listed in the summary table.

<Image src="/images/integrations/data-ingestion/clickpipes/cp_success.png" alt="Success notice" width="300" />

<Image src="/images/integrations/data-ingestion/clickpipes/cp_remove.png" alt="Remove notice" width="600" />

The summary table provides controls to display sample data from the source or the destination table in ClickHouse

<Image src="/images/integrations/data-ingestion/clickpipes/cp_destination.png" alt="View destination" width="600" />

As well as controls to remove the ClickPipe and display a summary of the ingest job.

<Image src="/images/integrations/data-ingestion/clickpipes/cp_overview.png" alt="View overview" width="600" />

**Congratulations!** you have successfully set up your first ClickPipe.
If this is a ClickPipe configure for continuous ingestion, it will be continuously running, ingesting data in real-time from your remote data source.
Otherwise, it will ingest the batch and complete.