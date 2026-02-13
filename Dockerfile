FROM node:20-alpine AS base

# 1. Instalar dependências e construir a aplicação
FROM base AS builder
# Adicionar dependências nativas para o Prisma e Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copiar apenas arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Instalar dependências ignorando scripts (como o prisma generate no postinstall)
# Isso evita o erro de "schema.prisma not found" durante a instalação
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile --ignore-scripts; \
  elif [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Agora copiar o restante do código (incluindo o diretório prisma/)
COPY . .

# Gerar o Prisma Client manualmente após o código estar presente
RUN npx prisma generate

# Construir a aplicação Next.js
RUN npm run build

# 2. Executar a aplicação em produção
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Adicionar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
