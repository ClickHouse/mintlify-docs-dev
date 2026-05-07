---
description: 'Computes an approximate quantile of a sample consisting of bfloat16
  numbers.'
slug: /sql-reference/aggregate-functions/reference/quantilebfloat16
title: 'quantileBFloat16'
doc_type: 'reference'
---

Computes an approximate [quantile](https://en.wikipedia.org/wiki/Quantile) of a sample consisting of [bfloat16](https://en.wikipedia.org/wiki/Bfloat16_floating-point_format) numbers.

`bfloat16` is a floating-point data type with 1 sign bit, 8 exponent bits and 7 fraction bits.
The function converts input values to 32-bit floats and takes the most significant 16 bits. Then it calculates `bfloat16` quantile value and converts the result to a 64-bit float by appending zero bits.
The function is a fast quantile estimator with a relative error no more than 0.390625%.
    

**Syntax**

```sql
quantileBFloat16[(level)](expr)
```

**Aliases**: `medianBFloat16`

**Parameters**

- `level` — Optional. Level of quantile. Possible values are in the range from 0 to 1. Default value: 0.5. [`Float*`](/sql-reference/data-types/float)


**Arguments**

- `expr` — Column with numeric data. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float)


**Returned value**

Approximate quantile of the specified level. [`Float64`](/sql-reference/data-types/float)

**Examples**

**Computing quantile with bfloat16**

```sql title=Query
CREATE TABLE example_table (a UInt32, b Float32) ENGINE = Memory;
INSERT INTO example_table VALUES (1, 1.001), (2, 1.002), (3, 1.003), (4, 1.004);

SELECT quantileBFloat16(0.75)(a), quantileBFloat16(0.75)(b) FROM example_table;
```

```response title=Response
┌─quantileBFloat16(0.75)(a)─┬─quantileBFloat16(0.75)(b)─┐
│                         3 │                         1 │
└───────────────────────────┴───────────────────────────┘
```



**See Also**

- [median](/sql-reference/aggregate-functions/reference/median)
- [quantiles](../../../sql-reference/aggregate-functions/reference/quantiles.md)
