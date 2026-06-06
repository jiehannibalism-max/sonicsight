// Clicks through the /evaluate 3-step flow and screenshots each step.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
mkdirSync(outDir, { recursive: true })
const baseURL = process.env.BASE_URL ?? 'http://localhost:5173'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()

await page.goto(`${baseURL}/evaluate`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: path.join(outDir, 'flow-1-phoneme.png') })
console.log('flow-1-phoneme')

// pick phoneme -> next
await page.getByText('mā', { exact: true }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: '下一步' }).click()
await page.waitForTimeout(700)
await page.screenshot({ path: path.join(outDir, 'flow-2-audience.png') })
console.log('flow-2-audience')

// pick audience (teacher) -> next
await page.getByText('老师', { exact: true }).click()
await page.waitForTimeout(400)
await page.getByRole('button', { name: '下一步' }).click()
await page.waitForTimeout(700)
await page.screenshot({ path: path.join(outDir, 'flow-3-upload.png') })
console.log('flow-3-upload')

await ctx.close()
await browser.close()
