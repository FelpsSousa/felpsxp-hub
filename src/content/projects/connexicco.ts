import type { Localized, Project } from '@/content/types';

/**
 * Work done as an employee. Kept deliberately general until the
 * confidentiality question is settled: no internal module names or
 * third-party integrations (Logs fact sheet, 2026-11-12, item 8).
 * Details are for interviews.
 */
export const connexiccoProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'connexicco',
    title: 'Connexicco',
    summary:
      'Plataforma de comunidades digitais para organizações, evoluída para uma arquitetura multi-tenant white-label. Trabalhei no frontend como Engenheiro Fullstack Pleno I na Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    media: [],
    role: 'Engenheiro Fullstack Pleno I, com foco em frontend: adaptação mobile, integrações embarcadas e participação nas decisões de arquitetura multi-tenant',
    problem:
      'Uma base de código existente precisava atender várias organizações ao mesmo tempo, cada uma com identidade visual e estrutura próprias, e ainda fechar diferenças de comportamento entre web e mobile.',
    solution:
      'Uma camada multi-tenant white-label que resolve a identidade visual e a estrutura de cada organização em tempo de execução, uma adaptação mobile completa da plataforma e integrações embarcadas, construídas em ciclos de experimentação com requisitos em evolução.',
    architectureHighlights: [
      'Identidade visual e estrutura de cada organização resolvidas em tempo de execução no frontend',
      'Reimplementação de embeds e funcionalidades que divergiam entre web e mobile',
      'Provas de conceito e escolha de ferramentas para viabilizar a customização entre organizações',
    ],
    challenges: [
      'Evoluir uma base single-tenant para multi-tenant sem quebrar o produto que já estava em produção',
      'Resolver identidade e estrutura por organização com requisitos de customização mudando constantemente',
      'Fechar divergências de comportamento entre as versões web e mobile',
    ],
    responsibilities: [
      'Adaptação mobile da plataforma',
      'Integrações embarcadas dentro da plataforma',
      'Participação nas decisões de arquitetura e nas provas de conceito para a customização multi-tenant',
    ],
    outcomes: [
      'Evolução de uma base single-tenant para multi-tenant white-label, atendendo várias organizações ao mesmo tempo',
      'Paridade funcional entre web e mobile depois da adaptação da plataforma',
    ],
    learnings: [
      'Requisitos de customização em evolução constante significam que provas de conceito primeiro valem mais do que uma arquitetura "final" definida de antemão',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'MUI', 'Strapi'],
    tags: ['product', 'multi-tenant', 'white-label', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2024-01-01',
    updatedAt: '2025-10-01',
    featured: false,
    links: [{ href: 'https://www.connexicco.com/', label: 'connexicco.com', external: true }],
  },
  en: {
    slug: 'connexicco',
    title: 'Connexicco',
    summary:
      'A digital community platform for organizations, evolved into a multi-tenant white-label architecture. I worked on its frontend as a Mid-level Fullstack Engineer (Pleno I) at Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    media: [],
    role: 'Mid-level Fullstack Engineer (Pleno I), frontend-focused: mobile adaptation, embedded integrations and participation in multi-tenant architecture decisions',
    problem:
      'An existing codebase needed to serve several organizations at once, each with its own visual identity and structure, while closing behavioural gaps between web and mobile.',
    solution:
      'A multi-tenant white-label layer that resolves each organization’s visual identity and structure at runtime, a full mobile adaptation of the platform, and embedded integrations, built through experimentation cycles against evolving requirements.',
    architectureHighlights: [
      'Each organization’s visual identity and structure resolved at runtime on the frontend',
      'Reimplementation of embeds and features that diverged between web and mobile',
      'Proofs of concept and tooling decisions to enable customization across organizations',
    ],
    challenges: [
      'Evolving a single-tenant codebase into multi-tenant without breaking the product already in production',
      'Resolving per-organization identity and structure against constantly changing customization requirements',
      'Closing behavioural gaps between the web and mobile versions',
    ],
    responsibilities: [
      'Mobile adaptation of the platform',
      'Embedded integrations within the platform',
      'Participation in architecture decisions and proofs of concept for multi-tenant customization',
    ],
    outcomes: [
      'Evolved a single-tenant codebase into a multi-tenant white-label platform serving several organizations at once',
      'Functional parity between web and mobile after the platform adaptation',
    ],
    learnings: [
      'Constantly evolving customization requirements mean proofs of concept first are worth more than a "final" architecture decided upfront',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'MUI', 'Strapi'],
    tags: ['product', 'multi-tenant', 'white-label', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2024-01-01',
    updatedAt: '2025-10-01',
    featured: false,
    links: [{ href: 'https://www.connexicco.com/', label: 'connexicco.com', external: true }],
  },
};
