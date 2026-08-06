const { chromium } = require('playwright-core');
const EXE = '/Users/alirezaakbarzadeh/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('http://localhost:3000/zz-discovery-preview', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Live Signals', { timeout: 15000 });
  await page.screenshot({ path: '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/stramify/.scratch/feed.png', fullPage: true });

  await page.click('button[aria-label^="Save"]');
  await page.click('button[aria-label="Play featured highlight"]');
  await page.waitForSelector('text=Ready to stream', { timeout: 5000 });
  await page.screenshot({ path: '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/stramify/.scratch/modal.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  await page.click('button:has-text("Watchlist")');
  await page.waitForSelector('text=Your watchlist', { timeout: 5000 });
  await page.screenshot({ path: '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/stramify/.scratch/watchlist.png', fullPage: true });

  console.log('ERRORS:', JSON.stringify(errors, null, 2));
  await browser.close();
})().catch((err) => { console.error(err); process.exit(1); });
