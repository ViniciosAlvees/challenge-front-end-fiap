# Correção da API Java

O arquivo `sprint4-auth-members.patch` foi preparado para o repositório [challeng-sprin4-Java](https://github.com/velascoguzmanvictorhugo-ui/challeng-sprin4-Java), a partir do commit `107b64c689ccd649fc51350d87daf0e4f90bbde5` da branch `main`.

Inclui cadastro com hash PBKDF2, login e sessão HttpOnly, validação da sessão, logout, proteção de origem nas rotas de autenticação, persistência transacional dos membros dos grupos e correção do parâmetro de exclusão. Os testes de autenticação usam mocks e não acessam o Oracle.

Em um checkout limpo do Java, crie uma branch e confira o patch antes de aplicá-lo:

```bash
git switch -c fix/sprint4-auth-members
git apply --check /caminho/sprint4-auth-members.patch
git apply /caminho/sprint4-auth-members.patch
cd SoulUp_Menu
mvn test
```

Depois da aplicação, leia `INTEGRACAO_FRONTEND.md`. É necessário revisar e executar **uma vez** o SQL `SoulUp_Menu/database/sprint4-auth-members.sql` no Oracle de homologação, verificar os cadastros e os vínculos e só então planejar a implantação em produção. O patch não apaga dados antigos. Nunca execute a migração novamente sem verificar as tabelas existentes.

Configure `FRONTEND_ORIGINS` com a origem exata do site e mantenha cookies seguros em HTTPS. Em desenvolvimento HTTP, use `SESSION_COOKIE_SECURE=false`. Use o proxy `/api` para preservar a sessão na mesma origem do site.

Contas anteriores sem senha não podem ser assumidas pelo e-mail. Elas precisam de recuperação de identidade; esta alteração não atribui senhas a essas contas. As operações administrativas públicas já existentes no Java ainda precisam de autorização própria antes de uso com dados sensíveis.

O SQL não foi executado em produção e a API publicada não foi alterada. A compilação e os testes Java não substituem a validação da migração em um banco de homologação. O patch deve ser revisado pelos responsáveis pelo Java e pelo banco antes da publicação.
