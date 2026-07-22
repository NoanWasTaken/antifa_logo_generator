FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM nginx:alpine
COPY index.html cgu.html style.css favicon.ico /usr/share/nginx/html/
COPY --from=builder /app/dist /usr/share/nginx/html/dist
