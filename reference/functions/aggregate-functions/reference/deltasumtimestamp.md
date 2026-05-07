---
description: 'Adds the difference between consecutive rows. If the difference is negative,
  it is ignored.'
slug: /sql-reference/aggregate-functions/reference/deltasumtimestamp
title: 'deltaSumTimestamp'
doc_type: 'reference'
---

Adds the difference between consecutive rows.
If the difference is negative, it is ignored.

This function is primarily for [materialized views](/sql-reference/statements/create/view#materialized-view) that store data ordered by some time bucket-aligned timestamp, for example, a `toStartOfMinute` bucket.
Because the rows in such a materialized view will all have the same timestamp, it is impossible for them to be merged in the correct order, without storing the original, unrounded timestamp value.
The `deltaSumTimestamp` function keeps track of the original `timestamp` of the values it's seen, so the values (states) of the function are correctly computed during merging of parts.

To calculate the delta sum across an ordered collection you can simply use the [`deltaSum`](/sql-reference/aggregate-functions/reference/deltasum) function.
    

**Syntax**

```sql
deltaSumTimestamp(value, timestamp)
```

**Arguments**

- `value` — Input values. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Date`](/sql-reference/data-types/date) or [`DateTime`](/sql-reference/data-types/datetime)
- `timestamp` — The parameter for order values. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Date`](/sql-reference/data-types/date) or [`DateTime`](/sql-reference/data-types/datetime)


**Returned value**

Returns accumulated differences between consecutive values, ordered by the `timestamp` parameter. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float) or [`Date`](/sql-reference/data-types/date) or [`DateTime`](/sql-reference/data-types/datetime)

**Examples**

**Basic usage with timestamp ordering**

```sql title=Query
SELECT deltaSumTimestamp(value, timestamp)
FROM (SELECT number AS timestamp, [0, 4, 8, 3, 0, 0, 0, 1, 3, 5][number] AS value FROM numbers(1, 10))
```

```response title=Response
┌─deltaSumTimestamp(value, timestamp)─┐
│                                  13 │
└─────────────────────────────────────┘
```



