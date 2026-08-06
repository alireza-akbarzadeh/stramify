const { chromium } = require('playwright-core');
const EXE = '/Users/alirezaakbarzadeh/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
(async () => {
  const [url, prefix, theme] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  if (theme === 'light') {
    await page.evaluate(() => localStorage.setItem('nuxt-color-mode', 'light'));
    await page.reload({ waitUntil: 'load' });
  }
  await page.waitForTimeout(800);
  const total = await page.evaluate(() => document.body.scrollHeight);
  const shots = Math.min(Math.ceil(total / 1000), 9);
  for (let i = 0; i < shots; i++) {
    await page.evaluate(y => window.scrollTo(0, y), i * 1000);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${prefix}-${i}.png`, timeout: 60000 });
  }
  await browser.close();
  console.log(`captured ${shots} frames, page height ${total}`);
})();
