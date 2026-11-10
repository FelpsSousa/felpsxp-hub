import type { Localized, Project } from '@/content/types';

export const connexiccoProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'connexicco',
    title: 'Connexicco',
    summary:
      'Plataforma de comunidades digitais corporativas, evoluída da base do Candidattus para arquitetura multi-tenant white-label, servindo múltiplas organizações simultaneamente com identidade visual e estrutura resolvidas em runtime.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    isExample: false,
    media: [],
    role: 'Adaptação mobile de toda a plataforma, integração de videoconferência embarcada e participação nas decisões de arquitetura para a customização multi-tenant',
    problem:
      'A base do Candidattus precisava evoluir para atender múltiplas organizações simultaneamente, cada uma com identidade visual e estrutura próprias, resolvidas em runtime no frontend, além de cobrir divergências de comportamento entre as versões web e mobile.',
    solution:
      'Uma camada multi-tenant white-label resolvendo identidade visual e estrutura por organização via headers e cookies, com adaptação mobile completa da plataforma e integração de salas de videoconferência embarcadas (primeiro Zoom Embedded, depois Jitsi), construída em ciclos de experimentação com requisitos em evolução constante. A plataforma transforma organizações em comunidades digitais, com módulos de Comunidade, Clubes de Relacionamento, Educação, Eventos Online, Expertise as a Service e Soluções, com conteúdo gerenciado via Strapi.',
    architectureHighlights: [
      'Identidade visual e estrutura multi-tenant resolvidas em runtime no frontend via headers e cookies',
      'Reimplementação de embeds e funcionalidades que divergiam entre web e mobile',
      'Integração de salas de videoconferência embarcadas, primeiro com Zoom Embedded e depois com Jitsi',
      'Provas de conceito e escolha de ferramentas para viabilizar a customização dinâmica entre organizações',
    ],
    challenges: [
      'Evoluir uma base single-tenant pra multi-tenant sem quebrar o produto single-tenant já em produção',
      'Resolver identidade e estrutura por organização em runtime, com requisitos de customização mudando constantemente',
      'Fechar divergências de comportamento entre as versões web e mobile',
    ],
    responsibilities: [
      'Responsável pela adaptação mobile de toda a plataforma',
      'Integração das salas de videoconferência embarcadas dentro da plataforma',
      'Participação nas decisões de arquitetura e nas provas de conceito para a customização multi-tenant',
    ],
    outcomes: [
      'Evolução bem-sucedida de uma base single-tenant para multi-tenant white-label, atendendo múltiplas organizações simultaneamente',
      'Paridade funcional entre web e mobile alcançada após a adaptação completa da plataforma',
    ],
    learnings: [
      'Requisitos de customização em evolução constante significam que provas de conceito primeiro valem mais do que uma arquitetura "final" definida de antemão',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'MUI', 'Strapi', 'Zoom Embedded', 'Jitsi'],
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
      'A corporate digital community platform, evolved from the Candidattus codebase into a multi-tenant white-label architecture, serving multiple organizations simultaneously with visual identity and structure resolved at runtime.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'applied',
    primaryDomain: 'backend',
    secondaryDomains: ['frontend'],
    isExample: false,
    media: [],
    role: 'Mobile adaptation of the entire platform, embedded video-conferencing integration, and participation in architecture decisions for multi-tenant customization',
    problem:
      'The Candidattus codebase needed to evolve to serve multiple organizations simultaneously, each with its own visual identity and structure, resolved at runtime on the frontend, while also closing behavioral gaps between the web and mobile versions.',
    solution:
      'A multi-tenant white-label layer resolving visual identity and structure per organization via headers and cookies, with a full mobile adaptation of the platform and embedded video-conferencing rooms (first Zoom Embedded, then Jitsi), built through experimentation cycles against constantly evolving requirements. The platform turns organizations into digital communities, with modules for Community, Relationship Clubs, Education, Online Events, Expertise as a Service, and Solutions, with content managed in Strapi.',
    architectureHighlights: [
      'Multi-tenant visual identity and structure resolved at runtime on the frontend via headers and cookies',
      'Reimplementation of embeds and features that diverged between web and mobile',
      'Embedded video-conferencing room integration, first with Zoom Embedded and later with Jitsi',
      'Proofs of concept and tooling decisions to enable dynamic customization across organizations',
    ],
    challenges: [
      'Evolving a single-tenant codebase into multi-tenant without breaking the single-tenant product already in production',
      'Resolving per-organization identity and structure at runtime, against constantly changing customization requirements',
      'Closing behavioral gaps between the web and mobile versions',
    ],
    responsibilities: [
      'Owned the mobile adaptation of the entire platform',
      'Integrated embedded video-conferencing rooms into the platform',
      'Participated in architecture decisions and proofs of concept for multi-tenant customization',
    ],
    outcomes: [
      'Successfully evolved a single-tenant codebase into a multi-tenant white-label platform serving multiple organizations simultaneously',
      'Reached functional parity between web and mobile after the full platform adaptation',
    ],
    learnings: [
      'Constantly evolving customization requirements mean proofs of concept first are worth more than a "final" architecture decided upfront',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'MUI', 'Strapi', 'Zoom Embedded', 'Jitsi'],
    tags: ['product', 'multi-tenant', 'white-label', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2024-01-01',
    updatedAt: '2025-10-01',
    featured: false,
    links: [{ href: 'https://www.connexicco.com/', label: 'connexicco.com', external: true }],
  },
};
