# Soul Up — sustentabilidade em comunidade

A Soul Up é uma proposta de rede social sustentável que transforma ações ambientais em experiências sociais e coletivas. A plataforma organiza desafios, grupos, evidências, validação comunitária e reconhecimento para aproximar as pessoas do impacto positivo.

![Logo Soul Up](./public/icon/souldup.png)

## Tecnologias

- React 19 e Vite
- TypeScript
- Tailwind CSS 4
- React Router DOM
- React Hook Form
- Fetch API nativa para a camada de integração REST
- Git e GitHub

Não são usados Axios ou frameworks externos de UI. A integração REST usa `fetch` e encaminha chamadas `/api` para `https://challeng-sprin4-java.onrender.com`.

## Páginas e recursos

- Início: apresentação e acesso rápido às áreas do projeto.
- Sobre: problema, proposta, pilares, jornada, inovação e oportunidades de capacitação.
- Solução: frentes da proposta e páginas dinâmicas de detalhes em `/solucao/:slug`.
- Avatar: explicação do mentor digital da plataforma.
- Conta: criação de conta com nome, e-mail e senha, entrada em conta existente e encerramento de sessão.
- Perfil: nome, e-mail e pontuação da conta conectada.
- Cadastrar grupo: pesquisa usuários por nome ou e-mail e cria grupos com os membros selecionados.
- Desafios: catálogo interativo com evidência por foto e registro local de conclusão e pontuação.
- Integrantes: nomes, RMs, fotos e perfis profissionais da equipe.
- FAQ: perguntas e respostas em acordeão.
- Contato: formulário tipado com validação de nome, e-mail, assunto e mensagem.

O formulário de contato e a evidência dos desafios são demonstrações locais; fotos não são enviadas ao servidor. A conclusão e a pontuação dos desafios ficam salvas no navegador por conta. A API Java publica `GET` e `POST /usuarios` e `GET` e `POST /grupos`. A listagem de usuários usa `GET /usuarios`; a criação de grupo usa `POST /grupos` com `nome`. No backend atual, o DAO de grupos persiste somente o nome e a data, portanto os membros selecionados na interface ainda não ficam associados após a criação. O endpoint de usuários espera `id`, `nome` e `email`; não há endpoint de autenticação ou senha publicado, então login real não pode ser realizado por essa API. Em desenvolvimento, o proxy do Vite e, em produção, o rewrite do Vercel encaminham `/api` para a URL Java.

## Como executar

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

Para executar localmente, copie `.env.example` para `.env.local`; o proxy encaminha `/api` para a API Java publicada. Reinicie o servidor de desenvolvimento após alterar variáveis de ambiente.

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

O `vercel.json` configura o fallback necessário para abrir diretamente as rotas da SPA em produção. A implantação pública ainda está pendente.

## Estrutura do projeto

```text
.
├── public/
│   └── icon/                # Marca e ícones
├── src/
│   ├── assets/team/         # Fotos da equipe processadas pelo Vite
│   ├── components/          # Layout e componentes reutilizáveis
│   ├── data/                # Conteúdo tipado da aplicação
│   ├── pages/               # Páginas e rotas da SPA
│   ├── services/            # Camada tipada de acesso à API
│   ├── App.tsx              # Rotas React Router
│   ├── index.css            # Tailwind CSS e tema
│   └── main.tsx             # Entrada React
├── index.html
├── vercel.json
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Repositório, API, deploy e apresentação

- GitHub: [alvesdemacedoenzo-beep/challenge-front-end-fiap](https://github.com/alvesdemacedoenzo-beep/challenge-front-end-fiap)
- API Java: [challeng-sprin4-java.onrender.com](https://challeng-sprin4-java.onrender.com) — cadastro e autenticação por `POST /usuarios`, `POST /auth/login`, `GET /auth/me` e `POST /auth/logout`.
- Aplicação na Vercel: **pendente de implantação e envio da URL pela equipe.**
- Vídeo de apresentação (até 3 minutos): **link do YouTube pendente de envio pela equipe.**

## Integrantes

| Integrante | RM | Foto | LinkedIn | GitHub |
|---|---:|---|---|---|
| Raphael Ferreira Tavares | 569767 · 1TDSPY | ![Raphael](./src/assets/team/raphael.png) | [Perfil](https://www.linkedin.com/in/raphael-ferreira-0111323b8/) | [raph-ferreira](https://github.com/raph-ferreira) |
| Bryan Germano | 569716 · 1TDSPY | ![Bryan](./src/assets/team/bryan.png) | [Perfil](https://www.linkedin.com/in/bryan-germano-84016729b/) | [BryanGermano](https://github.com/BryanGermano) |
| Enzo Macedo | 569427 · 1TDSPY | ![Enzo](./src/assets/team/enzo.png) | [Perfil](https://www.linkedin.com/in/enzo-alves-de-macedo-408359356/) | [alvesdemacedoenzo-beep](https://github.com/alvesdemacedoenzo-beep) |
| Victor Hugo Velasco Guzman | 573173 · 1TDSPY | ![Victor](./src/assets/team/victor.png) | [Perfil](https://www.linkedin.com/in/victor-hugo-velasco-guzman-296256235/) | [velascoguzmanvictorhugo-ui](https://github.com/velascoguzmanvictorhugo-ui) |
| Vinicios Alves | 573002 · 1TDSPY | ![Vinicios](./src/assets/team/vinicios.png) | [Perfil](https://www.linkedin.com/in/vinicios-alves-dos-santos-434128327/) | [ViniciosAlvees](https://github.com/ViniciosAlvees) |

## Contato

Para dúvidas sobre o projeto, entre em contato com a equipe pelos perfis vinculados acima ou pelo e-mail [soulup@gmail.com](mailto:soulup@gmail.com).

© 2026 — Nexus Elite · FIAP — Análise e Desenvolvimento de Sistemas.
