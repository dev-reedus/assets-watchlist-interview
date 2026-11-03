# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:22.23.4-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --production

# ── Production stage ────────────────────────────────────────────────────────────
FROM node:22.23.4-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "build/index.js"]
