import type { Localized, Project } from '@/content/types';

/**
 * Fictional demo project, disclosed via `isExample`: shows how the media
 * gallery (Project.media) reads once populated, before any real project
 * has media of its own. Never remove that flag from a project like this one.
 */
export const exampleTaskflowProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'example-taskflow',
    title: 'TaskFlow',
    summary:
      'Um dashboard de gestão de tarefas em tempo real, com quadro Kanban colaborativo e métricas de velocidade de equipe.',
    status: 'active',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'frontend',
    secondaryDomains: ['backend'],
    isExample: true,
    media: [
      {
        kind: 'image',
        url: '/mock-projects/taskflow-board.png',
        alt: 'Quadro Kanban do TaskFlow com colunas Backlog, Em progresso, Revisão e Concluído',
        caption: 'Quadro principal, sincronizado em tempo real entre sessões',
      },
      {
        kind: 'image',
        url: '/mock-projects/taskflow-velocity.png',
        alt: 'Painel de métricas de velocidade do TaskFlow com gráfico de tarefas concluídas por semana',
        caption:
          'Relatório de velocidade, computado a partir do histórico real de movimentação de cards',
      },
    ],
    role: 'Fullstack solo: do design ao deploy',
    problem:
      'Times pequenos gerenciando sprints em planilhas ou ferramentas genéricas demais, sem visibilidade real de gargalo ou velocidade.',
    solution:
      'Um quadro Kanban em tempo real (WebSocket) com métricas de ciclo e vazão calculadas automaticamente a partir do próprio fluxo de cards, sem apontamento manual.',
    architectureHighlights: [
      'Sincronização em tempo real via WebSocket, sem polling',
      'Métricas de velocidade calculadas direto do histórico de movimentação de cards',
      'Componentes de UI reaproveitados entre o quadro e os relatórios',
    ],
    challenges: [
      'Manter drag-and-drop fluido com atualização em tempo real de múltiplos usuários simultâneos',
      'Calcular métricas de ciclo sem duplicar lógica entre frontend e backend',
    ],
    responsibilities: [
      'Arquitetura frontend e do fluxo de sincronização em tempo real',
      'Modelagem de dados de tarefas, colunas e histórico de movimentação',
    ],
    outcomes: [
      'Quadro funcional com sincronização em tempo real entre múltiplas sessões',
      'Dashboard de velocidade computado a partir de dado real de movimentação, não estimativa manual',
    ],
    learnings: [
      'Sincronização otimista de UI reduz a percepção de latência mesmo com round-trip real ao servidor',
      'Métrica derivada de evento bruto é mais confiável do que apontamento manual de horas',
    ],
    stack: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'PostgreSQL'],
    tags: ['example', 'saas', 'productivity', 'dashboard'],
    relatedSurfaceKeys: [],
    startedAt: '2026-09-10',
    updatedAt: '2026-09-10',
    featured: false,
  },
  en: {
    slug: 'example-taskflow',
    title: 'TaskFlow',
    summary:
      'A real-time task management dashboard with a collaborative Kanban board and team velocity metrics.',
    status: 'active',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'frontend',
    secondaryDomains: ['backend'],
    isExample: true,
    media: [
      {
        kind: 'image',
        url: '/mock-projects/taskflow-board.png',
        alt: 'TaskFlow Kanban board with Backlog, In progress, Review, and Done columns',
        caption: 'Main board, synced in real time across sessions',
      },
      {
        kind: 'image',
        url: '/mock-projects/taskflow-velocity.png',
        alt: 'TaskFlow velocity dashboard with a chart of tasks completed per week',
        caption: 'Velocity report, computed from real card-movement history',
      },
    ],
    role: 'Solo fullstack: design through deploy',
    problem:
      'Small teams managing sprints in spreadsheets or overly generic tools, with no real visibility into bottlenecks or velocity.',
    solution:
      'A real-time Kanban board (WebSocket) with cycle-time and throughput metrics computed automatically from the card flow itself, no manual time tracking.',
    architectureHighlights: [
      'Real-time sync via WebSocket, no polling',
      'Velocity metrics computed directly from card-movement history',
      'UI components reused between the board and the reports',
    ],
    challenges: [
      'Keeping drag-and-drop smooth with real-time updates from multiple concurrent users',
      'Computing cycle-time metrics without duplicating logic between frontend and backend',
    ],
    responsibilities: [
      'Frontend architecture and the real-time sync flow',
      'Data modeling for tasks, columns, and movement history',
    ],
    outcomes: [
      'A working board with real-time sync across multiple sessions',
      'A velocity dashboard computed from real movement data, not manual estimation',
    ],
    learnings: [
      'Optimistic UI sync reduces perceived latency even with a real server round-trip',
      'A metric derived from raw events is more trustworthy than manually logged hours',
    ],
    stack: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'PostgreSQL'],
    tags: ['example', 'saas', 'productivity', 'dashboard'],
    relatedSurfaceKeys: [],
    startedAt: '2026-09-10',
    updatedAt: '2026-09-10',
    featured: false,
  },
};
