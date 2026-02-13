FROM node:20-alpine AS base

# 1. Instalar dependências e construir a aplicação
FROM base AS builder
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
COPY . .
RUN npx prisma generate
RUN npm run build

# 2. Executar a aplicação em produção
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# Adicionar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "start"]
