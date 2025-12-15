# WebPieces Development Scripts

This directory contains scripts for managing WebPieces package dependencies during development.

## Quick Reference

| Script | Command | Use When |
|--------|---------|----------|
| **Local Source** | `npm run use-local-webpieces` | You want to debug/navigate webpieces source in IDE |
| **Published Packages** | `npm run use-published-webpieces` | You want stable published versions |

## Detailed Script Guide

### `use-local-webpieces.sh`

**Usage:**
```bash
npm run use-local-webpieces                    # Uses ../webpieces-ts (default)
./scripts/use-local-webpieces.sh webpieces-ts30  # Uses ../webpieces-ts30
```

**What it does:**
- Creates npm symlinks to `../webpieces-ts/dist/` packages
- Adds TypeScript path mappings pointing to `.ts` source files
- Configures WebStorm content roots for `../webpieces-ts/packages/`
- Sets up inversify version overrides to prevent conflicts
- Updates debug configurations with `NODE_PRESERVE_SYMLINKS=1`

**Usage:**
```bash
npm run use-local-webpieces
```

**Benefits:**
- Cmd+Click navigation - Jump directly to webpieces TypeScript source
- Set breakpoints - Debug into webpieces-ts source files
- See errors - TypeScript errors show in webpieces source
- Live changes - Rebuild webpieces and changes apply (no npm reinstall)
- Git integration - WebStorm recognizes webpieces-ts as separate Git repo

**After running:**
1. Restart WebStorm: **File -> Invalidate Caches / Restart**
2. Test navigation: Open `main.ts`, Cmd+Click on `@webpieces/http-server`
3. Should jump to: `../webpieces-ts/packages/http/http-server/src/index.ts`

**When to rebuild webpieces:**
```bash
cd ../webpieces-ts
npx nx build http-server  # Rebuild specific package
# Or:
npx nx run-many --target=build --all  # Rebuild all
```

---

### `use-published-webpieces.sh`

**What it does:**
- Unlinks all local npm symlinks
- Removes TypeScript path mappings
- Removes WebStorm content roots
- Removes inversify overrides
- Reinstalls from npm registry

**Usage:**
```bash
npm run use-published-webpieces
```

**Benefits:**
- Stable versions - Use tested published packages
- Faster install - No local build required
- Clean state - No symlink complications

**Limitations:**
- No source navigation - Can't navigate to webpieces source
- No debugging - Can't set breakpoints in webpieces code

---

## WebStorm Debug Configurations

All debug configurations are pre-configured with `NODE_PRESERVE_SYMLINKS=1`:

| Configuration | Purpose |
|---------------|---------|
| **Debug Server** | Standard debugging (builds first, then runs) |
| **Debug Server (Wait for Attach)** | Start with debugger waiting for attach |
| **Serve Server (Development)** | Nx serve with hot reload |

**Important**: Always use these configurations (not manual node commands) to ensure `NODE_PRESERVE_SYMLINKS=1` is set.

---

## Troubleshooting

### Navigation not working in IDE?
1. Run: `npm run use-local-webpieces` (if not already run)
2. Restart WebStorm: **File -> Invalidate Caches / Restart -> Invalidate and Restart**
3. Check: **Settings -> Project -> Project Structure** - should show two content roots

### Module not found errors at runtime?
```bash
# Verify symlinks exist:
ls -la node_modules/@webpieces/

# Should show symlinks (l) pointing to ../../../webpieces-ts/dist/

# If missing, run:
npm run use-local-webpieces
```

### TypeScript errors about inversify versions?
```bash
# Ensure inversify versions match:
npm ls inversify @inversifyjs/container

# Should show version 7.10.4 and 1.14.1 (not 1.14.3)
# If wrong, run:
npm run use-local-webpieces
```

### Breakpoints not hitting?
1. Verify `sourceMap: true` in `tsconfig.base.json`
2. Ensure `NODE_PRESERVE_SYMLINKS=1` is set in run configuration
3. Rebuild server: `npx nx build server`

---

## Environment Variables

**NODE_PRESERVE_SYMLINKS=1**
- Required when using npm link
- Tells Node.js to preserve symlink paths
- Already set in all debug configurations
- Required for debugging into linked packages

**PORT=8250**
- Server port (matches Angular proxy config)
- Client runs on 4250
- Already set in debug configurations

---

## Workflow Examples

### Development Workflow (With Source Navigation)
```bash
# One-time setup
npm run use-local-webpieces
# Restart WebStorm

# Make changes in webpieces-ts
cd ../webpieces-ts
# Edit files...
npx nx build http-server

# Back to example project
cd -
# Restart server (picks up changes automatically via symlink)
```

### Production Testing (Published Packages)
```bash
# Switch to published
npm run use-published-webpieces

# Test/run
npm run start:server

# Switch back to local
npm run use-local-webpieces
```
