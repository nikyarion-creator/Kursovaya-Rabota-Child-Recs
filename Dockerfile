# Stage 1: Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY src/frontend/package*.json ./
RUN npm install
COPY src/frontend/ .
RUN npm run build

# Stage 2: Final image
FROM python:3.12-slim

RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

# Backend
WORKDIR /app/backend
COPY src/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/backend/ .

# Frontend static files
COPY --from=frontend /app/dist /var/www/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

# Supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Dirs
RUN mkdir -p /app/data /app/uploads/certificates

ENV DATABASE_URL=sqlite:////app/data/kurcach.db

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
