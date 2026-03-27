---
title: 'Pandas Cookbook'
slug: /chdb/guides/pandas-cookbook
description: 'Common pandas patterns and their DataStore equivalents'
keywords: ['chdb', 'datastore', 'pandas', 'cookbook', 'patterns', 'examples']
---


Common pandas patterns and their DataStore equivalents. Most code works unchanged!

## Data Loading

### Read CSV

```python
# Pandas
import pandas as pd
df = pd.read_csv("data.csv")

# DataStore - same!
from chdb import datastore as pd
df = pd.read_csv("data.csv")
```

### Read Multiple Files

```python
# Pandas
import glob
dfs = [pd.read_csv(f) for f in glob.glob("data/*.csv")]
df = pd.concat(dfs)

# DataStore - more efficient with glob pattern
df = pd.read_csv("data/*.csv")
```

---

## Filtering

### Single Condition

```python
# Pandas and DataStore - identical
df[df['age'] > 25]
df[df['city'] == 'NYC']
df[df['name'].str.contains('John')]
```

### Multiple Conditions

```python
# AND
df[(df['age'] > 25) & (df['city'] == 'NYC')]

# OR
df[(df['age'] < 18) | (df['age'] > 65)]

# NOT
df[~(df['status'] == 'inactive')]
```

### Using query()

```python
# Pandas and DataStore - identical
df.query('age > 25 and city == "NYC"')
df.query('salary > 50000')
```

### isin()

```python
# Pandas and DataStore - identical
df[df['city'].isin(['NYC', 'LA', 'SF'])]
```

### between()

```python
# Pandas and DataStore - identical
df[df['age'].between(18, 65)]
```

---

## Selecting Columns

### Single Column

```python
# Pandas and DataStore - identical
df['name']
df.name  # attribute access
```

### Multiple Columns

```python
# Pandas and DataStore - identical
df[['name', 'age', 'city']]
```

### Select and Filter

```python
# Pandas and DataStore - identical
df[df['age'] > 25][['name', 'salary']]

# DataStore also supports SQL-style
df.filter(df['age'] > 25).select('name', 'salary')
```

---

## Sorting

### Single Column

```python
# Pandas and DataStore - identical
df.sort_values('salary')
df.sort_values('salary', ascending=False)
```

### Multiple Columns

```python
# Pandas and DataStore - identical
df.sort_values(['city', 'salary'], ascending=[True, False])
```

### Get Top/Bottom N

```python
# Pandas and DataStore - identical
df.nlargest(10, 'salary')
df.nsmallest(5, 'age')
```

---

## GroupBy and Aggregation

### Simple GroupBy

```python
# Pandas and DataStore - identical
df.groupby('city')['salary'].mean()
df.groupby('city')['salary'].sum()
df.groupby('city').size()  # count
```

### Multiple Aggregations

```python
# Pandas and DataStore - identical
df.groupby('city')['salary'].agg(['sum', 'mean', 'count'])

df.groupby('city').agg({
    'salary': ['sum', 'mean'],
    'age': ['min', 'max']
})
```

### Named Aggregations

```python
# Pandas and DataStore - identical
df.groupby('city').agg(
    total_salary=('salary', 'sum'),
    avg_salary=('salary', 'mean'),
    employee_count=('id', 'count')
)
```

### Multiple GroupBy Keys

```python
# Pandas and DataStore - identical
df.groupby(['city', 'department'])['salary'].mean()
```

---

## Joining Data

### Inner Join

```python
# Pandas
pd.merge(df1, df2, on='id')

# DataStore - same API
pd.merge(df1, df2, on='id')

# DataStore also supports
df1.join(df2, on='id')
```

### Left Join

```python
# Pandas and DataStore - identical
pd.merge(df1, df2, on='id', how='left')
```

### Join on Different Columns

```python
# Pandas and DataStore - identical
pd.merge(df1, df2, left_on='emp_id', right_on='id')
```

### Concat

```python
# Pandas and DataStore - identical
pd.concat([df1, df2, df3])
pd.concat([df1, df2], axis=1)
```

---

## String Operations

### Case Conversion

```python
# Pandas and DataStore - identical
df['name'].str.upper()
df['name'].str.lower()
df['name'].str.title()
```

### Substring

```python
# Pandas and DataStore - identical
df['name'].str[:3]        # First 3 characters
df['name'].str.slice(0, 3)
```

### Search

```python
# Pandas and DataStore - identical
df['name'].str.contains('John')
df['name'].str.startswith('A')
df['name'].str.endswith('son')
```

### Replace

```python
# Pandas and DataStore - identical
df['text'].str.replace('old', 'new')
df['text'].str.replace(r'\d+', '', regex=True)  # Remove digits
```

### Split

```python
# Pandas and DataStore - identical
df['name'].str.split(' ')
df['name'].str.split(' ', expand=True)
```

### Length

```python
# Pandas and DataStore - identical
df['name'].str.len()
```

---

## DateTime Operations

### Extract Components

```python
# Pandas and DataStore - identical
df['date'].dt.year
df['date'].dt.month
df['date'].dt.day
df['date'].dt.dayofweek
df['date'].dt.hour
```

### Formatting

```python
# Pandas and DataStore - identical
df['date'].dt.strftime('%Y-%m-%d')
```

---

## Missing Data

### Check Missing

```python
# Pandas and DataStore - identical
df['col'].isna()
df['col'].notna()
df.isna().sum()
```

### Drop Missing

```python
# Pandas and DataStore - identical
df.dropna()
df.dropna(subset=['col1', 'col2'])
```

### Fill Missing

```python
# Pandas and DataStore - identical
df.fillna(0)
df.fillna({'col1': 0, 'col2': 'Unknown'})
df.fillna(method='ffill')
```

---

## Creating New Columns

### Simple Assignment

```python
# Pandas and DataStore - identical
df['total'] = df['price'] * df['quantity']
df['age_group'] = df['age'] // 10 * 10
```

### Using assign()

```python
# Pandas and DataStore - identical
df = df.assign(
    total=df['price'] * df['quantity'],
    is_adult=df['age'] >= 18
)
```

### Conditional (where/mask)

```python
# Pandas and DataStore - identical
df['status'] = df['age'].where(df['age'] >= 18, 'minor')
```

### apply() for Custom Logic

```python
# Works, but triggers pandas execution
df['category'] = df['amount'].apply(lambda x: 'high' if x > 1000 else 'low')

# DataStore alternative (stays lazy)
df['category'] = (
    df.when(df['amount'] > 1000, 'high')
      .otherwise('low')
)
```

---

## Reshaping

### Pivot Table

```python
# Pandas and DataStore - identical
df.pivot_table(
    values='amount',
    index='region',
    columns='product',
    aggfunc='sum'
)
```

### Melt (Unpivot)

```python
# Pandas and DataStore - identical
df.melt(
    id_vars=['name'],
    value_vars=['score1', 'score2', 'score3'],
    var_name='test',
    value_name='score'
)
```

### Explode

```python
# Pandas and DataStore - identical
df.explode('tags')  # Expand array column
```

---

## Window Functions

### Rolling

```python
# Pandas and DataStore - identical
df['rolling_avg'] = df['price'].rolling(window=7).mean()
df['rolling_sum'] = df['amount'].rolling(window=30).sum()
```

### Expanding

```python
# Pandas and DataStore - identical
df['cumsum'] = df['amount'].expanding().sum()
df['cummax'] = df['amount'].expanding().max()
```

### Shift

```python
# Pandas and DataStore - identical
df['prev_value'] = df['value'].shift(1)   # Lag
df['next_value'] = df['value'].shift(-1)  # Lead
```

### Diff

```python
# Pandas and DataStore - identical
df['change'] = df['value'].diff()
df['pct_change'] = df['value'].pct_change()
```

---

## Output

### To CSV

```python
# Pandas and DataStore - identical
df.to_csv("output.csv", index=False)
```

### To Parquet

```python
# Pandas and DataStore - identical
df.to_parquet("output.parquet")
```

### To pandas DataFrame

```python
# DataStore specific
pandas_df = ds.to_df()
pandas_df = ds.to_pandas()
```

---

## DataStore Extras

### View SQL

```python
# DataStore only
print(ds.to_sql())
```

### Explain Plan

```python
# DataStore only
ds.explain()
```

### ClickHouse Functions

```python
# DataStore only - extra accessors
df['domain'] = df['url'].url.domain()
df['json_value'] = df['data'].json.get_string('key')
df['ip_valid'] = df['ip'].ip.is_ipv4_string()
```

### Universal URI

```python
# DataStore only - read from anywhere
ds = DataStore.uri("s3://bucket/data.parquet")
ds = DataStore.uri("mysql://user:pass@host/db/table")
```