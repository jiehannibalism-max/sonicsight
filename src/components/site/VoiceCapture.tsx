import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, Square, RotateCcw, Play } from 'lucide-react'

type State = 'idle' | 'recording' | 'done'

/**
 * Real microphone capture: records the user's voice, draws a live waveform,
 * freezes it on stop, then calls onComplete. If no mic, offers a sample path.
 */
export function VoiceCapture({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const anRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef(0)
  const peaksRef = useRef<number[]>([])
  const [state, setState] = useState<State>('idle')
  const [secs, setSecs] = useState(0)
  const [err, setErr] = useState<string | null>(null)

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    ctxRef.current?.close().catch(() => {})
    ctxRef.current = null
  }, [])
  useEffect(() => () => cleanup(), [cleanup])

  const drawFrozen = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * 2
    canvas.height = h * 2
    ctx.scale(2, 2)
    ctx.clearRect(0, 0, w, h)
    const peaks = peaksRef.current
    const n = peaks.length || 1
    const bw = w / n
    for (let i = 0; i < n; i++) {
      const bh = Math.max(2, peaks[i] * h * 0.9)
      const mix = i / n
      ctx.fillStyle = `rgba(${Math.round(31 + 193 * mix)}, ${Math.round(122 - 0 * mix)}, ${Math.round(134 - 60 * mix)}, 0.85)`
      ctx.fillRect(i * bw + bw * 0.15, h / 2 - bh / 2, bw * 0.7, bh)
    }
  }, [])

  const stop = useCallback(() => {
    cleanup()
    setState('done')
    setTimeout(drawFrozen, 30)
    onComplete()
  }, [cleanup, drawFrozen, onComplete])

  const start = useCallback(async () => {
    setErr(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AC()
      ctxRef.current = ctx
      const src = ctx.createMediaStreamSource(stream)
      const an = ctx.createAnalyser()
      an.fftSize = 1024
      src.connect(an)
      anRef.current = an
      peaksRef.current = []
      setSecs(0)
      setState('recording')

      const t0 = performance.now()
      const canvas = canvasRef.current!
      const c = canvas.getContext('2d')!
      const buf = new Uint8Array(an.fftSize)
      let lastPeak = 0
      const draw = () => {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        canvas.width = w * 2
        canvas.height = h * 2
        c.setTransform(2, 0, 0, 2, 0, 0)
        c.clearRect(0, 0, w, h)
        an.getByteTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.min(1, Math.sqrt(sum / buf.length) * 4)
        // push a peak ~ every 60ms
        const now = performance.now()
        if (now - lastPeak > 55) {
          peaksRef.current.push(rms)
          lastPeak = now
        }
        // draw scrolling bars
        const peaks = peaksRef.current.slice(-90)
        const bw = w / 90
        for (let i = 0; i < peaks.length; i++) {
          const bh = Math.max(2, peaks[i] * h * 0.9)
          const mix = i / 90
          c.fillStyle = `rgba(${Math.round(31 + 193 * mix)}, 122, ${Math.round(134 - 60 * mix)}, 0.85)`
          c.fillRect(i * bw + bw * 0.15, h / 2 - bh / 2, bw * 0.7, bh)
        }
        const el = (now - t0) / 1000
        setSecs(el)
        if (el >= 4) {
          stop()
          return
        }
        rafRef.current = requestAnimationFrame(draw)
      }
      draw()
    } catch (e) {
      console.warn('mic failed', e)
      setErr('没有麦克风权限——可用示例音频继续')
    }
  }, [stop])

  const reset = () => {
    peaksRef.current = []
    setState('idle')
    const canvas = canvasRef.current
    if (canvas) canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">① 把你的声音录进来</p>
        {state === 'recording' && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-amber">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
            录音中 {secs.toFixed(1)}s
          </span>
        )}
        {state === 'done' && <span className="text-sm text-teal">✓ 已采集</span>}
      </div>

      <div className="relative h-28 overflow-hidden rounded-2xl bg-ink/95">
        <canvas ref={canvasRef} className="h-full w-full" style={{ width: '100%', height: '100%' }} />
        {state === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
            点下方「录音」，对着麦克风说一个音，如「妈」
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {state === 'idle' && (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Mic className="h-4 w-4" />
            录音（约 4 秒）
          </button>
        )}
        {state === 'recording' && (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Square className="h-4 w-4" />
            停止
          </button>
        )}
        {state === 'done' && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink hover:border-teal/40"
          >
            <RotateCcw className="h-4 w-4" />
            重新录
          </button>
        )}
        {(state === 'idle' || err) && (
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-teal"
          >
            <Play className="h-4 w-4" />
            用示例音频
          </button>
        )}
      </div>
      {err && <p className="mt-2 text-xs text-amber">{err}</p>}
    </div>
  )
}
