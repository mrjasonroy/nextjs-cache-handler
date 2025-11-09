# Testing and Fixing Known Limitations

This document outlines how to test and fix the known limitations from PR #109.

## Known Limitations

1. **Tags not persisting in development mode**
2. **"use cache" directive is separate from custom handler** (by design, not a bug)

## Testing Strategy

### 1. Test Tag Persistence

#### A. Create Tag Persistence Test Page

We need a page that shows:
- What tags are being sent
- What's being stored in cache
- What's being retrieved from cache

#### B. Add Cache Inspection API

An API route to inspect cache contents and verify tags are stored.

### 2. Test Development vs Production

Compare behavior in:
- `npm run dev` (development)
- `npm run build && npm start` (production)

### 3. Test with Redis

Verify with actual Redis:
- Start Redis server
- Monitor Redis keys
- Verify tag storage
- Test revalidation

### 4. Add Debug Logging

Enable comprehensive logging to trace cache operations.

## Testing Steps

### Step 1: Enable Debug Logging

Set environment variable:
```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
```

### Step 2: Inspect Cache Keys in Redis

```bash
# Connect to Redis
redis-cli

# List all keys
KEYS *

# Inspect specific key
GET nextjs:your-key-here

# Check tag mappings
HGETALL nextjs:__sharedTags__
```

### Step 3: Test Tag Revalidation Flow

1. Visit `/fetch-cache` - note timestamp
2. Check Redis for tags: `HGETALL nextjs:__sharedTags__`
3. Trigger revalidation: `/api/revalidate-tag?tag=futurama`
4. Revisit `/fetch-cache` - verify data refreshed
5. Check Redis again

### Step 4: Production Build Test

```bash
npm run build
npm start
```

Then run the same tests as Step 3.

## Debugging Tools

### 1. Cache Inspector API

Create `/api/cache-debug` to inspect cache state.

### 2. Redis Monitor

```bash
redis-cli monitor
```

Watch all Redis commands in real-time.

### 3. Enhanced Logging

Add logging to cache-handler.mjs to see all operations.

## Expected Issues and Fixes

### Issue 1: Tags Not Saving in Dev

**Symptom:** Tag revalidation doesn't work in development mode.

**Possible Causes:**
- Fast Refresh clearing cache
- Development mode bypassing cache
- Tags not being extracted from fetch options

**Debug:**
1. Check if tags are in cache handler `set()` context
2. Verify Redis receives tag mappings
3. Check if dev mode has special cache behavior

**Fix:** TBD based on findings

### Issue 2: Fetch Cache Not Persisting

**Symptom:** Fetches are re-executed on every request.

**Possible Causes:**
- `cacheComponents: true` changing fetch behavior
- Development mode forcing fresh data
- Cache handler not being called

**Debug:**
1. Add logs in cache-handler.mjs `set()` method
2. Check if custom handler is being used
3. Verify `cacheMaxMemorySize: 0` disables default cache

**Fix:** TBD based on findings

## Testing Checklist

- [ ] Start Redis server locally
- [ ] Enable debug logging
- [ ] Test fetch cache in development
- [ ] Monitor Redis keys during operation
- [ ] Test tag revalidation in development
- [ ] Build for production
- [ ] Test fetch cache in production
- [ ] Test tag revalidation in production
- [ ] Compare dev vs production behavior
- [ ] Document all findings
- [ ] Implement fixes
- [ ] Verify fixes with automated tests

## Next Steps

1. Create cache inspection tools
2. Run comprehensive tests
3. Document findings
4. Implement fixes
5. Add regression tests
