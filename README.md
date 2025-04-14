# 🧠 Task Manager API

Sistema de gerenciamento de tarefas com autenticação JWT, controle de permissões por papel (RBAC), e documentação Swagger.

> Projeto desenvolvido como parte de um desafio técnico para vaga de desenvolvedor fullstack sênior.

## 🛠️ Stack utilizada

- **Backend:** NestJS (TypeScript)
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Infraestrutura:** Docker
- **Documentação:** Swagger
- **Testes:** Jest

## 🚀 Como rodar o projeto

### ✅ Modo Dev (API local + Postgres via Docker)

> Ideal para desenvolvimento com hot reload.

```bash
cp .env.example .env
docker-compose -p task_manager -f docker-compose.local.yml up -d
npm install
npm run start:dev
```

Acesse a documentação Swagger em:  
📄 http://localhost:3000/docs

### 🐳 Modo Full Docker (App + DB conteinerizados)

> Ideal para testadores ou ambientes onde você quer isolar tudo.

```bash
cp .env.example .env
docker-compose -p task_manager -f docker-compose.full.yml up --build
```

Isso irá:

- Subir o PostgreSQL na porta 5432
- Subir a API na porta 3000
- Aplicar variáveis de ambiente automaticamente

## 📄 Exemplo de `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tasks
JWT_SECRET=supersecret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

## 🔐 Autenticação e RBAC

- Signup/Login com JWT + Refresh Token
- Tokens protegidos com bcrypt
- Guardas globais (`JwtAuthGuard`) e role-based (`@Roles`, `RolesGuard`)
- Revogação de refresh tokens via `/auth/logout`
- Expiração automática dos tokens via `.env`

## 📌 Endpoints principais

| Método | Rota            | Descrição                            |
| ------ | --------------- | ------------------------------------ |
| POST   | `/auth/signup`  | Criação de usuário                   |
| POST   | `/auth/login`   | Login com e-mail e senha             |
| POST   | `/auth/refresh` | Gera novo access/refresh token       |
| GET    | `/auth/me`      | Retorna usuário autenticado          |
| DELETE | `/auth/logout`  | Revoga o refresh token atual         |
| GET    | `/tasks`        | Lista todas as tarefas (ADMIN)       |
| POST   | `/tasks`        | Cria nova tarefa                     |
| GET    | `/tasks/mine`   | Lista tarefas do usuário autenticado |
| GET    | `/tasks/:id`    | Lista a tarefa por ID (owner/admin)  |
| PATCH  | `/tasks/:id`    | Atualiza uma tarefa (owner/admin)    |
| DELETE | `/tasks/:id`    | Deleta uma tarefa (owner/admin)      |

> Todos os endpoints são documentados via Swagger:  
> http://localhost:3000/docs

## 🧪 Testes

```bash
npm run test
```

- Testes unitários para auth, tasks, guards e decorators
- Organização em `describe()` por método
- Cobertura das regras de domínio: ownership, RBAC, expirations, erros

## 🧠 Destaques técnicos

- ✅ **TDD completo** no fluxo de autenticação
- ✅ **JWT + Refresh Token com controle de expiração**
- ✅ **Revogação segura de tokens via endpoint `/logout`**
- ✅ **Limpeza automática de refresh tokens expirados (cron job)**
- ✅ **Uso de `UserEntity` com `class-transformer` para ocultar senha**
- ✅ **Guarda de roles (`RolesGuard`) + decorador `@CurrentUser()`**
- ✅ **Dockerfile e docker-compose configurados**
- ✅ **Swagger documentado com exemplos, descrições e tipos**
