#!/bin/bash

# Get the repository name from the directory
REPO_NAME=$(basename "$(pwd)")

# Extract number from repo name (e.g., webpieces-ts-example85 -> 85)
# If no number, default to 0
REPO_NUM=$(echo "$REPO_NAME" | grep -o '[0-9]*$')
if [ -z "$REPO_NUM" ]; then
  REPO_NUM=0
fi

CLIENT_PORT=$((4200 + REPO_NUM))
SERVER_PORT=$((8200 + REPO_NUM))
TIMEOUT=20

# Function to wait for a port to be available
wait_for_port() {
  local SERVICE=$1
  local PORT=$2
  local LOG_FILE=$3
  local ELAPSED=0

  while [ $ELAPSED -lt $TIMEOUT ]; do
    if lsof -ti :$PORT > /dev/null 2>&1; then
      echo "$SERVICE running on port $PORT"
      return 0
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
  done

  echo "FAILED: $SERVICE did not start within ${TIMEOUT}s (log: $LOG_FILE)"
  return 1
}

# Function to start a service in background
start_service() {
  local SERVICE=$1
  local PORT=$2
  local CMD=$3

  # Check if already running
  if lsof -ti :$PORT > /dev/null 2>&1; then
    echo "$SERVICE already running on port $PORT"
    return 0
  fi

  # Start in background, redirect output to log file
  LOG_FILE="/tmp/${REPO_NAME}-${SERVICE}.log"
  nohup bash -c "$CMD" > "$LOG_FILE" 2>&1 &

  # Wait for it to actually start
  wait_for_port "$SERVICE" "$PORT" "$LOG_FILE"
}

# Determine service to start
SERVICE=$1
if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/local-start.sh [client|server|both]"
  exit 1
fi

case $SERVICE in
  client)
    start_service "Client" $CLIENT_PORT "npx nx serve client --port=$CLIENT_PORT"
    ;;
  server)
    start_service "Server" $SERVER_PORT "PORT=$SERVER_PORT npx nx serve server"
    ;;
  both)
    start_service "Server" $SERVER_PORT "PORT=$SERVER_PORT npx nx serve server"
    start_service "Client" $CLIENT_PORT "npx nx serve client --port=$CLIENT_PORT"
    ;;
  *)
    echo "Unknown service: $SERVICE"
    echo "Usage: ./scripts/local-start.sh [client|server|both]"
    exit 1
    ;;
esac
