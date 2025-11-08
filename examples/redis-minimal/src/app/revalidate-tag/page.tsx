"use client";

import { useState } from "react";

export default function RevalidateTagPage() {
  const [tag, setTag] = useState("futurama");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRevalidate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/revalidate-tag?tag=${encodeURIComponent(tag)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to revalidate" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Tag Revalidation Example</h1>
        <p className="text-gray-600">
          Test on-demand cache revalidation using cache tags. This triggers
          revalidation for all cached entries with the specified tag.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Revalidate by Tag</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
              Cache Tag
            </label>
            <input
              id="tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter cache tag (e.g., futurama)"
            />
          </div>

          <button
            onClick={handleRevalidate}
            disabled={loading || !tag}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Revalidating..." : "Revalidate Tag"}
          </button>

          {result && (
            <div className={`p-4 rounded-md ${result.error ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
              <h3 className="font-semibold mb-2">
                {result.error ? "Error" : "Success"}
              </h3>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold mb-2">Available Tags to Test</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>futurama:</strong> Used in fetch-cache example</li>
          <li><strong>character-1:</strong> Used in fetch-cache example</li>
          <li><strong>ttl-example:</strong> Used in TTL example</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <h3 className="font-semibold mb-2">How to Test</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Visit the <a href="/fetch-cache" className="text-blue-600 underline">Fetch Cache example</a> first</li>
          <li>Note the character name and timestamp</li>
          <li>Come back here and revalidate the "futurama" tag</li>
          <li>Return to the Fetch Cache example</li>
          <li>Refresh - you should see the data has been revalidated!</li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold mb-2">What Happens When You Revalidate</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>All cache entries with the specified tag are marked as stale</li>
          <li>Next request for those entries will trigger revalidation</li>
          <li>Fresh data is fetched and cached</li>
          <li>Works across all pages and API routes using that tag</li>
        </ul>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Code Example</h3>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`// In your page or API route
await fetch("https://api.example.com/data", {
  next: {
    tags: ["my-tag"], // Add tags here
    revalidate: 3600
  }
});

// Later, trigger revalidation
import { revalidateTag } from "next/cache";
revalidateTag("my-tag");`}</code>
        </pre>
      </div>
    </div>
  );
}
