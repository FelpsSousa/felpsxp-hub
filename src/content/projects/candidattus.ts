import type { Localized, Project } from '@/content/types';

export const candidattusProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'candidattus',
    title: 'Candidattus',
    summary:
      'Plataforma SaaS nacional de inteligência eleitoral, com dashboards analíticos em tempo real sobre dezenas de milhões de registros eleitorais reais.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'data',
    secondaryDomains: ['backend', 'frontend'],
    media: [],
    role: 'Único desenvolvedor frontend na estruturação inicial da aplicação; depois em time de dois a três frontends, voltando a ser o único responsável pela frente na maior parte do segundo ano',
    problem:
      'Uma plataforma nacional de inteligência de dados políticos precisava transformar dezenas de milhões de registros eleitorais reais (votos, candidatos, partidos, zonas eleitorais) em dashboards analíticos legíveis e atualizados em tempo real, para candidatos, assessores, partidos, agências e administradores em todo o país durante o ciclo eleitoral de 2024.',
    solution:
      'Um frontend em React e Next.js com visualizações complexas: mapas de calor geográficos, mapa nacional hexagonal, gauges, nuvens de palavras, gráficos de dispersão e bolhas, cobrindo os módulos de Cockpit do Candidato, Estratégia e Gestão de Candidatura, Inteligência Política, Trajetória Política e Portfólio de Candidaturas, com integração de Power BI Embedded e de recursos de IA para apoio à interpretação dos dados.',
    architectureHighlights: [
      'Visualizações analíticas em tempo real sobre dezenas de milhões de registros eleitorais',
      'Componentes e funções customizadas em CSS onde as bibliotecas de gráficos não atendiam ao requisito',
      'Integração de Power BI Embedded reaproveitando a infraestrutura analítica já existente da empresa',
      'Produto alinhado à LGPD, com requisitos de segurança e confidencialidade no tratamento de dados sensíveis',
    ],
    challenges: [
      'Visualizações em tempo real sobre dezenas de milhões de registros eleitorais, sem degradar a performance',
      'Bibliotecas de gráficos não cobrindo alguns requisitos de visualização, exigindo componentes e funções customizadas',
      'Sustentar uma plataforma nacional de alto risco durante um ciclo eleitoral real, com exigências de LGPD, segurança e confidencialidade',
    ],
    responsibilities: [
      'Estruturação inicial da aplicação como único desenvolvedor frontend do projeto',
      'Desenvolvimento dos módulos de Cockpit do Candidato, Estratégia e Gestão de Candidatura, Inteligência Política, Trajetória Política e Portfólio de Candidaturas',
      'Interfaces para análises proprietárias: monitoramento de sentimento em redes sociais e fóruns em tempo real, diagnóstico eleitoral com Big Data e perfilamento demográfico e comportamental do eleitorado',
      'Integração de recursos de IA para geração de insights e apoio à interpretação dos dados',
    ],
    outcomes: [
      'Plataforma nacional usada por candidatos, assessores, partidos, agências e administradores durante o ciclo eleitoral de 2024',
      'Responsabilidade única pela frente frontend recuperada e mantida durante a maior parte do segundo ano do projeto',
    ],
    learnings: [
      'Continuidade técnica ao longo de um ciclo completo de produto e de uma renovação total de time ensina a escrever código e documentação pra outra pessoa dar manutenção, não só pra você mesmo',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'ApexCharts', 'ECharts', 'Power BI Embedded'],
    tags: ['product', 'data-visualization', 'election-intelligence', 'saas'],
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
      'A national election-intelligence SaaS platform, with real-time analytical dashboards over tens of millions of real electoral records.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'data',
    secondaryDomains: ['backend', 'frontend'],
    media: [],
    role: 'Sole frontend developer during the application’s initial build-out; later worked within a team of two to three frontends, returning as the sole owner of the frontend for most of the second year',
    problem:
      'A national political-intelligence platform needed to turn tens of millions of real electoral records (votes, candidates, parties, electoral zones) into legible, real-time analytical dashboards for candidates, advisors, parties, agencies, and administrators nationwide during the 2024 election cycle.',
    solution:
      'A React and Next.js frontend with complex visualizations: geographic heatmaps, a national hexagonal map, gauges, word clouds, scatter and bubble charts, covering the Candidate Cockpit, Campaign Strategy and Management, Political Intelligence, Political Trajectory, and Candidacy Portfolio modules, integrated with Power BI Embedded and AI-assisted data interpretation.',
    architectureHighlights: [
      'Real-time analytical visualizations over tens of millions of electoral records',
      'Custom CSS components and functions where charting libraries fell short of the requirement',
      'Power BI Embedded integration reusing the company’s existing analytics infrastructure',
      'LGPD-aligned product, with security and confidentiality requirements for sensitive data handling',
    ],
    challenges: [
      'Real-time visualizations over tens of millions of electoral records without degrading performance',
      'Charting libraries not covering some visualization requirements, requiring custom components and functions',
      'Sustaining a high-stakes national platform through a real election cycle, under LGPD, security, and confidentiality requirements',
    ],
    responsibilities: [
      'Initial application build-out as the project’s sole frontend developer',
      'Development of the Candidate Cockpit, Campaign Strategy and Management, Political Intelligence, Political Trajectory, and Candidacy Portfolio modules',
      'Interfaces for proprietary analyses: real-time social/forum sentiment monitoring, Big Data election diagnostics, and demographic/behavioral voter profiling',
      'AI feature integration for insight generation and data-interpretation support',
    ],
    outcomes: [
      'National platform used by candidates, advisors, parties, agencies, and administrators throughout the 2024 election cycle',
      'Regained and held sole ownership of the frontend for most of the project’s second year',
    ],
    learnings: [
      'Technical continuity across a full product lifecycle and a complete team turnover teaches you to write code and docs for someone else to maintain, not just yourself',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'ApexCharts', 'ECharts', 'Power BI Embedded'],
    tags: ['product', 'data-visualization', 'election-intelligence', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2023-10-01',
    updatedAt: '2025-10-01',
    featured: false,
    links: [{ href: 'https://candidattus.com', label: 'candidattus.com', external: true }],
  },
};
