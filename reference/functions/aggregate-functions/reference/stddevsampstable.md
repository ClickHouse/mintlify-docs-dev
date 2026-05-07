---
description: 'The result is equal to the square root of varSamp. Unlike this function
  uses a numerically stable algorithm.'
slug: /sql-reference/aggregate-functions/reference/stddevsampstable
title: 'stddevSampStable'
doc_type: 'reference'
---

The result is equal to the square root of [varSamp](../../../sql-reference/aggregate-functions/reference/varSamp.md). Unlike [stddevSamp](../reference/stddevSamp.md) this function uses a numerically stable algorithm. It works slower but provides a lower computational error.
    

**Syntax**

```sql
stddevSampStable(x)
```

**Arguments**

- `x` — Values for which to find the square root of sample variance. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal*`](/sql-reference/data-types/decimal)


**Returned value**

Returns the square root of sample variance of `x`. [`Float64`](/sql-reference/data-types/float)

**Examples**

**Basic usage**

```sql title=Query
DROP TABLE IF EXISTS test_data;
CREATE TABLE test_data
(
    population UInt8,
)
ENGINE = Log;

INSERT INTO test_data VALUES (3),(3),(3),(4),(4),(5),(5),(7),(11),(15);

SELECT
    stddevSampStable(population)
FROM test_data;
```

```response title=Response
┌─stddevSampStable(population)─┐
│                            4 │
└──────────────────────────────┘
```



