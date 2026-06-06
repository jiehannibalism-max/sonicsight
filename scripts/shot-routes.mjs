import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(__dirname, '../screenshots')
const base = process.env.BASE_URL ?? 'http://localhost:4180'

const routes = [
  { hash: '/', name: 'r-home' },
  { hash: '/perception', name: 'r-perception' },
  { hash: '/alignment', name: 'r-alignment' },
  { hash: '/diagnosis', name: 'r-diagnosis', click: '#diagnosis button' },
  { hash: '/studio', name: 'r-studio', click: 'button:has-text("运行完整流程")' },
  { hash: '/courses', name: 'r-courses' },
  { hash: '/about', name: 'r-about' },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
for (const r of routes) {
  await page.goto(`${base}/#${r.hash}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  if (r.click) {
    try {
      await page.click(r.click, { timeout: 2000 })
      await page.waitForTimeout(r.name === 'r-studio' ? 3800 : 2200)
    } catch (e) {
      console.log('click skip', r.name, e.message)
    }
  }
  await page.screenshot({ path: path.join(out, `${r.name}.png`) })
  console.log('saved', r.name)
}
await browser.close()
