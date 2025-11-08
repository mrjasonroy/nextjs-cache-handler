"use cache";

export const metadata = {
  title: '"use cache" Directive Demo',
};

// This component is cached using Next.js 16's "use cache" directive
async function getCachedTime() {
  return new Date().toISOString();
}

export default async function UseCacheDemoPage() {
  const cachedTime = await getCachedTime();
  const pageRenderTime = new Date().toISOString();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">&quot;use cache&quot; Directive Demo</h1>
        <p className="text-gray-600">
          This page demonstrates Next.js 16&apos;s new &quot;use cache&quot; directive for
          component-level caching.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cached Component</h2>
        <div className="space-y-2">
          <p>
            <strong>Cached Time:</strong>{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{cachedTime}</code>
          </p>
          <p>
            <strong>Page Render Time:</strong>{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{pageRenderTime}</code>
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <h3 className="font-semibold mb-2">⚠️ Important Note</h3>
        <p className="text-sm">
          The &quot;use cache&quot; directive is managed by Next.js itself and does NOT use the
          custom cache handler. This is separate from the traditional ISR/fetch caching that
          uses the Redis cache handler.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold mb-2">How &quot;use cache&quot; Works</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Added at the top of a component/function/page file</li>
          <li>Caches the entire component output</li>
          <li>Automatic cache key generation</li>
          <li>Can be used with async components</li>
          <li>Managed by Next.js, not the custom cache handler</li>
        </ul>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Code Example</h3>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`"use cache";

export default async function MyPage() {
  // This entire component is cached
  const data = await fetchData();

  return <div>{data}</div>;
}

// You can also use it on specific functions
async function getCachedData() {
  "use cache";
  return await fetch("https://api.example.com/data");
}`}</code>
        </pre>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Next.js 16 Caching Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">Feature</th>
                <th className="border border-gray-200 px-4 py-2 text-left">&quot;use cache&quot;</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Custom Handler</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-2">Scope</td>
                <td className="border border-gray-200 px-4 py-2">Component/Function</td>
                <td className="border border-gray-200 px-4 py-2">ISR/Fetch/Routes</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">Storage</td>
                <td className="border border-gray-200 px-4 py-2">Next.js managed</td>
                <td className="border border-gray-200 px-4 py-2">Redis/LRU</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">Configuration</td>
                <td className="border border-gray-200 px-4 py-2">Directive only</td>
                <td className="border border-gray-200 px-4 py-2">next.config.ts</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">Revalidation</td>
                <td className="border border-gray-200 px-4 py-2">Time-based</td>
                <td className="border border-gray-200 px-4 py-2">Tags, time, path</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 className="font-semibold mb-2">When to Use What?</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>&quot;use cache&quot;:</strong> For component-level caching, when you want
            Next.js to manage everything automatically
          </li>
          <li>
            <strong>Custom Handler (ISR/Fetch):</strong> For shared cache across instances,
            persistence, tag-based revalidation, and production deployments
          </li>
        </ul>
      </div>
    </div>
  );
}
