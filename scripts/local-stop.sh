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

# Function to stop process on a port
stop_port() {
  local PORT=$1
  local NAME=$2

  PID=$(lsof -ti :$PORT 2>/dev/null)
  if [ -n "$PID" ]; then
    echo "Stopping $NAME on port $PORT (PID: $PID)"
    kill $PID 2>/dev/null
    # Wait briefly and force kill if still running
    sleep 1
    if kill -0 $PID 2>/dev/null; then
      echo "Force killing $NAME (PID: $PID)"
      kill -9 $PID 2>/dev/null
    fi
  else
    echo "$NAME not running on port $PORT"
  fi
}

# Determine service to stop
SERVICE=$1
if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/local-stop.sh [client|server|both]"
  exit 1
fi

case $SERVICE in
  client)
    stop_port $CLIENT_PORT "Client"
    ;;
  server)
    stop_port $SERVER_PORT "Server"
    ;;
  both)
    stop_port $CLIENT_PORT "Client"
    stop_port $SERVER_PORT "Server"
    ;;
  *)
    echo "Unknown service: $SERVICE"
    echo "Usage: ./scripts/local-stop.sh [client|server|both]"
    exit 1
    ;;
esac
