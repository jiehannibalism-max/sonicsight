import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(__dirname, '../screenshots')
const base = process.env.BASE_URL ?? 'http://localhost:4173'
const sections = ['perception', 'alignment', 'diagnosis', 'training']

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()
await page.goto(base, { waitUntil: 'networkidle' })
for (const id of sections) {
  await page.evaluate((sid) => {
    document.getElementById(sid)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, id)
  await page.waitForTimeout(1400)
  // for diagnosis, click first phoneme to reveal the result
  if (id === 'diagnosis') {
    await page.evaluate(() => {
      const sec = document.getElementById('diagnosis')
      const btn = sec?.querySelector('button')
      btn?.click()
    })
    await page.waitForTimeout(2000)
  }
  await page.screenshot({ path: path.join(out, `sec-${id}.png`) })
  console.log('saved', id)
}
await browser.close()
