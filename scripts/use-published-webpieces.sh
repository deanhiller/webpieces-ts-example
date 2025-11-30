#!/bin/bash
# Script to switch back to published webpieces packages

set -e

echo "📦 Switching to published webpieces packages..."

# Update package.json to use published versions
sed -i.tmp 's|"@webpieces/core-context": "file:[^"]*"|"@webpieces/core-context": "^0.2.6"|g' package.json
sed -i.tmp 's|"@webpieces/core-meta": "file:[^"]*"|"@webpieces/core-meta": "^0.2.6"|g' package.json
sed -i.tmp 's|"@webpieces/http-api": "file:[^"]*"|"@webpieces/http-api": "^0.2.6"|g' package.json
sed -i.tmp 's|"@webpieces/http-client": "file:[^"]*"|"@webpieces/http-client": "^0.2.6"|g' package.json
sed -i.tmp 's|"@webpieces/http-filters": "file:[^"]*"|"@webpieces/http-filters": "^0.2.6"|g' package.json
sed -i.tmp 's|"@webpieces/http-routing": "file:[^"]*"|"@webpieces/http-routing": "^0.2.6"|g' package.json
sed -i.tmp 's|"@webpieces/http-server": "file:[^"]*"|"@webpieces/http-server": "^0.2.6"|g' package.json
rm package.json.tmp

echo "✅ Updated package.json to use published packages"

# Remove TypeScript path mappings for webpieces packages
echo "🔧 Removing TypeScript path mappings..."
node << 'SCRIPT'
const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8'));

// Remove webpieces path mappings
const webpiecesPackages = [
  "@webpieces/core-context",
  "@webpieces/core-meta",
  "@webpieces/http-api",
  "@webpieces/http-routing",
  "@webpieces/http-filters",
  "@webpieces/http-server",
  "@webpieces/http-client"
];

webpiecesPackages.forEach(pkg => {
  delete tsconfig.compilerOptions.paths[pkg];
});

// Remove webpieces-ts from exclude
tsconfig.exclude = tsconfig.exclude.filter(e => e !== "../webpieces-ts");

fs.writeFileSync('tsconfig.base.json', JSON.stringify(tsconfig, null, 2) + '\n');
SCRIPT

echo "✅ Removed path mappings from tsconfig.base.json"

# Reinstall dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Done! Your project is now using published webpieces packages."
