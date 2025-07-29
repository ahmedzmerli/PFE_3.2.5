#!/bin/bash
set -e

HOST="mysql"
PORT="3306"
USER="root"
MAX_RETRIES=60
SLEEP=20

echo "🕐 Waiting for MySQL to be ready on $HOST:$PORT..."

for i in $(seq 1 $MAX_RETRIES); do
  if mysqladmin ping -h"$HOST" -u"$USER" --silent; then
    echo "✅ MySQL is ready!"
    exec java -jar app.jar
    exit 0
  fi
  echo "❌ Attempt $i/$MAX_RETRIES failed. Retrying in $SLEEP seconds..."
  sleep $SLEEP
done

echo "❌ MySQL not ready after $MAX_RETRIES attempts. Exiting."
exit 1
