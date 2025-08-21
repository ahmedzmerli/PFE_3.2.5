# ---------- Build stage ----------
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

# Precharger les dependances pour optimiser le cache
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copier le code et builder
COPY . .
RUN mvn -q -DskipTests clean package
# Si besoin de debug : RUN ls -lah target

# ---------- Run stage ----------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Installer outils utiles + conversion CRLF->LF pour scripts
RUN apt-get update \
    && apt-get install -y mysql-client dos2unix netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copier le jar construit (nom EXACT du finalName defini dans le pom.xml)
COPY --from=build /app/target/CTI-Tool.jar /app/app.jar

# Copier le script wait-for-jdbc
COPY wait-for-jdbc.sh /app/wait-for-jdbc.sh
RUN dos2unix /app/wait-for-jdbc.sh && chmod +x /app/wait-for-jdbc.sh

# Ton app ecoute sur 8081 (defini dans application.properties)
EXPOSE 8081

# Lancement unique : le script attend MySQL et demarre l'app
ENTRYPOINT ["/app/wait-for-jdbc.sh"]
