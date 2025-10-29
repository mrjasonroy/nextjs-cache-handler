export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerInitialCache } = await import(
      "../../packages/nextjs-cache-handler/dist/instrumentation/instrumentation.js"
    );
    const CacheHandler = (await import("../cache-handler.mjs")).default;
    await registerInitialCache(CacheHandler);
  }
};
