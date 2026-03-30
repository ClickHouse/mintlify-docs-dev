---
description: 'The `median*` functions are the aliases for the corresponding `quantile*`
  functions. They calculate median of a numeric data sample.'
sidebar_position: 167
old-slug: /sql-reference/aggregate-functions/reference/median
title: 'median'
doc_type: 'reference'
---

The `median*` functions are the aliases for the corresponding `quantile*` functions. They calculate median of a numeric data sample.

Functions:

- `median` — Alias for [quantile](/sql-reference/aggregate-functions/reference/quantile).
- `medianDeterministic` — Alias for [quantileDeterministic](/sql-reference/aggregate-functions/reference/quantiledeterministic).
- `medianExact` — Alias for [quantileExact](/sql-reference/aggregate-functions/reference/quantileexact#quantileexact).
- `medianExactWeighted` — Alias for [quantileExactWeighted](/sql-reference/aggregate-functions/reference/quantileexactweighted).
- `medianTiming` — Alias for [quantileTiming](/sql-reference/aggregate-functions/reference/quantiletiming).
- `medianTimingWeighted` — Alias for [quantileTimingWeighted](/sql-reference/aggregate-functions/reference/quantiletimingweighted).
- `medianTDigest` — Alias for [quantileTDigest](/sql-reference/aggregate-functions/reference/quantiletdigest).
- `medianTDigestWeighted` — Alias for [quantileTDigestWeighted](/sql-reference/aggregate-functions/reference/quantiletdigestweighted).
- `medianBFloat16` — Alias for [quantileBFloat16](/sql-reference/aggregate-functions/reference/quantilebfloat16).
- `medianDD` — Alias for [quantileDD](/sql-reference/aggregate-functions/reference/quantileddsketch).

**Example**

Input table:

```text
┌─val─┐
│   1 │
│   1 │
│   2 │
│   3 │
└─────┘
```

Query:

```sql
SELECT medianDeterministic(val, 1) FROM t;
```

Result:

```text
┌─medianDeterministic(val, 1)─┐
│                         1.5 │
└─────────────────────────────┘
```
