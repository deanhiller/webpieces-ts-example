#!/bin/bash
# Script to enable local webpieces-ts source for full IDE navigation and debugging
# Usage: ./use-local-webpieces.sh [webpieces-dir-name]
# Example: ./use-local-webpieces.sh webpieces-ts30
#
# This script:
# - Uses npm link for runtime dependencies
# - Adds TypeScript path mappings for IDE navigation to source
# - Configures WebStorm content roots
# - Sets up inversify version overrides to prevent conflicts

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Accept optional argument for webpieces directory name (default: webpieces-ts)
WEBPIECES_NAME="${1:-webpieces-ts}"
WEBPIECES_DIR="../$WEBPIECES_NAME"
WEBPIECES_FULL_PATH="$(cd "$PROJECT_DIR/.." && pwd)/$WEBPIECES_NAME"

echo "🔗 Setting up local $WEBPIECES_NAME source for debugging..."
echo ""

# Check if webpieces-ts directory exists
if [ ! -d "$WEBPIECES_FULL_PATH" ]; then
  echo "❌ Error: $WEBPIECES_NAME directory not found at $WEBPIECES_FULL_PATH"
  exit 1
fi

# Step 1: Build webpieces packages
echo "📦 Building $WEBPIECES_NAME packages..."
cd "$WEBPIECES_FULL_PATH"
npx nx run-many --target=build --projects=core-context,core-meta,http-api,http-client,http-filters,http-routing,http-server
cd - > /dev/null

# Step 2: Create global npm links
echo ""
echo "🔗 Creating global npm links..."
cd "$WEBPIECES_FULL_PATH/dist/packages/http"
(cd http-server && npm link) > /dev/null
(cd http-routing && npm link) > /dev/null
(cd http-api && npm link) > /dev/null
(cd http-client && npm link) > /dev/null
(cd http-filters && npm link) > /dev/null
cd - > /dev/null

# Step 3: Update package.json with exact inversify versions
echo ""
echo "🔧 Configuring package.json for local linking..."

# Use published umbrella packages (client, server, rules)
# But we'll link the individual http packages
node << 'SCRIPT'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Keep existing webpieces versions (don't override them)
// Just ensure umbrella packages exist if not present
pkg.dependencies['@webpieces/client'] = pkg.dependencies['@webpieces/client'] || '^0.2.44';
pkg.dependencies['@webpieces/server'] = pkg.dependencies['@webpieces/server'] || '^0.2.44';
pkg.dependencies['@webpieces/rules'] = pkg.dependencies['@webpieces/rules'] || '^0.2.44';

// Add exact inversify versions (matching webpieces-ts)
pkg.dependencies['inversify'] = '7.10.4';
pkg.dependencies['@inversifyjs/binding-decorators'] = '1.1.5';
pkg.dependencies['@inversifyjs/common'] = '1.5.2';
pkg.dependencies['@inversifyjs/container'] = '1.14.1';
pkg.dependencies['@inversifyjs/core'] = '9.1.1';

// Add overrides to force single inversify version across all packages
pkg.overrides = {
  'inversify': '7.10.4',
  '@inversifyjs/core': '9.1.1',
  '@inversifyjs/container': '1.14.1',
  '@inversifyjs/common': '1.5.2'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
SCRIPT

# Step 4: Install dependencies
echo ""
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Step 5: Link local packages
echo ""
echo "🔗 Linking local webpieces packages..."
npm link @webpieces/http-server @webpieces/http-routing @webpieces/http-api @webpieces/http-client @webpieces/http-filters

# Step 6: Update TypeScript path mappings
echo ""
echo "🔧 Configuring TypeScript path mappings..."
WEBPIECES_NAME="$WEBPIECES_NAME" node << 'SCRIPT'
const fs = require('fs');
const webpiecesName = process.env.WEBPIECES_NAME;
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8'));

// Add path mappings for source navigation
tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
tsconfig.compilerOptions.paths['@webpieces/http-server'] = [`../${webpiecesName}/packages/http/http-server/src/index.ts`];
tsconfig.compilerOptions.paths['@webpieces/http-routing'] = [`../${webpiecesName}/packages/http/http-routing/src/index.ts`];
tsconfig.compilerOptions.paths['@webpieces/http-api'] = [`../${webpiecesName}/packages/http/http-api/src/index.ts`];
tsconfig.compilerOptions.paths['@webpieces/http-client'] = [`../${webpiecesName}/packages/http/http-client/src/index.ts`];
tsconfig.compilerOptions.paths['@webpieces/http-filters'] = [`../${webpiecesName}/packages/http/http-filters/src/index.ts`];

// Exclude webpieces-ts build artifacts (remove old ones first, then add new)
tsconfig.exclude = (tsconfig.exclude || []).filter(e => !e.includes('webpieces-ts'));
tsconfig.exclude.push(`../${webpiecesName}/apps`);
tsconfig.exclude.push(`../${webpiecesName}/node_modules`);
tsconfig.exclude.push(`../${webpiecesName}/dist`);

fs.writeFileSync('tsconfig.base.json', JSON.stringify(tsconfig, null, 2) + '\n');
SCRIPT

# Step 7: Update WebStorm content roots
echo ""
echo "🔧 Configuring WebStorm IDE settings..."
WEBPIECES_NAME="$WEBPIECES_NAME" node << 'SCRIPT'
const fs = require('fs');
const webpiecesName = process.env.WEBPIECES_NAME;

const imlPath = '.idea/webpieces-ts-example.iml';
const vcsPath = '.idea/vcs.xml';

// Update .iml file
if (fs.existsSync(imlPath)) {
  let iml = fs.readFileSync(imlPath, 'utf8');

  // Remove any existing webpieces content roots
  iml = iml.replace(/<content url="file:\/\/\$MODULE_DIR\$\/\.\.\/webpieces-ts[^"]*">[\s\S]*?<\/content>\s*/g, '');

  // Add new content root before <orderEntry
  const contentRoot = `    <content url="file://$MODULE_DIR$/../${webpiecesName}">
      <sourceFolder url="file://$MODULE_DIR$/../${webpiecesName}/packages" isTestSource="false" />
      <excludeFolder url="file://$MODULE_DIR$/../${webpiecesName}/node_modules" />
      <excludeFolder url="file://$MODULE_DIR$/../${webpiecesName}/dist" />
      <excludeFolder url="file://$MODULE_DIR$/../${webpiecesName}/.nx" />
    </content>
`;
  if (!iml.includes(webpiecesName)) {
    iml = iml.replace('    <orderEntry', contentRoot + '    <orderEntry');
  }
  fs.writeFileSync(imlPath, iml);
}

// Update vcs.xml file
if (fs.existsSync(vcsPath)) {
  let vcs = fs.readFileSync(vcsPath, 'utf8');

  // Remove any existing webpieces VCS mappings
  vcs = vcs.replace(/\s*<mapping directory="\$PROJECT_DIR\$\/\.\.\/webpieces-ts[^"]*" vcs="Git" \/>/g, '');

  // Add new VCS mapping before </component>
  if (!vcs.includes(webpiecesName)) {
    const vcsMapping = `    <mapping directory="$PROJECT_DIR$/../${webpiecesName}" vcs="Git" />\n`;
    vcs = vcs.replace('  </component>', vcsMapping + '  </component>');
  }
  fs.writeFileSync(vcsPath, vcs);
}
SCRIPT

echo ""
echo "✨ Done! Local $WEBPIECES_NAME source is now linked."
echo ""
echo "📍 Setup summary:"
echo "   • npm link: node_modules/@webpieces/* → $WEBPIECES_FULL_PATH/dist/"
echo "   • TypeScript paths: @webpieces/* → $WEBPIECES_FULL_PATH/packages/*/src/"
echo "   • WebStorm content root: $WEBPIECES_FULL_PATH/packages/"
echo ""
echo "🔍 IDE Navigation:"
echo "   • Cmd+Click on imports jumps to TypeScript source"
echo "   • Breakpoints work in $WEBPIECES_NAME source files"
echo "   • Changes require rebuild: cd $WEBPIECES_FULL_PATH && npx nx build <package>"
echo ""
echo "🚀 Running server:"
echo "   • Use Debug configurations in WebStorm (NODE_PRESERVE_SYMLINKS=1 is set)"
echo "   • Or: NODE_PRESERVE_SYMLINKS=1 PORT=8250 node dist/services/website/server/main.js"
echo ""
echo "⚠️  IMPORTANT: Restart WebStorm to reload content roots and VCS mappings"
echo "   File → Invalidate Caches / Restart → Invalidate and Restart"
echo ""
echo "To switch back: npm run use-published-webpieces"
