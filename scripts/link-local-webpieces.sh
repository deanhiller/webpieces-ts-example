#!/bin/bash

set -e

echo "🔗 Linking local @webpieces packages for debugging..."
echo ""

WEBPIECES_DIR="/Users/deanhiller/workspace/personal/webpieces-ts"

# Check if webpieces-ts directory exists
if [ ! -d "$WEBPIECES_DIR" ]; then
  echo "❌ Error: webpieces-ts directory not found at $WEBPIECES_DIR"
  exit 1
fi

echo "📦 Building all webpieces-ts packages..."
cd "$WEBPIECES_DIR"
npx nx run-many --target=build --all

echo ""
echo "🔗 Creating global npm links..."

# Link each package globally
cd dist/packages/core/core-context && npm link
cd ../core-meta && npm link
cd ../../http/http-api && npm link
cd ../http-filters && npm link
cd ../http-routing && npm link
cd ../http-client && npm link
cd ../http-server && npm link

echo ""
echo "🔗 Linking packages to example project..."

cd /Users/deanhiller/workspace/personal/webpieces-ts-example

# Link all @webpieces packages
npm link @webpieces/core-context
npm link @webpieces/core-meta
npm link @webpieces/http-api
npm link @webpieces/http-filters
npm link @webpieces/http-routing
npm link @webpieces/http-client
npm link @webpieces/http-server

echo ""
echo "✅ All packages linked successfully!"
echo ""
echo "📝 Linked packages now point to:"
echo "   $WEBPIECES_DIR/dist/packages/"
echo ""
echo "🐛 You can now debug into @webpieces source code in WebStorm"
echo ""
echo "To unlink: npm unlink @webpieces/core-context @webpieces/core-meta ..."
echo "Then reinstall: npm install"
