export const kbIndex = {
  categories: [
    "Cloud",
    "الإعدادات والتهيئة",
    "استيراد البيانات وتصديرها",
    "إدارة البيانات",
    "عام والأسئلة الشائعة",
    "التكاملات ومكتبات العملاء",
    "المشاهدات المادية والإسقاطات",
    "المراقبة وتصحيح الأخطاء",
    "الأداء والتحسين",
    "الاستعلامات وSQL",
    "الأمان والتحكم في الوصول",
    "الإعداد والتثبيت",
    "الجداول والمخطط",
    "استكشاف الأخطاء وإصلاحها"
  ],
  tags: [
    "أفضل الممارسات",
    "المجتمع",
    "المفاهيم",
    "مفاهيم البيانات الأساسية",
    "تصدير البيانات",
    "تنسيقات البيانات",
    "استيعاب البيانات",
    "نمذجة البيانات",
    "مصادر البيانات",
    "النشر والتوسع",
    "الأخطاء والاستثناءات",
    "الدوال",
    "عملاء اللغات",
    "إدارة Cloud",
    "إدارة البيانات",
    "العملاء والواجهات الأصلية",
    "الأداء والتحسينات",
    "الأمان والمصادقة",
    "إدارة الخادم",
    "الإعدادات",
    "جداول النظام",
    "الأدوات والمرافق",
    "استكشاف الأخطاء وإصلاحها",
    "حالات الاستخدام"
  ],
  articles: [
    {
      id: "integrations/python-clickhouse-connect-example",
      title: "مثال عملي باستخدام عميل Python للاتصال بـ ClickHouse Cloud Service",
      description: "تعرّف على كيفية الاتصال بـ ClickHouse Cloud Service باستخدام Python من خلال مثال تفصيلي خطوة بخطوة يستخدم مشغّل clickhouse-connect.",
      href: "/resources/support-center/knowledge-base/integrations/python-clickhouse-connect-example",
      category: "التكاملات ومكتبات العملاء",
      tags: ["Language Clients"]
    },
    {
      id: "configuration-settings/about-quotas-and-query-complexity",
      title: "حول الحصص وتعقيد الاستعلامات",
      description:
        "تُعدّ الحصص وتعقيد الاستعلامات من الأساليب الفعّالة لتقييد ما يمكن للمستخدمين القيام به في ClickHouse. تعرض هذه المقالة أمثلة على كيفية تطبيق هذين النهجين المختلفين.",
      href: "/resources/support-center/knowledge-base/configuration-settings/about-quotas-and-query-complexity",
      category: "الإعدادات والتهيئة",
      tags: ["Managing Cloud"]
    },
    {
      id: "data-import-export/achieving-atomic-inserts",
      title: "تحقيق عمليات الإدراج الذري واتساق الجداول المتعددة في ClickHouse Cloud",
      description: "كيفية تحميل البيانات بصورة ذرية والحفاظ على اتساق جداول متعددة في ClickHouse Cloud دون الحاجة إلى معاملات متعددة العبارات، باستخدام جداول التدريج وعمليات مستوى القسم.",
      href: "/resources/support-center/knowledge-base/data-import-export/achieving-atomic-inserts",
      category: "استيراد البيانات وتصديرها",
      tags: ["استيعاب البيانات", "Best Practices"]
    },
    {
      id: "tables-schema/add-column",
      title: "إضافة عمود إلى جدول",
      description: "في هذا الدليل، سنتعلم كيفية إضافة عمود إلى جدول موجود.",
      href: "/resources/support-center/knowledge-base/tables-schema/add-column",
      category: "الجداول والمخطط",
      tags: ["Data Modelling"]
    },
    {
      id: "configuration-settings/alter-user-settings-exception",
      title: "استثناء تعديل إعدادات المستخدم",
      description: "التعامل مع الاستثناء الذي يُطرح عند تعديل إعدادات المستخدم",
      href: "/resources/support-center/knowledge-base/configuration-settings/alter-user-settings-exception",
      category: "الإعدادات والتهيئة",
      tags: ["الإعدادات", "Errors and Exceptions"]
    },
    {
      id: "materialized-views/are-materialized-views-inserted-asynchronously",
      title: "هل تُدرج المشاهدات المادية بشكل متزامن؟",
      description: "تستكشف هذه المقالة ما إذا كانت المشاهدات المادية تُدرج بشكل متزامن",
      href: "/resources/support-center/knowledge-base/materialized-views/are-materialized-views-inserted-asynchronously",
      category: "المشاهدات المادية والإسقاطات",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/schema-migration-tools",
      title: "أدوات ترحيل المخطط التلقائي لـ ClickHouse",
      description: "تعرّف على أدوات ترحيل المخطط التلقائي لـ ClickHouse وكيفية إدارة تغييرات مخططات قواعد البيانات بمرور الوقت.",
      href: "/resources/support-center/knowledge-base/tables-schema/schema-migration-tools",
      category: "الجداول والمخطط",
      tags: ["Tools and Utilities"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      title: "إعداد AWS PrivateLink لكشف MSK لـ ClickPipes",
      description: "خطوات الإعداد لكشف MSK خاص عبر اتصال MSK متعدد الـ VPC إلى ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      category: "Cloud",
      tags: ["الأمان والمصادقة", "Managing Cloud"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-clickpipes",
      title: "إعداد AWS PrivateLink لكشف RDS الخاص لـ ClickPipes",
      description: "خطوات الإعداد لكشف RDS خاص عبر AWS PrivateLink إلى ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-clickpipes",
      category: "Cloud",
      tags: ["الأمان والمصادقة", "Managing Cloud"]
    },
    {
      id: "data-management/backing-up-a-specific-partition",
      title: "نسخ قسم محدد احتياطياً",
      description: "كيف يمكنني نسخ قسم محدد احتياطياً في ClickHouse؟",
      href: "/resources/support-center/knowledge-base/data-management/backing-up-a-specific-partition",
      category: "إدارة البيانات",
      tags: ["Managing Data"]
    },
    {
      id: "general-faqs/key-value",
      title: "هل يمكنني استخدام ClickHouse كتخزين مفتاح-قيمة؟",
      description: "يجيب على السؤال الشائع حول ما إذا كان يمكن استخدام ClickHouse كتخزين مفتاح-قيمة.",
      href: "/resources/support-center/knowledge-base/general-faqs/key-value",
      category: "عام والأسئلة الشائعة",
      tags: []
    },
    {
      id: "general-faqs/time-series",
      title: "هل يمكنني استخدام ClickHouse كقاعدة بيانات سلاسل زمنية؟",
      description: "صفحة تصف كيفية استخدام ClickHouse كقاعدة بيانات سلاسل زمنية",
      href: "/resources/support-center/knowledge-base/general-faqs/time-series",
      category: "عام والأسئلة الشائعة",
      tags: []
    },
    {
      id: "queries-sql/pivot",
      title: "هل يمكن استخدام PIVOT في ClickHouse؟",
      description:
        "لا يحتوي ClickHouse على عبارة PIVOT، لكن يمكننا محاكاة هذه الوظيفة باستخدام مجمّعات دوال التجميع. لنرَ كيفية القيام بذلك باستخدام مجموعة بيانات أسعار المساكن في المملكة المتحدة.",
      href: "/resources/support-center/knowledge-base/queries-sql/pivot",
      category: "الاستعلامات وSQL",
      tags: ["نمذجة البيانات", "Core Data Concepts"]
    },
    {
      id: "general-faqs/vector-search",
      title: "هل يمكن استخدام ClickHouse للبحث المتجهي؟",
      description: "تعرّف على كيفية استخدام ClickHouse للبحث المتجهي، بما في ذلك تخزين التضمينات والبحث باستخدام دوال المسافة مثل تشابه جيب التمام.",
      href: "/resources/support-center/knowledge-base/general-faqs/vector-search",
      category: "عام والأسئلة الشائعة",
      tags: ["حالات الاستخدام", "Concepts"]
    },
    {
      id: "monitoring-debugging/send-logs-level",
      title: "التقاط سجلات الخادم للاستعلامات على مستوى العميل",
      description: "تعرّف على كيفية التقاط سجلات الخادم على مستوى العميل، حتى مع إعدادات سجل مختلفة، باستخدام إعداد العميل `send_logs_level`.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/send-logs-level",
      category: "المراقبة وتصحيح الأخطاء",
      tags: ["Server Admin"]
    },
    {
      id: "configuration-settings/change-the-prompt-in-clickhouse-client",
      title: "تغيير موجّه الأوامر في clickhouse-client",
      description: "تشرح هذه المقالة كيفية تغيير موجّه الأوامر في عميل ClickHouse ونافذة طرفية clickhouse-local من :) إلى بادئة متبوعة بـ :)",
      href: "/resources/support-center/knowledge-base/configuration-settings/change-the-prompt-in-clickhouse-client",
      category: "الإعدادات والتهيئة",
      tags: ["الإعدادات", "Native Clients and Interfaces"]
    },
    {
      id: "security/common-rbac-queries",
      title: "استعلامات RBAC الشائعة",
      description: "استعلامات تساعد في منح أذونات محددة للمستخدمين.",
      href: "/resources/support-center/knowledge-base/security/common-rbac-queries",
      category: "الأمان والتحكم في الوصول",
      tags: ["الأمان والمصادقة", "Managing Cloud"]
    },
    {
      id: "queries-sql/comparing-metrics-between-queries",
      title: "مقارنة المقاييس بين الاستعلامات بالديسيبل",
      description: "استعلام لمقارنة المقاييس بين استعلامين في ClickHouse.",
      href: "/resources/support-center/knowledge-base/queries-sql/comparing-metrics-between-queries",
      category: "الاستعلامات وSQL",
      tags: ["الأداء والتحسينات"]
    },
    {
      id: "configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "Configuring CAP_IPC_LOCK and CAP_SYS_NICE Capabilities in Docker",
      description: "Learn how to resolve Docker capability warnings for `CAP_IPC_LOCK` and `CAP_SYS_NICE` when running ClickHouse in a container.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "التهيئة والإعدادات",
      tags: ["الأخطاء والاستثناءات"]
    },
    {
      id: "troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "تهيئة صلاحيتَي CAP_IPC_LOCK وCAP_SYS_NICE في Docker",
      description: "تعرّف على كيفية حل تحذيرات صلاحيات Docker الخاصة بـ `CAP_IPC_LOCK` و`CAP_SYS_NICE` عند تشغيل ClickHouse داخل حاوية.",
      href: "/resources/support-center/knowledge-base/troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "استكشاف الأخطاء وإصلاحها",
      tags: ["الأخطاء والاستثناءات"]
    },
    {
      id: "cloud-services/custom-dns-alias-for-instance",
      title: "Create a custom DNS alias by setting up a reverse proxy",
      description: "Learn how to set up a custom DNS alias for your instance using a reverse proxy",
      href: "/resources/support-center/knowledge-base/cloud-services/custom-dns-alias-for-instance",
      category: "Cloud",
      tags: ["إدارة الخادم", "الأمان والمصادقة"]
    },
    {
      id: "troubleshooting/part-intersects-previous-part",
      title: "DB::Exception: Part XXXXX intersects previous part YYYYY. It is a bug or a result of manual intervention in the ZooKeeper data.",
      description:
        "This article explains how to resolve the DB::Exception error related to intersecting parts in ClickHouse, often caused by a race condition or manual intervention in the ZooKeeper data.",
      href: "/resources/support-center/knowledge-base/troubleshooting/part-intersects-previous-part",
      category: "استكشاف الأخطاء وإصلاحها",
      tags: ["الأخطاء والاستثناءات", "جداول النظام"]
    },
    {
      id: "setup-installation/difference-between-official-builds-and-3rd-party",
      title: "Differences Between Official and 3rd-Party ClickHouse Builds",
      description: "Understand the key differences between official ClickHouse builds and 3rd-party builds, including updates, compatibility, and security considerations.",
      href: "/resources/support-center/knowledge-base/setup-installation/difference-between-official-builds-and-3rd-party",
      category: "الإعداد والتثبيت",
      tags: ["المفاهيم"]
    },
    {
      id: "general-faqs/cost-based",
      title: "Does ClickHouse have a cost-based optimizer",
      description: "ClickHouse has certain cost-based optimization mechanics",
      href: "/resources/support-center/knowledge-base/general-faqs/cost-based",
      category: "عام وأسئلة شائعة",
      tags: []
    },
    {
      id: "general-faqs/datalake",
      title: "Does ClickHouse support data lakes?",
      description: "ClickHouse supports data lakes, including Iceberg, Delta Lake, Apache Hudi, Apache Paimon, Hive",
      href: "/resources/support-center/knowledge-base/general-faqs/datalake",
      category: "عام وأسئلة شائعة",
      tags: []
    },
    {
      id: "general-faqs/distributed-join",
      title: "Does ClickHouse support distributed JOIN?",
      description: "ClickHouse supports distributed JOIN",
      href: "/resources/support-center/knowledge-base/general-faqs/distributed-join",
      category: "عام وأسئلة شائعة",
      tags: []
    },
    {
      id: "general-faqs/federated",
      title: "Does ClickHouse support federated queries?",
      description: "ClickHouse supports a wide range for federated and hybrid queries",
      href: "/resources/support-center/knowledge-base/general-faqs/federated",
      category: "عام وأسئلة شائعة",
      tags: []
    },
    {
      id: "general-faqs/concurrency",
      title: "Does ClickHouse support frequent, concurrent queries?",
      description: "ClickHouse supports high QPS and high concurrency",
      href: "/resources/support-center/knowledge-base/general-faqs/concurrency",
      category: "عام وأسئلة شائعة",
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
      category: "عام وأسئلة شائعة",
      tags: []
    },
    {
      id: "security/row-column-policy",
      title: "Does ClickHouse support row-level and column-level security?",
      description: "Learn about row-level and column-level access restrictions in ClickHouse and ClickHouse Cloud, and how to implement role-based access control (RBAC) with policies.",
      href: "/resources/support-center/knowledge-base/security/row-column-policy",
      category: "الأمان والتحكم في الوصول",
      tags: ["الأمان والمصادقة"]
    },
    {
      id: "cloud-services/execute-system-queries-in-cloud",
      title: "Execute SYSTEM Statements on All Nodes in ClickHouse Cloud",
      description: "Learn how to use `ON CLUSTER` and `clusterAllReplicas` to execute SYSTEM statements and queries across all nodes in a ClickHouse Cloud service.",
      href: "/resources/support-center/knowledge-base/cloud-services/execute-system-queries-in-cloud",
      category: "Cloud",
      tags: ["النشر والتوسع"]
    },
    {
      id: "troubleshooting/count-parts-by-type",
      title: "Find counts and sizes of wide or compact parts",
      description: "This knowledgebase article shows you how to find part counts by the type of part - wide or compact.",
      href: "/resources/support-center/knowledge-base/troubleshooting/count-parts-by-type",
      category: "استكشاف الأخطاء وإصلاحها",
      tags: ["استكشاف الأخطاء وإصلاحها"]
    },
    {
      id: "troubleshooting/fix-developer-verification-error-in-macos",
      title: "Fix the Developer Verification Error in MacOS",
      description: "Learn how to resolve the MacOS developer verification error when running ClickHouse commands, using either System Settings or the terminal.",
      href: "/resources/support-center/knowledge-base/troubleshooting/fix-developer-verification-error-in-macos",
      category: "استكشاف الأخطاء وإصلاحها",
      tags: ["الأخطاء والاستثناءات"]
    },
    {
      id: "data-import-export/s3-export-data-year-month-folders",
      title: "How can I do partitioned writes by year and month on S3?",
      description: "Learn how to write partitioned data by year and month to an S3 bucket in ClickHouse, using a custom path structure for organizing the data.",
      href: "/resources/support-center/knowledge-base/data-import-export/s3-export-data-year-month-folders",
      category: "استيراد البيانات وتصديرها",
      tags: ["تصدير البيانات", "العملاء والواجهات الأصلية"]
    },
    {
      id: "data-import-export/kafka-clickhouse-json",
      title: "How can I use the new JSON Data Type with Kafka?",
      description: "Learn how to load JSON messages from Apache Kafka directly into a single JSON column in ClickHouse using the Kafka table engine and JSON data type.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-clickhouse-json",
      category: "استيراد البيانات وتصديرها",
      tags: ["تنسيقات البيانات", "استيعاب البيانات"]
    },
    {
      id: "cloud-services/change-billing-email",
      title: "How do I change my Billing Contact in ClickHouse Cloud?",
      description: "Let's learn how to change your billing address in ClickHouse Cloud.",
      href: "/resources/support-center/knowledge-base/cloud-services/change-billing-email",
      category: "Cloud",
      tags: ["إدارة Cloud"]
    },
    {
      id: "general-faqs/how-do-i-contribute-code-to-clickhouse",
      title: "How do I contribute code to ClickHouse?",
      description: "ClickHouse مشروع مفتوح المصدر يُطوَّر على GitHub. وفق المعتاد، تُنشر تعليمات المساهمة في ملف CONTRIBUTING الموجود في جذر مستودع الكود المصدري.",
      href: "/resources/support-center/knowledge-base/general-faqs/how-do-i-contribute-code-to-clickhouse",
      category: "عام والأسئلة الشائعة",
      tags: ["Community"]
    },
    {
      id: "data-import-export/parquet-to-csv-json",
      title: "كيف أحوّل الملفات من Parquet إلى CSV أو JSON؟",
      description: "تعرّف على كيفية استخدام أداة `clickhouse-local` في ClickHouse لتحويل ملفات Parquet بسهولة إلى صيغتَي CSV أو JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/parquet-to-csv-json",
      category: "استيراد البيانات وتصديرها",
      tags: ["Data Sources", "Data Formats"]
    },
    {
      id: "data-import-export/mysql-to-parquet-csv-json",
      title: "كيف أصدّر بيانات MySQL إلى Parquet أو CSV أو JSON باستخدام ClickHouse؟",
      description: "تعرّف على كيفية استخدام أداة `clickhouse-local` لتصدير بيانات MySQL إلى صيغ مثل Parquet أو CSV أو JSON بسرعة وكفاءة.",
      href: "/resources/support-center/knowledge-base/data-import-export/mysql-to-parquet-csv-json",
      category: "استيراد البيانات وتصديرها",
      tags: ["Data Formats", "Data Export"]
    },
    {
      id: "data-import-export/postgresql-to-parquet-csv-json",
      title: "كيف أصدّر بيانات PostgreSQL إلى Parquet أو CSV أو JSON؟",
      description: "تعرّف على كيفية تصدير بيانات PostgreSQL إلى صيغ Parquet أو CSV أو JSON باستخدام `clickhouse-local` مع أمثلة متنوعة.",
      href: "/resources/support-center/knowledge-base/data-import-export/postgresql-to-parquet-csv-json",
      category: "استيراد البيانات وتصديرها",
      tags: ["Data Export", "Data Formats"]
    },
    {
      id: "setup-installation/install-clickhouse-windows10",
      title: "كيف أثبّت ClickHouse على Windows 10؟",
      description: "تعرّف على كيفية تثبيت ClickHouse واختباره على Windows 10 باستخدام WSL 2. يشمل الإعداد واستكشاف الأخطاء وتشغيل بيئة اختبار.",
      href: "/resources/support-center/knowledge-base/setup-installation/install-clickhouse-windows10",
      category: "الإعداد والتثبيت",
      tags: ["Tools and Utilities"]
    },
    {
      id: "security/remove-default-user",
      title: "كيف أحذف المستخدم الافتراضي؟",
      description: "تعرّف على كيفية حذف المستخدم الافتراضي عند تشغيل ClickHouse Server.",
      href: "/resources/support-center/knowledge-base/security/remove-default-user",
      category: "الأمان والتحكم في الوصول",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/ingest-failures-23-9-release",
      title: "كيف أحلّ أخطاء الاستيعاب بعد إصدار ClickHouse 23.9؟",
      description: "تعرّف على كيفية حلّ أخطاء الاستيعاب الناجمة عن التحقق الأكثر صرامة من الصلاحيات الذي أُدخل في ClickHouse 23.9 للجداول التي تستخدم `async_inserts`. حدّث الصلاحيات لإصلاح الأخطاء.",
      href: "/resources/support-center/knowledge-base/cloud-services/ingest-failures-23-9-release",
      category: "السحابة",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "performance-optimization/insert-select-settings-tuning",
      title: "كيف أحلّ خطأ TOO MANY PARTS أثناء INSERT...SELECT؟",
      description: "حلّ خطأ TOO_MANY_PARTS في ClickHouse أثناء `INSERT...SELECT` عن طريق ضبط الإعدادات المتقدمة لكتل أكبر وزيادة حدود الأقسام.",
      href: "/resources/support-center/knowledge-base/performance-optimization/insert-select-settings-tuning",
      category: "الأداء والتحسين",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "integrations/node-js-example",
      title: "كيف أستخدم NodeJS مع @clickhouse/client؟",
      description: "تعرّف على كيفية استخدام @clickhouse/client في تطبيق Node.js للتفاعل مع ClickHouse وتنفيذ الاستعلامات.",
      href: "/resources/support-center/knowledge-base/integrations/node-js-example",
      category: "التكاملات ومكتبات العملاء",
      tags: ["Language Clients"]
    },
    {
      id: "monitoring-debugging/view-number-of-active-mutations",
      title: "كيف أعرض عدد التحولات النشطة أو المنتظرة في قائمة الانتظار؟",
      description:
        "راقب عدد التحولات النشطة أو المنتظرة في ClickHouse، خاصةً عند تنفيذ عمليات `ALTER` أو `UPDATE`. استخدم جدول `system.mutations` لتتبع التحولات.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/view-number-of-active-mutations",
      category: "المراقبة وتصحيح الأخطاء",
      tags: ["System Tables"]
    },
    {
      id: "data-management/read-consistency",
      title: "كيف أحقق اتساق قراءة البيانات في ClickHouse؟",
      description: "تعرّف على كيفية ضمان اتساق البيانات عند القراءة من ClickHouse، سواء كنت متصلاً بالعقدة نفسها أو بعقدة عشوائية.",
      href: "/resources/support-center/knowledge-base/data-management/read-consistency",
      category: "إدارة البيانات",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "setup-installation/llvm-clang-up-to-date",
      title: "كيف أبني LLVM وclang على Linux؟",
      description: "أوامر لبناء LLVM وclang على Linux.",
      href: "/resources/support-center/knowledge-base/setup-installation/llvm-clang-up-to-date",
      category: "الإعداد والتثبيت",
      tags: ["Community", "Tools and Utilities"]
    },
    {
      id: "data-management/calculate-ratio-of-zero-sparse-serialization",
      title: "كيف أحسب نسبة القيم الفارغة/الصفرية في كل عمود في جدول؟",
      description: "تعرّف على كيفية حساب نسبة القيم الفارغة أو الصفرية في كل عمود من جدول ClickHouse لتحسين التسلسل المتفرق للأعمدة.",
      href: "/resources/support-center/knowledge-base/data-management/calculate-ratio-of-zero-sparse-serialization",
      category: "إدارة البيانات",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "security/check-users-roles",
      title: "كيف أتحقق من المستخدمين المعيّنين للأدوار والعكس؟",
      description: "تعرّف على كيفية الاستعلام عن `system.role_grants` في ClickHouse للعثور على المستخدمين المعيّنين للأدوار والأدوار المعيّنة لمستخدمين محددين.",
      href: "/resources/support-center/knowledge-base/security/check-users-roles",
      category: "الأمان والتحكم في الوصول",
      tags: ["Server Admin", "System Tables", "Managing Cloud"]
    },
    {
      id: "monitoring-debugging/which-processes-are-currently-running",
      title: "كيف أتحقق من الكود الذي يعمل حالياً على الخادم؟",
      description:
        "يوفر ClickHouse أدوات استبطان مثل `system.stack_trace` لفحص الكود الذي يعمل حالياً على كل خيط من خيوط الخادم، مما يساعد في تصحيح الأخطاء ومراقبة الأداء.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/which-processes-are-currently-running",
      category: "المراقبة وتصحيح الأخطاء",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      title: "كيف أتحقق من حالة خدمة ClickHouse Cloud؟",
      description: "تعرّف على كيفية استخدام واجهة برمجة تطبيقات ClickHouse Cloud للتحقق مما إذا كانت خدمتك متوقفة أو خاملة أو تعمل دون تنشيطها.",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      category: "السحابة",
      tags: ["Managing Cloud"]
    },
    {
      id: "configuration-settings/configure-a-user-setting",
      title: "كيف أضبط الإعدادات لمستخدم في ClickHouse؟",
      description: "تعرّف على كيفية تعريف الإعدادات في ClickHouse للاستعلامات الفردية أو جلسات العميل أو مستخدمين محددين باستخدام أوامر `SET` و`ALTER USER`.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-a-user-setting",
      category: "التهيئة والإعدادات",
      tags: ["Settings"]
    },
    {
      id: "materialized-views/projection-example",
      title: "كيف أتأكد من استخدام الإسقاط في الاستعلام؟",
      description: "تعرّف على كيفية التحقق من استخدام الإسقاط في استعلامات ClickHouse عن طريق الاختبار ببيانات نموذجية واستخدام EXPLAIN للتحقق من استخدام الإسقاط.",
      href: "/resources/support-center/knowledge-base/materialized-views/projection-example",
      category: "المشاهدات المادية والإسقاطات",
      tags: ["Data Modelling"]
    },
    {
      id: "cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      title: "كيف أتصل بـ ClickHouse باستخدام مفاتيح SSH؟",
      description: "كيفية الاتصال بـ ClickHouse وClickHouse Cloud باستخدام مفاتيح SSH",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      category: "السحابة",
      tags: ["إدارة Cloud", "الأمان والمصادقة"]
    },
    {
      id: "data-management/dictionary-using-strings",
      title: "كيفية إنشاء قاموس ClickHouse بمفاتيح وقيم نصية",
      description: "تعرّف على كيفية إنشاء قاموس ClickHouse باستخدام مفاتيح وقيم نصية من جدول MergeTree كمصدر للبيانات، مع أمثلة على الإعداد والاستخدام.",
      href: "/resources/support-center/knowledge-base/data-management/dictionary-using-strings",
      category: "إدارة البيانات",
      tags: ["نمذجة البيانات"]
    },
    {
      id: "tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      title: "كيفية إنشاء جدول يستطيع الاستعلام من مجموعات عناقيد بعيدة متعددة",
      description: "كيفية إنشاء جدول يستطيع الاستعلام من مجموعات عناقيد بعيدة متعددة",
      href: "/resources/support-center/knowledge-base/tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      category: "الجداول والمخطط",
      tags: ["النشر والتوسع"]
    },
    {
      id: "setup-installation/enabling-ssl-with-lets-encrypt",
      title: "كيفية تفعيل SSL باستخدام Let's Encrypt على خادم ClickHouse مستقل",
      description: "تعرّف على كيفية إعداد SSL لخادم ClickHouse مستقل باستخدام Let's Encrypt، بما في ذلك إصدار الشهادات والتهيئة والتحقق منها.",
      href: "/resources/support-center/knowledge-base/setup-installation/enabling-ssl-with-lets-encrypt",
      category: "الإعداد والتثبيت",
      tags: ["الأمان والمصادقة"]
    },
    {
      id: "data-import-export/file-export",
      title: "كيفية تصدير البيانات من ClickHouse إلى ملف",
      description: "تعرّف على الطرق المختلفة لتصدير البيانات من ClickHouse، بما في ذلك `INTO OUTFILE` ومحرك جدول File وإعادة توجيه سطر الأوامر.",
      href: "/resources/support-center/knowledge-base/data-import-export/file-export",
      category: "استيراد البيانات وتصديرها",
      tags: ["تصدير البيانات"]
    },
    {
      id: "queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      title: "كيفية تصفية جدول ClickHouse باستخدام عمود من نوع Array؟",
      description: "مقالة في قاعدة المعرفة حول كيفية تصفية جدول ClickHouse باستخدام عمود من نوع Array.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      category: "الاستعلامات وSQL",
      tags: ["نمذجة البيانات", "الدوال"]
    },
    {
      id: "monitoring-debugging/generate-har-file",
      title: "كيفية إنشاء ملف HAR لفريق الدعم التقني",
      description: "يرصد ملف HAR (HTTP Archive) نشاط الشبكة في متصفحك، ويمكّن فريق الدعم من تشخيص بطء تحميل الصفحات والطلبات الفاشلة وغيرها من مشكلات الشبكة.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/generate-har-file",
      category: "المراقبة وتصحيح الأخطاء",
      tags: ["الأدوات والمرافق"]
    },
    {
      id: "materialized-views/how-to-display-queries-using-mv",
      title: "كيفية تحديد الاستعلامات التي تستخدم المشاهدات المادية في ClickHouse",
      description: "تعرّف على كيفية الاستعلام من سجلات ClickHouse لتحديد جميع الاستعلامات التي تتضمن مشاهدات مادية ضمن نطاق زمني محدد.",
      href: "/resources/support-center/knowledge-base/materialized-views/how-to-display-queries-using-mv",
      category: "المشاهدات المادية والإسقاطات",
      tags: ["جداول النظام"]
    },
    {
      id: "performance-optimization/find-expensive-queries",
      title: "كيفية تحديد أكثر الاستعلامات استهلاكاً للموارد في ClickHouse",
      description: "تعرّف على كيفية استخدام جدول `query_log` في ClickHouse لتحديد الاستعلامات الأكثر استهلاكاً للذاكرة ووحدة المعالجة المركزية عبر العقد الموزعة.",
      href: "/resources/support-center/knowledge-base/performance-optimization/find-expensive-queries",
      category: "الأداء والتحسين",
      tags: ["الأداء والتحسينات"]
    },
    {
      id: "configuration-settings/ignoring-incorrect-settings",
      title: "كيفية تجاهل الإعدادات غير الصحيحة في ClickHouse",
      description: "تعرّف على كيفية استخدام خيار `skip_check_for_incorrect_settings` للسماح لـ ClickHouse بالتشغيل حتى عند تحديد إعدادات مستوى المستخدم بشكل غير صحيح.",
      href: "/resources/support-center/knowledge-base/configuration-settings/ignoring-incorrect-settings",
      category: "التهيئة والإعدادات",
      tags: ["الإعدادات"]
    },
    {
      id: "data-import-export/json-import",
      title: "كيفية استيراد JSON إلى ClickHouse؟",
      description: "توضح هذه الصفحة كيفية استيراد JSON إلى ClickHouse",
      href: "/resources/support-center/knowledge-base/data-import-export/json-import",
      category: "استيراد البيانات وتصديرها",
      tags: []
    },
    {
      id: "setup-installation/how-to-increase-thread-pool-size",
      title: "كيفية زيادة عدد الخيوط في ClickHouse",
      description: "تعرّف على كيفية تهيئة مجموعة الخيوط العامة في ClickHouse عبر ضبط إعدادات مثل `max_thread_pool_size` و`thread_pool_queue_size` و`max_thread_pool_free_size`.",
      href: "/resources/support-center/knowledge-base/setup-installation/how-to-increase-thread-pool-size",
      category: "الإعداد والتثبيت",
      tags: ["الأداء والتحسينات"]
    },
    {
      id: "data-import-export/kafka-to-clickhouse-setup",
      title: "كيفية استيعاب البيانات من Kafka إلى ClickHouse",
      description: "تعرّف على كيفية استيعاب البيانات من موضوع Kafka إلى ClickHouse باستخدام محرك جدول Kafka والمشاهدات المادية وجداول MergeTree.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-to-clickhouse-setup",
      category: "استيراد البيانات وتصديرها",
      tags: ["استيعاب البيانات"]
    },
    {
      id: "data-import-export/ingest-parquet-files-in-s3",
      title: "كيفية استيعاب ملفات Parquet من حاوية S3",
      description: "تعرّف على أساسيات استخدام محرك جدول S3 في ClickHouse لاستيعاب ملفات Parquet والاستعلام عنها من حاوية S3، بما في ذلك الإعداد وأذونات الوصول وأمثلة على استيراد البيانات.",
      href: "/resources/support-center/knowledge-base/data-import-export/ingest-parquet-files-in-s3",
      category: "استيراد البيانات وتصديرها",
      tags: ["استيعاب البيانات"]
    },
    {
      id: "queries-sql/how-to-insert-all-rows-from-another-table",
      title: "كيفية إدراج جميع الصفوف من جدول إلى آخر؟",
      description: "مقالة في قاعدة المعرفة حول كيفية إدراج جميع الصفوف من جدول إلى آخر.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-insert-all-rows-from-another-table",
      category: "الاستعلامات وSQL",
      tags: ["استيعاب البيانات"]
    },
    {
      id: "performance-optimization/check-query-processing-time-only",
      title: "كيفية قياس وقت معالجة الاستعلام دون إرجاع صفوف",
      description: "تعرّف على كيفية استخدام خيار `FORMAT Null` في ClickHouse لقياس وقت معالجة الاستعلام دون إرجاع أي صفوف إلى العميل.",
      href: "/resources/support-center/knowledge-base/performance-optimization/check-query-processing-time-only",
      category: "الأداء والتحسين",
      tags: ["الأداء والتحسينات"]
    },
    {
      id: "monitoring-debugging/outputSendLogsLevelTracesToFile",
      title: "كيفية إخراج تتبعات مستوى إرسال السجلات إلى ملف باستخدام clickhouse-client",
      description: "كيفية إخراج تتبعات مستوى إرسال السجلات إلى ملف باستخدام clickhouse-client",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/outputSendLogsLevelTracesToFile",
      category: "المراقبة وتصحيح الأخطاء",
      tags: ["تصدير البيانات"]
    },
    {
      id: "tables-schema/recreate-table-across-terminals",
      title: "كيفية إعادة إنشاء جدول صغير بسرعة عبر محطات طرفية مختلفة",
      description: "تعرّف على كيفية إعادة إنشاء جدول صغير وبياناته بسرعة عبر محطات طرفية مختلفة باستخدام النسخ واللصق في بيئات التطوير.",
      href: "/resources/support-center/knowledge-base/tables-schema/recreate-table-across-terminals",
      category: "الجداول والمخطط",
      tags: ["الأدوات والمرافق"]
    },
    {
      id: "integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      title: "كيفية إعداد ClickHouse على Docker باستخدام ODBC للاتصال بقاعدة بيانات Microsoft SQL Server (MSSQL)",
      description: "كيفية إعداد ClickHouse على Docker باستخدام ODBC للاتصال بقاعدة بيانات Microsoft SQL Server (MSSQL)",
      href: "/resources/support-center/knowledge-base/integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      category: "التكاملات ومكتبات العملاء",
      tags: ["العملاء والواجهات الأصلية"]
    },
    {
      id: "queries-sql/using-array-join-to-extract-and-query-attributes",
      title: "كيفية استخدام array join لاستخراج الخصائص المتغيرة والاستعلام عنها باستخدام مفاتيح وقيم Map",
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
      description: "تعرّف على كيفية استيراد ملفات GeoJSON التي تحتوي على مصفوفات كائنات متداخلة بعمق إلى ClickHouse والاستعلام عن بيانات الميزات المتداخلة.",
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
      title: "مثال سريع على Python باستخدام وحدة طلبات HTTP",
      description: "مثال باستخدام Python ووحدة الطلبات للكتابة والقراءة إلى ClickHouse",
      href: "/resources/support-center/knowledge-base/integrations/python-http-requests",
      category: "التكاملات ومكتبات العملاء",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "configuration-settings/maximum-number-of-tables-and-databases",
      title: "الحد الأقصى الموصى به لقواعد البيانات والجداول والأقسام والأجزاء في ClickHouse",
      description: "تعرّف على الحدود القصوى الموصى بها لقواعد البيانات والجداول والأقسام والأجزاء في مجموعة ClickHouse لضمان الأداء الأمثل.",
      href: "/resources/support-center/knowledge-base/configuration-settings/maximum-number-of-tables-and-databases",
      category: "الإعدادات والتكوين",
      tags: ["Performance and Optimizations", "Deployments and Scaling"]
    },
    {
      id: "data-import-export/cannot-append-data-to-parquet-format",
      title: 'حل خطأ "Cannot Append Data in Parquet Format" في ClickHouse',
      description: 'هل تواجه خطأ "Cannot append data in format Parquet to file" في ClickHouse؟ دعنا نلقي نظرة على كيفية حله.',
      href: "/resources/support-center/knowledge-base/data-import-export/cannot-append-data-to-parquet-format",
      category: "استيراد وتصدير البيانات",
      tags: ["Errors and Exceptions", "Data Formats"]
    },
    {
      id: "troubleshooting/exception-too-many-parts",
      title: 'حل خطأ "Too Many Parts" في ClickHouse',
      description: 'تعرّف على كيفية معالجة خطأ "Too many parts" في ClickHouse عن طريق تحسين معدلات الإدراج وتكوين إعدادات MergeTree وإدارة الأقسام بفعالية.',
      href: "/resources/support-center/knowledge-base/troubleshooting/exception-too-many-parts",
      category: "استكشاف الأخطاء وإصلاحها",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "troubleshooting/certificate-verify-failed-error",
      title: "حل خطأ التحقق من شهادة SSL في ClickHouse",
      description: "تعرّف على كيفية حل خطأ SSL Exception CERTIFICATE_VERIFY_FAILED.",
      href: "/resources/support-center/knowledge-base/troubleshooting/certificate-verify-failed-error",
      category: "استكشاف الأخطاء وإصلاحها",
      tags: ["Security and Authentication", "Errors and Exceptions"]
    },
    {
      id: "troubleshooting/connection-timeout-remote-remoteSecure",
      title: "حل أخطاء انتهاء المهلة مع دوال الجدول `remote` و`remoteSecure`",
      description: "تعرّف على كيفية إصلاح أخطاء انتهاء المهلة عند استخدام دوال الجدول `remote` أو `remoteSecure` في ClickHouse عن طريق ضبط إعدادات مهلة الاتصال.",
      href: "/resources/support-center/knowledge-base/troubleshooting/connection-timeout-remote-remoteSecure",
      category: "استكشاف الأخطاء وإصلاحها",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "tables-schema/search-across-node-for-tables-with-a-wildcard",
      title: "البحث عبر العقد عن الجداول باستخدام حرف بدل",
      description: "تعرّف على كيفية البحث عبر العقد عن الجداول باستخدام حرف بدل.",
      href: "/resources/support-center/knowledge-base/tables-schema/search-across-node-for-tables-with-a-wildcard",
      category: "الجداول والمخطط",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "performance-optimization/query-max-execution-time",
      title: "تعيين حد لوقت تنفيذ الاستعلام",
      description: "كيفية فرض حد على الحد الأقصى لوقت تنفيذ الاستعلام",
      href: "/resources/support-center/knowledge-base/performance-optimization/query-max-execution-time",
      category: "الأداء والتحسين",
      tags: ["Managing Cloud", "Settings"]
    },
    {
      id: "data-import-export/json-simple-example",
      title: "مثال بسيط لاستخراج بيانات JSON باستخدام جدول هبوط مع طريقة عرض مادية",
      description: "مثال بسيط لاستخراج بيانات JSON باستخدام جدول هبوط مع طريقة عرض مادية",
      href: "/resources/support-center/knowledge-base/data-import-export/json-simple-example",
      category: "استيراد وتصدير البيانات",
      tags: ["Data Formats"]
    },
    {
      id: "performance-optimization/async-vs-optimize-read-in-order",
      title: "قراءة البيانات بشكل متزامن",
      description:
        "يتيح الإعداد الجديد `allow_asynchronous_read_from_io_pool_for_merge_tree` أن يكون عدد خيوط القراءة (التدفقات) أعلى من عدد الخيوط في بقية خط أنابيب تنفيذ الاستعلام.",
      href: "/resources/support-center/knowledge-base/performance-optimization/async-vs-optimize-read-in-order",
      category: "الأداء والتحسين",
      tags: ["Settings", "Performance and Optimizations"]
    },
    {
      id: "integrations/terraform-example",
      title: "مثال على Terraform لكيفية استخدام Cloud API",
      description: "يغطي هذا مثالاً على كيفية استخدام terraform لإنشاء/حذف المجموعات باستخدام API",
      href: "/resources/support-center/knowledge-base/integrations/terraform-example",
      category: "التكاملات ومكتبات العملاء",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      title: "نصائح وحيل لتحسين أنواع البيانات الأساسية في ClickHouse",
      description: "نصائح وحيل لتحسين أنواع البيانات الأساسية في ClickHouse",
      href: "/resources/support-center/knowledge-base/performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      category: "الأداء والتحسين",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "queries-sql/useful-queries-for-troubleshooting",
      title: "استعلامات مفيدة لاستكشاف الأخطاء وإصلاحها",
      description: "مجموعة من الاستعلامات المفيدة لاستكشاف أخطاء ClickHouse وإصلاحها، بما في ذلك مراقبة أحجام الجداول والاستعلامات طويلة الأمد والأخطاء.",
      href: "/resources/support-center/knowledge-base/queries-sql/useful-queries-for-troubleshooting",
      category: "الاستعلامات وSQL",
      tags: ["Settings"]
    },
    {
      id: "general-faqs/use-clickhouse-for-log-analytics",
      title: "استخدام ClickHouse لتحليلات السجلات",
      description: "يحظى ClickHouse بشعبية لتحليل السجلات والمقاييس بسبب إمكانات التحليلات في الوقت الفعلي المقدمة. هل أنت مستعد لمعرفة المزيد؟",
      href: "/resources/support-center/knowledge-base/general-faqs/use-clickhouse-for-log-analytics",
      category: "عام والأسئلة الشائعة",
      tags: ["Use Cases"]
    },
    {
      id: "queries-sql/filtered-aggregates",
      title: "استخدام التجميعات المفلترة في ClickHouse",
      description: "تعرّف على كيفية استخدام التجميعات المفلترة في ClickHouse مع مجمّعات `-If` و`-Distinct` لتبسيط بناء جملة الاستعلام وتحسين التحليلات.",
      href: "/resources/support-center/knowledge-base/queries-sql/filtered-aggregates",
      category: "الاستعلامات وSQL",
      tags: ["Functions"]
    },
    {
      id: "general-faqs/dependencies",
      title: "ما هي تبعيات الطرف الثالث لتشغيل ClickHouse؟",
      description: "ClickHouse مكتفٍ بذاته وليس لديه تبعيات وقت التشغيل",
      href: "/resources/support-center/knowledge-base/general-faqs/dependencies",
      category: "عام والأسئلة الشائعة",
      tags: []
    },
    {
      id: "general-faqs/dbms-naming",
      title: 'ماذا تعني كلمة "ClickHouse"؟',
      description: 'تعرّف على ماذا تعني كلمة "ClickHouse"؟',
      href: "/resources/support-center/knowledge-base/general-faqs/dbms-naming",
      category: "عام والأسئلة الشائعة",
      tags: []
    },
    {
      id: "general-faqs/ne-tormozit",
      title: "ماذا تعني عبارة "не тормозит"؟",
      description: 'تشرح هذه الصفحة معنى "Не тормозит"',
      href: "/resources/support-center/knowledge-base/general-faqs/ne-tormozit",
      category: "عام والأسئلة الشائعة",
      tags: []
    },
    {
      id: "integrations/oracle-odbc",
      title: "ماذا أفعل إذا واجهت مشكلة في الترميزات عند استخدام Oracle عبر ODBC؟",
      description: "توفر هذه الصفحة إرشادات حول ما يجب فعله إذا واجهت مشكلة في الترميزات عند استخدام Oracle عبر ODBC",
      href: "/resources/support-center/knowledge-base/integrations/oracle-odbc",
      category: "التكاملات ومكتبات العملاء",
      tags: []
    },
    {
      id: "general-faqs/columnar-database",
      title: "ما هي قاعدة البيانات العمودية؟",
      description: "تصف هذه الصفحة ما هي قاعدة البيانات العمودية",
      href: "/resources/support-center/knowledge-base/general-faqs/columnar-database",
      category: "عام والأسئلة الشائعة",
      tags: []
    },
    {
      id: "general-faqs/olap",
      title: "ما هو OLAP؟",
      description: "شرح لماهية المعالجة التحليلية عبر الإنترنت",
      href: "/resources/support-center/knowledge-base/general-faqs/olap",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "performance-optimization/optimize-final-vs-final",
      title: "ما الفرق بين OPTIMIZE FINAL وFINAL؟",
      description: "يناقش الفروق بين OPTIMIZE FINAL وFINAL، ومتى ينبغي استخدام كلٍّ منهما أو تجنّبه.",
      href: "/resources/support-center/knowledge-base/performance-optimization/optimize-final-vs-final",
      category: "Performance & optimization",
      tags: ["Core Data Concepts"]
    },
    {
      id: "general-faqs/sql",
      title: "ما بناء جملة SQL الذي يدعمه ClickHouse؟",
      description: "يدعم ClickHouse بناء جملة SQL بالكامل",
      href: "/resources/support-center/knowledge-base/general-faqs/sql",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/when-is-ttl-applied",
      title: "متى تُطبَّق قواعد TTL، وهل يمكننا التحكّم في ذلك؟",
      description:
        "تُطبَّق قواعد TTL في ClickHouse في وقت لاحق، ويمكنك التحكّم في وقت تنفيذها باستخدام الإعداد `merge_with_ttl_timeout`. تعرّف على كيفية فرض تطبيق قواعد TTL وإدارة الخيوط الخلفية المخصّصة لتنفيذها.",
      href: "/resources/support-center/knowledge-base/data-management/when-is-ttl-applied",
      category: "Data management",
      tags: ["Core Data Concepts"]
    },
    {
      id: "setup-installation/production",
      title: "أي إصدار من ClickHouse ينبغي استخدامه في بيئة الإنتاج؟",
      description: "تقدّم هذه الصفحة إرشادات حول إصدار ClickHouse الذي ينبغي استخدامه في بيئة الإنتاج",
      href: "/resources/support-center/knowledge-base/setup-installation/production",
      category: "Setup & installation",
      tags: []
    },
    {
      id: "general-faqs/who-is-using-clickhouse",
      title: "من يستخدم ClickHouse؟",
      description: "توضّح هذه الصفحة من يستخدم ClickHouse",
      href: "/resources/support-center/knowledge-base/general-faqs/who-is-using-clickhouse",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/dictionaries-consistent-state",
      title: "لماذا لا يمكنني رؤية بياناتي في قاموس في ClickHouse Cloud؟",
      description: "توجد مشكلة قد تؤدي إلى عدم ظهور البيانات في القواميس مباشرةً بعد إنشائها.",
      href: "/resources/support-center/knowledge-base/data-management/dictionaries-consistent-state",
      category: "Data management",
      tags: ["Managing Cloud", "Data Modelling"]
    },
    {
      id: "general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      title: "لماذا يُوصى باستخدام ClickHouse Keeper بدلًا من ZooKeeper؟",
      description:
        "يتفوّق ClickHouse Keeper على ZooKeeper بميزات مثل تقليل استخدام مساحة القرص، وتسريع التعافي، وخفض استهلاك الذاكرة، مما يوفّر أداءً أفضل لعناقيد ClickHouse.",
      href: "/resources/support-center/knowledge-base/general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      category: "General & FAQs",
      tags: ["Core Data Concepts"]
    },
    {
      id: "monitoring-debugging/why-default-logging-verbose",
      title: "لماذا يكون تسجيل ClickHouse مفصّلًا جدًا افتراضيًا؟",
      description: "تعرّف على سبب اختيار مطوّري ClickHouse تعيين مستوى تسجيل مفصّل افتراضيًا.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/why-default-logging-verbose",
      category: "Monitoring & debugging",
      tags: ["Settings"]
    },
    {
      id: "performance-optimization/why-is-my-primary-key-not-used",
      title: "لماذا لا يُستخدَم المفتاح الأساسي؟ وكيف يمكنني التحقّق؟",
      description: "يتناول سببًا شائعًا لعدم استخدام المفتاح الأساسي في الترتيب، وكيفية التحقّق من ذلك",
      href: "/resources/support-center/knowledge-base/performance-optimization/why-is-my-primary-key-not-used",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "general-faqs/mapreduce",
      title: "لماذا لا نستخدم شيئًا مثل MapReduce؟",
      description: "تشرح هذه الصفحة سبب تفضيل ClickHouse على MapReduce",
      href: "/resources/support-center/knowledge-base/general-faqs/mapreduce",
      category: "General & FAQs",
      tags: []
    }
  ]
}