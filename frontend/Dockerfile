# --- Frontend Dockerfile ---
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose Vite dev server port
EXPOSE 5173

# Start Vite in development mode (with host flag for Docker access)
CMD ["npm", "run", "dev", "--", "--host"]
