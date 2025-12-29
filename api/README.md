
# ByteBank API

API REST do sistema de transações bancárias ByteBank Mobile desenvolvida em Node.js com Express, SQLite e autenticação JWT.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Knex.js** - Query builder SQL
- **SQLite** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **Bcrypt** - Hash de senhas
- **Swagger** - Documentação automática da API
- **CORS** - Habilitação de cross-origin

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn

### 1. Instalar Dependências
```bash
cd api
npm install
```

### 2. Configurar Banco de Dados
```bash
# Executar migrações para criar as tabelas
npx knex migrate:latest
```

### 3. Iniciar Servidor
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em: `http://localhost:3333`

## 📋 Scripts Disponíveis

|Script|Descrição|
|---|---|
|`npm run dev`|Inicia a API em ambiente de **desenvolvimento** com auto-reload|
|`npm start`|Inicia a API em ambiente de **produção**|
|`npm run migrate`|Executa migrações para criar tabelas do banco|
|`npm run seed`|Popula o banco de dados com dados de exemplo|

## 🔗 Endpoints da API

### 🔐 Autenticação
- `POST /sessions` - Login do usuário
- `POST /sessions/refresh` - Renovar token de acesso

### 👤 Usuários
- `POST /users` - Criar novo usuário
- `GET /users/profile` - Buscar perfil do usuário autenticado
- `PUT /users` - Atualizar dados do usuário autenticado

### 💰 Transações
- `GET /transactions` - Listar transações do usuário
- `POST /transactions` - Criar nova transação
- `PUT /transactions/:id` - Atualizar transação existente
- `DELETE /transactions/:id` - Excluir transação
- `GET /transactions/balance` - Buscar saldo das contas

## 🗄️ Estrutura do Banco de Dados

### Tabela: users
```sql
users:
- id (INTEGER, PK, AUTO_INCREMENT)
- name (VARCHAR, NOT NULL)
- email (VARCHAR, UNIQUE, NOT NULL)
- password (VARCHAR, NOT NULL, HASHED)
- created_at (TIMESTAMP, DEFAULT NOW)
- updated_at (TIMESTAMP, DEFAULT NOW)
```

### Tabela: transactions
```sql
transactions:
- id (INTEGER, PK, AUTO_INCREMENT)
- user_id (INTEGER, FK -> users.id)
- account_type (VARCHAR, NOT NULL) -- 'conta-corrente' | 'poupanca'
- transaction_type (VARCHAR, NOT NULL) -- 'transferencia' | 'deposito'
- amount (DECIMAL(10,2), NOT NULL)
- description (TEXT, NULLABLE)
- attachment_url (TEXT, NULLABLE) -- URL da imagem no Firebase Storage
- transaction_date (TIMESTAMP, NOT NULL)
- created_at (TIMESTAMP, DEFAULT NOW)
- updated_at (TIMESTAMP, DEFAULT NOW)
```

## 🔒 Autenticação e Segurança

### JWT Tokens
- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 30 dias
- Tokens armazenados de forma segura no frontend

### Middleware de Autenticação
Todas as rotas de usuários e transações são protegidas pelo middleware `ensureAuthenticated`:

```javascript
// Rotas protegidas
GET    /users/profile      [AUTH REQUIRED]
PUT    /users             [AUTH REQUIRED]
GET    /transactions      [AUTH REQUIRED]
POST   /transactions      [AUTH REQUIRED]
PUT    /transactions/:id  [AUTH REQUIRED]
DELETE /transactions/:id  [AUTH REQUIRED]
GET    /transactions/balance [AUTH REQUIRED]
```

### Hash de Senhas
- Senhas são hasheadas usando **bcrypt** com salt rounds 8
- Senhas nunca são retornadas nas respostas da API

### Lógica de Cálculo
- **Depósitos**: Adicionam ao saldo da conta especificada
- **Transferências**: Subtraem do saldo da conta especificada
- Saldos são calculados em tempo real a partir das transações

## 📖 Documentação da API

A documentação completa e interativa da API está disponível em:
**http://localhost:3333/api-docs**

### Recursos da Documentação
- Todos os endpoints documentados
- Schemas de request/response
- Exemplos de uso
- Interface para testar endpoints
- Códigos de status HTTP

## 🛠️ Estrutura de Arquivos

```
api/
├── src/
│   ├── controllers/         # Controladores das rotas
│   │   ├── SessionsController.js
│   │   ├── UserRefreshToken.js
│   │   └── UsersController.js
│   ├── database/           # Configuração do banco
│   │   ├── database.db
│   │   ├── index.js
│   │   └── migrations/
│   ├── docs/              # Documentação Swagger
│   │   └── swagger.json
│   ├── middlewares/       # Middlewares
│   │   └── ensureAuthenticated.js
│   ├── providers/         # Provedores de tokens
│   │   ├── GenerateRefreshToken.js
│   │   └── GenerateToken.js
│   ├── routes/            # Definição de rotas
│   │   ├── index.js
│   │   ├── sessions.routes.js
│   │   └── users.routes.js
│   ├── utils/             # Utilitários
│   │   └── AppError.js
│   └── server.js          # Servidor principal
├── knexfile.js           # Configuração do Knex
├── package.json
└── README.md
```

## ⚡ Performance e Otimizações

- **Conexão com banco**: Pool de conexões SQLite
- **Middleware CORS**: Configurado para desenvolvimento e produção
- **Compressão**: Middleware de compressão HTTP
- **Rate Limiting**: Implementação recomendada para produção
- **Validação**: Validação de dados de entrada nos controladores

## 🧪 Testando a API

### Usando cURL

**Criar usuário:**
```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com","password":"123456"}'
```

**Fazer login:**
```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

**Criar transação:**
```bash
curl -X POST http://localhost:3333/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "account_type":"conta-corrente",
    "transaction_type":"deposito",
    "amount":1000.00,
    "description":"Depósito inicial",
    "attachment_url":"https://firebasestorage.googleapis.com/..."
  }'
```

### Considerações de Segurança
1. **JWT Secrets**: Use secrets fortes e únicos
2. **HTTPS**: Sempre use HTTPS em produção
3. **Rate Limiting**: Implemente rate limiting
4. **Logs**: Configure logs estruturados
5. **CORS**: Configure CORS para domínios específicos
6. **Backup**: Configure backup automático do banco

## 📞 Suporte e Contribuição

Para dúvidas, bugs ou melhorias:
1. Abra uma issue no repositório
2. Descreva o problema detalhadamente
3. Inclua logs e exemplos quando possível

### Contribuindo
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
