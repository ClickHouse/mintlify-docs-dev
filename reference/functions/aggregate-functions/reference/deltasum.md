---
description: 'Sums the arithmetic difference between consecutive rows.'
slug: /sql-reference/aggregate-functions/reference/deltasum
title: 'deltaSum'
doc_type: 'reference'
---

Sums the arithmetic difference between consecutive rows.
If the difference is negative, it is ignored.

:::tip
The underlying data must be sorted for this function to work properly.
If you would like to use this function in a [materialized view](/sql-reference/statements/create/view#materialized-view), you most likely want to use the [`deltaSumTimestamp`](/sql-reference/aggregate-functions/reference/deltasumtimestamp) function instead.
:::

See also:
- [`runningDifference`](/sql-reference/functions/other-functions#runningDifference)
    

**Syntax**

```sql
deltaSum(x1[, x2, ...])
```

**Arguments**

- `x1[, x2, ...]` — One or more input values. [`Integer`](/sql-reference/data-types/int-uint) or [`Float`](/sql-reference/data-types/float)


**Returned value**

Returns a gained arithmetic difference of the input values. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float)

**Examples**

**Basic usage with positive differences**

```sql title=Query
SELECT deltaSum(arrayJoin([1, 2, 3]))
```

```response title=Response
┌─deltaSum(arrayJoin([1, 2, 3]))─┐
│                              2 │
└────────────────────────────────┘
```

**Mixed values with negative differences ignored**

```sql title=Query
SELECT deltaSum(arrayJoin([1, 2, 3, 0, 3, 4, 2, 3]))
```

```response title=Response
┌─deltaSum(arrayJoin([1, 2, 3, 0, 3, 4, 2, 3]))─┐
│                                             7 │
└───────────────────────────────────────────────┘
```

**Float values**

```sql title=Query
SELECT deltaSum(arrayJoin([2.25, 3, 4.5]))
```

```response title=Response
┌─deltaSum(arrayJoin([2.25, 3, 4.5]))─┐
│                                2.25 │
└─────────────────────────────────────┘
```



**See also**

- [`runningDifference`](/sql-reference/functions/other-functions#runningDifference)
