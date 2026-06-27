export const kbIndex = {
  categories: [
    "Cloud",
    "Configuración y ajustes",
    "Importación y exportación de datos",
    "Gestión de datos",
    "General y preguntas frecuentes",
    "Integraciones y bibliotecas de cliente",
    "Vistas materializadas y proyecciones",
    "Monitorización y depuración",
    "Performance & optimization",
    "Consultas y SQL",
    "Seguridad y control de acceso",
    "Setup & installation",
    "Tablas y esquema",
    "Resolución de problemas y errores"
  ],
  tags: [
    "Buenas prácticas",
    "Comunidad",
    "Conceptos",
    "Conceptos fundamentales de datos",
    "Exportación de datos",
    "Formatos de datos",
    "Ingesta de datos",
    "Modelado de datos",
    "Fuentes de datos",
    "Despliegues y escalado",
    "Errores y excepciones",
    "Funciones",
    "Clientes de lenguaje",
    "Gestión de Cloud",
    "Gestión de datos",
    "Clientes e interfaces nativos",
    "Rendimiento y optimizaciones",
    "Seguridad y autenticación",
    "Administración del servidor",
    "Configuración",
    "Tablas del sistema",
    "Herramientas y utilidades",
    "Resolución de problemas",
    "Casos de uso"
  ],
  articles: [
    {
      id: "integrations/python-clickhouse-connect-example",
      title: "Ejemplo funcional de cliente Python para conectarse a ClickHouse Cloud Service",
      description: "Aprenda a conectarse a ClickHouse Cloud Service con Python mediante un ejemplo paso a paso usando el driver clickhouse-connect.",
      href: "/resources/support-center/knowledge-base/integrations/python-clickhouse-connect-example",
      category: "Integraciones y bibliotecas de cliente",
      tags: ["Language Clients"]
    },
    {
      id: "configuration-settings/about-quotas-and-query-complexity",
      title: "Acerca de las cuotas y la complejidad de las consultas",
      description:
        "Las cuotas y la complejidad de las consultas son mecanismos eficaces para limitar y restringir lo que los usuarios pueden hacer en ClickHouse. Este artículo de la base de conocimiento muestra ejemplos de cómo aplicar estos dos enfoques.",
      href: "/resources/support-center/knowledge-base/configuration-settings/about-quotas-and-query-complexity",
      category: "Configuración y ajustes",
      tags: ["Managing Cloud"]
    },
    {
      id: "data-import-export/achieving-atomic-inserts",
      title: "Cómo lograr inserciones atómicas y consistencia entre múltiples tablas en ClickHouse Cloud",
      description: "Cómo cargar datos de forma atómica y mantener la consistencia entre múltiples tablas en ClickHouse Cloud sin transacciones de múltiples sentencias, usando tablas de staging y operaciones a nivel de partición.",
      href: "/resources/support-center/knowledge-base/data-import-export/achieving-atomic-inserts",
      category: "Importación y exportación de datos",
      tags: ["Ingesta de datos", "Best Practices"]
    },
    {
      id: "tables-schema/add-column",
      title: "Agregar una columna a una tabla",
      description: "En esta guía, aprenderemos cómo agregar una columna a una tabla existente.",
      href: "/resources/support-center/knowledge-base/tables-schema/add-column",
      category: "Tablas y esquema",
      tags: ["Data Modelling"]
    },
    {
      id: "configuration-settings/alter-user-settings-exception",
      title: "Excepción al modificar la configuración de usuario",
      description: "Cómo gestionar la excepción que se produce al modificar la configuración de usuario",
      href: "/resources/support-center/knowledge-base/configuration-settings/alter-user-settings-exception",
      category: "Configuración y ajustes",
      tags: ["Configuración", "Errors and Exceptions"]
    },
    {
      id: "materialized-views/are-materialized-views-inserted-asynchronously",
      title: "¿Las vistas materializadas se insertan de forma síncrona?",
      description: "Este artículo de la base de conocimiento analiza si las vistas materializadas se insertan de forma síncrona",
      href: "/resources/support-center/knowledge-base/materialized-views/are-materialized-views-inserted-asynchronously",
      category: "Vistas materializadas y proyecciones",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/schema-migration-tools",
      title: "Herramientas de migración automática de esquemas para ClickHouse",
      description: "Conozca las herramientas de migración automática de esquemas para ClickHouse y cómo gestionar los cambios en los esquemas de base de datos a lo largo del tiempo.",
      href: "/resources/support-center/knowledge-base/tables-schema/schema-migration-tools",
      category: "Tablas y esquema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      title: "Configuración de AWS PrivateLink para exponer MSK a ClickPipes",
      description: "Pasos de configuración para exponer un MSK privado mediante conectividad multi-VPC de MSK a ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      category: "Cloud",
      tags: ["Seguridad y autenticación", "Managing Cloud"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-clickpipes",
      title: "Configuración de AWS PrivateLink para exponer RDS privado a ClickPipes",
      description: "Pasos de configuración para exponer un RDS privado mediante AWS PrivateLink a ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-clickpipes",
      category: "Cloud",
      tags: ["Seguridad y autenticación", "Managing Cloud"]
    },
    {
      id: "data-management/backing-up-a-specific-partition",
      title: "Copia de seguridad de una partición específica",
      description: "¿Cómo puedo hacer una copia de seguridad de una partición específica en ClickHouse?",
      href: "/resources/support-center/knowledge-base/data-management/backing-up-a-specific-partition",
      category: "Gestión de datos",
      tags: ["Managing Data"]
    },
    {
      id: "general-faqs/key-value",
      title: "¿Puedo usar ClickHouse como almacenamiento clave-valor?",
      description: "Responde a la pregunta frecuente de si ClickHouse puede usarse como almacenamiento clave-valor.",
      href: "/resources/support-center/knowledge-base/general-faqs/key-value",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "general-faqs/time-series",
      title: "¿Puedo usar ClickHouse como base de datos de series temporales?",
      description: "Página que describe cómo usar ClickHouse como base de datos de series temporales",
      href: "/resources/support-center/knowledge-base/general-faqs/time-series",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "queries-sql/pivot",
      title: "¿Se puede hacer PIVOT en ClickHouse?",
      description:
        "ClickHouse no dispone de una cláusula PIVOT, pero podemos aproximarnos a esta funcionalidad usando combinadores de funciones de agregación. Veamos cómo hacerlo con el conjunto de datos de precios de vivienda del Reino Unido.",
      href: "/resources/support-center/knowledge-base/queries-sql/pivot",
      category: "Consultas y SQL",
      tags: ["Modelado de datos", "Core Data Concepts"]
    },
    {
      id: "general-faqs/vector-search",
      title: "¿Se puede usar ClickHouse para búsqueda vectorial?",
      description: "Aprenda a usar ClickHouse para búsqueda vectorial, incluyendo el almacenamiento de embeddings y la búsqueda con funciones de distancia como la similitud del coseno.",
      href: "/resources/support-center/knowledge-base/general-faqs/vector-search",
      category: "General y preguntas frecuentes",
      tags: ["Casos de uso", "Concepts"]
    },
    {
      id: "monitoring-debugging/send-logs-level",
      title: "Captura de logs del servidor de consultas en el cliente",
      description: "Aprenda a capturar logs del servidor a nivel de cliente, incluso con diferentes configuraciones de log, usando el ajuste de cliente `send_logs_level`.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/send-logs-level",
      category: "Monitorización y depuración",
      tags: ["Server Admin"]
    },
    {
      id: "configuration-settings/change-the-prompt-in-clickhouse-client",
      title: "Cambiar el prompt en clickhouse-client",
      description: "Este artículo explica cómo cambiar el prompt en el cliente de ClickHouse y en la ventana de terminal de clickhouse-local de :) a un prefijo seguido de :)",
      href: "/resources/support-center/knowledge-base/configuration-settings/change-the-prompt-in-clickhouse-client",
      category: "Configuración y ajustes",
      tags: ["Configuración", "Native Clients and Interfaces"]
    },
    {
      id: "security/common-rbac-queries",
      title: "Consultas RBAC comunes",
      description: "Consultas para ayudar a otorgar permisos específicos a los usuarios.",
      href: "/resources/support-center/knowledge-base/security/common-rbac-queries",
      category: "Seguridad y control de acceso",
      tags: ["Seguridad y autenticación", "Managing Cloud"]
    },
    {
      id: "queries-sql/comparing-metrics-between-queries",
      title: "Comparación de métricas entre consultas en decibelios",
      description: "Una consulta para comparar métricas entre dos consultas en ClickHouse.",
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
        "This article explains how to resolve the DB::Exception error related to intersecting parts in ClickHouse, often caused by a race condition or manual intervention in the ZooKeeper data.",
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
      title: "¿Cómo contribuyo con código a ClickHouse?",
      description: "ClickHouse es un proyecto de código abierto desarrollado en GitHub. Como es habitual, las instrucciones para contribuir se publican en el archivo CONTRIBUTING en la raíz del repositorio de código fuente.",
      href: "/resources/support-center/knowledge-base/general-faqs/how-do-i-contribute-code-to-clickhouse",
      category: "General & FAQs",
      tags: ["Community"]
    },
    {
      id: "data-import-export/parquet-to-csv-json",
      title: "¿Cómo convierto archivos de Parquet a CSV o JSON?",
      description: "Aprende a usar la herramienta `clickhouse-local` de ClickHouse para convertir fácilmente archivos Parquet a formatos CSV o JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/parquet-to-csv-json",
      category: "Data import & export",
      tags: ["Data Sources", "Data Formats"]
    },
    {
      id: "data-import-export/mysql-to-parquet-csv-json",
      title: "¿Cómo exporto datos de MySQL a Parquet, CSV o JSON usando ClickHouse?",
      description: "Aprende a usar la herramienta `clickhouse-local` para exportar datos de MySQL a formatos como Parquet, CSV o JSON de forma rápida y eficiente.",
      href: "/resources/support-center/knowledge-base/data-import-export/mysql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Export"]
    },
    {
      id: "data-import-export/postgresql-to-parquet-csv-json",
      title: "¿Cómo exporto datos de PostgreSQL a Parquet, CSV o JSON?",
      description: "Aprende a exportar datos de PostgreSQL a formatos Parquet, CSV o JSON usando `clickhouse-local` con varios ejemplos.",
      href: "/resources/support-center/knowledge-base/data-import-export/postgresql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Export", "Data Formats"]
    },
    {
      id: "setup-installation/install-clickhouse-windows10",
      title: "¿Cómo instalo ClickHouse en Windows 10?",
      description: "Aprende a instalar y probar ClickHouse en Windows 10 usando WSL 2. Incluye configuración, solución de problemas y ejecución de un entorno de prueba.",
      href: "/resources/support-center/knowledge-base/setup-installation/install-clickhouse-windows10",
      category: "Setup & installation",
      tags: ["Tools and Utilities"]
    },
    {
      id: "security/remove-default-user",
      title: "¿Cómo elimino el usuario predeterminado?",
      description: "Aprende a eliminar el usuario predeterminado al ejecutar ClickHouse Server.",
      href: "/resources/support-center/knowledge-base/security/remove-default-user",
      category: "Security & access control",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/ingest-failures-23-9-release",
      title: "¿Cómo resuelvo los fallos de ingesta tras la versión 23.9 de ClickHouse?",
      description: "Aprende a resolver los fallos de ingesta causados por la verificación más estricta de permisos introducida en ClickHouse 23.9 para tablas que usan `async_inserts`. Actualiza los permisos para corregir los errores.",
      href: "/resources/support-center/knowledge-base/cloud-services/ingest-failures-23-9-release",
      category: "Cloud",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "performance-optimization/insert-select-settings-tuning",
      title: "¿Cómo resuelvo el error TOO MANY PARTS durante un INSERT...SELECT?",
      description: "Resuelve el error TOO_MANY_PARTS en ClickHouse durante un `INSERT...SELECT` ajustando configuraciones avanzadas para bloques más grandes y aumentando los umbrales de partición.",
      href: "/resources/support-center/knowledge-base/performance-optimization/insert-select-settings-tuning",
      category: "Performance & optimization",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "integrations/node-js-example",
      title: "¿Cómo uso NodeJS con @clickhouse/client?",
      description: "Aprende a usar @clickhouse/client en una aplicación Node.js para interactuar con ClickHouse y realizar consultas.",
      href: "/resources/support-center/knowledge-base/integrations/node-js-example",
      category: "Integrations & client libraries",
      tags: ["Language Clients"]
    },
    {
      id: "monitoring-debugging/view-number-of-active-mutations",
      title: "¿Cómo veo el número de mutaciones activas o en cola?",
      description:
        "Monitorea el número de mutaciones activas o en cola en ClickHouse, especialmente al realizar operaciones `ALTER` o `UPDATE`. Usa la tabla `system.mutations` para rastrear las mutaciones.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/view-number-of-active-mutations",
      category: "Monitoring & debugging",
      tags: ["System Tables"]
    },
    {
      id: "data-management/read-consistency",
      title: "¿Cómo lograr consistencia en la lectura de datos en ClickHouse?",
      description: "Aprende a garantizar la consistencia de los datos al leer desde ClickHouse, ya sea que estés conectado al mismo nodo o a un nodo aleatorio.",
      href: "/resources/support-center/knowledge-base/data-management/read-consistency",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "setup-installation/llvm-clang-up-to-date",
      title: "Cómo compilar LLVM y clang en Linux",
      description: "Comandos para compilar LLVM y clang en Linux.",
      href: "/resources/support-center/knowledge-base/setup-installation/llvm-clang-up-to-date",
      category: "Setup & installation",
      tags: ["Community", "Tools and Utilities"]
    },
    {
      id: "data-management/calculate-ratio-of-zero-sparse-serialization",
      title: "Cómo calcular la proporción de valores vacíos/cero en cada columna de una tabla",
      description: "Aprende a calcular la proporción de valores vacíos o cero en cada columna de una tabla de ClickHouse para optimizar la serialización de columnas dispersas.",
      href: "/resources/support-center/knowledge-base/data-management/calculate-ratio-of-zero-sparse-serialization",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "security/check-users-roles",
      title: "Cómo verificar los usuarios asignados a roles y viceversa",
      description: "Aprende a consultar `system.role_grants` de ClickHouse para encontrar usuarios asignados a roles y roles asignados a usuarios específicos.",
      href: "/resources/support-center/knowledge-base/security/check-users-roles",
      category: "Security & access control",
      tags: ["Server Admin", "System Tables", "Managing Cloud"]
    },
    {
      id: "monitoring-debugging/which-processes-are-currently-running",
      title: "¿Cómo verificar qué código se está ejecutando actualmente en un servidor?",
      description:
        "ClickHouse proporciona herramientas de introspección como `system.stack_trace` para inspeccionar qué código se está ejecutando en cada hilo del servidor, lo que ayuda con la depuración y el monitoreo del rendimiento.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/which-processes-are-currently-running",
      category: "Monitoring & debugging",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      title: "Cómo verificar el estado de tu servicio de ClickHouse Cloud",
      description: "Aprende a usar la API de ClickHouse Cloud para comprobar si tu servicio está detenido, inactivo o en ejecución sin activarlo.",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "configuration-settings/configure-a-user-setting",
      title: "Cómo configurar ajustes para un usuario en ClickHouse",
      description: "Aprende a definir configuraciones en ClickHouse para consultas individuales, sesiones de cliente o usuarios específicos usando los comandos `SET` y `ALTER USER`.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-a-user-setting",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "materialized-views/projection-example",
      title: "¿Cómo confirmar si una proyección es utilizada por la consulta?",
      description: "Aprende a verificar si una proyección se usa en las consultas de ClickHouse probando con datos de muestra y usando EXPLAIN para confirmar el uso de la proyección.",
      href: "/resources/support-center/knowledge-base/materialized-views/projection-example",
      category: "Materialized views & projections",
      tags: ["Data Modelling"]
    },
    {
      id: "cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      title: "Cómo conectarse a ClickHouse usando claves SSH",
      description: "Cómo conectarse a ClickHouse y ClickHouse Cloud usando claves SSH",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      category: "Cloud",
      tags: ["Managing Cloud", "Security and Authentication"]
    },
    {
      id: "data-management/dictionary-using-strings",
      title: "Cómo crear un diccionario de ClickHouse con claves y valores de tipo cadena",
      description: "Aprenda a crear un diccionario de ClickHouse con claves y valores de tipo cadena a partir de una tabla MergeTree como fuente, con ejemplos de configuración y uso.",
      href: "/resources/support-center/knowledge-base/data-management/dictionary-using-strings",
      category: "Gestión de datos",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      title: "Cómo crear una tabla que pueda consultar múltiples clústeres remotos",
      description: "Cómo crear una tabla que pueda consultar múltiples clústeres remotos",
      href: "/resources/support-center/knowledge-base/tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      category: "Tablas y esquema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "setup-installation/enabling-ssl-with-lets-encrypt",
      title: "Cómo habilitar SSL con Let's Encrypt en un servidor ClickHouse individual",
      description: "Aprenda a configurar SSL para un servidor ClickHouse individual con Let's Encrypt, incluyendo la emisión de certificados, la configuración y la validación.",
      href: "/resources/support-center/knowledge-base/setup-installation/enabling-ssl-with-lets-encrypt",
      category: "Configuración e instalación",
      tags: ["Security and Authentication"]
    },
    {
      id: "data-import-export/file-export",
      title: "Cómo exportar datos de ClickHouse a un archivo",
      description: "Conozca los distintos métodos para exportar datos de ClickHouse, incluyendo `INTO OUTFILE`, el motor de tabla File y la redirección por línea de comandos.",
      href: "/resources/support-center/knowledge-base/data-import-export/file-export",
      category: "Importación y exportación de datos",
      tags: ["Data Export"]
    },
    {
      id: "queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      title: "¿Cómo filtrar una tabla de ClickHouse por una columna de tipo array?",
      description: "Artículo de la base de conocimiento sobre cómo filtrar una tabla de ClickHouse por una columna de tipo array.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      category: "Consultas y SQL",
      tags: ["Data Modelling", "Functions"]
    },
    {
      id: "monitoring-debugging/generate-har-file",
      title: "Cómo generar un archivo HAR para soporte técnico",
      description: "Un archivo HAR (HTTP Archive) captura la actividad de red de su navegador. Puede ayudar a nuestro equipo de soporte a diagnosticar cargas de página lentas, solicitudes fallidas u otros problemas de red.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/generate-har-file",
      category: "Monitorización y depuración",
      tags: ["Tools and Utilities"]
    },
    {
      id: "materialized-views/how-to-display-queries-using-mv",
      title: "Cómo identificar consultas que usan vistas materializadas en ClickHouse",
      description: "Aprenda a consultar los logs de ClickHouse para identificar todas las consultas que involucran vistas materializadas en un intervalo de tiempo determinado.",
      href: "/resources/support-center/knowledge-base/materialized-views/how-to-display-queries-using-mv",
      category: "Vistas materializadas y proyecciones",
      tags: ["System Tables"]
    },
    {
      id: "performance-optimization/find-expensive-queries",
      title: "Cómo identificar las consultas más costosas en ClickHouse",
      description: "Aprenda a usar la tabla `query_log` en ClickHouse para identificar las consultas con mayor consumo de memoria y CPU en nodos distribuidos.",
      href: "/resources/support-center/knowledge-base/performance-optimization/find-expensive-queries",
      category: "Rendimiento y optimización",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/ignoring-incorrect-settings",
      title: "Cómo ignorar configuraciones incorrectas en ClickHouse",
      description: "Aprenda a usar la opción `skip_check_for_incorrect_settings` para permitir que ClickHouse se inicie incluso cuando las configuraciones a nivel de usuario están definidas incorrectamente.",
      href: "/resources/support-center/knowledge-base/configuration-settings/ignoring-incorrect-settings",
      category: "Configuración y ajustes",
      tags: ["Settings"]
    },
    {
      id: "data-import-export/json-import",
      title: "¿Cómo importar JSON en ClickHouse?",
      description: "Esta página le muestra cómo importar JSON en ClickHouse",
      href: "/resources/support-center/knowledge-base/data-import-export/json-import",
      category: "Importación y exportación de datos",
      tags: []
    },
    {
      id: "setup-installation/how-to-increase-thread-pool-size",
      title: "Cómo aumentar el número de hilos en ClickHouse",
      description: "Aprenda a configurar el pool de hilos global en ClickHouse ajustando parámetros como `max_thread_pool_size`, `thread_pool_queue_size` y `max_thread_pool_free_size`.",
      href: "/resources/support-center/knowledge-base/setup-installation/how-to-increase-thread-pool-size",
      category: "Configuración e instalación",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "data-import-export/kafka-to-clickhouse-setup",
      title: "Cómo ingestar datos de Kafka en ClickHouse",
      description: "Aprenda a ingestar datos de un topic de Kafka en ClickHouse usando el motor de tabla Kafka, vistas materializadas y tablas MergeTree.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-to-clickhouse-setup",
      category: "Importación y exportación de datos",
      tags: ["Data Ingestion"]
    },
    {
      id: "data-import-export/ingest-parquet-files-in-s3",
      title: "Cómo ingestar archivos Parquet desde un bucket de S3",
      description: "Aprenda los fundamentos del uso del motor de tabla S3 en ClickHouse para ingestar y consultar archivos Parquet desde un bucket de S3, incluyendo configuración, permisos de acceso y ejemplos de importación de datos.",
      href: "/resources/support-center/knowledge-base/data-import-export/ingest-parquet-files-in-s3",
      category: "Importación y exportación de datos",
      tags: ["Data Ingestion"]
    },
    {
      id: "queries-sql/how-to-insert-all-rows-from-another-table",
      title: "¿Cómo insertar todas las filas de una tabla en otra?",
      description: "Artículo de la base de conocimiento sobre cómo insertar todas las filas de una tabla en otra.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-insert-all-rows-from-another-table",
      category: "Consultas y SQL",
      tags: ["Data Ingestion"]
    },
    {
      id: "performance-optimization/check-query-processing-time-only",
      title: "Cómo medir el tiempo de procesamiento de consultas sin devolver filas",
      description: "Aprenda a usar la opción `FORMAT Null` en ClickHouse para medir el tiempo de procesamiento de consultas sin devolver ninguna fila al cliente.",
      href: "/resources/support-center/knowledge-base/performance-optimization/check-query-processing-time-only",
      category: "Rendimiento y optimización",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "monitoring-debugging/outputSendLogsLevelTracesToFile",
      title: "Cómo enviar trazas de nivel de log a un archivo usando el clickhouse-client",
      description: "Cómo enviar trazas de nivel de log a un archivo usando el clickhouse-client",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/outputSendLogsLevelTracesToFile",
      category: "Monitorización y depuración",
      tags: ["Data Export"]
    },
    {
      id: "tables-schema/recreate-table-across-terminals",
      title: "Cómo recrear rápidamente una tabla pequeña en diferentes terminales",
      description: "Aprenda a recrear rápidamente una tabla pequeña y sus datos en diferentes terminales mediante copiar y pegar en entornos de desarrollo.",
      href: "/resources/support-center/knowledge-base/tables-schema/recreate-table-across-terminals",
      category: "Tablas y esquema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      title: "Cómo configurar ClickHouse en Docker con ODBC para conectarse a una base de datos Microsoft SQL Server (MSSQL)",
      description: "Cómo configurar ClickHouse en Docker con ODBC para conectarse a una base de datos Microsoft SQL Server (MSSQL)",
      href: "/resources/support-center/knowledge-base/integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      category: "Integraciones y bibliotecas de cliente",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "queries-sql/using-array-join-to-extract-and-query-attributes",
      title: "Cómo usar array join para extraer y consultar atributos variables mediante claves y valores de tipo map",
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
      description: "Aprenda a importar archivos GeoJSON con arrays de objetos profundamente anidados en ClickHouse y a consultar los datos de características anidadas.",
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
      title: "Ejemplo rápido en Python con el módulo requests para HTTP",
      description: "Un ejemplo que usa Python y el módulo requests para escribir y leer datos en ClickHouse",
      href: "/resources/support-center/knowledge-base/integrations/python-http-requests",
      category: "Integraciones y bibliotecas de cliente",
      tags: ["Clientes nativos e interfaces"]
    },
    {
      id: "configuration-settings/maximum-number-of-tables-and-databases",
      title: "Máximo recomendado de bases de datos, tablas, particiones y partes en ClickHouse",
      description: "Conozca los límites máximos recomendados para bases de datos, tablas, particiones y partes en un clúster de ClickHouse para garantizar un rendimiento óptimo.",
      href: "/resources/support-center/knowledge-base/configuration-settings/maximum-number-of-tables-and-databases",
      category: "Configuración y ajustes",
      tags: ["Rendimiento y optimizaciones", "Implementaciones y escalado"]
    },
    {
      id: "data-import-export/cannot-append-data-to-parquet-format",
      title: 'Cómo resolver el error "Cannot Append Data in Parquet Format" en ClickHouse',
      description: '¿Aparece el error "Cannot append data in format Parquet to file" en ClickHouse? Veamos cómo resolverlo.',
      href: "/resources/support-center/knowledge-base/data-import-export/cannot-append-data-to-parquet-format",
      category: "Importación y exportación de datos",
      tags: ["Errores y excepciones", "Formatos de datos"]
    },
    {
      id: "troubleshooting/exception-too-many-parts",
      title: 'Cómo resolver el error "Too Many Parts" en ClickHouse',
      description: 'Aprenda a resolver el error "Too many parts" en ClickHouse optimizando las tasas de inserción, configurando los ajustes de MergeTree y gestionando las particiones de forma eficaz.',
      href: "/resources/support-center/knowledge-base/troubleshooting/exception-too-many-parts",
      category: "Solución de problemas y errores",
      tags: ["Errores y excepciones"]
    },
    {
      id: "troubleshooting/certificate-verify-failed-error",
      title: "Cómo resolver el error de verificación de certificados SSL en ClickHouse",
      description: "Aprenda a resolver el error SSL Exception CERTIFICATE_VERIFY_FAILED.",
      href: "/resources/support-center/knowledge-base/troubleshooting/certificate-verify-failed-error",
      category: "Solución de problemas y errores",
      tags: ["Seguridad y autenticación", "Errores y excepciones"]
    },
    {
      id: "troubleshooting/connection-timeout-remote-remoteSecure",
      title: "Cómo resolver errores de tiempo de espera con las funciones de tabla `remote` y `remoteSecure`",
      description: "Aprenda a corregir los errores de tiempo de espera al usar las funciones de tabla `remote` o `remoteSecure` en ClickHouse ajustando la configuración del tiempo de espera de conexión.",
      href: "/resources/support-center/knowledge-base/troubleshooting/connection-timeout-remote-remoteSecure",
      category: "Solución de problemas y errores",
      tags: ["Errores y excepciones"]
    },
    {
      id: "tables-schema/search-across-node-for-tables-with-a-wildcard",
      title: "Buscar tablas en todos los nodos con un comodín",
      description: "Aprenda a buscar tablas en todos los nodos con un comodín.",
      href: "/resources/support-center/knowledge-base/tables-schema/search-across-node-for-tables-with-a-wildcard",
      category: "Tablas y esquema",
      tags: ["Implementaciones y escalado"]
    },
    {
      id: "performance-optimization/query-max-execution-time",
      title: "Establecer un límite para el tiempo de ejecución de las consultas",
      description: "Cómo aplicar un límite al tiempo máximo de ejecución de las consultas",
      href: "/resources/support-center/knowledge-base/performance-optimization/query-max-execution-time",
      category: "Rendimiento y optimización",
      tags: ["Gestión de Cloud", "Configuración"]
    },
    {
      id: "data-import-export/json-simple-example",
      title: "Flujo de ejemplo sencillo para extraer datos JSON usando una tabla de aterrizaje con una vista materializada",
      description: "Flujo de ejemplo sencillo para extraer datos JSON usando una tabla de aterrizaje con una vista materializada",
      href: "/resources/support-center/knowledge-base/data-import-export/json-simple-example",
      category: "Importación y exportación de datos",
      tags: ["Formatos de datos"]
    },
    {
      id: "performance-optimization/async-vs-optimize-read-in-order",
      title: "Lectura síncrona de datos",
      description:
        "La nueva configuración `allow_asynchronous_read_from_io_pool_for_merge_tree` permite que el número de hilos de lectura (flujos) sea mayor que el número de hilos del resto de la canalización de ejecución de consultas.",
      href: "/resources/support-center/knowledge-base/performance-optimization/async-vs-optimize-read-in-order",
      category: "Rendimiento y optimización",
      tags: ["Configuración", "Rendimiento y optimizaciones"]
    },
    {
      id: "integrations/terraform-example",
      title: "Ejemplo de Terraform sobre cómo usar la API de Cloud",
      description: "Incluye un ejemplo de cómo puede usar Terraform para crear o eliminar clústeres mediante la API",
      href: "/resources/support-center/knowledge-base/integrations/terraform-example",
      category: "Integraciones y bibliotecas de cliente",
      tags: ["Clientes nativos e interfaces"]
    },
    {
      id: "performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      title: "Consejos y trucos para optimizar tipos de datos básicos en ClickHouse",
      description: "Consejos y trucos para optimizar tipos de datos básicos en ClickHouse",
      href: "/resources/support-center/knowledge-base/performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      category: "Rendimiento y optimización",
      tags: ["Rendimiento y optimizaciones"]
    },
    {
      id: "queries-sql/useful-queries-for-troubleshooting",
      title: "Consultas útiles para la solución de problemas",
      description: "Una colección de consultas prácticas para solucionar problemas en ClickHouse, como supervisar el tamaño de las tablas, las consultas de larga duración y los errores.",
      href: "/resources/support-center/knowledge-base/queries-sql/useful-queries-for-troubleshooting",
      category: "Consultas y SQL",
      tags: ["Configuración"]
    },
    {
      id: "general-faqs/use-clickhouse-for-log-analytics",
      title: "Uso de ClickHouse para analítica de logs",
      description: "ClickHouse es popular para el análisis de logs y métricas gracias a sus capacidades de analítica en tiempo real. ¿Listo para descubrir más?",
      href: "/resources/support-center/knowledge-base/general-faqs/use-clickhouse-for-log-analytics",
      category: "General y preguntas frecuentes",
      tags: ["Casos de uso"]
    },
    {
      id: "queries-sql/filtered-aggregates",
      title: "Uso de agregados filtrados en ClickHouse",
      description: "Aprenda a usar agregados filtrados en ClickHouse con los combinadores de agregación `-If` y `-Distinct` para simplificar la sintaxis de las consultas y mejorar la analítica.",
      href: "/resources/support-center/knowledge-base/queries-sql/filtered-aggregates",
      category: "Consultas y SQL",
      tags: ["Funciones"]
    },
    {
      id: "general-faqs/dependencies",
      title: "¿Cuáles son las dependencias de terceros necesarias para ejecutar ClickHouse?",
      description: "ClickHouse es autónomo y no tiene dependencias en tiempo de ejecución",
      href: "/resources/support-center/knowledge-base/general-faqs/dependencies",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "general-faqs/dbms-naming",
      title: '¿Qué significa "ClickHouse"?',
      description: 'Descubra qué significa "ClickHouse".',
      href: "/resources/support-center/knowledge-base/general-faqs/dbms-naming",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "general-faqs/ne-tormozit",
      title: "¿Qué significa "не тормозит"?",
      description: 'Esta página explica qué significa "Не тормозит"',
      href: "/resources/support-center/knowledge-base/general-faqs/ne-tormozit",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "integrations/oracle-odbc",
      title: "¿Qué hacer si tengo un problema de codificación al usar Oracle mediante ODBC?",
      description: "Esta página ofrece orientación sobre qué hacer si tiene un problema de codificación al usar Oracle mediante ODBC",
      href: "/resources/support-center/knowledge-base/integrations/oracle-odbc",
      category: "Integraciones y bibliotecas de cliente",
      tags: []
    },
    {
      id: "general-faqs/columnar-database",
      title: "¿Qué es una base de datos columnar?",
      description: "Esta página describe qué es una base de datos columnar",
      href: "/resources/support-center/knowledge-base/general-faqs/columnar-database",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "general-faqs/olap",
      title: "¿Qué es OLAP?",
      description: "Una explicación sobre qué es el procesamiento analítico en línea (OLAP)",
      href: "/resources/support-center/knowledge-base/general-faqs/olap",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "performance-optimization/optimize-final-vs-final",
      title: "¿Cuál es la diferencia entre OPTIMIZE FINAL y FINAL?",
      description: "Analiza las diferencias entre OPTIMIZE FINAL y FINAL, y cuándo utilizarlos o evitarlos.",
      href: "/resources/support-center/knowledge-base/performance-optimization/optimize-final-vs-final",
      category: "Rendimiento y optimización",
      tags: ["Core Data Concepts"]
    },
    {
      id: "general-faqs/sql",
      title: "¿Qué sintaxis SQL admite ClickHouse?",
      description: "ClickHouse admite el 100% de la sintaxis SQL",
      href: "/resources/support-center/knowledge-base/general-faqs/sql",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "data-management/when-is-ttl-applied",
      title: "¿Cuándo se aplican las reglas TTL y podemos controlar cuándo ocurre?",
      description:
        "Las reglas TTL en ClickHouse se aplican de forma eventual, y puede controlar cuándo se ejecutan mediante la configuración `merge_with_ttl_timeout`. Aprenda a forzar la aplicación de TTL y a gestionar los hilos en segundo plano para su ejecución.",
      href: "/resources/support-center/knowledge-base/data-management/when-is-ttl-applied",
      category: "Gestión de datos",
      tags: ["Core Data Concepts"]
    },
    {
      id: "setup-installation/production",
      title: "¿Qué versión de ClickHouse usar en producción?",
      description: "Esta página ofrece orientación sobre qué versión de ClickHouse utilizar en producción",
      href: "/resources/support-center/knowledge-base/setup-installation/production",
      category: "Configuración e instalación",
      tags: []
    },
    {
      id: "general-faqs/who-is-using-clickhouse",
      title: "¿Quién usa ClickHouse?",
      description: "Describe quiénes son los usuarios de ClickHouse",
      href: "/resources/support-center/knowledge-base/general-faqs/who-is-using-clickhouse",
      category: "General y preguntas frecuentes",
      tags: []
    },
    {
      id: "data-management/dictionaries-consistent-state",
      title: "¿Por qué no puedo ver mis datos en un diccionario en ClickHouse Cloud?",
      description: "Existe un problema por el que los datos en los diccionarios pueden no ser visibles inmediatamente después de su creación.",
      href: "/resources/support-center/knowledge-base/data-management/dictionaries-consistent-state",
      category: "Gestión de datos",
      tags: ["Managing Cloud", "Data Modelling"]
    },
    {
      id: "general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      title: "¿Por qué se recomienda ClickHouse Keeper en lugar de ZooKeeper?",
      description:
        "ClickHouse Keeper mejora a ZooKeeper con características como menor uso de espacio en disco, recuperación más rápida y menor consumo de memoria, lo que ofrece un mejor rendimiento para los clústeres de ClickHouse.",
      href: "/resources/support-center/knowledge-base/general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      category: "General y preguntas frecuentes",
      tags: ["Core Data Concepts"]
    },
    {
      id: "monitoring-debugging/why-default-logging-verbose",
      title: "¿Por qué el registro de ClickHouse es tan detallado por defecto?",
      description: "Descubra por qué los desarrolladores de ClickHouse eligieron establecer un nivel de registro detallado por defecto.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/why-default-logging-verbose",
      category: "Monitorización y depuración",
      tags: ["Settings"]
    },
    {
      id: "performance-optimization/why-is-my-primary-key-not-used",
      title: "¿Por qué no se usa mi clave primaria? ¿Cómo puedo comprobarlo?",
      description: "Aborda una razón habitual por la que no se utiliza una clave primaria en el ordenamiento y cómo confirmarlo",
      href: "/resources/support-center/knowledge-base/performance-optimization/why-is-my-primary-key-not-used",
      category: "Rendimiento y optimización",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "general-faqs/mapreduce",
      title: "¿Por qué no usar algo como MapReduce?",
      description: "Esta página explica por qué conviene usar ClickHouse en lugar de MapReduce",
      href: "/resources/support-center/knowledge-base/general-faqs/mapreduce",
      category: "General y preguntas frecuentes",
      tags: []
    }
  ]
}