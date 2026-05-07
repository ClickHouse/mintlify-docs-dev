---
description: 'Calculates the exact number of different argument values.'
slug: /sql-reference/aggregate-functions/reference/uniqexact
title: 'uniqExact'
doc_type: 'reference'
---

Calculates the exact number of different argument values.

:::warning
The `uniqExact` function uses more memory than `uniq`, because the size of the state has unbounded growth as the number of different values increases.
Use the `uniqExact` function if you absolutely need an exact result.
Otherwise use the [`uniq`](https://clickhouse.com/docs/sql-reference/aggregate-functions/reference/uniq) function.
:::
    

**Syntax**

```sql
uniqExact(x[, ...])
```

**Arguments**

- `x` — The function takes a variable number of parameters. [`Tuple(T)`](/sql-reference/data-types/tuple) or [`Array(T)`](/sql-reference/data-types/array) or [`Date`](/sql-reference/data-types/date) or [`DateTime`](/sql-reference/data-types/datetime) or [`String`](/sql-reference/data-types/string) or [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal`](/sql-reference/data-types/decimal)


**Returned value**

Returns the exact number of different argument values as a UInt64. [`UInt64`](/sql-reference/data-types/int-uint)

**Examples**

**Basic usage**

```sql title=Query
CREATE TABLE example_data
(
    id UInt32,
    category String
)
ENGINE = Memory;

INSERT INTO example_data VALUES
(1, 'A'), (2, 'B'), (3, 'A'), (4, 'C'), (5, 'B'), (6, 'A');

SELECT uniqExact(category) as exact_unique_categories
FROM example_data;
```

```response title=Response
┌─exact_unique_categories─┐
│                       3 │
└─────────────────────────┘
```

**Multiple arguments**

```sql title=Query
SELECT uniqExact(id, category) as exact_unique_combinations
FROM example_data;
```

```response title=Response
┌─exact_unique_combinations─┐
│                         6 │
└───────────────────────────┘
```



**See Also**

- [uniq](/sql-reference/aggregate-functions/reference/uniq)
- [uniqCombined](/sql-reference/aggregate-functions/reference/uniqcombined)
- [uniqHLL12](/sql-reference/aggregate-functions/reference/uniqhll12)
- [uniqTheta](/sql-reference/aggregate-functions/reference/uniqthetasketch)
