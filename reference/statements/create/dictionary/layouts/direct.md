---
slug: /sql-reference/statements/create/dictionary/layouts/direct
title: 'direct dictionary layout'
description: 'A dictionary layout that queries the source directly without caching.'
doc_type: 'reference'
---


## direct

The dictionary is not stored in memory and directly goes to the source during the processing of a request.

The dictionary key has the [UInt64](/sql-reference/data-types/int-uint.md) type.

All types of [sources](../sources/#dictionary-sources), except local files, are supported.

Configuration example:

<Tabs>
<Tab title="DDL">

```sql
LAYOUT(DIRECT())
```

</Tab>
<Tab title="Configuration file">

```xml
<layout>
  <direct />
</layout>
```

</Tab>
</Tabs>
<br/>

## complex_key_direct

This type of storage is for use with composite [keys](../attributes.md#composite-key). Similar to `direct`.
