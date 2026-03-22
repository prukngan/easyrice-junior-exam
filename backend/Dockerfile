# --- Backend Dockerfile ---
FROM node:20-alpine

# Install necessary build tools for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema first for better caching
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose backend port (updated to 8000 to match docker-compose change)
EXPOSE 8000

# Start the application: Run migrations/seed then start the app in DEV mode
CMD npx prisma db push && npx prisma db seed && npm run start:dev
