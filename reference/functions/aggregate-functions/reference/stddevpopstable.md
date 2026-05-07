---
description: 'The result is equal to the square root of varPop. Unlike stddevPop,
  this function uses a numerically stable algorithm.'
slug: /sql-reference/aggregate-functions/reference/stddevpopstable
title: 'stddevPopStable'
doc_type: 'reference'
---

The result is equal to the square root of [varPop](../../../sql-reference/aggregate-functions/reference/varPop.md). Unlike [stddevPop](../reference/stddevPop.md), this function uses a numerically stable algorithm. It works slower but provides a lower computational error.
    

**Syntax**

```sql
stddevPopStable(x)
```

**Arguments**

- `x` — Population of values to find the standard deviation of. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal*`](/sql-reference/data-types/decimal)


**Returned value**

Returns the square root of the variance of `x`. [`Float64`](/sql-reference/data-types/float)

**Examples**

**Basic usage**

```sql title=Query
DROP TABLE IF EXISTS test_data;
CREATE TABLE test_data
(
    population Float64,
)
ENGINE = Log;

INSERT INTO test_data SELECT randUniform(5.5, 10) FROM numbers(1000000);

SELECT
    stddevPopStable(population) AS stddev
FROM test_data;
```

```response title=Response
┌─────────────stddev─┐
│ 1.2999977786592576 │
└────────────────────┘
```



