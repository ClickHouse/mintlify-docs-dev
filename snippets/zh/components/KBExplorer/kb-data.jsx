export const kbIndex = {
  categories: [
    "Cloud",
    "配置与设置",
    "数据导入与导出",
    "数据管理",
    "常规与常见问题",
    "集成与客户端库",
    "Materialized views 与 projections",
    "监控与调试",
    "性能与优化",
    "查询与 SQL",
    "安全与访问控制",
    "安装与部署",
    "表与 schema",
    "故障排查与错误"
  ],
  tags: [
    "最佳实践",
    "社区",
    "概念",
    "核心数据概念",
    "数据导出",
    "数据格式",
    "数据摄取",
    "数据建模",
    "数据源",
    "部署与扩展",
    "错误与异常",
    "函数",
    "语言客户端",
    "管理 Cloud",
    "数据管理",
    "原生客户端与接口",
    "性能与优化",
    "安全与身份验证",
    "服务器管理",
    "设置",
    "系统表",
    "工具与实用程序",
    "故障排查",
    "使用场景"
  ],
  articles: [
    {
      id: "integrations/python-clickhouse-connect-example",
      title: "连接 ClickHouse Cloud Service 的 Python 客户端示例",
      description: "通过使用 clickhouse-connect 驱动的分步示例，了解如何使用 Python 连接 ClickHouse Cloud Service。",
      href: "/resources/support-center/knowledge-base/integrations/python-clickhouse-connect-example",
      category: "集成与客户端库",
      tags: ["Language Clients"]
    },
    {
      id: "configuration-settings/about-quotas-and-query-complexity",
      title: "关于配额与查询复杂度",
      description:
        "配额与查询复杂度是限制用户在 ClickHouse 中操作权限的有效手段。本知识库文章通过示例展示如何应用这两种不同的方式。",
      href: "/resources/support-center/knowledge-base/configuration-settings/about-quotas-and-query-complexity",
      category: "配置与设置",
      tags: ["Managing Cloud"]
    },
    {
      id: "data-import-export/achieving-atomic-inserts",
      title: "在 ClickHouse Cloud 中实现原子插入与多表一致性",
      description: "如何在不使用多语句事务的情况下，通过暂存表和分区级操作，在 ClickHouse Cloud 中原子性地加载数据并保持多表一致性。",
      href: "/resources/support-center/knowledge-base/data-import-export/achieving-atomic-inserts",
      category: "数据导入与导出",
      tags: ["数据摄取", "Best Practices"]
    },
    {
      id: "tables-schema/add-column",
      title: "向表中添加列",
      description: "本指南将介绍如何向现有表添加列。",
      href: "/resources/support-center/knowledge-base/tables-schema/add-column",
      category: "表与 schema",
      tags: ["Data Modelling"]
    },
    {
      id: "configuration-settings/alter-user-settings-exception",
      title: "修改用户设置时的异常处理",
      description: "处理修改用户设置时抛出的异常",
      href: "/resources/support-center/knowledge-base/configuration-settings/alter-user-settings-exception",
      category: "配置与设置",
      tags: ["设置", "Errors and Exceptions"]
    },
    {
      id: "materialized-views/are-materialized-views-inserted-asynchronously",
      title: "Materialized Views 是同步插入的吗？",
      description: "本知识库文章探讨 Materialized Views 是否以同步方式插入",
      href: "/resources/support-center/knowledge-base/materialized-views/are-materialized-views-inserted-asynchronously",
      category: "Materialized views 与 projections",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/schema-migration-tools",
      title: "ClickHouse 的自动 schema 迁移工具",
      description: "了解 ClickHouse 的自动 schema 迁移工具，以及如何随时间推移管理不断变化的数据库 schema。",
      href: "/resources/support-center/knowledge-base/tables-schema/schema-migration-tools",
      category: "表与 schema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      title: "配置 AWS PrivateLink 以将 MSK 暴露给 ClickPipes",
      description: "通过 MSK 多 VPC 连接将私有 MSK 暴露给 ClickPipes 的配置步骤。",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      category: "Cloud",
      tags: ["安全与身份验证", "Managing Cloud"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-clickpipes",
      title: "配置 AWS PrivateLink 以将私有 RDS 暴露给 ClickPipes",
      description: "通过 AWS PrivateLink 将私有 RDS 暴露给 ClickPipes 的配置步骤。",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-clickpipes",
      category: "Cloud",
      tags: ["安全与身份验证", "Managing Cloud"]
    },
    {
      id: "data-management/backing-up-a-specific-partition",
      title: "备份特定分区",
      description: "如何在 ClickHouse 中备份特定分区？",
      href: "/resources/support-center/knowledge-base/data-management/backing-up-a-specific-partition",
      category: "数据管理",
      tags: ["Managing Data"]
    },
    {
      id: "general-faqs/key-value",
      title: "ClickHouse 能用作键值存储吗？",
      description: "解答 ClickHouse 是否可用作键值存储这一常见问题。",
      href: "/resources/support-center/knowledge-base/general-faqs/key-value",
      category: "常规与常见问题",
      tags: []
    },
    {
      id: "general-faqs/time-series",
      title: "ClickHouse 能用作时序数据库吗？",
      description: "介绍如何将 ClickHouse 用作时序数据库",
      href: "/resources/support-center/knowledge-base/general-faqs/time-series",
      category: "常规与常见问题",
      tags: []
    },
    {
      id: "queries-sql/pivot",
      title: "ClickHouse 支持 PIVOT 吗？",
      description:
        "ClickHouse 没有 PIVOT 子句，但可以使用聚合函数组合器实现类似功能。下面以英国房价数据集为例进行演示。",
      href: "/resources/support-center/knowledge-base/queries-sql/pivot",
      category: "查询与 SQL",
      tags: ["数据建模", "Core Data Concepts"]
    },
    {
      id: "general-faqs/vector-search",
      title: "ClickHouse 能用于向量搜索吗？",
      description: "了解如何使用 ClickHouse 进行向量搜索，包括存储嵌入向量以及使用余弦相似度等距离函数进行搜索。",
      href: "/resources/support-center/knowledge-base/general-faqs/vector-search",
      category: "常规与常见问题",
      tags: ["使用场景", "Concepts"]
    },
    {
      id: "monitoring-debugging/send-logs-level",
      title: "在客户端捕获查询的服务器日志",
      description: "了解如何使用 `send_logs_level` 客户端设置在客户端层面捕获服务器日志，即使日志配置各异也同样适用。",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/send-logs-level",
      category: "监控与调试",
      tags: ["Server Admin"]
    },
    {
      id: "configuration-settings/change-the-prompt-in-clickhouse-client",
      title: "修改 clickhouse-client 的提示符",
      description: "本文介绍如何将 ClickHouse 客户端和 clickhouse-local 终端窗口中的提示符从 :) 修改为带前缀的 :)",
      href: "/resources/support-center/knowledge-base/configuration-settings/change-the-prompt-in-clickhouse-client",
      category: "配置与设置",
      tags: ["设置", "Native Clients and Interfaces"]
    },
    {
      id: "security/common-rbac-queries",
      title: "常用 RBAC 查询",
      description: "用于向用户授予特定权限的查询语句。",
      href: "/resources/support-center/knowledge-base/security/common-rbac-queries",
      category: "安全与访问控制",
      tags: ["安全与身份验证", "Managing Cloud"]
    },
    {
      id: "queries-sql/comparing-metrics-between-queries",
      title: "以分贝为单位比较查询间的指标",
      description: "用于在 ClickHouse 中比较两个查询指标的查询语句。",
      href: "/resources/support-center/knowledge-base/queries-sql/comparing-metrics-between-queries",
      category: "Queries & SQL",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "在 Docker 中配置 CAP_IPC_LOCK 和 CAP_SYS_NICE 功能",
      description: "了解如何解决在容器中运行 ClickHouse 时出现的 `CAP_IPC_LOCK` 和 `CAP_SYS_NICE` Docker 功能警告。",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Configuration & settings",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "在 Docker 中配置 CAP_IPC_LOCK 和 CAP_SYS_NICE 功能",
      description: "了解如何解决在容器中运行 ClickHouse 时出现的 `CAP_IPC_LOCK` 和 `CAP_SYS_NICE` Docker 功能警告。",
      href: "/resources/support-center/knowledge-base/troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "cloud-services/custom-dns-alias-for-instance",
      title: "通过设置反向代理创建自定义 DNS 别名",
      description: "了解如何使用反向代理为您的实例设置自定义 DNS 别名",
      href: "/resources/support-center/knowledge-base/cloud-services/custom-dns-alias-for-instance",
      category: "Cloud",
      tags: ["Server Admin", "Security and Authentication"]
    },
    {
      id: "troubleshooting/part-intersects-previous-part",
      title: "DB::Exception: Part XXXXX intersects previous part YYYYY. It is a bug or a result of manual intervention in the ZooKeeper data.",
      description:
        "本文介绍如何解决 ClickHouse 中与相交部分相关的 DB::Exception 错误，该错误通常由竞争条件或对 ZooKeeper 数据的手动干预引起。",
      href: "/resources/support-center/knowledge-base/troubleshooting/part-intersects-previous-part",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions", "System Tables"]
    },
    {
      id: "setup-installation/difference-between-official-builds-and-3rd-party",
      title: "官方与第三方 ClickHouse 构建版本之间的差异",
      description: "了解官方 ClickHouse 构建版本与第三方构建版本之间的主要差异，包括更新、兼容性和安全注意事项。",
      href: "/resources/support-center/knowledge-base/setup-installation/difference-between-official-builds-and-3rd-party",
      category: "Setup & installation",
      tags: ["Concepts"]
    },
    {
      id: "general-faqs/cost-based",
      title: "ClickHouse 是否具有基于成本的优化器",
      description: "ClickHouse 具有某些基于成本的优化机制",
      href: "/resources/support-center/knowledge-base/general-faqs/cost-based",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/datalake",
      title: "ClickHouse 是否支持数据湖？",
      description: "ClickHouse 支持数据湖，包括 Iceberg、Delta Lake、Apache Hudi、Apache Paimon、Hive",
      href: "/resources/support-center/knowledge-base/general-faqs/datalake",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/distributed-join",
      title: "ClickHouse 是否支持分布式 JOIN？",
      description: "ClickHouse 支持分布式 JOIN",
      href: "/resources/support-center/knowledge-base/general-faqs/distributed-join",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/federated",
      title: "ClickHouse 是否支持联邦查询？",
      description: "ClickHouse 支持广泛的联邦查询和混合查询",
      href: "/resources/support-center/knowledge-base/general-faqs/federated",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/concurrency",
      title: "ClickHouse 是否支持频繁的并发查询？",
      description: "ClickHouse 支持高 QPS 和高并发",
      href: "/resources/support-center/knowledge-base/general-faqs/concurrency",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "cloud-services/multi-region-replication",
      title: "ClickHouse 是否支持多区域复制？",
      description: "本页面回答 ClickHouse 是否支持多区域复制",
      href: "/resources/support-center/knowledge-base/cloud-services/multi-region-replication",
      category: "Cloud",
      tags: []
    },
    {
      id: "general-faqs/updates",
      title: "ClickHouse 是否支持实时更新？",
      description: "ClickHouse 支持轻量级实时更新",
      href: "/resources/support-center/knowledge-base/general-faqs/updates",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "security/row-column-policy",
      title: "ClickHouse 是否支持行级和列级安全性？",
      description: "了解 ClickHouse 和 ClickHouse Cloud 中的行级和列级访问限制，以及如何使用策略实现基于角色的访问控制 (RBAC)。",
      href: "/resources/support-center/knowledge-base/security/row-column-policy",
      category: "Security & access control",
      tags: ["Security and Authentication"]
    },
    {
      id: "cloud-services/execute-system-queries-in-cloud",
      title: "在 ClickHouse Cloud 的所有节点上执行 SYSTEM 语句",
      description: "了解如何使用 `ON CLUSTER` 和 `clusterAllReplicas` 在 ClickHouse Cloud 服务的所有节点上执行 SYSTEM 语句和查询。",
      href: "/resources/support-center/knowledge-base/cloud-services/execute-system-queries-in-cloud",
      category: "Cloud",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "troubleshooting/count-parts-by-type",
      title: "查找宽型或紧凑型部分的数量和大小",
      description: "本知识库文章介绍如何按部分类型（宽型或紧凑型）查找部分数量。",
      href: "/resources/support-center/knowledge-base/troubleshooting/count-parts-by-type",
      category: "Troubleshooting & errors",
      tags: ["Troubleshooting"]
    },
    {
      id: "troubleshooting/fix-developer-verification-error-in-macos",
      title: "修复 MacOS 中的开发者验证错误",
      description: "了解如何使用系统设置或终端解决运行 ClickHouse 命令时出现的 MacOS 开发者验证错误。",
      href: "/resources/support-center/knowledge-base/troubleshooting/fix-developer-verification-error-in-macos",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "data-import-export/s3-export-data-year-month-folders",
      title: "如何在 S3 上按年和月进行分区写入？",
      description: "了解如何在 ClickHouse 中使用自定义路径结构将按年和月分区的数据写入 S3 存储桶。",
      href: "/resources/support-center/knowledge-base/data-import-export/s3-export-data-year-month-folders",
      category: "Data import & export",
      tags: ["Data Export", "Native Clients and Interfaces"]
    },
    {
      id: "data-import-export/kafka-clickhouse-json",
      title: "如何将新的 JSON 数据类型与 Kafka 配合使用？",
      description: "了解如何使用 Kafka 表引擎和 JSON 数据类型将 Apache Kafka 中的 JSON 消息直接加载到 ClickHouse 的单个 JSON 列中。",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-clickhouse-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Ingestion"]
    },
    {
      id: "cloud-services/change-billing-email",
      title: "如何更改 ClickHouse Cloud 中的账单联系人？",
      description: "了解如何更改 ClickHouse Cloud 中的账单地址。",
      href: "/resources/support-center/knowledge-base/cloud-services/change-billing-email",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "general-faqs/how-do-i-contribute-code-to-clickhouse",
      title: "How do I contribute code to ClickHouse?",
      description: "ClickHouse 是一个在 GitHub 上开发的开源项目。按照惯例，贡献说明发布在源代码仓库根目录的 CONTRIBUTING 文件中。",
      href: "/resources/support-center/knowledge-base/general-faqs/how-do-i-contribute-code-to-clickhouse",
      category: "General & FAQs",
      tags: ["Community"]
    },
    {
      id: "data-import-export/parquet-to-csv-json",
      title: "如何将文件从 Parquet 转换为 CSV 或 JSON？",
      description: "了解如何使用 ClickHouse 的 `clickhouse-local` 工具轻松将 Parquet 文件转换为 CSV 或 JSON 格式。",
      href: "/resources/support-center/knowledge-base/data-import-export/parquet-to-csv-json",
      category: "Data import & export",
      tags: ["Data Sources", "Data Formats"]
    },
    {
      id: "data-import-export/mysql-to-parquet-csv-json",
      title: "如何使用 ClickHouse 将 MySQL 数据导出为 Parquet、CSV 或 JSON",
      description: "了解如何使用 `clickhouse-local` 工具快速高效地将 MySQL 数据导出为 Parquet、CSV 或 JSON 等格式。",
      href: "/resources/support-center/knowledge-base/data-import-export/mysql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Export"]
    },
    {
      id: "data-import-export/postgresql-to-parquet-csv-json",
      title: "如何将 PostgreSQL 数据导出为 Parquet、CSV 或 JSON？",
      description: "通过各种示例，了解如何使用 `clickhouse-local` 将 PostgreSQL 数据导出为 Parquet、CSV 或 JSON 格式。",
      href: "/resources/support-center/knowledge-base/data-import-export/postgresql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Export", "Data Formats"]
    },
    {
      id: "setup-installation/install-clickhouse-windows10",
      title: "如何在 Windows 10 上安装 ClickHouse？",
      description: "了解如何使用 WSL 2 在 Windows 10 上安装和测试 ClickHouse，包括设置、故障排除和运行测试环境。",
      href: "/resources/support-center/knowledge-base/setup-installation/install-clickhouse-windows10",
      category: "Setup & installation",
      tags: ["Tools and Utilities"]
    },
    {
      id: "security/remove-default-user",
      title: "如何删除默认用户？",
      description: "了解如何在运行 ClickHouse Server 时删除默认用户。",
      href: "/resources/support-center/knowledge-base/security/remove-default-user",
      category: "Security & access control",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/ingest-failures-23-9-release",
      title: "如何解决 ClickHouse 23.9 版本发布后的数据摄取失败问题？",
      description: "了解如何解决 ClickHouse 23.9 中针对使用 `async_inserts` 的表引入更严格的授权检查所导致的摄取失败问题，通过更新授权来修复错误。",
      href: "/resources/support-center/knowledge-base/cloud-services/ingest-failures-23-9-release",
      category: "Cloud",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "performance-optimization/insert-select-settings-tuning",
      title: "如何解决 INSERT...SELECT 期间出现的 TOO MANY PARTS 错误？",
      description: "通过调整专家级设置以使用更大的数据块并提高分区阈值，解决 ClickHouse 在 `INSERT...SELECT` 期间出现的 TOO_MANY_PARTS 错误。",
      href: "/resources/support-center/knowledge-base/performance-optimization/insert-select-settings-tuning",
      category: "Performance & optimization",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "integrations/node-js-example",
      title: "如何在 NodeJS 中使用 @clickhouse/client",
      description: "了解如何在 Node.js 应用程序中使用 @clickhouse/client 与 ClickHouse 交互并执行查询。",
      href: "/resources/support-center/knowledge-base/integrations/node-js-example",
      category: "Integrations & client libraries",
      tags: ["Language Clients"]
    },
    {
      id: "monitoring-debugging/view-number-of-active-mutations",
      title: "如何查看活跃或排队中的变更数量？",
      description:
        "监控 ClickHouse 中活跃或排队中的变更数量，尤其是在执行 `ALTER` 或 `UPDATE` 操作时。使用 `system.mutations` 表跟踪变更。",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/view-number-of-active-mutations",
      category: "Monitoring & debugging",
      tags: ["System Tables"]
    },
    {
      id: "data-management/read-consistency",
      title: "如何在 ClickHouse 中实现数据读取一致性？",
      description: "了解在从 ClickHouse 读取数据时如何确保数据一致性，无论您连接的是同一节点还是随机节点。",
      href: "/resources/support-center/knowledge-base/data-management/read-consistency",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "setup-installation/llvm-clang-up-to-date",
      title: "如何在 Linux 上构建 LLVM 和 clang",
      description: "在 Linux 上构建 LLVM 和 clang 的命令。",
      href: "/resources/support-center/knowledge-base/setup-installation/llvm-clang-up-to-date",
      category: "Setup & installation",
      tags: ["Community", "Tools and Utilities"]
    },
    {
      id: "data-management/calculate-ratio-of-zero-sparse-serialization",
      title: "如何计算表中每列空值/零值的比例",
      description: "了解如何计算 ClickHouse 表中每列空值或零值的比例，以优化稀疏列序列化。",
      href: "/resources/support-center/knowledge-base/data-management/calculate-ratio-of-zero-sparse-serialization",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "security/check-users-roles",
      title: "如何查看分配给角色的用户及其反向关系",
      description: "了解如何查询 ClickHouse 的 `system.role_grants` 以查找分配给角色的用户以及分配给特定用户的角色。",
      href: "/resources/support-center/knowledge-base/security/check-users-roles",
      category: "Security & access control",
      tags: ["Server Admin", "System Tables", "Managing Cloud"]
    },
    {
      id: "monitoring-debugging/which-processes-are-currently-running",
      title: "如何检查服务器上当前正在运行的代码？",
      description:
        "ClickHouse 提供了 `system.stack_trace` 等内省工具，用于检查每个服务器线程上当前正在运行的代码，有助于调试和性能监控。",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/which-processes-are-currently-running",
      category: "Monitoring & debugging",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      title: "如何检查您的 ClickHouse Cloud 服务状态",
      description: "了解如何使用 ClickHouse Cloud API 检查您的服务是否已停止、空闲或正在运行，而无需唤醒它。",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "configuration-settings/configure-a-user-setting",
      title: "如何在 ClickHouse 中为用户配置设置",
      description: "了解如何使用 `SET` 和 `ALTER USER` 命令在 ClickHouse 中为单个查询、客户端会话或特定用户定义设置。",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-a-user-setting",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "materialized-views/projection-example",
      title: "如何确认查询是否使用了投影？",
      description: "了解如何通过使用示例数据测试并使用 EXPLAIN 验证投影使用情况，来检查 ClickHouse 查询中是否使用了投影。",
      href: "/resources/support-center/knowledge-base/materialized-views/projection-example",
      category: "Materialized views & projections",
      tags: ["Data Modelling"]
    },
    {
      id: "cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      title: "如何使用 SSH 密钥连接到 ClickHouse",
      description: "如何使用 SSH 密钥连接到 ClickHouse 和 ClickHouse Cloud",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      category: "Cloud",
      tags: ["Managing Cloud", "Security and Authentication"]
    },
    {
      id: "data-management/dictionary-using-strings",
      title: "如何使用字符串键和值创建 ClickHouse 字典",
      description: "了解如何以 MergeTree 表为数据源，使用字符串键和值创建 ClickHouse 字典，并附有配置和使用示例。",
      href: "/resources/support-center/knowledge-base/data-management/dictionary-using-strings",
      category: "Data management",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      title: "如何创建可查询多个远程集群的表",
      description: "如何创建可查询多个远程集群的表",
      href: "/resources/support-center/knowledge-base/tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      category: "Tables & schema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "setup-installation/enabling-ssl-with-lets-encrypt",
      title: "如何在单台 ClickHouse 服务器上使用 Let's Encrypt 启用 SSL",
      description: "了解如何使用 Let's Encrypt 为单台 ClickHouse 服务器配置 SSL，包括证书签发、配置和验证。",
      href: "/resources/support-center/knowledge-base/setup-installation/enabling-ssl-with-lets-encrypt",
      category: "Setup & installation",
      tags: ["Security and Authentication"]
    },
    {
      id: "data-import-export/file-export",
      title: "如何将 ClickHouse 中的数据导出到文件",
      description: "了解从 ClickHouse 导出数据的多种方法，包括 `INTO OUTFILE`、File 表引擎以及命令行重定向。",
      href: "/resources/support-center/knowledge-base/data-import-export/file-export",
      category: "Data import & export",
      tags: ["Data Export"]
    },
    {
      id: "queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      title: "如何按 Array 列过滤 ClickHouse 表？",
      description: "关于如何按 Array 列过滤 ClickHouse 表的知识库文章。",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      category: "Queries & SQL",
      tags: ["Data Modelling", "Functions"]
    },
    {
      id: "monitoring-debugging/generate-har-file",
      title: "如何生成 HAR 文件以供支持团队使用",
      description: "HAR（HTTP Archive）文件记录浏览器中的网络活动，可帮助 ClickHouse 支持团队诊断页面加载缓慢、请求失败或其他网络问题。",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/generate-har-file",
      category: "Monitoring & debugging",
      tags: ["Tools and Utilities"]
    },
    {
      id: "materialized-views/how-to-display-queries-using-mv",
      title: "如何识别 ClickHouse 中使用 Materialized View 的查询",
      description: "了解如何查询 ClickHouse 日志，以识别指定时间范围内涉及 materialized view 的所有查询。",
      href: "/resources/support-center/knowledge-base/materialized-views/how-to-display-queries-using-mv",
      category: "Materialized views & projections",
      tags: ["System Tables"]
    },
    {
      id: "performance-optimization/find-expensive-queries",
      title: "如何识别 ClickHouse 中开销最大的查询",
      description: "了解如何使用 ClickHouse 中的 `query_log` 表，识别分布式节点中内存和 CPU 消耗最高的查询。",
      href: "/resources/support-center/knowledge-base/performance-optimization/find-expensive-queries",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/ignoring-incorrect-settings",
      title: "如何忽略 ClickHouse 中的错误配置项",
      description: "了解如何使用 `skip_check_for_incorrect_settings` 选项，使 ClickHouse 在用户级配置项设置有误时仍能正常启动。",
      href: "/resources/support-center/knowledge-base/configuration-settings/ignoring-incorrect-settings",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "data-import-export/json-import",
      title: "如何将 JSON 导入 ClickHouse？",
      description: "本页介绍如何将 JSON 数据导入 ClickHouse。",
      href: "/resources/support-center/knowledge-base/data-import-export/json-import",
      category: "Data import & export",
      tags: []
    },
    {
      id: "setup-installation/how-to-increase-thread-pool-size",
      title: "如何增加 ClickHouse 的线程数",
      description: "了解如何通过调整 `max_thread_pool_size`、`thread_pool_queue_size` 和 `max_thread_pool_free_size` 等参数来配置 ClickHouse 全局线程池。",
      href: "/resources/support-center/knowledge-base/setup-installation/how-to-increase-thread-pool-size",
      category: "Setup & installation",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "data-import-export/kafka-to-clickhouse-setup",
      title: "如何将 Kafka 中的数据摄取到 ClickHouse",
      description: "了解如何使用 Kafka 表引擎、materialized view 和 MergeTree 表将 Kafka topic 中的数据摄取到 ClickHouse。",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-to-clickhouse-setup",
      category: "Data import & export",
      tags: ["Data Ingestion"]
    },
    {
      id: "data-import-export/ingest-parquet-files-in-s3",
      title: "如何从 S3 存储桶摄取 Parquet 文件",
      description: "了解如何使用 ClickHouse 中的 S3 表引擎从 S3 存储桶摄取和查询 Parquet 文件，包括配置、访问权限和数据导入示例。",
      href: "/resources/support-center/knowledge-base/data-import-export/ingest-parquet-files-in-s3",
      category: "Data import & export",
      tags: ["Data Ingestion"]
    },
    {
      id: "queries-sql/how-to-insert-all-rows-from-another-table",
      title: "如何将一张表中的所有行插入另一张表？",
      description: "关于如何将一张表中的所有行插入另一张表的知识库文章。",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-insert-all-rows-from-another-table",
      category: "Queries & SQL",
      tags: ["Data Ingestion"]
    },
    {
      id: "performance-optimization/check-query-processing-time-only",
      title: "如何在不返回行的情况下测量查询处理时间",
      description: "了解如何使用 ClickHouse 中的 `FORMAT Null` 选项，在不向客户端返回任何行的情况下测量查询处理时间。",
      href: "/resources/support-center/knowledge-base/performance-optimization/check-query-processing-time-only",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "monitoring-debugging/outputSendLogsLevelTracesToFile",
      title: "如何使用 clickhouse-client 将日志级别追踪信息输出到文件",
      description: "如何使用 clickhouse-client 将日志级别追踪信息输出到文件",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/outputSendLogsLevelTracesToFile",
      category: "Monitoring & debugging",
      tags: ["Data Export"]
    },
    {
      id: "tables-schema/recreate-table-across-terminals",
      title: "如何在不同终端间快速重建小表",
      description: "了解如何在开发环境中通过复制粘贴的方式，在不同终端间快速重建小表及其数据。",
      href: "/resources/support-center/knowledge-base/tables-schema/recreate-table-across-terminals",
      category: "Tables & schema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      title: "如何在 Docker 上配置 ClickHouse 并通过 ODBC 连接 Microsoft SQL Server (MSSQL) 数据库",
      description: "如何在 Docker 上配置 ClickHouse 并通过 ODBC 连接 Microsoft SQL Server (MSSQL) 数据库",
      href: "/resources/support-center/knowledge-base/integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "queries-sql/using-array-join-to-extract-and-query-attributes",
      title: "如何使用 array join 通过 map 键和值提取并查询动态属性",
      description: "Simple example to illustrate how to use array join to extract and query varying attributes using map keys and values",
      href: "/resources/support-center/knowledge-base/queries-sql/using-array-join-to-extract-and-query-attributes",
      category: "Queries & SQL",
      tags: ["Functions"]
    },
    {
      id: "materialized-views/how-to-use-parametrised-views",
      title: "How to Use Parameterized Views in ClickHouse",
      description: "Learn how to create and query parameterized views in ClickHouse for dynamic data slicing based on query-time parameters.",
      href: "/resources/support-center/knowledge-base/materialized-views/how-to-use-parametrised-views",
      category: "Materialized views & projections",
      tags: ["Use Cases"]
    },
    {
      id: "tables-schema/exchangeStatementToSwitchTables",
      title: "How to use the exchange command to switch tables",
      description: "How to use the exchange command to switch tables",
      href: "/resources/support-center/knowledge-base/tables-schema/exchangeStatementToSwitchTables",
      category: "Tables & schema",
      tags: ["Managing Data"]
    },
    {
      id: "queries-sql/compare-resultsets",
      title: "How to Validate if Two Queries Return the Same Result-sets",
      description: "Learn how to validate that two ClickHouse queries produce identical result-sets using hash functions and comparison techniques.",
      href: "/resources/support-center/knowledge-base/queries-sql/compare-resultsets",
      category: "Queries & SQL",
      tags: ["Functions"]
    },
    {
      id: "monitoring-debugging/check-query-cache-in-use",
      title: "How to Verify Query Cache Usage in ClickHouse",
      description: "Learn how to check if query cache is being utilized in ClickHouse using `clickhouse-client` trace logs or SQL commands.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/check-query-cache-in-use",
      category: "Monitoring & debugging",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "cloud-services/unable-to-access-cloud-service",
      title: "I am unable to access a ClickHouse Cloud service",
      description: "Troubleshooting access issues with ClickHouse Cloud services, including IP Access List configuration",
      href: "/resources/support-center/knowledge-base/cloud-services/unable-to-access-cloud-service",
      category: "Cloud",
      tags: ["Errors and Exceptions", "Managing Cloud"]
    },
    {
      id: "performance-optimization/finding-expensive-queries-by-memory-usage",
      title: "Identifying Expensive Queries by Memory Usage in ClickHouse",
      description: "Learn how to use the `system.query_log` table to find the most memory-intensive queries in ClickHouse, with examples for clustered and standalone setups.",
      href: "/resources/support-center/knowledge-base/performance-optimization/finding-expensive-queries-by-memory-usage",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "data-import-export/importing-and-working-with-json-array-objects",
      title: "Importing and Querying JSON Array Objects in ClickHouse",
      description: "Learn how to import JSON array objects into ClickHouse and perform advanced queries using JSON functions and array operations.",
      href: "/resources/support-center/knowledge-base/data-import-export/importing-and-working-with-json-array-objects",
      category: "Data import & export",
      tags: ["Data Formats"]
    },
    {
      id: "data-import-export/importing-geojason-with-nested-object-array",
      title: "Importing GeoJSON with a deeply nested object array",
      description: "了解如何将包含深层嵌套对象数组的 GeoJSON 文件导入 ClickHouse，并查询嵌套的要素数据。",
      href: "/resources/support-center/knowledge-base/data-import-export/importing-geojason-with-nested-object-array",
      category: "Data import & export",
      tags: ["Data Formats"]
    },
    {
      id: "performance-optimization/improve-map-performance",
      title: "Improving Map Lookup Performance in ClickHouse",
      description: "Learn how to optimize Map column lookups in ClickHouse for better query performance by materializing specific keys as standalone columns.",
      href: "/resources/support-center/knowledge-base/performance-optimization/improve-map-performance",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "tables-schema/delete-old-data",
      title: "Is it possible to delete old records from a ClickHouse table?",
      description: "This page answers the question of whether it is possible to delete old records from a ClickHouse table",
      href: "/resources/support-center/knowledge-base/tables-schema/delete-old-data",
      category: "Tables & schema",
      tags: []
    },
    {
      id: "general-faqs/separate-storage",
      title: "Is it possible to deploy ClickHouse with separate storage and compute?",
      description: "This page provides an answer as to whether it is possible to deploy ClickHouse with separate storage and compute",
      href: "/resources/support-center/knowledge-base/general-faqs/separate-storage",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-import-export/json-extract-example",
      title: "JSON Extract example",
      description: "A short example on how to extract base types from JSON",
      href: "/resources/support-center/knowledge-base/data-import-export/json-extract-example",
      category: "Data import & export",
      tags: ["Data Formats"]
    },
    {
      id: "queries-sql/calculate-pi-using-sql",
      title: "Let's calculate pi using SQL",
      description: "It's Pi Day! Let's calculate pi using ClickHouse SQL",
      href: "/resources/support-center/knowledge-base/queries-sql/calculate-pi-using-sql",
      category: "Queries & SQL",
      tags: ["Use Cases"]
    },
    {
      id: "cloud-services/clickhouse-cloud-api-usage",
      title: "Managing ClickHouse Cloud Service with API and cURL",
      description: "Learn how to start, stop, and resume a ClickHouse Cloud service using API endpoints and cURL commands.",
      href: "/resources/support-center/knowledge-base/cloud-services/clickhouse-cloud-api-usage",
      category: "Cloud",
      tags: ["Managing Cloud", "Tools and Utilities"]
    },
    {
      id: "monitoring-debugging/mapping-of-system-metrics-to-prometheus-metrics",
      title: "Mapping of metrics used in system.dashboards to Prometheus metrics in `system.custom_metrics`",
      description: "Mapping of metrics used in system.dashboards to Prometheus metrics in system.custom_metrics",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/mapping-of-system-metrics-to-prometheus-metrics",
      category: "Monitoring & debugging",
      tags: ["System Tables"]
    },
    {
      id: "security/windows-active-directory-to-ch-roles",
      title: "Mapping Windows Active Directory security groups to ClickHouse roles",
      description: "Example of mapping Windows Active Directory security groups to ClickHouse roles",
      href: "/resources/support-center/knowledge-base/security/windows-active-directory-to-ch-roles",
      category: "Security & access control",
      tags: ["Tools and Utilities"]
    },
    {
      id: "performance-optimization/memory-limit-exceeded-for-query",
      title: "Memory limit exceeded for query",
      description: "Troubleshooting memory limit exceeded errors for a query",
      href: "/resources/support-center/knowledge-base/performance-optimization/memory-limit-exceeded-for-query",
      category: "Performance & optimization",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "integrations/ODBC-authentication-failed-error-using-PowerBI-CH-connector",
      title: "ODBC authentication failed error when using the Power BI ClickHouse connector",
      description: "ODBC authentication failed error when using the Power BI ClickHouse connector",
      href: "/resources/support-center/knowledge-base/integrations/ODBC-authentication-failed-error-using-PowerBI-CH-connector",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces", "Errors and Exceptions"]
    },
    {
      id: "monitoring-debugging/profiling-clickhouse-with-llvm-xray",
      title: "Profiling ClickHouse with LLVM's XRay",
      description: "Learn how to profile ClickHouse using LLVM's XRay instrumentation profiler, visualize traces, and analyze performance.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/profiling-clickhouse-with-llvm-xray",
      category: "Monitoring & debugging",
      tags: ["Performance and Optimizations", "Tools and Utilities"]
    },
    {
      id: "integrations/python-http-requests",
      title: "使用 HTTP requests 模块的 Python 快速示例",
      description: "使用 Python 和 requests 模块向 ClickHouse 读写数据的示例",
      href: "/resources/support-center/knowledge-base/integrations/python-http-requests",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "configuration-settings/maximum-number-of-tables-and-databases",
      title: "ClickHouse 中推荐的最大数据库、表、分区和 parts 数量",
      description: "了解 ClickHouse 集群中推荐的数据库、表、分区和 parts 的最大限制，以确保最佳性能。",
      href: "/resources/support-center/knowledge-base/configuration-settings/maximum-number-of-tables-and-databases",
      category: "Configuration & settings",
      tags: ["Performance and Optimizations", "Deployments and Scaling"]
    },
    {
      id: "data-import-export/cannot-append-data-to-parquet-format",
      title: '解决 ClickHouse 中的 "Cannot Append Data in Parquet Format" 错误',
      description: '您在 ClickHouse 中是否遇到了 "Cannot append data in format Parquet to file" 错误？让我们来看看如何解决它。',
      href: "/resources/support-center/knowledge-base/data-import-export/cannot-append-data-to-parquet-format",
      category: "Data import & export",
      tags: ["Errors and Exceptions", "Data Formats"]
    },
    {
      id: "troubleshooting/exception-too-many-parts",
      title: '解决 ClickHouse 中的 "Too Many Parts" 错误',
      description: '了解如何通过优化插入速率、配置 MergeTree 设置以及有效管理分区来解决 ClickHouse 中的 "Too many parts" 错误。',
      href: "/resources/support-center/knowledge-base/troubleshooting/exception-too-many-parts",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "troubleshooting/certificate-verify-failed-error",
      title: "解决 ClickHouse 中的 SSL 证书验证错误",
      description: "了解如何解决 SSL 异常 CERTIFICATE_VERIFY_FAILED 错误。",
      href: "/resources/support-center/knowledge-base/troubleshooting/certificate-verify-failed-error",
      category: "Troubleshooting & errors",
      tags: ["Security and Authentication", "Errors and Exceptions"]
    },
    {
      id: "troubleshooting/connection-timeout-remote-remoteSecure",
      title: "解决使用 `remote` 和 `remoteSecure` 表函数时的超时错误",
      description: "了解如何通过调整连接超时设置来修复在 ClickHouse 中使用 `remote` 或 `remoteSecure` 表函数时的超时错误。",
      href: "/resources/support-center/knowledge-base/troubleshooting/connection-timeout-remote-remoteSecure",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "tables-schema/search-across-node-for-tables-with-a-wildcard",
      title: "使用通配符跨节点搜索表",
      description: "了解如何使用通配符跨节点搜索表。",
      href: "/resources/support-center/knowledge-base/tables-schema/search-across-node-for-tables-with-a-wildcard",
      category: "Tables & schema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "performance-optimization/query-max-execution-time",
      title: "设置查询执行时间限制",
      description: "如何强制限制最大查询执行时间",
      href: "/resources/support-center/knowledge-base/performance-optimization/query-max-execution-time",
      category: "Performance & optimization",
      tags: ["Managing Cloud", "Settings"]
    },
    {
      id: "data-import-export/json-simple-example",
      title: "使用带有 materialized view 的落地表提取 JSON 数据的简单示例流程",
      description: "使用带有 materialized view 的落地表提取 JSON 数据的简单示例流程",
      href: "/resources/support-center/knowledge-base/data-import-export/json-simple-example",
      category: "Data import & export",
      tags: ["Data Formats"]
    },
    {
      id: "performance-optimization/async-vs-optimize-read-in-order",
      title: "同步数据读取",
      description:
        "新设置 `allow_asynchronous_read_from_io_pool_for_merge_tree` 允许读取线程（流）的数量高于查询执行管道其余部分中的线程数量。",
      href: "/resources/support-center/knowledge-base/performance-optimization/async-vs-optimize-read-in-order",
      category: "Performance & optimization",
      tags: ["Settings", "Performance and Optimizations"]
    },
    {
      id: "integrations/terraform-example",
      title: "使用 Cloud API 的 Terraform 示例",
      description: "本文提供了一个如何使用 Terraform 通过 API 创建/删除集群的示例",
      href: "/resources/support-center/knowledge-base/integrations/terraform-example",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      title: "在 ClickHouse 中优化基本数据类型的提示和技巧",
      description: "在 ClickHouse 中优化基本数据类型的提示和技巧",
      href: "/resources/support-center/knowledge-base/performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "queries-sql/useful-queries-for-troubleshooting",
      title: "用于故障排查的实用查询",
      description: "用于 ClickHouse 故障排查的便捷查询集合，包括监控表大小、长时间运行的查询和错误。",
      href: "/resources/support-center/knowledge-base/queries-sql/useful-queries-for-troubleshooting",
      category: "Queries & SQL",
      tags: ["Settings"]
    },
    {
      id: "general-faqs/use-clickhouse-for-log-analytics",
      title: "使用 ClickHouse 进行日志分析",
      description: "ClickHouse 因其提供的实时分析功能而在日志和指标分析中广受欢迎。准备好了解更多了吗？",
      href: "/resources/support-center/knowledge-base/general-faqs/use-clickhouse-for-log-analytics",
      category: "General & FAQs",
      tags: ["Use Cases"]
    },
    {
      id: "queries-sql/filtered-aggregates",
      title: "在 ClickHouse 中使用过滤聚合",
      description: "了解如何在 ClickHouse 中使用带有 `-If` 和 `-Distinct` 聚合组合器的过滤聚合，以简化查询语法并增强分析能力。",
      href: "/resources/support-center/knowledge-base/queries-sql/filtered-aggregates",
      category: "Queries & SQL",
      tags: ["Functions"]
    },
    {
      id: "general-faqs/dependencies",
      title: "运行 ClickHouse 有哪些第三方依赖？",
      description: "ClickHouse 是自包含的，没有运行时依赖",
      href: "/resources/support-center/knowledge-base/general-faqs/dependencies",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/dbms-naming",
      title: '"ClickHouse" 是什么意思？',
      description: '了解 "ClickHouse" 的含义',
      href: "/resources/support-center/knowledge-base/general-faqs/dbms-naming",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/ne-tormozit",
      title: ""не тормозит" 是什么意思？",
      description: '本页解释了 "Не тормозит" 的含义',
      href: "/resources/support-center/knowledge-base/general-faqs/ne-tormozit",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "integrations/oracle-odbc",
      title: "如果通过 ODBC 使用 Oracle 时遇到编码问题怎么办？",
      description: "本页提供了有关通过 ODBC 使用 Oracle 时遇到编码问题时的处理指南",
      href: "/resources/support-center/knowledge-base/integrations/oracle-odbc",
      category: "Integrations & client libraries",
      tags: []
    },
    {
      id: "general-faqs/columnar-database",
      title: "什么是列式数据库？",
      description: "本页描述了什么是列式数据库",
      href: "/resources/support-center/knowledge-base/general-faqs/columnar-database",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/olap",
      title: "什么是 OLAP？",
      description: "关于联机分析处理的说明",
      href: "/resources/support-center/knowledge-base/general-faqs/olap",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "performance-optimization/optimize-final-vs-final",
      title: "OPTIMIZE FINAL 和 FINAL 有什么区别？",
      description: "讨论 OPTIMIZE FINAL 和 FINAL 之间的区别，以及何时使用和避免使用它们。",
      href: "/resources/support-center/knowledge-base/performance-optimization/optimize-final-vs-final",
      category: "Performance & optimization",
      tags: ["Core Data Concepts"]
    },
    {
      id: "general-faqs/sql",
      title: "ClickHouse 支持哪些 SQL 语法？",
      description: "ClickHouse 支持 100% 的 SQL 语法",
      href: "/resources/support-center/knowledge-base/general-faqs/sql",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/when-is-ttl-applied",
      title: "TTL 规则何时生效？我们能否对其进行控制？",
      description:
        "ClickHouse 中的 TTL 规则会在后台异步执行，您可以通过 `merge_with_ttl_timeout` 设置来控制其执行时机。了解如何手动触发 TTL 以及如何管理 TTL 执行的后台线程。",
      href: "/resources/support-center/knowledge-base/data-management/when-is-ttl-applied",
      category: "Data management",
      tags: ["Core Data Concepts"]
    },
    {
      id: "setup-installation/production",
      title: "在生产环境中应使用哪个 ClickHouse 版本？",
      description: "本页提供关于在生产环境中使用哪个 ClickHouse 版本的指导",
      href: "/resources/support-center/knowledge-base/setup-installation/production",
      category: "Setup & installation",
      tags: []
    },
    {
      id: "general-faqs/who-is-using-clickhouse",
      title: "谁在使用 ClickHouse？",
      description: "描述谁在使用 ClickHouse",
      href: "/resources/support-center/knowledge-base/general-faqs/who-is-using-clickhouse",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/dictionaries-consistent-state",
      title: "为什么我在 ClickHouse Cloud 的字典中看不到我的数据？",
      description: "存在一个问题，字典中的数据在创建后可能不会立即可见。",
      href: "/resources/support-center/knowledge-base/data-management/dictionaries-consistent-state",
      category: "Data management",
      tags: ["Managing Cloud", "Data Modelling"]
    },
    {
      id: "general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      title: "为什么推荐使用 ClickHouse Keeper 而不是 ZooKeeper？",
      description:
        "ClickHouse Keeper 在 ZooKeeper 的基础上进行了改进，具有减少磁盘空间使用、更快恢复和更少内存消耗等特性，为 ClickHouse 集群提供更好的性能。",
      href: "/resources/support-center/knowledge-base/general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      category: "General & FAQs",
      tags: ["Core Data Concepts"]
    },
    {
      id: "monitoring-debugging/why-default-logging-verbose",
      title: "为什么 ClickHouse 默认日志记录如此详细？",
      description: "了解 ClickHouse 开发人员为何选择默认设置详细日志级别。",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/why-default-logging-verbose",
      category: "Monitoring & debugging",
      tags: ["Settings"]
    },
    {
      id: "performance-optimization/why-is-my-primary-key-not-used",
      title: "为什么我的主键没有被使用？如何检查？",
      description: "介绍主键未在排序中使用的常见原因以及如何确认",
      href: "/resources/support-center/knowledge-base/performance-optimization/why-is-my-primary-key-not-used",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "general-faqs/mapreduce",
      title: "为什么不使用 MapReduce 之类的工具？",
      description: "本页解释了为什么您会选择 ClickHouse 而不是 MapReduce",
      href: "/resources/support-center/knowledge-base/general-faqs/mapreduce",
      category: "General & FAQs",
      tags: []
    }
  ]
}