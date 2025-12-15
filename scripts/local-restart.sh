#!/bin/bash

# Restart by stopping then starting with passthrough args

SERVICE=$1
if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/local-restart.sh [client|server|both]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Stop first (no-op if not running)
"$SCRIPT_DIR/local-stop.sh" "$SERVICE"

# Brief pause to ensure ports are released
sleep 1

# Start
"$SCRIPT_DIR/local-start.sh" "$SERVICE"
