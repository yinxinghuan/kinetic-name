import './style.css'
import { Buffer } from 'buffer'
import * as THREE from 'three'
import { callAigramAPI } from './shared/runtime/bridge'
import { waitForAigramIdentity } from './shared/runtime/identity-ready'

;(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
;(window as unknown as { THREE: typeof THREE }).THREE = THREE

function handoffFirstFrame() {
  const boot = document.querySelector<HTMLElement>('.boot-bridge')
  if (!boot || boot.classList.contains('is-ready')) return
  document.body.dataset.visualReady = 'true'
  boot.classList.add('is-ready')
  window.setTimeout(() => boot.remove(), 420)
}

void (async () => {
  const locale = alteruLocalStorage.getItem('game_locale') === 'en'
    || (!alteruLocalStorage.getItem('game_locale') && !navigator.language.toLowerCase().startsWith('zh'))
    ? 'en'
    : 'zh'
  const copy = locale === 'zh'
    ? {
        hint: '触碰文字，依次唤醒四种形态',
        complete: '四种形态已锁定。拖动观看你的名字。',
        restart: '重新编排',
      }
    : {
        hint: 'Touch the type to awaken four forms',
        complete: 'Four forms locked. Drag to inspect.',
        restart: 'Recompose',
      }
  const { createKineticName } = await import('./upstream/index')
  const nameFromQuery = new URLSearchParams(location.search).get('user_name')
  let platformName = ''
  const telegramId = nameFromQuery ? null : await waitForAigramIdentity()
  if (!nameFromQuery && telegramId) {
    try {
      const profile = await callAigramAPI<{ retcode: number; data?: { name?: string; user_name?: string } }>(
        `/note/telegram/user/get/info/by/telegram_id?telegram_id=${telegramId}`,
        'GET',
      )
      platformName = profile?.data?.name?.trim() || profile?.data?.user_name?.trim() || ''
    } catch {
      // The product fallback is deliberately visible rather than a guessed identity.
    }
  }
  const displayName = (nameFromQuery || platformName || 'AlterU').trim().slice(0, 12) || 'AlterU'
  const word = document.querySelector<HTMLHeadingElement>('#word')!
  const hint = document.querySelector<HTMLParagraphElement>('#hint')!
  const dots = [...document.querySelectorAll<HTMLSpanElement>('.steps i')]
  const restart = document.querySelector<HTMLButtonElement>('#restart')!
  const shell = document.querySelector<HTMLElement>('.shell')!
  word.textContent = displayName.toUpperCase()
  hint.textContent = copy.hint
  restart.textContent = copy.restart
  const app = createKineticName(displayName.toUpperCase(), (index) => {
    dots[index]?.classList.add('is-lit')
    if (index === 3) {
      hint.textContent = copy.complete
      shell.classList.add('is-complete')
      restart.hidden = false
    }
  })
  await Promise.race([
    app.ready,
    new Promise((_, reject) => window.setTimeout(() => reject(new Error('Kinetic meshes timed out')), 12000)),
  ])
  requestAnimationFrame(handoffFirstFrame)
  restart.addEventListener('pointerdown', () => {
    dots.forEach((dot) => dot.classList.remove('is-lit'))
    hint.textContent = copy.hint
    shell.classList.remove('is-complete')
    restart.hidden = true
    app.reset()
  })
})().catch(() => {
  const core = document.querySelector<HTMLElement>('.boot-bridge__core')
  if (core) core.textContent = localeError()
})

function localeError() {
  return navigator.language.toLowerCase().startsWith('zh') ? '动态字形载入失败，请刷新重试' : 'Kinetic type failed to load. Please refresh.'
}
