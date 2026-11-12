import type { LegalPage, Localized } from '@/content/types';

/**
 * Vulnerability disclosure policy, published at /security and referenced by
 * public/.well-known/security.txt. Keep it consistent with SECURITY.md.
 */
export const securityPageByLocale: Localized<LegalPage> = {
  pt: {
    title: 'Segurança',
    summary:
      'Como relatar uma vulnerabilidade neste site ou no código dele, o que está no escopo e o que você pode esperar de volta.',
    updatedAt: '2026-11-12',
    sections: [
      {
        heading: 'Como relatar',
        paragraphs: [
          'Escreva para o endereço no fim desta página ou abra um relato privado no GitHub, em Security, Advisories, Report a vulnerability, no repositório público do site. Não abra issue, discussão ou pull request públicos para problemas de segurança.',
          'Inclua uma descrição do problema e do impacto, os passos para reproduzir ou uma prova de conceito, a URL ou o commit afetado e, se tiver, uma sugestão de correção.',
        ],
      },
      {
        heading: 'Escopo',
        paragraphs: [
          'Estão no escopo o site felpsxp.com, seus subdomínios e o código do repositório público felpsxp-hub.',
          'Ficam fora do escopo: ataques de negação de serviço ou volumétricos, engenharia social, ataques físicos, achados que exigem um dispositivo já comprometido, relatórios automáticos de scanners sem impacto demonstrado e vulnerabilidades em serviços de terceiros, que devem ser relatadas ao respectivo fornecedor.',
        ],
      },
      {
        heading: 'Porto seguro',
        paragraphs: [
          'Pesquisa de boa-fé que respeite esta política não será alvo de ação legal. Isso significa não destruir dados, não violar a privacidade de ninguém, não interromper o serviço e usar apenas o acesso mínimo necessário para demonstrar o problema.',
          'Se você encontrar dados pessoais, não os guarde nem os compartilhe, conforme a LGPD, e me avise.',
        ],
      },
      {
        heading: 'O que esperar',
        paragraphs: [
          'Este site é mantido por uma pessoa, então os prazos são realistas: confirmação de recebimento em até 7 dias, avaliação inicial em até 14 dias e correção ou mitigação de problemas graves confirmados o quanto antes, normalmente em até 30 dias.',
          'Você recebe notícias ao longo do processo e, se quiser, o crédito pelo achado. Não há programa de recompensa em dinheiro.',
        ],
      },
      {
        heading: 'Como este site se protege',
        paragraphs: [
          'O modelo de ameaças, os ADRs e os testes que verificam cada header de segurança estão no repositório público do site, assim como o arquivo security.txt em /.well-known/security.txt.',
        ],
      },
    ],
  },
  en: {
    title: 'Security',
    summary:
      'How to report a vulnerability in this site or its code, what is in scope, and what you can expect back.',
    updatedAt: '2026-11-12',
    sections: [
      {
        heading: 'How to report',
        paragraphs: [
          'Write to the address at the end of this page, or open a private report on GitHub under Security, Advisories, Report a vulnerability, in the site’s public repository. Please do not open a public issue, discussion or pull request for security problems.',
          'Include a description of the issue and its impact, steps to reproduce or a proof of concept, the affected URL or commit and, if you have one, a suggested fix.',
        ],
      },
      {
        heading: 'Scope',
        paragraphs: [
          'In scope: the felpsxp.com site, its subdomains and the code in the public felpsxp-hub repository.',
          'Out of scope: denial-of-service or volumetric attacks, social engineering, physical attacks, findings that require an already compromised device, automated scanner reports without demonstrated impact, and vulnerabilities in third-party services, which should be reported to the vendor.',
        ],
      },
      {
        heading: 'Safe harbour',
        paragraphs: [
          'Good-faith research that respects this policy will not be pursued legally. That means no data destruction, no privacy violations, no service disruption, and only the minimum access needed to demonstrate the issue.',
          'If you come across personal data, do not keep or share it, as required by Brazil’s LGPD, and let me know.',
        ],
      },
      {
        heading: 'What to expect',
        paragraphs: [
          'This site is maintained by one person, so the timelines are realistic: acknowledgement within 7 days, an initial assessment within 14 days, and a fix or mitigation for confirmed serious issues as soon as possible, usually within 30 days.',
          'You will be kept informed throughout and credited for the finding if you wish. There is no cash bounty programme.',
        ],
      },
      {
        heading: 'How this site protects itself',
        paragraphs: [
          'The threat model, the ADRs and the tests that check every security header live in the site’s public repository, together with the security.txt file at /.well-known/security.txt.',
        ],
      },
    ],
  },
};
