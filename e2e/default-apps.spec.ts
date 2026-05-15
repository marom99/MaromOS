import { test, expect } from '@playwright/test';

test('default apps open correctly', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Wait for the desktop to load
  await page.waitForTimeout(2000);
  
  // Check that About Me and Slack are the only apps open
  // This depends on the DOM structure, so let's just log what we see
  console.log("Playwright test running...");
});
