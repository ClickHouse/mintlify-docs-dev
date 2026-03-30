---
sidebar_label: 'Artie'
sidebar_position: 12
keywords: ['clickhouse', 'Artie', 'connect', 'integrate', 'cdc', 'etl', 'data integration', 'real-time', 'streaming']
slug: /integrations/artie
description: 'Stream data into ClickHouse using Artie CDC streaming platform'
title: 'Connect Artie to ClickHouse'
doc_type: 'guide'
---



<a href="https://www.artie.com/" target="_blank">Artie</a> is fully managed real-time data streaming platform that replicates production data into ClickHouse, unlocking customer-facing analytics, operational workflows, and Agentic AI in production.

## Overview

Artie is the modern data infrastructure layer for the AI era — a fully managed real-time data streaming platform that keeps production data continuously in sync with your warehouse.

As companies activate their warehouses for real-time AI workloads, operational analytics, and customer-facing data products, they're standardizing on infrastructure that's fast, reliable, and built for scale.

We give companies the kind of streaming pipelines and deep observability that Netflix, DoorDash, and Instacart built in-house, without hiring 10+ engineers and spending 1-2 years on platform work. Artie automates the entire ingestion lifecycle — change capture, merges, backfills, and observability — with zero engineering maintenance and deploys in minutes.

Leaders like ClickUp, Substack, and Alloy use Artie not just to solve today's pipeline issues, but to future-proof their data stack as their AI strategy accelerates.


## Create an Artie account

Visit <a href="https://www.artie.com/contact" target="_blank">artie.com/contact</a> and complete the form to request access.


## Find your ClickHouse credentials

After creating a service in ClickHouse Cloud, find the following required settings:


## Create a new pipeline in Artie

Head over to Artie with the information you have gathered from previous steps and create a new pipeline by following a 3 step process.

1. **Connect your source** - Configure your source database (Postgres, MySQL, Events API, etc)
2. **Choose the tables you want to replicate** - Select which tables to sync to ClickHouse
3. **Connect your destination** - Enter your ClickHouse credentials



## Contact Us

If you have any questions, please refer to our <a href="https://www.artie.com/docs/destinations/clickhouse" target="_blank">ClickHouse docs</a> or reach out to the team at <a href="mailto:hi@artie.com">hi@artie.com</a>.

## Product Screenshots

Analytics Portal

Pipeline and table specific monitors

Daily schema change notifications
