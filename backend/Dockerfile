# Multi-stage Dockerfile — Barbería Denver Backend (Fastify + Prisma)
# Fix: binaryTargets explícitos para Alpine Linux (node:20-alpine)
# Requerido por Render y cualquier plataforma Alpine-based

FROM node:20-alpine AS builder
WORKDIR /app

# Dependencias del sistema necesarias para native bindings
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./

RUN npm ci

COPY src ./src

# Generar Prisma Client con binaryTargets para Alpine
RUN npx prisma generate --config prisma.config.ts

RUN npm run build

# ── Production Stage ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# openssl requerido en runtime por Prisma en Alpine
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
RUN npm ci --only=production

# Copiar artefactos del builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Copiar Prisma Client completo (incluye query engine nativo para linux-musl)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3001

CMD ["node", "dist/app.js"]
