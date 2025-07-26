#!/bin/bash

echo "⏳ Waiting for MySQL (checking TCP and JDBC connectivity)..."

RETRIES=60
DELAY=5
HOST="mysql"
PORT="3306"

# Check TCP connectivity first
until nc -z -v -w 5 $HOST $PORT || [ $RETRIES -eq 0 ]; do
  echo "❌ TCP connection to $HOST:$PORT failed, retrying in ${DELAY}s... ($RETRIES retries left)"
  RETRIES=$((RETRIES-1))
  sleep $DELAY
done

if [ $RETRIES -eq 0 ]; then
  echo "❌ MySQL TCP connection failed after multiple attempts. Aborting."
  exit 1
fi

echo "✅ TCP connection to $HOST:$PORT established. Checking JDBC..."

# Check MySQL JDBC connectivity
RETRIES=60
until mysql -h $HOST -P $PORT -u root -e "SELECT 1;" GestionUser 2>/dev/null || [ $RETRIES -eq 0 ]; do
  echo "❌ JDBC connection to $HOST:$PORT failed, retrying in ${DELAY}s... ($RETRIES retries left)"
  RETRIES=$((RETRIES-1))
  sleep $DELAY
done

if [ $RETRIES -eq 0 ]; then
  echo "❌ MySQL JDBC connection failed after multiple attempts. Aborting."
  exit 1
fi

echo "✅ MySQL is ready. Starting Spring Boot application..."
exec java -jar app.war