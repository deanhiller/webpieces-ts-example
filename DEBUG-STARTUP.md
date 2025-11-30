# Debugging WebPieces Startup with Local Packages

This guide shows you how to debug the WebPieces platform startup process using local packages.

## What is Yalc?

**Yalc** is a better alternative to `npm link` for local package development. It solves many of the problems that `npm link` and `yarn link` create with symlinks, dependency resolution, and file system compatibility.

### How Yalc Works

1. **Publishes to local store**: When you run `yalc publish`, it copies package files to a global store (`~/.yalc`)
2. **Copies instead of symlinking**: Uses `file:` dependencies that copy files instead of creating symlinks
3. **Proper dependency resolution**: Avoids the nested dependency issues that plague `npm link`

### Basic Yalc Usage

```bash
# Install yalc globally
npm install -g yalc

# In webpieces-ts directory - publish to local yalc store
cd ../webpieces-ts
yalc publish

# In your app directory - add from local yalc store
cd ../webpieces-ts-example
yalc add @webpieces/http-server
# Repeat for other packages

# Update after making changes to webpieces-ts
cd ../webpieces-ts
yalc publish --push  # Pushes to all consumers

# Remove yalc packages when done
cd ../webpieces-ts-example
yalc remove --all
npm install
```

**Resources:**
- [Yalc GitHub](https://github.com/wclr/yalc)
- [Yalc - npm link alternative](https://www.divotion.com/blog/yalc-npm-link-alternative-that-does-work)
- [Yalc tutorial](https://salkobalic.com/how-to-npm-link-local-package-use-yalc-as-npm-link-alternative)

## Debug Workflow: Using --inspect-brk to Wait for Debugger

The `--inspect-brk` flag tells Node.js to:
1. Start the inspector on port 9229
2. **Break before any user code runs**
3. Wait for a debugger to attach

This is perfect for debugging startup code in WebPieces!

### Option 1: Two-Step Process (Recommended for Startup Debugging)

**Step 1: Start server and wait**
```bash
npm run debug:wait
```

This will:
- Build the server
- Start Node with `--inspect-brk`
- Print: `Debugger listening on ws://127.0.0.1:9229/...`
- **PAUSE and wait for you to attach**

**Step 2: Attach debugger in WebStorm**
1. Select **"Attach to Server"** run configuration
2. Click the Debug button (or Shift+F9)
3. WebStorm connects to port 9229
4. Execution resumes and immediately breaks on first line
5. **Now you can step through WebPieces initialization!**

### Option 2: WebStorm Integrated (Automatic Build + Wait)

Use the **"Debug Server (Wait for Attach)"** configuration:
1. Click Debug on this configuration
2. It automatically builds first
3. Starts server with `--inspect-brk`
4. WebStorm auto-attaches immediately
5. Breaks on first line

### Setting Breakpoints in WebPieces Startup

With local packages linked, you can set breakpoints anywhere:

```typescript
// In webpieces-ts/packages/http/http-server/src/WebpiecesServer.ts

constructor(meta: WebAppMeta) {
  this.meta = meta;  // <-- Set breakpoint here

  this.webpiecesContainer = new Container();  // <-- Or here

  this.appContainer = new Container({ parent: this.webpiecesContainer });
}
```

**Tips:**
- Breakpoints in constructor will hit during `new WebpiecesServer()`
- Breakpoints in `initialize()` hit during `server.start()`
- You can step into ANY webpieces code with source maps

## Current Setup Status

⚠️ **Note**: Due to nested dependency resolution issues with `file:` links, the current local package setup may not work perfectly. You have two options:

### Option A: Use Yalc (Recommended)
Follow the yalc workflow above for better local package management.

### Option B: Debug in webpieces-ts Project
1. Work directly in the `/Users/deanhiller/workspace/personal/webpieces-ts` project
2. Use the example app there (`apps/example-app`)
3. Make changes and test immediately without linking

## WebStorm Run Configurations

You now have these configurations:

1. **Debug Server** - Normal debugging with published packages
2. **Debug Server (Wait for Attach)** - Start with `--inspect-brk`, auto-attach
3. **Attach to Server** - Manual attach to already-running `--inspect-brk` process
4. **Serve Server (Development)** - Watch mode with auto-rebuild

## Troubleshooting

### "Cannot find module" errors with local packages

**Solution**: Use yalc instead of `file:` dependencies

### Debugger doesn't stop at breakpoints

**Check:**
- Source maps are enabled (already done ✓)
- Using local webpieces packages (via yalc or in webpieces-ts project)
- Breakpoint is in loaded code (not in tree-shaken code)

### Port 9229 already in use

```bash
# Kill existing debug session
lsof -ti:9229 | xargs kill -9
```

## Resources

- [Node.js Debugging Guide](https://nodejs.org/en/learn/getting-started/debugging)
- [Node.js Debugger Documentation](https://nodejs.org/api/debugger.html)
- [WebStorm Node.js Debugging](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html)
- [Using --inspect-brk](https://www.builder.io/blog/debug-nodejs)
