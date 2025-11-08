"use client";

import { useState } from "react";

export default function RevalidatePathPage() {
  const [path, setPath] = useState("/fetch-cache");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRevalidate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/revalidate-path?path=${encodeURIComponent(path)}`);
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
        <h1 className="text-3xl font-bold mb-4">Path Revalidation Example</h1>
        <p className="text-gray-600">
          Test on-demand cache revalidation by path. This triggers
          revalidation for specific pages or layouts.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Revalidate by Path</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-2">
              Path to Revalidate
            </label>
            <input
              id="path"
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter path (e.g., /fetch-cache)"
            />
          </div>

          <button
            onClick={handleRevalidate}
            disabled={loading || !path}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Revalidating..." : "Revalidate Path"}
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
        <h3 className="font-semibold mb-2">Paths Available to Test</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>/fetch-cache:</strong> Fetch cache example</li>
          <li><strong>/ttl-example:</strong> TTL example</li>
          <li><strong>/isr-example/blog/1:</strong> ISR example</li>
          <li><strong>/:</strong> Homepage (revalidates entire route)</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <h3 className="font-semibold mb-2">How to Test</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Visit any example page (e.g., <a href="/fetch-cache" className="text-blue-600 underline">Fetch Cache</a>)</li>
          <li>Note the current timestamp/data</li>
          <li>Come back here and revalidate that path</li>
          <li>Return to the example page</li>
          <li>Refresh - the page should be regenerated with fresh data!</li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Path vs Tag Revalidation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border border-gray-200 rounded p-4">
            <h4 className="font-semibold mb-2">revalidatePath()</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Revalidates specific route/page</li>
              <li>Affects entire page and layout</li>
              <li>Use when you want to update a specific page</li>
              <li>Example: After updating a blog post</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h4 className="font-semibold mb-2">revalidateTag()</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Revalidates by cache tag</li>
              <li>Can affect multiple pages/fetches</li>
              <li>Use when data is shared across pages</li>
              <li>Example: After updating user data</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Code Example</h3>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`// In a Server Action or API Route
import { revalidatePath } from "next/cache";

// Revalidate a specific page
revalidatePath("/blog/post-1");

// Revalidate all blog posts
revalidatePath("/blog/[slug]", "page");

// Revalidate a layout and all nested pages
revalidatePath("/blog", "layout");`}</code>
        </pre>
      </div>
    </div>
  );
}
