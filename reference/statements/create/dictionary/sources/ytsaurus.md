---
slug: /sql-reference/statements/create/dictionary/sources/ytsaurus
title: 'YTsaurus dictionary source'
description: 'Configure YTsaurus as a dictionary source in ClickHouse.'
doc_type: 'reference'
---


<ExperimentalBadge/>
<CloudNotSupportedBadge/>

:::info
This is an experimental feature that may change in backwards-incompatible ways in future releases.
Enable usage of the YTsaurus dictionary source
using setting [`allow_experimental_ytsaurus_dictionary_source`](/operations/settings/settings#allow_experimental_ytsaurus_dictionary_source).
:::

Example of settings:

<Tabs>
<Tab title="DDL">

```sql
SOURCE(YTSAURUS(
    http_proxy_urls 'http://localhost:8000'
    cypress_path '//tmp/test'
    oauth_token 'password'
))
```

</Tab>
<Tab title="Configuration file">

```xml
<source>
    <ytsaurus>
        <http_proxy_urls>http://localhost:8000</http_proxy_urls>
        <cypress_path>//tmp/test</cypress_path>
        <oauth_token>password</oauth_token>
        <check_table_schema>1</check_table_schema>
    </ytsaurus>
</source>
```

</Tab>
</Tabs>
<br/>

Setting fields:

| Setting | Description |
|---------|-------------|
| `http_proxy_urls` | URL to the YTsaurus http proxy. |
| `cypress_path` | Cypress path to the table source. |
| `oauth_token` | OAuth token. |
