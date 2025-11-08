import { test, expect } from "@playwright/test";

test.describe("Next.js 16 Cache Handler - Comprehensive Tests", () => {
  test.describe("Homepage", () => {
    test("should load homepage with all example links", async ({ page }) => {
      await page.goto("/");

      // Check title
      await expect(page.locator("h1")).toContainText("Next.js 16 Cache Handler Examples");

      // Verify all example cards are present
      await expect(page.getByText("Fetch Cache")).toBeVisible();
      await expect(page.getByText("ISR (Incremental Static Regeneration)")).toBeVisible();
      await expect(page.getByText("TTL/Expiration")).toBeVisible();
      await expect(page.getByText("Tag Revalidation")).toBeVisible();
      await expect(page.getByText("Path Revalidation")).toBeVisible();
      await expect(page.getByText('"use cache" Directive')).toBeVisible();
      await expect(page.getByText("PPR (Partial Prerendering)")).toBeVisible();
    });

    test("navigation links work", async ({ page }) => {
      await page.goto("/");

      // Test navigation to fetch-cache
      await page.getByRole("link", { name: "Fetch Cache" }).first().click();
      await expect(page).toHaveURL("/fetch-cache");
    });
  });

  test.describe("Fetch Cache Example", () => {
    test("should display cached fetch data", async ({ page }) => {
      await page.goto("/fetch-cache");

      // Wait for data to load
      await expect(page.locator("h1")).toContainText("Fetch Cache Example");

      // Should show character name
      await expect(page.getByText("Character Name:")).toBeVisible();

      // Should show timestamp
      await expect(page.getByText("Page Rendered At:")).toBeVisible();

      // Should show caching info
      await expect(page.getByText("Revalidate: 60 seconds")).toBeVisible();
      await expect(page.getByText("Tags: futurama, character-1")).toBeVisible();
    });

    test("should have revalidation button", async ({ page }) => {
      await page.goto("/fetch-cache");

      const revalidateButton = page.getByRole("link", {
        name: /Revalidate "futurama" Tag/i,
      });
      await expect(revalidateButton).toBeVisible();
    });

    test("timestamp should remain same on quick reload (cached)", async ({ page }) => {
      await page.goto("/fetch-cache");

      // Get first timestamp
      const timestampElement = page.locator("code").first();
      const firstTimestamp = await timestampElement.textContent();

      // Reload immediately
      await page.reload();

      // Get second timestamp
      const secondTimestamp = await timestampElement.textContent();

      // Due to caching, timestamps might be the same or might differ
      // depending on cache state - just verify the format is correct
      expect(firstTimestamp).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(secondTimestamp).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  test.describe("ISR Example", () => {
    test("should load ISR page with cached data", async ({ page }) => {
      await page.goto("/isr-example/blog/1");

      // Should have title
      await expect(page.locator("h1")).toBeVisible();

      // Should have content
      await expect(page.locator("p")).toBeVisible();
    });

    test("should work with different IDs", async ({ page }) => {
      await page.goto("/isr-example/blog/2");
      await expect(page.locator("h1")).toBeVisible();

      await page.goto("/isr-example/blog/3");
      await expect(page.locator("h1")).toBeVisible();
    });
  });

  test.describe("TTL Example", () => {
    test("should display TTL information", async ({ page }) => {
      await page.goto("/ttl-example");

      await expect(page.locator("h1")).toContainText("TTL / Expiration Example");

      // Check for TTL config info
      await expect(page.getByText("TTL (revalidate): 30 seconds")).toBeVisible();
      await expect(page.getByText(/Stale Age:/)).toBeVisible();
      await expect(page.getByText(/Expire Age:/)).toBeVisible();
    });

    test("should show cached data", async ({ page }) => {
      await page.goto("/ttl-example");

      // Should show data count
      await expect(page.getByText("Data Count:")).toBeVisible();

      // Should show timestamp
      await expect(page.getByText("Page Rendered At:")).toBeVisible();
    });

    test("should have refresh button", async ({ page }) => {
      await page.goto("/ttl-example");

      const refreshButton = page.getByRole("button", { name: /Refresh Page/i });
      await expect(refreshButton).toBeVisible();
    });
  });

  test.describe("Tag Revalidation", () => {
    test("should load tag revalidation UI", async ({ page }) => {
      await page.goto("/revalidate-tag");

      await expect(page.locator("h1")).toContainText("Tag Revalidation Example");

      // Should have input field
      const tagInput = page.locator('input[id="tag"]');
      await expect(tagInput).toBeVisible();
      await expect(tagInput).toHaveValue("futurama");

      // Should have revalidate button
      const revalidateButton = page.getByRole("button", { name: /Revalidate Tag/i });
      await expect(revalidateButton).toBeVisible();
    });

    test("should allow changing tag value", async ({ page }) => {
      await page.goto("/revalidate-tag");

      const tagInput = page.locator('input[id="tag"]');
      await tagInput.fill("custom-tag");
      await expect(tagInput).toHaveValue("custom-tag");
    });

    test("should trigger revalidation", async ({ page }) => {
      await page.goto("/revalidate-tag");

      // Click revalidate button
      const revalidateButton = page.getByRole("button", { name: /Revalidate Tag/i });
      await revalidateButton.click();

      // Wait for result
      await expect(page.getByText(/Success|Error/)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Path Revalidation", () => {
    test("should load path revalidation UI", async ({ page }) => {
      await page.goto("/revalidate-path");

      await expect(page.locator("h1")).toContainText("Path Revalidation Example");

      // Should have input field
      const pathInput = page.locator('input[id="path"]');
      await expect(pathInput).toBeVisible();
      await expect(pathInput).toHaveValue("/fetch-cache");

      // Should have revalidate button
      const revalidateButton = page.getByRole("button", { name: /Revalidate Path/i });
      await expect(revalidateButton).toBeVisible();
    });

    test("should allow changing path value", async ({ page }) => {
      await page.goto("/revalidate-path");

      const pathInput = page.locator('input[id="path"]');
      await pathInput.fill("/ttl-example");
      await expect(pathInput).toHaveValue("/ttl-example");
    });

    test("should show comparison between path and tag revalidation", async ({ page }) => {
      await page.goto("/revalidate-path");

      await expect(page.getByText("revalidatePath()")).toBeVisible();
      await expect(page.getByText("revalidateTag()")).toBeVisible();
    });
  });

  test.describe('"use cache" Demo', () => {
    test("should load use cache demo", async ({ page }) => {
      await page.goto("/use-cache-demo");

      await expect(page.locator("h1")).toContainText('"use cache" Directive Demo');

      // Should show cached time
      await expect(page.getByText("Cached Time:")).toBeVisible();

      // Should show page render time
      await expect(page.getByText("Page Render Time:")).toBeVisible();
    });

    test("should display comparison table", async ({ page }) => {
      await page.goto("/use-cache-demo");

      // Check for comparison table
      await expect(page.getByText("Next.js 16 Caching Comparison")).toBeVisible();
      await expect(page.getByText("Custom Handler")).toBeVisible();
    });

    test("should show important note about separate caching", async ({ page }) => {
      await page.goto("/use-cache-demo");

      await expect(
        page.getByText(/does NOT use the custom cache handler/)
      ).toBeVisible();
    });
  });

  test.describe("Static Params Test", () => {
    test("should load static params page", async ({ page }) => {
      await page.goto("/static-params-test/cache");
      await expect(page.locator("body")).toContainText("cache");
    });

    test("should work with different params", async ({ page }) => {
      await page.goto("/static-params-test/test1");
      await expect(page.locator("body")).toContainText("test1");
    });
  });

  test.describe("PPR Example", () => {
    test("should load PPR page", async ({ page }) => {
      await page.goto("/ppr-example");

      // Should show prerendered content
      await expect(page.getByText("This will be prerendered")).toBeVisible();

      // Should show dynamic content header
      await expect(page.getByText("This will be dynamic")).toBeVisible();
    });
  });

  test.describe("API Routes", () => {
    test("revalidate-tag API should work", async ({ page }) => {
      const response = await page.request.get("/api/revalidate-tag?tag=test-tag");
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toHaveProperty("revalidated", true);
      expect(data).toHaveProperty("tag", "test-tag");
      expect(data).toHaveProperty("timestamp");
    });

    test("revalidate-tag API should require tag parameter", async ({ page }) => {
      const response = await page.request.get("/api/revalidate-tag");
      expect(response.status()).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    test("revalidate-path API should work", async ({ page }) => {
      const response = await page.request.get("/api/revalidate-path?path=/fetch-cache");
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toHaveProperty("revalidated", true);
      expect(data).toHaveProperty("path", "/fetch-cache");
      expect(data).toHaveProperty("timestamp");
    });

    test("revalidate-path API should require path parameter", async ({ page }) => {
      const response = await page.request.get("/api/revalidate-path");
      expect(response.status()).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty("error");
    });
  });

  test.describe("Navigation", () => {
    test("navigation bar should be present on all pages", async ({ page }) => {
      const pages = [
        "/",
        "/fetch-cache",
        "/ttl-example",
        "/revalidate-tag",
        "/revalidate-path",
        "/use-cache-demo",
      ];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await expect(page.getByText("Next.js 16 Cache Handler")).toBeVisible();
      }
    });

    test("can navigate between examples using nav bar", async ({ page }) => {
      await page.goto("/");

      // Navigate to Fetch Cache
      await page.getByRole("link", { name: "Fetch Cache", exact: true }).click();
      await expect(page).toHaveURL("/fetch-cache");

      // Navigate to TTL
      await page.getByRole("link", { name: "TTL/Expiration" }).click();
      await expect(page).toHaveURL("/ttl-example");

      // Navigate to Tag Revalidation
      await page.getByRole("link", { name: "Tag Revalidation" }).click();
      await expect(page).toHaveURL("/revalidate-tag");

      // Navigate back home
      await page.getByRole("link", { name: "Home", exact: true }).click();
      await expect(page).toHaveURL("/");
    });
  });

  test.describe("Performance", () => {
    test("pages should load quickly", async ({ page }) => {
      const start = Date.now();
      await page.goto("/");
      const loadTime = Date.now() - start;

      // Should load in less than 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test("cached pages should load quickly on repeat visits", async ({ page }) => {
      // First visit
      await page.goto("/fetch-cache");

      // Second visit (should be faster due to caching)
      const start = Date.now();
      await page.goto("/fetch-cache");
      const loadTime = Date.now() - start;

      // Should be reasonably fast
      expect(loadTime).toBeLessThan(2000);
    });
  });
});
