---
description: 'System table which shows all available tokenizers.'
keywords: ['system table', 'tokenizers']
slug: /operations/system-tables/tokenizers
title: 'system.tokenizers'
doc_type: 'reference'
---

import SystemTableCloud from '/snippets/_system_table_cloud.mdx';

<SystemTableCloud />

Shows all available tokenizers.
These can be used in functions [tokens](/sql-reference/functions/splitting-merging-functions#tokens), [hasAllTokens](/sql-reference/functions/string-search-functions#hasAllTokens), [hasAnyTokens](/sql-reference/functions/string-search-functions#hasAnyTokens), and the [text index](/engines/table-engines/mergetree-family/textindexes).

Columns:

- `name` ([String](../../sql-reference/data-types/string.md)) — Name of the tokenizer

**Example**

```sql
SELECT * FROM system.tokenizers;
```

```text
┌─name────────────┐
│ ngrams          │
│ splitByNonAlpha │
│ sparseGrams     │
│ tokenbf_v1      │
│ ngrambf_v1      │
│ array           │
│ splitByString   │
│ sparse_grams    │
└─────────────────┘
```