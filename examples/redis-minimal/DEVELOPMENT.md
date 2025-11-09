# Development Setup

## Module Resolution Issues with Turbopack

When developing locally with the linked package, Turbopack (Next.js 16's default bundler) has issues resolving the symlinked package modules.

### Workaround Options:

#### Option 1: Use Production Build for Testing
```bash
cd /home/user/nextjs-cache-handler/packages/nextjs-cache-handler
npm run build
cd ../../examples/redis-minimal
npm run build
npm start
```

#### Option 2: Test with Published Package
Install the published version from npm instead of using the local link.

#### Option 3: Disable Turbopack (Temporary)
Add to package.json scripts:
```json
"dev:webpack": "NODE_OPTIONS='--no-warnings' next dev --no-turbopack"
```

## Current Setup

The example uses a symlinked local package:
- `node_modules/@fortedigital/nextjs-cache-handler` → `../../../../packages/nextjs-cache-handler`

## Testing

Once module resolution is working:
```bash
npm run test:e2e           # Run all Playwright tests
npm run test:e2e:ui        # Run with Playwright UI
npm run test:e2e:headed    # Run with browser visible
```

## Debug Logging

Enable cache debug logging:
```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
```

This will log all cache operations including:
- GET/SET operations
- Tag revalidation
- Cache strategy decisions
