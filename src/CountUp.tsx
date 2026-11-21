import { useEffect, useRef } from 'react'

type CountUpProps = {
  from: number
  to: number
  duration?: number
  delay?: number
  replayOnHover?: boolean
  className?: string
}

/** Counts between the given values when visible, including descending ranges. */
export default function CountUp({ from, to, duration = 2, delay = 0, replayOnHover = false, className = '' }: CountUpProps) {
  const number = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = number.current
    if (!element) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const format = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
    const hoverTarget = element.closest('article') || element
    let frame = 0
    let played = false
    let visible = false

    function finish() {
      cancelAnimationFrame(frame)
      frame = 0
      element!.textContent = format.format(to)
    }

    function play() {
      if (!visible || frame) return
      if (motion.matches || duration <= 0) { finish(); return }
      const start = performance.now() + Math.max(0, delay) * 1000
      const length = duration * 1000
      function step(now: number) {
        const progress = Math.max(0, Math.min(1, (now - start) / length))
        const eased = 1 - (1 - progress) ** 3
        const value = Math.round(from + (to - from) * eased)
        element!.textContent = format.format(value)
        if (progress < 1) frame = requestAnimationFrame(step)
        else finish()
      }
      frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !played) { played = true; play() }
      else if (!visible) finish()
    }, { threshold: .6 })
    observer.observe(element)
    const motionChange = () => { if (motion.matches) finish() }
    motion.addEventListener('change', motionChange)
    if (replayOnHover) hoverTarget.addEventListener('pointerenter', play)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      motion.removeEventListener('change', motionChange)
      hoverTarget.removeEventListener('pointerenter', play)
    }
  }, [from, to, duration, delay, replayOnHover])

  return <span ref={number} className={`count-up-text ${className}`} aria-hidden="true">{to}</span>
}
