# 🧠 ZenTask - Task Manager

Sistema completo de gerenciamento de tarefas com autenticação JWT, controle de permissões por papel (RBAC), interface de usuário moderna e documentação Swagger.

> Projeto desenvolvido como parte de um desafio técnico para vaga de desenvolvedor fullstack sênior.

## 🛠️ Stack utilizada

- **Frontend:** React (NextJS) + TypeScript
- **Backend:** NestJS (TypeScript)
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Infraestrutura:** Docker
- **Documentação:** Swagger
- **Testes:** Jest, Playwright

## 📦 Estrutura do Projeto

O repositório está organizado em uma estrutura 'monorepo' com os seguintes diretórios principais:

```
task-manager/
├── frontend/         # Aplicação NextJS
├── backend/          # API NestJS
└── docker-compose.yml # Configuração para rodar o projeto completo
```

## 🚀 Como rodar o projeto completo

### 🐳 Modo Full Docker (Backend + Frontend + DB conteinerizados)

> Ideal para testadores ou ambientes onde é necessário tudo isolado.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/task-manager.git
cd task-manager

# Configure as variáveis de ambiente
cp .env.backend.example .env.backend
cp .env.frontend.example .env.frontend

# Suba todos os serviços
docker-compose -p task_manager_prd -f docker-compose.yml up --build
```

Isso irá:

- Subir o Frontend na porta 3000
- Subir a API na porta 4000
- Subir o PostgreSQL na porta 5432
- Aplicar variáveis de ambiente automaticamente
- Aplicar seed automaticamente

Acesse a aplicação em:

- 🖥️ **Frontend:** http://localhost:3000
- 📄 **Documentação API (Swagger):** http://localhost:4000/docs

## 👤 Usuários de teste (pré-criados via seed)

Ao rodar o projeto, dois usuários são automaticamente criados via seed script:

| Tipo    | Email             | Senha     | Permissões                       |
| ------- | ----------------- | --------- | -------------------------------- |
| Admin   | admin@example.com | P4$sw0rd! | Visualiza todas as tarefas       |
| Usuário | user@example.com  | P4$sw0rd! | CRUD apenas nas próprias tarefas |

> 📌 A senha de ambos os usuários é **P4$sw0rd!**

## 📌 Principais funcionalidades

- ✅ Autenticação segura com JWT + Refresh Token via cookie httpOnly
- ✅ Controle de acesso baseado em papéis (RBAC)
- ✅ Gerenciamento completo de tarefas (CRUD)
- ✅ Interface responsiva e intuitiva com TailwindCSS e shadcnUI
- ✅ Documentação completa da API

## 📄 Mais detalhes

Para instruções específicas sobre como executar apenas o frontend ou backend individualmente, consulte os READMEs em seus respectivos diretórios:

- [README do Frontend](./frontend/README.md)
- [README do Backend](./backend/README.md)
