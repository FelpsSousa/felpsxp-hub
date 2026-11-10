import type { Localized, Project } from '@/content/types';

export const homeNetworkObservabilityProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'home-network-observability',
    title: 'Sistema de Observabilidade de Rede Doméstica',
    summary:
      'Sentinel: um sistema real de monitoramento e alertas de rede doméstica, com descoberta de dispositivos, visibilidade de DNS, inteligência de categorias, score de risco e um dashboard completo pro operador.',
    status: 'active',
    visibility: 'public',
    type: 'system',
    difficulty: 'applied',
    primaryDomain: 'observability',
    secondaryDomains: ['backend', 'devops-infra'],
    isExample: false,
    media: [],
    role: 'Arquitetura, backend, frontend e direção do sensor always-on em todo o pipeline',
    problem:
      'Redes domésticas comuns dão pouca visibilidade sobre comportamento de dispositivos, atividade de DNS e eventos operacionais, deixando o monitoramento e o controle fragmentados e superficiais.',
    solution:
      'Um sensor de rede always-on alimenta eventos de descoberta de dispositivos e consultas DNS numa API de plataforma compartilhada, que normaliza, categoriza e pontua esses dados para um dashboard dedicado ao operador, com alertas, limites configuráveis e relatórios.',
    architectureHighlights: [
      'Sensor always-on: descoberta via ARP no Linux, descoberta via cache ICMP/ARP no Windows, visibilidade de DNS via polling do log de consultas do AdGuard Home',
      'API de plataforma que recebe dispositivos e eventos de DNS atrás de uma fronteira autenticada por sensor, sustentada por Postgres/Prisma',
      'Sete workers agendados: rollups, detecção de offline, arquivamento, revisão de risco, alertas de limite, resumo diário por e-mail e verificação de saúde do próprio sistema',
      'Dashboard em Next.js com score de risco por dispositivo (sempre acompanhado do detalhamento dos fatores que o produziram, nunca um número opaco), categorias, alertas, limites customizados, exportação em CSV e relatórios em PDF sob demanda',
      'Auto-monitoramento: o sistema detecta e alerta sobre as próprias falhas (resolvedor DNS fora do ar, sensor parado, mudança de endereço do host), verificadas pelo worker e não pelo sensor, justamente porque o sensor é uma das coisas vigiadas',
      'Acesso com segundo fator mesmo numa superfície que não é alcançável pela internet: posição na rede não é modelo de autorização',
    ],
    challenges: [
      'Descoberta de dispositivos multiplataforma sem uma API de SO única e confiável: ARP no Linux, cache ICMP/ARP no Windows',
      'Validar o sistema contra uma rede doméstica real e ativa, em vez de dados sintéticos',
      'Um reinício de roteador derrubou o DNS da casa inteira por dias, e diagnosticar isso foi uma investigação manual longa: o sistema sabia descrever todo dispositivo da rede e não tinha nada a dizer sobre si mesmo',
    ],
    responsibilities: [
      'Definir a arquitetura modular dos fluxos de monitoramento e controle',
      'Implementar a fundação de visibilidade de DNS e rede de ponta a ponta, do sensor ao dashboard',
      'Modelar as entidades de banco para dispositivos, sessões, atividade de DNS, categorias e alertas',
      'Entregar o dashboard do operador, os alertas e os relatórios',
    ],
    outcomes: [
      'Criou uma prova aplicada forte, além do trabalho de arquitetura só do ecossistema',
      'Demonstrou pensamento sistêmico em rede, backend, dados e frontend',
      'Validado de ponta a ponta contra uma rede doméstica real, incluindo descoberta de dispositivos e tráfego de DNS reais',
    ],
    learnings: [
      'Validação contra tráfego real de rede e DNS revelou casos de borda que dados sintéticos não teriam mostrado',
      'Um sistema de monitoramento que não enxerga a própria queda reporta "tudo tranquilo" e "eu morri" exatamente igual. Fechar essa lacuna não exigiu infraestrutura nova: bastou reusar o feed de alertas que já existia, com três tipos novos sem dispositivo associado',
      'Prova de vida tem que ser sinal direto, não inferência: deduzir "o sensor está vivo" da recência de eventos DNS confunde sensor parado com casa dormindo, e toda madrugada vira falso positivo',
    ],
    stack: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'AdGuard Home'],
    tags: ['observability', 'networking', 'dashboard', 'backend', 'frontend'],
    relatedSurfaceKeys: ['hub', 'sentinel', 'command'],
    startedAt: '2025-04-09',
    updatedAt: '2026-09-28',
    featured: true,
  },
  en: {
    slug: 'home-network-observability',
    title: 'Home Network Observability System',
    summary:
      'Sentinel: a real-world home-network monitoring and alerting system with device discovery, DNS visibility, category intelligence, risk scoring, and a full operator dashboard.',
    status: 'active',
    visibility: 'public',
    type: 'system',
    difficulty: 'applied',
    primaryDomain: 'observability',
    secondaryDomains: ['backend', 'devops-infra'],
    isExample: false,
    media: [],
    role: 'Architecture, backend, frontend, and always-on sensor direction across the full pipeline',
    problem:
      'Typical home networks provide poor visibility into device behavior, DNS activity, and operational events, making monitoring and control fragmented and shallow.',
    solution:
      'An always-on network sensor feeds device discovery and DNS query events into a shared platform API, which normalizes, categorizes, and scores that data for a dedicated operator dashboard with alerting, thresholds, and reporting.',
    architectureHighlights: [
      'Always-on sensor: ARP-based discovery on Linux, ICMP/ARP-cache discovery on Windows, DNS visibility via AdGuard Home query-log polling',
      'Platform API ingesting devices and DNS events behind a sensor-authenticated boundary, backed by Postgres/Prisma',
      'Seven scheduled workers: rollups, offline detection, archival, risk review, threshold alerts, daily email digests, and a health check on the system itself',
      'Next.js dashboard with device risk scoring - always shown with the breakdown of the factors that produced it, never an opaque number - category breakdowns, alerts, custom thresholds, CSV export, and on-demand PDF reports',
      'Self-health monitoring: the system detects and alerts on its own failure modes (DNS resolver down, sensor stalled, host address changed), checked from the worker rather than the sensor, precisely because the sensor is one of the things being watched',
      'Two-factor access even on a surface that is not reachable from the internet - network position is not an authorization model',
    ],
    challenges: [
      'Cross-platform device discovery with no single reliable OS API - ARP-based on Linux, ICMP/ARP-cache on Windows',
      'Validating the system against a live, real home network instead of synthetic data',
      'A router restart broke DNS for an entire household for days, and diagnosing it was a long manual investigation - the system could describe every device on the network and had nothing to say about itself',
    ],
    responsibilities: [
      'Define modular architecture for monitoring and control flows',
      'Implement DNS and network visibility foundations end to end, from sensor to dashboard',
      'Model database entities for devices, sessions, DNS activity, categories, and alerts',
      'Ship the operator dashboard, alerting, and reporting capabilities',
    ],
    outcomes: [
      'Created strong applied proof beyond ecosystem-only architecture work',
      'Demonstrated systems thinking across network, backend, data, and frontend layers',
      'Validated end to end against a live home network, including real device discovery and real DNS traffic',
    ],
    learnings: [
      'Validating against real network and DNS traffic surfaced edge cases synthetic data would not have shown',
      'A monitoring system that cannot see its own outage reports "all quiet" and "I am dead" identically. Closing that gap needed no new infrastructure: it reused the alert feed that already existed, with three new device-less alert types',
      'Proof of life has to be a direct signal, not an inference: deriving "the sensor is alive" from recent DNS events confuses a stalled sensor with a sleeping household, and turns every night into a false positive',
    ],
    stack: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'AdGuard Home'],
    tags: ['observability', 'networking', 'dashboard', 'backend', 'frontend'],
    relatedSurfaceKeys: ['hub', 'sentinel', 'command'],
    startedAt: '2025-04-09',
    updatedAt: '2026-09-28',
    featured: true,
  },
};
