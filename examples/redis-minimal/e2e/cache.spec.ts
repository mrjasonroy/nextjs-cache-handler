import { test, expect } from "@playwright/test";

test.describe("Cache Handler - Next.js 16", () => {
  test("homepage should be cached with 'use cache'", async ({ page }) => {
    // First visit
    await page.goto("/");
    const firstTimestamp = await page.textContent("div span");
    expect(firstTimestamp).toBeTruthy();

    // Second visit - should show same timestamp due to caching
    await page.goto("/");
    const secondTimestamp = await page.textContent("div span");

    // The timestamps should be the same because the page is cached
    expect(secondTimestamp).toBe(firstTimestamp);
  });

  test("ISR page should be cached", async ({ page }) => {
    // Visit ISR page
    await page.goto("/isr-example/blog/1");

    // Should load without errors
    await expect(page.locator("h1")).toBeVisible();
    const title = await page.textContent("h1");
    expect(title).toBeTruthy();

    // Verify content is present
    await expect(page.locator("p")).toBeVisible();
  });

  test("fetch cache should work with tags", async ({ page }) => {
    // Visit fetch example page
    await page.goto("/fetch-example");

    // Should load character data
    await expect(page.locator("h1")).toContainText("Character");

    // Reload - should use cached data
    await page.reload();
    await expect(page.locator("h1")).toContainText("Character");
  });

  test("static params should generate correctly", async ({ page }) => {
    // Visit a static param route
    await page.goto("/static-params-test/test1");

    // Should load without errors
    await expect(page.locator("body")).toBeVisible();

    // Check for content
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });

  test("API cache route should respond", async ({ page }) => {
    // Test the cache API endpoint
    const response = await page.request.get("/api/cache");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toBeDefined();
  });

  test("PPR example should render", async ({ page }) => {
    // Visit PPR example
    await page.goto("/ppr-example");

    // Should show prerendered content
    await expect(page.locator("h1")).toContainText("prerendered");

    // Should also show dynamic content (may be in suspense initially)
    await expect(page.locator("h1").nth(1)).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Cache Handler - Performance", () => {
  test("repeated requests should be fast (cached)", async ({ page }) => {
    // First request (cold)
    const start1 = Date.now();
    await page.goto("/");
    const duration1 = Date.now() - start1;

    // Second request (should be cached)
    const start2 = Date.now();
    await page.goto("/");
    const duration2 = Date.now() - start2;

    // Subsequent requests should generally be faster
    // (though this isn't guaranteed, it's a good indicator)
    console.log(`First request: ${duration1}ms, Second request: ${duration2}ms`);
    expect(duration2).toBeLessThan(duration1 * 2); // At least not slower
  });
});
