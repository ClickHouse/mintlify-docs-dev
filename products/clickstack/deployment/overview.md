---
slug: /use-cases/observability/clickstack/deployment/overview
title: 'Deployment options'
description: 'ClickStack deployment options'
doc_type: 'guide'
keywords: ['ClickStack', 'observability', 'all-in-one', 'deployment']
---

<CardGroup cols={3}>
  <Card 
    title="All In One"
    href="/click-stack/use-cases/observability/clickstack/deployment/all-in-one"
  >
    Comprehensive Docker image bundling all ClickStack components. Suitable for demos and local testing of the full stack.
  </Card>
  <Card 
    title="ClickHouse Cloud"
    href="/click-stack/use-cases/observability/clickstack/deployment/hyperdx-clickhouse-cloud"
  >
    Designed for users who are using ClickHouse Cloud.
  </Card>
  <Card 
    title="Helm"
    href="/click-stack/use-cases/observability/clickstack/deployment/helm"
  >
    Deploy ClickStack with Helm, the recommended method for production deployments.
  </Card>
  <Card 
    title="Docker Compose"
    href="/click-stack/use-cases/observability/clickstack/deployment/docker-compose"
  >
    Combine and deploy separate ClickStack components locally using Docker Compose.
  </Card>
  <Card 
    title="HyperDX Only"
    href="/click-stack/use-cases/observability/clickstack/deployment/hyperdx-only"
  >
    Designed for users who already have a running ClickHouse instance populated with observability or event data.
  </Card>
  <Card 
    title="Local Mode Only"
    href="/click-stack/use-cases/observability/clickstack/deployment/local-mode-only"
  >
    Docker image bundles all ClickStack components with user authentication disabled for this distribution of HyperDX
  </Card>
</CardGroup>
