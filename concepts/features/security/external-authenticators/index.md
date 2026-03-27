---
description: 'Overview of external authentication methods supported by ClickHouse'
slug: /operations/external-authenticators/
title: 'External User Authenticators and Directories'
doc_type: 'reference'
---

import SelfManagedOnlyNoRoadmap from '/snippets/_self_managed_only_no_roadmap.mdx';

<SelfManagedOnlyNoRoadmap />

ClickHouse supports authenticating and managing users using external services.

The following external authenticators and directories are supported:

- [LDAP](/operations/external-authenticators/ldap#ldap-external-authenticator) Authenticator and [Directory](/operations/external-authenticators/ldap#ldap-external-user-directory)
- Kerberos [Authenticator](/operations/external-authenticators/kerberos#kerberos-as-an-external-authenticator-for-existing-users)
- [SSL X.509 authentication](/operations/external-authenticators/ssl-x509)
- HTTP [Authenticator](/operations/external-authenticators/http)