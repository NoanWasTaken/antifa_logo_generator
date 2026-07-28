FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server.js package.json ./
COPY index.html cgu.html style.css favicon.ico sitemap.xml ./
CMD ["bun", "run", "server.js"]