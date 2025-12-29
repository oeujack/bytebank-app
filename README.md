# 💳 ByteBank Web

> Aplicação **web** para simulação de transações bancárias, construída com **API Node.js** e **frontend em React (Vite)**, focada em simplicidade, organização e boas práticas de desenvolvimento.

---

## ✨ Visão Geral

O **ByteBank Web** é um projeto que simula funcionalidades básicas de um banco digital, permitindo o gerenciamento de transações financeiras através de uma **API REST segura**, consumida por uma **aplicação web moderna**.

Ideal para estudos, testes de arquitetura fullstack e demonstração de boas práticas com **TypeScript**, **JWT** e **SQLite**.

---

## 🚀 Funcionalidades

* 🔐 Autenticação com JWT
* 💸 Listagem e registro de transações
* 🌐 Aplicação web com React
* 🗄️ Banco de dados SQLite com migrations
* 🔄 Comunicação API REST

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)

* Node.js
* Express
* TypeScript
* SQLite
* JWT (JSON Web Token)

### Frontend (Web)

* React
* Vite
* TypeScript

---

## ▶️ Como Rodar o Projeto

### 1️⃣ Backend (API)

```bash
cd api
npm install
npm run migrate
npm run dev
```

📍 API disponível em:

```
http://localhost:3333
```

📦 O banco de dados SQLite é criado automaticamente em:

```
api/src/database/database.db
```

---

### 2️⃣ Frontend (Web)

```bash
cd frontend
npm install
npm run dev
```

> 💡 A aplicação estará disponível no navegador após iniciar o servidor de desenvolvimento.

---

## 📁 Estrutura do Projeto

```
│
├── api        # Backend Node.js
│   ├── src
│   └── database
│
├── frontend   # Frontend Web (React + Vite)
│   ├── src
│   └── assets
│
└── README.md
```

---

## 🧪 Possíveis Evoluções

* 📊 Dashboard de saldo
* 🧾 Filtro e categorização de transações
* 🧑‍💻 Testes automatizados

---

## 📌 Observações

Este projeto tem fins educacionais e de demonstração técnica.

Sinta-se à vontade para clonar, estudar e evoluir 🚀

---

**ByteBank Web** — *aprendendo na prática como funciona um banco digital.* 💙
