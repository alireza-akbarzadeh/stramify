const { chromium } = require('playwright-core');
const EXE = '/Users/alirezaakbarzadeh/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto('http://localhost:3000/login', { waitUntil: 'load' });
  await p.waitForTimeout(1000);
  const info = await p.evaluate(() => {
    const cards = document.querySelectorAll('article');
    if (!cards.length) return { found: 0 };
    const c = cards[0];
    const r = c.getBoundingClientRect();
    const ring = c.closest('[style*="preserve-3d"]') || c.parentElement.parentElement;
    const rr = ring.getBoundingClientRect();
    return {
      found: cards.length,
      card: { w: r.width, h: r.height, x: Math.round(r.x), y: Math.round(r.y) },
      ring: { w: rr.width, h: rr.height, x: Math.round(rr.x), y: Math.round(rr.y) },
      cardOpacity: getComputedStyle(c).opacity,
      ringOpacity: getComputedStyle(ring).opacity,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})();
