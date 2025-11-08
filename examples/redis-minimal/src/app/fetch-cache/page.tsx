export const metadata = {
  title: "Fetch Cache Example",
};

export default async function FetchCachePage() {
  const timestamp = new Date().toISOString();

  try {
    const characterResponse = await fetch(
      "https://api.sampleapis.com/futurama/characters/1",
      {
        next: {
          revalidate: 60, // Revalidate every 60 seconds
          tags: ["futurama", "character-1"],
        },
      }
    );

    const character = await characterResponse.json();
    const name = character.name?.first || "Unknown";

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Fetch Cache Example</h1>
          <p className="text-gray-600">
            This page demonstrates fetch caching with tags and time-based revalidation.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Cached Data</h2>
          <div className="space-y-2">
            <p><strong>Character Name:</strong> {name}</p>
            <p><strong>Page Rendered At:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{timestamp}</code></p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h3 className="font-semibold mb-2">Caching Configuration</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Revalidate:</strong> 60 seconds</li>
            <li><strong>Tags:</strong> futurama, character-1</li>
            <li>The fetch is cached by the custom cache handler</li>
            <li>Cached in Redis (primary) or LRU (fallback)</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <h3 className="font-semibold mb-2">Test Revalidation</h3>
          <p className="text-sm mb-3">
            Trigger on-demand revalidation by tag:
          </p>
          <a
            href="/api/revalidate-tag?tag=futurama"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Revalidate &quot;futurama&quot; Tag
          </a>
        </div>

        <div>
          <h3 className="font-semibold mb-2">How It Works</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>First request fetches from API and caches the result</li>
            <li>Subsequent requests return cached data (fast!)</li>
            <li>After 60 seconds, cache becomes stale</li>
            <li>Next request triggers background revalidation</li>
            <li>Or manually revalidate using tags via the API button above</li>
          </ol>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching character data:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-4">Fetch Cache Example</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="font-semibold">Error fetching data</p>
          <p className="text-sm mt-2">
            Could not fetch character data. This might be due to network issues.
          </p>
        </div>
      </div>
    );
  }
}
