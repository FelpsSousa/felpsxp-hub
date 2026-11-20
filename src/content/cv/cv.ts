import type { Cv, Localized } from '@/content/types';

/**
 * The public CV (ADR-0010). Written from the master CV variant and its
 * verified facts; the claim-to-fact map stays in the private repository.
 * When this changes, the master LaTeX variant follows it.
 *
 * Public posture, the same as the project pages and the LinkedIn profile:
 * the former employer's products are described with what their public
 * sites show plus Felipe's role, without internal mechanics or named
 * third-party integrations. No phone number and no personal e-mail: the
 * page links to the site's own contact address.
 */
export const cvByLocale: Localized<Cv> = {
  pt: {
    name: 'Felipe Luis Rodrigues Sousa',
    headline: 'Desenvolvedor Fullstack com foco em frontend',
    stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    location: 'Brasília, DF, Brasil',
    summary: [
      'Dois anos (outubro de 2023 a outubro de 2025) como Engenheiro Fullstack Pleno I, com foco em frontend, na Algoricca Software Company, remoto.',
      'Frontend de dois produtos SaaS: inteligência eleitoral (Candidattus) e comunidades corporativas multi-tenant white-label (Connexicco).',
      'Hoje mantenho um app financeiro multi-tenant em produção, com isolamento por casa via Row-Level Security no PostgreSQL.',
      'Controle de acesso como linha contínua: projeto acadêmico em 2017, controle de acesso por perfil em 2021 e IAM na plataforma própria.',
      'Trabalho com agente de IA (Claude Code) sob regras escritas: ADR antes do código, um pull request por etapa com revisão humana e hooks de segredo.',
    ],
    skills: [
      {
        area: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Styled-Components', 'MUI', 'Storybook', 'React Native e Expo Router'],
      },
      { area: 'Dados e visualização', items: ['ApexCharts', 'ECharts', 'Recharts', 'Dashboards'] },
      { area: 'Testes e qualidade', items: ['Vitest', 'Playwright', 'axe (WCAG 2.2 AA)', 'Jest', 'Biome', 'ESLint'] },
      {
        area: 'Backend',
        items: ['Node.js', 'tRPC', 'Express', 'Python e FastAPI', 'PHP', 'PostgreSQL', 'Supabase', 'MongoDB'],
      },
      {
        area: 'Arquitetura e segurança',
        items: ['Multi-tenant e white-label', 'RBAC e IAM', 'Row-Level Security', 'ADRs', 'Observabilidade'],
      },
      {
        area: 'Ferramentas',
        items: ['Git e GitHub', 'CI com quality gates', 'Docker', 'Linux', 'Vercel', 'Agentes de IA (Claude Code)'],
      },
    ],
    experience: [
      {
        role: 'Engenheiro Fullstack Pleno I (foco em frontend)',
        organization: 'Algoricca Software Company',
        period: { start: '2023-10', end: '2025-10' },
        terms: 'Remoto, contrato PJ',
        bullets: [
          'Entrei como único desenvolvedor frontend e fiquei até o fim do contrato, atravessando a renovação completa do time.',
          'Referência técnica do frontend: escolhi a stack e iniciei a arquitetura, fiz o onboarding de quem chegou e revisava pull requests para merge com deploy automático, inclusive do backend.',
          'Design system com tokens em Styled-Components, documentado em Storybook; performance com lazy loading, code-splitting e fim de requisições redundantes.',
        ],
        projects: [
          {
            name: 'Candidattus',
            url: 'https://www.candidattus.com/',
            description: 'Plataforma SaaS de inteligência eleitoral para agências, partidos e candidatos.',
            period: { start: '2023-10', end: '2024-12' },
            bullets: [
              'Plataforma usada nas eleições de 2024, com monitoramento em tempo real.',
              'Dashboards analíticos sobre dezenas de milhões de registros eleitorais, com ApexCharts e ECharts (mapas de calor, mapa nacional hexagonal, gauges, dispersão e bolhas) e componentes próprios quando as bibliotecas não atendiam.',
              'Módulos Cockpit do Candidato, Estratégia de Candidatura, Gestão da Candidatura, Inteligência Política, Trajetória Política e Portfólio de Candidaturas.',
            ],
          },
          {
            name: 'Connexicco',
            url: 'https://www.connexicco.com/',
            description: 'Plataforma de comunidades digitais para empresas.',
            period: { start: '2024-12', end: '2025-10' },
            bullets: [
              'Evolução do frontend para atender várias organizações ao mesmo tempo, cada uma com identidade visual e estrutura próprias resolvidas em runtime.',
              'Adaptação mobile completa da plataforma e videoconferência integrada ao módulo de eventos online.',
              'Módulos Comunidade, Clubes de relacionamento, Educação, Eventos Online, Expertise as a Service e Soluções.',
            ],
          },
        ],
      },
      {
        role: 'Desenvolvedor Fullstack',
        organization: 'Centro de Mediadores',
        period: { start: '2020-10', end: '2021-09' },
        terms: 'Brasília, DF, trabalho temporário remunerado',
        bullets: [
          'Outubro de 2020: primeiro sistema de administração de vendas em Vue 2, Express e MongoDB.',
          'Março a setembro de 2021: sistema definitivo em PHP 7 (MVC) com Docker, com gestão de leads e matrículas, importação por CSV, dashboards, metas, chat e atalho para WhatsApp.',
          'Controle de acesso por perfil (consultor e administração), com relatórios e metas restritos a cada perfil.',
        ],
        projects: [],
      },
      {
        role: 'Desenvolvedor Fullstack',
        organization: 'Revenda de veículos (Rio Verde, GO)',
        period: { start: '2020-11', end: '2021-01' },
        terms: 'Projeto em parceria, remunerado',
        bullets: [
          'Sistema de gestão com frontend em Vue 2 e API em Node.js, Express e Knex (PostgreSQL): clientes, fornecedores, veículos e usuários.',
        ],
        projects: [],
      },
    ],
    ownProjects: [
      {
        name: 'FelpsXP Finance',
        text: 'App financeiro multi-tenant em produção e em uso diário: Expo Router (iOS, Android e web no mesmo código), API tRPC em Node.js e TypeScript e isolamento por casa com Row-Level Security no PostgreSQL (Supabase).',
      },
      {
        name: 'FelpsXP Logs',
        text: 'Central local e privada que lê todos os repositórios do ecossistema (clones e API do GitHub com token só de leitura) e gera inventário, índice de ADRs e relatório de conformidade com 15 regras, numa CLI e num app web em Next.js.',
      },
      {
        name: 'FelpsXP Hub',
        url: 'https://github.com/FelpsSousa/felpsxp-hub',
        text: 'Este site: portfólio reconstruído do zero em Next.js, em repositório público, com decisões registradas em ADRs públicos, testes e controles de segurança em cada pull request.',
      },
      {
        name: 'FelpsXP Platform',
        text: 'Base privada do ecossistema: IAM por organização, eventos e um pacote de observabilidade (logging, redação de campos sensíveis, correlation ID e request ID) coberto por testes automatizados.',
      },
      {
        name: 'Revisão de segurança do próprio código',
        text: 'Correção de escalonamento de privilégio por papel, de identidade baseada em header interno sem assinatura e de cookie de sessão sem verificação criptográfica.',
      },
    ],
    earlierExperience: [
      {
        title: 'Automação de documentos',
        context: 'Freelance, por volta de 2018',
        text: 'Download, leitura, renomeação e organização diária dos PDFs públicos do ONS para um engenheiro eletricista, em Python.',
      },
      {
        title: 'Pesquisa no Projeto CLARA',
        context: 'LARA, UnB, novembro de 2017 a julho de 2018',
        text: 'Joystick sem fio 2.0 do robô auxiliar de cirurgia laparoscópica, em C e C++ com comunicação RF e Bluetooth.',
      },
      {
        title: 'Controle de acesso com reconhecimento facial',
        context: 'UnB, novembro de 2017',
        text: 'Projeto de disciplina em equipe de três, em C++ com OpenCV, interface gráfica e banco de usuários e reservas.',
      },
      {
        title: 'Monitor de Algoritmos e Programação de Computadores',
        context: 'UnB, 2017',
        text: 'Monitoria da disciplina de introdução à programação.',
      },
      {
        title: 'Equipe de robótica UnBeatables',
        context: 'UnB, 2016 a 2017',
        text: 'Extensão de 195 horas, incluindo o Projeto EDUBOT, com apoio do IEEE RAS: robótica em escolas públicas com o robô Sparki.',
      },
      {
        title: 'Professor particular',
        context: 'Janeiro de 2017 a julho de 2018',
        text: 'Matemática, física e química para o ensino médio.',
      },
    ],
    education: [
      {
        title: 'Engenharia Mecatrônica (Controle e Automação)',
        institution: 'Universidade de Brasília',
        period: '2015 a 2021',
        note: 'Não concluído',
      },
    ],
    courses: [
      'Disciplinas de computação aprovadas na UnB: Algoritmos e Programação de Computadores, Estruturas de Dados, Técnicas de Programação 1, Circuitos Lógicos e Sistemas Digitais.',
      'Rocketseat (2023): Trilha Explorer (cursada, sem certificado), NLW IA, AI for Devs, Java e Conectar.',
    ],
    languages: [
      'Português: nativo.',
      'Inglês: leitura e escrita técnica (documentação, commits e ADRs em inglês); conversação em desenvolvimento.',
    ],
  },
  en: {
    name: 'Felipe Luis Rodrigues Sousa',
    headline: 'Fullstack Developer, frontend-focused',
    stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    location: 'Brasília, Brazil',
    summary: [
      'Two years (October 2023 to October 2025) as a Mid-level Fullstack Engineer (Pleno I), frontend-focused, at Algoricca Software Company, remote.',
      'Frontend of two SaaS products: electoral intelligence (Candidattus) and multi-tenant white-label corporate communities (Connexicco).',
      'Today I run a multi-tenant finance app in production, with per-household isolation through Row-Level Security in PostgreSQL.',
      'Access control as a continuous thread: an academic project in 2017, role-based access in 2021 and IAM in my own platform.',
      'I work with an AI coding agent (Claude Code) under written rules: an ADR before code, one pull request per step with human review, and secret hooks.',
    ],
    skills: [
      {
        area: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Styled-Components', 'MUI', 'Storybook', 'React Native and Expo Router'],
      },
      { area: 'Data and visualization', items: ['ApexCharts', 'ECharts', 'Recharts', 'Dashboards'] },
      { area: 'Testing and quality', items: ['Vitest', 'Playwright', 'axe (WCAG 2.2 AA)', 'Jest', 'Biome', 'ESLint'] },
      {
        area: 'Backend',
        items: ['Node.js', 'tRPC', 'Express', 'Python and FastAPI', 'PHP', 'PostgreSQL', 'Supabase', 'MongoDB'],
      },
      {
        area: 'Architecture and security',
        items: ['Multi-tenant and white-label', 'RBAC and IAM', 'Row-Level Security', 'ADRs', 'Observability'],
      },
      {
        area: 'Tools',
        items: ['Git and GitHub', 'CI with quality gates', 'Docker', 'Linux', 'Vercel', 'AI coding agents (Claude Code)'],
      },
    ],
    experience: [
      {
        role: 'Mid-level Fullstack Engineer (Pleno I), frontend-focused',
        organization: 'Algoricca Software Company',
        period: { start: '2023-10', end: '2025-10' },
        terms: 'Remote, contractor',
        bullets: [
          'Joined as the only frontend developer and stayed until the end of the contract, through a complete team turnover.',
          'Frontend technical reference: chose the stack and started the architecture, onboarded everyone who joined, and reviewed pull requests for merge with automatic deployment, backend ones included.',
          'A design system with tokens in Styled-Components, documented in Storybook; performance work with lazy loading, code splitting and the removal of redundant requests.',
        ],
        projects: [
          {
            name: 'Candidattus',
            url: 'https://www.candidattus.com/',
            description: 'An electoral intelligence SaaS platform for agencies, parties and candidates.',
            period: { start: '2023-10', end: '2024-12' },
            bullets: [
              'Used in the 2024 Brazilian elections, with real-time monitoring.',
              'Analytical dashboards over tens of millions of electoral records, with ApexCharts and ECharts (heat maps, a hexagonal national map, gauges, scatter and bubble charts) and custom components where the libraries fell short.',
              'Modules named on the product site: Cockpit do Candidato, Estratégia de Candidatura, Gestão da Candidatura, Inteligência Política, Trajetória Política and Portfólio de Candidaturas.',
            ],
          },
          {
            name: 'Connexicco',
            url: 'https://www.connexicco.com/',
            description: 'A digital community platform for companies.',
            period: { start: '2024-12', end: '2025-10' },
            bullets: [
              'Evolved the frontend to serve several organizations at once, each with its own visual identity and structure resolved at runtime.',
              'Full mobile adaptation of the platform and video conferencing integrated into the online events module.',
              'Modules named on the product site: Comunidade, Clubes de relacionamento, Educação, Eventos Online, Expertise as a Service and Soluções.',
            ],
          },
        ],
      },
      {
        role: 'Fullstack Developer',
        organization: 'Centro de Mediadores',
        period: { start: '2020-10', end: '2021-09' },
        terms: 'Brasília, Brazil, paid temporary engagement',
        bullets: [
          'October 2020: a first sales administration system in Vue 2, Express and MongoDB.',
          'March to September 2021: the final system in PHP 7 (MVC) with Docker, covering leads and enrolments, CSV import, dashboards, targets, chat and a WhatsApp shortcut.',
          'Role-based access (consultant and administration), with reports and targets restricted to each role.',
        ],
        projects: [],
      },
      {
        role: 'Fullstack Developer',
        organization: 'Vehicle dealership (Rio Verde, Brazil)',
        period: { start: '2020-11', end: '2021-01' },
        terms: 'Paid partnership project',
        bullets: [
          'A management system with a Vue 2 frontend and an API in Node.js, Express and Knex (PostgreSQL): customers, suppliers, vehicles and users.',
        ],
        projects: [],
      },
    ],
    ownProjects: [
      {
        name: 'FelpsXP Finance',
        text: 'A multi-tenant finance app in production and daily use: Expo Router (iOS, Android and web from one codebase), a tRPC API in Node.js and TypeScript, and per-household isolation with Row-Level Security in PostgreSQL (Supabase).',
      },
      {
        name: 'FelpsXP Logs',
        text: 'A local, private command centre that reads every repository in the ecosystem (local clones and the GitHub API with a read-only token) and produces an inventory, an ADR index and a 15-check compliance report, through a CLI and a Next.js web app.',
      },
      {
        name: 'FelpsXP Hub',
        url: 'https://github.com/FelpsSousa/felpsxp-hub',
        text: 'This site: a portfolio rebuilt from scratch in Next.js in a public repository, with decisions recorded as public ADRs, and tests and security controls on every pull request.',
      },
      {
        name: 'FelpsXP Platform',
        text: 'The private foundation of the ecosystem: per-organization IAM, events, and an observability package (logging, redaction of sensitive fields, correlation and request IDs) covered by automated tests.',
      },
      {
        name: 'Security review of my own code',
        text: 'Fixed a role-based privilege escalation, an identity taken from an unsigned internal header, and a session cookie compared without cryptographic verification.',
      },
    ],
    earlierExperience: [
      {
        title: 'Document automation',
        context: 'Freelance, around 2018',
        text: 'Daily download, reading, renaming and filing of the public PDF documents of Brazil’s grid operator (ONS) for an electrical engineer, in Python.',
      },
      {
        title: 'Research in the CLARA Project',
        context: 'LARA, University of Brasília, November 2017 to July 2018',
        text: 'The wireless joystick 2.0 of a laparoscopic surgery assistant robot, in C and C++ with RF and Bluetooth communication.',
      },
      {
        title: 'Access control with facial recognition',
        context: 'University of Brasília, November 2017',
        text: 'A three-person course project in C++ with OpenCV, a GUI and a user and booking database.',
      },
      {
        title: 'Teaching assistant, Algorithms and Computer Programming',
        context: 'University of Brasília, 2017',
        text: 'Teaching assistant for the introductory programming course.',
      },
      {
        title: 'UnBeatables robotics team',
        context: 'University of Brasília, 2016 to 2017',
        text: 'A 195-hour extension activity, including the EDUBOT Project, supported by IEEE RAS: robotics in public schools with the Sparki robot.',
      },
      {
        title: 'Private tutor',
        context: 'January 2017 to July 2018',
        text: 'Mathematics, physics and chemistry for high school students.',
      },
    ],
    education: [
      {
        title: 'Mechatronics Engineering (Control and Automation)',
        institution: 'University of Brasília',
        period: '2015 to 2021',
        note: 'Not completed',
      },
    ],
    courses: [
      'Computing courses passed at the University of Brasília: Algorithms and Computer Programming, Data Structures, Programming Techniques 1, Logic Circuits and Digital Systems.',
      'Rocketseat (2023): Explorer track (taken, without a certificate), NLW IA, AI for Devs, Java and Conectar.',
    ],
    languages: [
      'Portuguese: native.',
      'English: technical reading and writing (docs, commits and ADRs in English); conversation in progress.',
    ],
  },
};
