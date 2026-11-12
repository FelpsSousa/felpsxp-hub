import type { Localized, Project } from '@/content/types';

/**
 * Deliberately published with no solved-problem count: the repository is
 * mid-sync, and until the indexes are regenerated from real metadata, any
 * number here would be a claim the public repository cannot back.
 */
export const beecrowdProblemSolvingProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'beecrowd-problem-solving',
    title: 'Beecrowd Problem Solving',
    summary:
      'Base de conhecimento de resolução de problemas algorítmicos: cada problema documentado com raciocínio, complexidade e erros cometidos, em vez de um arquivo morto de submissões aceitas. Em consolidação: as soluções antigas estão sendo incorporadas.',
    status: 'active',
    visibility: 'public',
    type: 'tooling',
    difficulty: 'foundational',
    primaryDomain: 'backend',
    secondaryDomains: [],
    media: [],
    role: 'Desenho do sistema de estudo, padrão de documentação e automação do repositório',
    problem:
      'Repositório de exercícios costuma ser um cemitério de submissões: centenas de arquivos aceitos, nenhum registro de por que aquela abordagem foi escolhida, o que falhou antes, ou o que foi aprendido. Serve para contar quantidade e não serve para aprender nem para revisar.',
    solution:
      'Um repositório estruturado como base de conhecimento, não como arquivo. Cada problema tem pasta própria com enunciado resumido, raciocínio, análise de complexidade, registro de erros e solução em mais de uma linguagem. Trilha de estudo em espiral por categoria e nível de dificuldade, em vez de moer uma categoria só.',
    architectureHighlights: [
      'Três níveis de documentação por problema, para o esforço de escrita acompanhar a dificuldade real em vez de ser uniforme',
      'Trilha espiral: uma passada por todas as categorias num mesmo patamar antes de subir de patamar, porque a dificuldade do juiz é dinâmica e não fica presa a uma categoria',
      'Registro de erros como artefato de primeira classe: o que falhou antes de passar é o que vale reler meses depois',
      'Automação planejada para que os índices sejam gerados a partir dos metadados de cada problema, e nunca possam divergir da realidade',
      'CI planejada para compilar e executar cada solução, com entrada e saída de exemplo versionadas, para o repositório afirmar correção em vez de afirmar que compila',
    ],
    challenges: [
      'Manter índice e status sempre fiéis ao que existe de verdade: um problema marcado como resolvido com arquivo vazio corrói a credibilidade do repositório inteiro, e é exatamente o que a automação de validação existe pra impedir',
      'Documentar sem tornar o custo por problema alto demais pra sustentar volume',
    ],
    responsibilities: [
      'Definir o modelo de documentação e os templates por nível',
      'Desenhar a trilha de estudo por categoria e dificuldade',
      'Especificar os scripts de validação e geração de índice',
      'Resolver e documentar os problemas',
    ],
    outcomes: [
      'Transforma prática algorítmica em conhecimento revisável, em vez de submissões acumuladas',
      'Serve de base de revisão para entrevista técnica, com o raciocínio preservado e não só o resultado',
    ],
    learnings: [
      'Um índice escrito à mão sempre diverge do repositório; gerar o índice a partir dos metadados de cada problema é a única forma de ele continuar verdadeiro conforme o volume cresce',
      'A regra que vale pra todo o portfólio vale aqui em escala pequena: status falso num único problema custa mais credibilidade do que um repositório pequeno e honesto',
    ],
    stack: ['C++', 'Python', 'Markdown', 'GitHub Actions'],
    tags: ['algoritmos', 'estrutura-de-dados', 'estudo', 'documentação'],
    relatedSurfaceKeys: [],
    startedAt: '2026-04-01',
    updatedAt: '2026-09-28',
    featured: false,
    links: [
      {
        href: 'https://github.com/FelpsSousa/beecrowd-problem-solving',
        label: 'Repositório no GitHub',
        external: true,
      },
    ],
  },
  en: {
    slug: 'beecrowd-problem-solving',
    title: 'Beecrowd Problem Solving',
    summary:
      'A knowledge base for algorithmic problem solving: each problem documented with the reasoning, the complexity analysis and the mistakes made, instead of a dead archive of accepted submissions. Being consolidated: older solutions are being merged in.',
    status: 'active',
    visibility: 'public',
    type: 'tooling',
    difficulty: 'foundational',
    primaryDomain: 'backend',
    secondaryDomains: [],
    media: [],
    role: 'Study-system design, documentation standard, and repository automation',
    problem:
      'An exercise repository is usually a graveyard of submissions: hundreds of accepted files, no record of why an approach was chosen, what failed first, or what was learned. It is good for counting volume and useless for learning or reviewing.',
    solution:
      'A repository structured as a knowledge base rather than an archive. Each problem gets its own folder with a summarised statement, the reasoning, a complexity analysis, a record of mistakes, and solutions in more than one language. A spiral study path across categories and difficulty tiers, instead of grinding one category.',
    architectureHighlights: [
      'Three documentation levels per problem, so writing effort tracks real difficulty instead of being uniform',
      'A spiral path: one pass through every category at the same tier before moving up, because the judge’s difficulty rating is dynamic and not tied to a category',
      'The mistakes log as a first-class artefact: what failed before it passed is what is worth rereading months later',
      'Automation planned so indexes are generated from each problem’s metadata, and can never drift from reality',
      'CI planned to compile and run every solution against versioned sample input and output, so the repository asserts correctness rather than asserting that it compiles',
    ],
    challenges: [
      'Keeping indexes and statuses faithful to what actually exists: one problem marked solved with an empty file erodes the credibility of the whole repository, which is exactly what the validation script exists to prevent',
      'Documenting without making the per-problem cost too high to sustain volume',
    ],
    responsibilities: [
      'Define the documentation model and the per-level templates',
      'Design the study path across categories and difficulty',
      'Specify the validation and index-generation scripts',
      'Solve and document the problems',
    ],
    outcomes: [
      'Turns algorithmic practice into reviewable knowledge, instead of accumulated submissions',
      'Serves as a revision base for technical interviews, with the reasoning preserved rather than only the result',
    ],
    learnings: [
      'A hand-written index always drifts from the repository; generating it from each problem’s metadata is the only way it stays true as volume grows',
      'The rule that governs the whole portfolio applies here at small scale: a false status on a single problem costs more credibility than a small, honest repository',
    ],
    stack: ['C++', 'Python', 'Markdown', 'GitHub Actions'],
    tags: ['algorithms', 'data-structures', 'study', 'documentation'],
    relatedSurfaceKeys: [],
    startedAt: '2026-04-01',
    updatedAt: '2026-09-28',
    featured: false,
    links: [
      {
        href: 'https://github.com/FelpsSousa/beecrowd-problem-solving',
        label: 'Repository on GitHub',
        external: true,
      },
    ],
  },
};
