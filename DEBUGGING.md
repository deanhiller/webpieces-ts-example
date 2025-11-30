# Debugging WebPieces Applications

This guide explains how to debug your WebPieces application, including stepping through the platform source code when needed.

## Quick Start - Debugging in WebStorm

### Method 1: Debug with Published Packages (Recommended)

This is the simplest approach and works for most debugging scenarios:

1. **Run the Debug Server configuration** from WebStorm
2. Set breakpoints in your application code
3. The debugger will work normally for your code
4. For platform code, breakpoints will work if source maps are available in the published packages

### Method 2: Debug with Local WebPieces Source

Use this when you need to:
- Step through platform code with full source access
- Make changes to the platform while debugging
- Investigate platform issues

**Steps:**
1. Ensure webpieces-ts is cloned at `../webpieces-ts`
2. Build the platform: `npm run build-webpieces`
3. Link to local packages: `npm run use-local-webpieces`
4. Debug normally - source maps will point to local source
5. When done: `npm run use-published-webpieces`

## How Debugging Works

### Source Maps

Both your application and the WebPieces packages are built with source maps enabled:

1. **TypeScript Compilation** (`tsconfig.base.json`):
   - `"sourceMap": true` generates .js.map files
   - Maps compiled JavaScript back to original TypeScript

2. **esbuild Configuration** (`project.json`):
   - `sourcemap: true` in build options
   - Preserves source mapping through the build pipeline

3. **Node.js Debugging**:
   - WebStorm automatically uses source maps
   - Breakpoints set in .ts files work in the debugger
   - Stack traces show original TypeScript file locations

### Package Modes

The project supports two modes for webpieces dependencies:

1. **Published Mode** (Default):
   - Uses npm packages (`^0.2.6`)
   - Faster installs
   - Good for most development work
   - Source maps may point to published source (if available)

2. **Local Mode** (For Platform Development):
   - Uses `file:../webpieces-ts/dist/packages/...`
   - Links to locally built packages
   - Full source access for debugging
   - Requires building webpieces-ts first

## WebStorm Debug Configurations

### Debug Server

Builds and runs the server with debugging enabled:
- Pre-build: Runs `nx build server`
- Node parameters: `--enable-source-maps`
- Entry point: `dist/services/website/server/main.js`
- Environment: `HOST=localhost, PORT=3000`

### Serve Server (Development)

Runs the server in watch mode:
- Automatically rebuilds on changes
- Useful for development workflow
- Note: May have issues with file: dependencies

### Project Structure for Debugging

```
workspace/
├── webpieces-ts/              ← Platform source code
│   └── packages/
│       ├── core/
│       │   ├── core-context/
│       │   └── core-meta/
│       └── http/
│           ├── http-api/
│           ├── http-client/
│           ├── http-filters/
│           ├── http-routing/
│           └── http-server/
└── webpieces-ts-example/      ← Your application (this project)
    ├── services/
    └── libraries/
```

### Tips

- **WebStorm recognizes path mappings automatically** - you can Cmd+Click on imports to jump to source
- **Changes in webpieces-ts** are reflected immediately (no rebuild needed for interpreted code)
- **For compiled changes** in webpieces-ts, run: `npm run build-webpieces`
- **Source maps must be enabled** in both projects for debugging to work properly

## Workflow Examples

### Debugging Your Application

```bash
# 1. Build and debug (WebStorm)
# Just click the Debug Server configuration

# Or from terminal:
npx nx build server
node --enable-source-maps dist/services/website/server/main.js
```

### Debugging a Platform Issue

```bash
# 1. Ensure webpieces-ts is available
cd ../webpieces-ts

# 2. Install dependencies and build
npm install
npx nx run-many --target=build --projects=core-context,core-meta,http-api,http-client,http-filters,http-routing,http-server

# 3. Link to your project
cd ../webpieces-ts-example
npm run use-local-webpieces

# 4. Rebuild your project
npx nx build server

# 5. Debug with full platform source access
# Use Debug Server configuration in WebStorm

# 6. When done, switch back
npm run use-published-webpieces
npm install
```

### Working on Both Platform and Application

If actively developing both:

1. Keep local mode enabled: `npm run use-local-webpieces`
2. Make changes in ../webpieces-ts
3. Rebuild platform: `npm run build-webpieces`
4. Rebuild your app: `npx nx build server`
5. Test and debug
6. Repeat

## Troubleshooting

### "Cannot find module" errors

**Symptom:** `Error: Cannot find module '@webpieces/http-server'`

**Solutions:**
- Run `npm install` to ensure all packages are installed
- If using local mode, verify `../webpieces-ts/dist/packages/` exists
- Check that webpieces packages are built: `npm run build-webpieces`
- Try: `rm -rf node_modules package-lock.json && npm install`

### Breakpoints not hitting

**Symptom:** Debugger doesn't stop at breakpoints

**Solutions:**
- Verify source maps are enabled in `tsconfig.base.json` and `project.json`
- Rebuild the project: `npx nx reset && npx nx build server`
- Check Node.js is running with `--enable-source-maps`
- In WebStorm: File → Invalidate Caches / Restart

### Port already in use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
- Kill existing process: `lsof -ti:3000 | xargs kill -9`
- Or change PORT in environment variables

### Module resolution errors with local packages

**Symptom:** Can't resolve nested dependencies when using local mode

**Solutions:**
- Ensure all webpieces packages are built: `npm run build-webpieces`
- The dist packages must have proper package.json with dependencies
- Try switching back to published: `npm run use-published-webpieces`

## Configuration Files

- **tsconfig.base.json** - TypeScript compiler options, source map settings
- **package.json** - Dependencies (npm versions or file: paths)
- **project.json** - Build configuration (esbuild settings, source maps)
- **scripts/*.sh** - Helper scripts for switching between modes
- **.idea/runConfigurations/*.xml** - WebStorm debug configurations

## Important Notes

1. **Published packages are recommended** for normal development
2. **Local mode requires** building webpieces-ts first
3. **Source maps work** in both modes for debugging
4. **File: dependencies** can have module resolution issues with nested dependencies
5. **Always rebuild** after switching modes or changing platform code
