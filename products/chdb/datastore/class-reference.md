---
title: 'DataStore Class Reference'
slug: /chdb/datastore/class-reference
description: 'Complete API reference for DataStore, ColumnExpr, LazyGroupBy, and LazySeries classes'
keywords: ['chdb', 'datastore', 'class', 'reference', 'api', 'columnexpr', 'lazygroupby']
---


This reference documents the core classes in the DataStore API.

## DataStore
The main DataFrame-like class for data manipulation.

```python
from chdb.datastore import DataStore
```

### Constructor
```python
DataStore(data=None, columns=None, index=None, dtype=None, copy=None)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | dict/list/DataFrame/DataStore | Input data |
| `columns` | list | Column names |
| `index` | Index | Row index |
| `dtype` | dict | Column data types |
| `copy` | bool | Copy data |

**Examples:**

```python
# From dictionary
ds = DataStore({'a': [1, 2, 3], 'b': ['x', 'y', 'z']})

# From pandas DataFrame
import pandas as pd
ds = DataStore(pd.DataFrame({'a': [1, 2, 3]}))

# Empty DataStore
ds = DataStore()
```

### Properties
| Property | Type | Description |
|----------|------|-------------|
| `columns` | Index | Column names |
| `dtypes` | Series | Column data types |
| `shape` | tuple | (rows, columns) |
| `size` | int | Total elements |
| `ndim` | int | Number of dimensions (2) |
| `empty` | bool | Is DataFrame empty |
| `values` | ndarray | Underlying data as NumPy array |
| `index` | Index | Row index |
| `T` | DataStore | Transpose |
| `axes` | list | List of axes |

### Factory Methods
| Method | Description |
|--------|-------------|
| `uri(uri)` | Universal factory from URI |
| `from_file(path, ...)` | Create from file |
| `from_df(df)` | Create from pandas DataFrame |
| `from_s3(url, ...)` | Create from S3 |
| `from_gcs(url, ...)` | Create from Google Cloud Storage |
| `from_azure(url, ...)` | Create from Azure Blob |
| `from_mysql(...)` | Create from MySQL |
| `from_postgresql(...)` | Create from PostgreSQL |
| `from_clickhouse(...)` | Create from ClickHouse |
| `from_mongodb(...)` | Create from MongoDB |
| `from_sqlite(...)` | Create from SQLite |
| `from_iceberg(path)` | Create from Iceberg table |
| `from_delta(path)` | Create from Delta Lake |
| `from_numbers(n)` | Create with sequential numbers |
| `from_random(rows, cols)` | Create with random data |
| `run_sql(query)` | Create from SQL query |

See [Factory Methods](/docs/chdb/datastore/factory-methods) for details.

### Query Methods
| Method | Returns | Description |
|--------|---------|-------------|
| `select(*cols)` | DataStore | Select columns |
| `filter(condition)` | DataStore | Filter rows |
| `where(condition)` | DataStore | Alias for filter |
| `sort(*cols, ascending=True)` | DataStore | Sort rows |
| `orderby(*cols)` | DataStore | Alias for sort |
| `limit(n)` | DataStore | Limit rows |
| `offset(n)` | DataStore | Skip rows |
| `distinct(subset=None)` | DataStore | Remove duplicates |
| `groupby(*cols)` | LazyGroupBy | Group rows |
| `having(condition)` | DataStore | Filter groups |
| `join(right, ...)` | DataStore | Join DataStores |
| `union(other, all=False)` | DataStore | Combine DataStores |
| `when(cond, val)` | CaseWhen | CASE WHEN |

See [Query Building](/docs/chdb/datastore/query-building) for details.

### Pandas-Compatible Methods
See [Pandas Compatibility](/docs/chdb/datastore/pandas-compat) for the complete list of 209 methods.

**Indexing:**
`head()`, `tail()`, `sample()`, `loc`, `iloc`, `at`, `iat`, `query()`, `isin()`, `where()`, `mask()`, `get()`, `xs()`, `pop()`

**Aggregation:**
`sum()`, `mean()`, `std()`, `var()`, `min()`, `max()`, `median()`, `count()`, `nunique()`, `quantile()`, `describe()`, `corr()`, `cov()`, `skew()`, `kurt()`

**Manipulation:**
`drop()`, `drop_duplicates()`, `dropna()`, `fillna()`, `replace()`, `rename()`, `assign()`, `astype()`, `copy()`

**Sorting:**
`sort_values()`, `sort_index()`, `nlargest()`, `nsmallest()`, `rank()`

**Reshaping:**
`pivot()`, `pivot_table()`, `melt()`, `stack()`, `unstack()`, `transpose()`, `explode()`, `squeeze()`

**Combining:**
`merge()`, `join()`, `concat()`, `append()`, `combine()`, `update()`, `compare()`

**Apply/Transform:**
`apply()`, `applymap()`, `map()`, `agg()`, `transform()`, `pipe()`, `groupby()`

**Time Series:**
`rolling()`, `expanding()`, `ewm()`, `shift()`, `diff()`, `pct_change()`, `resample()`

### I/O Methods
| Method | Description |
|--------|-------------|
| `to_csv(path, ...)` | Export to CSV |
| `to_parquet(path, ...)` | Export to Parquet |
| `to_json(path, ...)` | Export to JSON |
| `to_excel(path, ...)` | Export to Excel |
| `to_df()` | Convert to pandas DataFrame |
| `to_pandas()` | Alias for to_df |
| `to_arrow()` | Convert to Arrow Table |
| `to_dict(orient)` | Convert to dictionary |
| `to_records()` | Convert to records |
| `to_numpy()` | Convert to NumPy array |
| `to_sql()` | Generate SQL string |
| `to_string()` | String representation |
| `to_markdown()` | Markdown table |
| `to_html()` | HTML table |

See [I/O Operations](/docs/chdb/datastore/io) for details.

### Debugging Methods
| Method | Description |
|--------|-------------|
| `explain(verbose=False)` | Show execution plan |
| `clear_cache()` | Clear cached results |

See [Debugging](/docs/chdb/datastore/debugging) for details.

### Magic Methods
| Method | Description |
|--------|-------------|
| `__getitem__(key)` | `ds['col']`, `ds[['a', 'b']]`, `ds[condition]` |
| `__setitem__(key, value)` | `ds['col'] = value` |
| `__delitem__(key)` | `del ds['col']` |
| `__len__()` | `len(ds)` |
| `__iter__()` | `for col in ds` |
| `__contains__(key)` | `'col' in ds` |
| `__repr__()` | `repr(ds)` |
| `__str__()` | `str(ds)` |
| `__eq__(other)` | `ds == other` |
| `__ne__(other)` | `ds != other` |
| `__lt__(other)` | `ds < other` |
| `__le__(other)` | `ds <= other` |
| `__gt__(other)` | `ds > other` |
| `__ge__(other)` | `ds >= other` |
| `__add__(other)` | `ds + other` |
| `__sub__(other)` | `ds - other` |
| `__mul__(other)` | `ds * other` |
| `__truediv__(other)` | `ds / other` |
| `__floordiv__(other)` | `ds // other` |
| `__mod__(other)` | `ds % other` |
| `__pow__(other)` | `ds ** other` |
| `__and__(other)` | `ds & other` |
| `__or__(other)` | `ds | other` |
| `__invert__()` | `~ds` |
| `__neg__()` | `-ds` |
| `__pos__()` | `+ds` |
| `__abs__()` | `abs(ds)` |

---

## ColumnExpr
Represents a column expression for lazy evaluation. Returned when accessing a column.

```python
# ColumnExpr is returned automatically
col = ds['name']  # Returns ColumnExpr
```

### Properties
| Property | Type | Description |
|----------|------|-------------|
| `name` | str | Column name |
| `dtype` | dtype | Data type |

### Accessors
| Accessor | Description | Methods |
|----------|-------------|---------|
| `.str` | String operations | 56 methods |
| `.dt` | DateTime operations | 42+ methods |
| `.arr` | Array operations | 37 methods |
| `.json` | JSON parsing | 13 methods |
| `.url` | URL parsing | 15 methods |
| `.ip` | IP address operations | 9 methods |
| `.geo` | Geo/distance operations | 14 methods |

See [Accessors](/docs/chdb/datastore/accessors) for complete documentation.

### Arithmetic Operations
```python
ds['total'] = ds['price'] * ds['quantity']
ds['profit'] = ds['revenue'] - ds['cost']
ds['ratio'] = ds['a'] / ds['b']
ds['squared'] = ds['value'] ** 2
ds['remainder'] = ds['value'] % 10
```

### Comparison Operations
```python
ds[ds['age'] > 25]           # Greater than
ds[ds['age'] >= 25]          # Greater or equal
ds[ds['age'] < 25]           # Less than
ds[ds['age'] <= 25]          # Less or equal
ds[ds['name'] == 'Alice']    # Equal
ds[ds['name'] != 'Bob']      # Not equal
```

### Logical Operations
```python
ds[(ds['age'] > 25) & (ds['city'] == 'NYC')]    # AND
ds[(ds['age'] > 25) | (ds['city'] == 'NYC')]    # OR
ds[~(ds['status'] == 'inactive')]               # NOT
```

### Methods
| Method | Description |
|--------|-------------|
| `as_(alias)` | Set alias name |
| `cast(dtype)` | Cast to type |
| `astype(dtype)` | Alias for cast |
| `isnull()` | Is NULL |
| `notnull()` | Is not NULL |
| `isna()` | Alias for isnull |
| `notna()` | Alias for notnull |
| `isin(values)` | In list of values |
| `between(low, high)` | Between two values |
| `fillna(value)` | Fill NULLs |
| `replace(to_replace, value)` | Replace values |
| `clip(lower, upper)` | Clip values |
| `abs()` | Absolute value |
| `round(decimals)` | Round values |
| `floor()` | Floor |
| `ceil()` | Ceiling |
| `apply(func)` | Apply function |
| `map(mapper)` | Map values |

### Aggregation Methods
| Method | Description |
|--------|-------------|
| `sum()` | Sum |
| `mean()` | Mean |
| `avg()` | Alias for mean |
| `min()` | Minimum |
| `max()` | Maximum |
| `count()` | Count non-null |
| `nunique()` | Unique count |
| `std()` | Standard deviation |
| `var()` | Variance |
| `median()` | Median |
| `quantile(q)` | Quantile |
| `first()` | First value |
| `last()` | Last value |
| `any()` | Any true |
| `all()` | All true |

---

## LazyGroupBy
Represents a grouped DataStore for aggregation operations.

```python
# LazyGroupBy is returned automatically
grouped = ds.groupby('category')  # Returns LazyGroupBy
```

### Methods
| Method | Returns | Description |
|--------|---------|-------------|
| `agg(spec)` | DataStore | Aggregate |
| `aggregate(spec)` | DataStore | Alias for agg |
| `sum()` | DataStore | Sum per group |
| `mean()` | DataStore | Mean per group |
| `count()` | DataStore | Count per group |
| `min()` | DataStore | Min per group |
| `max()` | DataStore | Max per group |
| `std()` | DataStore | Std dev per group |
| `var()` | DataStore | Variance per group |
| `median()` | DataStore | Median per group |
| `nunique()` | DataStore | Unique count per group |
| `first()` | DataStore | First value per group |
| `last()` | DataStore | Last value per group |
| `nth(n)` | DataStore | Nth value per group |
| `head(n)` | DataStore | First n per group |
| `tail(n)` | DataStore | Last n per group |
| `apply(func)` | DataStore | Apply function per group |
| `transform(func)` | DataStore | Transform per group |
| `filter(func)` | DataStore | Filter groups |

### Column Selection
```python
# Select column after groupby
grouped['amount'].sum()     # Returns DataStore
grouped[['a', 'b']].sum()   # Returns DataStore
```

### Aggregation Specifications
```python
# Single aggregation
grouped.agg({'amount': 'sum'})

# Multiple aggregations per column
grouped.agg({'amount': ['sum', 'mean', 'count']})

# Named aggregations
grouped.agg(
    total=('amount', 'sum'),
    average=('amount', 'mean'),
    count=('id', 'count')
)
```

---

## LazySeries
Represents a lazy Series (single column).

### Properties
| Property | Type | Description |
|----------|------|-------------|
| `name` | str | Series name |
| `dtype` | dtype | Data type |

### Methods
Inherits most methods from `ColumnExpr`. Key methods:

| Method | Description |
|--------|-------------|
| `value_counts()` | Value frequencies |
| `unique()` | Unique values |
| `nunique()` | Count unique |
| `mode()` | Mode value |
| `to_list()` | Convert to list |
| `to_numpy()` | Convert to array |
| `to_frame()` | Convert to DataStore |

---

## Related Classes
### F (Functions)
Namespace for ClickHouse functions.

```python
from chdb.datastore import F, Field

# Aggregations
F.sum(Field('amount'))
F.avg(Field('price'))
F.count(Field('id'))
F.quantile(Field('value'), 0.95)

# Conditional
F.sum_if(Field('amount'), Field('status') == 'completed')
F.count_if(Field('active'))

# Window
F.row_number().over(order_by='date')
F.lag('price', 1).over(partition_by='product', order_by='date')
```

See [Aggregation](/docs/chdb/datastore/aggregation#f-namespace) for details.

### Field
Reference to a column by name.

```python
from chdb.datastore import Field

# Create field reference
amount = Field('amount')
price = Field('price')

# Use in expressions
F.sum(Field('amount'))
F.avg(Field('price'))
```

### CaseWhen
Builder for CASE WHEN expressions.

```python
# Create case-when expression
result = (ds
    .when(ds['score'] >= 90, 'A')
    .when(ds['score'] >= 80, 'B')
    .when(ds['score'] >= 70, 'C')
    .otherwise('F')
)

# Assign to column
ds['grade'] = result
```

### Window
Window specification for window functions.

```python
from chdb.datastore import F

# Create window
window = F.window(
    partition_by='category',
    order_by='date',
    rows_between=(-7, 0)
)

# Use with aggregation
ds['rolling_avg'] = F.avg('price').over(window)
```
