// Screenshot helper for SonicSight UI review.
// Usage: node scripts/screenshot.mjs <route> <name> [--full] [--audience=parent|teacher|child]
// Captures desktop (1440x900) + mobile (390x844) PNGs into screenshots/.
// Requires the dev server running at http://localhost:5173.

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
mkdirSync(outDir, { recursive: true })

const args = process.argv.slice(2)
const route = args[0] ?? '/'
const name = args[1] ?? 'page'
const fullPage = args.includes('--full')
const dark = args.includes('--dark')
const baseURL = process.env.BASE_URL ?? 'http://localhost:5173'

const viewports = [
  { label: 'desktop', width: 1440, height: 900, dpr: 2 },
  { label: 'mobile', width: 390, height: 844, dpr: 3 },
]

const browser = await chromium.launch()
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
      colorScheme: dark ? 'dark' : 'light',
    })
    const page = await ctx.newPage()
    await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
    // give framer-motion entrance animations time to settle
    await page.waitForTimeout(1200)
    const file = path.join(outDir, `${name}-${vp.label}.png`)
    await page.screenshot({ path: file, fullPage })
    console.log(`saved ${file}`)
    await ctx.close()
  }
} finally {
  await browser.close()
}
