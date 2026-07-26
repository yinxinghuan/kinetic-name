import './style.css'
import { Buffer } from 'buffer'
import * as THREE from 'three'
import { callAigramAPI, isInAigram, telegramId } from './shared/runtime/bridge'

;(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
;(window as unknown as { THREE: typeof THREE }).THREE = THREE

void (async () => {
  const locale = localStorage.getItem('game_locale') === 'en'
    || (!localStorage.getItem('game_locale') && !navigator.language.toLowerCase().startsWith('zh'))
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
  if (!nameFromQuery && isInAigram && telegramId) {
    try {
      const profile = await callAigramAPI<{ retcode: number; data?: { name?: string; user_name?: string } }>(
        `/note/telegram/user/get/info/by/telegram_id?telegram_id=${telegramId}`,
        'GET',
      )
      if (profile.retcode === 0) platformName = profile.data?.name || profile.data?.user_name || ''
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
  restart.addEventListener('pointerdown', () => {
    dots.forEach((dot) => dot.classList.remove('is-lit'))
    hint.textContent = copy.hint
    shell.classList.remove('is-complete')
    restart.hidden = true
    app.reset()
  })
})()
