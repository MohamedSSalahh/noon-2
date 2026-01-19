# --- Stage 1: The Build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: The Production Server ---
# We switch to Nginx, which is tiny (~20MB) and much faster for static files
FROM nginx:alpine
# Copy the 'dist' folder from the build stage into Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx defaults to port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]