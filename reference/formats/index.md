---
slug: /sql-reference/formats
title: 'Formats for Input and Output Data'
description: 'Supported input and output formats'
doc_type: 'reference'
---

ClickHouse supports most of the known text and binary data formats. This allows easy integration into almost any working
data pipeline to leverage the benefits of ClickHouse.

## Input formats

Input formats are used for:
- Parsing data provided to `INSERT` statements
- Performing `SELECT` queries from file-backed tables such as `File`, `URL`, or `HDFS`
- Reading dictionaries

## Output formats

Output formats are used for:
- Formatting the results of `SELECT` statements
- Writing data to file-backed tables

See the individual format pages in this section for details on each supported format.