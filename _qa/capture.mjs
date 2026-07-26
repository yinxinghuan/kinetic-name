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
    waitUntil: 'domcontentloaded',
  })
  await page.screenshot({ path: `${root}/_qa/ui/recheck-entry-cjk-${label}.png` })
  for (let index = 0; index < 4; index += 1) {
    await page.mouse.click(width / 2, height * 0.42)
    await page.waitForTimeout(index === 0 ? 1150 : 180)
  }
  await page.waitForTimeout(1150)
  await page.screenshot({ path: `${root}/_qa/ui/recheck-completed-cjk-${label}.png` })
  await page.close()

  const platformPage = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  platformPage.on('pageerror', (error) => failures.push(`${label} platform: ${error.stack || error.message}`))
  await platformPage.addInitScript(() => {
    Object.defineProperty(window, 'webkit', {
      configurable: true,
      value: { messageHandlers: { aigram: { postMessage(message) {
        if (typeof message !== 'string' || !message.startsWith('callAPI-')) return
        const payload = JSON.parse(atob(message.slice('callAPI-'.length)))
        setTimeout(() => {
          const callback = window[`__aigram_cb_${payload.request_id.replaceAll('-', '_')}`]
          callback?.(JSON.stringify({
            request_id: payload.request_id,
            success: true,
            data: { data: { name: '平台林思远', head_url: '' } },
          }))
        }, 30)
      } } } },
    })
  })
  await platformPage.goto(`http://127.0.0.1:${port}/?api_origin=https%3A%2F%2Faigram.app&telegram_id=739201`, {
    waitUntil: 'domcontentloaded',
  })
  await platformPage.waitForFunction(() => document.body.dataset.visualReady === 'true')
  const platformName = await platformPage.locator('#word').textContent()
  if (platformName !== '平台林思远') failures.push(`${label} platform: wrong identity ${platformName}`)
  await platformPage.screenshot({ path: `${root}/_qa/ui/platform-name-${label}.png` })
  await platformPage.close()
}
await browser.close()
server.kill('SIGTERM')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
}
