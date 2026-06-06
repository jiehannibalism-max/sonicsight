// End-to-end: drive the flow with a fake video upload and confirm /result renders
// from live backend data. Requires both dev server (5173) and backend (8000) up.
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
const apiCalls = []
page.on('response', (r) => {
  if (r.url().includes('/api/v1/')) apiCalls.push(`${r.status()} ${r.url()}`)
})

await page.goto(`${baseURL}/evaluate`, { waitUntil: 'networkidle' })
await page.getByText('mā', { exact: true }).click()
await page.getByRole('button', { name: '下一步' }).click()
await page.waitForTimeout(500)
await page.getByText('家长', { exact: true }).click()
await page.getByRole('button', { name: '下一步' }).click()
await page.waitForTimeout(500)

// real video so the backend's MediaPipe + FunASR pipeline actually runs
const realVideo = path.resolve(__dirname, '../../data/my_phonemes.mp4')
await page.setInputFiles('input[type=file]', realVideo)
await page.waitForTimeout(800)
await page.getByRole('button', { name: '开始评估' }).click()

await page.waitForURL('**/result', { timeout: 90000 })
await page.waitForTimeout(2000) // let radar/gauge animations settle
await page.screenshot({
  path: path.join(outDir, 'e2e-result.png'),
  fullPage: true,
})
console.log('reached /result')
console.log('API calls:\n' + apiCalls.join('\n'))

await ctx.close()
await browser.close()
