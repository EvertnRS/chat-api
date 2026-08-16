# 🚀 Chat API

Uma API backend robusta para gerenciamento de chats, mensagens e usuários, com suporte a comunicação em tempo real via WebSocket e armazenamento de arquivos em nuvem. O frontend da aplicação está disponível no repositório ['FrontChat-api'](https://github.com/Thulio05/FrontChat-api).

## 📋 Sobre o projeto

O **Chat API** é um backend desenvolvido para fornecer a infraestrutura necessária para aplicações de comunicação e chat. O projeto reúne funcionalidades como autenticação, gerenciamento de usuários e chats, envio de mensagens em tempo real e armazenamento de imagens utilizando o Amazon S3.

### Explicação simples

* **O que o projeto faz:** Disponibiliza uma API RESTful e comunicação em tempo real via WebSocket para gerenciamento de usuários, chats e mensagens.
* **Para quem foi desenvolvido:** Desenvolvedores que precisam integrar funcionalidades de chat em aplicações web ou mobile.
* **Qual problema resolve:** Simplifica a implementação de sistemas de comunicação, oferecendo uma estrutura pronta para autenticação, mensagens, persistência e armazenamento de arquivos.
* **Principais diferenciais:** Suporte a WebSocket com Socket.io, armazenamento via Amazon S3, PostgreSQL e MongoDB através do Prisma ORM, além de Docker e CI/CD.

## 🎯 Objetivos

1. Fornecer uma API completa para aplicações de chat em tempo real.
2. Permitir flexibilidade na escolha do banco de dados, suportando PostgreSQL e MongoDB.
3. Disponibilizar armazenamento de imagens através do Amazon S3.
4. Manter uma arquitetura organizada, testável e de fácil manutenção.

## ✨ Funcionalidades

* ✅ Autenticação de usuários com JWT
* ✅ Cadastro, atualização e exclusão de usuários
* ✅ Criação e gerenciamento de chats
* ✅ Envio e recebimento de mensagens em tempo real
* ✅ Histórico de mensagens
* ✅ Upload de imagens para o Amazon S3
* ✅ API REST com Express
* ✅ Comunicação em tempo real com Socket.io
* ✅ Persistência com Prisma ORM
* ✅ Suporte a PostgreSQL e MongoDB

## 🛠️ Tecnologias utilizadas

### Back-end

* Node.js
* TypeScript
* Express
* Socket.io
* Prisma ORM
* AWS SDK

### Bancos de dados

* PostgreSQL
* MongoDB

### Infraestrutura e ferramentas

* Docker
* Docker Compose
* GitHub Actions
* SonarQube
* Git
* GitHub

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* Git
* Node.js 20 ou superior
* npm ou Yarn
* Docker (opcional)
* Uma conta AWS com acesso ao S3

Verifique as versões:

```bash
git --version
node --version
npm --version
docker --version
```

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/usuario/chat-api.git
```

### 2. Entre na pasta

```bash
cd chat-api
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure o arquivo `.env`:

```env
# Bancos de dados
POSTGRES_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chat_api
MONGO_DATABASE_URL=mongodb://localhost:27017/chat_api

# AWS S3
S3_BUCKET_NAME=chat-api-demo
AWS_ACCESS_KEY_ID=demo_access_key
AWS_SECRET_ACCESS_KEY=demo_secret_key

# Autenticação
JWT_SECRET=super_secret_jwt_key_for_development_only

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=demo@example.com
SMTP_PASS=demo_password
```

### 5. Execute a aplicação

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

O servidor WebSocket utiliza a mesma porta.

## 📖 Como usar

### API REST

A API pode ser consumida através de ferramentas como:

* Postman
* Insomnia
* Thunder Client
* Aplicações web ou mobile

Entre as operações disponíveis estão:

* autenticação;
* gerenciamento de usuários;
* criação e gerenciamento de chats;
* envio e consulta de mensagens;
* upload de imagens.

### WebSocket

O servidor utiliza **Socket.io** para comunicação em tempo real.

Os clientes devem se conectar a:

```text
http://localhost:3000
```

Principais eventos:

| Evento            | Descrição                             |
| ----------------- | ------------------------------------- |
| `connection`      | Estabelece uma conexão com o servidor |
| `join_chat`       | Adiciona o usuário a uma sala         |
| `send_message`    | Envia uma mensagem                    |
| `receive_message` | Recebe uma nova mensagem              |
| `disconnect`      | Encerra a conexão                     |

### Swagger:

acesse:

http://localhost:3000/api-docs

Na interface do Swagger, é possível:

- Visualizar todas as rotas disponíveis;
- Consultar os parâmetros e corpos das requisições;
- Visualizar os formatos das respostas;
- Autenticar utilizando um JWT através do botão Authorize;
- Executar as requisições diretamente pela interface.
- Autenticação

As rotas protegidas utilizam autenticação Bearer JWT.

Após realizar o login pela rota:

copie o token retornado e clique em Authorize no Swagger.

## 📁 Estrutura do projeto

```text
chat-api/
├── .github/             # CI/CD
├── prisma/              # Banco de dados e migrações
├── src/
│   ├── @types/          # Tipos TypeScript
│   ├── infra/           # Infraestrutura
│   ├── controllers/     # Controllers
│   ├── services/        # Regras de negócio
│   ├── routes/          # Rotas HTTP
│   └── middlewares/     # Middlewares
├── tests/               # Testes automatizados
├── .env.example         # Variáveis de ambiente
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.ts            # Entrada da aplicação
└── sonar-project.properties
```

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

Consulte o arquivo `LICENSE` para obter o texto completo da licença.

## 🤝 Contribuindo

Contribuições são bem-vindas!

Antes de contribuir:

* siga as diretrizes descritas em `CONTRIBUTING.md`;
* utilize **Conventional Commits**;
* mantenha o padrão de código existente;
* adicione testes quando necessário.

### Convenção de commits

Este projeto utiliza Conventional Commits.

### Licença das contribuições

Ao contribuir com este projeto, você concorda que suas contribuições serão disponibilizadas sob os termos da licença vigente do repositório.

## ⭐ Apoie o projeto

Se este projeto foi útil para você:

* ⭐ Dê uma estrela no repositório.
* 🐛 Reporte problemas.
* 💡 Sugira melhorias.
* 🤝 Contribua com código.
* 📢 Compartilhe o projeto.

Obrigado pelo apoio! ❤️

## 📞 Suporte

Encontrou algum problema?

Abra uma **Issue** informando:

* descrição do problema;
* passos para reprodução;
* comportamento esperado;
* comportamento atual;
* logs ou mensagens de erro;
* sistema operacional;
* versão do Node.js;
* versão do projeto.

## 📚 Documentação

* **README:** documentação e instalação do projeto.
* **`CONTRIBUTING.md`:** guia para contribuição.
* **`LICENSE`:** licença do projeto.

