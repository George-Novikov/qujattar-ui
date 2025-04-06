# Multi-stage build for React TypeScript application
# This approach creates a smaller, more secure production image

# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build the application
# We can pass build-time arguments to configure the build
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script that will replace environment variables at runtime
# This allows configuration via environment variables when the container runs
RUN echo '#!/bin/sh \n\
# Replace env vars in JavaScript files \n\
echo "Replacing environment variables" \n\
for file in /usr/share/nginx/html/assets/*.js; do \n\
  echo "Processing $file..." \n\
  sed -i "s|__VITE_API_URL__|$VITE_API_URL|g" $file \n\
  sed -i "s|__VITE_APP_NAME__|$VITE_APP_NAME|g" $file \n\
  sed -i "s|__VITE_APP_VERSION__|$VITE_APP_VERSION|g" $file \n\
  # Add more replacements here as needed \n\
done \n\
echo "Starting Nginx" \n\
exec nginx -g "daemon off;"' > /docker-entrypoint.sh

# Make our entrypoint script executable
RUN chmod +x /docker-entrypoint.sh

# Set entrypoint to our custom script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1