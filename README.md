# 🧠 Task Manager 

Sistema de gerenciamento de tarefas com autenticação JWT, controle de permissões por papel (RBAC), e documentação Swagger.

> Projeto desenvolvido como parte de um desafio técnico para vaga de desenvolvedor fullstack sênior.

### 🐳 Modo Full Docker (Backend + Frontend + DB conteinerizados)

> Ideal para testadores ou ambientes onde é necessário tudo isolado.

```bash
cp .env.backend.example backend/.env
docker-compose -p task_manager_prd -f docker-compose.yml up --build
```

Isso irá:

- Subir a API na porta 4000
- Subir o PostgreSQL na porta 5432
- Aplicar variáveis de ambiente automaticamente
- Aplicar seed automaticamente