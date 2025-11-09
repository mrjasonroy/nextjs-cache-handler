"use client";

import { useState } from "react";

export default function CacheDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState("status");

  const fetchDebugInfo = async (action: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cache-debug?action=${action}`);
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({ error: "Failed to fetch debug info" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Cache Debug Console</h1>
        <p className="text-gray-600">
          Debugging tools for inspecting cache behavior and tag persistence.
        </p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <h3 className="font-semibold mb-2">⚠️ Debug Mode Only</h3>
        <p className="text-sm">
          This page is for debugging cache behavior. In production, this should be
          protected or disabled.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cache Inspector</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Action:
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="status">Cache Status</option>
              <option value="keys">Cache Keys</option>
              <option value="tags">Tag Mappings</option>
              <option value="env">Environment</option>
            </select>
          </div>

          <button
            onClick={() => fetchDebugInfo(selectedAction)}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Inspect Cache"}
          </button>
        </div>

        {debugInfo && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tag Persistence Testing</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Test Flow:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Visit the <a href="/fetch-cache" className="text-blue-600 underline">Fetch Cache page</a> - note the timestamp</li>
              <li>Check Redis for tags: <code className="bg-gray-200 px-1">redis-cli HGETALL nextjs:__sharedTags__</code></li>
              <li>Trigger revalidation: <a href="/api/revalidate-tag?tag=futurama" className="text-blue-600 underline">Revalidate "futurama" tag</a></li>
              <li>Revisit the <a href="/fetch-cache" className="text-blue-600 underline">Fetch Cache page</a> - verify timestamp changed</li>
              <li>Check Redis again to verify tag was processed</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Expected Behavior:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Tags should be stored in Redis under <code className="bg-gray-200 px-1">nextjs:__sharedTags__</code></li>
              <li>Each tag maps to cache keys that should be invalidated</li>
              <li>After revalidation, the cached data should refresh on next request</li>
              <li>The timestamp should change after revalidation</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Known Issue (PR #109):</h3>
            <p className="text-sm mb-2">
              <strong>Tags may not persist in development mode</strong>
            </p>
            <p className="text-sm">
              If the timestamp doesn't change after revalidation, tags might not be
              saving correctly. Test in production mode to compare behavior.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Redis CLI Commands</h2>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm mb-1">List all cache keys:</h3>
            <code className="block bg-gray-900 text-green-400 p-2 rounded text-sm">
              redis-cli KEYS "nextjs:*"
            </code>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-1">Inspect tag mappings:</h3>
            <code className="block bg-gray-900 text-green-400 p-2 rounded text-sm">
              redis-cli HGETALL nextjs:__sharedTags__
            </code>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-1">Get specific cache key:</h3>
            <code className="block bg-gray-900 text-green-400 p-2 rounded text-sm">
              redis-cli GET "nextjs:your-key-here"
            </code>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-1">Monitor all Redis commands in real-time:</h3>
            <code className="block bg-gray-900 text-green-400 p-2 rounded text-sm">
              redis-cli monitor
            </code>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-1">Enable Next.js cache debug logging:</h3>
            <code className="block bg-gray-900 text-green-400 p-2 rounded text-sm">
              NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
            </code>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="/fetch-cache"
            className="block p-3 border border-gray-200 rounded hover:bg-gray-50"
          >
            <div className="font-semibold">Fetch Cache Example</div>
            <div className="text-sm text-gray-600">Test tagged fetch caching</div>
          </a>
          <a
            href="/api/revalidate-tag?tag=futurama"
            className="block p-3 border border-gray-200 rounded hover:bg-gray-50"
          >
            <div className="font-semibold">Revalidate "futurama" Tag</div>
            <div className="text-sm text-gray-600">Trigger tag revalidation</div>
          </a>
          <a
            href="/ttl-example"
            className="block p-3 border border-gray-200 rounded hover:bg-gray-50"
          >
            <div className="font-semibold">TTL Example</div>
            <div className="text-sm text-gray-600">Test time-based expiration</div>
          </a>
          <a
            href="/revalidate-tag"
            className="block p-3 border border-gray-200 rounded hover:bg-gray-50"
          >
            <div className="font-semibold">Tag Revalidation UI</div>
            <div className="text-sm text-gray-600">Interactive tag revalidation</div>
          </a>
        </div>
      </div>
    </div>
  );
}
