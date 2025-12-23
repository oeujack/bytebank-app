# Tech Bank App

Este projeto foi desenvolvido pelos alunos:
 - Diego Minelli - RM362536
 - Jackson dos Santos - RM359898
 - Jefferson Guerra - RM363144
 - Raul Ferreira - RM362993
 - Thomas Aguiar - RM363369

Matriculados na turma 3FRNT da Pós Graduação em Front-end Engeniering da FIAP.

O Tech Bank App é uma aplicação bancária digital desenvolvida em [React](https://react.dev) com Material UI, simulando funcionalidades de uma fintech. O projeto permite visualizar saldo, extrato, realizar depósitos, transferências, pagamentos de boletos e acessar outros serviços de uma conta bancária.
Decidimos também reimaginar em alguns pontos o layout proposto ara o projeto, que pode ser encontrato nesse projeto do [Figma](https://www.figma.com/design/06sUi5crvAO4JuQHdGkdo2/Tech-Challenge?node-id=0-1&p=f&t=GN8a2pifAUeCwBl0-0)

## Funcionalidades
  As principais funcionalidades do projeto são:

- Visualização de saldo em conta corrente e poupança
- Extrato detalhado com agrupamento por data, edição e exclusão de lançamentos
- Depósito em conta corrente ou poupança
- Transferência entre contas
- Pagamento de boletos
- Gráfico com movimentações diárias
- Filtros na aba de extrato
- Listagem de serviços adicionais
- Interface responsiva e moderna

## Tecnologias Utilizadas

### Core
- [React](https://react.dev) - Biblioteca para construção de interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [Vite](https://vitejs.dev/) - Build tool e dev server

### UI & Styling
- [Material UI](https://mui.com) - Componentes de interface
- [Emotion](https://emotion.sh/) - CSS-in-JS

### State Management & Data Fetching
- [Redux Toolkit](https://redux-toolkit.js.org/) - Gerenciamento de estado global
- [React Query](https://tanstack.com/query/) - Cache e sincronização de dados
- [Axios](https://axios-http.com/) - Cliente HTTP

### Forms & Validation
- [Formik](https://formik.org/) - Gerenciamento de formulários
- [Yup](https://github.com/jquense/yup) - Validação de schemas
- [React Number Format](https://github.com/s-yadav/react-number-format) - Formatação de números

### Development Tools
- [ESLint](https://eslint.org/) - Linting de código
- [Storybook](https://storybook.js.org/) - Documentação de componentes
- [json-server](https://github.com/typicode/json-server) - Mock API

## Como rodar o projeto

1. **Clone o repositório e instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de dados (json-server):**
   ```bash
   npm install -g json-server
   json-server --watch json-server/db.json --port 3001
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador. Após abrir a aplicação no seu navegador, aparecerá uma tela inicial informativa sobre o Bytebank, para acessar a parte transacional do projeto, clique em "Já tenho conta".

## Documentação de Componentes com Storybook

Este projeto utiliza o [Storybook](https://storybook.js.org/) para documentar e visualizar os componentes de interface de forma isolada.

### O que foi feito

- **Configuração do Storybook** integrada ao projeto Next.js.
- **Stories criados** para os principais componentes da pasta `src/components`, permitindo visualizar exemplos, estados e variações.

### Como rodar o Storybook

1. Inicie o Storybook:
   ```bash
   npm run storybook
   ```

2. Acesse o Storybook no navegador:
   ```
   http://localhost:6006
   ```

## Estrutura do Projeto

O projeto segue uma arquitetura modular organizada em quatro camadas principais:

```
src/
├── app/                    # Configurações centrais da aplicação
│   └── providers/         # Store Redux e provedores globais
├── core/                   # Configurações e serviços compartilhados
│   ├── config/            # Variáveis de ambiente
│   └── utils/             # Utilitários centrais
├── features/               # Funcionalidades por domínio
│   ├── auth/              # Autenticação e login
│   ├── extrato/           # Gestão de extratos
│   ├── boleto/            # Pagamento de boletos
│   ├── deposito/          # Depósitos bancários
│   ├── transferencia/     # Transferências
│   ├── dashboard/         # Dashboard principal
│   ├── home/              # Página inicial
│   └── common/            # Componentes comuns
├── shared/                 # Recursos compartilhados
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Hooks customizados
│   ├── types/             # Tipagens compartilhadas
│   └── utils/             # Utilitários globais
├── routes/                 # Rotas com lazy loading
└── stories/               # Documentação de componentes
json-server/
└── db.json                # Mock API
```

### Arquitetura por Camadas

- **Features**: Cada funcionalidade isolada com páginas, componentes, hooks, serviços e stores próprios
- **Shared**: Componentes e utilitários reutilizáveis globalmente
- **Core**: Configurações centrais e serviços compartilhados
- **API**: Camada de dados mockada para desenvolvimento

## Otimizações de Performance

### Lazy Loading
- Todas as páginas são carregadas sob demanda usando `React.lazy()`
- Implementação de `Suspense` para loading states
- Redução significativa do bundle inicial

### Cache Inteligente
- React Query para cache de requisições HTTP
- Configuração de `staleTime` (5 minutos) e `gcTime` (30 minutos)
- Minimização de requisições desnecessárias

### Programação Reativa
- Redux Toolkit para gerenciamento de estado global
- React Query para estado assíncrono
- Validações reativas em formulários com Yup
- Formatação em tempo real de valores monetários
- Filtros e buscas responsivas

## Observações

- O projeto utiliza arquitetura modular com lazy loading para otimização de performance
- Cache inteligente implementado com React Query para reduzir requisições
- O `json-server` simula uma API REST. Certifique-se de deixá-lo rodando para que as operações funcionem corretamente
- Os dados não são persistidos em um banco real, apenas no arquivo `db.json`
- Interface responsiva e moderna

## Licença

Projeto desenvolvido para fins educacionais no Tech Challenge FIAP. Pós Graduação em Front-end Engeniering
