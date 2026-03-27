---
description: 'Documentation for EXISTS Statement'
sidebarTitle: 'EXISTS'
sidebar_position: 45
slug: /sql-reference/statements/exists
title: 'EXISTS statement'
doc_type: 'reference'
---

```sql
EXISTS [TEMPORARY] [TABLE|DICTIONARY|DATABASE] [db.]name [INTO OUTFILE filename] [FORMAT format]
```

Returns a single `UInt8`-type column, which contains the single value `0` if the table or database does not exist, or `1` if the table exists in the specified database.

The `EXISTS` operator checks how many records are in the result of a subquery. If it is empty, then the operator returns `0`. Otherwise, it returns `1`.

`EXISTS` can also be used in a [WHERE](../../sql-reference/statements/select/where.md) clause.

<Tip>
References to main query tables and columns are not supported in a subquery.
</Tip>

**Syntax**

```sql
EXISTS(subquery)
```

**Example**

Query checking existence of values in a subquery:

```sql
SELECT EXISTS(SELECT * FROM numbers(10) WHERE number > 8), EXISTS(SELECT * FROM numbers(10) WHERE number > 11)
```

Result:

```text
┌─in(1, _subquery1)─┬─in(1, _subquery2)─┐
│                 1 │                 0 │
└───────────────────┴───────────────────┘
```

Query with a subquery returning several rows:

```sql
SELECT count() FROM numbers(10) WHERE EXISTS(SELECT number FROM numbers(10) WHERE number > 8);
```

Result:

```text
┌─count()─┐
│      10 │
└─────────┘
```

Query with a subquery that returns an empty result:

```sql
SELECT count() FROM numbers(10) WHERE EXISTS(SELECT number FROM numbers(10) WHERE number > 11);
```

Result:

```text
┌─count()─┐
│       0 │
└─────────┘
```
