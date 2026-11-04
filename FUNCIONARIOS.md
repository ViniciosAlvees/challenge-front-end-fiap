# Acesso Funcionário

Execute `npm install` e `npm run dev`, depois abra `/acesso-funcionario` ou use o link **Acesso Funcionário** do menu.

A senha compartilhada inicial solicitada é `123456789` (9 caracteres; o mínimo do Python é 8). A senha é conferida pelo servidor, nunca pelo JavaScript enviado ao navegador. A sessão usa um cookie HttpOnly com duração de 8 horas e pode ser encerrada pelo botão de saída. A rota anterior `/gestao` também exige essa sessão.

As seis ferramentas são:

1. Consultar usuários da API Java, com indicação de erro quando o serviço não responde.
2. Criar desafios com descrição, categoria e pontuação inteira de 1 a 10000.
3. Ativar/desativar desafios preservando o histórico. Desafios inativos não aparecem para participação.
4. Consultar as ações publicadas em **Desafios**, suas evidências, fotos, status e pareceres.
5. Aprovar/rejeitar ações pendentes com parecer de pelo menos 5 caracteres. Cada ação pode ser analisada uma única vez.
6. Consultar o ranking local, somando os pontos das ações aprovadas.

Para experimentar o fluxo completo, entre em uma conta na página **Conta**, envie uma ação em **Desafios** e acesse a área de funcionários no mesmo navegador para analisá-la. Cada conta pode enviar uma ação por desafio, conforme o Python. A aprovação libera os pontos no perfil e no ranking. Os registros de conclusão anteriores à inclusão da análise são preservados no perfil.

## Armazenamento e integração

As regras locais foram adaptadas do programa Python de terminal. A API Python HTTP agora atende contas, autenticação e consulta de desafios na gestão, mas desafios criados pelos funcionários, ações e fotos continuam no `localStorage` deste navegador, sem sincronização entre dispositivos. As fotos aceitas são JPG, PNG, WebP e GIF de até 2 MB, sujeitas à capacidade de armazenamento do navegador. O ranking não altera pontos nas APIs. Ainda não há votação comunitária no site, portanto não são concedidos os bônus de voto do Python.

A senha protege as telas de funcionários e a consulta de usuários por seu endpoint. Os registros locais são dados de demonstração e podem ser alterados pelas ferramentas do navegador; controle de integridade entre usuários/dispositivos exige armazenamento e autorização no backend.

O endpoint `/api/acesso-funcionario` é atendido pelo middleware local no Vite (desenvolvimento e preview) e pela função `api/acesso-funcionario.js` na Vercel. `/api/java/*` encaminha ao Java; os demais endpoints `/api/*` encaminham ao Python.

Opcionalmente, defina `EMPLOYEE_PASSWORD` no ambiente do processo Node ou nas variáveis de ambiente da Vercel para substituir a senha inicial. Não use o prefixo `VITE_` para essa variável. Reinicie o servidor após alterações. `SOULUP_JAVA_API_URL` permite configurar a API Java consultada pelos funcionários; `SOULUP_API_URL` permanece aceito como nome antigo.

## Verificação

`npm run build` verifica os tipos e gera a versão de produção. `npm test` executa os testes de autenticação e das regras locais usando o test runner nativo do Node.js 22.18+ ou 24+.
