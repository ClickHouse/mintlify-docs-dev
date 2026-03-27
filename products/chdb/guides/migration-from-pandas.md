---
title: 'Migration from pandas'
slug: /chdb/guides/migration-from-pandas
description: 'Step-by-step guide to migrate from pandas to DataStore'
keywords: ['chdb', 'datastore', 'pandas', 'migration', 'guide']
---


This guide helps you migrate existing pandas code to DataStore for better performance while maintaining compatibility.

## The One-Line Migration

The simplest migration is changing your import:

```python
# Before (pandas)
import pandas as pd

# After (DataStore)
from chdb import datastore as pd
```

That's it! Most pandas code works unchanged.

## Step-by-Step Migration

### Install chDB

```bash
pip install "chdb>=4.0"
```

### Change the Import

```python
# Change this:
import pandas as pd

# To this:
from chdb import datastore as pd
```

### Test Your Code

Run your existing code. Most operations work unchanged:

```python
from chdb import datastore as pd

# These all work the same
df = pd.read_csv("data.csv")
result = df[df['age'] > 25]
grouped = df.groupby('city')['salary'].mean()
df.to_csv("output.csv")
```

### Handle Any Differences

A few operations behave differently. See [Key Differences](#differences) below.

---

## What Works Unchanged

### Data Loading

```python
# All these work the same
df = pd.read_csv("data.csv")
df = pd.read_parquet("data.parquet")
df = pd.read_json("data.json")
df = pd.read_excel("data.xlsx")
```

### Filtering

```python
# Boolean indexing
df[df['age'] > 25]
df[(df['age'] > 25) & (df['city'] == 'NYC')]

# query() method
df.query('age > 25 and salary > 50000')
```

### Selection

```python
# Column selection
df['name']
df[['name', 'age']]

# Row selection
df.head(10)
df.tail(10)
df.iloc[0:100]
```

### GroupBy and Aggregation

```python
# GroupBy
df.groupby('city')['salary'].mean()
df.groupby(['city', 'dept']).agg({'salary': ['sum', 'mean']})
```

### Sorting

```python
df.sort_values('salary', ascending=False)
df.sort_values(['city', 'age'])
```

### String Operations

```python
df['name'].str.upper()
df['name'].str.contains('John')
df['name'].str.len()
```

### DateTime Operations

```python
df['date'].dt.year
df['date'].dt.month
df['date'].dt.dayofweek
```

### I/O Operations

```python
df.to_csv("output.csv")
df.to_parquet("output.parquet")
df.to_json("output.json")
```

---

## Key Differences

### 1. Lazy Evaluation

DataStore operations are lazy - they don't execute until results are needed.

**pandas:**
```python
# Executes immediately
result = df[df['age'] > 25]
print(type(result))  # pandas.DataFrame
```

**DataStore:**
```python
# Builds query, doesn't execute yet
result = ds[ds['age'] > 25]
print(type(result))  # DataStore (lazy)

# Executes when you need the data
print(result)        # Triggers execution
df = result.to_df()  # Triggers execution
```

### 2. Return Types

| Operation | pandas Returns | DataStore Returns |
|-----------|---------------|-------------------|
| `df['col']` | Series | ColumnExpr (lazy) |
| `df[['a', 'b']]` | DataFrame | DataStore (lazy) |
| `df[condition]` | DataFrame | DataStore (lazy) |
| `df.groupby('x')` | GroupBy | LazyGroupBy |

### 3. No inplace Parameter

DataStore doesn't support `inplace=True`. Always use the return value:

**pandas:**
```python
df.drop(columns=['col'], inplace=True)
```

**DataStore:**
```python
ds = ds.drop(columns=['col'])  # Assign the result
```

### 4. Comparing DataStores

pandas doesn't recognize DataStore objects, so use `to_pandas` for comparison:

```python
# This may not work as expected
df == ds  # pandas doesn't know DataStore

# Do this instead
df.equals(ds.to_pandas())
```

### 5. Row Order

DataStore may not preserve row order for file sources (like SQL databases). Use explicit sorting:

```python
# pandas preserves order
df = pd.read_csv("data.csv")

# DataStore - use sort for guaranteed order
ds = pd.read_csv("data.csv")
ds = ds.sort('id')  # Explicit ordering
```

---

## Migration Patterns

### Pattern 1: Read-Analyze-Write

```python
# pandas
import pandas as pd
df = pd.read_csv("data.csv")
result = df[df['amount'] > 100].groupby('category')['amount'].sum()
result.to_csv("output.csv")

# DataStore - same code works!
from chdb import datastore as pd
df = pd.read_csv("data.csv")
result = df[df['amount'] > 100].groupby('category')['amount'].sum()
result.to_csv("output.csv")
```

### Pattern 2: DataFrame with pandas Operations

If you need pandas-specific features, convert at the end:

```python
from chdb import datastore as pd

# Fast DataStore operations
ds = pd.read_csv("large_data.csv")
ds = ds.filter(ds['date'] >= '2024-01-01')
ds = ds.filter(ds['amount'] > 100)

# Convert to pandas for specific features
df = ds.to_df()
df_pivoted = df.pivot_table(...)  # pandas-specific
```

### Pattern 3: Mixed Workflow

```python
from chdb import datastore as pd
import pandas

# Start with DataStore for fast filtering
ds = pd.read_csv("huge_file.csv")  # 10M rows
ds = ds.filter(ds['year'] == 2024)  # Fast SQL filter
ds = ds.select('col1', 'col2', 'col3')  # Column pruning

# Convert for pandas-specific operations
df = ds.to_df()  # Now only ~100K rows
result = df.apply(complex_custom_function)  # pandas
```

---

## Performance Comparison

DataStore is significantly faster for large datasets:

| Operation | pandas | DataStore | Speedup |
|-----------|--------|-----------|---------|
| GroupBy count | 347ms | 17ms | **19.93x** |
| Complex pipeline | 2,047ms | 380ms | **5.39x** |
| Filter+Sort+Head | 1,537ms | 350ms | **4.40x** |
| GroupBy agg | 406ms | 141ms | **2.88x** |

*Benchmark on 10M rows*

---

## Troubleshooting Migration

### Issue: Operation Not Working

Some pandas operations may not be supported. Check:

1. Is the operation in the [compatibility list](/docs/chdb/datastore/pandas-compat)?
2. Try converting to pandas first: `ds.to_df().operation()`

### Issue: Different Results

Enable debug logging to understand what's happening:

```python
from chdb.datastore.config import config
config.enable_debug()

# View the SQL being generated
ds.filter(ds['x'] > 10).explain()
```

### Issue: Slow Performance

Check your execution pattern:

```python
# Bad: Multiple small executions
for i in range(1000):
    result = ds.filter(ds['id'] == i).to_df()

# Good: Single execution
result = ds.filter(ds['id'].isin(ids)).to_df()
```

### Issue: Type Mismatches

DataStore may infer types differently:

```python
# Check types
print(ds.dtypes)

# Force conversion
ds['col'] = ds['col'].astype('int64')
```

---

## Gradual Migration Strategy

### Week 1: Test Compatibility

```python
# Keep both imports
import pandas as pd
from chdb import datastore as ds

# Compare results
pdf = pd.read_csv("data.csv")
dsf = ds.read_csv("data.csv")

# Verify they match
assert pdf.equals(dsf.to_pandas())
```

### Week 2: Switch Simple Scripts

Start with scripts that:
- Read large files
- Do filtering and aggregation
- Don't use custom apply functions

### Week 3: Handle Complex Cases

For scripts with custom functions:

```python
from chdb import datastore as pd

# Let DataStore handle the heavy lifting
ds = pd.read_csv("data.csv")
ds = ds.filter(ds['year'] == 2024)  # SQL

# Convert for custom work
df = ds.to_df()
result = df.apply(my_custom_function)
```

### Week 4: Full Migration

Switch all scripts to DataStore import.

---

## FAQ

### Can I use both pandas and DataStore?

Yes! Convert between them freely:

```python
from chdb import datastore as ds
import pandas as pd

# DataStore to pandas
df = ds_result.to_pandas()

# pandas to DataStore
ds = ds.DataFrame(pd_result)
```

### Will my tests still pass?

Most tests should pass. For comparison tests, convert to pandas:

```python
def test_my_function():
    result = my_function()
    expected = pd.DataFrame(...)
    pd.testing.assert_frame_equal(result.to_pandas(), expected)
```

### Can I use DataStore in Jupyter?

Yes! DataStore works in Jupyter notebooks:

```python
from chdb import datastore as pd

ds = pd.read_csv("data.csv")
ds.head()  # Displays nicely in Jupyter
```

### How do I report issues?

If you find compatibility issues, report them at:
https://github.com/chdb-io/chdb/issues