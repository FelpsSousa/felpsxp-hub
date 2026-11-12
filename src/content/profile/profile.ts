import type { Localized, Profile } from '@/content/types';

export const profileByLocale: Localized<Profile> = {
  pt: {
    displayName: 'Felipe Sousa',
    title: 'Desenvolvedor Fullstack: React, Next.js, TypeScript',
    location: 'Brasília, Brasil',
    languages: [
      'Português (nativo)',
      'Inglês: leitura e escrita técnica (documentação, commits e ADRs em inglês); conversação em desenvolvimento',
    ],
    shortBio:
      'Dois anos no frontend de dois produtos SaaS, como engenheiro fullstack. Hoje arquiteto um ecossistema modular próprio, com foco em identidade, eventos e observabilidade.',
    summaryParagraphs: [
      'Comecei a programar em 2015, na Engenharia Mecatrônica da UnB, escrevendo C para robôs antes de escrever JavaScript para navegadores. Dei aulas de robótica em escolas públicas, fui monitor de algoritmos e trabalhei em pesquisa com firmware e comunicação sem fio para um robô cirúrgico.',
      'Essa base me levou para o software. De outubro de 2023 a outubro de 2025 fui Engenheiro Fullstack Pleno I, com foco em frontend, na Algoricca Software Company, trabalhando em dois produtos SaaS: Candidattus e Connexicco.',
      'Hoje construo o FelpsXP Ecosystem: uma plataforma modular própria onde aplico o que aprendi sobre arquitetura, identidade e acesso, eventos e observabilidade. É onde minha experiência mais recente acontece, e onde estou consolidando uma especialização em segurança de aplicação e gestão de identidade.',
      'Gosto de resolver o problema difícil e de deixar registrado por que foi resolvido daquele jeito.',
    ],
    currentFocus: [
      'Recolocação como desenvolvedor fullstack, com abertura para frontend ou backend',
      'Fechar a primeira fase pública do Hub como prova de trabalho real',
      'Consolidar uma especialização em IAM e segurança de aplicação',
      'Estudando o OWASP Top 10 e praticando algoritmos no Beecrowd como rotina, de olho na trilha AppSec',
      'Evoluir o FelpsXP Ecosystem como prova de arquitetura de plataforma, não só um produto pessoal',
    ],
    principles: [
      'Evidência acima de adjetivo',
      'Clareza pública em primeiro lugar',
      'Pensamento sistêmico acima de features isoladas',
      'Arquitetura com intenção de produto',
      'Honestidade calibrada: sem inflar o que ainda não está confirmado',
    ],
    highlights: [
      '2 anos no frontend de dois produtos SaaS (Candidattus e Connexicco)',
      'Base em Engenharia Mecatrônica (UnB), com passagem por sistemas embarcados e controle de acesso',
      'Controle de acesso desde 2017: do reconhecimento facial nos laboratórios da UnB ao IAM da FelpsXP Platform',
      'Disciplina de conteúdo tipado, ADRs e documentação como parte do trabalho, não um extra',
    ],
    highlightStats: [
      { value: '2 anos', label: 'No frontend de dois produtos SaaS' },
      { value: 'ADRs', label: 'Decisões de arquitetura registradas em ADRs públicos' },
      { value: 'Desde 2015', label: 'Programando, desde a Engenharia Mecatrônica na UnB' },
    ],
  },
  en: {
    displayName: 'Felipe Sousa',
    title: 'Fullstack Developer: React, Next.js, TypeScript',
    location: 'Brasília, Brazil',
    languages: [
      'Portuguese (native)',
      'English: technical reading and writing (docs, commits and ADRs in English); conversation in progress',
    ],
    shortBio:
      'Two years on the frontend of two SaaS products as a fullstack engineer. Today I architect my own modular ecosystem, focused on identity, events, and observability.',
    summaryParagraphs: [
      'I started programming in 2015, studying Mechatronics Engineering at the University of Brasília, writing C for robots before writing JavaScript for browsers. I taught robotics in public schools, worked as an algorithms teaching assistant, and did research on firmware and wireless communication for a surgical robot.',
      'That foundation led me into software. From October 2023 to October 2025 I was a Mid-level Fullstack Engineer (Pleno I), frontend-focused, at Algoricca Software Company, working on two SaaS products: Candidattus and Connexicco.',
      "Today I'm building the FelpsXP Ecosystem: my own modular platform where I apply what I've learned about architecture, identity and access, events and observability. It's where my most recent experience lives, and where I'm consolidating a specialization in application security and identity management.",
      'I like solving the hard problem, and leaving a record of why it was solved that way.',
    ],
    currentFocus: [
      'Actively looking for a fullstack role, open to frontend or backend',
      "Shipping the Hub's first public phase as real, live proof of work",
      'Consolidating a specialization in IAM and application security',
      'Studying the OWASP Top 10 and practicing algorithms on Beecrowd as a routine, building toward the AppSec track',
      'Growing the FelpsXP Ecosystem as proof of platform architecture, not just a personal product',
    ],
    principles: [
      'Evidence over adjective',
      'Public-first clarity',
      'Systems thinking over isolated features',
      'Architecture with product intent',
      'Calibrated honesty: never inflate what is not yet confirmed',
    ],
    highlights: [
      '2 years on the frontend of two SaaS products (Candidattus and Connexicco)',
      'Mechatronics Engineering background (University of Brasília), with a path through embedded systems and access control',
      'Access control since 2017: from facial recognition at the University of Brasília labs to IAM in the FelpsXP Platform',
      'Typed content, ADRs, and documentation as part of the work, not an extra',
    ],
    highlightStats: [
      { value: '2 years', label: 'On the frontend of two SaaS products' },
      { value: 'ADRs', label: 'Architecture decisions recorded as public ADRs' },
      { value: 'Since 2015', label: 'Programming, since Mechatronics Engineering at the University of Brasília' },
    ],
  },
};
