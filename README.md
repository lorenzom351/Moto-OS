# Moto OS

Sistema de gestão de oficina com ordens de serviço, histórico de motocicletas e agenda de revisões. A aplicação usa Next.js, Vercel e Supabase.

## Configuração local

Requisitos: Node.js 22 e um projeto no Supabase.

1. No Supabase, abra **SQL Editor**, cole e execute `supabase/migrations/20261007000000_initial_schema.sql`.
2. Copie `.env.example` para `.env.local`.
3. Preencha todas as variáveis; não use os textos de exemplo.
4. Instale e execute:

```bash
npm install
npm run dev
```

Variáveis obrigatórias:

| Variável | Uso |
| --- | --- |
| `ADMIN_USER` | Usuário do login administrativo |
| `ADMIN_PASSWORD` | Senha forte do login administrativo |
| `SESSION_SECRET` | Chave aleatória de pelo menos 32 caracteres para assinar a sessão |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave secreta `service_role` usada apenas no servidor |

Para gerar uma chave de sessão, use um gerenciador de senhas ou `openssl rand -base64 48`. Nunca use o prefixo `NEXT_PUBLIC_` na chave `service_role`.

## Banco de dados

A migração cria as tabelas:

- `service_orders`
- `appointments`
- `appointment_date_blocks`

O RLS fica habilitado sem políticas para clientes públicos. Todo acesso é feito pelas rotas e Server Components com a `service_role`. O banco começa vazio; nenhum dado de demonstração é inserido.

## Deploy na Vercel

1. Importe este repositório na Vercel como projeto Next.js.
2. Em **Settings → Environment Variables**, cadastre as cinco variáveis acima para Production, Preview e Development conforme necessário.
3. Mantenha os comandos padrão: `npm install` e `npm run build`.
4. Faça o deploy.

Antes de liberar o sistema, confira se a migração foi aplicada no mesmo projeto indicado por `SUPABASE_URL`. O build não precisa se conectar ao banco; a conexão ocorre em tempo de execução.

## Verificação

```bash
npm run lint
npm run build
```
