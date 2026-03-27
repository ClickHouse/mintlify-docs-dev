---
description: 'Represents the dictionary of a text index in a MergeTree table.
  It can be used for introspection.'
slug: /sql-reference/table-functions/mergeTreeTextIndex
title: 'mergeTreeTextIndex'
doc_type: 'reference'
---

Represents the dictionary of a text index in MergeTree tables.
Returns tokens with their posting list metadata.
It can be used for introspection.

## Syntax

```sql
mergeTreeTextIndex(database, table, index_name)
```

## Arguments

| Argument     | Description                                |
|--------------|--------------------------------------------|
| `database`   | The database name to read text index from. |
| `table`      | The table name to read text index from.    |
| `index_name` | The text index to read from.               |

## Returned value

A table object with tokens and their posting list metadata.

## Usage Example

```sql
CREATE TABLE tab
(
    id UInt64,
    s String,
    INDEX idx_s (s) TYPE text(tokenizer = splitByNonAlpha)
)
ENGINE = MergeTree
ORDER BY id;

INSERT INTO tab SELECT number, concatWithSeparator(' ', 'apple', 'banana') FROM numbers(500);
INSERT INTO tab SELECT 500 + number, concatWithSeparator(' ', 'cherry', 'date') FROM numbers(500);

SELECT * FROM mergeTreeTextIndex(currentDatabase(), tab, idx_s);
```

Result:

```text
   ┌─part_name─┬─token──┬─dictionary_compression─┬─cardinality─┬─num_posting_blocks─┬─has_embedded_postings─┬─has_raw_postings─┬─has_compressed_postings─┐
1. │ all_1_1_0 │ apple  │ front_coded            │         500 │                  1 │                     0 │                0 │                       0 │
2. │ all_1_1_0 │ banana │ front_coded            │         500 │                  1 │                     0 │                0 │                       0 │
3. │ all_2_2_0 │ cherry │ front_coded            │         500 │                  1 │                     0 │                0 │                       0 │
4. │ all_2_2_0 │ date   │ front_coded            │         500 │                  1 │                     0 │                0 │                       0 │
   └───────────┴────────┴────────────────────────┴─────────────┴────────────────────┴───────────────────────┴──────────────────┴─────────────────────────┘
```