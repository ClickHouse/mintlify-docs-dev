export const kbIndex = {
  categories: [
    "Cloud",
    "Конфигурация и настройки",
    "Импорт и экспорт данных",
    "Управление данными",
    "Общие вопросы и FAQ",
    "Интеграции и клиентские библиотеки",
    "Materialized views и проекции",
    "Мониторинг и отладка",
    "Производительность и оптимизация",
    "Запросы и SQL",
    "Безопасность и управление доступом",
    "Установка и настройка",
    "Таблицы и схема",
    "Устранение неполадок и ошибки"
  ],
  tags: [
    "Лучшие практики",
    "Сообщество",
    "Концепции",
    "Основные концепции данных",
    "Экспорт данных",
    "Форматы данных",
    "Приём данных",
    "Моделирование данных",
    "Источники данных",
    "Развёртывание и масштабирование",
    "Ошибки и исключения",
    "Функции",
    "Языковые клиенты",
    "Управление Cloud",
    "Управление данными",
    "Нативные клиенты и интерфейсы",
    "Производительность и оптимизация",
    "Безопасность и аутентификация",
    "Администрирование сервера",
    "Настройки",
    "Системные таблицы",
    "Инструменты и утилиты",
    "Устранение неполадок",
    "Сценарии использования"
  ],
  articles: [
    {
      id: "integrations/python-clickhouse-connect-example",
      title: "Рабочий пример подключения к ClickHouse Cloud Service на Python",
      description: "Узнайте, как подключиться к ClickHouse Cloud Service с помощью Python — пошаговый пример с использованием драйвера clickhouse-connect.",
      href: "/resources/support-center/knowledge-base/integrations/python-clickhouse-connect-example",
      category: "Integrations & client libraries",
      tags: ["Language Clients"]
    },
    {
      id: "configuration-settings/about-quotas-and-query-complexity",
      title: "О квотах и сложности запросов",
      description:
        "Квоты и ограничения сложности запросов — эффективные инструменты для управления действиями пользователей в ClickHouse. В этой статье базы знаний приведены примеры применения обоих подходов.",
      href: "/resources/support-center/knowledge-base/configuration-settings/about-quotas-and-query-complexity",
      category: "Configuration & settings",
      tags: ["Managing Cloud"]
    },
    {
      id: "data-import-export/achieving-atomic-inserts",
      title: "Атомарная вставка данных и согласованность нескольких таблиц в ClickHouse Cloud",
      description: "Как атомарно загружать данные и поддерживать согласованность нескольких таблиц в ClickHouse Cloud без многооператорных транзакций — с использованием промежуточных таблиц и операций на уровне партиций.",
      href: "/resources/support-center/knowledge-base/data-import-export/achieving-atomic-inserts",
      category: "Data import & export",
      tags: ["Data Ingestion", "Best Practices"]
    },
    {
      id: "tables-schema/add-column",
      title: "Добавление столбца в таблицу",
      description: "В этом руководстве рассматривается, как добавить столбец в существующую таблицу.",
      href: "/resources/support-center/knowledge-base/tables-schema/add-column",
      category: "Tables & schema",
      tags: ["Data Modelling"]
    },
    {
      id: "configuration-settings/alter-user-settings-exception",
      title: "Исключение при изменении пользовательских настроек",
      description: "Обработка исключения, возникающего при изменении пользовательских настроек",
      href: "/resources/support-center/knowledge-base/configuration-settings/alter-user-settings-exception",
      category: "Configuration & settings",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "materialized-views/are-materialized-views-inserted-asynchronously",
      title: "Выполняется ли вставка в materialized views синхронно?",
      description: "В этой статье базы знаний рассматривается вопрос о том, выполняется ли вставка в materialized views синхронно",
      href: "/resources/support-center/knowledge-base/materialized-views/are-materialized-views-inserted-asynchronously",
      category: "Materialized views & projections",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/schema-migration-tools",
      title: "Инструменты автоматической миграции схемы для ClickHouse",
      description: "Узнайте об инструментах автоматической миграции схемы для ClickHouse и о том, как управлять изменениями схемы базы данных с течением времени.",
      href: "/resources/support-center/knowledge-base/tables-schema/schema-migration-tools",
      category: "Tables & schema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      title: "Настройка AWS PrivateLink для предоставления доступа к MSK через ClickPipes",
      description: "Шаги по предоставлению доступа к приватному MSK через подключение MSK multi-VPC к ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      category: "Cloud",
      tags: ["Security and Authentication", "Managing Cloud"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-clickpipes",
      title: "Настройка AWS PrivateLink для предоставления доступа к приватному RDS через ClickPipes",
      description: "Шаги по предоставлению доступа к приватному RDS через AWS PrivateLink к ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-clickpipes",
      category: "Cloud",
      tags: ["Security and Authentication", "Managing Cloud"]
    },
    {
      id: "data-management/backing-up-a-specific-partition",
      title: "Резервное копирование конкретной партиции",
      description: "Как создать резервную копию конкретной партиции в ClickHouse?",
      href: "/resources/support-center/knowledge-base/data-management/backing-up-a-specific-partition",
      category: "Data management",
      tags: ["Managing Data"]
    },
    {
      id: "general-faqs/key-value",
      title: "Можно ли использовать ClickHouse как хранилище ключ-значение?",
      description: "Ответ на часто задаваемый вопрос о том, можно ли использовать ClickHouse в качестве хранилища ключ-значение.",
      href: "/resources/support-center/knowledge-base/general-faqs/key-value",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/time-series",
      title: "Можно ли использовать ClickHouse как базу данных временных рядов?",
      description: "Страница с описанием использования ClickHouse в качестве базы данных временных рядов",
      href: "/resources/support-center/knowledge-base/general-faqs/time-series",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "queries-sql/pivot",
      title: "Поддерживается ли PIVOT в ClickHouse?",
      description:
        "В ClickHouse нет конструкции PIVOT, однако аналогичную функциональность можно реализовать с помощью комбинаторов агрегатных функций. Рассмотрим, как это сделать на примере набора данных о ценах на жильё в Великобритании.",
      href: "/resources/support-center/knowledge-base/queries-sql/pivot",
      category: "Queries & SQL",
      tags: ["Data Modelling", "Core Data Concepts"]
    },
    {
      id: "general-faqs/vector-search",
      title: "Можно ли использовать ClickHouse для векторного поиска?",
      description: "Узнайте, как использовать ClickHouse для векторного поиска: хранение эмбеддингов и поиск с помощью функций расстояния, таких как косинусное сходство.",
      href: "/resources/support-center/knowledge-base/general-faqs/vector-search",
      category: "General & FAQs",
      tags: ["Use Cases", "Concepts"]
    },
    {
      id: "monitoring-debugging/send-logs-level",
      title: "Захват серверных журналов запросов на стороне клиента",
      description: "Узнайте, как захватывать серверные журналы на стороне клиента даже при различных настройках журналирования — с помощью параметра `send_logs_level`.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/send-logs-level",
      category: "Monitoring & debugging",
      tags: ["Server Admin"]
    },
    {
      id: "configuration-settings/change-the-prompt-in-clickhouse-client",
      title: "Изменение приглашения командной строки в clickhouse-client",
      description: "В этой статье объясняется, как изменить приглашение командной строки в clickhouse-client и терминальном окне clickhouse-local с :) на произвольный префикс, за которым следует :)",
      href: "/resources/support-center/knowledge-base/configuration-settings/change-the-prompt-in-clickhouse-client",
      category: "Configuration & settings",
      tags: ["Settings", "Native Clients and Interfaces"]
    },
    {
      id: "security/common-rbac-queries",
      title: "Типовые запросы RBAC",
      description: "Запросы для предоставления пользователям определённых разрешений.",
      href: "/resources/support-center/knowledge-base/security/common-rbac-queries",
      category: "Security & access control",
      tags: ["Security and Authentication", "Managing Cloud"]
    },
    {
      id: "queries-sql/comparing-metrics-between-queries",
      title: "Сравнение метрик между запросами в децибелах",
      description: "Запрос для сравнения метрик между двумя запросами в ClickHouse.",
      href: "/resources/support-center/knowledge-base/queries-sql/comparing-metrics-between-queries",
      category: "Queries & SQL",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "Configuring CAP_IPC_LOCK and CAP_SYS_NICE Capabilities in Docker",
      description: "Learn how to resolve Docker capability warnings for `CAP_IPC_LOCK` and `CAP_SYS_NICE` when running ClickHouse in a container.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Configuration & settings",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "Configuring CAP_IPC_LOCK and CAP_SYS_NICE Capabilities in Docker",
      description: "Learn how to resolve Docker capability warnings for `CAP_IPC_LOCK` and `CAP_SYS_NICE` when running ClickHouse in a container.",
      href: "/resources/support-center/knowledge-base/troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "cloud-services/custom-dns-alias-for-instance",
      title: "Create a custom DNS alias by setting up a reverse proxy",
      description: "Learn how to set up a custom DNS alias for your instance using a reverse proxy",
      href: "/resources/support-center/knowledge-base/cloud-services/custom-dns-alias-for-instance",
      category: "Cloud",
      tags: ["Server Admin", "Security and Authentication"]
    },
    {
      id: "troubleshooting/part-intersects-previous-part",
      title: "DB::Exception: Part XXXXX intersects previous part YYYYY. It is a bug or a result of manual intervention in the ZooKeeper data.",
      description:
        "В этой статье описывается, как устранить ошибку DB::Exception, связанную с пересечением частей в ClickHouse. Как правило, она возникает из-за состояния гонки или ручного вмешательства в данные ZooKeeper.",
      href: "/resources/support-center/knowledge-base/troubleshooting/part-intersects-previous-part",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions", "System Tables"]
    },
    {
      id: "setup-installation/difference-between-official-builds-and-3rd-party",
      title: "Differences Between Official and 3rd-Party ClickHouse Builds",
      description: "Understand the key differences between official ClickHouse builds and 3rd-party builds, including updates, compatibility, and security considerations.",
      href: "/resources/support-center/knowledge-base/setup-installation/difference-between-official-builds-and-3rd-party",
      category: "Setup & installation",
      tags: ["Concepts"]
    },
    {
      id: "general-faqs/cost-based",
      title: "Does ClickHouse have a cost-based optimizer",
      description: "ClickHouse has certain cost-based optimization mechanics",
      href: "/resources/support-center/knowledge-base/general-faqs/cost-based",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/datalake",
      title: "Does ClickHouse support data lakes?",
      description: "ClickHouse supports data lakes, including Iceberg, Delta Lake, Apache Hudi, Apache Paimon, Hive",
      href: "/resources/support-center/knowledge-base/general-faqs/datalake",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/distributed-join",
      title: "Does ClickHouse support distributed JOIN?",
      description: "ClickHouse supports distributed JOIN",
      href: "/resources/support-center/knowledge-base/general-faqs/distributed-join",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/federated",
      title: "Does ClickHouse support federated queries?",
      description: "ClickHouse supports a wide range for federated and hybrid queries",
      href: "/resources/support-center/knowledge-base/general-faqs/federated",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/concurrency",
      title: "Does ClickHouse support frequent, concurrent queries?",
      description: "ClickHouse supports high QPS and high concurrency",
      href: "/resources/support-center/knowledge-base/general-faqs/concurrency",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "cloud-services/multi-region-replication",
      title: "Does ClickHouse support multi-region replication?",
      description: "This page answers whether ClickHouse supports multi-region replication",
      href: "/resources/support-center/knowledge-base/cloud-services/multi-region-replication",
      category: "Cloud",
      tags: []
    },
    {
      id: "general-faqs/updates",
      title: "Does ClickHouse support real-time updates?",
      description: "ClickHouse supports lightweight real-time updates",
      href: "/resources/support-center/knowledge-base/general-faqs/updates",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "security/row-column-policy",
      title: "Does ClickHouse support row-level and column-level security?",
      description: "Learn about row-level and column-level access restrictions in ClickHouse and ClickHouse Cloud, and how to implement role-based access control (RBAC) with policies.",
      href: "/resources/support-center/knowledge-base/security/row-column-policy",
      category: "Security & access control",
      tags: ["Security and Authentication"]
    },
    {
      id: "cloud-services/execute-system-queries-in-cloud",
      title: "Execute SYSTEM Statements on All Nodes in ClickHouse Cloud",
      description: "Learn how to use `ON CLUSTER` and `clusterAllReplicas` to execute SYSTEM statements and queries across all nodes in a ClickHouse Cloud service.",
      href: "/resources/support-center/knowledge-base/cloud-services/execute-system-queries-in-cloud",
      category: "Cloud",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "troubleshooting/count-parts-by-type",
      title: "Find counts and sizes of wide or compact parts",
      description: "This knowledgebase article shows you how to find part counts by the type of part - wide or compact.",
      href: "/resources/support-center/knowledge-base/troubleshooting/count-parts-by-type",
      category: "Troubleshooting & errors",
      tags: ["Troubleshooting"]
    },
    {
      id: "troubleshooting/fix-developer-verification-error-in-macos",
      title: "Fix the Developer Verification Error in MacOS",
      description: "Learn how to resolve the MacOS developer verification error when running ClickHouse commands, using either System Settings or the terminal.",
      href: "/resources/support-center/knowledge-base/troubleshooting/fix-developer-verification-error-in-macos",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "data-import-export/s3-export-data-year-month-folders",
      title: "How can I do partitioned writes by year and month on S3?",
      description: "Learn how to write partitioned data by year and month to an S3 bucket in ClickHouse, using a custom path structure for organizing the data.",
      href: "/resources/support-center/knowledge-base/data-import-export/s3-export-data-year-month-folders",
      category: "Data import & export",
      tags: ["Data Export", "Native Clients and Interfaces"]
    },
    {
      id: "data-import-export/kafka-clickhouse-json",
      title: "How can I use the new JSON Data Type with Kafka?",
      description: "Learn how to load JSON messages from Apache Kafka directly into a single JSON column in ClickHouse using the Kafka table engine and JSON data type.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-clickhouse-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Ingestion"]
    },
    {
      id: "cloud-services/change-billing-email",
      title: "How do I change my Billing Contact in ClickHouse Cloud?",
      description: "Let's learn how to change your billing address in ClickHouse Cloud.",
      href: "/resources/support-center/knowledge-base/cloud-services/change-billing-email",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "general-faqs/how-do-i-contribute-code-to-clickhouse",
      title: "How do I contribute code to ClickHouse?",
      description: "ClickHouse — проект с открытым исходным кодом, разрабатываемый на GitHub. По традиции инструкции по участию в разработке публикуются в файле CONTRIBUTING в корне репозитория с исходным кодом.",
      href: "/resources/support-center/knowledge-base/general-faqs/how-do-i-contribute-code-to-clickhouse",
      category: "General & FAQs",
      tags: ["Community"]
    },
    {
      id: "data-import-export/parquet-to-csv-json",
      title: "Как конвертировать файлы из Parquet в CSV или JSON?",
      description: "Узнайте, как использовать инструмент `clickhouse-local` ClickHouse для простого преобразования файлов Parquet в форматы CSV или JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/parquet-to-csv-json",
      category: "Data import & export",
      tags: ["Data Sources", "Data Formats"]
    },
    {
      id: "data-import-export/mysql-to-parquet-csv-json",
      title: "Как экспортировать данные MySQL в Parquet, CSV или JSON с помощью ClickHouse",
      description: "Узнайте, как использовать инструмент `clickhouse-local` для быстрого и эффективного экспорта данных MySQL в форматы Parquet, CSV или JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/mysql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Export"]
    },
    {
      id: "data-import-export/postgresql-to-parquet-csv-json",
      title: "Как экспортировать данные PostgreSQL в Parquet, CSV или JSON?",
      description: "Узнайте, как экспортировать данные PostgreSQL в форматы Parquet, CSV или JSON с помощью `clickhouse-local` на различных примерах.",
      href: "/resources/support-center/knowledge-base/data-import-export/postgresql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Export", "Data Formats"]
    },
    {
      id: "setup-installation/install-clickhouse-windows10",
      title: "Как установить ClickHouse на Windows 10?",
      description: "Узнайте, как установить и протестировать ClickHouse на Windows 10 с помощью WSL 2. Включает настройку, устранение неполадок и запуск тестовой среды.",
      href: "/resources/support-center/knowledge-base/setup-installation/install-clickhouse-windows10",
      category: "Setup & installation",
      tags: ["Tools and Utilities"]
    },
    {
      id: "security/remove-default-user",
      title: "Как удалить пользователя по умолчанию?",
      description: "Узнайте, как удалить пользователя по умолчанию при запуске ClickHouse Server.",
      href: "/resources/support-center/knowledge-base/security/remove-default-user",
      category: "Security & access control",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/ingest-failures-23-9-release",
      title: "Как устранить сбои приёма данных после выпуска ClickHouse 23.9?",
      description: "Узнайте, как устранить сбои приёма данных, вызванные более строгой проверкой прав, введённой в ClickHouse 23.9 для таблиц с `async_inserts`. Обновите права для исправления ошибок.",
      href: "/resources/support-center/knowledge-base/cloud-services/ingest-failures-23-9-release",
      category: "Cloud",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "performance-optimization/insert-select-settings-tuning",
      title: "Как устранить ошибку TOO MANY PARTS при выполнении INSERT...SELECT?",
      description: "Устраните ошибку TOO_MANY_PARTS в ClickHouse при выполнении `INSERT...SELECT`, настроив параметры для увеличения блоков и повышения пороговых значений партиций.",
      href: "/resources/support-center/knowledge-base/performance-optimization/insert-select-settings-tuning",
      category: "Performance & optimization",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "integrations/node-js-example",
      title: "Как использовать NodeJS с @clickhouse/client",
      description: "Узнайте, как использовать @clickhouse/client в приложении Node.js для взаимодействия с ClickHouse и выполнения запросов.",
      href: "/resources/support-center/knowledge-base/integrations/node-js-example",
      category: "Integrations & client libraries",
      tags: ["Language Clients"]
    },
    {
      id: "monitoring-debugging/view-number-of-active-mutations",
      title: "Как просмотреть количество активных или поставленных в очередь мутаций?",
      description:
        "Отслеживайте количество активных или поставленных в очередь мутаций в ClickHouse, особенно при выполнении операций `ALTER` или `UPDATE`. Используйте таблицу `system.mutations` для отслеживания мутаций.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/view-number-of-active-mutations",
      category: "Monitoring & debugging",
      tags: ["System Tables"]
    },
    {
      id: "data-management/read-consistency",
      title: "Как обеспечить согласованность чтения данных в ClickHouse?",
      description: "Узнайте, как обеспечить согласованность данных при чтении из ClickHouse, независимо от того, подключены ли вы к одному и тому же узлу или к случайному.",
      href: "/resources/support-center/knowledge-base/data-management/read-consistency",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "setup-installation/llvm-clang-up-to-date",
      title: "Как собрать LLVM и clang на Linux",
      description: "Команды для сборки LLVM и clang на Linux.",
      href: "/resources/support-center/knowledge-base/setup-installation/llvm-clang-up-to-date",
      category: "Setup & installation",
      tags: ["Community", "Tools and Utilities"]
    },
    {
      id: "data-management/calculate-ratio-of-zero-sparse-serialization",
      title: "Как вычислить долю пустых/нулевых значений в каждом столбце таблицы",
      description: "Узнайте, как вычислить долю пустых или нулевых значений в каждом столбце таблицы ClickHouse для оптимизации сериализации разреженных столбцов.",
      href: "/resources/support-center/knowledge-base/data-management/calculate-ratio-of-zero-sparse-serialization",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "security/check-users-roles",
      title: "Как проверить пользователей, назначенных на роли, и наоборот",
      description: "Узнайте, как запрашивать `system.role_grants` в ClickHouse для поиска пользователей, назначенных на роли, и ролей, назначенных конкретным пользователям.",
      href: "/resources/support-center/knowledge-base/security/check-users-roles",
      category: "Security & access control",
      tags: ["Server Admin", "System Tables", "Managing Cloud"]
    },
    {
      id: "monitoring-debugging/which-processes-are-currently-running",
      title: "Как проверить, какой код в данный момент выполняется на сервере?",
      description:
        "ClickHouse предоставляет инструменты интроспекции, такие как `system.stack_trace`, для проверки того, какой код в данный момент выполняется в каждом потоке сервера, что помогает при отладке и мониторинге производительности.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/which-processes-are-currently-running",
      category: "Monitoring & debugging",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      title: "Как проверить состояние сервиса ClickHouse Cloud",
      description: "Узнайте, как использовать API ClickHouse Cloud для проверки состояния сервиса: остановлен, простаивает или работает — без его пробуждения.",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "configuration-settings/configure-a-user-setting",
      title: "Как настроить параметры для пользователя в ClickHouse",
      description: "Узнайте, как задавать параметры в ClickHouse для отдельных запросов, клиентских сессий или конкретных пользователей с помощью команд `SET` и `ALTER USER`.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-a-user-setting",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "materialized-views/projection-example",
      title: "Как убедиться, что проекция используется запросом?",
      description: "Узнайте, как проверить, используется ли проекция в запросах ClickHouse, тестируя на примерных данных и используя EXPLAIN для подтверждения использования проекции.",
      href: "/resources/support-center/knowledge-base/materialized-views/projection-example",
      category: "Materialized views & projections",
      tags: ["Data Modelling"]
    },
    {
      id: "cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      title: "Как подключиться к ClickHouse с помощью SSH-ключей",
      description: "Как подключиться к ClickHouse и ClickHouse Cloud с помощью SSH-ключей",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      category: "Cloud",
      tags: ["Managing Cloud", "Security and Authentication"]
    },
    {
      id: "data-management/dictionary-using-strings",
      title: "Как создать словарь ClickHouse со строковыми ключами и значениями",
      description: "Узнайте, как создать словарь ClickHouse, используя строковые ключи и значения из таблицы MergeTree в качестве источника, с примерами настройки и использования.",
      href: "/resources/support-center/knowledge-base/data-management/dictionary-using-strings",
      category: "Data management",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      title: "Как создать таблицу для выполнения запросов к нескольким удалённым кластерам",
      description: "Как создать таблицу для выполнения запросов к нескольким удалённым кластерам",
      href: "/resources/support-center/knowledge-base/tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      category: "Tables & schema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "setup-installation/enabling-ssl-with-lets-encrypt",
      title: "Как включить SSL с помощью Let's Encrypt на одном сервере ClickHouse",
      description: "Узнайте, как настроить SSL для одного сервера ClickHouse с использованием Let's Encrypt, включая выпуск сертификата, настройку и проверку.",
      href: "/resources/support-center/knowledge-base/setup-installation/enabling-ssl-with-lets-encrypt",
      category: "Setup & installation",
      tags: ["Security and Authentication"]
    },
    {
      id: "data-import-export/file-export",
      title: "Как экспортировать данные из ClickHouse в файл",
      description: "Ознакомьтесь с различными способами экспорта данных из ClickHouse, включая `INTO OUTFILE`, табличный движок File и перенаправление в командной строке.",
      href: "/resources/support-center/knowledge-base/data-import-export/file-export",
      category: "Data import & export",
      tags: ["Data Export"]
    },
    {
      id: "queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      title: "Как фильтровать таблицу ClickHouse по столбцу типа Array?",
      description: "Статья базы знаний о том, как фильтровать таблицу ClickHouse по столбцу типа Array.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      category: "Queries & SQL",
      tags: ["Data Modelling", "Functions"]
    },
    {
      id: "monitoring-debugging/generate-har-file",
      title: "Как сгенерировать HAR-файл для службы поддержки",
      description: "HAR-файл (HTTP Archive) фиксирует сетевую активность в браузере. Он помогает нашей службе поддержки диагностировать медленную загрузку страниц, неудавшиеся запросы и другие сетевые проблемы.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/generate-har-file",
      category: "Monitoring & debugging",
      tags: ["Tools and Utilities"]
    },
    {
      id: "materialized-views/how-to-display-queries-using-mv",
      title: "Как определить запросы, использующие materialized view в ClickHouse",
      description: "Узнайте, как обращаться к журналам ClickHouse для выявления всех запросов, связанных с materialized view, в заданном временном диапазоне.",
      href: "/resources/support-center/knowledge-base/materialized-views/how-to-display-queries-using-mv",
      category: "Materialized views & projections",
      tags: ["System Tables"]
    },
    {
      id: "performance-optimization/find-expensive-queries",
      title: "Как определить наиболее ресурсоёмкие запросы в ClickHouse",
      description: "Узнайте, как использовать таблицу `query_log` в ClickHouse для выявления наиболее ресурсоёмких по памяти и CPU запросов на распределённых узлах.",
      href: "/resources/support-center/knowledge-base/performance-optimization/find-expensive-queries",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/ignoring-incorrect-settings",
      title: "Как игнорировать некорректные настройки в ClickHouse",
      description: "Узнайте, как использовать параметр `skip_check_for_incorrect_settings`, чтобы ClickHouse запускался даже при некорректно заданных пользовательских настройках.",
      href: "/resources/support-center/knowledge-base/configuration-settings/ignoring-incorrect-settings",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "data-import-export/json-import",
      title: "Как импортировать JSON в ClickHouse?",
      description: "На этой странице показано, как импортировать JSON в ClickHouse",
      href: "/resources/support-center/knowledge-base/data-import-export/json-import",
      category: "Data import & export",
      tags: []
    },
    {
      id: "setup-installation/how-to-increase-thread-pool-size",
      title: "Как увеличить количество потоков в ClickHouse",
      description: "Узнайте, как настроить глобальный пул потоков в ClickHouse, изменяя параметры `max_thread_pool_size`, `thread_pool_queue_size` и `max_thread_pool_free_size`.",
      href: "/resources/support-center/knowledge-base/setup-installation/how-to-increase-thread-pool-size",
      category: "Setup & installation",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "data-import-export/kafka-to-clickhouse-setup",
      title: "Как настроить приём данных из Kafka в ClickHouse",
      description: "Узнайте, как настроить приём данных из топика Kafka в ClickHouse с помощью табличного движка Kafka, materialized view и таблиц MergeTree.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-to-clickhouse-setup",
      category: "Data import & export",
      tags: ["Data Ingestion"]
    },
    {
      id: "data-import-export/ingest-parquet-files-in-s3",
      title: "Как загружать файлы Parquet из бакета S3",
      description: "Ознакомьтесь с основами использования табличного движка S3 в ClickHouse для загрузки и запроса файлов Parquet из бакета S3, включая настройку, права доступа и примеры импорта данных.",
      href: "/resources/support-center/knowledge-base/data-import-export/ingest-parquet-files-in-s3",
      category: "Data import & export",
      tags: ["Data Ingestion"]
    },
    {
      id: "queries-sql/how-to-insert-all-rows-from-another-table",
      title: "Как вставить все строки из одной таблицы в другую?",
      description: "Статья базы знаний о том, как вставить все строки из одной таблицы в другую.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-insert-all-rows-from-another-table",
      category: "Queries & SQL",
      tags: ["Data Ingestion"]
    },
    {
      id: "performance-optimization/check-query-processing-time-only",
      title: "Как измерить время обработки запроса без возврата строк",
      description: "Узнайте, как использовать параметр `FORMAT Null` в ClickHouse для измерения времени обработки запроса без возврата каких-либо строк клиенту.",
      href: "/resources/support-center/knowledge-base/performance-optimization/check-query-processing-time-only",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "monitoring-debugging/outputSendLogsLevelTracesToFile",
      title: "Как выводить трассировки уровня журнала в файл с помощью clickhouse-client",
      description: "Как выводить трассировки уровня журнала в файл с помощью clickhouse-client",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/outputSendLogsLevelTracesToFile",
      category: "Monitoring & debugging",
      tags: ["Data Export"]
    },
    {
      id: "tables-schema/recreate-table-across-terminals",
      title: "Как быстро воссоздать небольшую таблицу в разных терминалах",
      description: "Узнайте, как быстро воссоздать небольшую таблицу и её данные в разных терминалах с помощью копирования и вставки для сред разработки.",
      href: "/resources/support-center/knowledge-base/tables-schema/recreate-table-across-terminals",
      category: "Tables & schema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      title: "Как настроить ClickHouse на Docker с ODBC для подключения к базе данных Microsoft SQL Server (MSSQL)",
      description: "Как настроить ClickHouse на Docker с ODBC для подключения к базе данных Microsoft SQL Server (MSSQL)",
      href: "/resources/support-center/knowledge-base/integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "queries-sql/using-array-join-to-extract-and-query-attributes",
      title: "Как использовать array join для извлечения и запроса переменных атрибутов с помощью ключей и значений map",
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
      description: "Узнайте, как импортировать файлы GeoJSON с глубоко вложенными массивами объектов в ClickHouse и выполнять запросы к вложенным данным объектов.",
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
      title: "Краткий пример на Python с использованием модуля HTTP requests",
      description: "Пример использования Python и модуля requests для чтения и записи данных в ClickHouse",
      href: "/resources/support-center/knowledge-base/integrations/python-http-requests",
      category: "Интеграция и клиентские библиотеки",
      tags: ["Нативные клиенты и интерфейсы"]
    },
    {
      id: "configuration-settings/maximum-number-of-tables-and-databases",
      title: "Рекомендуемое максимальное количество баз данных, таблиц, партиций и частей в ClickHouse",
      description: "Узнайте рекомендуемые лимиты для баз данных, таблиц, партиций и частей в кластере ClickHouse для обеспечения оптимальной производительности.",
      href: "/resources/support-center/knowledge-base/configuration-settings/maximum-number-of-tables-and-databases",
      category: "Конфигурация и настройки",
      tags: ["Производительность и оптимизация", "Развертывание и масштабирование"]
    },
    {
      id: "data-import-export/cannot-append-data-to-parquet-format",
      title: 'Устранение ошибки "Cannot Append Data in Parquet Format" в ClickHouse',
      description: 'Сталкиваетесь с ошибкой "Cannot append data in format Parquet to file" в ClickHouse? Давайте разберемся, как ее устранить.',
      href: "/resources/support-center/knowledge-base/data-import-export/cannot-append-data-to-parquet-format",
      category: "Импорт и экспорт данных",
      tags: ["Ошибки и исключения", "Форматы данных"]
    },
    {
      id: "troubleshooting/exception-too-many-parts",
      title: 'Устранение ошибки "Too Many Parts" в ClickHouse',
      description: 'Узнайте, как устранить ошибку "Too many parts" в ClickHouse за счет оптимизации скорости вставки, настройки параметров MergeTree и эффективного управления партициями.',
      href: "/resources/support-center/knowledge-base/troubleshooting/exception-too-many-parts",
      category: "Устранение неполадок и ошибки",
      tags: ["Ошибки и исключения"]
    },
    {
      id: "troubleshooting/certificate-verify-failed-error",
      title: "Устранение ошибки проверки SSL-сертификата в ClickHouse",
      description: "Узнайте, как устранить ошибку SSL Exception CERTIFICATE_VERIFY_FAILED.",
      href: "/resources/support-center/knowledge-base/troubleshooting/certificate-verify-failed-error",
      category: "Устранение неполадок и ошибки",
      tags: ["Безопасность и аутентификация", "Ошибки и исключения"]
    },
    {
      id: "troubleshooting/connection-timeout-remote-remoteSecure",
      title: "Устранение ошибок тайм-аута при использовании табличных функций `remote` и `remoteSecure`",
      description: "Узнайте, как исправить ошибки тайм-аута при использовании табличных функций `remote` или `remoteSecure` в ClickHouse с помощью настройки параметров тайм-аута соединения.",
      href: "/resources/support-center/knowledge-base/troubleshooting/connection-timeout-remote-remoteSecure",
      category: "Устранение неполадок и ошибки",
      tags: ["Ошибки и исключения"]
    },
    {
      id: "tables-schema/search-across-node-for-tables-with-a-wildcard",
      title: "Поиск таблиц на узлах с использованием подстановочных знаков",
      description: "Узнайте, как выполнять поиск таблиц на узлах с использованием подстановочных знаков.",
      href: "/resources/support-center/knowledge-base/tables-schema/search-across-node-for-tables-with-a-wildcard",
      category: "Таблицы и схема",
      tags: ["Развертывание и масштабирование"]
    },
    {
      id: "performance-optimization/query-max-execution-time",
      title: "Установка ограничения на время выполнения запроса",
      description: "Как установить ограничение на максимальное время выполнения запроса",
      href: "/resources/support-center/knowledge-base/performance-optimization/query-max-execution-time",
      category: "Производительность и оптимизация",
      tags: ["Управление Cloud", "Настройки"]
    },
    {
      id: "data-import-export/json-simple-example",
      title: "Простой пример процесса извлечения данных JSON с использованием промежуточной таблицы и materialized view",
      description: "Простой пример процесса извлечения данных JSON с использованием промежуточной таблицы и materialized view",
      href: "/resources/support-center/knowledge-base/data-import-export/json-simple-example",
      category: "Импорт и экспорт данных",
      tags: ["Форматы данных"]
    },
    {
      id: "performance-optimization/async-vs-optimize-read-in-order",
      title: "Синхронное чтение данных",
      description:
        "Новая настройка `allow_asynchronous_read_from_io_pool_for_merge_tree` позволяет количеству потоков чтения (streams) превышать количество потоков в остальной части конвейера выполнения запроса.",
      href: "/resources/support-center/knowledge-base/performance-optimization/async-vs-optimize-read-in-order",
      category: "Производительность и оптимизация",
      tags: ["Настройки", "Производительность и оптимизация"]
    },
    {
      id: "integrations/terraform-example",
      title: "Пример использования Cloud API с помощью Terraform",
      description: "Здесь рассматривается пример того, как можно использовать Terraform для создания/удаления кластеров с помощью API",
      href: "/resources/support-center/knowledge-base/integrations/terraform-example",
      category: "Интеграция и клиентские библиотеки",
      tags: ["Нативные клиенты и интерфейсы"]
    },
    {
      id: "performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      title: "Советы и рекомендации по оптимизации базовых типов данных в ClickHouse",
      description: "Советы и рекомендации по оптимизации базовых типов данных в ClickHouse",
      href: "/resources/support-center/knowledge-base/performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      category: "Производительность и оптимизация",
      tags: ["Производительность и оптимизация"]
    },
    {
      id: "queries-sql/useful-queries-for-troubleshooting",
      title: "Полезные запросы для устранения неполадок",
      description: "Подборка полезных запросов для устранения неполадок в ClickHouse, включая мониторинг размеров таблиц, длительных запросов и ошибок.",
      href: "/resources/support-center/knowledge-base/queries-sql/useful-queries-for-troubleshooting",
      category: "Запросы и SQL",
      tags: ["Настройки"]
    },
    {
      id: "general-faqs/use-clickhouse-for-log-analytics",
      title: "Использование ClickHouse для аналитики журналов",
      description: "ClickHouse популярен для анализа журналов и метрик благодаря возможностям аналитики в реальном времени. Готовы узнать больше?",
      href: "/resources/support-center/knowledge-base/general-faqs/use-clickhouse-for-log-analytics",
      category: "Общие вопросы и FAQ",
      tags: ["Сценарии использования"]
    },
    {
      id: "queries-sql/filtered-aggregates",
      title: "Использование агрегатных функций с фильтрацией в ClickHouse",
      description: "Узнайте, как использовать агрегатные функции с фильтрацией в ClickHouse с агрегатными комбинаторами `-If` и `-Distinct` для упрощения синтаксиса запросов и улучшения аналитики.",
      href: "/resources/support-center/knowledge-base/queries-sql/filtered-aggregates",
      category: "Запросы и SQL",
      tags: ["Функции"]
    },
    {
      id: "general-faqs/dependencies",
      title: "Какие сторонние зависимости нужны для запуска ClickHouse?",
      description: "ClickHouse автономен и не имеет зависимостей времени выполнения",
      href: "/resources/support-center/knowledge-base/general-faqs/dependencies",
      category: "Общие вопросы и FAQ",
      tags: []
    },
    {
      id: "general-faqs/dbms-naming",
      title: 'Что означает "ClickHouse"?',
      description: 'Узнайте, что означает название ClickHouse.',
      href: "/resources/support-center/knowledge-base/general-faqs/dbms-naming",
      category: "Общие вопросы и FAQ",
      tags: []
    },
    {
      id: "general-faqs/ne-tormozit",
      title: "Что означает «не тормозит»?",
      description: 'На этой странице объясняется, что означает «не тормозит»',
      href: "/resources/support-center/knowledge-base/general-faqs/ne-tormozit",
      category: "Общие вопросы и FAQ",
      tags: []
    },
    {
      id: "integrations/oracle-odbc",
      title: "Что делать, если возникла проблема с кодировками при использовании Oracle через ODBC?",
      description: "На этой странице приведены рекомендации о том, что делать, если у вас возникла проблема с кодировками при использовании Oracle через ODBC",
      href: "/resources/support-center/knowledge-base/integrations/oracle-odbc",
      category: "Интеграция и клиентские библиотеки",
      tags: []
    },
    {
      id: "general-faqs/columnar-database",
      title: "Что такое колоночная база данных?",
      description: "На этой странице описывается, что такое колоночная база данных",
      href: "/resources/support-center/knowledge-base/general-faqs/columnar-database",
      category: "Общие вопросы и FAQ",
      tags: []
    },
    {
      id: "general-faqs/olap",
      title: "Что такое OLAP?",
      description: "Объяснение того, что такое оперативная аналитическая обработка данных",
      href: "/resources/support-center/knowledge-base/general-faqs/olap",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "performance-optimization/optimize-final-vs-final",
      title: "В чём разница между OPTIMIZE FINAL и FINAL?",
      description: "Рассматриваются различия между OPTIMIZE FINAL и FINAL, а также случаи, когда их следует и не следует применять.",
      href: "/resources/support-center/knowledge-base/performance-optimization/optimize-final-vs-final",
      category: "Performance & optimization",
      tags: ["Core Data Concepts"]
    },
    {
      id: "general-faqs/sql",
      title: "Какой синтаксис SQL поддерживает ClickHouse?",
      description: "ClickHouse поддерживает 100% синтаксиса SQL",
      href: "/resources/support-center/knowledge-base/general-faqs/sql",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/when-is-ttl-applied",
      title: "Когда применяются правила TTL и можно ли управлять этим процессом?",
      description:
        "Правила TTL в ClickHouse применяются отложенно, и вы можете управлять временем их выполнения с помощью настройки `merge_with_ttl_timeout`. Узнайте, как принудительно применить TTL и управлять фоновыми потоками для его выполнения.",
      href: "/resources/support-center/knowledge-base/data-management/when-is-ttl-applied",
      category: "Data management",
      tags: ["Core Data Concepts"]
    },
    {
      id: "setup-installation/production",
      title: "Какую версию ClickHouse использовать в production?",
      description: "На этой странице представлены рекомендации по выбору версии ClickHouse для production-среды",
      href: "/resources/support-center/knowledge-base/setup-installation/production",
      category: "Setup & installation",
      tags: []
    },
    {
      id: "general-faqs/who-is-using-clickhouse",
      title: "Кто использует ClickHouse?",
      description: "Описание того, кто использует ClickHouse",
      href: "/resources/support-center/knowledge-base/general-faqs/who-is-using-clickhouse",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/dictionaries-consistent-state",
      title: "Почему данные в словаре в ClickHouse Cloud не отображаются?",
      description: "Существует проблема, при которой данные в словарях могут быть недоступны сразу после создания.",
      href: "/resources/support-center/knowledge-base/data-management/dictionaries-consistent-state",
      category: "Data management",
      tags: ["Managing Cloud", "Data Modelling"]
    },
    {
      id: "general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      title: "Почему ClickHouse Keeper рекомендуется вместо ZooKeeper?",
      description:
        "ClickHouse Keeper превосходит ZooKeeper благодаря меньшему потреблению дискового пространства, более быстрому восстановлению и сниженному потреблению памяти, обеспечивая более высокую производительность для кластеров ClickHouse.",
      href: "/resources/support-center/knowledge-base/general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      category: "General & FAQs",
      tags: ["Core Data Concepts"]
    },
    {
      id: "monitoring-debugging/why-default-logging-verbose",
      title: "Почему журналирование в ClickHouse по умолчанию такое подробное?",
      description: "Узнайте, почему разработчики ClickHouse выбрали подробный уровень журналирования по умолчанию.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/why-default-logging-verbose",
      category: "Monitoring & debugging",
      tags: ["Settings"]
    },
    {
      id: "performance-optimization/why-is-my-primary-key-not-used",
      title: "Почему первичный ключ не используется? Как это проверить?",
      description: "Рассматривается распространённая причина, по которой первичный ключ не используется при сортировке, и способы её подтверждения",
      href: "/resources/support-center/knowledge-base/performance-optimization/why-is-my-primary-key-not-used",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "general-faqs/mapreduce",
      title: "Почему не использовать что-то вроде MapReduce?",
      description: "На этой странице объясняется, почему стоит выбрать ClickHouse вместо MapReduce",
      href: "/resources/support-center/knowledge-base/general-faqs/mapreduce",
      category: "General & FAQs",
      tags: []
    }
  ]
}