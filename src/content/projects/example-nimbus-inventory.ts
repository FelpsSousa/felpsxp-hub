import type { Localized, Project } from '@/content/types';

/**
 * Fictional demo project, disclosed via `isExample`: showcases the media
 * gallery before real projects have their own screenshots to show.
 */
export const exampleNimbusInventoryProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'example-nimbus-inventory',
    title: 'Nimbus Inventory',
    summary:
      'Um painel de controle de estoque pra pequenos e-commerces, com alerta de reposição e visão consolidada por armazém.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'foundational',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    isExample: true,
    media: [
      {
        kind: 'image',
        url: '/mock-projects/nimbus-inventory.png',
        alt: 'Tabela de inventário do Nimbus com SKU, produto, nível de estoque e status',
        caption: 'Inventário por armazém, nível de estoque visual por SKU',
      },
      {
        kind: 'image',
        url: '/mock-projects/nimbus-overview.png',
        alt: 'Painel de visão geral do Nimbus com total de SKUs, pedidos atendidos e gráfico de saúde do estoque',
        caption: 'Visão geral: saúde do estoque agregada em ok / baixo / crítico',
      },
    ],
    role: 'Fullstack solo: modelagem de dados e painel',
    problem:
      'Lojistas pequenos controlando estoque em planilha, descobrindo ruptura de estoque só quando o pedido já não pode ser atendido.',
    solution:
      'Um painel de inventário com nível de estoque visual por SKU, alerta automático abaixo de um limiar configurável, e visão consolidada de saúde do estoque.',
    architectureHighlights: [
      'Limiar de reposição configurável por produto, não um valor global fixo',
      'Visão agregada (ok / baixo / crítico) computada a partir do dado bruto de cada SKU',
    ],
    challenges: [
      'Modelar limiar de reposição que fizesse sentido tanto pra produto de giro rápido quanto lento',
      'Manter a tabela de inventário legível mesmo com centenas de SKUs',
    ],
    responsibilities: [
      'Modelagem de dados de produto, estoque e limiar de reposição',
      'Construção do painel e da visão agregada de saúde do estoque',
    ],
    outcomes: [
      'Alerta de reposição automático, substituindo checagem manual de planilha',
      'Visão consolidada de saúde do estoque em um único painel',
    ],
    learnings: [
      'Limiar de estoque fixo pra todo produto ignora a realidade de giro diferente por SKU',
      'Uma tabela densa e bem escaneável vale mais que um gráfico bonito quando a tarefa real é "o que preciso repor hoje"',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    tags: ['example', 'e-commerce', 'dashboard', 'inventory'],
    relatedSurfaceKeys: [],
    startedAt: '2026-09-10',
    updatedAt: '2026-09-10',
    featured: false,
  },
  en: {
    slug: 'example-nimbus-inventory',
    title: 'Nimbus Inventory',
    summary:
      'A stock-control panel for small e-commerce sellers, with restock alerts and a consolidated per-warehouse view.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'foundational',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    isExample: true,
    media: [
      {
        kind: 'image',
        url: '/mock-projects/nimbus-inventory.png',
        alt: 'Nimbus inventory table with SKU, product, stock level, and status',
        caption: 'Per-warehouse inventory, visual stock level by SKU',
      },
      {
        kind: 'image',
        url: '/mock-projects/nimbus-overview.png',
        alt: 'Nimbus overview panel with total SKUs, fulfilled orders, and a stock-health chart',
        caption: 'Overview: stock health aggregated into ok / low / critical',
      },
    ],
    role: 'Solo fullstack: data modeling and dashboard',
    problem:
      'Small sellers tracking stock in a spreadsheet, only finding out about a stockout once an order can no longer be fulfilled.',
    solution:
      'An inventory panel with a visual stock level per SKU, automatic alerts below a configurable threshold, and a consolidated stock-health view.',
    architectureHighlights: [
      'Restock threshold configurable per product, not one fixed global value',
      "Aggregated view (ok / low / critical) computed from each SKU's raw data",
    ],
    challenges: [
      'Modeling a restock threshold that made sense for both fast- and slow-moving products',
      'Keeping the inventory table readable even with hundreds of SKUs',
    ],
    responsibilities: [
      'Data modeling for products, stock, and restock thresholds',
      'Building the panel and the aggregated stock-health view',
    ],
    outcomes: [
      'Automatic restock alerts, replacing manual spreadsheet checks',
      'A consolidated stock-health view in a single panel',
    ],
    learnings: [
      'A single fixed stock threshold for every product ignores how differently each SKU actually moves',
      'A dense, scannable table beats a pretty chart when the real task is "what do I need to restock today"',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    tags: ['example', 'e-commerce', 'dashboard', 'inventory'],
    relatedSurfaceKeys: [],
    startedAt: '2026-09-10',
    updatedAt: '2026-09-10',
    featured: false,
  },
};
