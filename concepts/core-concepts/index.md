---
slug: /managing-data/core-concepts
title: 'Core Concepts'
description: 'Learn Core Concepts of how ClickHouse works'
keywords: ['concepts', 'part', 'partition', 'primary index']
doc_type: 'guide'
---

Learn some of the core concepts of how ClickHouse works.

<CardGroup cols={2}>
  <Card title="Table Parts" icon="puzzle-piece" href="/docs/concepts/core-concepts/parts">
    Learn what table parts are in ClickHouse.
  </Card>
  <Card title="Table Partitions" icon="table-cells-large" href="/docs/concepts/core-concepts/partitions">
    Learn what table partitions are and what they're used for.
  </Card>
  <Card title="Table Part Merges" icon="code-merge" href="/docs/concepts/core-concepts/merges">
    Learn what table part merges are and what they're used for.
  </Card>
  <Card title="Primary Indexes" icon="key" href="/docs/concepts/core-concepts/primary-indexes">
    How ClickHouse's sparse primary index efficiently skips unnecessary data during query execution.
  </Card>
  <Card title="Query Parallelism" icon="arrows-split-up-and-left" href="/docs/concepts/core-concepts/query-parallelism">
    How ClickHouse parallelizes query execution for maximum performance.
  </Card>
  <Card title="Architectural Overview" icon="sitemap" href="/docs/concepts/core-concepts/academic_overview">
    A concise academic overview of the ClickHouse architecture, based on the VLDB 2024 paper.
  </Card>
</CardGroup>
