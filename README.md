# Vexa ERP - MVP

Este é o repositório do projeto **Vexa ERP**, um Progressive Web App (PWA) para gestão de pequenos negócios, com foco inicial em lojas de roupas.

## 🚀 Stack de Tecnologia

* **Framework Full-Stack:** Next.js (App Router)
* **Linguagem:** TypeScript
* **Plataforma Backend (BaaS):** Supabase (PostgreSQL, Auth, Storage)
* **Estilização:** Tailwind CSS
* **Biblioteca de Componentes:** Shadcn/ui
* **Gerenciador de Pacotes:** pnpm

## 🛠️ Rodando o Projeto Localmente

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento.

### 1. Pré-requisitos
- Node.js (versão 18 ou superior)
- pnpm (instalado globalmente: `npm install -g pnpm`)

### 2. Instalação
Clone o repositório e instale as dependências:
```bash
git clone [https://github.com/lucasbarrox/vexa-erp-app.git](https://github.com/lucasbarrox/vexa-erp-app.git)
cd vexa-erp-app
pnpm install
```

### 3. Variáveis de Ambiente

Este projeto se conecta a uma instância da **Supabase** para o banco de dados e autenticação.

Crie uma cópia do arquivo de exemplo `.env.example`:

```bash
cp .env.example .env.local
```

Abra o arquivo `.env.local` e preencha as variáveis com as chaves do seu projeto na Supabase (Project Settings > API). 

### 4. Rodando o Servidor de Desenvolvimento

Instale as dependências (se ainda não fez):

```bash
pnpm install
```

Inicie o servidor local:

```bash
pnpm run dev
```

Abra http://localhost:3000 no seu navegador para ver a aplicação.

