import type { LegalPage, Localized } from '@/content/types';

/**
 * Accessibility statement, published at /accessibility. Every claim here must
 * match what the code and the test suite actually do: update this page in the
 * same PR as any change to e2e/accessibility.spec.ts or to the features listed.
 */
export const accessibilityPageByLocale: Localized<LegalPage> = {
  pt: {
    title: 'Acessibilidade',
    summary:
      'O nível de acessibilidade que este site busca, como ele é verificado a cada mudança e o que ainda tem limitações conhecidas.',
    updatedAt: '2026-11-14',
    sections: [
      {
        heading: 'Meta',
        paragraphs: [
          'O objetivo é atender às Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2, nível AA, em todas as páginas, nos dois idiomas, no tema claro e no escuro, no computador e no celular.',
        ],
      },
      {
        heading: 'Como é verificado',
        paragraphs: [
          'Cada pull request roda o axe-core, pelo Playwright, em todas as páginas públicas, nas combinações de idioma, tema e tamanho de tela, com as regras de WCAG 2.0, 2.1 e 2.2 nos níveis A e AA. Uma violação bloqueia o merge.',
          'Testes de ponta a ponta também cobrem o uso pelo teclado: o link para pular ao conteúdo, o menu móvel que fecha com Esc e devolve o foco ao botão, e a navegação pelo sumário das páginas.',
          'Testes automáticos encontram só uma parte dos problemas de acessibilidade. Eles são a base, não a prova completa.',
        ],
      },
      {
        heading: 'O que o site oferece',
        paragraphs: [
          'Estrutura semântica com cabeçalho, navegação, conteúdo principal e rodapé, um único título principal por página e o idioma declarado em cada página.',
          'Um link para pular direto ao conteúdo, foco visível nos controles e áreas de toque de pelo menos 24 por 24 pixels nos links pequenos.',
          'Tema claro e escuro que segue a preferência do sistema, com troca manual que fica salva só no seu navegador.',
          'Formulário de contato com rótulos em todos os campos, erros ligados ao campo que os causou e mensagens anunciadas por leitores de tela.',
          'Trilha de navegação, sumário e links diretos para cada seção nas páginas longas.',
        ],
      },
      {
        heading: 'Limitações conhecidas',
        paragraphs: [
          'Ainda não houve uma rodada documentada de testes com leitores de tela, como NVDA ou VoiceOver. Ela está planejada.',
          'A verificação contra robôs do formulário de contato é um iframe do Cloudflare Turnstile, fora do meu controle. Se ela atrapalhar, escreva direto para o e-mail no fim desta página.',
          'As notas do histórico de versões ficam em inglês, como os commits de onde são geradas.',
        ],
      },
      {
        heading: 'Encontrou uma barreira?',
        paragraphs: [
          'Conte qual página, o que você tentava fazer e, se puder, o navegador e a tecnologia assistiva que usa. Toda barreira relatada é tratada como um bug, com resposta em até 7 dias.',
        ],
      },
    ],
  },
  en: {
    title: 'Accessibility',
    summary:
      'The accessibility level this site aims for, how it is checked on every change and where it still has known limitations.',
    updatedAt: '2026-11-14',
    sections: [
      {
        heading: 'Target',
        paragraphs: [
          'The goal is to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA on every page, in both languages, in the light and dark themes, on desktop and on mobile.',
        ],
      },
      {
        heading: 'How it is checked',
        paragraphs: [
          'Every pull request runs axe-core, through Playwright, on every public page across the combinations of language, theme and screen size, with the WCAG 2.0, 2.1 and 2.2 rules at levels A and AA. A violation blocks the merge.',
          'End-to-end tests also cover keyboard use: the skip link, the mobile menu closing with Escape and returning focus to its button, and moving through a page with its table of contents.',
          'Automated tests find only part of all accessibility problems. They are the baseline, not the whole proof.',
        ],
      },
      {
        heading: 'What the site provides',
        paragraphs: [
          'Semantic structure with a header, navigation, main content and footer, a single main heading per page and the language declared on every page.',
          'A link to skip straight to the content, visible focus on controls and touch targets of at least 24 by 24 pixels on small links.',
          'Light and dark themes that follow the system preference, with a manual switch saved only in your browser.',
          'A contact form with a label on every field, errors tied to the field that caused them and messages announced by screen readers.',
          'A breadcrumb trail, a table of contents and direct links to each section on long pages.',
        ],
      },
      {
        heading: 'Known limitations',
        paragraphs: [
          'There has not yet been a documented round of testing with screen readers such as NVDA or VoiceOver. It is planned.',
          'The contact form’s bot check is a Cloudflare Turnstile iframe, outside my control. If it gets in your way, write directly to the address at the end of this page.',
          'The release notes in the changelog are in English, like the commits they are generated from.',
        ],
      },
      {
        heading: 'Found a barrier?',
        paragraphs: [
          'Say which page, what you were trying to do and, if you can, the browser and assistive technology you use. Every reported barrier is treated as a bug, with a reply within 7 days.',
        ],
      },
    ],
  },
};
