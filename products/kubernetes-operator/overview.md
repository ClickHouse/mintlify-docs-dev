---
title: 'ClickHouse Operator'
slug: /clickhouse-operator/overview
description: 'Overview page for the ClickHouse Operator - a Kubernetes operator that automates the deployment, configuration, and management of ClickHouse clusters and ClickHouse Keeper clusters on Kubernetes.'
keywords: ['kubernetes']
---

The ClickHouse Operator is a Kubernetes operator that automates the deployment, configuration, and management of ClickHouse clusters and ClickHouse Keeper clusters on Kubernetes.
It provides declarative cluster management through custom resources, enabling users to easily create highly-available ClickHouse deployments.

The Operator handles the full lifecycle of ClickHouse clusters including scaling, upgrades, and configuration management.

## Features

- **ClickHouse Cluster Management**: Create and manage ClickHouse clusters
- **ClickHouse Keeper Integration**: Built-in support for ClickHouse Keeper clusters for distributed coordination
- **Storage Provisioning**: Customizable persistent volume claims with storage class selection
- **High Availability**: Fault tolerant installations for ClickHouse and Keeper clusters
- **Security**: Built-in security features TLS/SSL support for secure cluster communication
- **Monitoring**: Prometheus metrics integration for observability

## Installation

Choose your preferred installation method:

- [Manifests Installation](/clickhouse-operator/install/kubectl) - Install using kubectl/kustomize
- [Helm Installation](/clickhouse-operator/install/helm) - Install using Helm charts
- [Operator Lifecycle Manager (OLM) Installation](/clickhouse-operator/install/olm) - Install using OLM

## Guides

- **[Introduction](/clickhouse-operator/guides/introduction)** - General overview of ClickHouse Operator concepts
- **[Configuration Guide](/clickhouse-operator/guides/configuration)** - Configure ClickHouse and Keeper clusters

## Reference

- **[API Reference](/clickhouse-operator/reference/api-reference)** - Complete API documentation for custom resources