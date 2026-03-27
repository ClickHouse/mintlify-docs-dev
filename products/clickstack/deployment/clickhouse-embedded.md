---
slug: /use-cases/observability/clickstack/deployment/clickhouse-embedded
title: 'Embedded in ClickHouse'
description: 'Using ClickStack embedded in ClickHouse Server - The ClickHouse Observability Stack'
doc_type: 'guide'
keywords: ['ClickStack embedded', 'ClickHouse embedded', 'ClickStack ClickHouse server', 'built-in observability']
---


ClickStack is bundled directly into the ClickHouse server binary. This means you can access the ClickStack UI (HyperDX) from your ClickHouse instance without deploying any additional components. This deployment is similar to the public demo at [play-clickstack.clickhouse.com](https://play-clickstack.clickhouse.com), but running against your own ClickHouse instance and data.

### Suitable for

* Trying ClickStack with minimal setup
* Exploring your own ClickHouse data with an observability UI
* Demos and evaluations

### Limitations

This embedded version is **not designed for production use**. The following features are not available compared to the [production-ready OSS deployments](/use-cases/observability/clickstack/deployment/oss):

- [Alerting](/use-cases/observability/clickstack/alerts)
- [Dashboard](/use-cases/observability/clickstack/dashboards) and [search](/use-cases/observability/clickstack/search) persistence — dashboards and saved searches are not retained across sessions
- Customizable query settings
- [Event patterns](/use-cases/observability/clickstack/event_patterns)

## Deployment steps

<Steps>

### Start ClickHouse

<Tabs>
<Tab title="Docker">

Pull and run the ClickHouse server image with a password set:

```shell
docker run --rm -it -p 8123:8123 -e CLICKHOUSE_PASSWORD=password clickhouse/clickhouse-server:head-alpine
```

:::tip Running without a password
If you prefer to run without a password, you must explicitly enable default access management:

```shell
docker run --rm -it -p 8123:8123 -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 clickhouse/clickhouse-server:head-alpine
```
:::

</Tab>
<Tab title="Binary">

Download and start ClickHouse:

```shell
curl https://clickhouse.com/ | sh

./clickhouse server
```

The `default` user has no password when running from the binary.

</Tab>
</Tabs>

### Navigate to the ClickStack UI

Open [http://localhost:8123](http://localhost:8123) in your browser and click **ClickStack**.

Enter your credentials. If using the Docker example above, the username is `default` and the password is `password`. If using the binary, the username is `default` with no password.

<img src="/images/clickstack/deployment/embedded/authenticate.png" alt="Authenticate" />

### Create a source

After logging in, you'll be prompted to create a data source. If you have existing OpenTelemetry tables, retain the default values and complete the `Table` field with the appropriate table name (e.g. `otel_logs`). All other settings should be auto-detected, allowing you to click `Save New Source`.

If you don't have data yet, see ["Ingesting data"](/use-cases/observability/clickstack/ingesting-data) for available options.

<img src="/images/clickstack/deployment/embedded/create-source.png" alt="Create Source" />

</Steps>

## Next steps

If you're ready to move beyond evaluation, consider a production-ready deployment:

- [All-in-One](/use-cases/observability/clickstack/deployment/all-in-one) — single container with all components, including persistence and authentication
- [Docker Compose](/use-cases/observability/clickstack/deployment/docker-compose) — individual components for more control
- [Helm](/use-cases/observability/clickstack/deployment/helm) — recommended for production Kubernetes deployments
- [Managed ClickStack](/use-cases/observability/clickstack/getting-started/managed) — fully managed on ClickHouse Cloud
