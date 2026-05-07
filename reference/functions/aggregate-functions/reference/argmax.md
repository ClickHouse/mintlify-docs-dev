---
description: 'Calculates the `arg` value for a maximum `val` value.'
slug: /sql-reference/aggregate-functions/reference/argmax
title: 'argMax'
doc_type: 'reference'
---

Calculates the `arg` value for a maximum `val` value. If there are multiple rows with equal `val` being the maximum, which of the associated `arg` is returned is not deterministic.
Both parts the `arg` and the `max` behave as [aggregate functions](/sql-reference/aggregate-functions/index.md), they both [skip `Null`](/sql-reference/aggregate-functions/index.md#null-processing) during processing and return not `Null` values if not `Null` values are available.

**See also**

- [Tuple](/sql-reference/data-types/tuple.md)
    

**Syntax**

```sql
argMax(arg, val)
```

**Arguments**

- `arg` — Argument for which to find the maximum value. [`const String`](/sql-reference/data-types/string)
- `val` — The maximum value. [`(U)Int8/16/32/64`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Date`](/sql-reference/data-types/date) or [`DateTime`](/sql-reference/data-types/datetime) or [`Tuple`](/sql-reference/data-types/tuple)


**Returned value**

Returns the `arg` value that corresponds to maximum `val` value. Type matches `arg` type.

**Examples**

**Basic usage**

```sql title=Query
SELECT argMax(user, salary) FROM salary;
```

```response title=Response
┌─argMax(user, salary)─┐
│ director             │
└──────────────────────┘
```

**Extended example with NULL handling**

```sql title=Query
CREATE TABLE test
(
    a Nullable(String),
    b Nullable(Int64)
)
ENGINE = Memory AS
SELECT *
FROM VALUES(('a', 1), ('b', 2), ('c', 2), (NULL, 3), (NULL, NULL), ('d', NULL));

SELECT argMax(a, b), max(b) FROM test;
```

```response title=Response
┌─argMax(a, b)─┬─max(b)─┐
│ b            │      3 │
└──────────────┴────────┘
```

**Using Tuple in arguments**

```sql title=Query
SELECT argMax(a, (b,a)) FROM test;
```

```response title=Response
┌─argMax(a, tuple(b, a))─┐
│ c                      │
└────────────────────────┘
```



