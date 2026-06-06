import { useEffect, useRef } from 'react'

/**
 * Animated soundwave canvas — the SonicSight motif.
 * A flowing band of vertical bars whose heights ripple over time,
 * echoing the trademark's waveform. Pure canvas, no deps, ~60fps but
 * throttled and DPR-aware. Used as a soft backdrop.
 */
export function Soundwave({
  className,
  bars = 80,
  color = '31, 122, 134', // teal rgb
  accent = '224, 147, 74', // amber rgb
  height = 220,
}: {
  className?: string
  bars?: number
  color?: string
  accent?: string
  height?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function draw() {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx!.clearRect(0, 0, w, h)
      const gap = w / bars
      const mid = h / 2
      for (let i = 0; i < bars; i++) {
        // bell-shaped envelope so the band fades at both ends
        const env = Math.sin((i / bars) * Math.PI)
        const phase = i * 0.35 - t
        const amp =
          (Math.sin(phase) * 0.5 + Math.sin(phase * 0.5 + 1.3) * 0.5) * env
        const bh = Math.max(2, Math.abs(amp) * h * 0.42 + env * 6)
        const x = i * gap + gap * 0.5
        // colour blends teal → amber across the band, like the logo
        const mix = i / bars
        const r = Math.round(
          parseInt(color.split(',')[0]) * (1 - mix) +
            parseInt(accent.split(',')[0]) * mix,
        )
        const g = Math.round(
          parseInt(color.split(',')[1]) * (1 - mix) +
            parseInt(accent.split(',')[1]) * mix,
        )
        const b = Math.round(
          parseInt(color.split(',')[2]) * (1 - mix) +
            parseInt(accent.split(',')[2]) * mix,
        )
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.18 + env * 0.32})`
        const bw = Math.max(1.5, gap * 0.42)
        roundRect(ctx!, x - bw / 2, mid - bh / 2, bw, bh, bw / 2)
        ctx!.fill()
      }
      if (!reduce) t += 0.045
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [bars, color, accent])

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: '100%', height }}
      aria-hidden="true"
    />
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}
