---
description: 'Computes the sample kurtosis of a sequence.'
slug: /sql-reference/aggregate-functions/reference/kurtsamp
title: 'kurtSamp'
doc_type: 'reference'
---

Computes the [sample kurtosis](https://en.wikipedia.org/wiki/Kurtosis) of a sequence.

It represents an unbiased estimate of the kurtosis of a random variable if passed values form its sample.
    

**Syntax**

```sql
kurtSamp(expr)
```

**Arguments**

- `expr` — [Expression](/sql-reference/syntax#expressions) returning a number. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal`](/sql-reference/data-types/decimal)


**Returned value**

Returns the kurtosis of the given distribution. If `n <= 1` (`n` is a size of the sample), then the function returns `nan`. [`Float64`](/sql-reference/data-types/float)

**Examples**

**Computing sample kurtosis**

```sql title=Query
CREATE TABLE test_data (x Float64) ENGINE = Memory;
INSERT INTO test_data VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

SELECT kurtSamp(x) FROM test_data;
```

```response title=Response
┌────────kurtSamp(x)─┐
│ 1.4383636363636365 │
└────────────────────┘
```



