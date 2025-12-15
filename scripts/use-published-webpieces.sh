#!/bin/bash
# Script to switch back to published webpieces packages and clean up local linking setup

set -e

echo "📦 Switching to published webpieces packages..."
echo ""

# Step 1: Unlink local packages
echo "🔓 Unlinking local webpieces packages..."
npm unlink @webpieces/http-server --no-save 2>/dev/null || true
npm unlink @webpieces/http-routing --no-save 2>/dev/null || true
npm unlink @webpieces/http-api --no-save 2>/dev/null || true
npm unlink @webpieces/http-client --no-save 2>/dev/null || true
npm unlink @webpieces/http-filters --no-save 2>/dev/null || true

# Step 2: Update package.json to remove local-only configurations
echo ""
echo "🔧 Cleaning up package.json..."

node << 'SCRIPT'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Keep existing webpieces versions (don't override them)
// Just ensure umbrella packages exist if not present
pkg.dependencies['@webpieces/client'] = pkg.dependencies['@webpieces/client'] || '^0.2.44';
pkg.dependencies['@webpieces/server'] = pkg.dependencies['@webpieces/server'] || '^0.2.44';
pkg.dependencies['@webpieces/rules'] = pkg.dependencies['@webpieces/rules'] || '^0.2.44';

// Remove individual http packages (they come from @webpieces/server)
delete pkg.dependencies['@webpieces/http-api'];
delete pkg.dependencies['@webpieces/http-client'];
delete pkg.dependencies['@webpieces/http-filters'];
delete pkg.dependencies['@webpieces/http-routing'];
delete pkg.dependencies['@webpieces/http-server'];

// Remove explicit inversify packages (they come transitively)
delete pkg.dependencies['@inversifyjs/common'];
delete pkg.dependencies['@inversifyjs/container'];
delete pkg.dependencies['@inversifyjs/core'];

// Restore inversify to caret version
pkg.dependencies['inversify'] = '^7.10.4';
pkg.dependencies['@inversifyjs/binding-decorators'] = '^1.1.5';

// Remove overrides
delete pkg.overrides;

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
SCRIPT

# Step 3: Clean TypeScript path mappings
echo ""
echo "🔧 Cleaning TypeScript path mappings..."
node << 'SCRIPT'
const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8'));

// Remove webpieces path mappings (keep apis mapping)
if (tsconfig.compilerOptions.paths) {
  delete tsconfig.compilerOptions.paths['@webpieces/http-server'];
  delete tsconfig.compilerOptions.paths['@webpieces/http-routing'];
  delete tsconfig.compilerOptions.paths['@webpieces/http-api'];
  delete tsconfig.compilerOptions.paths['@webpieces/http-client'];
  delete tsconfig.compilerOptions.paths['@webpieces/http-filters'];
}

// Remove webpieces excludes
if (tsconfig.exclude) {
  tsconfig.exclude = tsconfig.exclude.filter(e => !e.includes('webpieces-ts'));
}

fs.writeFileSync('tsconfig.base.json', JSON.stringify(tsconfig, null, 2) + '\n');
SCRIPT

# Step 4: Clean WebStorm content roots
echo ""
echo "🔧 Cleaning WebStorm IDE configuration..."
node << 'SCRIPT'
const fs = require('fs');

const imlPath = '.idea/webpieces-ts-example.iml';
const vcsPath = '.idea/vcs.xml';

// Clean .iml file
if (fs.existsSync(imlPath)) {
  let iml = fs.readFileSync(imlPath, 'utf8');

  // Remove webpieces-ts content root
  iml = iml.replace(/<content url="file:\/\/\$MODULE_DIR\$\/\.\.\/webpieces-ts">[\s\S]*?<\/content>\s*/g, '');

  fs.writeFileSync(imlPath, iml);
}

// Clean vcs.xml file
if (fs.existsSync(vcsPath)) {
  let vcs = fs.readFileSync(vcsPath, 'utf8');

  // Remove webpieces-ts VCS mapping
  vcs = vcs.replace(/\s*<mapping directory="\$PROJECT_DIR\$\/\.\.\/webpieces-ts" vcs="Git" \/>/g, '');

  fs.writeFileSync(vcsPath, vcs);
}
SCRIPT

# Step 5: Reinstall dependencies
echo ""
echo "📦 Reinstalling dependencies from npm registry..."
rm -rf node_modules package-lock.json
npm install

echo ""
echo "✨ Done! Now using published webpieces packages from npm."
echo ""
echo "📍 Configuration cleaned:"
echo "   • npm links removed"
echo "   • TypeScript path mappings removed"
echo "   • WebStorm content roots removed"
echo "   • Inversify overrides removed"
echo ""
echo "⚠️  Note: You will NOT be able to navigate to webpieces source in IDE"
echo "   To re-enable source navigation: npm run use-local-webpieces"
echo ""
echo "🔄 Restart WebStorm to apply IDE configuration changes"
echo "   File → Invalidate Caches / Restart → Invalidate and Restart"
