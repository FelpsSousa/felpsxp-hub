import type { Localized, Project } from '@/content/types';

/**
 * Fictional demo project, disclosed via `isExample`: showcases the media
 * gallery before real projects have their own screenshots to show.
 */
export const exampleAuroraMetricsProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'example-aurora-metrics',
    title: 'Aurora Metrics',
    summary:
      'Um dashboard de observabilidade com métricas de serviço em tempo real, alertas e visão de saúde de infraestrutura.',
    status: 'evolving',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'observability',
    secondaryDomains: ['backend', 'data'],
    isExample: true,
    media: [
      {
        kind: 'image',
        url: '/mock-projects/aurora-overview.png',
        alt: 'Painel de visão geral do Aurora Metrics com requisições por minuto, latência p95, taxa de erro e status de serviços',
        caption: 'Visão geral de produção, atualizada quase em tempo real',
      },
      {
        kind: 'image',
        url: '/mock-projects/aurora-alerts.png',
        alt: 'Feed de alertas do Aurora Metrics classificados por severidade',
        caption: 'Feed de alertas, classificado por severidade, com deduplicação por tipo',
      },
    ],
    role: 'Fullstack solo: modelagem de dados, backend e dashboard',
    problem:
      'Equipes descobrindo incidente de produção só depois de reclamação de cliente, sem um painel único de saúde dos serviços.',
    solution:
      'Um dashboard central de métricas (requisição/min, latência p95, taxa de erro) com feed de alertas classificado por severidade, atualizado quase em tempo real.',
    architectureHighlights: [
      'Agregação de métricas em janelas deslizantes, não só snapshot pontual',
      'Feed de alertas com deduplicação por tipo, evitando repetição do mesmo incidente',
      'Cálculo de p95 direto sobre amostragem de latência, sem aproximação',
    ],
    challenges: [
      'Agregar métrica de alta cardinalidade sem estourar custo de armazenamento',
      'Definir threshold de alerta que não gere ruído (falso positivo) nem esconda incidente real',
    ],
    responsibilities: [
      'Design do modelo de dados de série temporal',
      'Construção do feed de alertas e das regras de severidade',
    ],
    outcomes: [
      'Detecção de degradação de serviço em minutos, não em reclamação de cliente',
      'Um painel único substituindo checagem manual espalhada em múltiplas ferramentas',
    ],
    learnings: [
      'Latência p95 conta uma história muito diferente da latência média, vale sempre mostrar as duas',
      'Alerta sem contexto (só o número) gera mais trabalho de investigação do que o necessário',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis'],
    tags: ['example', 'observability', 'dashboard', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2026-09-10',
    updatedAt: '2026-09-10',
    featured: false,
  },
  en: {
    slug: 'example-aurora-metrics',
    title: 'Aurora Metrics',
    summary:
      'An observability dashboard with real-time service metrics, alerting, and an infrastructure health view.',
    status: 'evolving',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'observability',
    secondaryDomains: ['backend', 'data'],
    isExample: true,
    media: [
      {
        kind: 'image',
        url: '/mock-projects/aurora-overview.png',
        alt: 'Aurora Metrics overview panel with requests per minute, p95 latency, error rate, and service status',
        caption: 'Production overview, updated near real-time',
      },
      {
        kind: 'image',
        url: '/mock-projects/aurora-alerts.png',
        alt: 'Aurora Metrics alert feed, classified by severity',
        caption: 'Alert feed, classified by severity, deduplicated by type',
      },
    ],
    role: 'Solo fullstack: data modeling, backend, and dashboard',
    problem:
      'Teams finding out about a production incident only after a customer complaint, with no single view of service health.',
    solution:
      'A central metrics dashboard (requests/min, p95 latency, error rate) with an alert feed classified by severity, updated near real-time.',
    architectureHighlights: [
      'Metric aggregation over sliding windows, not just a point-in-time snapshot',
      'Alert feed deduplicated by type, avoiding repeated noise for the same incident',
      'p95 computed directly over latency sampling, not approximated',
    ],
    challenges: [
      'Aggregating high-cardinality metrics without blowing up storage cost',
      'Setting an alert threshold that neither generates noise (false positives) nor hides a real incident',
    ],
    responsibilities: [
      'Time-series data model design',
      'Building the alert feed and its severity rules',
    ],
    outcomes: [
      'Service degradation detected in minutes, not via a customer complaint',
      'One single dashboard replacing manual checks spread across multiple tools',
    ],
    learnings: [
      'p95 latency tells a very different story from average latency - worth always showing both',
      'An alert with no context (just the number) creates more investigation work than necessary',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis'],
    tags: ['example', 'observability', 'dashboard', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2026-09-10',
    updatedAt: '2026-09-10',
    featured: false,
  },
};
