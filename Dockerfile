# ===== Etapa 1: Construcción de la app Angular =====
FROM node:22-alpine AS build

WORKDIR /app

# Copiamos package.json e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto y construimos
COPY . .
RUN npm run build

# ===== Etapa 2: Servir la app con Nginx =====
FROM nginx:alpine

# Copiamos la app compilada a la carpeta pública de Nginx
COPY --from=build /app/dist/tabletop-kingdom-angular/browser /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]