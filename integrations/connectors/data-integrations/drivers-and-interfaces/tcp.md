---
description: 'Documentation for the native TCP interface in ClickHouse'
sidebarTitle: 'Native interface (TCP)'
sidebar_position: 18
slug: /interfaces/tcp
title: 'Native interface (TCP)'
doc_type: 'reference'
---

The native protocol is used in the [command-line client](../interfaces/cli.md), for inter-server communication during distributed query processing, and also in other C++ programs. Unfortunately, native ClickHouse protocol does not have formal specification yet, but it can be reverse-engineered from ClickHouse source code (starting [around here](https://github.com/ClickHouse/ClickHouse/tree/master/src/Client)) and/or by intercepting and analyzing TCP traffic.
