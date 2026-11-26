import type { Localized, Project } from '@/content/types';

/**
 * Work done as a contractor. Only what the product's public site shows
 * (audience and module names) plus Felipe's role, in the wording of his
 * public LinkedIn profile. No internal mechanics or named third-party
 * integrations: those are for interviews.
 */
export const connexiccoProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'connexicco',
    title: 'Connexicco',
    summary:
      'Plataforma de comunidades digitais para empresas, evoluída para atender várias organizações ao mesmo tempo, cada uma com identidade visual e estrutura próprias. Fui responsável pelo frontend como Engenheiro Fullstack Pleno I na Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    media: [],
    role: 'Engenheiro Fullstack Pleno I, com foco em frontend: adaptação mobile completa, videoconferência integrada aos eventos online e participação nas decisões de arquitetura multi-tenant',
    problem:
      'Uma base de código existente precisava atender várias organizações ao mesmo tempo, cada uma com identidade visual e estrutura próprias, e ainda fechar diferenças de comportamento entre web e mobile.',
    solution:
      'Uma camada multi-tenant white-label que resolve a identidade visual e a estrutura de cada organização em tempo de execução, uma adaptação mobile completa da plataforma e integrações embarcadas, construídas em ciclos de experimentação com requisitos em evolução.',
    architectureHighlights: [
      'Identidade visual e estrutura de cada organização resolvidas em tempo de execução no frontend',
      'Módulos públicos do produto, com os nomes do site: Comunidade, Clubes de relacionamento, Educação, Eventos Online (com videoconferência integrada), Expertise as a Service e Soluções',
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
      'Integração da videoconferência no módulo de eventos online',
      'Participação nas decisões de arquitetura e nas provas de conceito para a customização multi-tenant',
    ],
    outcomes: [
      'Evolução de uma base single-tenant para multi-tenant white-label, atendendo várias organizações ao mesmo tempo',
      'Paridade funcional entre web e mobile depois da adaptação da plataforma',
    ],
    learnings: [
      'Requisitos de customização em evolução constante significam que provas de conceito primeiro valem mais do que uma arquitetura "final" definida de antemão',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'MUI'],
    tags: ['product', 'multi-tenant', 'white-label', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2024-12-01',
    updatedAt: '2025-10-01',
    featured: false,
    xpEvidence: [{ kind: 'production', href: 'https://www.connexicco.com/' }],
    links: [{ href: 'https://www.connexicco.com/', label: 'connexicco.com', external: true }],
  },
  en: {
    slug: 'connexicco',
    title: 'Connexicco',
    summary:
      'A digital community platform for companies, evolved to serve several organizations at once, each with its own visual identity and structure. I was responsible for its frontend as a Mid-level Fullstack Engineer (Pleno I) at Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    media: [],
    role: 'Mid-level Fullstack Engineer (Pleno I), frontend-focused: full mobile adaptation, video conferencing integrated into online events and participation in multi-tenant architecture decisions',
    problem:
      'An existing codebase needed to serve several organizations at once, each with its own visual identity and structure, while closing behavioural gaps between web and mobile.',
    solution:
      'A multi-tenant white-label layer that resolves each organization’s visual identity and structure at runtime, a full mobile adaptation of the platform, and embedded integrations, built through experimentation cycles against evolving requirements.',
    architectureHighlights: [
      'Each organization’s visual identity and structure resolved at runtime on the frontend',
      'The product’s public modules, named as on its site: Comunidade, Clubes de relacionamento, Educação, Eventos Online (with integrated video conferencing), Expertise as a Service and Soluções',
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
      'Integrating video conferencing into the online events module',
      'Participation in architecture decisions and proofs of concept for multi-tenant customization',
    ],
    outcomes: [
      'Evolved a single-tenant codebase into a multi-tenant white-label platform serving several organizations at once',
      'Functional parity between web and mobile after the platform adaptation',
    ],
    learnings: [
      'Constantly evolving customization requirements mean proofs of concept first are worth more than a "final" architecture decided upfront',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'MUI'],
    tags: ['product', 'multi-tenant', 'white-label', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2024-12-01',
    updatedAt: '2025-10-01',
    featured: false,
    xpEvidence: [{ kind: 'production', href: 'https://www.connexicco.com/' }],
    links: [{ href: 'https://www.connexicco.com/', label: 'connexicco.com', external: true }],
  },
};
