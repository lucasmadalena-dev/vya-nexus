# Relatório de Auditoria e Status de Deploy: VyaNexus
**Data:** 13 de Fevereiro de 2026  
**Status Atual:** Build em falha (Erros de Tipagem/SDK)  
**Ambiente:** VPS Hostinger (187.77.42.15) - Dockerizado

---

## 1. Visão Geral da Arquitetura
O VyaNexus foi preparado para um deploy moderno e isolado utilizando **Docker Compose**. A estrutura consiste em:
- **vyanexus_app:** Aplicação Next.js 14 (Node 20 Alpine).
- **vyanexus_db:** Banco de dados MySQL 8.
- **vyanexus_proxy:** Nginx para gerenciamento de portas 80/443 e SSL.
- **Volume NVMe:** Mapeamento de `/var/www/vyanexus/tenants` para persistência de dados dos clientes.

---

## 2. Linha do Tempo de Correções (O que já resolvemos)

### A. Docker e Dependências Nativas
- **Problema:** O Alpine Linux não possuía bibliotecas para o Prisma e segurança.
- **Solução:** Adicionamos `openssl` e `libc6-compat` no `Dockerfile`.
- **Status:** **RESOLVIDO**.

### B. Ciclo de Build do Prisma
- **Problema:** O `npm install` falhava porque tentava gerar o Prisma Client antes do arquivo `schema.prisma` existir no container.
- **Solução:** Alteramos o `Dockerfile` para usar `--ignore-scripts` no install e rodar o `npx prisma generate` manualmente após o `COPY . .`.
- **Status:** **RESOLVIDO**.

### C. Padronização do Prisma Client
- **Problema:** Conflito entre exportações default e nomeadas (`import { prisma }` vs `import prisma`).
- **Solução:** Padronizamos o `src/lib/prisma.ts` como **export default** e refatoramos todas as importações no projeto.
- **Status:** **RESOLVIDO**.

---

## 3. O Gargalo Atual (Onde estamos sendo barrados)

O build do Next.js na VPS está falhando na etapa de **Linting e Type Checking**. O erro mais recente no log é:

> **Erro:** `Property 'createPayment' does not exist on type ...` em `src/app/api/checkout/route.ts`.

### Causa Raiz:
1. **SDK Interno Incompleto:** O arquivo `src/lib/asaas.ts` (nosso SDK customizado para o Asaas) não possuía a definição do método `createPayment`, embora a rota de checkout estivesse tentando usá-lo.
2. **Inconsistência de Tipagem:** O Asaas exige `cpfCnpj` na criação de clientes, e o código estava omitindo ou usando nomes de campos incorretos (snake_case vs camelCase).

---

## 4. Plano de Ação para a Reunião de Amanhã

Para que o sistema suba, seu amigo deve focar nestes 3 pontos:

1. **Sincronização do SDK:** Garantir que o `src/lib/asaas.ts` tenha o método `createPayment` devidamente tipado (já enviamos a correção para o Git no último commit).
2. **Validação de Tipos no Checkout:** O arquivo `src/app/api/checkout/route.ts` deve usar `user.asaasCustomerId` (camelCase) e incluir o `cpfCnpj` na criação do cliente para satisfazer o TypeScript.
3. **Limpeza de Cache do Docker:** Na VPS, é vital rodar `docker-compose build --no-cache` para garantir que nenhuma camada antiga e quebrada seja reutilizada.

---

## 5. Comandos para o "Go-Live"

Após as correções de código, os comandos finais na VPS são:

```bash
# 1. Reset total do código para a versão do Arquiteto
git reset --hard origin/main
git pull origin main

# 2. Build forçado sem cache
docker-compose down --remove-orphans
docker-compose up -d --build --force-recreate

# 3. Sincronização de Banco (Essencial)
docker exec vyanexus_app npx prisma migrate deploy
docker exec vyanexus_app npx prisma generate
```

---

## 6. Conclusão do Arquiteto
O projeto está **95% pronto**. O que nos separa do sucesso são detalhes de tipagem no TypeScript que o Next.js exige para builds de produção. Uma vez que o comando `npm run build` passe dentro do container, o sistema estará online e funcional.

**URL de Acesso:** http://187.77.42.15
