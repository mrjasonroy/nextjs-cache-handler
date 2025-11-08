export const metadata = {
  title: "TTL / Expiration Example",
};

async function getCachedData() {
  const response = await fetch("https://api.sampleapis.com/futurama/info", {
    next: {
      revalidate: 30, // 30 second TTL
      tags: ["ttl-example"],
    },
  });
  return response.json();
}

export default async function TTLExamplePage() {
  const timestamp = new Date().toISOString();
  const data = await getCachedData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">TTL / Expiration Example</h1>
        <p className="text-gray-600">
          Demonstrates time-to-live (TTL) and cache expiration behavior.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cached Data</h2>
        <div className="space-y-2">
          <p><strong>Data Count:</strong> {data?.length || 0} items</p>
          <p>
            <strong>Page Rendered At:</strong>{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{timestamp}</code>
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold mb-2">Cache Configuration</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>TTL (revalidate):</strong> 30 seconds</li>
          <li><strong>Stale Age:</strong> 30 seconds (from revalidate)</li>
          <li><strong>Expire Age:</strong> ~45 seconds (staleAge × 1.5 by default)</li>
          <li>After stale age: serves stale data + triggers background revalidation</li>
          <li>After expire age: cache entry is purged</li>
        </ul>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 className="font-semibold mb-2">Test the TTL</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Note the current render timestamp above</li>
          <li>Refresh the page immediately - timestamp stays the same (cached)</li>
          <li>Wait 30+ seconds and refresh - timestamp updates (revalidated)</li>
        </ol>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refresh Page
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">How TTL Works</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>0-30s:</strong> Cache is fresh, serves cached data immediately
          </p>
          <p>
            <strong>30-45s:</strong> Cache is stale, serves stale data + revalidates in background
          </p>
          <p>
            <strong>45s+:</strong> Cache expired, must revalidate before serving
          </p>
        </div>
      </div>
    </div>
  );
}
