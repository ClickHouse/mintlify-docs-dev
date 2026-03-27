---
slug: /sql-reference/statements/create/dictionary/sources
title: 'Dictionary Sources'
doc_type: 'reference'
description: 'Dictionary source types configuration'
---

import CloudDetails from '/snippets/sql-reference/_snippet_dictionary_in_cloud.mdx';

## Syntax

<CloudDetails />

A dictionary can be connected to ClickHouse from many different sources.
The source is configured in the `source` section for configuration file and using the `SOURCE` clause for DDL statement.

<Tabs>
<Tab title="DDL">

```sql
CREATE DICTIONARY dict_name (...)
...
SOURCE(SOURCE_TYPE(param1 val1 ... paramN valN)) -- Source configuration
...
```

</Tab>
<Tab title="Configuration file">

```xml
<clickhouse>
  <dictionary>
    ...
    <source>
      <source_type>
        <!-- Source configuration -->
      </source_type>
    </source>
    ...
  </dictionary>
  ...
</clickhouse>
```

</Tab>
</Tabs>

<br/>

## Supported dictionary sources

The following source types (`SOURCE_TYPE`/`source_type`) are available:

- [Local file](./local-file.md)
- [Executable File](./executable-file.md)
- [Executable Pool](./executable-pool.md)
- [HTTP(S)](./http.md)
- DBMS
  - [ODBC](./odbc.md)
  - [MySQL](./mysql.md)
  - [ClickHouse](./clickhouse.md)
  - [MongoDB](./mongodb.md)
  - [Redis](./redis.md)
  - [Cassandra](./cassandra.md)
  - [PostgreSQL](./postgresql.md)
  - [YTsaurus](./ytsaurus.md)
- [YAMLRegExpTree](./yamlregexptree.md)
- [Null](./null.md)

For source types [Local file](./local-file.md), [Executable file](./executable-file.md), [HTTP(s)](./http.md), [ClickHouse](./clickhouse.md)
optional settings are available:

<Tabs>
<Tab title="DDL">

```sql
SOURCE(FILE(path './user_files/os.tsv' format 'TabSeparated'))
--highlight-next-line
SETTINGS(format_csv_allow_single_quotes = 0)
```

</Tab>
<Tab title="Configuration file">

```xml
<source>
  <file>
    <path>/opt/dictionaries/os.tsv</path>
    <format>TabSeparated</format>
  </file>
  <settings>
#highlight-next-line
      <format_csv_allow_single_quotes>0</format_csv_allow_single_quotes>
  </settings>
</source>
```

</Tab>
</Tabs>
