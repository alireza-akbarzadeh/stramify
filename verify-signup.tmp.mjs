import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => consoleErrors.push(String(err)))

// 1. Signup flow
await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' })
await page.fill('#name', 'Browser Test')
const uniqueEmail = `browser-test-${Date.now()}@example.com`
await page.fill('#email', uniqueEmail)
await page.fill('#password', 'Aa.13741995')
await page.screenshot({ path: '/private/tmp/claude-501/-Users-alirezaakbarzadeh-workshop-github-com-alireza-akbarzadeh-src-stramify/664aa51a-1c99-4518-983a-51d29a2f1188/scratchpad/01-signup-filled.png' })
await Promise.all([
  page.waitForURL('http://localhost:3000/', { timeout: 10000 }).catch(() => null),
  page.click('button[type="submit"]')
])
await page.waitForTimeout(1000)
const urlAfterSignup = page.url()
await page.screenshot({ path: '/private/tmp/claude-501/-Users-alirezaakbarzadeh-workshop-github-com-alireza-akbarzadeh-src-stramify/664aa51a-1c99-4518-983a-51d29a2f1188/scratchpad/02-after-signup.png' })

// 2. Login flow with wrong password — check toast
await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' })
await page.fill('#email', uniqueEmail)
await page.fill('#password', 'WrongPassword123')
await page.click('button[type="submit"]')
await page.waitForTimeout(1500)
await page.screenshot({ path: '/private/tmp/claude-501/-Users-alirezaakbarzadeh-workshop-github-com-alireza-akbarzadeh-src-stramify/664aa51a-1c99-4518-983a-51d29a2f1188/scratchpad/03-login-error-toast.png' })

const toastVisible = await page.locator('[data-sonner-toast]').count()
const alertVisible = await page.locator('[role="alert"]').count()

console.log(JSON.stringify({
  urlAfterSignup,
  signupSucceeded: urlAfterSignup === 'http://localhost:3000/',
  toastCount: toastVisible,
  alertCount: alertVisible,
  consoleErrors
}, null, 2))

await browser.close()
