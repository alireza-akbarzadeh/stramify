const { chromium } = require('playwright-core');
const EXE = '/Users/alirezaakbarzadeh/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // Pricing toggle
  const toggle = page.getByRole('switch');
  await toggle.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const before = await page.locator('text=/^\\$19$/').count();
  await toggle.click();
  await page.waitForTimeout(400);
  const after15 = await page.locator('text=/^\\$15$/').count();
  console.log(`pricing toggle: $19 before=${before}, $15 after=${after15}, aria-checked=${await toggle.getAttribute('aria-checked')}`);

  // FAQ accordion
  const firstQ = page.getByRole('button', { name: /What do I need to start streaming/i });
  await firstQ.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  console.log('faq expanded before:', await firstQ.getAttribute('aria-expanded'));
  await firstQ.click();
  await page.waitForTimeout(500);
  console.log('faq expanded after :', await firstQ.getAttribute('aria-expanded'));

  // Theme toggle
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const themeBtn = page.getByRole('button', { name: /Switch to (light|dark) theme/i }).first();
  console.log('html class before:', await page.evaluate(() => document.documentElement.className));
  await themeBtn.click();
  await page.waitForTimeout(600);
  console.log('html class after :', await page.evaluate(() => document.documentElement.className));
  await page.screenshot({ path: '/tmp/light-hero.png', timeout: 60000 });

  await browser.close();
  console.log(errs.length ? errs.join('\n') : 'no page errors');
})();
