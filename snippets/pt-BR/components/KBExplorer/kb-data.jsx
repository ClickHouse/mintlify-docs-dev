export const kbIndex = {
  categories: [
    "Cloud",
    "Configuração e ajustes",
    "Importação e exportação de dados",
    "Gerenciamento de dados",
    "Geral e perguntas frequentes",
    "Integrações e bibliotecas de cliente",
    "Visões materializadas e projeções",
    "Monitoramento e depuração",
    "Performance & optimization",
    "Consultas e SQL",
    "Segurança e controle de acesso",
    "Setup & installation",
    "Tabelas e esquema",
    "Solução de problemas e erros"
  ],
  tags: [
    "Boas práticas",
    "Comunidade",
    "Conceitos",
    "Conceitos fundamentais de dados",
    "Exportação de dados",
    "Formatos de dados",
    "Ingestão de dados",
    "Modelagem de dados",
    "Fontes de dados",
    "Implantações e escalabilidade",
    "Erros e exceções",
    "Functions",
    "Clientes de linguagem",
    "Gerenciamento do Cloud",
    "Gerenciamento de dados",
    "Clientes e interfaces nativos",
    "Desempenho e otimizações",
    "Segurança e autenticação",
    "Administração do servidor",
    "Settings",
    "Tabelas do sistema",
    "Ferramentas e utilitários",
    "Troubleshooting",
    "Casos de uso"
  ],
  articles: [
    {
      id: "integrations/python-clickhouse-connect-example",
      title: "Exemplo funcional de cliente Python para conexão ao ClickHouse Cloud Service",
      description: "Aprenda a se conectar ao ClickHouse Cloud Service usando Python com um exemplo passo a passo utilizando o driver clickhouse-connect.",
      href: "/resources/support-center/knowledge-base/integrations/python-clickhouse-connect-example",
      category: "Integrações e bibliotecas de cliente",
      tags: ["Language Clients"]
    },
    {
      id: "configuration-settings/about-quotas-and-query-complexity",
      title: "Sobre cotas e complexidade de consultas",
      description:
        "Cotas e complexidade de consultas são formas eficazes de limitar e restringir o que os usuários podem fazer no ClickHouse. Este artigo da base de conhecimento apresenta exemplos de como aplicar essas duas abordagens.",
      href: "/resources/support-center/knowledge-base/configuration-settings/about-quotas-and-query-complexity",
      category: "Configuração e ajustes",
      tags: ["Managing Cloud"]
    },
    {
      id: "data-import-export/achieving-atomic-inserts",
      title: "Realizando inserções atômicas e consistência entre múltiplas tabelas no ClickHouse Cloud",
      description: "Como carregar dados de forma atômica e manter a consistência entre múltiplas tabelas no ClickHouse Cloud sem transações de múltiplos comandos, usando tabelas de staging e operações no nível de partição.",
      href: "/resources/support-center/knowledge-base/data-import-export/achieving-atomic-inserts",
      category: "Importação e exportação de dados",
      tags: ["Ingestão de dados", "Boas práticas"]
    },
    {
      id: "tables-schema/add-column",
      title: "Adicionando uma coluna a uma tabela",
      description: "Neste guia, veremos como adicionar uma coluna a uma tabela existente.",
      href: "/resources/support-center/knowledge-base/tables-schema/add-column",
      category: "Tabelas e esquema",
      tags: ["Data Modelling"]
    },
    {
      id: "configuration-settings/alter-user-settings-exception",
      title: "Exceção ao alterar configurações de usuário",
      description: "Como tratar a exceção lançada ao alterar as configurações de usuário",
      href: "/resources/support-center/knowledge-base/configuration-settings/alter-user-settings-exception",
      category: "Configuração e ajustes",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "materialized-views/are-materialized-views-inserted-asynchronously",
      title: "As visões materializadas são inseridas de forma síncrona?",
      description: "Este artigo da base de conhecimento explora se as visões materializadas são inseridas de forma síncrona",
      href: "/resources/support-center/knowledge-base/materialized-views/are-materialized-views-inserted-asynchronously",
      category: "Visões materializadas e projeções",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/schema-migration-tools",
      title: "Ferramentas de migração automática de esquema para ClickHouse",
      description: "Conheça as ferramentas de migração automática de esquema para ClickHouse e saiba como gerenciar alterações no esquema do banco de dados ao longo do tempo.",
      href: "/resources/support-center/knowledge-base/tables-schema/schema-migration-tools",
      category: "Tabelas e esquema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      title: "Configuração do AWS PrivateLink para expor o MSK ao ClickPipes",
      description: "Etapas de configuração para expor um MSK privado via conectividade multi-VPC do MSK ao ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-msk-clickpipes",
      category: "Cloud",
      tags: ["Segurança e autenticação", "Gerenciamento do Cloud"]
    },
    {
      id: "cloud-services/aws-privatelink-setup-for-clickpipes",
      title: "Configuração do AWS PrivateLink para expor o RDS privado ao ClickPipes",
      description: "Etapas de configuração para expor um RDS privado via AWS PrivateLink ao ClickPipes.",
      href: "/resources/support-center/knowledge-base/cloud-services/aws-privatelink-setup-for-clickpipes",
      category: "Cloud",
      tags: ["Segurança e autenticação", "Gerenciamento do Cloud"]
    },
    {
      id: "data-management/backing-up-a-specific-partition",
      title: "Realizando backup de uma partição específica",
      description: "Como fazer backup de uma partição específica no ClickHouse?",
      href: "/resources/support-center/knowledge-base/data-management/backing-up-a-specific-partition",
      category: "Gerenciamento de dados",
      tags: ["Managing Data"]
    },
    {
      id: "general-faqs/key-value",
      title: "Posso usar o ClickHouse como armazenamento chave-valor?",
      description: "Responde à pergunta frequente sobre se o ClickHouse pode ser usado como armazenamento chave-valor.",
      href: "/resources/support-center/knowledge-base/general-faqs/key-value",
      category: "Geral e perguntas frequentes",
      tags: []
    },
    {
      id: "general-faqs/time-series",
      title: "Posso usar o ClickHouse como banco de dados de séries temporais?",
      description: "Página que descreve como usar o ClickHouse como banco de dados de séries temporais",
      href: "/resources/support-center/knowledge-base/general-faqs/time-series",
      category: "Geral e perguntas frequentes",
      tags: []
    },
    {
      id: "queries-sql/pivot",
      title: "É possível usar PIVOT no ClickHouse?",
      description:
        "O ClickHouse não possui uma cláusula PIVOT, mas é possível aproximar essa funcionalidade usando combinadores de funções de agregação. Veja como fazer isso com o conjunto de dados de preços de imóveis do Reino Unido.",
      href: "/resources/support-center/knowledge-base/queries-sql/pivot",
      category: "Consultas e SQL",
      tags: ["Modelagem de dados", "Conceitos fundamentais de dados"]
    },
    {
      id: "general-faqs/vector-search",
      title: "É possível usar o ClickHouse para busca vetorial?",
      description: "Aprenda a usar o ClickHouse para busca vetorial, incluindo o armazenamento de embeddings e a busca com funções de distância como similaridade de cosseno.",
      href: "/resources/support-center/knowledge-base/general-faqs/vector-search",
      category: "Geral e perguntas frequentes",
      tags: ["Casos de uso", "Conceitos"]
    },
    {
      id: "monitoring-debugging/send-logs-level",
      title: "Capturando logs do servidor de consultas no cliente",
      description: "Aprenda a capturar logs do servidor no nível do cliente, mesmo com diferentes configurações de log, usando a configuração de cliente `send_logs_level`.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/send-logs-level",
      category: "Monitoramento e depuração",
      tags: ["Server Admin"]
    },
    {
      id: "configuration-settings/change-the-prompt-in-clickhouse-client",
      title: "Alterar o prompt no clickhouse-client",
      description: "Este artigo explica como alterar o prompt no seu cliente ClickHouse e na janela de terminal do clickhouse-local de :) para um prefixo seguido de :)",
      href: "/resources/support-center/knowledge-base/configuration-settings/change-the-prompt-in-clickhouse-client",
      category: "Configuração e ajustes",
      tags: ["Settings", "Native Clients and Interfaces"]
    },
    {
      id: "security/common-rbac-queries",
      title: "Consultas RBAC comuns",
      description: "Consultas para auxiliar na concessão de permissões específicas a usuários.",
      href: "/resources/support-center/knowledge-base/security/common-rbac-queries",
      category: "Segurança e controle de acesso",
      tags: ["Segurança e autenticação", "Gerenciamento do Cloud"]
    },
    {
      id: "queries-sql/comparing-metrics-between-queries",
      title: "Comparando métricas entre consultas em decibéis",
      description: "Uma consulta para comparar métricas entre duas consultas no ClickHouse.",
      href: "/resources/support-center/knowledge-base/queries-sql/comparing-metrics-between-queries",
      category: "Consultas e SQL",
      tags: ["Desempenho e Otimizações"]
    },
    {
      id: "configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "Configurando as Capacidades CAP_IPC_LOCK e CAP_SYS_NICE no Docker",
      description: "Aprenda como resolver avisos de capacidade do Docker para `CAP_IPC_LOCK` e `CAP_SYS_NICE` ao executar o ClickHouse em um contêiner.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Configuração e ajustes",
      tags: ["Erros e Exceções"]
    },
    {
      id: "troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      title: "Configurando as Capacidades CAP_IPC_LOCK e CAP_SYS_NICE no Docker",
      description: "Aprenda como resolver avisos de capacidade do Docker para `CAP_IPC_LOCK` e `CAP_SYS_NICE` ao executar o ClickHouse em um contêiner.",
      href: "/resources/support-center/knowledge-base/troubleshooting/configure-cap-ipc-lock-and-cap-sys-nice-in-docker",
      category: "Solução de problemas e erros",
      tags: ["Erros e Exceções"]
    },
    {
      id: "cloud-services/custom-dns-alias-for-instance",
      title: "Crie um alias DNS personalizado configurando um proxy reverso",
      description: "Aprenda como configurar um alias DNS personalizado para sua instância usando um proxy reverso",
      href: "/resources/support-center/knowledge-base/cloud-services/custom-dns-alias-for-instance",
      category: "Nuvem",
      tags: ["Administração de Servidor", "Segurança e Autenticação"]
    },
    {
      id: "troubleshooting/part-intersects-previous-part",
      title: "DB::Exception: Part XXXXX intersects previous part YYYYY. It is a bug or a result of manual intervention in the ZooKeeper data.",
      description:
        "Este artigo explica como resolver o erro DB::Exception relacionado a partes que se intersectam no ClickHouse, frequentemente causado por uma condição de corrida ou intervenção manual nos dados do ZooKeeper.",
      href: "/resources/support-center/knowledge-base/troubleshooting/part-intersects-previous-part",
      category: "Solução de problemas e erros",
      tags: ["Erros e Exceções", "Tabelas do Sistema"]
    },
    {
      id: "setup-installation/difference-between-official-builds-and-3rd-party",
      title: "Diferenças Entre as Compilações Oficiais e de Terceiros do ClickHouse",
      description: "Entenda as principais diferenças entre as compilações oficiais do ClickHouse e as de terceiros, incluindo atualizações, compatibilidade e considerações de segurança.",
      href: "/resources/support-center/knowledge-base/setup-installation/difference-between-official-builds-and-3rd-party",
      category: "Configuração e instalação",
      tags: ["Conceitos"]
    },
    {
      id: "general-faqs/cost-based",
      title: "O ClickHouse possui um otimizador baseado em custo?",
      description: "O ClickHouse possui certos mecanismos de otimização baseados em custo",
      href: "/resources/support-center/knowledge-base/general-faqs/cost-based",
      category: "Geral e Perguntas Frequentes",
      tags: []
    },
    {
      id: "general-faqs/datalake",
      title: "O ClickHouse suporta data lakes?",
      description: "O ClickHouse suporta data lakes, incluindo Iceberg, Delta Lake, Apache Hudi, Apache Paimon, Hive",
      href: "/resources/support-center/knowledge-base/general-faqs/datalake",
      category: "Geral e Perguntas Frequentes",
      tags: []
    },
    {
      id: "general-faqs/distributed-join",
      title: "O ClickHouse suporta JOIN distribuído?",
      description: "O ClickHouse suporta JOIN distribuído",
      href: "/resources/support-center/knowledge-base/general-faqs/distributed-join",
      category: "Geral e Perguntas Frequentes",
      tags: []
    },
    {
      id: "general-faqs/federated",
      title: "O ClickHouse suporta consultas federadas?",
      description: "O ClickHouse suporta uma ampla gama de consultas federadas e híbridas",
      href: "/resources/support-center/knowledge-base/general-faqs/federated",
      category: "Geral e Perguntas Frequentes",
      tags: []
    },
    {
      id: "general-faqs/concurrency",
      title: "O ClickHouse suporta consultas frequentes e simultâneas?",
      description: "O ClickHouse suporta alto QPS e alta concorrência",
      href: "/resources/support-center/knowledge-base/general-faqs/concurrency",
      category: "Geral e Perguntas Frequentes",
      tags: []
    },
    {
      id: "cloud-services/multi-region-replication",
      title: "O ClickHouse suporta replicação multi-região?",
      description: "Esta página responde se o ClickHouse suporta replicação multi-região",
      href: "/resources/support-center/knowledge-base/cloud-services/multi-region-replication",
      category: "Nuvem",
      tags: []
    },
    {
      id: "general-faqs/updates",
      title: "O ClickHouse suporta atualizações em tempo real?",
      description: "O ClickHouse suporta atualizações leves em tempo real",
      href: "/resources/support-center/knowledge-base/general-faqs/updates",
      category: "Geral e Perguntas Frequentes",
      tags: []
    },
    {
      id: "security/row-column-policy",
      title: "O ClickHouse suporta segurança em nível de linha e coluna?",
      description: "Saiba mais sobre restrições de acesso em nível de linha e coluna no ClickHouse e ClickHouse Cloud, e como implementar controle de acesso baseado em função (RBAC) com políticas.",
      href: "/resources/support-center/knowledge-base/security/row-column-policy",
      category: "Segurança e controle de acesso",
      tags: ["Segurança e Autenticação"]
    },
    {
      id: "cloud-services/execute-system-queries-in-cloud",
      title: "Execute Instruções SYSTEM em Todos os Nós no ClickHouse Cloud",
      description: "Aprenda como usar `ON CLUSTER` e `clusterAllReplicas` para executar instruções e consultas SYSTEM em todos os nós de um serviço ClickHouse Cloud.",
      href: "/resources/support-center/knowledge-base/cloud-services/execute-system-queries-in-cloud",
      category: "Nuvem",
      tags: ["Implantações e Escalabilidade"]
    },
    {
      id: "troubleshooting/count-parts-by-type",
      title: "Encontre contagens e tamanhos de partes largas ou compactas",
      description: "Este artigo da base de conhecimento mostra como encontrar contagens de partes pelo tipo de parte - larga ou compacta.",
      href: "/resources/support-center/knowledge-base/troubleshooting/count-parts-by-type",
      category: "Solução de problemas e erros",
      tags: ["Solução de Problemas"]
    },
    {
      id: "troubleshooting/fix-developer-verification-error-in-macos",
      title: "Corrija o Erro de Verificação de Desenvolvedor no MacOS",
      description: "Aprenda como resolver o erro de verificação de desenvolvedor do MacOS ao executar comandos do ClickHouse, usando as Configurações do Sistema ou o terminal.",
      href: "/resources/support-center/knowledge-base/troubleshooting/fix-developer-verification-error-in-macos",
      category: "Solução de problemas e erros",
      tags: ["Erros e Exceções"]
    },
    {
      id: "data-import-export/s3-export-data-year-month-folders",
      title: "Como posso fazer gravações particionadas por ano e mês no S3?",
      description: "Aprenda como gravar dados particionados por ano e mês em um bucket S3 no ClickHouse, usando uma estrutura de caminho personalizada para organizar os dados.",
      href: "/resources/support-center/knowledge-base/data-import-export/s3-export-data-year-month-folders",
      category: "Importação e exportação de dados",
      tags: ["Exportação de Dados", "Clientes e Interfaces Nativos"]
    },
    {
      id: "data-import-export/kafka-clickhouse-json",
      title: "Como posso usar o novo Tipo de Dado JSON com o Kafka?",
      description: "Aprenda como carregar mensagens JSON do Apache Kafka diretamente em uma única coluna JSON no ClickHouse usando o mecanismo de tabela Kafka e o tipo de dado JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-clickhouse-json",
      category: "Importação e exportação de dados",
      tags: ["Formatos de Dados", "Ingestão de Dados"]
    },
    {
      id: "cloud-services/change-billing-email",
      title: "Como altero meu Contato de Faturamento no ClickHouse Cloud?",
      description: "Vamos aprender como alterar seu endereço de faturamento no ClickHouse Cloud.",
      href: "/resources/support-center/knowledge-base/cloud-services/change-billing-email",
      category: "Nuvem",
      tags: ["Gerenciamento de Nuvem"]
    },
    {
      id: "general-faqs/how-do-i-contribute-code-to-clickhouse",
      title: "Como contribuo com código para o ClickHouse?",
      description: "ClickHouse é um projeto de código aberto desenvolvido no GitHub. Como de costume, as instruções de contribuição são publicadas no arquivo CONTRIBUTING na raiz do repositório do código-fonte.",
      href: "/resources/support-center/knowledge-base/general-faqs/how-do-i-contribute-code-to-clickhouse",
      category: "General & FAQs",
      tags: ["Community"]
    },
    {
      id: "data-import-export/parquet-to-csv-json",
      title: "Como converter arquivos de Parquet para CSV ou JSON?",
      description: "Aprenda a usar a ferramenta `clickhouse-local` do ClickHouse para converter facilmente arquivos Parquet para os formatos CSV ou JSON.",
      href: "/resources/support-center/knowledge-base/data-import-export/parquet-to-csv-json",
      category: "Data import & export",
      tags: ["Data Sources", "Data Formats"]
    },
    {
      id: "data-import-export/mysql-to-parquet-csv-json",
      title: "Como exportar dados do MySQL para Parquet, CSV ou JSON usando o ClickHouse",
      description: "Aprenda a usar a ferramenta `clickhouse-local` para exportar dados do MySQL para formatos como Parquet, CSV ou JSON de forma rápida e eficiente.",
      href: "/resources/support-center/knowledge-base/data-import-export/mysql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Formats", "Data Export"]
    },
    {
      id: "data-import-export/postgresql-to-parquet-csv-json",
      title: "Como exportar dados do PostgreSQL para Parquet, CSV ou JSON?",
      description: "Aprenda a exportar dados do PostgreSQL para os formatos Parquet, CSV ou JSON usando `clickhouse-local` com vários exemplos.",
      href: "/resources/support-center/knowledge-base/data-import-export/postgresql-to-parquet-csv-json",
      category: "Data import & export",
      tags: ["Data Export", "Data Formats"]
    },
    {
      id: "setup-installation/install-clickhouse-windows10",
      title: "Como instalar o ClickHouse no Windows 10?",
      description: "Aprenda a instalar e testar o ClickHouse no Windows 10 usando o WSL 2. Inclui configuração, solução de problemas e execução de um ambiente de teste.",
      href: "/resources/support-center/knowledge-base/setup-installation/install-clickhouse-windows10",
      category: "Setup & installation",
      tags: ["Tools and Utilities"]
    },
    {
      id: "security/remove-default-user",
      title: "Como remover o usuário padrão?",
      description: "Aprenda a remover o usuário padrão ao executar o ClickHouse Server.",
      href: "/resources/support-center/knowledge-base/security/remove-default-user",
      category: "Security & access control",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/ingest-failures-23-9-release",
      title: "Como resolver falhas de ingestão após o lançamento do ClickHouse 23.9?",
      description: "Aprenda a resolver falhas de ingestão causadas pela verificação mais rigorosa de permissões introduzida no ClickHouse 23.9 para tabelas que usam `async_inserts`. Atualize as permissões para corrigir os erros.",
      href: "/resources/support-center/knowledge-base/cloud-services/ingest-failures-23-9-release",
      category: "Cloud",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "performance-optimization/insert-select-settings-tuning",
      title: "Como resolver o erro TOO MANY PARTS durante um INSERT...SELECT?",
      description: "Resolva o erro TOO_MANY_PARTS no ClickHouse durante um `INSERT...SELECT` ajustando configurações avançadas para blocos maiores e aumentando os limites de partição.",
      href: "/resources/support-center/knowledge-base/performance-optimization/insert-select-settings-tuning",
      category: "Performance & optimization",
      tags: ["Settings", "Errors and Exceptions"]
    },
    {
      id: "integrations/node-js-example",
      title: "Como usar o NodeJS com @clickhouse/client",
      description: "Aprenda a usar o @clickhouse/client em uma aplicação Node.js para interagir com o ClickHouse e executar consultas.",
      href: "/resources/support-center/knowledge-base/integrations/node-js-example",
      category: "Integrations & client libraries",
      tags: ["Language Clients"]
    },
    {
      id: "monitoring-debugging/view-number-of-active-mutations",
      title: "Como visualizar o número de mutações ativas ou na fila?",
      description:
        "Monitore o número de mutações ativas ou na fila no ClickHouse, especialmente ao realizar operações `ALTER` ou `UPDATE`. Use a tabela `system.mutations` para rastrear mutações.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/view-number-of-active-mutations",
      category: "Monitoring & debugging",
      tags: ["System Tables"]
    },
    {
      id: "data-management/read-consistency",
      title: "Como garantir consistência na leitura de dados no ClickHouse?",
      description: "Aprenda a garantir a consistência dos dados ao ler do ClickHouse, seja conectado ao mesmo nó ou a um nó aleatório.",
      href: "/resources/support-center/knowledge-base/data-management/read-consistency",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "setup-installation/llvm-clang-up-to-date",
      title: "Como compilar LLVM e clang no Linux",
      description: "Comandos para compilar LLVM e clang no Linux.",
      href: "/resources/support-center/knowledge-base/setup-installation/llvm-clang-up-to-date",
      category: "Setup & installation",
      tags: ["Community", "Tools and Utilities"]
    },
    {
      id: "data-management/calculate-ratio-of-zero-sparse-serialization",
      title: "Como calcular a proporção de valores vazios/zero em cada coluna de uma tabela",
      description: "Aprenda a calcular a proporção de valores vazios ou zero em cada coluna de uma tabela ClickHouse para otimizar a serialização de colunas esparsas.",
      href: "/resources/support-center/knowledge-base/data-management/calculate-ratio-of-zero-sparse-serialization",
      category: "Data management",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "security/check-users-roles",
      title: "Como verificar usuários atribuídos a funções e vice-versa",
      description: "Aprenda a consultar o `system.role_grants` do ClickHouse para encontrar usuários atribuídos a funções e funções atribuídas a usuários específicos.",
      href: "/resources/support-center/knowledge-base/security/check-users-roles",
      category: "Security & access control",
      tags: ["Server Admin", "System Tables", "Managing Cloud"]
    },
    {
      id: "monitoring-debugging/which-processes-are-currently-running",
      title: "Como verificar qual código está sendo executado atualmente em um servidor?",
      description:
        "O ClickHouse fornece ferramentas de introspecção como `system.stack_trace` para inspecionar qual código está sendo executado em cada thread do servidor, auxiliando na depuração e no monitoramento de desempenho.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/which-processes-are-currently-running",
      category: "Monitoring & debugging",
      tags: ["Server Admin"]
    },
    {
      id: "cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      title: "Como verificar o estado do seu serviço ClickHouse Cloud",
      description: "Aprenda a usar a API do ClickHouse Cloud para verificar se o seu serviço está parado, ocioso ou em execução sem ativá-lo.",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-check-my-clickhouse-cloud-sevice-state",
      category: "Cloud",
      tags: ["Managing Cloud"]
    },
    {
      id: "configuration-settings/configure-a-user-setting",
      title: "Como configurar definições para um usuário no ClickHouse",
      description: "Aprenda a definir configurações no ClickHouse para consultas individuais, sessões de cliente ou usuários específicos usando os comandos `SET` e `ALTER USER`.",
      href: "/resources/support-center/knowledge-base/configuration-settings/configure-a-user-setting",
      category: "Configuration & settings",
      tags: ["Settings"]
    },
    {
      id: "materialized-views/projection-example",
      title: "Como confirmar se uma Projeção é usada pela consulta?",
      description: "Aprenda a verificar se uma projeção é usada em consultas do ClickHouse testando com dados de amostra e usando EXPLAIN para verificar o uso da projeção.",
      href: "/resources/support-center/knowledge-base/materialized-views/projection-example",
      category: "Materialized views & projections",
      tags: ["Data Modelling"]
    },
    {
      id: "cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      title: "Como conectar ao ClickHouse usando chaves SSH",
      description: "Como conectar ao ClickHouse e ao ClickHouse Cloud usando chaves SSH",
      href: "/resources/support-center/knowledge-base/cloud-services/how-to-connect-to-ch-cloud-using-ssh-keys",
      category: "Cloud",
      tags: ["Managing Cloud", "Security and Authentication"]
    },
    {
      id: "data-management/dictionary-using-strings",
      title: "Como Criar um Dicionário ClickHouse com Chaves e Valores do Tipo String",
      description: "Aprenda a criar um dicionário ClickHouse usando chaves e valores do tipo string de uma tabela MergeTree como fonte, com exemplos de configuração e uso.",
      href: "/resources/support-center/knowledge-base/data-management/dictionary-using-strings",
      category: "Gerenciamento de dados",
      tags: ["Data Modelling"]
    },
    {
      id: "tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      title: "Como criar uma tabela que consulte múltiplos clusters remotos",
      description: "Como criar uma tabela que consulte múltiplos clusters remotos",
      href: "/resources/support-center/knowledge-base/tables-schema/how-to-create-table-to-query-multiple-remote-clusters",
      category: "Tabelas e esquema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "setup-installation/enabling-ssl-with-lets-encrypt",
      title: "Como Habilitar SSL com Let's Encrypt em um Único Servidor ClickHouse",
      description: "Aprenda a configurar SSL para um único servidor ClickHouse usando Let's Encrypt, incluindo emissão de certificado, configuração e validação.",
      href: "/resources/support-center/knowledge-base/setup-installation/enabling-ssl-with-lets-encrypt",
      category: "Configuração e instalação",
      tags: ["Security and Authentication"]
    },
    {
      id: "data-import-export/file-export",
      title: "Como Exportar Dados do ClickHouse para um Arquivo",
      description: "Conheça os diferentes métodos para exportar dados do ClickHouse, incluindo `INTO OUTFILE`, o mecanismo de tabela File e redirecionamento por linha de comando.",
      href: "/resources/support-center/knowledge-base/data-import-export/file-export",
      category: "Importação e exportação de dados",
      tags: ["Data Export"]
    },
    {
      id: "queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      title: "Como filtrar uma tabela ClickHouse por uma coluna do tipo array?",
      description: "Artigo da base de conhecimento sobre como filtrar uma tabela ClickHouse por uma coluna do tipo array.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-filter-a-clickhouse-table-by-an-array-column",
      category: "Consultas e SQL",
      tags: ["Data Modelling", "Functions"]
    },
    {
      id: "monitoring-debugging/generate-har-file",
      title: "Como Gerar um Arquivo HAR para Suporte",
      description: "Um arquivo HAR (HTTP Archive) registra a atividade de rede do seu navegador. Ele pode ajudar nossa equipe de suporte a diagnosticar carregamentos lentos de página, requisições com falha ou outros problemas de rede.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/generate-har-file",
      category: "Monitoramento e depuração",
      tags: ["Tools and Utilities"]
    },
    {
      id: "materialized-views/how-to-display-queries-using-mv",
      title: "Como Identificar Consultas que Utilizam Visões Materializadas no ClickHouse",
      description: "Aprenda a consultar os logs do ClickHouse para identificar todas as consultas que envolvem visões materializadas em um intervalo de tempo determinado.",
      href: "/resources/support-center/knowledge-base/materialized-views/how-to-display-queries-using-mv",
      category: "Visões materializadas e projeções",
      tags: ["System Tables"]
    },
    {
      id: "performance-optimization/find-expensive-queries",
      title: "Como Identificar as Consultas Mais Custosas no ClickHouse",
      description: "Aprenda a usar a tabela `query_log` no ClickHouse para identificar as consultas com maior consumo de memória e CPU em nós distribuídos.",
      href: "/resources/support-center/knowledge-base/performance-optimization/find-expensive-queries",
      category: "Desempenho e otimização",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "configuration-settings/ignoring-incorrect-settings",
      title: "Como Ignorar Configurações Incorretas no ClickHouse",
      description: "Aprenda a usar a opção `skip_check_for_incorrect_settings` para permitir que o ClickHouse inicie mesmo quando configurações no nível do usuário estejam definidas incorretamente.",
      href: "/resources/support-center/knowledge-base/configuration-settings/ignoring-incorrect-settings",
      category: "Configuração e ajustes",
      tags: ["Settings"]
    },
    {
      id: "data-import-export/json-import",
      title: "Como importar JSON no ClickHouse?",
      description: "Esta página mostra como importar JSON no ClickHouse",
      href: "/resources/support-center/knowledge-base/data-import-export/json-import",
      category: "Importação e exportação de dados",
      tags: []
    },
    {
      id: "setup-installation/how-to-increase-thread-pool-size",
      title: "Como Aumentar o Número de Threads no ClickHouse",
      description: "Aprenda a configurar o pool de threads global no ClickHouse ajustando parâmetros como `max_thread_pool_size`, `thread_pool_queue_size` e `max_thread_pool_free_size`.",
      href: "/resources/support-center/knowledge-base/setup-installation/how-to-increase-thread-pool-size",
      category: "Configuração e instalação",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "data-import-export/kafka-to-clickhouse-setup",
      title: "Como Realizar a Ingestão de Dados do Kafka no ClickHouse",
      description: "Aprenda a realizar a ingestão de dados de um tópico Kafka no ClickHouse usando o mecanismo de tabela Kafka, visões materializadas e tabelas MergeTree.",
      href: "/resources/support-center/knowledge-base/data-import-export/kafka-to-clickhouse-setup",
      category: "Importação e exportação de dados",
      tags: ["Data Ingestion"]
    },
    {
      id: "data-import-export/ingest-parquet-files-in-s3",
      title: "Como realizar a ingestão de arquivos Parquet de um bucket S3",
      description: "Aprenda os fundamentos do uso do mecanismo de tabela S3 no ClickHouse para realizar a ingestão e consulta de arquivos Parquet de um bucket S3, incluindo configuração, permissões de acesso e exemplos de importação de dados.",
      href: "/resources/support-center/knowledge-base/data-import-export/ingest-parquet-files-in-s3",
      category: "Importação e exportação de dados",
      tags: ["Data Ingestion"]
    },
    {
      id: "queries-sql/how-to-insert-all-rows-from-another-table",
      title: "Como inserir todas as linhas de uma tabela em outra?",
      description: "Artigo da base de conhecimento sobre como inserir todas as linhas de uma tabela em outra.",
      href: "/resources/support-center/knowledge-base/queries-sql/how-to-insert-all-rows-from-another-table",
      category: "Consultas e SQL",
      tags: ["Data Ingestion"]
    },
    {
      id: "performance-optimization/check-query-processing-time-only",
      title: "Como Medir o Tempo de Processamento de Consultas Sem Retornar Linhas",
      description: "Aprenda a usar a opção `FORMAT Null` no ClickHouse para medir o tempo de processamento de consultas sem retornar nenhuma linha ao cliente.",
      href: "/resources/support-center/knowledge-base/performance-optimization/check-query-processing-time-only",
      category: "Desempenho e otimização",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "monitoring-debugging/outputSendLogsLevelTracesToFile",
      title: "Como redirecionar rastreamentos de nível de log para arquivo usando o clickhouse-client",
      description: "Como redirecionar rastreamentos de nível de log para arquivo usando o clickhouse-client",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/outputSendLogsLevelTracesToFile",
      category: "Monitoramento e depuração",
      tags: ["Data Export"]
    },
    {
      id: "tables-schema/recreate-table-across-terminals",
      title: "Como recriar rapidamente uma tabela pequena em diferentes terminais",
      description: "Aprenda a recriar rapidamente uma tabela pequena e seus dados em diferentes terminais usando copiar/colar em ambientes de desenvolvimento.",
      href: "/resources/support-center/knowledge-base/tables-schema/recreate-table-across-terminals",
      category: "Tabelas e esquema",
      tags: ["Tools and Utilities"]
    },
    {
      id: "integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      title: "Como configurar o ClickHouse no Docker com ODBC para conectar a um banco de dados Microsoft SQL Server (MSSQL)",
      description: "Como configurar o ClickHouse no Docker com ODBC para conectar a um banco de dados Microsoft SQL Server (MSSQL)",
      href: "/resources/support-center/knowledge-base/integrations/how-to-set-up-ch-on-docker-odbc-connect-mssql",
      category: "Integrações e bibliotecas de cliente",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "queries-sql/using-array-join-to-extract-and-query-attributes",
      title: "Como usar array join para extrair e consultar atributos variáveis usando chaves e valores de map",
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
      description: "Aprenda a importar arquivos GeoJSON com arrays de objetos profundamente aninhados no ClickHouse e consultar os dados de recursos aninhados.",
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
      title: "Exemplo rápido em Python usando o módulo HTTP requests",
      description: "Um exemplo usando Python e o módulo requests para gravar e ler dados no ClickHouse",
      href: "/resources/support-center/knowledge-base/integrations/python-http-requests",
      category: "Integrações e bibliotecas de cliente",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "configuration-settings/maximum-number-of-tables-and-databases",
      title: "Limites máximos recomendados de bancos de dados, tabelas, partições e partes no ClickHouse",
      description: "Conheça os limites máximos recomendados para bancos de dados, tabelas, partições e partes em um cluster ClickHouse para garantir desempenho ideal.",
      href: "/resources/support-center/knowledge-base/configuration-settings/maximum-number-of-tables-and-databases",
      category: "Configuração e definições",
      tags: ["Performance and Optimizations", "Deployments and Scaling"]
    },
    {
      id: "data-import-export/cannot-append-data-to-parquet-format",
      title: 'Resolvendo o erro "Cannot Append Data in Parquet Format" no ClickHouse',
      description: 'Está recebendo o erro "Cannot append data in format Parquet to file" no ClickHouse? Veja como resolvê-lo.',
      href: "/resources/support-center/knowledge-base/data-import-export/cannot-append-data-to-parquet-format",
      category: "Importação e exportação de dados",
      tags: ["Errors and Exceptions", "Data Formats"]
    },
    {
      id: "troubleshooting/exception-too-many-parts",
      title: 'Resolvendo o erro "Too Many Parts" no ClickHouse',
      description: 'Saiba como resolver o erro "Too many parts" no ClickHouse otimizando as taxas de inserção, configurando as definições do MergeTree e gerenciando partições de forma eficaz.',
      href: "/resources/support-center/knowledge-base/troubleshooting/exception-too-many-parts",
      category: "Solução de problemas e erros",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "troubleshooting/certificate-verify-failed-error",
      title: "Resolvendo o erro de verificação de certificado SSL no ClickHouse",
      description: "Saiba como resolver o erro SSL Exception CERTIFICATE_VERIFY_FAILED.",
      href: "/resources/support-center/knowledge-base/troubleshooting/certificate-verify-failed-error",
      category: "Solução de problemas e erros",
      tags: ["Security and Authentication", "Errors and Exceptions"]
    },
    {
      id: "troubleshooting/connection-timeout-remote-remoteSecure",
      title: "Resolvendo erros de timeout com as funções de tabela `remote` e `remoteSecure`",
      description: "Saiba como corrigir erros de timeout ao usar as funções de tabela `remote` ou `remoteSecure` no ClickHouse ajustando as configurações de timeout de conexão.",
      href: "/resources/support-center/knowledge-base/troubleshooting/connection-timeout-remote-remoteSecure",
      category: "Solução de problemas e erros",
      tags: ["Errors and Exceptions"]
    },
    {
      id: "tables-schema/search-across-node-for-tables-with-a-wildcard",
      title: "Pesquisando tabelas com curinga em múltiplos nós",
      description: "Saiba como pesquisar tabelas com curinga em múltiplos nós.",
      href: "/resources/support-center/knowledge-base/tables-schema/search-across-node-for-tables-with-a-wildcard",
      category: "Tabelas e esquema",
      tags: ["Deployments and Scaling"]
    },
    {
      id: "performance-optimization/query-max-execution-time",
      title: "Definindo um limite no tempo de execução de consultas",
      description: "Como impor um limite no tempo máximo de execução de consultas",
      href: "/resources/support-center/knowledge-base/performance-optimization/query-max-execution-time",
      category: "Desempenho e otimização",
      tags: ["Managing Cloud", "Settings"]
    },
    {
      id: "data-import-export/json-simple-example",
      title: "Exemplo simples de fluxo para extração de dados JSON usando uma tabela de entrada com uma visão materializada",
      description: "Exemplo simples de fluxo para extração de dados JSON usando uma tabela de entrada com uma visão materializada",
      href: "/resources/support-center/knowledge-base/data-import-export/json-simple-example",
      category: "Importação e exportação de dados",
      tags: ["Data Formats"]
    },
    {
      id: "performance-optimization/async-vs-optimize-read-in-order",
      title: "Leitura síncrona de dados",
      description:
        "A nova configuração `allow_asynchronous_read_from_io_pool_for_merge_tree` permite que o número de threads de leitura (streams) seja maior do que o número de threads no restante do pipeline de execução de consultas.",
      href: "/resources/support-center/knowledge-base/performance-optimization/async-vs-optimize-read-in-order",
      category: "Desempenho e otimização",
      tags: ["Settings", "Performance and Optimizations"]
    },
    {
      id: "integrations/terraform-example",
      title: "Exemplo com Terraform de como usar a API do Cloud",
      description: "Este guia apresenta um exemplo de como usar o Terraform para criar/excluir clusters usando a API",
      href: "/resources/support-center/knowledge-base/integrations/terraform-example",
      category: "Integrações e bibliotecas de cliente",
      tags: ["Native Clients and Interfaces"]
    },
    {
      id: "performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      title: "Dicas e truques para otimizar tipos de dados básicos no ClickHouse",
      description: "Dicas e truques para otimizar tipos de dados básicos no ClickHouse",
      href: "/resources/support-center/knowledge-base/performance-optimization/tips-tricks-optimizing-basic-data-types-in-clickhouse",
      category: "Desempenho e otimização",
      tags: ["Performance and Optimizations"]
    },
    {
      id: "queries-sql/useful-queries-for-troubleshooting",
      title: "Consultas úteis para solução de problemas",
      description: "Uma coleção de consultas práticas para solução de problemas no ClickHouse, incluindo monitoramento de tamanhos de tabelas, consultas de longa duração e erros.",
      href: "/resources/support-center/knowledge-base/queries-sql/useful-queries-for-troubleshooting",
      category: "Consultas e SQL",
      tags: ["Settings"]
    },
    {
      id: "general-faqs/use-clickhouse-for-log-analytics",
      title: "Usando o ClickHouse para análise de logs",
      description: "O ClickHouse é popular para análise de logs e métricas graças às suas capacidades de análise em tempo real. Quer saber mais?",
      href: "/resources/support-center/knowledge-base/general-faqs/use-clickhouse-for-log-analytics",
      category: "Geral e FAQs",
      tags: ["Use Cases"]
    },
    {
      id: "queries-sql/filtered-aggregates",
      title: "Usando agregações filtradas no ClickHouse",
      description: "Saiba como usar agregações filtradas no ClickHouse com os combinadores de agregação `-If` e `-Distinct` para simplificar a sintaxe de consultas e aprimorar análises.",
      href: "/resources/support-center/knowledge-base/queries-sql/filtered-aggregates",
      category: "Consultas e SQL",
      tags: ["Functions"]
    },
    {
      id: "general-faqs/dependencies",
      title: "Quais são as dependências de terceiros para executar o ClickHouse?",
      description: "O ClickHouse é autossuficiente e não possui dependências em tempo de execução",
      href: "/resources/support-center/knowledge-base/general-faqs/dependencies",
      category: "Geral e FAQs",
      tags: []
    },
    {
      id: "general-faqs/dbms-naming",
      title: 'O que significa "ClickHouse"?',
      description: 'Saiba o que significa "ClickHouse".',
      href: "/resources/support-center/knowledge-base/general-faqs/dbms-naming",
      category: "Geral e FAQs",
      tags: []
    },
    {
      id: "general-faqs/ne-tormozit",
      title: 'O que significa "не тормозит"?',
      description: 'Esta página explica o que significa "Не тормозит"',
      href: "/resources/support-center/knowledge-base/general-faqs/ne-tormozit",
      category: "Geral e FAQs",
      tags: []
    },
    {
      id: "integrations/oracle-odbc",
      title: "O que fazer se eu tiver um problema com codificações ao usar o Oracle via ODBC?",
      description: "Esta página fornece orientações sobre o que fazer se você tiver um problema com codificações ao usar o Oracle via ODBC",
      href: "/resources/support-center/knowledge-base/integrations/oracle-odbc",
      category: "Integrações e bibliotecas de cliente",
      tags: []
    },
    {
      id: "general-faqs/columnar-database",
      title: "O que é um banco de dados colunar?",
      description: "Esta página descreve o que é um banco de dados colunar",
      href: "/resources/support-center/knowledge-base/general-faqs/columnar-database",
      category: "Geral e FAQs",
      tags: []
    },
    {
      id: "general-faqs/olap",
      title: "O que é OLAP?",
      description: "Uma explicação sobre o que é Processamento Analítico Online (Online Analytical Processing)",
      href: "/resources/support-center/knowledge-base/general-faqs/olap",
      category: "Geral e FAQs",
      tags: []
    },
    {
      id: "performance-optimization/optimize-final-vs-final",
      title: "Qual é a diferença entre OPTIMIZE FINAL e FINAL?",
      description: "Discute as diferenças entre OPTIMIZE FINAL e FINAL, e quando usá-los ou evitá-los.",
      href: "/resources/support-center/knowledge-base/performance-optimization/optimize-final-vs-final",
      category: "Desempenho e otimização",
      tags: ["Conceitos Principais de Dados"]
    },
    {
      id: "general-faqs/sql",
      title: "Qual sintaxe SQL o ClickHouse suporta?",
      description: "O ClickHouse suporta 100% da sintaxe SQL",
      href: "/resources/support-center/knowledge-base/general-faqs/sql",
      category: "Geral e FAQs",
      tags: []
    },
    {
      id: "data-management/when-is-ttl-applied",
      title: "Quando as regras de TTL são aplicadas e temos controle sobre isso?",
      description:
        "As regras de TTL no ClickHouse acabam sendo aplicadas em algum momento, e você pode controlar quando elas são executadas usando a configuração `merge_with_ttl_timeout`. Aprenda a forçar a aplicação de TTL e a gerenciar threads em segundo plano para a execução de TTL.",
      href: "/resources/support-center/knowledge-base/data-management/when-is-ttl-applied",
      category: "Gerenciamento de dados",
      tags: ["Conceitos Principais de Dados"]
    },
    {
      id: "setup-installation/production",
      title: "Qual versão do ClickHouse usar em produção?",
      description: "Esta página fornece orientações sobre qual versão do ClickHouse usar em produção",
      href: "/resources/support-center/knowledge-base/setup-installation/production",
      category: "Configuração e instalação",
      tags: []
    },
    {
      id: "general-faqs/who-is-using-clickhouse",
      title: "Quem está usando o ClickHouse?",
      description: "Descreve quem está usando o ClickHouse",
      href: "/resources/support-center/knowledge-base/general-faqs/who-is-using-clickhouse",
      category: "Geral e FAQs",
      tags: []
    },
    {
      id: "data-management/dictionaries-consistent-state",
      title: "Por que não consigo ver meus dados em um dicionário no ClickHouse Cloud?",
      description: "Existe um problema em que os dados em dicionários podem não ficar visíveis imediatamente após a criação.",
      href: "/resources/support-center/knowledge-base/data-management/dictionaries-consistent-state",
      category: "Gerenciamento de dados",
      tags: ["Gerenciamento do Cloud", "Modelagem de Dados"]
    },
    {
      id: "general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      title: "Por que o ClickHouse Keeper é recomendado em vez do ZooKeeper?",
      description:
        "O ClickHouse Keeper aprimora o ZooKeeper com recursos como uso reduzido de espaço em disco, recuperação mais rápida e menor consumo de memória, oferecendo melhor desempenho para clusters do ClickHouse.",
      href: "/resources/support-center/knowledge-base/general-faqs/why-recommend-clickhouse-keeper-over-zookeeper",
      category: "Geral e FAQs",
      tags: ["Conceitos Principais de Dados"]
    },
    {
      id: "monitoring-debugging/why-default-logging-verbose",
      title: "Por que os logs do ClickHouse são tão detalhados por padrão?",
      description: "Entenda por que os desenvolvedores do ClickHouse optaram por definir um nível de log detalhado por padrão.",
      href: "/resources/support-center/knowledge-base/monitoring-debugging/why-default-logging-verbose",
      category: "Monitoramento e depuração",
      tags: ["Configurações"]
    },
    {
      id: "performance-optimization/why-is-my-primary-key-not-used",
      title: "Por que minha chave primária não é usada? Como posso verificar?",
      description: "Aborda um motivo comum pelo qual uma chave primária não é usada na ordenação e como podemos confirmar isso",
      href: "/resources/support-center/knowledge-base/performance-optimization/why-is-my-primary-key-not-used",
      category: "Desempenho e otimização",
      tags: ["Desempenho e Otimizações"]
    },
    {
      id: "general-faqs/mapreduce",
      title: "Por que não usar algo como o MapReduce?",
      description: "Esta página explica por que você usaria o ClickHouse em vez do MapReduce",
      href: "/resources/support-center/knowledge-base/general-faqs/mapreduce",
      category: "Geral e FAQs",
      tags: []
    }
  ]
}