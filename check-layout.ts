import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:5173');
    
    // Wait for the desktop to load
    await page.waitForTimeout(5000);
    
    const slackEl = await page.locator('text=Marom\'s Workspace').first();
    const aboutMeEl = await page.locator('text=About Me').first();
    
    // Get the closest absolute positioned window wrapper
    // In ryOS, windows are usually div elements with absolute positioning.
    const slackWindow = page.locator('div').filter({ has: slackEl }).filter({ hasText: 'Marom\'s Workspace' }).locator('xpath=./ancestor-or-self::div[contains(@style, "position: absolute") or contains(@class, "absolute")]').first();
    const aboutMeWindow = page.locator('div').filter({ has: aboutMeEl }).filter({ hasText: 'About Me' }).locator('xpath=./ancestor-or-self::div[contains(@style, "position: absolute") or contains(@class, "absolute")]').first();

    const slackBox = await slackWindow.boundingBox();
    const aboutMeBox = await aboutMeWindow.boundingBox();

    console.log(`Slack Window: x=${slackBox?.x}, y=${slackBox?.y}, width=${slackBox?.width}, height=${slackBox?.height}`);
    console.log(`About Me Window: x=${aboutMeBox?.x}, y=${aboutMeBox?.y}, width=${aboutMeBox?.width}, height=${aboutMeBox?.height}`);
    
    if (aboutMeBox && slackBox) {
        console.log(`Gap between About Me and Slack: ${slackBox.x - (aboutMeBox.x + aboutMeBox.width)}px`);
        console.log(`Right margin for Slack: ${1440 - (slackBox.x + slackBox.width)}px`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();