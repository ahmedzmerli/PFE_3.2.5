# Étape 1 : Build Angular
# FROM node:18 as build
# WORKDIR /app
# COPY . .
# RUN npm install --legacy-peer-deps
# RUN npm run build --prod

# # Étape 2 : NGINX avec configuration custom
# FROM nginx:alpine
# COPY --from=build /app/dist/GestionUserDIM2/ /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80


# Étape 1 : Build Angular
FROM node:18 as build

WORKDIR /app

# Copier package.json et package-lock.json avant de faire npm install
COPY package*.json ./

# Installer les dépendances en utilisant --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application en mode production
RUN npm run build --prod

# Vérification de la structure du répertoire de build
RUN ls -la /app/dist/gestion-user-dim2

# Étape 2 : NGINX avec configuration personnalisée
FROM nginx:alpine

# Copier les fichiers construits par Angular dans le répertoire de NGINX
COPY --from=build /app/dist/gestion-user-dim2/ /usr/share/nginx/html

# Copier la configuration NGINX personnalisée (si elle existe)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Lancer NGINX en mode premier plan
CMD ["nginx", "-g", "daemon off;"]
