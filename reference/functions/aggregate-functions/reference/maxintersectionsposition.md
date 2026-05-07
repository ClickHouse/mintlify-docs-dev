---
description: 'Aggregate function that calculates the positions of the occurrences
  of the maxIntersections function.'
slug: /sql-reference/aggregate-functions/reference/maxintersectionsposition
title: 'maxIntersectionsPosition'
doc_type: 'reference'
---

Aggregate function that calculates the positions of the occurrences of the [`maxIntersections`](/sql-reference/aggregate-functions/reference/maxintersections) function.
    

**Syntax**

```sql
maxIntersectionsPosition(start_column, end_column)
```

**Arguments**

- `start_column` — A numeric column that represents the start of each interval. If `start_column` is `NULL` or 0 then the interval will be skipped. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float)
- `end_column` — A numeric column that represents the end of each interval. If `end_column` is `NULL` or 0 then the interval will be skipped. [`(U)Int*`](/sql-reference/data-types/int-uint) or [`Float*`](/sql-reference/data-types/float)


**Returned value**

Returns the start positions of the maximum number of intersected intervals. [`Any`](/sql-reference/data-types)

**Examples**

**Finding maximum intersections position**

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

SELECT maxIntersectionsPosition(start, end) FROM my_events;
```

```response title=Response
┌─maxIntersectionsPosition(start, end)─┐
│                                    2 │
└──────────────────────────────────────┘
```



