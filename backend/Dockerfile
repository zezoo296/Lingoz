FROM node:20-slim

WORKDIR /app

# Root workspace files
COPY package.json package-lock.json ./

# Workspace package manifests
COPY backend/package.json ./backend/package.json
COPY shared/package.json ./shared/package.json

# Install dependencies
RUN npm ci

# Copy source
COPY backend ./backend
COPY shared ./shared

WORKDIR /app/backend

# Generate Prisma client
RUN npx prisma generate

# Build backend
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]