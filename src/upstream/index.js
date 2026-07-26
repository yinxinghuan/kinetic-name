import gsap from 'gsap'
import Gl from './gl'
import Type from './gl/Type'
import options from './options'

/** MIT-derived upstream carousel. The added API only maps it to touch and a self-paced closure. */
export function createKineticName(name, onLocked) {
  let current = 0
  let locked = 0
  let dragging = false
  let lastX = 0
  let yaw = 0

  options.forEach((option, index) => {
    option.word = name
    const angle = (index / options.length) * Math.PI * 2 + Math.PI * 1.5
    option.position.mesh = [50 * Math.cos(angle), 0, 50 * Math.sin(angle)]
    const type = new Type()
    type.init(option)
  })

  const canvas = Gl.renderer.domElement
  const turnTo = (next) => {
    if (next === current) return
    const turn = (Math.PI / 2) * (next - current)
    current = next
    gsap.to(Gl.scene.rotation, { duration: 1.05, ease: 'expo.inOut', y: `+=${turn}` })
  }
  const advance = () => {
    if (locked >= 4) return
    const index = locked
    locked += 1
    turnTo(index)
    onLocked(index)
  }
  canvas.addEventListener('pointerdown', (event) => {
    dragging = true
    lastX = event.clientX
    canvas.setPointerCapture(event.pointerId)
    if (locked < 4) advance()
  })
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging || locked < 4) return
    yaw += (event.clientX - lastX) * 0.006
    lastX = event.clientX
    Gl.scene.rotation.y = yaw
  })
  canvas.addEventListener('pointerup', () => { dragging = false })
  return {
    reset() {
      locked = 0
      current = 0
      yaw = 0
      gsap.to(Gl.scene.rotation, { duration: .5, ease: 'power2.out', y: 0 })
    },
  }
}
