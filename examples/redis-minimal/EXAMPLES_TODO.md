# Next.js 16 Cache Handler - Examples TODO

This document tracks the completion status of all example implementations based on [PR #109](https://github.com/fortedigital/nextjs-cache-handler/pull/109).

## Completed ✅

- [x] Create navigation structure with shared layout
- [x] Improve homepage with examples overview
- [x] Rename fetch-example to fetch-cache and improve
- [x] Add TTL/Expiration example
- [x] Add revalidate-tag API route
- [x] Add revalidate-path API route

## In Progress 🚧

### Core Feature Examples

- [ ] **revalidate-tag page** - Interactive UI for testing tag revalidation
- [ ] **revalidate-path page** - Interactive UI for testing path revalidation
- [ ] **use-cache-demo** - Demonstrate Next.js 16 "use cache" directive
- [ ] Verify and update **ISR example** (isr-example/blog/[id])
- [ ] Verify and update **static-params-test**
- [ ] Verify and update **PPR example**

### Additional Examples Needed

- [ ] **Multiple tags example** - Show revalidation with multiple tags
- [ ] **Nested caching example** - Component-level caching
- [ ] **Error handling example** - Cache behavior during errors
- [ ] **Conditional caching example** - Dynamic cache decisions

## Testing 🧪

### Playwright E2E Tests

- [ ] Test fetch-cache example
  - [ ] Verify data is cached
  - [ ] Verify TTL expiration
  - [ ] Verify tag revalidation works
- [ ] Test ISR example
  - [ ] Verify static generation
  - [ ] Verify dynamic params work
  - [ ] Verify revalidation
- [ ] Test TTL example
  - [ ] Verify cache freshness
  - [ ] Verify staleness behavior
  - [ ] Verify expiration
- [ ] Test tag revalidation
  - [ ] Test single tag revalidation
  - [ ] Test multiple tag revalidation
  - [ ] Verify cascade effects
- [ ] Test path revalidation
  - [ ] Test single path revalidation
  - [ ] Test layout revalidation
  - [ ] Test nested path revalidation
- [ ] Test "use cache" directive
  - [ ] Verify component caching
  - [ ] Verify it's separate from cache handler
- [ ] Test PPR example
  - [ ] Verify partial prerendering
  - [ ] Verify dynamic/static mix
- [ ] Test production build
  - [ ] Verify all features work in production
  - [ ] Verify Redis integration
  - [ ] Verify cache persistence

## Documentation 📚

- [ ] Add comprehensive README for examples/
- [ ] Document each example's purpose and behavior
- [ ] Add troubleshooting section
- [ ] Add Redis setup instructions
- [ ] Document differences between Next.js 15 and 16 caching

## Production Readiness 🚀

- [ ] Verify instrumentation works correctly
- [ ] Test with Redis in production mode
- [ ] Test with LRU fallback
- [ ] Performance benchmarking
- [ ] Memory usage monitoring
- [ ] Error handling and logging

## Known Issues ⚠️

From PR #109:
- Tags may not save properly in development mode (needs verification)
- Need to test all features in both dev and production modes

## Next Steps

1. Complete all remaining example pages
2. Write comprehensive Playwright tests
3. Add detailed documentation
4. Test production builds
5. Performance testing
6. Create migration guide from Next.js 15 to 16
