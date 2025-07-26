#!/bin/bash

echo "⏳ Attente de MySQL (connexion JDBC avec mysql-client)..."

RETRIES=30
until mysql -h mysql -P 3306 -u root -e "SELECT 1;" GestionUser || [ $RETRIES -eq 0 ]; do
  echo "❌ Connexion échouée, nouvelle tentative dans 3s..."
  RETRIES=$((RETRIES-1))
  sleep 3
done

if [ $RETRIES -eq 0 ]; then
  echo "❌ MySQL ne répond pas après plusieurs tentatives. Abandon."
  exit 1
fi

echo "✅ MySQL est prêt. Lancement de l'application Spring Boot..."
exec java -jar app.war
