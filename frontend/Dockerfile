# Stage 1: Build React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install all development dependencies (needed for compiling build)
RUN npm install

# Copy source codebase
COPY . .

# Build-time environment variable configurations for Vite
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build optimized production bundle
RUN npm run build

# Stage 2: Serve Static Assets with Nginx
FROM nginx:alpine

# Copy compiled static assets from build container
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
