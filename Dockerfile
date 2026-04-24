# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install with legacy-peer-deps to avoid version conflicts
RUN npm install --legacy-peer-deps

# --- Stage 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Arguments
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma first, then Build
RUN npx prisma generate
RUN npm run build

# --- Stage 3: Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions for the cache folder
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy essential standalone files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# IMPORTANT: Ensure next-intl and prisma files are available to the runner
# Standalone mode puts the main entry point at server.js
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]