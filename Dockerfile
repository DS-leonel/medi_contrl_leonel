FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (aprovecha cache de Docker)
COPY package*.json ./
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar TypeScript → dist/
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]