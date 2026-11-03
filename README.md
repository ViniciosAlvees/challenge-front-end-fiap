# Soul Up — sustentabilidade em comunidade

A Soul Up conecta pessoas a ações ambientais por meio de desafios, grupos e reconhecimento. Este projeto é uma SPA desenvolvida para a Entrega 4 de Front-End Design Engineering do Challenge FIAP 2026.

![Marca Soul Up](./public/icon/souldup.png)

## Tecnologias utilizadas

- React 19, Vite e TypeScript com verificação estrita de tipos.
- Tailwind CSS 4 para layout e responsividade.
- React Router DOM para rotas estáticas e dinâmicas.
- React Hook Form para o formulário de contato e de conta.
- Fetch API nativa para requisições HTTP; sem Axios ou bibliotecas externas de UI.
- Node.js para a função de acesso de funcionários e os testes automatizados.
- Git e GitHub para versionamento.

## Como Usar

### Links da entrega

| Recurso | Endereço ou situação |
|---|---|
| Repositório do front-end | [challenge-front-end-fiap](https://github.com/alvesdemacedoenzo-beep/challenge-front-end-fiap) — conferir acesso público sem login antes de entregar |
| Repositório Java | [challeng-sprin4-Java](https://github.com/velascoguzmanvictorhugo-ui/challeng-sprin4-Java) |
| API Java publicada | [API Soul Up](https://challeng-sprin4-java.onrender.com) |
| Deploy na Vercel | **Pendente: inserir a URL real após a publicação e os testes online.** |
| Vídeo no YouTube | **Pendente: gravar a demonstração de até 3 minutos e inserir o link acessível.** |

Os dois últimos itens ainda são pendências da entrega; não representam links já publicados.

### Instalação e execução

Requisitos: Node.js 22.18+ ou 24+ e npm.

```bash
npm ci
npm run dev
```

O aplicativo usa `/api` por padrão. O proxy do Vite encaminha as requisições para a API Java. Opcionalmente, copie `.env.example` para `.env.local` para personalizar `VITE_API_BASE_URL`. Em produção, o `vercel.json` encaminha as mesmas rotas e fornece fallback para a SPA. Reinicie o Vite após alterar a configuração.

```bash
npm test
npm run build
npm run preview
npm run check:api
```

`npm test` verifica autenticação, contrato HTTP, validação das respostas e regras de gestão local. `check:api` faz apenas consultas de leitura e informa o status dos endpoints, sem exibir os dados pessoais dos registros.

### Navegação e funcionalidades

- **Menu:** abre e fecha os links das páginas em qualquer resolução; fecha ao navegar ou pressionar Escape.
- **Home, Sobre, FAQ e Integrantes:** apresentação da proposta e da equipe.
- **Solução e Avatar:** conteúdo e prototipação navegável da proposta, com detalhes em `/solucao/:slug`.
- **Grupos:** listagem real da API em `/grupos`, detalhe em `/grupos/:id` e cadastro em `/grupos/novo`. O cadastro envia os IDs dos participantes e consulta novamente a API para verificar os vínculos.
- **Conta e Perfil:** cadastro e autenticação por senha. O login somente é aceito quando `/auth/login` e `/auth/me` confirmam a sessão; não existe entrada apenas por e-mail nem autenticação pelo armazenamento do navegador.
- **Acesso Funcionário:** consulta de usuários e seus detalhes, criação e ativação local de desafios, consulta e análise local de ações e ranking local. A senha inicial solicitada é `123456789`. Leia [FUNCIONARIOS.md](./FUNCIONARIOS.md).
- **Gestão da API:** acessível a partir da área de funcionários; apresenta usuários, grupos e desafios e confirma exclusões consultando o servidor novamente.
- **Desafios:** participação com descrição e foto local, sujeita à aprovação de funcionário. Os pontos locais e os pontos da API são apresentados separadamente no perfil.
- **Contato:** formulário demonstrativo com validação, sem envio de mensagens.

### Integração e atualização do Java

O código Java consultado na branch `main`, commit `107b64c689ccd649fc51350d87daf0e4f90bbde5`, oferece listagens em `GET /usuarios`, `GET /grupos` e `GET /desafios`; escrita com `POST /usuarios` e `POST /grupos`; exclusão com `DELETE /usuarios?id=...` e `DELETE /grupos?id=...`.

As telas de detalhe consultam os dados atuais das listagens e selecionam o registro pelo ID. Identificadores inválidos ou inexistentes têm feedback próprio. Respostas inválidas, falhas HTTP e listas vazias são tratadas separadamente, sem fabricar registros.

**O Java publicado ainda precisa receber a correção de autenticação e membros.** O pacote em [backend-patches](./backend-patches/README.md) contém o patch e as instruções de migração e publicação. Até essa atualização, o front-end informa a ausência do serviço de autenticação e não simula um login bem-sucedido. Contas antigas sem credencial exigem um fluxo de recuperação de identidade; não recebem senha automática.

Desafios, fotos, pareceres e ranking local continuam armazenados neste navegador, sem sincronização automática com o SQLite do Python ou com outros dispositivos. Esses dados de demonstração não substituem a persistência e a autorização do backend. A API Java é usada para as listagens, detalhes e operações de escrita dos cadastros.

## Estrutura de pastas

```text
api/                 # Função da Vercel para acesso de funcionários
backend-patches/     # Correções Java e procedimento de aplicação
public/icon/         # Marca e ícones
scripts/             # Verificação da API e preparação da entrega
server/              # Autenticação dos funcionários no servidor Node
src/
  assets/team/       # Fotos dos integrantes
  components/        # Layout, proteção e feedback reutilizáveis
  contexts/          # Sessão de usuário verificada no servidor
  data/              # Conteúdo e interfaces da equipe
  pages/             # Páginas da SPA
  services/          # Integração HTTP e regras locais tipadas
tests/               # Testes automatizados
```

## Autores e créditos

Equipe **Nexus Elite**, turma **1TDSPY**, FIAP. Os dados da equipe utilizam interfaces e intersection types; estados de autenticação e ações utilizam union types.

| Integrante | RM | Foto | LinkedIn | GitHub |
|---|---|---|---|---|
| Raphael Ferreira Tavares | 569767 | ![Raphael](./src/assets/team/raphael.png) | [Perfil](https://www.linkedin.com/in/raphael-ferreira-0111323b8/) | [raph-ferreira](https://github.com/raph-ferreira) |
| Bryan Germano | 569716 | ![Bryan](./src/assets/team/bryan.png) | [Perfil](https://www.linkedin.com/in/bryan-germano-84016729b/) | [BryanGermano](https://github.com/BryanGermano) |
| Enzo Macedo | 569427 | ![Enzo](./src/assets/team/enzo.png) | [Perfil](https://www.linkedin.com/in/enzo-alves-de-macedo-408359356/) | [alvesdemacedoenzo-beep](https://github.com/alvesdemacedoenzo-beep) |
| Victor Hugo Velasco Guzman | 573173 | ![Victor](./src/assets/team/victor.png) | [Perfil](https://www.linkedin.com/in/victor-hugo-velasco-guzman-296256235/) | [velascoguzmanvictorhugo-ui](https://github.com/velascoguzmanvictorhugo-ui) |
| Vinicios Alves | 573002 | ![Vinicios](./src/assets/team/vinicios.png) | [Perfil](https://www.linkedin.com/in/vinicios-alves-dos-santos-434128327/) | [ViniciosAlvees](https://github.com/ViniciosAlvees) |

Marca e imagens de equipe fornecidas com o projeto. Houve apoio do Codex na implementação e revisão técnica; os integrantes devem revisar e compreender as alterações e registrar seu uso de IA conforme as exigências de cada disciplina.

## Contato

[soulup@gmail.com](mailto:soulup@gmail.com) e perfis profissionais dos integrantes acima.

## Preparação da entrega

Antes de enviar, publique a API corrigida e o front-end, valide o acesso público, preencha os links pendentes e revise [ENTREGA_SPRINT4.md](./ENTREGA_SPRINT4.md). O ZIP deve ter até 50 MB, incluir o código e as configurações e excluir `node_modules`, credenciais, caches e arquivos temporários. O envio deve ocorrer pelo Portal do Aluno.
