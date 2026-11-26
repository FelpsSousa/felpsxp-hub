import type { Localized, Project } from '@/content/types';

/**
 * Work done as a contractor. Only what the product's public site shows
 * (audience, module and solution names, real-time monitoring, data at the
 * scale of tens of millions of records, LGPD) plus Felipe's role, in the
 * wording of his public LinkedIn profile. No internal mechanics, named
 * third-party integrations or business numbers: those are for interviews.
 */
export const candidattusProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'candidattus',
    title: 'Candidattus',
    summary:
      'Plataforma SaaS de inteligência eleitoral para agências, partidos, candidatos e doadores, com dashboards analíticos e monitoramento em tempo real, usada nas eleições de 2024. Fui responsável pelo frontend como Engenheiro Fullstack Pleno I na Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'data',
    secondaryDomains: ['backend', 'frontend'],
    media: [],
    role: 'Engenheiro Fullstack Pleno I, com foco em frontend, no Candidattus de outubro de 2023 a dezembro de 2024: entrei como único desenvolvedor frontend e estruturei a aplicação',
    problem:
      'Um produto de inteligência de dados políticos precisava transformar dados eleitorais em dashboards analíticos legíveis para os seus usuários.',
    solution:
      'Um frontend em React e Next.js com visualizações de dados variadas (mapas, indicadores e gráficos de vários tipos), construído para continuar legível e rápido sobre dezenas de milhões de registros eleitorais.',
    architectureHighlights: [
      'Dashboards analíticos com visualizações de vários tipos, em React e Next.js',
      'Módulos públicos do produto, com os nomes do site: Cockpit do Candidato, Estratégia de Candidatura, Gestão da Candidatura, Inteligência Política, Trajetória Política e Portfólio de Candidaturas; soluções Candidato Preferido, Politica Vox, Arquétipo Político e Diagnóstico Político',
      'Componentes e funções customizadas em CSS onde as bibliotecas de gráficos não atendiam ao requisito',
      'Produto alinhado à LGPD, com requisitos de segurança e confidencialidade no tratamento de dados sensíveis',
    ],
    challenges: [
      'Manter as visualizações rápidas e legíveis com grandes volumes de dados',
      'Bibliotecas de gráficos que não cobriam alguns requisitos de visualização, exigindo componentes próprios',
      'Trabalhar sob exigências de LGPD, segurança e confidencialidade',
    ],
    responsibilities: [
      'Escolha da stack e estruturação da arquitetura do frontend',
      'Evolução do frontend até o fim do ciclo eleitoral de 2024',
      'Onboarding de quem entrou no time e revisão de pull requests para merge com deploy automático, inclusive do backend',
      'Desenvolvimento de módulos analíticos e de suas visualizações',
      'Integração com recursos de apoio à interpretação dos dados',
    ],
    outcomes: [
      'Frontend estruturado no início do produto e mantido até o fim do ciclo eleitoral de 2024, com o time mudando ao redor',
    ],
    learnings: [
      'Continuidade técnica ao longo de um ciclo completo de produto e de mudanças no time ensina a escrever código e documentação pra outra pessoa dar manutenção, não só pra você mesmo',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'ApexCharts', 'ECharts'],
    tags: ['product', 'data-visualization', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2023-10-01',
    updatedAt: '2024-12-31',
    featured: true,
    xpEvidence: [{ kind: 'production', href: '#outcomes' }],
    links: [{ href: 'https://candidattus.com', label: 'candidattus.com', external: true }],
  },
  en: {
    slug: 'candidattus',
    title: 'Candidattus',
    summary:
      'An electoral intelligence SaaS platform for agencies, parties, candidates and donors, with analytical dashboards and real-time monitoring, used in the 2024 elections. I was responsible for its frontend as a Mid-level Fullstack Engineer (Pleno I) at Algoricca Software Company.',
    status: 'archived',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'data',
    secondaryDomains: ['backend', 'frontend'],
    media: [],
    role: 'Mid-level Fullstack Engineer (Pleno I), frontend-focused, on Candidattus from October 2023 to December 2024: I joined as the only frontend developer and structured the application',
    problem:
      'A political data intelligence product needed to turn electoral data into legible analytical dashboards for its users.',
    solution:
      'A React and Next.js frontend with varied data visualizations (maps, indicators and many kinds of charts), built to stay legible and fast over tens of millions of electoral records.',
    architectureHighlights: [
      'Analytical dashboards with many kinds of visualizations, in React and Next.js',
      'The product’s public modules, named as on its site: Cockpit do Candidato, Estratégia de Candidatura, Gestão da Candidatura, Inteligência Política, Trajetória Política and Portfólio de Candidaturas; solutions Candidato Preferido, Politica Vox, Arquétipo Político and Diagnóstico Político',
      'Custom CSS components and functions where charting libraries fell short of the requirement',
      'LGPD-aligned product, with security and confidentiality requirements for sensitive data handling',
    ],
    challenges: [
      'Keeping visualizations fast and legible over large volumes of data',
      'Charting libraries that did not cover some visualization requirements, calling for custom components',
      'Working under LGPD, security and confidentiality requirements',
    ],
    responsibilities: [
      'Choosing the stack and structuring the frontend architecture',
      'Evolving the frontend through the end of the 2024 election cycle',
      'Onboarding everyone who joined the team and reviewing pull requests for merge with automatic deployment, backend ones included',
      'Developing analytical modules and their visualizations',
      'Integrating features that help users interpret the data',
    ],
    outcomes: [
      'Frontend structured at the start of the product and maintained through the end of the 2024 election cycle, while the team changed around it',
    ],
    learnings: [
      'Technical continuity across a full product lifecycle and a changing team teaches you to write code and docs for someone else to maintain, not just yourself',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'ApexCharts', 'ECharts'],
    tags: ['product', 'data-visualization', 'saas'],
    relatedSurfaceKeys: [],
    startedAt: '2023-10-01',
    updatedAt: '2024-12-31',
    featured: true,
    xpEvidence: [{ kind: 'production', href: '#outcomes' }],
    links: [{ href: 'https://candidattus.com', label: 'candidattus.com', external: true }],
  },
};
