import { useState } from 'react'
import type { AnchorHTMLAttributes, CSSProperties } from 'react'
import './StarBorder.css'

type StarBorderProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  color?: string
  trailColor?: string
  duration?: number
  direction?: 'clockwise' | 'counterclockwise'
  stars?: number
  trailLength?: number
  thickness?: number
  radius?: number
  glow?: number
  hover?: 'lap'
  sparkle?: boolean
  clickPulse?: boolean
  theme?: 'dark' | 'light'
}

export default function StarBorder({ children, className = '', color = '#ffffff', trailColor = '#ffffff', duration = 2.5, direction = 'clockwise', stars = 1, trailLength = .3, thickness = 2.5, radius = 12, glow = .45, hover = 'lap', sparkle = false, clickPulse = true, theme = 'dark', style, onPointerDown, ...props }: StarBorderProps) {
  const [pulse, setPulse] = useState(0)
  const trail = Math.min(.8, Math.max(.01, trailLength)) * 1000
  const starStyle = {
    '--star-color': color,
    '--star-trail-color': trailColor,
    '--star-duration': `${Math.max(.2, duration)}s`,
    '--star-direction': direction === 'clockwise' ? 'normal' : 'reverse',
    '--star-thickness': `${thickness}px`,
    '--star-radius': `${radius}px`,
    '--star-glow': `${Math.max(0, glow) * 12}px`,
    ...style,
  } as CSSProperties

  return <a {...props} className={`button star-border ${className}`} data-theme={theme} data-hover={hover} data-sparkle={sparkle || undefined} style={starStyle} onPointerDown={event => { if (clickPulse) setPulse(value => value + 1); onPointerDown?.(event) }}>
    <svg className="star-border__outline" aria-hidden="true" width="100%" height="100%">
      {Array.from({ length: Math.min(6, Math.max(1, stars)) }, (_, i) => <g key={i} style={{ '--star-delay': `${-i * duration / Math.max(1, stars)}s` } as CSSProperties}>
        <rect className="star-border__trail star-border__trail--soft" pathLength="1000" strokeDasharray={`${trail} ${1000 - trail}`} />
        <rect className="star-border__trail star-border__trail--medium" pathLength="1000" strokeDasharray={`${trail * .5} ${1000 - trail * .5}`} />
        <rect className="star-border__trail star-border__trail--bright" pathLength="1000" strokeDasharray={`${trail * .16} ${1000 - trail * .16}`} />
        <rect className="star-border__head" pathLength="1000" strokeDasharray="7 993" />
      </g>)}
    </svg>
    <span className="star-border__content">{children}</span>
    {pulse > 0 && <span key={pulse} className="star-border__pulse" aria-hidden="true" onAnimationEnd={() => setPulse(0)} />}
  </a>
}
