#!/bin/bash
# Script to build all webpieces packages

set -e

WEBPIECES_DIR="../webpieces-ts"

echo "🏗️  Building webpieces-ts packages..."
echo ""

if [ ! -d "$WEBPIECES_DIR" ]; then
  echo "❌ Error: webpieces-ts directory not found at $WEBPIECES_DIR"
  exit 1
fi

cd "$WEBPIECES_DIR"

# Build all packages
echo "📦 Installing dependencies in webpieces-ts..."
npm install

echo ""
echo "🔨 Building packages..."
npx nx run-many --target=build --all

echo ""
echo "✅ All webpieces packages built successfully!"
echo "   You can now use them in your project."
