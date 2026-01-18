# Use Node.js 18 on Alpine Linux
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port Vite preview runs on (default 4173)
EXPOSE 4173

# Start the preview server with host binding to allow external access
CMD ["npm", "run", "serve", "--", "--host"]
