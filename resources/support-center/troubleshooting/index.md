---
slug: /troubleshooting
sidebar_label: 'Troubleshooting'
doc_type: 'guide'
keywords: [
  'clickhouse troubleshooting',
  'clickhouse errors',
  'database troubleshooting',
  'clickhouse connection issues',
  'memory limit exceeded',
  'clickhouse performance problems',
  'database error messages',
  'clickhouse configuration issues',
  'connection refused error',
  'clickhouse debugging',
  'database connection problems',
  'troubleshooting guide'
]
title: 'Troubleshooting Common Issues'
description: 'Find solutions to the most common ClickHouse problems including slow queries, memory errors, connection issues, and configuration problems.'
---


Having problems with ClickHouse? Find the solutions to common issues here.

## Performance and errors

Queries running slowly, timeouts, or getting specific error messages like "Memory limit exceeded" or "Connection refused."

<details>
<summary><strong>Show performance and error solutions</strong></summary>

### Query performance
- [Find which queries are using the most resources](/knowledgebase/find-expensive-queries)
- [Complete query optimization guide](/optimize/query-optimization)
- [Optimize JOIN operations](/best-practices/minimize-optimize-joins)
- [Run diagnostic queries to find bottlenecks](/knowledgebase/useful-queries-for-troubleshooting)
<br/>
### Data insertion performance
- [Speed up data insertion](/optimize/bulk-inserts)
- [Set up asynchronous inserts](/optimize/asynchronous-inserts)
<br/>
### Advanced analysis tools
{/* - [Profile with LLVM XRay](/knowledgebase/profiling-clickhouse-with-llvm-xray) */}
- [Check what processes are running](/knowledgebase/which-processes-are-currently-running)
- [Monitor system performance](/operations/system-tables/processes)
<br/>
### Error messages
- **"Memory limit exceeded"** → [Debug memory limit errors](/guides/developer/debugging-memory-issues)
- **"Connection refused"** → [Fix connection problems](#connections-and-authentication)
- **"Login failures"** → [Set up users, roles, and permissions](/operations/access-rights)
- **"SSL certificate errors"** → [Fix certificate problems](/knowledgebase/certificate_verify_failed_error)
- **"Table/database errors"** → [Database creation guide](/sql-reference/statements/create/database) | [Table UUID problems](/engines/database-engines/atomic)
- **"Network timeouts"** → [Network troubleshooting](/interfaces/http)
- **Other issues** → [Track errors across your cluster](/operations/system-tables/errors)
</details>

## Memory and resources

High memory usage, out-of-memory crashes, or need help sizing your ClickHouse deployment.

<details>
<summary><strong>Show memory solutions</strong></summary>

### Memory debugging and monitoring:

- [Identify what's using memory](/guides/developer/debugging-memory-issues)
- [Check current memory usage](/operations/system-tables/processes)
- [Memory allocation profiling](/operations/allocation-profiling)
- [Analyze memory usage patterns](/operations/system-tables/query_log)
<br/>
### Memory configuration:

- [Configure memory limits](/operations/settings/memory-overcommit)
- [Server memory settings](/operations/server-configuration-parameters/settings)
- [Session memory settings](/operations/settings/settings)
<br/>
### Scaling and sizing:

- [Right-size your service](/operations/tips)
- [Configure automatic scaling](/manage/scaling)

</details>

## Connections and Authentication

Can't connect to ClickHouse, authentication failures, SSL certificate errors, or client setup issues.

<details>
<summary><strong>Show connection solutions</strong></summary>

### Basic Connection issues
- [Fix HTTP interface issues](/interfaces/http)
- [Handle SSL certificate problems](/knowledgebase/certificate_verify_failed_error)
- [User authentication setup](/operations/access-rights)
<br/>
### Client interfaces
- [Native ClickHouse clients](/interfaces/natives-clients-and-interfaces)
- [MySQL interface problems](/interfaces/mysql)
- [PostgreSQL interface issues](/interfaces/postgresql)
- [gRPC interface configuration](/interfaces/grpc)
- [SSH interface setup](/interfaces/ssh)
<br/>
### Network and data
- [Network security settings](/operations/server-configuration-parameters/settings)
- [Data format parsing issues](/interfaces/formats)

</details>

## Setup and configuration

Initial installation, server configuration, database creation, data ingestion issues, or replication setup.

<details>
<summary><strong>Show setup and configuration solutions</strong></summary>

### Initial setup
- [Configure server settings](/operations/server-configuration-parameters/settings)
- [Set up security and access control](/operations/access-rights)
- [Configure hardware properly](/operations/tips)
<br/>
### Database management
- [Create and manage databases](/sql-reference/statements/create/database)
- [Choose the right table engine](/engines/table-engines)
{/* - [Modify schemas safely](/sql-reference/statements/alter/index) */}
<br/>
### Data operations
- [Optimize bulk data insertion](/optimize/bulk-inserts)
- [Handle data format problems](/interfaces/formats)
- [Set up streaming data pipelines](/optimize/asynchronous-inserts)
- [Improve S3 integration performance](/integrations/s3/performance)
<br/>
### Advanced configuration
- [Set up data replication](/engines/table-engines/mergetree-family/replication)
- [Configure distributed tables](/engines/table-engines/special/distributed)
{/* - [ClickHouse Keeper setup](/guides/sre/keeper/index.md) */}
- [Set up backup and recovery](/operations/backup/overview)
- [Configure monitoring](/operations/system-tables/overview)

</details>

## Still need help?

If you can't find a solution:

1. **Ask AI** - <KapaLink>Ask AI</KapaLink> for instant answers.
1. **Check system tables** - [Overview](/operations/system-tables/overview)
2. **Review server logs** - Look for error messages in your ClickHouse logs
3. **Ask the community** - [Join Our Community Slack](https://clickhouse.com/slack), [GitHub Discussions](https://github.com/ClickHouse/ClickHouse/discussions)
4. **Get professional support** - [ClickHouse Cloud support](https://clickhouse.com/support)
