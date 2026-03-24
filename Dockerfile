# =============================================================================
# SureVote Frontend — Multi-Stage Docker Build
# Stage 1: Build the Angular app with Node.js
# Stage 2: Serve with Nginx (non-root, production-hardened)
# =============================================================================

# --------------- Stage 1: Build ---------------
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json ./

# Install production + dev dependencies (needed for build)
RUN npm ci --ignore-scripts

# Copy source code and build
COPY . .
RUN npx ng build --configuration=production

# --------------- Stage 2: Serve ---------------
FROM nginx:1.27-alpine AS production

# OCI Image Labels
LABEL org.opencontainers.image.title="SureVote Frontend" \
      org.opencontainers.image.description="SureVote Angular frontend served via Nginx" \
      org.opencontainers.image.vendor="SureVote" \
      org.opencontainers.image.source="https://github.com/surevote/surevote-frontend"

# Remove default Nginx config and static files
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from build stage
COPY --from=build /app/dist/surevote-frontend/browser /usr/share/nginx/html

# Ensure the nginx user can write to required directories
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Health check — verify Nginx is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
