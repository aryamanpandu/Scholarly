# Build stage
FROM node:18 as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]