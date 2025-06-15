# Etapa de desarrollo
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias necesarias para node-gyp
RUN apk add --no-cache python3 make g++

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias específicas primero
RUN npm install ajv@8.12.0 ajv-keywords@5.1.0 --legacy-peer-deps && \
    npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "start"] 