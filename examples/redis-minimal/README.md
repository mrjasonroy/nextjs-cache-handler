# Next.js 16 Cache Handler - Examples

This example application demonstrates comprehensive caching strategies using `@fortedigital/nextjs-cache-handler` with Next.js 16.

## Features

This example showcases:

- ✅ **Fetch Caching** - HTTP fetch with tags and time-based revalidation
- ✅ **ISR** (Incremental Static Regeneration) - Dynamic routes with caching
- ✅ **TTL/Expiration** - Time-to-live and cache expiration behavior
- ✅ **Tag Revalidation** - On-demand revalidation by cache tags
- ✅ **Path Revalidation** - On-demand revalidation by route paths
- ✅ **"use cache" Directive** - Next.js 16's component-level caching
- ✅ **PPR** (Partial Prerendering) - Mixed static/dynamic content
- ✅ **Static Params** - `generateStaticParams` with caching
- ✅ **Comprehensive Tests** - Playwright e2e tests for all features

## Getting Started

### Prerequisites

- Node.js 22+
- Redis server (optional, falls back to LRU)

### Installation

\`\`\`bash
npm install
\`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the examples.

### Running Tests

\`\`\`bash
# Run all e2e tests
npm run test:e2e

# Run tests in UI mode
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed
\`\`\`

## Learn More

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [@fortedigital/nextjs-cache-handler](https://github.com/fortedigital/nextjs-cache-handler)
- [Playwright Testing](https://playwright.dev/)

See EXAMPLES_TODO.md for implementation checklist.
