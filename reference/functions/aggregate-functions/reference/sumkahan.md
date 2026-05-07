---
description: 'Calculates the sum of the numbers with Kahan compensated summation algorithm'
slug: /sql-reference/aggregate-functions/reference/sumkahan
title: 'sumKahan'
doc_type: 'reference'
---

Calculates the sum of the numbers with [Kahan compensated summation algorithm](https://en.wikipedia.org/wiki/Kahan_summation_algorithm).
Slower than [`sum`](/sql-reference/aggregate-functions/reference/sum) function.
The compensation works only for [Float](/sql-reference/data-types/float) types.
    

**Syntax**

```sql
sumKahan(x)
```

**Arguments**

- `x` — Input value. [`Integer`](/sql-reference/data-types/int-uint) or [`Float`](/sql-reference/data-types/float) or [`Decimal`](/sql-reference/data-types/decimal)


**Returned value**

Returns the sum of numbers. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Decimal`](/sql-reference/data-types/decimal)

**Examples**

**Demonstrating precision improvement with Kahan summation**

```sql title=Query
SELECT sum(0.1), sumKahan(0.1) FROM numbers(10);
```

```response title=Response
┌───────────sum(0.1)─┬─sumKahan(0.1)─┐
│ 0.9999999999999999 │             1 │
└────────────────────┴───────────────┘
```



