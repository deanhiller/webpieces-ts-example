#!/bin/bash

# Get the repository name from the directory
REPO_NAME=$(basename "$(pwd)")

# Extract number from repo name (e.g., webpieces-ts-example85 -> 85)
# If no number, default to 0
REPO_NUM=$(echo "$REPO_NAME" | grep -o '[0-9]*$')
if [ -z "$REPO_NUM" ]; then
  REPO_NUM=0
fi

# Determine service to start
SERVICE=$1
if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/local-start.sh [client|server]"
  exit 1
fi

case $SERVICE in
  client)
    PORT=$((4200 + REPO_NUM))
    echo "Starting client on port $PORT (repo: $REPO_NAME, number: $REPO_NUM)"
    npx nx serve client --port=$PORT
    ;;
  server)
    PORT=$((8200 + REPO_NUM))
    echo "Starting server on port $PORT (repo: $REPO_NAME, number: $REPO_NUM)"
    PORT=$PORT npx nx serve server
    ;;
  *)
    echo "Unknown service: $SERVICE"
    echo "Usage: ./scripts/local-start.sh [client|server]"
    exit 1
    ;;
esac
