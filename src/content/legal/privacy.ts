import type { LegalPage, Localized } from '@/content/types';

/**
 * Privacy notice. It must describe what the code actually does: update it in
 * the same pull request as any new cookie, storage, third party or data flow
 * (see also docs/security/threat-model.md).
 */
export const privacyPageByLocale: Localized<LegalPage> = {
  pt: {
    title: 'Privacidade',
    summary:
      'O que este site coleta, por que, por quanto tempo e quem mais participa. Versão curta: nada de rastreamento, nada de anúncios, e o formulário de contato não guarda nada aqui.',
    updatedAt: '2026-11-14',
    sections: [
      {
        heading: 'Quem é o responsável',
        paragraphs: [
          'Este é o site pessoal de Felipe Sousa, que decide como os dados aqui são tratados e responde por isso nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).',
        ],
      },
      {
        heading: 'Navegação',
        paragraphs: [
          'O site não usa analytics, cookies de rastreamento, pixels de redes sociais nem anúncios. As páginas são geradas antecipadamente e entregues prontas, sem banco de dados e sem login.',
          'Um único cookie é usado: NEXT_LOCALE, que guarda apenas o idioma escolhido ("pt" ou "en"). Ele dura até o navegador ser fechado, só trafega por HTTPS (Secure) e não é enviado em requisições de outros sites (SameSite=Lax).',
          'A preferência de tema claro ou escuro fica no armazenamento local do seu navegador (localStorage, chave "theme") e nunca é enviada ao servidor. Se você desligar os atalhos de teclado de uma tecla, essa escolha fica no mesmo lugar, na chave "shortcuts". Você pode apagar as duas limpando os dados do site.',
          'Como qualquer hospedagem, a Vercel, que serve este site, processa dados técnicos de cada acesso (como endereço IP e tipo de navegador) para entregar as páginas e proteger o serviço, conforme a política de privacidade dela. Este site não usa esses registros para identificar visitantes.',
        ],
      },
      {
        heading: 'Formulário de contato',
        paragraphs: [
          'Quando você envia o formulário, os dados informados (nome, e-mail, empresa, que é opcional, assunto e mensagem) servem apenas para eu ler e responder. A base legal é o legítimo interesse em responder a quem me procura e, quando o assunto é uma vaga ou proposta, os procedimentos preliminares a um possível contrato (LGPD, art. 7º, incisos IX e V).',
          'A mensagem não é gravada neste site. Ela é entregue por e-mail, em texto simples, à minha caixa de entrada, por meio do Resend, serviço de envio de e-mails. Ela fica na minha caixa enquanto a conversa for relevante, e você pode pedir que eu a apague a qualquer momento.',
          'Para barrar robôs, o formulário usa o Cloudflare Turnstile, que analisa sinais do navegador para confirmar que há uma pessoa do outro lado, conforme a política de privacidade da Cloudflare. Na verificação feita pelo servidor, este site não envia o seu IP à Cloudflare.',
        ],
      },
      {
        heading: 'Registros de segurança anônimos',
        paragraphs: [
          'Cada envio do formulário gera um registro técnico sem dados pessoais: se foi entregue ou barrado, o motivo do bloqueio, o país de origem, o tipo de cliente (navegador, ferramenta ou robô) e o horário arredondado ao minuto. Ele nunca contém nome, e-mail, empresa, texto da mensagem, endereço IP ou a identificação completa do navegador.',
          'Esses registros servem para proteger o formulário e podem ser publicados apenas como números agregados, por exemplo quantas tentativas automatizadas foram barradas em uma semana.',
        ],
      },
      {
        heading: 'Serviços fora do Brasil',
        paragraphs: [
          'Vercel (hospedagem), Cloudflare (DNS e verificação contra robôs) e Resend (envio de e-mails) podem processar dados fora do Brasil, nos limites necessários para prestar esses serviços e conforme as políticas de privacidade de cada um.',
        ],
      },
      {
        heading: 'Seus direitos',
        paragraphs: [
          'Você pode pedir confirmação de que tenho dados seus, acesso, correção, exclusão ou informações sobre com quem eles foram compartilhados, entre os demais direitos do art. 18 da LGPD. Basta escrever para o endereço abaixo, e eu respondo pessoalmente.',
        ],
      },
      {
        heading: 'Mudanças',
        paragraphs: [
          'Este texto muda sempre que o site passa a tratar dados de outra forma, e a data de atualização no topo acompanha cada mudança. O histórico completo fica no repositório público do site.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy',
    summary:
      'What this site collects, why, for how long, and who else is involved. Short version: no tracking, no ads, and the contact form stores nothing here.',
    updatedAt: '2026-11-14',
    sections: [
      {
        heading: 'Who is responsible',
        paragraphs: [
          'This is the personal site of Felipe Sousa, who decides how data is handled here and is accountable for it under Brazil’s General Data Protection Law (Law 13,709/2018, LGPD).',
        ],
      },
      {
        heading: 'Browsing',
        paragraphs: [
          'The site uses no analytics, no tracking cookies, no social media pixels and no ads. Pages are generated in advance and served ready, with no database and no sign-in.',
          'A single cookie is used: NEXT_LOCALE, which only stores the language you chose ("pt" or "en"). It lasts until the browser is closed, travels only over HTTPS (Secure) and is not sent with requests from other sites (SameSite=Lax).',
          'Your light or dark theme preference lives in your browser’s local storage (localStorage, key "theme") and is never sent to the server. If you turn off the single-key keyboard shortcuts, that choice is kept in the same place, under the key "shortcuts". You can remove both by clearing this site’s data.',
          'Like any host, Vercel, which serves this site, processes technical data about each request (such as IP address and browser type) to deliver pages and protect the service, under its own privacy policy. This site does not use those records to identify visitors.',
        ],
      },
      {
        heading: 'Contact form',
        paragraphs: [
          'When you send the form, the details you provide (name, e-mail, company, which is optional, subject and message) are used only so I can read and answer them. The legal basis is the legitimate interest in replying to people who reach out and, when the subject is a role or a proposal, the steps preliminary to a possible contract (LGPD, article 7, items IX and V).',
          'The message is not stored on this site. It is delivered by e-mail, as plain text, to my inbox through Resend, an e-mail delivery service. It stays in my inbox while the conversation is relevant, and you can ask me to delete it at any time.',
          'To keep bots out, the form uses Cloudflare Turnstile, which looks at browser signals to confirm a person is on the other side, under Cloudflare’s privacy policy. In the check made by the server, this site does not send your IP address to Cloudflare.',
        ],
      },
      {
        heading: 'Anonymous security records',
        paragraphs: [
          'Each form submission produces a technical record with no personal data: whether it was delivered or blocked, the reason for a block, the country of origin, the kind of client (browser, tool or bot) and the time rounded to the minute. It never contains a name, e-mail address, company, message text, IP address or the full browser identification.',
          'These records exist to protect the form and may be published only as aggregated numbers, for example how many automated attempts were blocked in a week.',
        ],
      },
      {
        heading: 'Services outside Brazil',
        paragraphs: [
          'Vercel (hosting), Cloudflare (DNS and bot checks) and Resend (e-mail delivery) may process data outside Brazil, to the extent needed to provide those services and under their own privacy policies.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You can ask for confirmation that I hold data about you, access, correction, deletion, or information about who it was shared with, among the other rights in article 18 of the LGPD. Write to the address below and I will answer personally.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'This text changes whenever the site starts handling data differently, and the date at the top follows every change. The full history lives in the site’s public repository.',
        ],
      },
    ],
  },
};
