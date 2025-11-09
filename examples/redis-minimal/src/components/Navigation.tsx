import Link from "next/link";

export function Navigation() {
  const examples = [
    { href: "/", label: "Home" },
    { href: "/fetch-cache", label: "Fetch Cache" },
    { href: "/isr-example/blog/1", label: "ISR Example" },
    { href: "/static-params-test/cache", label: "Static Params" },
    { href: "/ttl-example", label: "TTL/Expiration" },
    { href: "/revalidate-tag", label: "Tag Revalidation" },
    { href: "/revalidate-path", label: "Path Revalidation" },
    { href: "/use-cache-demo", label: "Use Cache Directive" },
    { href: "/ppr-example", label: "PPR Example" },
    { href: "/cache-debug", label: "🔧 Debug Console" },
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Next.js 16 Cache Handler
            </Link>
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {examples.map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md whitespace-nowrap"
              >
                {example.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
