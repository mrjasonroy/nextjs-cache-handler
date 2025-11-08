![NPM Version](https://img.shields.io/npm/v/%40fortedigital%2Fnextjs-cache-handler)

# @fortedigital/nextjs-cache-handler

A caching utility built originally on top of [`@neshca/cache-handler`](https://www.npmjs.com/package/@neshca/cache-handler), providing additional cache handlers for specialized use cases with a focus on Redis-based caching.

**Version compatibility:**
- Version `3.x.x`: Next.js 16+ (with "use cache" and cacheComponents support)
- Version `2.x.x`: Next.js 15+ (legacy)
- Version `1.x.x`: Next.js 14 and earlier (deprecated)

Starting from version `2.0.0`, this package no longer depends on `@neshca/cache-handler` and is fully maintained independently.

## Documentation

The documentation at [@neshca/cache-handler - caching-tools.github.io/next-shared-cache](https://caching-tools.github.io/next-shared-cache) is mostly still relevant, though some details may be outdated. New features or relevant changes are described below.

## Migration

- [2.x.x → ^3.x.x (Next.js 16)](#nextjs-16-migration)
- [1.x.x → ^2.x.x](https://github.com/fortedigital/nextjs-cache-handler/blob/master/docs/migration/1_x_x__2_x_x.md)
- [1.2.x -> ^1.3.x](https://github.com/fortedigital/nextjs-cache-handler/blob/master/docs/migration/1_2_x__1_3_x.md)

### Next.js 16 Migration

Version 3.0.0 adds full support for Next.js 16 with the following key changes:

**Breaking Changes:**
- Requires Next.js 16.0.0 or later
- The cache handler API now supports the optional `durations` parameter in `revalidateTag(tag, durations?)`

**App Router Changes:**
When using `cacheComponents: true` in Next.js 16, you must replace `export const revalidate` with the `"use cache"` directive:

```tsx
// ❌ Old (Next.js 15 / incompatible with cacheComponents)
export const revalidate = 3600;
export default async function Page() {
  return <div>{new Date().toISOString()}</div>;
}

// ✅ New (Next.js 16)
"use cache";
export default async function Page() {
  return <div>{new Date().toISOString()}</div>;
}
```

**Important Notes:**
- The custom `cacheHandler` continues to work for ISR, fetch caching, and route handlers
- The new "use cache" directive is managed separately by Next.js and does not use the custom cache handler
- Pages Router (`getStaticProps` with `revalidate`) continues to work unchanged
- Flush your Redis cache when upgrading from Next.js 15 to Next.js 16

## Installation

`npm i @fortedigital/nextjs-cache-handler`

If upgrading from Next 14 or earlier, **flush your Redis cache** before running new version of the application locally and on your hosted environments. **Cache formats between Next.js versions may be incompatible**.

## Next.js 16 Support

Version 3.0.0 provides full support for Next.js 16, including:
- ✅ Cache Components and `"use cache"` directive
- ✅ Updated `revalidateTag` API with optional durations parameter
- ✅ Turbopack compatibility
- ✅ Async request APIs (`params`, `searchParams`)
- ✅ ISR and fetch caching (traditional cache handler)
- ✅ Playwright e2e tests for caching behavior

**Configuration for Next.js 16:**
```ts
// next.config.ts
const nextConfig = {
  cacheHandler: require.resolve('./cache-handler.mjs'),
  cacheMaxMemorySize: 0,
  cacheComponents: true, // Enable Cache Components
};
```

We aim to keep the package version in sync with major Next.js releases and will introduce breaking changes with appropriate version bumps.

### Swapping from `@neshca/cache-handler`

If you already use `@neshca/cache-handler` the setup is very streamlined and you just need to replace package references. If you're starting fresh please check [the example project](./examples/redis-minimal).

#### Cache handler

**Before:**

```js
// cache-handler.mjs

import { CacheHandler } from "@neshca/cache-handler";

CacheHandler.onCreation(() => {
  // setup
});

export default CacheHandler;
```

**After:**

```js
// cache-handler.mjs

import { CacheHandler } from "@fortedigital/nextjs-cache-handler";

CacheHandler.onCreation(() => {
  // setup
});

export default CacheHandler;
```

---

#### Instrumentation

**Before:**

```js
// instrumentation.ts

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerInitialCache } = await import(
      "@neshca/cache-handler/instrumentation"
    );
    const CacheHandler = (await import("../cache-handler.mjs")).default;
    await registerInitialCache(CacheHandler);
  }
}
```

**After:**

```js
// instrumentation.ts

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerInitialCache } = await import(
      "@fortedigital/nextjs-cache-handler/instrumentation"
    );
    const CacheHandler = (await import("../cache-handler.mjs")).default;
    await registerInitialCache(CacheHandler);
  }
}
```

## Handlers

### `redis-strings`

A Redis-based handler for key- and tag-based caching. Compared to the original implementation, it prevents memory leaks caused by growing shared tag maps by implementing TTL-bound hashmaps.

**Features:**

- Key expiration using `EXAT` or `EXPIREAT`
- Tag-based revalidation
- Automatic TTL management
- Default `revalidateTagQuerySize`: `10_000` (safe for large caches)

```js
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";

const redisHandler = await createRedisHandler({
  client: createClient({
    url: process.env.REDIS_URL,
  }),
  keyPrefix: "myApp:",
  sharedTagsKey: "myTags",
  sharedTagsTtlKey: "myTagTtls",
});
```

#### Redis Cluster (Experimental)

```js
import { createCluster } from "@redis/client";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";
import { withAdapter } from "@fortedigital/nextjs-cache-handler/cluster/adapter";

const { hostname: redisHostName } = new URL(process.env.REDIS_URL);
redis = withAdapter(
  createCluster({
    rootNodes: [{ url: process.env.REDIS_URL }],

    // optional if you use TLS and need to resolve shards' ip to proper hostname
    nodeAddressMap(address) {
      const [_, port] = address.split(":");

      return {
        host: redisHostName,
        port: Number(port),
      };
    },
  })
);

// after using withAdapter you can use redis cluster instance as parameter for createRedisHandler
const redisCacheHandler = createRedisHandler({
  client: redis,
  keyPrefix: CACHE_PREFIX,
});
```

**Note:** Redis Cluster support is currently experimental and may have limitations or unexpected bugs. Use it with caution.

---

### `local-lru`

The local-lru Handler uses a lru-cache ↗ instance as the cache store. It stores the cache in memory and evicts the least recently used entries when the cache reaches its limits. You can use this Handler as a fallback cache when the shared cache is unavailable.

> ⚠️ The local-lru Handler is not suitable for production environments. It is intended for development and testing purposes only.

**Features:**

- Key expiration using `EXAT` or `EXPIREAT`
- Tag-based revalidation
- Automatic TTL management
- Default `revalidateTagQuerySize`: `10_000` (safe for large caches)

```js
import createLruHandler from "@fortedigital/nextjs-cache-handler/local-lru";

const localHandler = createLruHandler({
  maxItemsNumber: 10000,
  maxItemSizeBytes: 1024 * 1024 * 500,
});
```

---

### `composite`

Routes cache operations across multiple underlying handlers.

**Features:**

- Multiple backend support
- Custom routing strategies
- First-available read strategy

```js
import createCompositeHandler from "@fortedigital/nextjs-cache-handler/composite";

const compositeHandler = createCompositeHandler({
  handlers: [handler1, handler2],
  setStrategy: (data) => (data?.tags.includes("handler1") ? 0 : 1),
});
```

### ⚠️ `buffer-string-decorator` | **REMOVED IN 2.0.0!** - integrated into the core package

#### Features:

This cache handler converts buffers from cached route values to strings on save and back to buffers on read.

Next 15 decided to change types of some properties from String to Buffer which conflicts with how data is serialized to redis. It is recommended to use this handler with `redis-strings` in Next 15 as this handler make the following adjustment.

- **Converts `body` `Buffer` to `string`**  
  See: https://github.com/vercel/next.js/blob/f5444a16ec2ef7b82d30048890b613aa3865c1f1/packages/next/src/server/response-cache/types.ts#L97
- **Converts `rscData` `string` to `Buffer`**  
  See: https://github.com/vercel/next.js/blob/f5444a16ec2ef7b82d30048890b613aa3865c1f1/packages/next/src/server/response-cache/types.ts#L76
- **Converts `segmentData` `Record<string, string>` to `Map<string, Buffer>`**  
  See: https://github.com/vercel/next.js/blob/f5444a16ec2ef7b82d30048890b613aa3865c1f1/packages/next/src/server/response-cache/types.ts#L80

```js
import createBufferStringDecoratorHandler from "@fortedigital/nextjs-cache-handler/buffer-string-decorator";

const bufferStringDecorator =
  createBufferStringDecoratorHandler(redisCacheHandler);
```

## Examples

### 2.x.x

#### Full example

[Example project](./examples/redis-minimal)

#### Example `cache-handler.js`.

```js
import { createClient } from "redis";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
import { CacheHandler } from "@fortedigital/nextjs-cache-handler";
import createLruHandler from "@fortedigital/nextjs-cache-handler/local-lru";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";
import createCompositeHandler from "@fortedigital/nextjs-cache-handler/composite";

CacheHandler.onCreation(() => {
  // Important - It's recommended to use global scope to ensure only one Redis connection is made
  // This ensures only one instance get created
  if (global.cacheHandlerConfig) {
    return global.cacheHandlerConfig;
  }

  // Important - It's recommended to use global scope to ensure only one Redis connection is made
  // This ensures new instances are not created in a race condition
  if (global.cacheHandlerConfigPromise) {
    return global.cacheHandlerConfigPromise;
  }

  // You may need to ignore Redis locally, remove this block otherwise
  if (process.env.NODE_ENV === "development") {
    const lruCache = createLruHandler();
    return { handlers: [lruCache] };
  }

  // Main promise initializing the handler
  global.cacheHandlerConfigPromise = (async () => {
    let redisClient = null;

    if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
      const settings = {
        url: process.env.REDIS_URL,
        pingInterval: 10000,
      };

      // This is optional and needed only if you use access keys
      if (process.env.REDIS_ACCESS_KEY) {
        settings.password = process.env.REDIS_ACCESS_KEY;
      }

      try {
        redisClient = createClient(settings);
        redisClient.on("error", (e) => {
          if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
            console.warn("Redis error", e);
          }
          global.cacheHandlerConfig = null;
          global.cacheHandlerConfigPromise = null;
        });
      } catch (error) {
        console.warn("Failed to create Redis client:", error);
      }
    }

    if (redisClient) {
      try {
        console.info("Connecting Redis client...");
        await redisClient.connect();
        console.info("Redis client connected.");
      } catch (error) {
        console.warn("Failed to connect Redis client:", error);
        await redisClient
          .disconnect()
          .catch(() =>
            console.warn(
              "Failed to quit the Redis client after failing to connect."
            )
          );
      }
    }

    const lruCache = createLruHandler();

    if (!redisClient?.isReady) {
      console.error("Failed to initialize caching layer.");
      global.cacheHandlerConfigPromise = null;
      global.cacheHandlerConfig = { handlers: [lruCache] };
      return global.cacheHandlerConfig;
    }

    const redisCacheHandler = createRedisHandler({
      client: redisClient,
      keyPrefix: "nextjs:",
    });

    global.cacheHandlerConfigPromise = null;

    // This example uses composite handler to switch from Redis to LRU cache if tags contains `memory-cache` tag.
    // You can skip composite and use Redis or LRU only.
    global.cacheHandlerConfig = {
      handlers: [
        createCompositeHandler({
          handlers: [lruCache, redisCacheHandler],
          setStrategy: (ctx) => (ctx?.tags.includes("memory-cache") ? 0 : 1), // You can adjust strategy for deciding which cache should the composite use
        }),
      ],
    };

    return global.cacheHandlerConfig;
  })();

  return global.cacheHandlerConfigPromise;
});

export default CacheHandler;
```

### 1.x.x

```js
// @neshca/cache-handler dependencies
import { CacheHandler } from "@neshca/cache-handler";
import createLruHandler from "@neshca/cache-handler/local-lru";

// Next/Redis dependencies
import { createClient } from "redis";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// @fortedigital/nextjs-cache-handler dependencies
import createCompositeHandler from "@fortedigital/nextjs-cache-handler/composite";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";
import createBufferStringHandler from "@fortedigital/nextjs-cache-handler/buffer-string-decorator";
import { Next15CacheHandler } from "@fortedigital/nextjs-cache-handler";

// Usual onCreation from @neshca/cache-handler
CacheHandler.onCreation(() => {
  // Important - It's recommended to use global scope to ensure only one Redis connection is made
  // This ensures only one instance get created
  if (global.cacheHandlerConfig) {
    return global.cacheHandlerConfig;
  }

  // Important - It's recommended to use global scope to ensure only one Redis connection is made
  // This ensures new instances are not created in a race condition
  if (global.cacheHandlerConfigPromise) {
    return global.cacheHandlerConfigPromise;
  }

  // You may need to ignore Redis locally, remove this block otherwise
  if (process.env.NODE_ENV === "development") {
    const lruCache = createLruHandler();
    return { handlers: [lruCache] };
  }

  // Main promise initializing the handler
  global.cacheHandlerConfigPromise = (async () => {
    /** @type {import("redis").RedisClientType | null} */
    let redisClient = null;
    if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
      const settings = {
        url: process.env.REDIS_URL, // Make sure you configure this variable
        pingInterval: 10000,
      };

      // This is optional and needed only if you use access keys
      if (process.env.REDIS_ACCESS_KEY) {
        settings.password = process.env.REDIS_ACCESS_KEY;
      }

      try {
        redisClient = createClient(settings);
        redisClient.on("error", (e) => {
          if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
            console.warn("Redis error", e);
          }
          global.cacheHandlerConfig = null;
          global.cacheHandlerConfigPromise = null;
        });
      } catch (error) {
        console.warn("Failed to create Redis client:", error);
      }
    }

    if (redisClient) {
      try {
        console.info("Connecting Redis client...");
        await redisClient.connect();
        console.info("Redis client connected.");
      } catch (error) {
        console.warn("Failed to connect Redis client:", error);
        await redisClient
          .disconnect()
          .catch(() =>
            console.warn(
              "Failed to quit the Redis client after failing to connect."
            )
          );
      }
    }
    const lruCache = createLruHandler();

    if (!redisClient?.isReady) {
      console.error("Failed to initialize caching layer.");
      global.cacheHandlerConfigPromise = null;
      global.cacheHandlerConfig = { handlers: [lruCache] };
      return global.cacheHandlerConfig;
    }

    const redisCacheHandler = createRedisHandler({
      client: redisClient,
      keyPrefix: "nextjs:",
    });

    global.cacheHandlerConfigPromise = null;

    // This example uses composite handler to switch from Redis to LRU cache if tags contains `memory-cache` tag.
    // You can skip composite and use Redis or LRU only.
    global.cacheHandlerConfig = {
      handlers: [
        createCompositeHandler({
          handlers: [
            lruCache,
            createBufferStringHandler(redisCacheHandler), // Use `createBufferStringHandler` in Next15 and ignore it in Next14 or below
          ],
          setStrategy: (ctx) => (ctx?.tags.includes("memory-cache") ? 0 : 1), // You can adjust strategy for deciding which cache should the composite use
        }),
      ],
    };

    return global.cacheHandlerConfig;
  })();

  return global.cacheHandlerConfigPromise;
});

export default CacheHandler;
```

---

## Reference to Original Package

This project was originally based on [`@neshca/cache-handler`](https://www.npmjs.com/package/@neshca/cache-handler). Versions prior to `2.0.0` wrapped or extended the original. As of `2.0.0`, this project is fully independent and no longer uses or requires `@neshca/cache-handler`.

For context or historical documentation, you may still reference the [original project](https://caching-tools.github.io/next-shared-cache).

---

## License

Licensed under the [MIT License](./LICENSE), consistent with the original `@neshca/cache-handler`.
