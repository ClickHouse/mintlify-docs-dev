---
description: 'Aggregate function that calculates the maximum number of times that
  a group of intervals intersects each other (if all the intervals intersect at least
  once).'
slug: /sql-reference/aggregate-functions/reference/maxintersections
title: 'maxIntersections'
doc_type: 'reference'
---

Aggregate function that calculates the maximum number of times that a group of intervals intersects each other (if all the intervals intersect at least once).
    

**Syntax**

```sql
maxIntersections(start_column, end_column)
```

**Arguments**

- `start_column` — A numeric column that represents the start of each interval. If `start_column` is `NULL` or 0 then the interval will be skipped. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float)
- `end_column` — A numeric column that represents the end of each interval. If `end_column` is `NULL` or 0 then the interval will be skipped. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float)


**Returned value**

Returns the maximum number of intersected intervals. [`UInt64`](/sql-reference/data-types/int-uint)

**Examples**

**Calculating maximum intersections**

```sql title=Query
CREATE TABLE my_events (
    start UInt32,
    end UInt32
)
ENGINE = MergeTree
ORDER BY tuple();

INSERT INTO my_events VALUES
(1, 3),
(1, 6),
(2, 5),
(3, 7);

SELECT maxIntersections(start, end) FROM my_events;
```

```response title=Response
┌─maxIntersections(start, end)─┐
│                            3 │
└──────────────────────────────┘
```



