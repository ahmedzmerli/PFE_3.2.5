# ---------- Build stage ----------
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

# Meilleur cache deps
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY . .
RUN mvn -q -DskipTests clean package
# Debug si besoin :
# RUN ls -lah target

# ---------- Run stage ----------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Outils utiles pour healthchecks/wait
RUN apt-get update \
    && apt-get install -y mysql-client netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

#  Correspond EXACTEMENT au finalName du POM
COPY --from=build /app/target/CTI-Tool.jar app.jar
COPY wait-for-jdbc.sh .
RUN chmod +x wait-for-jdbc.sh

EXPOSE 8080
ENTRYPOINT ["sh","-c","./wait-for-jdbc.sh && java -jar app.jar"]
