# WebStorm Debug Configuration for @webpieces Source

## Additional Manual Setup Required

After linking packages, you need to configure WebStorm to recognize the source mapping:

### 1. Add TypeScript Source Roots

**Settings → Languages & Frameworks → TypeScript → Compiler**

Add to "Use tsconfig.json from":
- `/Users/deanhiller/workspace/personal/webpieces-ts-example/tsconfig.base.json`
- `/Users/deanhiller/workspace/personal/webpieces-ts/tsconfig.base.json` (optional, for framework development)

### 2. Mark Directories as Sources

**Right-click in Project view:**

Mark as **Sources Root**:
- `/Users/deanhiller/workspace/personal/webpieces-ts/packages/http/http-server/src`
- `/Users/deanhiller/workspace/personal/webpieces-ts/packages/http/http-routing/src`
- `/Users/deanhiller/workspace/personal/webpieces-ts/packages/http/http-filters/src`
- `/Users/deanhiller/workspace/personal/webpieces-ts/packages/http/http-client/src`
- `/Users/deanhiller/workspace/personal/webpieces-ts/packages/http/http-api/src`

### 3. Enable Source Maps in Debugger

**Settings → Build, Execution, Deployment → Debugger**

- ✅ Enable "Automatically step into mapped source"
- ✅ Enable "Use JavaScript source maps"

### 4. Configure JavaScript Debugger Mappings

**Settings → Build, Execution, Deployment → Debugger → JavaScript**

Click "Add..." and create mappings:

| Local path | Remote URL |
|------------|------------|
| `/Users/deanhiller/workspace/personal/webpieces-ts/packages/http/http-server/src` | `webpack:///packages/http/http-server/src` |
| `/Users/deanhiller/workspace/personal/webpieces-ts/dist/packages/http/http-server/src` | `file:///dist/packages/http/http-server/src` |

(WebStorm usually auto-detects these, but manual config helps if needed)

---

## Verify Setup

After configuration:

1. Open `/Users/deanhiller/workspace/personal/webpieces-ts/packages/http/http-server/src/WebpiecesServer.ts`
2. Set a breakpoint at line 100 (in `initialize()` method)
3. Start "Debug Server" configuration
4. Debugger should pause at your breakpoint in the TypeScript source

---

## Troubleshooting

If stepping into libraries still doesn't work:

### Check npm link Status
```bash
ls -la node_modules/@webpieces/http-server
# Should show: -> ../../../../../../webpieces-ts/dist/packages/http/http-server
```

### Verify Source Maps
```bash
cat node_modules/@webpieces/http-server/src/WebpiecesServer.js.map | grep sourceRoot
# Should show path to original TypeScript source
```

### Force Source Map Resolution
Add to `services/website/server/tsconfig.json`:
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true,
    "sourceRoot": "/"
  }
}
```

### Alternative: Open Both Projects in WebStorm
If source mapping is still problematic, open BOTH projects:
- File → Open → webpieces-ts (in new window)
- File → Open → webpieces-ts-example (in new window)
- Debug from webpieces-ts-example
- Set breakpoints in webpieces-ts project window
