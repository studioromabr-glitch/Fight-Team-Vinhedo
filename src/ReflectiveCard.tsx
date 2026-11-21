import { useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import './ReflectiveCard.css'

type ReflectiveCardProps = {
  src?: string
  alt?: string
  tint?: string
  metalness?: number
  roughness?: number
  blurStrength?: number
  shine?: number
  glare?: number
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/** Circular metallic logo with simulated light reflections; no camera required. */
export default function ReflectiveCard({
  src = '/logo.jpg',
  alt = 'Fight Team Vinhedo — dois punhos e cinco estrelas',
  tint = '#ffffff',
  metalness = 1,
  roughness = 0.3,
  blurStrength = 6,
  shine = 1,
  glare = 0.5,
}: ReflectiveCardProps) {
  const surface = useRef<HTMLDivElement>(null)

  function reset() {
    const element = surface.current
    if (!element) return
    element.style.setProperty('--rx', '0deg')
    element.style.setProperty('--ry', '0deg')
    element.style.setProperty('--light-x', '30%')
    element.style.setProperty('--light-y', '20%')
    element.style.setProperty('--sweep', '-25deg')
  }

  function reflect(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const element = surface.current
    if (!element) return
    // Use the stationary wrapper so perspective does not shift the pointer bounds.
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = clamp((event.clientX - bounds.left) / bounds.width)
    const y = clamp((event.clientY - bounds.top) / bounds.height)
    element.style.setProperty('--rx', `${(0.5 - y) * 16}deg`)
    element.style.setProperty('--ry', `${(x - 0.5) * 16}deg`)
    element.style.setProperty('--light-x', `${x * 100}%`)
    element.style.setProperty('--light-y', `${y * 100}%`)
    element.style.setProperty('--sweep', `${-45 + x * 90}deg`)
  }

  const style = {
    '--tint': tint,
    '--metalness': clamp(metalness),
    '--shine': clamp(shine, 0, 2),
    '--glare': clamp(glare),
    '--reflection-blur': `${clamp(blurStrength, 0, 30)}px`,
    '--reflection-opacity': 0.32 - clamp(roughness) * 0.15,
  } as CSSProperties

  return (
    <div className="reflective-card" style={style} onPointerMove={reflect} onPointerLeave={reset} onPointerCancel={reset}>
      <div ref={surface} className="reflective-card__surface">
        <div className="reflective-card__face">
          <img className="reflective-card__logo" src={src} alt={alt} width="447" height="447" fetchPriority="high" draggable={false} />
          <div className="reflective-card__metal" aria-hidden="true" />
          <div className="reflective-card__shine" aria-hidden="true" />
          <div className="reflective-card__glare" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
