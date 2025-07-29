# --- Base Stage ---
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- Builder Stage ---
FROM base AS builder
COPY . .
RUN npm run build

# --- Development Stage ---
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

# --- Production Stage ---
FROM node:22-alpine AS prod
WORKDIR /app

# Copy production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy Next.js config files (if any)
COPY --from=builder /app/next.config.ts* ./ 
COPY --from=builder /app/next-env.d.ts ./

EXPOSE 3000
CMD ["npm", "run", "start"]