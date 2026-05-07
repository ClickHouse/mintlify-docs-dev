---
description: 'The result is equal to the square root of varPop.'
slug: /sql-reference/aggregate-functions/reference/stddevpop
title: 'stddevPop'
doc_type: 'reference'
---

Returns the population standard deviation of a numeric data sequence.
The result is equal to the square root of [`varPop`](/sql-reference/aggregate-functions/reference/varPop).

:::note
This function uses a numerically unstable algorithm. If you need [numerical stability](https://en.wikipedia.org/wiki/Numerical_stability) in calculations, use the [`stddevPopStable`](/sql-reference/aggregate-functions/reference/stddevpopstable) function. It works slower but provides a lower computational error.
:::
    

**Syntax**

```sql
stddevPop(x)
```

**Aliases**: `STD`, `STDDEV_POP`

**Arguments**

- `x` — Population of values to find the standard deviation of. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal*`](/sql-reference/data-types/decimal)


**Returned value**

Returns the square root of population variance of `x`. [`Float64`](/sql-reference/data-types/float)

**Examples**

**Computing population standard deviation**

```sql title=Query
CREATE TABLE test_data (population UInt8) ENGINE = Log;
INSERT INTO test_data VALUES (3),(3),(3),(4),(4),(5),(5),(7),(11),(15);

SELECT stddevPop(population) AS stddev FROM test_data;
```

```response title=Response
┌────────────stddev─┐
│ 3.794733192202055 │
└───────────────────┘
```



