import type { Localized, Project } from '@/content/types';

export const felpsxpArchitectureProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'felpsxp-architecture',
    title: 'FelpsXP Architecture',
    summary:
      'O repositório público de arquitetura do ecossistema: decisões reais, com as alternativas que foram descartadas e o porquê, mais o código compartilhado que dá lastro a elas, sem expor nenhum repositório privado.',
    status: 'active',
    visibility: 'public',
    type: 'system',
    difficulty: 'applied',
    primaryDomain: 'appsec',
    secondaryDomains: ['backend', 'observability'],
    isExample: false,
    media: [],
    role: 'Curadoria, redação técnica, extração de código e política de publicação',
    problem:
      'Quase todo o trabalho que melhor representa o que eu sei fazer vive em repositório privado: uma plataforma, um produto financeiro em produção e um sistema que observa uma rede doméstica. Contar isso em adjetivo é fácil e não vale nada; abrir os repositórios é impossível, porque envolvem dado financeiro de família e a topologia real de uma casa.',
    solution:
      'Um repositório público que publica as duas metades que dá pra publicar com segurança: as decisões de arquitetura, no formato ADR, com contexto, alternativas consideradas e consequências assumidas; e pacotes de código real, extraídos de produção e testados, não escritos para a vitrine. Cada módulo privado mantém uma pasta de exportação própria, curada antes de qualquer coisa sair dali.',
    architectureHighlights: [
      'Regra de ouro aplicada antes de cada publicação: documentar a capacidade, nunca o mapa; nada de variável de ambiente, credencial, endereço real, hostname interno ou topologia de rede',
      'Documentação organizada por nível de zoom do modelo C4, para o leitor escolher entre "o organismo inteiro" e "as decisões deste módulo" sem as duas visões virarem um texto só',
      'Numeração de ADR preservada com as lacunas reais de cada log privado, em vez de uma sequência limpa: uma sequência sem buracos pareceria mais organizada e seria inventada',
      'Código publicado apenas quando já roda em produção e tem teste: a alternativa (escrever o pacote na semana da candidatura) derruba a própria tese do repositório na primeira pergunta de entrevista',
      'Processo repetível: cada repositório privado gera sua pasta de exportação, revisada pelo dono antes da cópia manual, sem automação que publique sozinha',
    ],
    challenges: [
      'Decidir caso a caso o que é capacidade (publicável) e o que é mapa (nunca), especialmente no módulo que observa uma rede doméstica real',
      'Resistir à tentação de publicar pacote bonito escrito para a ocasião, e aceitar um repositório menor porém verdadeiro',
      'Conciliar logs de decisão de repositórios diferentes, cada um com sua própria numeração real, sem renumerar nada que já é público',
    ],
    responsibilities: [
      'Definir a estrutura do repositório público e a política do que pode ou não sair de cada repositório privado',
      'Curar as ADRs, generalizando fornecedor e caminho interno sem apagar a decisão',
      'Extrair e verificar os pacotes de código, conferindo linha a linha contra a origem',
      'Manter a pasta de exportação de cada módulo como "o que está pronto hoje", não como arquivo histórico',
    ],
    outcomes: [
      'Permite avaliar decisão técnica e código real sem abrir nenhum repositório privado',
      'Cada afirmação sobre o ecossistema passa a ter onde ser conferida, em vez de depender de confiança',
    ],
    learnings: [
      'Documentação sozinha lê como blog e código sozinho lê como mais um projeto; o par decisão mais implementação é o que é raro, e é exatamente o que dá pra publicar sem risco',
      'A parte difícil não é escrever, é a curadoria: separar o que já é real do que ainda é intenção, e marcar o segundo como intenção em vez de deixar os dois no mesmo tom',
    ],
    stack: ['Markdown', 'ADR', 'Modelo C4', 'TypeScript', 'Vitest'],
    tags: ['arquitetura', 'documentação', 'adr', 'open-source', 'appsec'],
    relatedSurfaceKeys: ['platform', 'hub', 'sentinel', 'finance'],
    startedAt: '2026-09-05',
    updatedAt: '2026-09-28',
    featured: false,
    links: [
      {
        href: 'https://github.com/FelpsSousa/felpsxp-architecture',
        label: 'Repositório no GitHub',
        external: true,
      },
    ],
  },
  en: {
    slug: 'felpsxp-architecture',
    title: 'FelpsXP Architecture',
    summary:
      'The ecosystem’s public architecture repository: real decisions, with the alternatives that were rejected and why, plus the shared code that backs them, without exposing any private repository.',
    status: 'active',
    visibility: 'public',
    type: 'system',
    difficulty: 'applied',
    primaryDomain: 'appsec',
    secondaryDomains: ['backend', 'observability'],
    isExample: false,
    media: [],
    role: 'Curation, technical writing, code extraction, and publication policy',
    problem:
      'Almost all the work that best represents what I can do lives in private repositories: a platform, a finance product in production, and a system that watches a home network. Describing that in adjectives is easy and worth nothing; opening the repositories is impossible, because they involve a family’s financial data and the real topology of a home.',
    solution:
      'A public repository that publishes the two halves that can be published safely: the architecture decisions, as ADRs, with context, alternatives considered and consequences accepted; and packages of real code, extracted from production and tested, not written for display. Each private module keeps its own export folder, curated before anything leaves it.',
    architectureHighlights: [
      'A golden rule applied before every publication: document the capability, never the map; no environment variables, credentials, real addresses, internal hostnames or network topology',
      'Documentation organised by C4 zoom level, so a reader can choose between "the whole organism" and "this module’s own decisions" without the two views tangling into one wall of text',
      'ADR numbering preserved with each private log’s real gaps, rather than a clean sequence: a gap-free sequence would look tidier and would be fabricated',
      'Code published only once it already runs in production and has tests: the alternative (writing the package the week you apply for a job) collapses the repository’s own thesis at the first interview question',
      'A repeatable process: each private repository produces its export folder, reviewed by the owner before a manual copy, with no automation that publishes on its own',
    ],
    challenges: [
      'Deciding case by case what is capability (publishable) and what is a map (never), especially for the module that watches a real home network',
      'Resisting the temptation to publish a good-looking package written for the occasion, and accepting a smaller but truthful repository',
      'Reconciling decision logs from different repositories, each with its own real numbering, without renumbering anything already public',
    ],
    responsibilities: [
      'Define the public repository’s structure and the policy for what may leave each private repository',
      'Curate the ADRs, generalising vendors and internal paths without erasing the decision',
      'Extract and verify the code packages, checking them line by line against their source',
      'Keep each module’s export folder as "what is ready today", not as a historical archive',
    ],
    outcomes: [
      'Makes technical decisions and real code reviewable without opening any private repository',
      'Every claim about the ecosystem gains somewhere it can be checked, instead of relying on trust',
    ],
    learnings: [
      'Documentation alone reads as a blog and code alone reads as one more project; the pair of decision plus implementation is the rare thing, and it is exactly what can be published without risk',
      'The hard part is not the writing, it is the curation: separating what is already real from what is still intent, and labelling the second as intent instead of leaving both in the same tone',
    ],
    stack: ['Markdown', 'ADR', 'C4 model', 'TypeScript', 'Vitest'],
    tags: ['architecture', 'documentation', 'adr', 'open-source', 'appsec'],
    relatedSurfaceKeys: ['platform', 'hub', 'sentinel', 'finance'],
    startedAt: '2026-09-05',
    updatedAt: '2026-09-28',
    featured: false,
    links: [
      {
        href: 'https://github.com/FelpsSousa/felpsxp-architecture',
        label: 'Repository on GitHub',
        external: true,
      },
    ],
  },
};
