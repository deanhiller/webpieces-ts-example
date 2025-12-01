#!/bin/bash
# Script to switch back to published webpieces packages

set -e

echo "📦 Switching to published webpieces packages..."

# Update package.json to use published versions
sed -i.tmp 's|"@webpieces/core-context": "file:[^"]*"|"@webpieces/core-context": "^0.2.9"|g' package.json
sed -i.tmp 's|"@webpieces/core-meta": "file:[^"]*"|"@webpieces/core-meta": "^0.2.9"|g' package.json
sed -i.tmp 's|"@webpieces/http-api": "file:[^"]*"|"@webpieces/http-api": "^0.2.9"|g' package.json
sed -i.tmp 's|"@webpieces/http-client": "file:[^"]*"|"@webpieces/http-client": "^0.2.9"|g' package.json
sed -i.tmp 's|"@webpieces/http-filters": "file:[^"]*"|"@webpieces/http-filters": "^0.2.9"|g' package.json
sed -i.tmp 's|"@webpieces/http-routing": "file:[^"]*"|"@webpieces/http-routing": "^0.2.9"|g' package.json
sed -i.tmp 's|"@webpieces/http-server": "file:[^"]*"|"@webpieces/http-server": "^0.2.9"|g' package.json
rm package.json.tmp

echo "✅ Updated package.json to use published packages"

# Keep TypeScript path mappings for IDE navigation
# (They're needed for WebStorm to navigate to source)
echo "🔧 Path mappings kept in tsconfig.base.json for IDE navigation"

# Reinstall dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Done! Your project is now using published webpieces packages."
