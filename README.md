# 🔒 Foco Bloqueio

**Uma página de bloqueio motivacional, leve e personalizável por URL.**

O **Foco Bloqueio** é uma página HTML estática que lembra você dos seus objetivos quando tenta acessar um site fora do horário que definiu.

Em vez de modificar o conteúdo do site bloqueado, um userscript ou extensão pode **redirecionar o navegador para uma página motivacional personalizada**.

O projeto foi criado para ajudar a reduzir distrações e recuperar o foco, sem exigir contas, bancos de dados ou serviços pagos.

## ✨ Funcionalidades

- **Mensagens personalizadas:** título, descrição, objetivo, próxima ação e rodapé.
- **Horário de liberação:** exibe o horário enviado pelo bloqueador.
- **Identificação do site:** mostra qual site foi pausado.
- **Temas claro e escuro.**
- **Layout responsivo:** compatível com celulares e computadores.
- **Privacidade:** aceita parâmetros no fragmento `#` da URL.
- **Sem dependências:** HTML, CSS e JavaScript puro.

## 🚀 Instalação

A página pode ser hospedada gratuitamente em qualquer serviço de hospedagem estática.

### Publicando no GitHub Pages

1. Crie um repositório público chamado `foco-bloqueio`.
2. Adicione o arquivo `index.html` à raiz do repositório.
3. Acesse **Settings → Pages**.
4. Selecione **Deploy from a branch**.
5. Escolha a branch `main` e a pasta `/(root)`.
6. Salve e aguarde a publicação.

A página estará disponível em um endereço semelhante a:

`https://SEU_USUARIO.github.io/foco-bloqueio/`

## ⚙️ Parâmetros disponíveis

A página recebe parâmetros pela URL, permitindo sua utilização por diferentes usuários sem modificar o código-fonte.

| Parâmetro | Descrição |
|---|---|
| `site` | Nome do site bloqueado |
| `titulo` | Título principal da página |
| `mensagem` | Mensagem explicativa |
| `objetivo` | Objetivo pessoal do usuário |
| `acao` | Próxima ação recomendada |
| `liberacao` | Próximo horário permitido |
| `rodape` | Frase motivacional de encerramento |
| `tema` | `escuro` ou `claro` |

Todos os parâmetros são opcionais. Quando não são informados, a página utiliza textos padrão.

### Exemplo de URL

`https://SEU_USUARIO.github.io/foco-bloqueio/#site=youtube.com&titulo=Hora+de+focar&objetivo=Concluir+meu+projeto&liberacao=Hoje+as+17%3A30&tema=escuro`

Os parâmetros também podem ser enviados por query string (`?`), mas recomendamos utilizar o fragmento `#` para maior privacidade. Quando ambos estão presentes, o fragmento tem prioridade.

## 🔗 Integração com bloqueadores

O Foco Bloqueio **não bloqueia sites sozinho**.

Ele funciona como uma página de destino para bloqueadores, extensões ou userscripts responsáveis por verificar domínios e horários.

Por exemplo, um userscript instalado no **Via Browser** pode verificar o horário atual e redirecionar o usuário para a página motivacional quando o acesso não estiver permitido.

O redirecionamento pode ser realizado com `location.replace()`, passando as informações personalizadas no fragmento da URL.

Essa arquitetura permite que cada usuário configure suas próprias listas de sites, horários e objetivos, utilizando a mesma página hospedada.

## 🔐 Privacidade

O projeto foi desenvolvido com atenção à privacidade dos usuários.

- Os parâmetros enviados após `#` não são transmitidos ao servidor na requisição HTTP.
- As mensagens são processadas localmente pelo JavaScript.
- Os parâmetros são inseridos na página utilizando `textContent`, sem serem interpretados como HTML.
- O projeto não inclui cookies, analytics ou bibliotecas externas.

**Importante:** o fragmento da URL não é criptografado. Ele ainda pode aparecer no histórico do navegador, em favoritos e em links compartilhados, além de ser acessível aos scripts executados na página.

A hospedagem continua recebendo a requisição normal para carregar o arquivo HTML.

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript puro
- GitHub Pages (hospedagem opcional)

## 📌 Limitações

- A página não verifica os horários: apenas exibe as informações recebidas.
- O bloqueio e o redirecionamento dependem de uma ferramenta externa.
- O funcionamento de userscripts pode variar conforme o navegador.
- O projeto auxilia no desenvolvimento de hábitos, mas não representa um bloqueio inviolável.

---

**Foco no que constrói.**

*Disciplina hoje. Liberdade amanhã.*
