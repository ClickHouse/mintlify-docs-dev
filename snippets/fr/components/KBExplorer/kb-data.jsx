export const kbIndex = {
  categories: [
    "Cloud",
    "Configuration et paramètres",
    "Import et export de données",
    "Gestion des données",
    "Général et FAQ",
    "Intégrations et bibliothèques clientes",
    "Vues matérialisées et projections",
    "Surveillance et débogage",
    "Performance et optimisation",
    "Requêtes et SQL",
    "Sécurité et contrôle d'accès",
    "Installation et configuration",
    "Tables et schéma",
    "Dépannage et erreurs"
  ],
  tags: [
    "Bonnes pratiques",
    "Communauté",
    "Concepts",
    "Concepts fondamentaux des données",
    "Export de données",
    "Formats de données",
    "Ingestion de données",
    "Modélisation des données",
    "Sources de données",
    "Déploiements et mise à l'échelle",
    "Erreurs et exceptions",
    "Fonctions",
    "Clients de langage",
    "Gestion du Cloud",
    "Gestion des données",
    "Clients et interfaces natifs",
    "Performance et optimisations",
    "Sécurité et authentification",
    "Administration serveur",
    "Paramètres",
    "Tables système",
    "Outils et utilitaires",
    "Dépannage",
    "Cas d'usage"
  ],
  articles: [
    {
      id: "integrations/python-clickhouse-connect-example",
      title: "Exemple fonctionnel de client Python pour se connecter à ClickHouse Cloud Service",
      description: "Apprenez à vous connecter à ClickHouse Cloud Service en Python grâce à un exemple pas à pas utilisant le pilote clickhouse-connect.",
      href: "/resources/support-center/knowledge-base/integrations/python-clickhouse-connect-example",
      category: "Intégrations et bibliothèques clientes",
      tags: ["Language Clients"]
    },
    {
      id: "configuration-settings/about-quotas-and-query-complexity",
      title: "À propos des quotas et de la complexité des requêtes",
      description:
        "Les quotas et la complexité des requêtes sont des moyens efficaces de limiter et de restreindre ce que les utilisateurs peuvent faire dans ClickHouse. Cet article de la base de connaissances présente des exemples d'application de ces deux approches.",
      href: "/resources/support-center/knowledge-base/configuration-settings/about-quotas-and-query-complexity",
      category: "Configuration et paramètres",
      tags: ["Managing Cloud"]
    },
    {
      id: "data-import-export/achieving-atomic-inserts",
      title: "Insertions atomiques et cohérence multi-tables dans ClickHouse Cloud",
      description: "Comment charger des données de manière atomique et maintenir la cohérence entre plusieurs tables dans ClickHouse Cloud sans transactions multi-instructions, en utilisant des tables de transit et des opérations au niveau des partitions.",
      href: "/resources/support-center/knowledge-base/data-import-export/achieving-atomic-inserts",
      category: "Import et export de données",
      tags: ["Ingestion de données", "Best Practices"]
    },
    {
      id: "tables-schema/add-column",
      title: "Ajouter une colonne à une table",
      description: "Dans ce guide, nous allons apprendre à ajouter une colonne à une table existante.",
      href: "/resources/support-center/knowledge-base/tables-schema/add-column",
      category: "Tables et schéma",
      tags: ["Data Modelling"]
    },
    {
      id: "configuration-settings/alter-user-settings-exception",
      title: "Exception lors de la modification des paramètres utilisateur",
      description: "Gestion de l'exception levée lors de la modification des paramètres utilisateur",
      href: "/resources/support-center/knowledge-base/configuration-settings/alter-user-settings-exception",
      category: "Configuration et paramètres",
      tags: ["Paramètres", "Errors and Exceptions"]
    },
    {
      id: "materialized-views/are-materialized-views-inserted-asynchronously",
      title: "Les vues matérialisées sont-elles alimentées de manière synchrone ?",
      description: "Cet article de la base de connaissances examine si les vues matérialisées sont alimentées de manière synchrone",
      href: "/resources/support-center/knowledge-base/materialized-views/are-materialized-views-inserted-asynchronously",
      category: "Vues matérialisées et projections",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/schema-migration-tools",
      title: "Outils de migration de schéma automatisée pour ClickHouse",
      description: "Découvrez les outils de migration de schéma automatisée pour ClickHouse et comment gérer l'évolution des schémas de base de données au fil du temps.",
      href: "/resources/support-center/knowledge-base/tables-schema/schema-migration-tools",
      category: "Tables et schéma",
      tags: ["Tools and Utilities"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      title: "Configuration d'AWS PrivateLink pour exposer MSK à ClickPipes",
      description: "Étapes de configuration pour exposer un MSK privé via la connectivité multi-VPC MSK à ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      category: "Cloud",
      tags: ["Sécurité et authentification", "Managing Cloud"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-clickpipes",
      title: "Configuration d'AWS PrivateLink pour exposer un RDS privé à ClickPipes",
      description: "Étapes de configuration pour exposer un RDS privé via AWS PrivateLink à ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-clickpipes",
      category: "Cloud",
      tags: ["Sécurité et authentification", "Managing Cloud"]
    },
    {
      id: "data-management/backing-up-a-specific-partition",
      title: "Sauvegarder une partition spécifique",
      description: "Comment sauvegarder une partition spécifique dans ClickHouse ?",
      href: "/resources/support-center/knowledge-base/data-management/backing-up-a-specific-partition",
      category: "Gestion des données",
      tags: ["Managing Data"]
    },
    {
      id: "general-faqs/key-value",
      title: "Puis-je utiliser ClickHouse comme stockage clé-valeur ?",
      description: "Répond à la question fréquemment posée de savoir si ClickHouse peut être utilisé comme stockage clé-valeur.",
      href: "/resources/support-center/knowledge-base/general-faqs/key-value",
      category: "Général et FAQ",
      tags: []
    },
    {
      id: "general-faqs/time-series",
      title: "Puis-je utiliser ClickHouse comme base de données de séries temporelles ?",
      description: "Page décrivant comment utiliser ClickHouse comme base de données de séries temporelles",
      href: "/resources/support-center/knowledge-base/general-faqs/time-series",
      category: "Général et FAQ",
      tags: []
    },
    {
      id: "queries-sql/pivot",
      title: "Peut-on faire un PIVOT dans ClickHouse ?",
      description:
        "ClickHouse ne dispose pas d'une clause PIVOT, mais il est possible d'approcher cette fonctionnalité à l'aide de combinateurs de fonctions d'agrégation. Voyons comment procéder avec le jeu de données des prix de l'immobilier au Royaume-Uni.",
      href: "/resources/support-center/knowledge-base/queries-sql/pivot",
      category: "Requêtes et SQL",
      tags: ["Modélisation des données", "Core Data Concepts"]
    },
    {
      id: "general-faqs/vector-search",
      title: "Peut-on utiliser ClickHouse pour la recherche vectorielle ?",
      description: "Apprenez à utiliser ClickHouse pour la recherche vectorielle, notamment pour stocker des embeddings et effectuer des recherches avec des fonctions de distance telles que la similarité cosinus.",
      href: "/resources/support-center/knowledge-base/general-faqs/vector-search",
      category: "Général et FAQ",
      tags: ["Cas d'usage", "Concepts"]
    },
    {
      id: "monitoring-debugging/send-logs-level",
      title: "Capturer les journaux serveur des requêtes côté client",
      description: "Apprenez à capturer les journaux serveur au niveau du client, même avec des paramètres de journalisation différents, en utilisant le paramètre client `send_logs_level`.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/send-logs-level",
      category: "Surveillance et débogage",
      tags: ["Server Admin"]
    },
    {
      id: "configuration-settings/change-the-prompt-in-clickhouse-client",
      title: "Modifier l'invite dans clickhouse-client",
      description: "Cet article explique comment modifier l'invite dans votre client ClickHouse et dans la fenêtre de terminal clickhouse-local, en remplaçant :) par un préfixe suivi de :)",
      href: "/resources/support-center/knowledge-base/configuration-settings/change-the-prompt-in-clickhouse-client",
      category: "Configuration et paramètres",
      tags: ["Paramètres", "Native Clients and Interfaces"]
    },
    {
      id: "security/common-rbac-queries",
      title: "Requêtes RBAC courantes",
      description: "Requêtes permettant d'accorder des permissions spécifiques aux utilisateurs.",
      href: "/resources/support-center/knowledge-base/security/common-rbac-queries",
      category: "Sécurité et contrôle d'accès",
      tags: ["Sécurité et authentification", "Managing Cloud"]
    },
    {
      id: "queries-sql/comparing-metrics-between-queries",
      title: "Comparer des métriques entre des requêtes en décibels",
      description: "Une requête pour comparer des métriques entre deux requêtes dans ClickHouse.",
      href: "/resources/support-center/knowledge-base/queries-sql/comparing-metrics-between-queries",
      category: "Queries & SQL",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "Configuration des capacités CAP_IPC_LOCK et CAP_SYS_NICE dans Docker",
      description: "Apprenez à résoudre les avertissements de capacité Docker pour `CAP_IPC_LOCK` et `CAP_SYS_NICE` lors de l'exécution de ClickHouse dans un conteneur.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Configuration & paramètres",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "Configuration des capacités CAP_IPC_LOCK et CAP_SYS_NICE dans Docker",
      description: "Apprenez à résoudre les avertissements de capacité Docker pour `CAP_IPC_LOCK` et `CAP_SYS_NICE` lors de l'exécution de ClickHouse dans un conteneur.",
      href: "/resources/support-center/knowledge-base/troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Dépannage & erreurs",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "cloud-services/custom-dns-alias-for-instance",
      title: "Créer un alias DNS personnalisé en configurant un proxy inverse",
      description: "Apprenez à configurer un alias DNS personnalisé pour votre instance à l'aide d'un proxy inverse",
      href: "/resources/support-center/knowledge-base/cloud-services/custom-dns-alias-for-instance",
      category: "Cloud",
      tags: ["Server Admin", "Security and Authentication"]
    },
    {
      id: "troubleshooting/part-intersects-previous-part",
      title: "DB::Exception : La partie XXXXX intersecte la partie précédente YYYYY. Il s'agit d'un bug ou du résultat d'une intervention manuelle dans les données ZooKeeper.",
      description:
        "Cet article explique comment résoudre l'erreur DB::Exception liée aux parties qui se croisent dans ClickHouse, souvent causée par une condition de concurrence ou une intervention manuelle dans les données ZooKeeper.",
      href: "/resources/support-center/knowledge-base/troubleshooting/part-intersects-previous-part",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions", "System Tables"]
    },
    {
      id: "setup-installation/difference-between-official-builds-and-3rd-party",
      title: "Différences entre les versions officielles et tierces de ClickHouse",
      description: "Comprenez les principales différences entre les versions officielles de ClickHouse et les versions tierces, notamment en ce qui concerne les mises à jour, la compatibilité et les considérations de sécurité.",
      href: "/resources/support-center/knowledge-base/setup-installation/difference-between-official-builds-and-3rd-party",
      category: "Setup & installation",
      tags: ["Concepts"]
    },
    {
      id: "general-faqs/cost-based",
      title: "ClickHouse dispose-t-il d'un optimiseur basé sur les coûts ?",
      description: "ClickHouse dispose de certains mécanismes d'optimisation basés sur les coûts",
      href: "/resources/support-center/knowledge-base/general-faqs/cost-based",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/datalake",
      title: "ClickHouse prend-il en charge les lacs de données ?",
      description: "ClickHouse prend en charge les lacs de données, notamment Iceberg, Delta Lake, Apache Hudi, Apache Paimon, Hive",
      href: "/resources/support-center/knowledge-base/general-faqs/datalake",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/distributed-join",
      title: "ClickHouse prend-il en charge les JOIN distribués ?",
      description: "ClickHouse prend en charge les JOIN distribués",
      href: "/resources/support-center/knowledge-base/general-faqs/distributed-join",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/federated",
      title: "ClickHouse prend-il en charge les requêtes fédérées ?",
      description: "ClickHouse prend en charge une large gamme de requêtes fédérées et hybrides",
      href: "/resources/support-center/knowledge-base/general-faqs/federated",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/concurrency",
      title: "ClickHouse prend-il en charge les requêtes fréquentes et simultanées ?",
      description: "ClickHouse prend en charge un QPS élevé et une haute concurrence",
      href: "/resources/support-center/knowledge-base/general-faqs/concurrency",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "cloud-services/multi-region-replication",
      title: "ClickHouse prend-il en charge la réplication multi-région ?",
      description: "Cette page répond à la question de savoir si ClickHouse prend en charge la réplication multi-région",
      href: "/resources/support-center/knowledge-base/cloud-services/multi-region-replication",
      category: "Cloud",
      tags: []
    },
    {
      id: "general-faqs/updates",
      title: "ClickHouse prend-il en charge les mises à jour en temps réel ?",
      description: "ClickHouse prend en charge les mises à jour légères en temps réel",
      href: "/resources/support-center/knowledge-base/general-faqs/updates",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "security/row-column-policy",
      title: "ClickHouse prend-il en charge la sécurité au niveau des lignes et des colonnes ?",
      description: "Découvrez les restrictions d'accès au niveau des lignes et des colonnes dans ClickHouse et ClickHouse Cloud, et comment mettre en œuvre le contrôle d'accès basé sur les rôles (RBAC) avec des politiques.",
      href: "/resources/support-center/knowledge-base/security/row-column-policy",
      category: "Security & access control",
      tags: ["Security and Authentication"]
    },
    {
      id: "cloud-services/execute-system-queries-in-cloud",
      title: "Exécuter des instructions SYSTEM sur tous les nœuds dans ClickHouse Cloud",
      description: "Apprenez à utiliser `ON CLUSTER` et `clusterAllReplicas` pour exécuter des instructions et des requêtes SYSTEM sur tous les nœuds d'un service ClickHouse Cloud.",
      href: "/resources/support-center/knowledge-base/cloud-services/execute-system-queries-in-cloud",
      category: "Cloud",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "troubleshooting/count-parts-by-type",
      title: "Trouver les nombres et les tailles des parties larges ou compactes",
      description: "Cet article de la base de connaissances vous montre comment trouver le nombre de parties par type de partie - large ou compacte.",
      href: "/resources/support-center/knowledge-base/troubleshooting/count-parts-by-type",
      category: "Troubleshooting & errors",
      tags: ["Troubleshooting"]
    },
    {
      id: "troubleshooting/fix-developer-verification-error-in-macos",
      title: "Corriger l'erreur de vérification du développeur dans MacOS",
      description: "Apprenez à résoudre l'erreur de vérification du développeur MacOS lors de l'exécution de commandes ClickHouse, en utilisant les Paramètres système ou le terminal.",
      href: "/resources/support-center/knowledge-base/troubleshooting/fix-developer-verification-error-in-macos",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "data-import-export/s3-export-data-year-month-folders",
      title: "Comment effectuer des écritures partitionnées par année et par mois sur S3 ?",
      description: "Apprenez à écrire des données partitionnées par année et par mois dans un bucket S3 dans ClickHouse, en utilisant une structure de chemin personnalisée pour organiser les données.",
      href: "/resources/support-center/knowledge-base/data-import-export/s3-export-data-year-month-folders",
      category: "Data import & export",
      tags: ["Data Export", "Native Clients and Interfaces"]
    },
    {
      id: "data-import-export/kafka-clickhouse-json",
      title: "Comment utiliser le nouveau type de données JSON avec Kafka ?",
      description: "Apprenez à charger des messages JSON depuis Apache Kafka directement dans une seule colonne JSON dans ClickHouse en utilisant le moteur de table Kafka et le type de données JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-clickhouse-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Ingestion"]
    },
    {
      id: "cloud-services/change-billing-email",
      title: "Comment modifier mon contact de facturation dans ClickHouse Cloud ?",
      description: "Apprenons comment modifier votre adresse de facturation dans ClickHouse Cloud.",
      href: "/resources/support-center/knowledge-base/cloud-services/change-billing-email",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "general-faqs/how-do-i-contribute-code-to-clickhouse",
      title: "How do I contribute code to ClickHouse?",
      description: "ClickHouse est un projet open source développé sur GitHub. Comme il est d'usage, les instructions de contribution sont publiées dans le fichier CONTRIBUTING à la racine du dépôt de code source.",
      href: "/resources/support-center/knowledge-base/general-faqs/how-do-i-contribute-code-to-clickhouse",
      category: "General & FAQs",
      tags: ["Community"]
    },
    {
      id: "data-import-export/parquet-to-csv-json",
      title: "Comment convertir des fichiers Parquet en CSV ou JSON ?",
      description: "Apprenez à utiliser l'outil `clickhouse-local` de ClickHouse pour convertir facilement des fichiers Parquet en formats CSV ou JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/parquet-to-csv-json",
      category: "Data import & export",
      tags: ["Data Sources", "Data Formats"]
    },
    {
      id: "data-import-export/mysql-to-parquet-csv-json",
      title: "Comment exporter des données MySQL vers Parquet, CSV ou JSON avec ClickHouse",
      description: "Apprenez à utiliser l'outil `clickhouse-local` pour exporter des données MySQL vers des formats tels que Parquet, CSV ou JSON rapidement et efficacement.",
      href: "/resources/support-center/knowledge-base/data-import-export/mysql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Export"]
    },
    {
      id: "data-import-export/postgresql-to-parquet-csv-json",
      title: "Comment exporter des données PostgreSQL vers Parquet, CSV ou JSON ?",
      description: "Apprenez à exporter des données PostgreSQL vers les formats Parquet, CSV ou JSON en utilisant `clickhouse-local` avec divers exemples.",
      href: "/resources/support-center/knowledge-base/data-import-export/postgresql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Export", "Data Formats"]
    },
    {
      id: "setup-installation/install-clickhouse-windows10",
      title: "Comment installer ClickHouse sur Windows 10 ?",
      description: "Apprenez à installer et tester ClickHouse sur Windows 10 avec WSL 2. Inclut la configuration, le dépannage et l'exécution d'un environnement de test.",
      href: "/resources/support-center/knowledge-base/setup-installation/install-clickhouse-windows10",
      category: "Setup & installation",
      tags: ["Tools and Utilities"]
    },
    {
      id: "security/remove-default-user",
      title: "Comment supprimer l'utilisateur par défaut ?",
      description: "Apprenez à supprimer l'utilisateur par défaut lors de l'exécution du serveur ClickHouse.",
      href: "/resources/support-center/knowledge-base/security/remove-default-user",
      category: "Security & access control",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/ingest-failures-23-9-release",
      title: "Comment résoudre les échecs d'ingestion après la version 23.9 de ClickHouse ?",
      description: "Apprenez à résoudre les échecs d'ingestion causés par une vérification plus stricte des droits introduite dans ClickHouse 23.9 pour les tables utilisant `async_inserts`. Mettez à jour les droits pour corriger les erreurs.",
      href: "/resources/support-center/knowledge-base/cloud-services/ingest-failures-23-9-release",
      category: "Cloud",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "performance-optimization/insert-select-settings-tuning",
      title: "Comment résoudre l'erreur TOO MANY PARTS lors d'un INSERT...SELECT ?",
      description: "Résolvez l'erreur TOO_MANY_PARTS dans ClickHouse lors d'un `INSERT...SELECT` en ajustant des paramètres avancés pour des blocs plus grands et en augmentant les seuils de partition.",
      href: "/resources/support-center/knowledge-base/performance-optimization/insert-select-settings-tuning",
      category: "Performance & optimization",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "integrations/node-js-example",
      title: "Comment utiliser NodeJS avec @clickhouse/client",
      description: "Apprenez à utiliser @clickhouse/client dans une application Node.js pour interagir avec ClickHouse et effectuer des requêtes.",
      href: "/resources/support-center/knowledge-base/integrations/node-js-example",
      category: "Integrations & client libraries",
      tags: ["Language Clients"]
    },
    {
      id: "monitoring-debugging/view-number-of-active-mutations",
      title: "Comment afficher le nombre de mutations actives ou en file d'attente ?",
      description:
        "Surveillez le nombre de mutations actives ou en file d'attente dans ClickHouse, notamment lors d'opérations `ALTER` ou `UPDATE`. Utilisez la table `system.mutations` pour suivre les mutations.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/view-number-of-active-mutations",
      category: "Monitoring & debugging",
      tags: ["System Tables"]
    },
    {
      id: "data-management/read-consistency",
      title: "Comment assurer la cohérence de lecture des données dans ClickHouse ?",
      description: "Apprenez à garantir la cohérence des données lors de la lecture depuis ClickHouse, que vous soyez connecté au même nœud ou à un nœud aléatoire.",
      href: "/resources/support-center/knowledge-base/data-management/read-consistency",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "setup-installation/llvm-clang-up-to-date",
      title: "Comment compiler LLVM et clang sur Linux",
      description: "Commandes pour compiler LLVM et clang sur Linux.",
      href: "/resources/support-center/knowledge-base/setup-installation/llvm-clang-up-to-date",
      category: "Setup & installation",
      tags: ["Community", "Tools and Utilities"]
    },
    {
      id: "data-management/calculate-ratio-of-zero-sparse-serialization",
      title: "Comment calculer le ratio de valeurs vides/nulles dans chaque colonne d'une table",
      description: "Apprenez à calculer le ratio de valeurs vides ou nulles dans chaque colonne d'une table ClickHouse pour optimiser la sérialisation des colonnes creuses.",
      href: "/resources/support-center/knowledge-base/data-management/calculate-ratio-of-zero-sparse-serialization",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "security/check-users-roles",
      title: "Comment vérifier les utilisateurs assignés aux rôles et vice versa",
      description: "Apprenez à interroger `system.role_grants` de ClickHouse pour trouver les utilisateurs assignés aux rôles et les rôles assignés à des utilisateurs spécifiques.",
      href: "/resources/support-center/knowledge-base/security/check-users-roles",
      category: "Security & access control",
      tags: ["Server Admin", "System Tables", "Managing Cloud"]
    },
    {
      id: "monitoring-debugging/which-processes-are-currently-running",
      title: "Comment vérifier quel code s'exécute actuellement sur un serveur ?",
      description:
        "ClickHouse fournit des outils d'introspection comme `system.stack_trace` pour inspecter le code en cours d'exécution sur chaque thread du serveur, facilitant le débogage et la surveillance des performances.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/which-processes-are-currently-running",
      category: "Monitoring & debugging",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      title: "Comment vérifier l'état de votre service ClickHouse Cloud",
      description: "Apprenez à utiliser l'API ClickHouse Cloud pour vérifier si votre service est arrêté, inactif ou en cours d'exécution sans le réveiller.",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "configuration-settings/configure-a-user-setting",
      title: "Comment configurer les paramètres d'un utilisateur dans ClickHouse",
      description: "Apprenez à définir des paramètres dans ClickHouse pour des requêtes individuelles, des sessions client ou des utilisateurs spécifiques à l'aide des commandes `SET` et `ALTER USER`.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-a-user-setting",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "materialized-views/projection-example",
      title: "Comment confirmer si une projection est utilisée par la requête ?",
      description: "Apprenez à vérifier si une projection est utilisée dans les requêtes ClickHouse en testant avec des données d'exemple et en utilisant EXPLAIN pour confirmer l'utilisation de la projection.",
      href: "/resources/support-center/knowledge-base/materialized-views/projection-example",
      category: "Materialized views & projections",
      tags: ["Data Modelling"]
    },
    {
      id: "cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      title: "Comment se connecter à ClickHouse avec des clés SSH",
      description: "Comment se connecter à ClickHouse et ClickHouse Cloud avec des clés SSH",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      category: "Cloud",
      tags: ["Managing Cloud", "Security and Authentication"]
    },
    {
      id: "data-management/dictionary-using-strings",
      title: "How to Create a ClickHouse Dictionary with String Keys and Values",
      description: "Learn how to create a ClickHouse dictionary using string keys and values from a MergeTree table as the source, with examples of setup and usage.",
      href: "/resources/support-center/knowledge-base/data-management/dictionary-using-strings",
      category: "Data management",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      title: "How to create a table that can query multiple remote clusters",
      description: "How to create a table that can query multiple remote clusters",
      href: "/resources/support-center/knowledge-base/tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      category: "Tables & schema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "setup-installation/enabling-ssl-with-lets-encrypt",
      title: "How to Enable SSL with Let's Encrypt on a Single ClickHouse Server",
      description: "Learn how to set up SSL for a single ClickHouse server using Let's Encrypt, including certificate issuance, configuration, and validation.",
      href: "/resources/support-center/knowledge-base/setup-installation/enabling-ssl-with-lets-encrypt",
      category: "Setup & installation",
      tags: ["Security and Authentication"]
    },
    {
      id: "data-import-export/file-export",
      title: "How to Export Data from ClickHouse to a File",
      description: "Learn various methods to export data from ClickHouse, including `INTO OUTFILE`, the File table engine, and command-line redirection.",
      href: "/resources/support-center/knowledge-base/data-import-export/file-export",
      category: "Data import & export",
      tags: ["Data Export"]
    },
    {
      id: "queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      title: "How to filter a ClickHouse table by an array-column?",
      description: "Knowledgebase article on how to filter a ClickHouse table by an array-column.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      category: "Queries & SQL",
      tags: ["Data Modelling", "Functions"]
    },
    {
      id: "monitoring-debugging/generate-har-file",
      title: "How to Generate a HAR file for support",
      description: "A HAR (HTTP Archive) file captures the network activity in your browser. It can help our support team diagnose slow page loads, failed requests, or other network issues.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/generate-har-file",
      category: "Monitoring & debugging",
      tags: ["Tools and Utilities"]
    },
    {
      id: "materialized-views/how-to-display-queries-using-mv",
      title: "How to Identify Queries Using Materialized Views in ClickHouse",
      description: "Learn how to query ClickHouse logs to identify all queries involving Materialized Views within a specified time range.",
      href: "/resources/support-center/knowledge-base/materialized-views/how-to-display-queries-using-mv",
      category: "Materialized views & projections",
      tags: ["System Tables"]
    },
    {
      id: "performance-optimization/find-expensive-queries",
      title: "How to Identify the Most Expensive Queries in ClickHouse",
      description: "Learn how to use the `query_log` table in ClickHouse to identify the most memory and CPU-intensive queries across distributed nodes.",
      href: "/resources/support-center/knowledge-base/performance-optimization/find-expensive-queries",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/ignoring-incorrect-settings",
      title: "How to Ignore Incorrect Settings in ClickHouse",
      description: "Learn how to use the `skip_check_for_incorrect_settings` option to allow ClickHouse to start even when user-level settings are specified incorrectly.",
      href: "/resources/support-center/knowledge-base/configuration-settings/ignoring-incorrect-settings",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "data-import-export/json-import",
      title: "How to import JSON into ClickHouse?",
      description: "This page shows you how to import JSON into ClickHouse",
      href: "/resources/support-center/knowledge-base/data-import-export/json-import",
      category: "Data import & export",
      tags: []
    },
    {
      id: "setup-installation/how-to-increase-thread-pool-size",
      title: "How to Increase the Number of Threads in ClickHouse",
      description: "Learn how to configure the Global Thread pool in ClickHouse by adjusting settings like `max_thread_pool_size`, `thread_pool_queue_size`, and `max_thread_pool_free_size`.",
      href: "/resources/support-center/knowledge-base/setup-installation/how-to-increase-thread-pool-size",
      category: "Setup & installation",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "data-import-export/kafka-to-clickhouse-setup",
      title: "How to Ingest Data from Kafka into ClickHouse",
      description: "Learn how to ingest data from a Kafka topic into ClickHouse using the Kafka table engine, materialized views, and MergeTree tables.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-to-clickhouse-setup",
      category: "Data import & export",
      tags: ["Data Ingestion"]
    },
    {
      id: "data-import-export/ingest-parquet-files-in-s3",
      title: "How to ingest Parquet files from an S3 bucket",
      description: "Learn the basics of using the S3 table engine in ClickHouse to ingest and query Parquet files from an S3 bucket, including setup, access permissions, and data import examples.",
      href: "/resources/support-center/knowledge-base/data-import-export/ingest-parquet-files-in-s3",
      category: "Data import & export",
      tags: ["Data Ingestion"]
    },
    {
      id: "queries-sql/how-to-insert-all-rows-from-another-table",
      title: "How to insert all rows from one table to another?",
      description: "Knowledgebase article on how to insert all rows from one table to another.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-insert-all-rows-from-another-table",
      category: "Queries & SQL",
      tags: ["Data Ingestion"]
    },
    {
      id: "performance-optimization/check-query-processing-time-only",
      title: "How to Measure Query Processing Time Without Returning Rows",
      description: "Learn how to use the `FORMAT Null` option in ClickHouse to measure query processing time without returning any rows to the client.",
      href: "/resources/support-center/knowledge-base/performance-optimization/check-query-processing-time-only",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "monitoring-debugging/outputSendLogsLevelTracesToFile",
      title: "How to output send logs level traces to file using the clickhouse-client",
      description: "How to output send logs level traces to file using the clickhouse-client",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/outputSendLogsLevelTracesToFile",
      category: "Monitoring & debugging",
      tags: ["Data Export"]
    },
    {
      id: "tables-schema/recreate-table-across-terminals",
      title: "How to quickly recreate a small table across different terminals",
      description: "Learn how to quickly recreate a small table and its data across different terminals using copy/paste for development environments.",
      href: "/resources/support-center/knowledge-base/tables-schema/recreate-table-across-terminals",
      category: "Tables & schema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      title: "How to set up ClickHouse on Docker with ODBC to connect to a Microsoft SQL Server (MSSQL) database",
      description: "How to set up ClickHouse on Docker with ODBC to connect to a Microsoft SQL Server (MSSQL) database",
      href: "/resources/support-center/knowledge-base/integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "queries-sql/using-array-join-to-extract-and-query-attributes",
      title: "Comment utiliser array join pour extraire et interroger des attributs variables à l'aide de clés et de valeurs de type map",
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
      description: "Apprenez à importer des fichiers GeoJSON avec des tableaux d'objets profondément imbriqués dans ClickHouse et à interroger les données de fonctionnalités imbriquées.",
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
      title: "Exemple rapide en Python avec le module requests",
      description: "Un exemple utilisant Python et le module requests pour écrire dans ClickHouse et lire des données",
      href: "/resources/support-center/knowledge-base/integrations/python-http-requests",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "configuration-settings/maximum-number-of-tables-and-databases",
      title: "Nombre maximal recommandé de bases de données, de tables, de partitions et de parts dans ClickHouse",
      description: "Découvrez les limites maximales recommandées pour les bases de données, les tables, les partitions et les parts dans un cluster ClickHouse afin de garantir des performances optimales.",
      href: "/resources/support-center/knowledge-base/configuration-settings/maximum-number-of-tables-and-databases",
      category: "Configuration & settings",
      tags: ["Performance and Optimizations", "Deployments and Scaling"]
    },
    {
      id: "data-import-export/cannot-append-data-to-parquet-format",
      title: 'Résolution de l\'erreur « Cannot Append Data in Parquet Format » dans ClickHouse',
      description: 'Vous obtenez l\'erreur « Cannot append data in format Parquet to file » dans ClickHouse ? Voyons comment la résoudre.',
      href: "/resources/support-center/knowledge-base/data-import-export/cannot-append-data-to-parquet-format",
      category: "Data import & export",
      tags: ["Errors and Exceptions", "Data Formats"]
    },
    {
      id: "troubleshooting/exception-too-many-parts",
      title: 'Résolution de l\'erreur « Too Many Parts » dans ClickHouse',
      description: 'Apprenez à résoudre l\'erreur « Too many parts » dans ClickHouse en optimisant les taux d\'insertion, en configurant les paramètres MergeTree et en gérant efficacement les partitions.',
      href: "/resources/support-center/knowledge-base/troubleshooting/exception-too-many-parts",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "troubleshooting/certificate-verify-failed-error",
      title: "Résolution de l'erreur de vérification du certificat SSL dans ClickHouse",
      description: "Découvrez comment résoudre l'erreur SSL Exception CERTIFICATE_VERIFY_FAILED.",
      href: "/resources/support-center/knowledge-base/troubleshooting/certificate-verify-failed-error",
      category: "Troubleshooting & errors",
      tags: ["Security and Authentication", "Errors and Exceptions"]
    },
    {
      id: "troubleshooting/connection-timeout-remote-remoteSecure",
      title: "Résolution des erreurs de délai d'attente avec les fonctions de table `remote` et `remoteSecure`",
      description: "Apprenez à corriger les erreurs de délai d'attente lors de l'utilisation des fonctions de table `remote` ou `remoteSecure` dans ClickHouse en ajustant les paramètres de délai d'attente de connexion.",
      href: "/resources/support-center/knowledge-base/troubleshooting/connection-timeout-remote-remoteSecure",
      category: "Troubleshooting & errors",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "tables-schema/search-across-node-for-tables-with-a-wildcard",
      title: "Recherche de tables sur plusieurs nœuds avec un caractère générique",
      description: "Apprenez à rechercher des tables sur plusieurs nœuds avec un caractère générique.",
      href: "/resources/support-center/knowledge-base/tables-schema/search-across-node-for-tables-with-a-wildcard",
      category: "Tables & schema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "performance-optimization/query-max-execution-time",
      title: "Définir une limite de temps d'exécution des requêtes",
      description: "Comment imposer une limite au temps d'exécution maximal des requêtes",
      href: "/resources/support-center/knowledge-base/performance-optimization/query-max-execution-time",
      category: "Performance & optimization",
      tags: ["Managing Cloud", "Settings"]
    },
    {
      id: "data-import-export/json-simple-example",
      title: "Exemple simple de workflow pour extraire des données JSON à l'aide d'une table d'atterrissage avec une vue matérialisée",
      description: "Exemple simple de workflow pour extraire des données JSON à l'aide d'une table d'atterrissage avec une vue matérialisée",
      href: "/resources/support-center/knowledge-base/data-import-export/json-simple-example",
      category: "Data import & export",
      tags: ["Data Formats"]
    },
    {
      id: "performance-optimization/async-vs-optimize-read-in-order",
      title: "Lecture synchrone des données",
      description:
        "Le nouveau paramètre `allow_asynchronous_read_from_io_pool_for_merge_tree` permet au nombre de threads de lecture (flux) d'être supérieur à celui des threads dans le reste du pipeline d'exécution de la requête.",
      href: "/resources/support-center/knowledge-base/performance-optimization/async-vs-optimize-read-in-order",
      category: "Performance & optimization",
      tags: ["Settings", "Performance and Optimizations"]
    },
    {
      id: "integrations/terraform-example",
      title: "Exemple Terraform montrant comment utiliser l'API Cloud",
      description: "Cet exemple montre comment utiliser Terraform pour créer et supprimer des clusters à l'aide de l'API",
      href: "/resources/support-center/knowledge-base/integrations/terraform-example",
      category: "Integrations & client libraries",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      title: "Conseils et astuces pour optimiser les types de données de base dans ClickHouse",
      description: "Conseils et astuces pour optimiser les types de données de base dans ClickHouse",
      href: "/resources/support-center/knowledge-base/performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "queries-sql/useful-queries-for-troubleshooting",
      title: "Requêtes utiles pour le dépannage",
      description: "Une collection de requêtes pratiques pour dépanner ClickHouse, notamment pour surveiller la taille des tables, les requêtes longues et les erreurs.",
      href: "/resources/support-center/knowledge-base/queries-sql/useful-queries-for-troubleshooting",
      category: "Queries & SQL",
      tags: ["Settings"]
    },
    {
      id: "general-faqs/use-clickhouse-for-log-analytics",
      title: "Utiliser ClickHouse pour l'analyse de logs",
      description: "ClickHouse est populaire pour l'analyse des logs et des métriques grâce à ses capacités d'analyse en temps réel. Envie d'en savoir plus ?",
      href: "/resources/support-center/knowledge-base/general-faqs/use-clickhouse-for-log-analytics",
      category: "General & FAQs",
      tags: ["Use Cases"]
    },
    {
      id: "queries-sql/filtered-aggregates",
      title: "Utiliser les agrégats filtrés dans ClickHouse",
      description: "Apprenez à utiliser les agrégats filtrés dans ClickHouse avec les combinateurs d'agrégats `-If` et `-Distinct` pour simplifier la syntaxe des requêtes et améliorer l'analyse.",
      href: "/resources/support-center/knowledge-base/queries-sql/filtered-aggregates",
      category: "Queries & SQL",
      tags: ["Functions"]
    },
    {
      id: "general-faqs/dependencies",
      title: "Quelles sont les dépendances tierces nécessaires pour exécuter ClickHouse ?",
      description: "ClickHouse est autonome et n'a aucune dépendance à l'exécution",
      href: "/resources/support-center/knowledge-base/general-faqs/dependencies",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/dbms-naming",
      title: 'Que signifie « ClickHouse » ?',
      description: 'Découvrez ce que signifie « ClickHouse »',
      href: "/resources/support-center/knowledge-base/general-faqs/dbms-naming",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/ne-tormozit",
      title: "Que signifie « не тормозит » ?",
      description: 'Cette page explique ce que signifie « Не тормозит »',
      href: "/resources/support-center/knowledge-base/general-faqs/ne-tormozit",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "integrations/oracle-odbc",
      title: "Que faire si j'ai un problème d'encodage lors de l'utilisation d'Oracle via ODBC ?",
      description: "Cette page explique quoi faire si vous rencontrez un problème d'encodage lors de l'utilisation d'Oracle via ODBC",
      href: "/resources/support-center/knowledge-base/integrations/oracle-odbc",
      category: "Integrations & client libraries",
      tags: []
    },
    {
      id: "general-faqs/columnar-database",
      title: "Qu'est-ce qu'une base de données en colonnes ?",
      description: "Cette page explique ce qu'est une base de données en colonnes",
      href: "/resources/support-center/knowledge-base/general-faqs/columnar-database",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "general-faqs/olap",
      title: "What is OLAP?",
      description: "An explainer on what Online Analytical Processing is",
      href: "/resources/support-center/knowledge-base/general-faqs/olap",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "performance-optimization/optimize-final-vs-final",
      title: "What is the difference between OPTIMIZE FINAL and FINAL?",
      description: "Discusses the differences between OPTIMIZE FINAL and FINAL, and when to use and avoid them.",
      href: "/resources/support-center/knowledge-base/performance-optimization/optimize-final-vs-final",
      category: "Performance & optimization",
      tags: ["Core Data Concepts"]
    },
    {
      id: "general-faqs/sql",
      title: "What SQL syntax does ClickHouse support?",
      description: "ClickHouse supports 100% of SQL syntax",
      href: "/resources/support-center/knowledge-base/general-faqs/sql",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/when-is-ttl-applied",
      title: "Quand les règles TTL sont-elles appliquées, et peut-on les contrôler ?",
      description:
        "Les règles TTL dans ClickHouse sont appliquées de façon asynchrone, et vous pouvez contrôler le moment de leur exécution à l'aide du paramètre `merge_with_ttl_timeout`. Découvrez comment forcer l'application des TTL et gérer les threads d'arrière-plan pour leur exécution.",
      href: "/resources/support-center/knowledge-base/data-management/when-is-ttl-applied",
      category: "Data management",
      tags: ["Core Data Concepts"]
    },
    {
      id: "setup-installation/production",
      title: "Which ClickHouse version to use in production?",
      description: "This page provides guidance on which ClickHouse version to use in production",
      href: "/resources/support-center/knowledge-base/setup-installation/production",
      category: "Setup & installation",
      tags: []
    },
    {
      id: "general-faqs/who-is-using-clickhouse",
      title: "Who is using ClickHouse?",
      description: "Describes who is using ClickHouse",
      href: "/resources/support-center/knowledge-base/general-faqs/who-is-using-clickhouse",
      category: "General & FAQs",
      tags: []
    },
    {
      id: "data-management/dictionaries-consistent-state",
      title: "Why can't I see my data in a dictionary in ClickHouse Cloud?",
      description: "There is an issue where data in dictionaries may not be visible immediately after creation.",
      href: "/resources/support-center/knowledge-base/data-management/dictionaries-consistent-state",
      category: "Data management",
      tags: ["Managing Cloud", "Data Modelling"]
    },
    {
      id: "general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      title: "Why is ClickHouse Keeper recommended over ZooKeeper?",
      description:
        "ClickHouse Keeper improves upon ZooKeeper with features like reduced disk space usage, faster recovery, and less memory consumption, offering better performance for ClickHouse clusters.",
      href: "/resources/support-center/knowledge-base/general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      category: "General & FAQs",
      tags: ["Core Data Concepts"]
    },
    {
      id: "monitoring-debugging/why-default-logging-verbose",
      title: "Why is ClickHouse logging so verbose by default?",
      description: "Learn why the ClickHouse developers chose to set a verbose logging level by default.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/why-default-logging-verbose",
      category: "Monitoring & debugging",
      tags: ["Settings"]
    },
    {
      id: "performance-optimization/why-is-my-primary-key-not-used",
      title: "Why is my primary key not used? How can I check?",
      description: "Covers a common reason why a primary key is not used in ordering and how we can confirm",
      href: "/resources/support-center/knowledge-base/performance-optimization/why-is-my-primary-key-not-used",
      category: "Performance & optimization",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "general-faqs/mapreduce",
      title: "Why not use something like MapReduce?",
      description: "This page explains why you would use ClickHouse over MapReduce",
      href: "/resources/support-center/knowledge-base/general-faqs/mapreduce",
      category: "General & FAQs",
      tags: []
    }
  ]
}