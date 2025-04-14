# 🧠 ZenTask Frontend

Interface de usuário para o sistema de gerenciamento de tarefas, com autenticação, perfis de usuário e gerenciamento completo de tarefas.

> Parte frontend do projeto desenvolvido como desafio técnico para vaga de desenvolvedor fullstack sênior.

## 🛠️ Stack utilizada

- **Framework:** React (NextJS) com TypeScript
- **Gerenciamento de Estado:** Zustand
- **Estilização:** TailwindCSS + shadcnUI
- **Formulários:** React Hook Form + Zod
- **HTTP Client:** Axios + SWR
- **Infraestrutura:** Docker
- **Testes:** Playwright (E2E)

## 🚀 Como rodar o projeto (frontend)

### ✅ Modo Dev (UI local)

> Ideal para desenvolvimento com hot reload.

```bash
# Configure as variáveis de ambiente
cp .env.example .env

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

### 🐳 Modo Docker (UI conteinerizada)

> Ideal para ambiente isolado ou testes.

```bash
# Configure as variáveis de ambiente
cp .env.example .env

# Construa e inicie o container
docker-compose -p task_manager_frontend -f docker-compose.yml up --build
```

Acesse a aplicação em:  
🖥️ http://localhost:3000

## 📄 Exemplo de .env

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=Task Manager
```

## 🎯 Funcionalidades principais

- **Autenticação completa:**

  - Login/Signup
  - Persistência de sessão via cookie httpOnly
  - Refresh token automático
  - Logout

- **Gerenciamento de tarefas:**

  - Listagem de tarefas
  - Criação de novas tarefas
  - Edição de tarefas existentes
  - Exclusão de tarefas

- **Interface administrativa (para usuários admin):**
  - Visualização de todas as tarefas do sistema

## 🧰 Padrões e decisões técnicas

- **Arquitetura NextJS:** Aproveitamento do sistema de roteamento e SSR
- **Componentes shadcnUI:** Interface consistente e acessível
- **Autenticação com JWT:** Cookie httpOnly para refresh token
- **Zustand para gerenciamento de estado:** Solução leve e performática
- **SWR para data fetching:** Cache, revalidação e status de loading
- **Responsividade:** Interface adaptável para dispositivos móveis e desktop

## 🧪 Testes

```bash
# Testes E2E com Playwright
pnpm test:e2e
```

- Testes E2E simulando interações completas do usuário

## 🧠 Destaques técnicos

- ✅ **Autenticação segura** com cookies httpOnly
- ✅ **UI consistente** com shadcnUI e TailwindCSS
- ✅ **Design responsivo** para todas as resoluções
- ✅ **Forms tipados** com React Hook Form e Zod
- ✅ **Gerenciamento de estado** eficiente com Zustand
- ✅ **Data fetching** otimizado com SWR
- ✅ **Dockerfile e docker-compose** configurados
