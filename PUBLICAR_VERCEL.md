# Publicar o front-end na Vercel

## Publicacao assistida

Habilite a integracao Vercel nesta conversa. Depois disso, e possivel verificar sua conta, localizar um projeto existente e publicar a versao corrigida, sem precisar enviar senhas pelo chat. O Render e necessario separadamente para atualizar o Java; a migracao Oracle exige acesso ao banco.

## Pelo painel da Vercel

1. Entre em https://vercel.com/dashboard com sua conta.
2. Antes de importar, envie o codigo corrigido ao GitHub e confirme a branch que sera publicada. A Vercel publica o codigo remoto; mudancas apenas no VS Code nao entram em um deploy pelo GitHub.
3. Se o projeto ja existir no painel, abra-o e confira o repositorio e a branch. Para um projeto novo, clique em **Add New > Project**, importe `alvesdemacedoenzo-beep/challenge-front-end-fiap` e selecione a branch com as correcoes.
4. Use **Framework Preset: Vite**, **Root Directory: raiz do projeto**, **Build Command: npm run build**, **Output Directory: dist** e **Install Command: npm ci**. O `vercel.json` ja declara esses valores.
5. Mantenha a integracao com o Java pelo prefixo `/api`. A aplicacao usa esse valor por padrao; se definir `VITE_API_BASE_URL`, use `/api`.
6. Clique em **Deploy**. Quando o status for **Ready**, clique em **Visit** e copie a URL exibida em **Domains**. Essa sera a URL real do front-end; ela nao deve ser deduzida a partir do nome do repositorio.
7. Em um projeto ja publicado, voce encontra a URL em **Dashboard > projeto > Domains**, ou abrindo a implantacao de producao mais recente e clicando em **Visit**.
8. Cole a URL em **Como Usar** no README e confira se o site abre em uma janela anonima. As paginas de funcionarios continuam exigindo a senha configurada.

## Variaveis e API

- A senha compartilhada de funcionarios solicitada inicialmente e `123456789`. Ela e validada no servidor Node. `EMPLOYEE_PASSWORD` pode substituir esse valor e deve ficar somente no ambiente do servidor, sem prefixo `VITE_`.
- O Java em https://challeng-sprin4-java.onrender.com ainda precisa receber o patch e a migracao descritos em `backend-patches/README.md` para disponibilizar login com senha e persistencia dos membros.
- Ao publicar o Java corrigido, configure `FRONTEND_ORIGINS` com a URL exata do front-end, sem barra final, e mantenha `SESSION_COOKIE_SECURE=true` em HTTPS.
- Nao publique o Java corrigido antes de preparar e validar a migracao no banco correspondente.

## Conferencia online

Abra `/`, `/grupos`, um detalhe de grupo valido, uma URL inexistente e `/acesso-funcionario`. Confira a consulta a API, senha incorreta, senha correta e encerramento da sessao. Depois de atualizar o Java, valide cadastro, login, recarga e logout do usuario e a persistencia de membros. Inspecione tambem as telas em celular, tablet e desktop.

Documentacao oficial: https://vercel.com/docs/git e https://vite.dev/guide/static-deploy#vercel.
