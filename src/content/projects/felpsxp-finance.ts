import type { Localized, Project } from '@/content/types';

/**
 * Deliberately published without a repository link and without screenshots:
 * the product holds real household financial data, and the repository is
 * private. Same posture as `home-network-observability`: describe the
 * capability and the decisions, never the data or the topology.
 */
export const felpsxpFinanceProjectByLocale: Localized<Project> = {
  pt: {
    slug: 'felpsxp-finance',
    title: 'FelpsXP Finance',
    summary:
      'Organizador financeiro multi-inquilino para uma casa, no ar e em uso diário: contas, cartões, parcelas, empréstimos, metas e despesas divididas entre os moradores, de um mesmo código para iOS, Android e web.',
    status: 'active',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'backend',
    secondaryDomains: ['appsec', 'iam', 'frontend'],
    media: [],
    role: 'Arquitetura, backend, cliente, modelagem de domínio e operação em produção',
    problem:
      'Ferramenta de finanças pessoais é quase sempre desenhada para uma pessoa. Uma casa é outra coisa: várias pessoas, contas e cartões compartilhados, e compromissos que pertencem a um morador mas afetam o mês de todo mundo. E o requisito que manda em tudo não é funcional: duas casas jamais podem enxergar o dinheiro uma da outra.',
    solution:
      'Um produto multi-inquilino onde cada casa é um inquilino isolado, com o isolamento garantido pelo banco de dados em vez de por convenção no código. Um único código-fonte gera iOS, Android e web; as regras de negócio vivem na API e num pacote de funções puras compartilhado entre servidor e cliente, para que a prévia na tela e o valor gravado sejam calculados pela mesma função.',
    architectureHighlights: [
      'Isolamento por inquilino com row-level security desde a primeira migração, mais grants explícitos de tabela ao lado: a lição de uma falha real em produção',
      'Administração da plataforma inteiramente fora do modelo de inquilino, para que a regra de isolamento não tenha exceção pra dar errado',
      'Autenticação atrás de uma interface interna própria, para o provedor poder ser trocado sem tocar em tela nem em regra',
      'Todo valor é inteiro em centavos, nunca ponto flutuante',
      'Três datas distintas por compromisso (mês de competência, data devida e data em que o dinheiro se moveu), porque juntar as três num campo só torna relatório, lembrete e fluxo de caixa mutuamente incompatíveis',
      'Saldos derivados do extrato a cada leitura, nunca guardados como total corrente que pode divergir das linhas que diz resumir',
      'Parcelas como irmãs sob um mesmo identificador de grupo, sem primeira linha privilegiada: forma que depois serviu inalterada para uma conta dividida entre vários moradores, sem tabela nova',
      'Recorrência idempotente por ponteiro de progresso, que distingue "ainda não gerado" de "gerado e descartado de propósito"',
      'Erro e log que não carregam dado financeiro nem pessoal, por registrar qual operação falhou em vez de manter lista de redação',
      'Pacote de matemática financeira puro e sem dependências, coberto por testes automatizados: parcelamento, ciclo de fatura, recorrência, juros e desconto, e leitura offline dos dígitos de um boleto',
    ],
    challenges: [
      'Uma falha real em produção onde as políticas de isolamento corretas nunca eram alcançadas, porque a checagem de permissão da tabela negava a requisição antes: política certa atrás de grant ausente se parece exatamente com produto quebrado',
      'Modelar dinheiro que entra sem ter sido ganho (principal de empréstimo, correção de saldo não lançado) de forma que o saldo fique certo sem contaminar o que deriva de renda',
      'Manter uma casa livre pra renomear as próprias categorias enquanto o sistema ainda precisa encontrar as que ele mesmo usa',
      'Categorizar descrição digitada sem mandar o gasto da casa pra fora nem depender de rede',
    ],
    responsibilities: [
      'Desenhar o modelo multi-inquilino e a fronteira de isolamento',
      'Implementar a API e as regras de negócio, incluindo a aritmética de calendário e arredondamento',
      'Construir o cliente único que atende iOS, Android e web',
      'Operar o produto em produção, com e-mail transacional no fluxo real de conta',
    ],
    outcomes: [
      'Em produção e em uso diário pela família, não em ambiente de demonstração; o lançamento nas lojas (Android e iOS) está planejado, sem data',
      'Preparado para publicação comercial como aplicativo Android e iOS',
      'Consome a plataforma do ecossistema apenas pela API dela, sem acesso ao código nem ao banco: o limite se mantém honesto porque não é contornável',
      'Gerou o segundo pacote de código real e testado do ecossistema, publicável de forma independente',
    ],
    learnings: [
      'Política de isolamento correta é inútil se a permissão embaixo dela nega antes. O modo de falha não avisa que é de permissão: ele se apresenta como o produto simplesmente não funcionando, e foi preciso uma falha em produção pra aprender a olhar uma camada abaixo',
      'Derivar sai mais barato que guardar: saldo calculado a cada leitura nunca diverge do extrato que diz resumir, e o custo de recalcular é irrisório perto do custo de reconciliar depois',
      'Uma forma boa se paga duas vezes: parcelas como irmãs sob um grupo, sem linha privilegiada, resolveu inalterada um problema não relacionado (uma conta paga por várias pessoas), sem tabela nova e sem nenhum leitor precisar saber que o grupo existe',
      'Idempotência tem que ser por ponteiro, não por "já existe um registro?": essa pergunta não distingue "ainda não gerei" de "gerei e o usuário descartou de propósito"',
      'Nem toda categorização pede modelo de linguagem: pontuar contra o histórico da própria casa resolveu melhor aqui, mantém o gasto dentro do sistema e funciona sem rede',
    ],
    stack: [
      'TypeScript',
      'Expo Router',
      'tRPC',
      'Node.js',
      'PostgreSQL',
      'Row-Level Security',
      'Vitest',
      'n8n',
    ],
    tags: ['fintech', 'multi-tenant', 'appsec', 'mobile', 'produto'],
    relatedSurfaceKeys: ['finance', 'platform'],
    startedAt: '2026-09-12',
    updatedAt: '2026-09-28',
    featured: true,
  },
  en: {
    slug: 'felpsxp-finance',
    title: 'FelpsXP Finance',
    summary:
      'A multi-tenant household finance product, live and in daily use: accounts, cards, instalments, loans, goals and expenses split between the people who live there, built for iOS, Android and web from one codebase.',
    status: 'active',
    visibility: 'public',
    type: 'product',
    difficulty: 'advanced',
    primaryDomain: 'backend',
    secondaryDomains: ['appsec', 'iam', 'frontend'],
    media: [],
    role: 'Architecture, backend, client, domain modelling, and running it in production',
    problem:
      'Personal finance tools are almost always designed for one person. A household is a different problem: several people, shared accounts and cards, and commitments that belong to one member but affect everyone’s month. And the requirement that drives everything is not a feature: two households can never see each other’s money.',
    solution:
      'A multi-tenant product where each household is a fully isolated tenant, with the isolation enforced by the database rather than by convention in application code. One codebase renders to iOS, Android and web; business rules live in the API and in a shared package of pure functions used by both sides, so a preview in the interface and the value actually written are computed by the same function.',
    architectureHighlights: [
      'Tenant isolation via row-level security from the first migration, with explicit table grants alongside it: the lesson of a real production failure',
      'Platform administration kept entirely outside the tenant model, so the isolation rule has no exceptions to get wrong',
      'Authentication behind its own internal interface, so the provider can be replaced without touching screens or rules',
      'Every value is an integer number of cents, never a floating-point number',
      'Three distinct dates per commitment (the month it belongs to, the date it is owed, the date the money actually moved), because collapsing them into one field makes reporting, reminders and cash flow mutually incompatible',
      'Balances derived from the ledger on every read, never kept as a running total that could drift from the rows it claims to summarise',
      'Instalments as siblings under a shared group id, with no privileged first row: a shape that later solved an unrelated problem unchanged, one bill paid by several household members, with no new table',
      'Recurrence made idempotent by a progress pointer, which can tell "not generated yet" from "generated and deliberately discarded"',
      'Errors and logs that carry no financial or personal data, by logging which operation failed rather than maintaining a redaction list',
      'A pure, dependency-free financial maths package covered by automated tests: instalment splitting, card cycles, recurrence, discounts and interest, and reading a bank slip’s own digits offline',
    ],
    challenges: [
      'A real production failure where correct isolation policies were never reached, because the underlying table-permission check denied the request first: a correct policy behind a missing grant looks exactly like a broken product',
      'Modelling money that arrives without being earned (a loan’s principal, a correction to an unlogged balance) so the balance is right without contaminating what derives from income',
      'Leaving a household free to rename its own categories while the system still needs to find the ones it relies on',
      'Categorising a typed description without sending the household’s spending outside the system or depending on a network',
    ],
    responsibilities: [
      'Design the multi-tenant model and the isolation boundary',
      'Implement the API and business rules, including calendar and rounding arithmetic',
      'Build the single client that serves iOS, Android and web',
      'Operate the product in production, with transactional e-mail in the real account flow',
    ],
    outcomes: [
      'Live and in daily use by the family, not in a demo environment; the store launch (Android and iOS) is planned, with no date yet',
      'Being prepared for commercial release as an Android and iOS app',
      'Consumes the ecosystem platform only through its API, with no access to its source or database: the boundary stays honest because it is not bypassable',
      'Produced the ecosystem’s second package of real, tested code, publishable on its own',
    ],
    learnings: [
      'A correct isolation policy is useless if the permission underneath it denies first. The failure mode does not announce itself as a permissions problem: it presents as the product simply not working, and it took a production failure to learn to look one layer down',
      'Deriving is cheaper than storing: a balance computed on every read can never drift from the ledger it claims to summarise, and recomputing costs far less than reconciling later',
      'A good shape pays for itself twice: instalments as siblings under a group, with no privileged row, solved an unrelated problem unchanged (one bill paid by several people), with no new table and no downstream reader needing to know the group exists',
      'Idempotency has to come from a pointer, not from "does a record already exist?": that question cannot tell "not generated yet" from "generated and deliberately discarded"',
      'Not every categorisation problem wants a language model: scoring against the household’s own history worked better here, keeps spending inside the system, and works with no network',
    ],
    stack: [
      'TypeScript',
      'Expo Router',
      'tRPC',
      'Node.js',
      'PostgreSQL',
      'Row-Level Security',
      'Vitest',
      'n8n',
    ],
    tags: ['fintech', 'multi-tenant', 'appsec', 'mobile', 'product'],
    relatedSurfaceKeys: ['finance', 'platform'],
    startedAt: '2026-09-12',
    updatedAt: '2026-09-28',
    featured: true,
  },
};
