---
description: 'Computes the kurtosis of a sequence.'
slug: /sql-reference/aggregate-functions/reference/kurtpop
title: 'kurtPop'
doc_type: 'reference'
---

Computes the [kurtosis](https://en.wikipedia.org/wiki/Kurtosis) of a sequence.
    

**Syntax**

```sql
kurtPop(expr)
```

**Arguments**

- `expr` — [Expression](/sql-reference/syntax#expressions) returning a number. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal`](/sql-reference/data-types/decimal)


**Returned value**

Returns the kurtosis of the given distribution. [`Float64`](/sql-reference/data-types/float)

**Examples**

**Computing kurtosis**

```sql title=Query
CREATE TABLE test_data (x Float64) ENGINE = Memory;
INSERT INTO test_data VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

SELECT kurtPop(x) FROM test_data;
```

```response title=Response
┌─────────kurtPop(x)─┐
│ 1.7757575757575756 │
└────────────────────┘
```



