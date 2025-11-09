import { NextRequest } from "next/server";

// This API provides cache inspection capabilities for debugging
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") || "status";

  try {
    // Note: This is a debug endpoint and should be protected in production
    // For security, you might want to add authentication or disable in production

    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      action,
      environment: process.env.NODE_ENV,
    };

    switch (action) {
      case "status":
        debugInfo.message = "Cache handler is configured";
        debugInfo.cacheHandler = "Custom Redis/LRU handler";
        debugInfo.cacheComponents = true;
        debugInfo.note = "Use action=keys to see cache keys, action=tags to see tag mappings";
        break;

      case "keys":
        debugInfo.message = "To inspect Redis keys, use redis-cli: KEYS nextjs:*";
        debugInfo.note = "Cache keys are stored in Redis and not directly accessible via API";
        debugInfo.suggestion = "Run: redis-cli KEYS 'nextjs:*' to see all cache keys";
        break;

      case "tags":
        debugInfo.message = "To inspect tag mappings, use redis-cli: HGETALL nextjs:__sharedTags__";
        debugInfo.note = "Tag mappings are stored in Redis hash";
        debugInfo.suggestion = "Run: redis-cli HGETALL nextjs:__sharedTags__";
        break;

      case "env":
        debugInfo.environment = {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PRIVATE_DEBUG_CACHE: process.env.NEXT_PRIVATE_DEBUG_CACHE,
          REDIS_URL: process.env.REDIS_URL ? "configured" : "not configured",
        };
        debugInfo.message = "Environment configuration";
        break;

      default:
        debugInfo.message = "Unknown action";
        debugInfo.availableActions = ["status", "keys", "tags", "env"];
    }

    return Response.json(debugInfo, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to fetch cache debug info",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
