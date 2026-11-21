import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './PixelCard.css'

type PixelCardProps = {
  children: ReactNode
  className?: string
  colors?: string[]
  glowColor?: string
  shape?: 'square' | 'circle'
  origin?: 'center'
  gap?: number
  pixelSize?: number
  speed?: number
  revealDuration?: number
  spotlight?: number
  glow?: number
  opacity?: number
  fade?: number
  trigger?: 'hover'
  radius?: number
  clickPulse?: boolean
  intro?: boolean
  theme?: 'dark' | 'light'
}

const defaultColors = ['#f8fafc', '#f1f5f9', '#cbd5e1']

export default function PixelCard({ children, className = '', colors = defaultColors, glowColor = '#cbd5e1', shape = 'square', gap = 5, pixelSize = 2, speed = 35, revealDuration = 600, spotlight = .5, glow = .5, opacity = .35, fade = .7, radius = 24, clickPulse = false, intro = false, theme = 'dark' }: PixelCardProps) {
  const card = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = card.current
    const drawing = canvas.current
    if (!element || !drawing) return
    const ctx = drawing.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0, height = 0, frame = 0, lastDraw = 0
    let visible = false, hovered = false, focused = false, introduced = false
    let started = -Infinity, pulseAt = -Infinity, releaseAt = -Infinity
    let pointerX = .5, pointerY = .5
    const duration = Math.max(100, revealDuration)
    const lifetime = duration + Math.max(200, fade * 1000)
    const step = Math.max(4, gap + pixelSize)

    function start() {
      if (reduced.matches || !visible) return
      if (!frame) { lastDraw = 0; frame = requestAnimationFrame(draw) }
    }

    function draw(now: number) {
      frame = 0
      if (!visible || reduced.matches) { ctx!.clearRect(0, 0, width, height); return }
      const active = hovered || focused
      const elapsed = now - started
      const pulseElapsed = now - pulseAt
      const releasing = active ? 1 : Math.max(0, 1 - (now - releaseAt) / Math.max(200, fade * 1000))
      const introduction = Math.max(0, 1 - Math.max(0, elapsed - duration) / Math.max(200, fade * 1000))
      const intensity = Math.max(active ? 1 : releasing, introduction, Math.max(0, 1 - pulseElapsed / lifetime))
      if (now - lastDraw >= 1000 / Math.max(10, Math.min(60, speed))) {
        lastDraw = now
        ctx!.clearRect(0, 0, width, height)
        const maxDistance = Math.hypot(width / 2, height / 2)
        const reveal = Math.min(1, elapsed / duration)
        const pulseRadius = pulseElapsed / duration * maxDistance
        for (let y = step / 2; y < height; y += step) {
          for (let x = step / 2; x < width; x += step) {
            const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1
            if (seed < .22) continue
            const distance = Math.hypot(x - width / 2, y - height / 2)
            const revealed = Math.max(0, Math.min(1, (reveal * 1.15 - distance / maxDistance) * 8))
            const pulse = pulseElapsed >= 0 && pulseElapsed < lifetime ? Math.max(0, 1 - Math.abs(distance - pulseRadius) / 40) : 0
            const twinkle = .35 + .65 * (.5 + .5 * Math.sin(now / 420 + seed * 24))
            const proximity = Math.max(0, 1 - Math.hypot(x - pointerX * width, y - pointerY * height) / (maxDistance * .8))
            const alpha = Math.min(1, Math.max(0, opacity) * (revealed * intensity * twinkle * (1 - spotlight * .5 + proximity * spotlight) + pulse * .8))
            if (alpha < .005) continue
            ctx!.globalAlpha = alpha
            ctx!.fillStyle = colors[Math.floor(seed * colors.length)] || '#cbd5e1'
            ctx!.shadowColor = glowColor
            ctx!.shadowBlur = seed > .88 ? Math.max(0, glow) * 8 : 0
            const size = Math.max(1, pixelSize) * (.6 + seed * .4)
            if (shape === 'circle') { ctx!.beginPath(); ctx!.arc(x, y, size / 2, 0, Math.PI * 2); ctx!.fill() }
            else ctx!.fillRect(x - size / 2, y - size / 2, size, size)
          }
        }
        ctx!.globalAlpha = 1
      }
      if (active || elapsed < lifetime || now - releaseAt < lifetime || pulseElapsed < lifetime) frame = requestAnimationFrame(draw)
      else ctx!.clearRect(0, 0, width, height)
    }

    function resize() {
      const rect = element!.getBoundingClientRect()
      width = rect.width; height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      drawing!.width = Math.round(width * dpr)
      drawing!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      start()
    }
    const enter = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; hovered = true; started = performance.now(); start() }
    const leave = () => { hovered = false; releaseAt = performance.now(); start() }
    const move = (event: PointerEvent) => { const rect = element!.getBoundingClientRect(); pointerX = (event.clientX - rect.left) / rect.width; pointerY = (event.clientY - rect.top) / rect.height }
    const focus = () => { focused = true; started = performance.now(); start() }
    const blur = (event: FocusEvent) => { if (event.relatedTarget instanceof Node && element!.contains(event.relatedTarget)) return; focused = false; releaseAt = performance.now(); start() }
    const pulse = () => { if (!clickPulse) return; pulseAt = performance.now(); started = pulseAt; start() }
    const motionChange = () => { if (reduced.matches) { cancelAnimationFrame(frame); frame = 0; ctx!.clearRect(0, 0, width, height) } else start() }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { if (intro && !introduced) { started = performance.now(); introduced = true } start() }
      else { cancelAnimationFrame(frame); frame = 0 }
    }, { threshold: .08 })
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(element)
    resizeObserver.observe(element)
    reduced.addEventListener('change', motionChange)
    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointerleave', leave)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerdown', pulse)
    element.addEventListener('focusin', focus)
    element.addEventListener('focusout', blur)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect(); resizeObserver.disconnect()
      reduced.removeEventListener('change', motionChange)
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointerleave', leave)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerdown', pulse)
      element.removeEventListener('focusin', focus)
      element.removeEventListener('focusout', blur)
    }
  }, [colors, glowColor, shape, gap, pixelSize, speed, revealDuration, spotlight, glow, opacity, fade, clickPulse, intro])

  return <article ref={card} className={`pixel-card ${className}`} data-theme={theme} style={{ '--pixel-radius': `${radius}px` } as CSSProperties}>
    <canvas ref={canvas} className="pixel-card__canvas" aria-hidden="true" />
    {children}
  </article>
}
