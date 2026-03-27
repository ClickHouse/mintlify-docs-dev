---
sidebarTitle: 'Create your first Kafka ClickPipe'
description: 'Step-by-step guide to creating your first Kafka ClickPipe.'
slug: /integrations/clickpipes/kafka/create-your-first-kafka-clickpipe
sidebar_position: 1
title: 'Creating your first Kafka ClickPipe'
doc_type: 'guide'
keywords: ['create kafka clickpipe', 'kafka', 'clickpipes', 'data sources', 'setup guide']
---


> In this guide, we will walk you through the process of creating your first Kafka ClickPipe.

<Steps>

<Step>
## Navigate to data sources

Select the `Data Sources` button on the left-side menu and click on "Set up a ClickPipe".
<img src="/images/integrations/data-ingestion/clickpipes/cp_step0.png" alt="Select imports"/>
</Step>

<Step>
## Select a data source

Select your Kafka data source from the list.
<img src="/images/integrations/data-ingestion/clickpipes/cp_step1.png" alt="Select data source type"/>
</Step>

<Step>
## Configure the data source

Fill out the form by providing your ClickPipe with a name, a description (optional), your credentials, and other connection details.
<img src="/images/integrations/data-ingestion/clickpipes/cp_step2.png" alt="Fill out connection details"/>
</Step>

<Step>
## Configure a schema registry (optional)

A valid schema is required for Avro streams. See [Schema registries](./02_schema-registries.md) for more details on how to configure a schema registry.
</Step>

<Step>
## Configure a reverse private endpoint (optional)

Configure a Reverse Private Endpoint to allow ClickPipes to connect to your Kafka cluster using AWS PrivateLink.
See our [AWS PrivateLink documentation](../aws-privatelink.md) for more information.
</Step>

<Step>
## Select your topic

Select your topic and the UI will display a sample document from the topic.
<img src="/images/integrations/data-ingestion/clickpipes/cp_step3.png" alt="Set your topic"/>
</Step>

<Step>
## Configure your destination table

In the next step, you can select whether you want to ingest data into a new ClickHouse table or reuse an existing one. Follow the instructions in the screen to modify your table name, schema, and settings. You can see a real-time preview of your changes in the sample table at the top.

<img src="/images/integrations/data-ingestion/clickpipes/cp_step4a.png" alt="Set table, schema, and settings"/>

You can also customize the advanced settings using the controls provided

<img src="/images/integrations/data-ingestion/clickpipes/cp_table_settings.png" alt="Set advanced controls"/>
</Step>

<Step>
## Configure permissions

ClickPipes will create a dedicated user for writing data into a destination table. You can select a role for this internal user using a custom role or one of the predefined role:
- `Full access`: with the full access to the cluster. It might be useful if you use Materialized View or Dictionary with the destination table.
- `Only destination table`: with the `INSERT` permissions to the destination table only.

<img src="/images/integrations/data-ingestion/clickpipes/cp_step5.png" alt="Permissions"/>
</Step>

<Step>
## Complete setup

Clicking on "Create ClickPipe" will create and run your ClickPipe. It will now be listed in the Data Sources section.

<img src="/images/integrations/data-ingestion/clickpipes/cp_overview.png" alt="View overview"/>
</Step>

</Steps>
