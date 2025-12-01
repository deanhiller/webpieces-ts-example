#!/bin/bash
# Script to unlink local webpieces packages and reinstall from npm

set -e

echo "🔓 Unlinking local webpieces packages..."

# Unlink packages from this project
npm unlink @webpieces/core-context --no-save
npm unlink @webpieces/core-meta --no-save
npm unlink @webpieces/http-api --no-save
npm unlink @webpieces/http-client --no-save
npm unlink @webpieces/http-filters --no-save
npm unlink @webpieces/http-routing --no-save
npm unlink @webpieces/http-server --no-save

echo "📦 Reinstalling from npm..."
npm install

echo ""
echo "✨ Done! Now using published webpieces packages from npm."
