---
description: 'Calculates the list of distinct data types stored in Dynamic column.'
slug: /sql-reference/aggregate-functions/reference/distinctdynamictypes
title: 'distinctDynamicTypes'
doc_type: 'reference'
---

Calculates the list of distinct data types stored in [Dynamic](https://clickhouse.com/docs/sql-reference/data-types/dynamic) column.
    

**Syntax**

```sql
distinctDynamicTypes(dynamic)
```

**Arguments**

- `dynamic` — Dynamic column. [`Dynamic`](/sql-reference/data-types/dynamic)


**Returned value**

Returns the sorted list of data type names. [`Array(String)`](/sql-reference/data-types/array)

**Examples**

**Basic usage with mixed types**

```sql title=Query
DROP TABLE IF EXISTS test_dynamic;
CREATE TABLE test_dynamic(d Dynamic) ENGINE = Memory;
INSERT INTO test_dynamic VALUES (42), (NULL), ('Hello'), ([1, 2, 3]), ('2020-01-01'), (map(1, 2)), (43), ([4, 5]), (NULL), ('World'), (map(3, 4));

SELECT distinctDynamicTypes(d) FROM test_dynamic;
```

```response title=Response
┌─distinctDynamicTypes(d)──────────────────────────────────────────┐
│ ['Array(Int64)', 'Date', 'Int64', 'Map(UInt8, UInt8)', 'String'] │
└──────────────────────────────────────────────────────────────────┘
```



