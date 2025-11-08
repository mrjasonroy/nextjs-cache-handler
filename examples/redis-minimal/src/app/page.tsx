export default function Home() {
  return (
    <div className="prose max-w-none">
      <h1>Next.js 16 Cache Handler Examples</h1>

      <p className="lead text-xl text-gray-600">
        This application demonstrates various caching strategies using{" "}
        <code>@fortedigital/nextjs-cache-handler</code> with Next.js 16.
      </p>

      <h2>Features Demonstrated</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-8">
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Fetch Cache</h3>
          <p className="text-gray-600 mb-4">
            Demonstrates fetch caching with tags and time-based revalidation.
          </p>
          <a href="/fetch-cache" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">ISR (Incremental Static Regeneration)</h3>
          <p className="text-gray-600 mb-4">
            Shows dynamic routes with static generation and revalidation.
          </p>
          <a href="/isr-example/blog/1" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Static Params</h3>
          <p className="text-gray-600 mb-4">
            Demonstrates generateStaticParams with caching.
          </p>
          <a href="/static-params-test/cache" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">TTL/Expiration</h3>
          <p className="text-gray-600 mb-4">
            Shows time-to-live and cache expiration behavior.
          </p>
          <a href="/ttl-example" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Tag Revalidation</h3>
          <p className="text-gray-600 mb-4">
            On-demand revalidation using cache tags.
          </p>
          <a href="/revalidate-tag" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Path Revalidation</h3>
          <p className="text-gray-600 mb-4">
            On-demand revalidation of specific paths.
          </p>
          <a href="/revalidate-path" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">&quot;use cache&quot; Directive</h3>
          <p className="text-gray-600 mb-4">
            Next.js 16&apos;s new &quot;use cache&quot; directive for components.
          </p>
          <a href="/use-cache-demo" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">PPR (Partial Prerendering)</h3>
          <p className="text-gray-600 mb-4">
            Combining static and dynamic content with PPR.
          </p>
          <a href="/ppr-example" className="text-blue-600 hover:underline">
            View Example →
          </a>
        </div>
      </div>

      <h2 className="mt-8">Configuration</h2>

      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{`// next.config.ts
const nextConfig = {
  cacheHandler: require.resolve('./cache-handler.mjs'),
  cacheMaxMemorySize: 0,
  cacheComponents: true, // Next.js 16
};`}</code>
      </pre>

      <h2>Cache Handler Setup</h2>

      <p>
        This example uses a composite cache handler with Redis and LRU (in-memory) caching:
      </p>

      <ul>
        <li><strong>Redis:</strong> Primary cache for production</li>
        <li><strong>LRU:</strong> Fallback for development or when Redis is unavailable</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
        <p className="font-semibold">Note about &quot;use cache&quot;</p>
        <p className="mt-2">
          The new &quot;use cache&quot; directive in Next.js 16 is managed separately by Next.js
          and does not use the custom cache handler. The custom handler works for ISR,
          fetch caching with tags, and route handler responses.
        </p>
      </div>
    </div>
  );
}
