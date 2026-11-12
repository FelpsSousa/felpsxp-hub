# felpsxp-hub

> O código-fonte de [felpsxp.com](https://felpsxp.com): o portfólio de Felipe Sousa, construído
> como uma aplicação web pequena, em padrão de produção, com segurança e acessibilidade
> verificadas a cada pull request.

[English](README.md) · **Português (BR)**

[![CI](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/ci.yml)
[![CodeQL](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/codeql.yml/badge.svg)](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Parte do **ecossistema digital FelpsXP** · ID no registro: `FXP-003`

---

## O que é

Um portfólio bilíngue (português e inglês): perfil, projetos, formulário de contato e as
políticas de privacidade e de segurança. Enxuto em funcionalidades e rigoroso em engenharia:
o próprio repositório foi feito para ser lido, então cada decisão está registrada, cada
controle de segurança tem teste e o histórico é uma sequência de pull requests pequenos e
revisados.

## Destaques

- **Estático por padrão:** toda página é gerada no build, nos dois idiomas, e servida por CDN.
  Sem banco e sem autenticação, porque nenhuma página pública precisa deles.
- **Conteúdo como código:** perfil, projetos e páginas legais em TypeScript validado com Zod
  no build.
- **Decisões antes do código:** sete [ADRs](docs/adr/README.md) até agora (em inglês).
- **Modelo de ameaças STRIDE** com cada mitigação ligada ao PR ou ADR que a implementa
  ([docs/security/threat-model.md](docs/security/threat-model.md)).
- **Headers de segurança testados** em teste unitário e de novo numa resposta real de produção.
- **Formulário de contato endurecido:** Turnstile verificado no servidor, honeypot silencioso,
  validação que barra injeção de cabeçalho, e-mail em texto puro, nada armazenado e eventos de
  segurança anônimos.
- **Cadeia de suprimentos:** gitleaks, CodeQL no código e nos workflows, actions fixadas por SHA
  e dependências novas só em versões com algumas semanas de vida.
- **Testes de ponta a ponta com Playwright e auditoria WCAG 2.2 AA com axe** em todas as páginas,
  nos dois idiomas e nos dois temas, em desktop e mobile.
- **Privacidade desde o desenho (LGPD):** um único cookie de sessão para o idioma, nenhum
  rastreamento e um aviso de privacidade que um teste mantém fiel ao código.

## Como rodar

```bash
git clone https://github.com/FelpsSousa/felpsxp-hub.git
cd felpsxp-hub
pnpm install
pre-commit install --hook-type pre-commit --hook-type commit-msg
cp .env.example .env.local    # o formulário de contato precisa destas variáveis
pnpm dev                      # http://localhost:3000
```

Os demais comandos estão no [README em inglês](README.md#getting-started).

## Segurança

Não abra issue pública para vulnerabilidades. Veja o [SECURITY.md](SECURITY.md) ou escreva para
security@felpsxp.com.

## Licença

[MIT](LICENSE) © 2026 Felipe Sousa · FelpsXP
