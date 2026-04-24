# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
# Add build tools for native dependencies (important for many npm packages)
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Use --legacy-peer-deps to prevent crashes due to version conflicts
# PRISMA_SKIP_POSTINSTALL_GENERATE saves time by avoiding double generation
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
RUN npm install --legacy-peer-deps

# --- Stage 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build arguments from Portainer/Compose
ARG DATABASE_URL
ARG DIRECT_URL

# Set environment variables for the build phase
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client and build the Next.js app
RUN npx prisma generate
RUN npm run build

# --- Stage 3: Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files for production
COPY --from=builder /app/next.config* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Change ownership to the non-root user
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

# Start the application
CMD ["npm", "start"]