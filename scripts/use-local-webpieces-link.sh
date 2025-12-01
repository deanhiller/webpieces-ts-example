#!/bin/bash
# Script to use npm link for local webpieces packages
# This creates symlinks: node_modules/@webpieces/* → ../webpieces-ts/dist/packages/*

set -e

echo "🔗 Linking to local webpieces-ts packages via npm link..."

# First, build the webpieces packages
echo "🏗️  Building webpieces packages..."
cd ../webpieces-ts
npx nx run-many --target=build --projects=core-context,core-meta,http-api,http-client,http-filters,http-routing,http-server

# Link all webpieces packages globally
echo "🔗 Creating global links for webpieces packages..."
cd dist/packages/core/core-context && npm link
cd ../core-meta && npm link
cd ../../http/http-api && npm link
cd ../http-client && npm link
cd ../http-filters && npm link
cd ../http-routing && npm link
cd ../http-server && npm link

# Go back to example project and link to the packages
cd /Users/deanhiller/workspace/personal/webpieces-ts-example

echo "🔗 Linking webpieces packages to this project..."
npm link @webpieces/core-context
npm link @webpieces/core-meta
npm link @webpieces/http-api
npm link @webpieces/http-client
npm link @webpieces/http-filters
npm link @webpieces/http-routing
npm link @webpieces/http-server

echo ""
echo "✨ Done! Local webpieces packages are now linked via symlinks."
echo "   Changes in webpieces-ts require rebuild: npm run build-webpieces"
echo ""
echo "To unlink: npm run unlink-local-webpieces"
