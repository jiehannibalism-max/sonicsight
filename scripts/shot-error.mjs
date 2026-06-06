// Force /evaluate to fail and screenshot the error state on /evaluating.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
mkdirSync(outDir, { recursive: true })
const baseURL = process.env.BASE_URL ?? 'http://localhost:5173'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()

// force the evaluate endpoint to 500
await page.route('**/api/v1/evaluate', (route) =>
  route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ detail: '评估失败：未检测到人脸，请正对镜头重拍。' }) }),
)

await page.goto(`${baseURL}/evaluate`, { waitUntil: 'networkidle' })
await page.getByText('mā', { exact: true }).click()
await page.getByRole('button', { name: '下一步' }).click()
await page.waitForTimeout(400)
await page.getByText('家长', { exact: true }).click()
await page.getByRole('button', { name: '下一步' }).click()
await page.waitForTimeout(400)
await page.setInputFiles('input[type=file]', { name: 'demo.mp4', mimeType: 'video/mp4', buffer: Buffer.from('x') })
await page.waitForTimeout(500)
await page.getByRole('button', { name: '开始评估' }).click()
await page.getByText('评估没能完成').waitFor({ timeout: 10000 })
await page.waitForTimeout(400)
await page.screenshot({ path: path.join(outDir, 'error-state.png') })
console.log('error state captured')

await ctx.close()
await browser.close()
