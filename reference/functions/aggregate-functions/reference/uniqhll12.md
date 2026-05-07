---
description: 'Calculates the approximate number of different argument values, using
  the HyperLogLog algorithm.'
slug: /sql-reference/aggregate-functions/reference/uniqhll12
title: 'uniqHLL12'
doc_type: 'reference'
---

Calculates the approximate number of different argument values, using the [HyperLogLog](https://en.wikipedia.org/wiki/HyperLogLog) algorithm.

:::warning
We do not recommend using this function. In most cases, use the [uniq](https://clickhouse.com/docs/sql-reference/aggregate-functions/reference/uniq) or [uniqCombined](https://clickhouse.com/docs/sql-reference/aggregate-functions/reference/uniqcombined) function.
:::

<details>
<summary>Implementation details</summary>
This function calculates a hash for all parameters in the aggregate, then uses it in calculations.
It uses the HyperLogLog algorithm to approximate the number of different argument values.

2^12 5-bit cells are used.
The size of the state is slightly more than 2.5 KB.
The result is not very accurate (up to ~10% error) for small data sets (\<10K elements).
However, the result is fairly accurate for high-cardinality data sets (10K-100M), with a maximum error of ~1.6%.
Starting from 100M, the estimation error increases, and the function will return very inaccurate results for data sets with extremely high cardinality (1B+ elements).

Provides a determinate result (it does not depend on the query processing order).
</details>
    

**Syntax**

```sql
uniqHLL12(x[, ...])
```

**Arguments**

- `x` — The function takes a variable number of parameters. [`Tuple(T)`](/sql-reference/data-types/tuple) or [`Array(T)`](/sql-reference/data-types/array) or [`Date`](/sql-reference/data-types/date) or [`DateTime`](/sql-reference/data-types/datetime) or [`String`](/sql-reference/data-types/string) or [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal`](/sql-reference/data-types/decimal)


**Returned value**

Returns a UInt64-type number representing the approximate number of different argument values. [`UInt64`](/sql-reference/data-types/int-uint)

**Examples**

**Basic usage**

```sql title=Query
CREATE TABLE example_hll
(
    id UInt32,
    category String
)
ENGINE = Memory;

INSERT INTO example_hll VALUES
(1, 'A'), (2, 'B'), (3, 'A'), (4, 'C'), (5, 'B'), (6, 'A');

SELECT uniqHLL12(category) AS hll_unique_categories
FROM example_hll;
```

```response title=Response
┌─hll_unique_categories─┐
│                     3 │
└───────────────────────┘
```



**See Also**

- [uniq](/sql-reference/aggregate-functions/reference/uniq)
- [uniqCombined](/sql-reference/aggregate-functions/reference/uniqcombined)
- [uniqExact](/sql-reference/aggregate-functions/reference/uniqexact)
- [uniqTheta](/sql-reference/aggregate-functions/reference/uniqthetasketch)
