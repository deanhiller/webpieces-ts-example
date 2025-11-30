#!/bin/bash
# Script to switch to local webpieces packages for debugging

set -e

echo "🔗 Switching to local webpieces-ts packages..."

# Backup package.json if it doesn't exist
if [ ! -f "package.json.backup" ]; then
  cp package.json package.json.backup
  echo "✅ Backed up package.json to package.json.backup"
fi

# First, build the webpieces packages
echo "🏗️  Building webpieces packages..."
cd ../webpieces-ts
npx nx run-many --target=build --projects=core-context,core-meta,http-api,http-client,http-filters,http-routing,http-server
cd - > /dev/null

# Update package.json to use file: protocol pointing to dist
sed -i.tmp 's|"@webpieces/core-context": "[^"]*"|"@webpieces/core-context": "file:../webpieces-ts/dist/packages/core/core-context"|g' package.json
sed -i.tmp 's|"@webpieces/core-meta": "[^"]*"|"@webpieces/core-meta": "file:../webpieces-ts/dist/packages/core/core-meta"|g' package.json
sed -i.tmp 's|"@webpieces/http-api": "[^"]*"|"@webpieces/http-api": "file:../webpieces-ts/dist/packages/http/http-api"|g' package.json
sed -i.tmp 's|"@webpieces/http-client": "[^"]*"|"@webpieces/http-client": "file:../webpieces-ts/dist/packages/http/http-client"|g' package.json
sed -i.tmp 's|"@webpieces/http-filters": "[^"]*"|"@webpieces/http-filters": "file:../webpieces-ts/dist/packages/http/http-filters"|g' package.json
sed -i.tmp 's|"@webpieces/http-routing": "[^"]*"|"@webpieces/http-routing": "file:../webpieces-ts/dist/packages/http/http-routing"|g' package.json
sed -i.tmp 's|"@webpieces/http-server": "[^"]*"|"@webpieces/http-server": "file:../webpieces-ts/dist/packages/http/http-server"|g' package.json
rm package.json.tmp

echo "✅ Updated package.json to use local dist packages"

# Reinstall dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Done! Your project is now using local webpieces-ts packages."
echo "   TypeScript source maps will allow you to step through platform code when debugging."
echo ""
echo "📝 Note: After making changes in webpieces-ts, run: npm run build-webpieces"
echo "   Then restart your debug session to see the changes."
echo ""
echo "To switch back to published packages, run: npm run use-published-webpieces"
