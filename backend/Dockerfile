FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install

# Copy source
COPY . .

# Build TypeScript
RUN bun run build

# Production image
FROM oven/bun:1-slim AS production
WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

RUN mkdir -p uploads

EXPOSE 5000
CMD ["bun", "dist/index.js"]
