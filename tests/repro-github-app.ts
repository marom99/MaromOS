import { chromium } from "playwright";

async function repro() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console errors
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      console.log(`[PAGE ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  page.on("response", async (response) => {
    if (response.url().includes("/api/github-contributions")) {
      console.log(`[API RESPONSE] ${response.url()} - Status: ${response.status()}`);
      try {
        const body = await response.json();
        console.log(`[API BODY] ${JSON.stringify(body).slice(0, 200)}...`);
      } catch {
        // ignore
      }
    }
  });

  console.log("Navigating to MaromOS desktop...");
  await page.goto("http://localhost:5174");

  console.log("Waiting for desktop to load...");
  await page.waitForSelector("body", { timeout: 30000 });
  
  // Try to find the GitHub icon anywhere on the page
  console.log("Searching for 'GitHub' text anywhere...");
  const githubLocator = page.locator('text="GitHub"');
  const count = await githubLocator.count();
  console.log(`Found ${count} elements with 'GitHub' text.`);

  if (count > 0) {
    console.log("Clicking the first 'GitHub' element...");
    await githubLocator.first().click({ clickCount: 2 });
  } else {
    console.log("No 'GitHub' text found. Trying to open via Apple Menu -> Applications...");
    const appleMenu = page.locator('img[alt="Apple Menu"]').first();
    if (await appleMenu.isVisible()) {
        await appleMenu.click();
        const moreApps = page.locator('text="More Applications"').first(); // Check translation
        if (await moreApps.isVisible()) {
            await moreApps.click();
        } else {
            // Try English if translation fails
            const moreAppsEng = page.locator('text="More Apps"').first();
            if (await moreAppsEng.isVisible()) {
                await moreAppsEng.click();
            }
        }
    }
    
    // Wait for Finder to open
    await page.waitForTimeout(2000);
    console.log("Searching for GitHub in Finder/Desktop...");
    const githubFinder = page.locator('text="GitHub"').first();
    if (await githubFinder.isVisible()) {
        console.log("GitHub found in Finder/Desktop. Clicking...");
        await githubFinder.click({ clickCount: 2 });
    }
  }

  // Final check
  await page.waitForTimeout(10000);
  await page.screenshot({ path: "repro-final-attempt.png", fullPage: true });
  console.log("Final screenshot saved.");

  await browser.close();
}

repro().catch((e) => {
  console.error("Reproduction script failed:", e);
  process.exit(1);
});
