---
description: 'Returns an array of the approximately most frequent values in the specified
  column. The resulting array is sorted in descending order of approximate frequency
  of values (not by the values themselves). Additionally, the weight of the value
  is taken into account.'
slug: /sql-reference/aggregate-functions/reference/topkweighted
title: 'topKWeighted'
doc_type: 'reference'
---

Returns an array of the approximately most frequent values in the specified column.
The resulting array is sorted in descending order of approximate frequency of values (not by the values themselves).
Additionally, the weight of the value is taken into account.

**See Also**

- [topK](../../../sql-reference/aggregate-functions/reference/topK.md)
- [approx_top_k](../../../sql-reference/aggregate-functions/reference/approx_top_k.md)
- [approx_top_sum](../../../sql-reference/aggregate-functions/reference/approx_top_sum.md)
    

**Syntax**

```sql
topKWeighted(N)(column, weight)
topKWeighted(N, load_factor)(column, weight)
topKWeighted(N, load_factor, 'counts')(column, weight)
```

**Parameters**

- `N` — The number of elements to return. Default value: 10. [`UInt64`](/sql-reference/data-types/int-uint)
- `load_factor` — Optional. Defines, how many cells reserved for values. If `uniq(column) > N * load_factor`, result of topK function will be approximate. Default value: 3. [`UInt64`](/sql-reference/data-types/int-uint)
- `counts` — Optional. Defines whether the result should contain an approximate count and error value. [`Bool`](/sql-reference/data-types/boolean)


**Arguments**

- `column` — The name of the column for which to find the most frequent values. - `weight` — The weight. Every value is accounted `weight` times for frequency calculation. [`UInt64`](/sql-reference/data-types/int-uint)


**Returned value**

Returns an array of the values with maximum approximate sum of weights. [`Array`](/sql-reference/data-types/array)

**Examples**

**Usage example**

```sql title=Query
SELECT topKWeighted(2)(k, w) FROM
VALUES('k Char, w UInt64', ('y', 1), ('y', 1), ('x', 5), ('y', 1), ('z', 10));
```

```response title=Response
┌─topKWeighted(2)(k, w)──┐
│ ['z','x']              │
└────────────────────────┘
```

**With counts parameter**

```sql title=Query
SELECT topKWeighted(2, 10, 'counts')(k, w)
FROM VALUES('k Char, w UInt64', ('y', 1), ('y', 1), ('x', 5), ('y', 1), ('z', 10));
```

```response title=Response
┌─topKWeighted(2, 10, 'counts')(k, w)─┐
│ [('z',10,0),('x',5,0)]              │
└─────────────────────────────────────┘
```



**See Also**

- [topK](../../../sql-reference/aggregate-functions/reference/topK.md)
- [approx_top_k](../../../sql-reference/aggregate-functions/reference/approx_top_k.md)
- [approx_top_sum](../../../sql-reference/aggregate-functions/reference/approx_top_sum.md)
