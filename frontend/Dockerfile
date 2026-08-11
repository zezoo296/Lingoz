FROM node:20-alpine

WORKDIR /app

# Root workspace files
COPY package.json package-lock.json ./

# Frontend and shared package manifests
COPY frontend/package.json ./frontend/package.json
COPY shared/package.json ./shared/package.json

# Install dependencies
RUN npm install

# Only copy frontend + shared source
COPY frontend ./frontend
COPY shared ./shared

WORKDIR /app/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]