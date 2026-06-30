# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM oven/bun:1 AS build
WORKDIR /app

# Install deps (cached layer)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# API base URL is baked into the static bundle at build time.
# Override: docker build --build-arg API_BASE_URL=https://api.gereja.org
ARG API_BASE_URL=http://localhost:8080
ENV NUXT_PUBLIC_API_BASE_URL=$API_BASE_URL

# Build static SPA (ssr: false -> nuxt generate emits .output/public)
COPY . .
RUN bun run generate

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
