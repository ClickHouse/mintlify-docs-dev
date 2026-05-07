---
description: 'Calculates the approximate number of different argument values.'
slug: /sql-reference/aggregate-functions/reference/uniqcombined
title: 'uniqCombined'
doc_type: 'reference'
---

Calculates the approximate number of different argument values.
It provides the result deterministically (it does not depend on the query processing order).

:::note
Since it uses a 32-bit hash for non-String types, the result will have very high error for cardinalities significantly larger than `UINT_MAX` (the error will raise quickly after a few tens of billions of distinct values).
In the case cardinalities are larger than `UINT_MAX`, you should use [`uniqCombined64`](https://clickhouse.com/docs/sql-reference/aggregate-functions/reference/uniqcombined64) instead.
:::

Compared to the uniq function, the uniqCombined function:
- Consumes several times less memory
- Calculates with several times higher accuracy
- Usually has slightly lower performance. In some scenarios, uniqCombined can perform better than uniq, for example, with distributed queries that transmit a large number of aggregation states over the network

<details>
<summary>Implementation details</summary>
This function calculates a hash (64-bit hash for String and 32-bit otherwise) for all parameters in the aggregate, then uses it in calculations.
It uses a combination of three algorithms: array, hash table, and HyperLogLog with an error correction table:
- For a small number of distinct elements, an array is used
- When the set size is larger, a hash table is used
- For a larger number of elements, HyperLogLog is used, which will occupy a fixed amount of memory
</details>
    

**Syntax**

```sql
uniqCombined(HLL_precision)(x[, ...])
uniqCombined(x[, ...])
```

**Parameters**

- `HLL_precision` — Optional. The base-2 logarithm of the number of cells in HyperLogLog. The default value is 17, which is effectively 96 KiB of space (2^17 cells, 6 bits each). Range: [12, 20]. [`UInt8`](/sql-reference/data-types/int-uint)


**Arguments**

- `x` — A variable number of parameters. [`Tuple(T)`](/sql-reference/data-types/tuple) or [`Array(T)`](/sql-reference/data-types/array) or [`Date`](/sql-reference/data-types/date) or [`DateTime`](/sql-reference/data-types/datetime) or [`String`](/sql-reference/data-types/string) or [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal`](/sql-reference/data-types/decimal)


**Returned value**

Returns a UInt64-type number representing the approximate number of different argument values. [`UInt64`](/sql-reference/data-types/int-uint)

**Examples**

**Basic usage**

```sql title=Query
SELECT uniqCombined(number) FROM numbers(1e6);
```

```response title=Response
┌─uniqCombined(number)─┐
│              1001148 │
└──────────────────────┘
```

**With custom precision**

```sql title=Query
SELECT uniqCombined(15)(number) FROM numbers(1e5);
```

```response title=Response
┌─uniqCombined(15)(number)─┐
│                   100768 │
└──────────────────────────┘
```



**See Also**

- [uniq](/sql-reference/aggregate-functions/reference/uniq)
- [uniqCombined64](/sql-reference/aggregate-functions/reference/uniqcombined64)
- [uniqHLL12](/sql-reference/aggregate-functions/reference/uniqhll12)
- [uniqExact](/sql-reference/aggregate-functions/reference/uniqexact)
- [uniqTheta](/sql-reference/aggregate-functions/reference/uniqthetasketch)
