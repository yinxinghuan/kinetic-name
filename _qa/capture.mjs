import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const root = '/Users/yin/code/games/kinetic-name'
const port = '61245'
const vite = `${root}/node_modules/vite/bin/vite.js`
const server = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', port], {
  cwd: root,
  stdio: 'ignore',
})
await mkdir(`${root}/_qa/ui`, { recursive: true })
await new Promise((resolve) => setTimeout(resolve, 1200))

const browser = await chromium.launch({ headless: true })
const failures = []
for (const [label, width, height] of [['390x844', 390, 844], ['320x568', 320, 568]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  page.on('pageerror', (error) => failures.push(`${label}: ${error.stack || error.message}`))
  await page.goto(`http://127.0.0.1:${port}/?user_name=${encodeURIComponent('林思远ALPHA')}`, {
    waitUntil: 'networkidle',
  })
  await page.screenshot({ path: `${root}/_qa/ui/recheck-entry-cjk-${label}.png` })
  for (let index = 0; index < 4; index += 1) {
    await page.mouse.click(width / 2, height * 0.42)
    await page.waitForTimeout(index === 0 ? 1150 : 180)
  }
  await page.waitForTimeout(1150)
  await page.screenshot({ path: `${root}/_qa/ui/recheck-completed-cjk-${label}.png` })
  await page.close()
}
await browser.close()
server.kill('SIGTERM')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
}
