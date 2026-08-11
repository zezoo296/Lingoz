FROM node:20-alpine

WORKDIR /app

# Root workspace files
COPY package.json package-lock.json ./

# Backend and shared package manifests
COPY backend/package.json ./backend/package.json
COPY shared/package.json ./shared/package.json

# Install dependencies
RUN npm install

# Only copy backend + shared source
COPY backend ./backend
COPY shared ./shared

WORKDIR /app/backend

EXPOSE 3000

CMD ["npm", "run", "dev"]