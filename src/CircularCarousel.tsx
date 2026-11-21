import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import './CircularCarousel.css'

export type CarouselItem = {
  src: string
  alt: string
  title: string
  subtitle: string
  description?: string
  position?: string
}

type CircularCarouselProps = {
  items: CarouselItem[]
  preset?: 'panorama'
  intro?: 'rise'
  cardWidth?: number
  aspectRatio?: number
  speed?: number
  captions?: boolean
  gap?: number
  tilt?: number
  perspective?: number
  innerShade?: number
}

export default function CircularCarousel({ items, intro = 'rise', cardWidth = 320, aspectRatio = .75, speed = 2.5, captions = true, gap = 18, tilt = 0, perspective = 1800, innerShade = .58 }: CircularCarouselProps) {
  const root = useRef<HTMLDivElement>(null)
  const drag = useRef<{ pointerId: number; x: number; offset: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  // Six faces keep the panorama populated with three teachers; extra faces are decorative.
  const faces = items.length === 3 ? [...items, ...items] : items
  const step = 360 / Math.max(1, faces.length)

  useEffect(() => {
    if (!root.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!visible || dragging || reducedMotion || faces.length < 2) return
    // Restart the wait after a drag or keyboard move, then advance one full card.
    const timer = window.setInterval(() => {
      if (!document.hidden) setOffset(value => value - step)
    }, Math.max(.5, speed) * 1000)
    return () => window.clearInterval(timer)
  }, [visible, dragging, reducedMotion, speed, step, offset, faces.length])

  function move(direction: number) {
    setOffset(value => value + direction * step)
  }

  function dragStart(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return
    drag.current = { pointerId: event.pointerId, x: event.clientX, offset }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function dragMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    const distance = event.clientX - drag.current.x
    setOffset(drag.current.offset + distance / Math.min(cardWidth, window.innerWidth - 70) * step)
  }

  function dragEnd(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    const current = drag.current
    drag.current = null
    const distance = event.clientX - current.x
    const cardsMoved = Math.abs(distance) < 35 ? 0 : Math.sign(distance) * Math.max(1, Math.round(Math.abs(distance) / Math.min(cardWidth, window.innerWidth - 70)))
    setOffset(current.offset + (cancelled ? 0 : cardsMoved * step))
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  if (!items.length) return null
  const style = {
    '--card-width': `${cardWidth}px`,
    '--image-ratio': aspectRatio,
    '--orbit-offset': `${offset}deg`,
    '--orbit-tilt': `${tilt}deg`,
    '--carousel-perspective': `${perspective}px`,
    '--carousel-gap': `${gap}px`,
    '--inner-shade': Math.max(0, Math.min(1, innerShade)),
  } as CSSProperties

  return <div ref={root} className={`circular-carousel ${visible ? 'in-view' : ''} ${dragging ? 'is-dragging' : ''}`} style={style} role="region" aria-roledescription="carrossel" aria-label="Professores da Fight Team Vinhedo">
    <div className={`circular-carousel__stage ${intro === 'rise' ? 'rise' : ''}`} tabIndex={0} aria-label="Galeria dos professores. Clique e arraste, deslize ou use as setas do teclado para navegar." onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? 1 : -1) } }} onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={event => dragEnd(event)} onPointerCancel={event => dragEnd(event, true)} onLostPointerCapture={event => dragEnd(event, true)}>
      <div className="circular-carousel__offset"><div className="circular-carousel__ring">
        {faces.map((item, index) => <figure className="circular-carousel__card" key={`${item.src}-${index}`} style={{ '--face-angle': `${index * step}deg` } as CSSProperties} aria-hidden={index >= items.length ? true : undefined}>
          <img src={item.src} alt={index >= items.length ? '' : item.alt} style={{ objectPosition: item.position || 'center' }} width="492" height="656" loading="lazy" draggable={false} />
          {captions && <figcaption><p>{item.subtitle}</p><h3>{item.title}</h3>{item.description && <span>{item.description}</span>}</figcaption>}
        </figure>)}
      </div></div>
    </div>
    <p className="circular-carousel__hint">Clique e arraste no computador. Deslize para os lados no celular.</p>
  </div>
}

