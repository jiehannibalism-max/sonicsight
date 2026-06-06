import { useEffect, useRef } from 'react'
import type { DimensionKey } from '@/types'

/**
 * Animated comparison of the user's airflow/energy envelope vs the standard
 * template for a syllable. The user curve deviates according to the weak
 * dimension, and the gap area is shaded — a visual "发音过程" before scoring.
 */
export function AirflowCompare({
  weak,
  seed = 0,
  height = 180,
}: {
  weak: DimensionKey
  seed?: number
  height?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let prog = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // standard airflow envelope: a smooth plosive-like burst
    const std = (x: number) => {
      const burst = Math.exp(-Math.pow((x - 0.32) / 0.12, 2)) // main burst
      const tail = 0.45 * Math.exp(-Math.pow((x - 0.62) / 0.22, 2)) // vowel sustain
      return burst + tail
    }
    // user envelope deviates by weak dimension
    const user = (x: number) => {
      const s = std(x)
      switch (weak) {
        case 'airflow':
          return s * 0.5 // 送气不足
        case 'duration':
          return std((x - 0.12) / 1.35) * 0.92 // 拖长
        case 'nasalization':
          return s * 0.78 + 0.5 * Math.exp(-Math.pow((x - 0.78) / 0.1, 2)) // 多出鼻音峰
        case 'acoustic':
          return s * (0.8 + 0.18 * Math.sin(x * 40 + seed)) // 抖动/失真
        default:
          return std(x - 0.06) * 0.85 // 起音偏慢
      }
    }

    function curve(fn: (x: number) => number, w: number, h: number, upTo: number) {
      const pts: [number, number][] = []
      const N = 120
      for (let i = 0; i <= N * upTo; i++) {
        const x = i / N
        const y = h - 16 - fn(x) * (h - 40) * 0.62
        pts.push([x * w, y])
      }
      return pts
    }

    function stroke(pts: [number, number][], color: string, width: number, dash: number[]) {
      ctx.beginPath()
      ctx.setLineDash(dash)
      ctx.lineWidth = width
      ctx.strokeStyle = color
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
      ctx.stroke()
      ctx.setLineDash([])
    }

    function draw() {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      // baseline
      ctx.strokeStyle = 'rgba(0,0,0,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, h - 16)
      ctx.lineTo(w, h - 16)
      ctx.stroke()

      const stdPts = curve(std, w, h, 1)
      const usrPts = curve(user, w, h, prog)

      // shaded gap (between user drawn portion and std)
      if (usrPts.length > 1) {
        ctx.beginPath()
        usrPts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
        for (let i = usrPts.length - 1; i >= 0; i--) {
          const x = usrPts[i][0]
          const xi = Math.min(stdPts.length - 1, Math.round((x / w) * 120))
          ctx.lineTo(x, stdPts[xi][1])
        }
        ctx.closePath()
        ctx.fillStyle = 'rgba(224,147,74,0.14)'
        ctx.fill()
      }

      // standard (teal dashed) + user (amber solid)
      stroke(stdPts, 'rgba(31,122,134,0.85)', 2, [6, 5])
      stroke(usrPts, 'rgba(224,147,74,0.95)', 2.6, [])

      // scan dot at the drawing front
      if (prog < 1 && usrPts.length) {
        const f = usrPts[usrPts.length - 1]
        ctx.fillStyle = '#e0934a'
        ctx.beginPath()
        ctx.arc(f[0], f[1], 4, 0, Math.PI * 2)
        ctx.fill()
      }

      if (prog < 1) prog = Math.min(1, prog + 0.016)
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [weak, seed])

  return (
    <div>
      <canvas ref={ref} style={{ width: '100%', height }} aria-hidden="true" />
      <div className="mt-2 flex items-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-teal" />
          标准发音
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 bg-amber" />
          你的发音
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber/20" />
          差异区
        </span>
      </div>
    </div>
  )
}
