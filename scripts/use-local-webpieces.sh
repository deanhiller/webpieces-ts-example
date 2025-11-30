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

# Add TypeScript path mappings for IDE navigation
echo "🔧 Adding TypeScript path mappings for source navigation..."
node << 'SCRIPT'
const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8'));

tsconfig.compilerOptions.paths = {
  ...tsconfig.compilerOptions.paths,
  "@webpieces/core-context": ["../webpieces-ts/packages/core/core-context/src/index.ts"],
  "@webpieces/core-meta": ["../webpieces-ts/packages/core/core-meta/src/index.ts"],
  "@webpieces/http-api": ["../webpieces-ts/packages/http/http-api/src/index.ts"],
  "@webpieces/http-routing": ["../webpieces-ts/packages/http/http-routing/src/index.ts"],
  "@webpieces/http-filters": ["../webpieces-ts/packages/http/http-filters/src/index.ts"],
  "@webpieces/http-server": ["../webpieces-ts/packages/http/http-server/src/index.ts"],
  "@webpieces/http-client": ["../webpieces-ts/packages/http/http-client/src/index.ts"]
};

// Add webpieces-ts to exclude to prevent build errors
if (!tsconfig.exclude.includes("../webpieces-ts")) {
  tsconfig.exclude.push("../webpieces-ts");
}

fs.writeFileSync('tsconfig.base.json', JSON.stringify(tsconfig, null, 2) + '\n');
SCRIPT

echo "✅ Added path mappings to tsconfig.base.json"

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
