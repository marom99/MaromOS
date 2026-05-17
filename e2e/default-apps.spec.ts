import { test, expect } from "@playwright/test";

const APP_URL = "http://localhost:5173";

test.describe("default apps — desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("launches Slack and About Me on first boot", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());

    await page.goto(APP_URL);
    await page.waitForTimeout(2000);

    const slackWindows = page.locator('[aria-label*="Slack"]');
    const aboutMeWindows = page.locator('[aria-label*="About Me"]');

    await expect(slackWindows.first()).toBeVisible({ timeout: 5000 });
    await expect(aboutMeWindows.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("default apps — mobile", () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test("launches only Slack on first boot", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());

    await page.goto(APP_URL);
    await page.waitForTimeout(2000);

    const slackWindows = page.locator('[aria-label*="Slack"]');
    const aboutMeWindows = page.locator('[aria-label*="About Me"]');

    await expect(slackWindows.first()).toBeVisible({ timeout: 5000 });
    await expect(aboutMeWindows).toHaveCount(0, { timeout: 3000 });
  });
});
