---
title: 'Best Practices'
old-slug: /best-practices
description: 'Best practices for designing and optimizing your ClickHouse tables and queries.'
---

<CardGroup cols={2}>
  <Card title="Choosing a Primary Key" icon="key" href="/concepts/best-practices/choosing-a-primary-key">
    How to select the right primary key for efficient queries and storage.
  </Card>
  <Card title="Select the Right Data Type" icon="list-check" href="/concepts/best-practices/select-data-type">
    Pick the most appropriate data types for your columns.
  </Card>
  <Card title="Use Materialized Views" icon="layer-group" href="/concepts/best-practices/use-materialized-views">
    Leverage materialized views to pre-aggregate and transform data.
  </Card>
  <Card title="Minimize & Optimize JOINs" icon="code-merge" href="/concepts/best-practices/minimize-optimize-joins">
    Strategies for reducing JOIN overhead and improving query speed.
  </Card>
  <Card title="Partitioning Keys" icon="table-cells" href="/concepts/best-practices/partitioning-keys">
    Choose a low-cardinality partitioning key for better performance.
  </Card>
  <Card title="Selecting an Insert Strategy" icon="arrow-right-to-bracket" href="/concepts/best-practices/selecting-an-insert-strategy">
    Batch inserts, async inserts, and other strategies for ingesting data.
  </Card>
  <Card title="Using Data Skipping Indices" icon="forward" href="/concepts/best-practices/using-data-skipping-indices">
    Skip unnecessary data granules to speed up queries.
  </Card>
  <Card title="Avoid Mutations" icon="ban" href="/concepts/best-practices/avoid-mutations">
    Why mutations are expensive and what to do instead.
  </Card>
  <Card title="Avoid OPTIMIZE FINAL" icon="triangle-exclamation" href="/concepts/best-practices/avoid-optimize-final">
    Understand the cost of unscheduled merges and alternatives.
  </Card>
  <Card title="Avoid Nullable Columns" icon="circle-xmark" href="/concepts/best-practices/avoidnullablecolumns">
    Use defaults instead of Nullable to improve performance.
  </Card>
  <Card title="JSON Type" icon="brackets-curly" href="/concepts/best-practices/json-type">
    Best practices for working with JSON data in ClickHouse.
  </Card>
</CardGroup>