FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./

COPY backend/package.json ./backend/package.json
COPY shared/package.json ./shared/package.json

RUN npm ci

COPY backend ./backend
COPY shared ./shared

# Generate Prisma Client
WORKDIR /app/backend
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

# Build shared package first
WORKDIR /app
RUN npm run build --workspace=shared

# Then build backend
RUN npm run build --workspace=backend

WORKDIR /app/backend

EXPOSE 3000

CMD ["npm", "start"]