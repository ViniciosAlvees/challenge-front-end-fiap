# Conferência da entrega 4 de Front-End

## Corrigido no código

- Removida autenticação apenas por e-mail e a confiança em uma conta salva no navegador.
- Sessão confirmada em `/auth/me`; erros do backend não são convertidos em autenticação bem-sucedida.
- Incluídas listagem de grupos e páginas de detalhe com registros reais da API.
- Corrigidas exclusões para o contrato `?id=` e adicionada confirmação por nova consulta.
- Erros HTTP, carregamento e resultados vazios possuem feedback separado.
- Removidos os `any` da camada de integração e os IDs/datas artificiais.
- Cadastro de grupo envia membros e confere a persistência na API.
- README refeito, sem conflitos de merge e com funcionalidades e limitações atuais.
- Menu recolhido por padrão em qualquer resolução e navegação por teclado.
- Correção Java preparada e testada, entregue em `backend-patches/`.

## Verificação antes de enviar

- [ ] Revisar o patch Java, validar a migração no Oracle de homologação e publicar a API corrigida.
- [ ] Validar cadastro com senha, login, recarga da sessão, senha incorreta e logout online.
- [ ] Validar criação de grupo e persistência de membros no banco atualizado.
- [ ] Publicar o front-end na Vercel e inserir a URL real em **Como Usar** no README.
- [ ] Gravar vídeo de até 3 minutos com navegação, tecnologias, GET, detalhe e escrita real na API; publicar no YouTube e inserir o link.
- [ ] Conferir acesso público ao GitHub e participação individual dos integrantes.
- [ ] Conferir visualmente em 375/480px, 768px, 992px e 1440px. Classes responsivas não substituem essa inspeção.
- [ ] Executar `npm ci`, `npm test`, `npm run build` e `npm run check:api`.
- [ ] Preparar ZIP de até 50 MB, sem `node_modules` ou credenciais, contendo o código completo, lockfile, configurações, README e histórico verificável no GitHub.
- [ ] Enviar o ZIP pelo Portal do Aluno dentro do prazo.

Este checklist trata de Front-End Design Engineering, páginas 75 a 92 do enunciado fornecido. Não certifica as entregas de Python, Java, banco, IA ou negócios. O uso de IA deve ser explicado e compreendido pelos integrantes segundo o enunciado de cada disciplina.
