#!/usr/bin/env bash
set -euo pipefail

HOST="${MYSQL_HOST:-mysql}"
PORT="${MYSQL_PORT:-3306}"
USER="${MYSQL_USER:-root}"
PASS="${MYSQL_PASSWORD:-}"           # vide si autorisé
RETRIES="${MAX_RETRIES:-90}"
SLEEP_SECONDS="${SLEEP_SECONDS:-5}"

echo "⏳ Waiting for MySQL at $HOST:$PORT ..."
for i in $(seq 1 "$RETRIES"); do
  if mysqladmin ping \
      --host="$HOST" \
      --port="$PORT" \
      --user="$USER" \
      ${PASS:+--password="$PASS"} \
      --silent; then
    echo "✅ MySQL is up. Starting app ..."
    exec java -jar /app/app.jar
  fi
  echo "❌ Try $i/$RETRIES: not ready; sleeping ${SLEEP_SECONDS}s..."
  sleep "$SLEEP_SECONDS"
done

echo "❌ MySQL not ready after $RETRIES tries."
exit 1
