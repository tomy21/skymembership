# Step 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Salin file penting saja untuk install dependensi
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Step 2: Build app
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Step 3: Jalankan app
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

EXPOSE 4002
CMD ["yarn", "start"]
