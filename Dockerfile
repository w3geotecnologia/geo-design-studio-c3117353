# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps with bun (faster) or npm fallback
COPY package.json package-lock.json* bun.lockb* ./
RUN if [ -f bun.lockb ]; then \
      npm install -g bun && bun install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy source and build
COPY . .

# Allow overriding Supabase config at build time (Vite inlines VITE_* vars)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine

# SPA-friendly nginx config (deep links + gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
