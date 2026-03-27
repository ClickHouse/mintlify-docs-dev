---
slug: /cloud/features/autoscaling/horizontal
description: 'Manual horizontal scaling in ClickHouse Cloud'
keywords: ['horizontal scaling', 'scaling', 'replicas', 'manual scaling', 'spikes', 'bursts']
title: 'Horizontal Scaling'
---

## Manual horizontal scaling

You can use ClickHouse Cloud [public APIs](https://clickhouse.com/docs/cloud/manage/api/swagger#/paths/~1v1~1organizations~1:organizationId~1services~1:serviceId~1scaling/patch) to scale your service by updating the scaling settings for the service or adjust the number of replicas from the cloud console.

**Scale** and **Enterprise** tiers also support single-replica services. Services once scaled out, can be scaled back in to a minimum of a single replica. Note that single replica services have reduced availability and aren't recommended for production usage.

<Note>
Services can scale horizontally to a maximum of 20 replicas. If you need additional replicas, please contact our support team.
</Note>

### Horizontal scaling via API

To horizontally scale a cluster, issue a `PATCH` request via the API to adjust the number of replicas. The screenshots below show an API call to scale out a `3` replica cluster to `6` replicas, and the corresponding response.

![Scaling PATCH request](/images/cloud/manage/scaling-patch-request.png)

*`PATCH` request to update `numReplicas`*

![Scaling PATCH response](/images/cloud/manage/scaling-patch-response.png)

*Response from `PATCH` request*

If you issue a new scaling request or multiple requests in succession, while one is already in progress, the scaling service will ignore the intermediate states and converge on the final replica count.

### Horizontal scaling via UI

To scale a service horizontally from the UI, you can adjust the number of replicas for the service on the **Settings** page.

![Scaling configuration settings](/images/cloud/manage/scaling-configure.png)

*Service scaling settings from the ClickHouse Cloud console*

Once the service has scaled, the metrics dashboard in the cloud console should show the correct allocation to the service. The screenshot below shows the cluster having scaled to total memory of `96 GiB`, which is `6` replicas, each with `16 GiB` memory allocation.

![Scaling memory allocation](/images/cloud/manage/scaling-memory-allocation.png)

## Handling spikes in workload

If you have an upcoming expected spike in your workload, you can use the
[ClickHouse Cloud API](/cloud/manage/api/api-overview) to
preemptively scale up your service to handle the spike and scale it down once
the demand subsides.

To understand the current CPU cores and memory in use for
each of your replicas, you can run the query below:

```sql
SELECT *
FROM clusterAllReplicas('default', view(
    SELECT
        hostname() AS server,
        anyIf(value, metric = 'CGroupMaxCPU') AS cpu_cores,
        formatReadableSize(anyIf(value, metric = 'CGroupMemoryTotal')) AS memory
    FROM system.asynchronous_metrics
))
ORDER BY server ASC
SETTINGS skip_unavailable_shards = 1
```
