import { createClient } from "redis";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
// Using package exports for proper module resolution
import { CacheHandler } from "@fortedigital/nextjs-cache-handler";
import createLruHandler from "@fortedigital/nextjs-cache-handler/local-lru";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";
import createCompositeHandler from "@fortedigital/nextjs-cache-handler/composite";

const isSingleConnectionModeEnabled = !!process.env.REDIS_SINGLE_CONNECTION;
const isDebugEnabled = process.env.NEXT_PRIVATE_DEBUG_CACHE !== undefined;

// Debug logging helper
function debugLog(operation, data) {
  if (isDebugEnabled) {
    console.log(`[Cache Debug] ${operation}:`, JSON.stringify(data, null, 2));
  }
}

async function setupRedisClient() {
  if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
    try {
      const redisClient = createClient({
        url: process.env.REDIS_URL,
        pingInterval: 10000,
      });

      redisClient.on("error", (e) => {
        if (process.env.NEXT_PRIVATE_DEBUG_CACHE !== undefined) {
          console.warn("Redis error", e);
        }
        if (isSingleConnectionModeEnabled) {
          global.cacheHandlerConfig = null;
          global.cacheHandlerConfigPromise = null;
        }
      });

      console.info("Connecting Redis client...");
      await redisClient.connect();
      console.info("Redis client connected.");

      if (!redisClient.isReady) {
        console.error("Failed to initialize caching layer.");
      }

      return redisClient;
    } catch (error) {
      console.warn("Failed to connect Redis client:", error);
      if (redisClient) {
        try {
          redisClient.destroy();
        } catch (e) {
          console.error(
            "Failed to quit the Redis client after failing to connect.",
            e
          );
        }
      }
    }
  }

  return null;
}

// Logging wrapper for handlers to trace cache operations
function wrapHandlerWithLogging(handler, handlerName) {
  if (!isDebugEnabled) {
    return handler;
  }

  return {
    ...handler,
    get: async (key, ctx) => {
      debugLog(`GET [${handlerName}]`, { key, ctx });
      const result = await handler.get(key, ctx);
      debugLog(`GET Result [${handlerName}]`, { key, found: !!result });
      return result;
    },
    set: async (key, data, ctx) => {
      debugLog(`SET [${handlerName}]`, {
        key,
        tags: ctx?.tags,
        revalidate: ctx?.revalidate,
        dataSize: data ? JSON.stringify(data).length : 0,
      });
      const result = await handler.set(key, data, ctx);
      debugLog(`SET Complete [${handlerName}]`, { key, success: true });
      return result;
    },
    revalidateTag: async (tag, durations) => {
      debugLog(`REVALIDATE TAG [${handlerName}]`, { tag, durations });
      const result = await handler.revalidateTag(tag, durations);
      debugLog(`REVALIDATE TAG Complete [${handlerName}]`, { tag });
      return result;
    },
    delete: async (key) => {
      debugLog(`DELETE [${handlerName}]`, { key });
      const result = await handler.delete(key);
      debugLog(`DELETE Complete [${handlerName}]`, { key });
      return result;
    },
  };
}

async function createCacheConfig() {
  const redisClient = await setupRedisClient();
  let lruCache = createLruHandler();

  if (isDebugEnabled) {
    console.log("[Cache Debug] Debug logging enabled via NEXT_PRIVATE_DEBUG_CACHE");
    lruCache = wrapHandlerWithLogging(lruCache, "LRU");
  }

  if (!redisClient) {
    const config = { handlers: [lruCache] };
    if (isSingleConnectionModeEnabled) {
      global.cacheHandlerConfigPromise = null;
      global.cacheHandlerConfig = config;
    }
    debugLog("Cache Config", { type: "LRU only", redisConnected: false });
    return config;
  }

  let redisCacheHandler = createRedisHandler({
    client: redisClient,
    keyPrefix: "nextjs:",
  });

  if (isDebugEnabled) {
    redisCacheHandler = wrapHandlerWithLogging(redisCacheHandler, "Redis");
  }

  const config = {
    handlers: [
      createCompositeHandler({
        handlers: [lruCache, redisCacheHandler],
        setStrategy: (ctx) => {
          const useMemory = ctx?.tags.includes("memory-cache");
          debugLog("Set Strategy", {
            tags: ctx?.tags,
            useMemory,
            selectedHandler: useMemory ? "LRU" : "Redis"
          });
          return useMemory ? 0 : 1;
        },
      }),
    ],
  };

  if (isSingleConnectionModeEnabled) {
    global.cacheHandlerConfigPromise = null;
    global.cacheHandlerConfig = config;
  }

  debugLog("Cache Config", { type: "Composite (LRU + Redis)", redisConnected: true });
  return config;
}

CacheHandler.onCreation(() => {
  if (isSingleConnectionModeEnabled) {
    if (global.cacheHandlerConfig) {
      return global.cacheHandlerConfig;
    }
    if (global.cacheHandlerConfigPromise) {
      return global.cacheHandlerConfigPromise;
    }
  }

  const promise = createCacheConfig();
  if (isSingleConnectionModeEnabled) {
    global.cacheHandlerConfigPromise = promise;
  }
  return promise;
});

export default CacheHandler;
