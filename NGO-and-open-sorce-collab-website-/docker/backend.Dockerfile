FROM node:20-alpine AS base
WORKDIR /app

# --- Dependencies ---
FROM base AS deps
COPY backend/package*.json ./
COPY package*.json ../
RUN npm ci --omit=dev

# --- Build ---
FROM base AS builder
COPY backend/package*.json ./
COPY package*.json ../
RUN npm ci
COPY backend ./
COPY database ../database
RUN npx prisma generate --schema=../database/prisma/schema.prisma
RUN npm run build

# --- Production ---
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /app/node_modules ./node_modules
COPY database ../database

USER nextjs
EXPOSE 4000
ENV PORT=4000 HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma migrate deploy --schema=../database/prisma/schema.prisma && node server.js"]
