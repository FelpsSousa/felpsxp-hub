import type { Localized, Project } from '@/content/types';

export const felpsxpPlatformProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'felpsxp-platform',
    title: 'FelpsXP Platform',
    summary:
      'O núcleo privado do ecossistema, com dois papéis: o CORE que todos os módulos consomem (IAM, banco, eventos, contratos e observabilidade) e o observatório que monitora cada aplicação, com segurança de aplicação em todas as camadas.',
    status: 'evolving',
    visibility: 'public',
    type: 'platform',
    difficulty: 'frontier',
    primaryDomain: 'iam',
    secondaryDomains: ['appsec', 'backend'],
    media: [],
    role: 'Arquitetura, estrutura do repositório, base de runtime e fundação compartilhada',
    problem:
      'O ecossistema precisava de uma fundação técnica durável antes que superfícies voltadas ao usuário pudessem surgir com consistência e coerência de longo prazo.',
    solution:
      'Hoje: um monólito modular em monorepo, com runtime, IAM e acesso por organização v0, pacote de observabilidade compartilhado e diretrizes de arquitetura. Próxima etapa: o observatório e centro de controle de todas as aplicações FelpsXP (Hub, Finance, Sentinel e os próximos módulos), com ingestão de eventos assinados por aplicação, dados de segurança em camadas de retenção, dashboards e alertas. Privada por desenho, porque guarda dados brutos de segurança.',
    architectureHighlights: [
      'Monólito modular com workers: regras de domínio vivem em pacotes, nunca dentro de uma borda de runtime',
      'API HTTP sem framework web: Node puro cobre a superfície de rotas atual sem dependência extra',
      'Pacote de observabilidade compartilhado: logging estruturado, correlação e redação recursiva de campos sensíveis',
      'Camadas de contrato separadas para HTTP e eventos, versionadas à parte das regras que as implementam',
      'Um único Postgres com separação por schema de domínio, em vez de um banco por domínio',
    ],
    challenges: [
      'Construir uma fundação compartilhada antes de existir uma superfície consumidora real para validar as decisões contra requisitos concretos',
      'Decidir o que pertence à Platform compartilhada versus o que deveria viver dentro de cada módulo',
    ],
    responsibilities: [
      'Definir a estrutura modular do monorepo',
      'Estabelecer as bases de runtime, logging e configuração',
      'Criar documentação arquitetural e direção de governança',
      'Preparar a camada técnica que as futuras superfícies vão consumir',
    ],
    outcomes: [
      'O propósito ficou definido: CORE e observatório de todas as aplicações. O Hub passou a ser independente dela e vai mostrar só agregados anônimos do que ela observa; o Sentinel está saindo para repositório próprio',
      'Três cópias independentes do mesmo logger foram centralizadas num pacote único, coberto por testes automatizados, com uma capacidade que nenhuma das três tinha: redigir campos sensíveis antes de serializar',
      'O limite da API passou a ser exercitado como contrato externo de verdade: um produto em repositório separado consome a plataforma só por ela, sem acesso ao código nem ao banco',
    ],
    learnings: [
      'Construir infraestrutura "como protagonista" primeiro, e depois recuar deliberadamente pra "camada habilitadora" assim que o Hub surgiu, foi o sequenciamento certo: trabalho de fundação é fácil de superinvestir sem um consumidor real puxando os requisitos',
      'O gatilho pra centralizar já tinha disparado três vezes antes de alguém agir: o mesmo logger existia copiado em três serviços, e a duplicação só virou tarefa quando foi medida. Ao extrair, apareceu uma falha real que nenhuma das cópias tratava: nenhuma redigia credencial antes de escrever a linha de log',
    ],
    stack: [
      'TypeScript',
      'Node.js',
      'pnpm',
      'Turborepo',
      'Prisma',
      'PostgreSQL',
      'Vitest',
      'Biome',
    ],
    tags: ['platform', 'monorepo', 'runtime', 'observability', 'iam'],
    relatedSurfaceKeys: ['platform', 'hub'],
    startedAt: '2026-03-31',
    updatedAt: '2026-09-28',
    featured: true,
  },
  en: {
    slug: 'felpsxp-platform',
    title: 'FelpsXP Platform',
    summary:
      'The ecosystem’s private core, with two roles: the CORE every module consumes (IAM, database, events, contracts and observability) and the observatory that watches each application, with application security in every layer.',
    status: 'evolving',
    visibility: 'public',
    type: 'platform',
    difficulty: 'frontier',
    primaryDomain: 'iam',
    secondaryDomains: ['appsec', 'backend'],
    media: [],
    role: 'Architecture, repository structure, runtime baseline, and shared foundation',
    problem:
      'The ecosystem needed a durable technical foundation before meaningful user-facing surfaces could emerge with consistency and long-term coherence.',
    solution:
      'Today: a modular monolith in a monorepo, with runtime support, IAM and organization access v0, a shared observability package and architectural guardrails. Next: the observatory and control centre for every FelpsXP application (Hub, Finance, Sentinel and the modules that follow), with signed per-application event ingestion, security data in retention tiers, dashboards and alerts. Private by design, because it holds raw security data.',
    architectureHighlights: [
      'Modular monolith with workers: domain rules live in packages, never inside a runtime edge',
      'HTTP API with no web framework: plain Node covers the current routing surface without an extra dependency',
      'Shared observability package: structured logging, correlation, and recursive redaction of credential-shaped fields',
      'Separate HTTP and event contract layers, versioned apart from the rules that implement them',
      'A single Postgres instance with schema-per-domain separation, rather than a database per domain',
    ],
    challenges: [
      'Building a shared foundation before a real consuming surface existed to validate decisions against concrete requirements',
      'Deciding what belongs in the shared Platform versus what should live inside each module',
    ],
    responsibilities: [
      'Define the modular structure of the monorepo',
      'Establish runtime, logging, and configuration baselines',
      'Create architectural documentation and governance direction',
      'Prepare the technical layer that future surfaces consume',
    ],
    outcomes: [
      'Its purpose is now settled: CORE and observatory for every application. The Hub became independent of it and will show only anonymous aggregates of what it observes; Sentinel is moving to its own repository',
      'Three independent copies of the same logger were centralized into one package, covered by automated tests, with a capability none of the three had: redacting sensitive fields before serializing',
      'The API boundary is now exercised as a real external contract: a product in a separate repository consumes the platform only through it, with no access to its source or database',
    ],
    learnings: [
      'Building infrastructure "as protagonist" first, then deliberately stepping back into an enabling layer once Hub emerged, was the right sequencing - foundation work is easy to over-invest in without a real consumer pulling requirements',
      'The trigger to centralize had already fired three times before anyone acted: the same logger existed, copied, in three services, and the duplication only became a task once it was measured. Extracting it surfaced a real gap none of the copies handled - not one redacted credentials before writing a log line',
    ],
    stack: [
      'TypeScript',
      'Node.js',
      'pnpm',
      'Turborepo',
      'Prisma',
      'PostgreSQL',
      'Vitest',
      'Biome',
    ],
    tags: ['platform', 'monorepo', 'runtime', 'observability', 'iam'],
    relatedSurfaceKeys: ['platform', 'hub'],
    startedAt: '2026-03-31',
    updatedAt: '2026-09-28',
    featured: true,
  },
};
