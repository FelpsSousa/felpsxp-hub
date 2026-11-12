import type { Localized, Project } from '@/content/types';

/**
 * Work done as an employee. Kept deliberately general until the
 * confidentiality question is settled: no data volumes, internal module
 * names, client cycles or third-party integrations (Logs fact sheet,
 * 2026-11-12, item 8). Details are for interviews.
 */
export const candidattusProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'candidattus',
    title: 'Candidattus',
    summary:
      'Produto SaaS de inteligência de dados políticos, com dashboards analíticos. Trabalhei no frontend como Engenheiro Fullstack Pleno I na Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'data',
    secondaryDomains: ['backend', 'frontend'],
    media: [],
    role: 'Engenheiro Fullstack Pleno I, com foco em frontend, de outubro de 2023 a outubro de 2025',
    problem:
      'Um produto de inteligência de dados políticos precisava transformar dados eleitorais em dashboards analíticos legíveis para os seus usuários.',
    solution:
      'Um frontend em React e Next.js com visualizações de dados variadas (mapas, indicadores e gráficos de vários tipos), construído para continuar legível e rápido com grandes volumes de dados.',
    architectureHighlights: [
      'Dashboards analíticos com visualizações de vários tipos, em React e Next.js',
      'Componentes e funções customizadas em CSS onde as bibliotecas de gráficos não atendiam ao requisito',
      'Produto alinhado à LGPD, com requisitos de segurança e confidencialidade no tratamento de dados sensíveis',
    ],
    challenges: [
      'Manter as visualizações rápidas e legíveis com grandes volumes de dados',
      'Bibliotecas de gráficos que não cobriam alguns requisitos de visualização, exigindo componentes próprios',
      'Trabalhar sob exigências de LGPD, segurança e confidencialidade',
    ],
    responsibilities: [
      'Estruturação e evolução do frontend da aplicação',
      'Desenvolvimento de módulos analíticos e de suas visualizações',
      'Integração com recursos de apoio à interpretação dos dados',
    ],
    outcomes: [
      'Frontend mantido ao longo dos dois anos, atravessando uma renovação completa do time',
    ],
    learnings: [
      'Continuidade técnica ao longo de um ciclo completo de produto e de uma renovação total de time ensina a escrever código e documentação pra outra pessoa dar manutenção, não só pra você mesmo',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'ApexCharts', 'ECharts'],
    tags: ['product', 'data-visualization', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2023-10-01',
    updatedAt: '2025-10-01',
    featured: false,
    links: [{ href: 'https://candidattus.com', label: 'candidattus.com', external: true }],
  },
  en: {
    slug: 'candidattus',
    title: 'Candidattus',
    summary:
      'A political data intelligence SaaS product with analytical dashboards. I worked on its frontend as a Mid-level Fullstack Engineer (Pleno I) at Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'data',
    secondaryDomains: ['backend', 'frontend'],
    media: [],
    role: 'Mid-level Fullstack Engineer (Pleno I), frontend-focused, October 2023 to October 2025',
    problem:
      'A political data intelligence product needed to turn electoral data into legible analytical dashboards for its users.',
    solution:
      'A React and Next.js frontend with varied data visualizations (maps, indicators and many kinds of charts), built to stay legible and fast over large volumes of data.',
    architectureHighlights: [
      'Analytical dashboards with many kinds of visualizations, in React and Next.js',
      'Custom CSS components and functions where charting libraries fell short of the requirement',
      'LGPD-aligned product, with security and confidentiality requirements for sensitive data handling',
    ],
    challenges: [
      'Keeping visualizations fast and legible over large volumes of data',
      'Charting libraries that did not cover some visualization requirements, calling for custom components',
      'Working under LGPD, security and confidentiality requirements',
    ],
    responsibilities: [
      'Building and evolving the application’s frontend',
      'Developing analytical modules and their visualizations',
      'Integrating features that help users interpret the data',
    ],
    outcomes: ['Frontend maintained throughout the two years, across a complete team turnover'],
    learnings: [
      'Technical continuity across a full product lifecycle and a complete team turnover teaches you to write code and docs for someone else to maintain, not just yourself',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'ApexCharts', 'ECharts'],
    tags: ['product', 'data-visualization', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2023-10-01',
    updatedAt: '2025-10-01',
    featured: false,
    links: [{ href: 'https://candidattus.com', label: 'candidattus.com', external: true }],
  },
};
