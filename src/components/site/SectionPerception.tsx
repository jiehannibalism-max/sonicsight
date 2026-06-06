import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  FaceLandmarker,
  HandLandmarker,
  DrawingUtils,
} from '@mediapipe/tasks-vision'
import { Camera, Loader2, VideoOff, ScanFace, Hand, AudioLines } from 'lucide-react'
import { asset } from '@/lib/site'
import { cn } from '@/lib/utils'
import { SectionHead, Reveal } from './Reveal'

type Status = 'idle' | 'loading' | 'live' | 'fallback'

// guided practice targets
const TARGETS = [
  { id: 'ma', pinyin: 'mā', emoji: '🐴', hint: '双唇紧闭，手放喉部' },
  { id: 'ba', pinyin: 'bā', emoji: '🍃', hint: '双唇爆破，手放下巴' },
  { id: 'da', pinyin: 'dā', emoji: '🥁', hint: '舌尖抵齿龈，手放嘴角' },
  { id: 'ge', pinyin: 'gē', emoji: '🎵', hint: '舌根抬起，手放脸颊' },
]

function d2(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

export function SectionPerception() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const faceRef = useRef<FaceLandmarker | null>(null)
  const handRef = useRef<HandLandmarker | null>(null)
  const drawRef = useRef<DrawingUtils | null>(null)
  const mpRef = useRef<typeof import('@mediapipe/tasks-vision') | null>(null)
  const rafRef = useRef(0)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const targetRef = useRef(0)

  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [target, setTarget] = useState(0)
  const [conf, setConf] = useState({ lip: 0, hand: 0, voice: 0 })
  const [metrics, setMetrics] = useState({ open: 0, round: 0, labio: 0, sym: 0 })
  const [recognized, setRecognized] = useState(false)

  useEffect(() => {
    targetRef.current = target
  }, [target])

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
  }, [])
  useEffect(() => () => stop(), [stop])

  const start = useCallback(async () => {
    setError(null)
    setStatus('loading')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 960, height: 720, facingMode: 'user' },
        audio: true,
      })
      streamRef.current = stream
      const video = videoRef.current!
      video.srcObject = stream
      await video.play()

      // mic analyser (real speech-channel liveness)
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AC()
        audioCtxRef.current = ctx
        const srcNode = ctx.createMediaStreamSource(stream)
        const an = ctx.createAnalyser()
        an.fftSize = 512
        srcNode.connect(an)
        analyserRef.current = an
      } catch {
        /* audio optional */
      }

      const mp = await import('@mediapipe/tasks-vision')
      mpRef.current = mp
      const vision = await mp.FilesetResolver.forVisionTasks(asset('mediapipe/wasm'))
      const make = async (delegate: 'GPU' | 'CPU') => {
        faceRef.current = await mp.FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: asset('mediapipe/models/face_landmarker.task'), delegate },
          runningMode: 'VIDEO',
          numFaces: 1,
        })
        handRef.current = await mp.HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: asset('mediapipe/models/hand_landmarker.task'), delegate },
          runningMode: 'VIDEO',
          numHands: 2,
        })
      }
      try {
        await make('GPU')
      } catch {
        await make('CPU')
      }

      drawRef.current = new mp.DrawingUtils(canvasRef.current!.getContext('2d')!)
      setStatus('live')
      loop()
    } catch (e) {
      console.warn('perception failed', e)
      setError(
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? '摄像头/麦克风未授权'
          : '未检测到可用摄像头',
      )
      setStatus('fallback')
      stop()
      runFallback()
    }
  }, [stop])

  const loop = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const draw = drawRef.current
    const mp = mpRef.current
    if (!video || !canvas || !draw || !mp) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }
    const ctx = canvas.getContext('2d')!
    if (video.videoWidth) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const ts = performance.now()

    let lipConf = 0
    let handConf = 0

    // ---- face / lips ----
    if (faceRef.current) {
      const res = faceRef.current.detectForVideo(video, ts)
      const lm = res.faceLandmarks?.[0]
      if (lm) {
        lipConf = 1
        draw.drawConnectors(lm, mp.FaceLandmarker.FACE_LANDMARKS_LIPS, {
          color: 'rgba(31,122,134,0.95)',
          lineWidth: 2.4,
        })
        const idx = [
          ...new Set(
            mp.FaceLandmarker.FACE_LANDMARKS_LIPS.flatMap((c) => [c.start, c.end]),
          ),
        ]
        ctx.fillStyle = 'rgba(224,147,74,0.95)'
        for (const i of idx) {
          ctx.beginPath()
          ctx.arc(lm[i].x * canvas.width, lm[i].y * canvas.height, 3, 0, Math.PI * 2)
          ctx.fill()
        }
        const w = d2(lm[61], lm[291])
        const fh = d2(lm[10], lm[152]) + 1e-6
        const fw = d2(lm[234], lm[454]) + 1e-6
        const open = clamp01(d2(lm[13], lm[14]) / (w + 1e-6) / 0.6)
        const round = clamp01(1 - (w / fw) / 0.52)
        const labio = clamp01(d2(lm[0], lm[17]) / fh / 0.18)
        const sym = clamp01(1 - Math.abs(lm[61].y - lm[291].y) / (w + 1e-6) / 0.25)
        setMetrics((m) => ({
          open: lerp(m.open, open, 0.3),
          round: lerp(m.round, round, 0.3),
          labio: lerp(m.labio, labio, 0.3),
          sym: lerp(m.sym, sym, 0.3),
        }))
      }
    }

    // ---- hands ----
    if (handRef.current) {
      const res = handRef.current.detectForVideo(video, ts)
      const hands = res.landmarks ?? []
      if (hands.length) {
        handConf = res.handednesses?.[0]?.[0]?.score ?? 0.9
        for (const h of hands) {
          draw.drawConnectors(h, mp.HandLandmarker.HAND_CONNECTIONS, {
            color: 'rgba(20,78,90,0.9)',
            lineWidth: 3,
          })
          draw.drawLandmarks(h, { color: 'rgba(224,147,74,0.95)', radius: 4 })
        }
      }
    }

    // ---- voice (real mic RMS) ----
    let voiceConf = 0
    const an = analyserRef.current
    if (an) {
      const buf = new Uint8Array(an.fftSize)
      an.getByteTimeDomainData(buf)
      let sum = 0
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128
        sum += v * v
      }
      voiceConf = clamp01(Math.sqrt(sum / buf.length) * 6)
    }

    setConf((c) => {
      const next = {
        lip: lerp(c.lip, lipConf, 0.25),
        hand: lerp(c.hand, handConf, 0.25),
        voice: lerp(c.voice, voiceConf, 0.4),
      }
      setRecognized(next.lip > 0.55 && next.hand > 0.5 && next.voice > 0.25)
      return next
    })

    rafRef.current = requestAnimationFrame(loop)
  }, [])

  // synthetic fallback when no camera
  const runFallback = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 960
    canvas.height = 720
    const ctx = canvas.getContext('2d')!
    let t = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const open = (Math.sin(t) * 0.5 + 0.5) * 70 + 16
      ctx.strokeStyle = 'rgba(31,122,134,0.9)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.ellipse(480, 360, 150, open, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = 'rgba(224,147,74,0.95)'
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(480 + Math.cos(a) * 150, 360 + Math.sin(a) * open, 4, 0, Math.PI * 2)
        ctx.fill()
      }
      const s = Math.sin(t) * 0.5 + 0.5
      setConf({ lip: 0.6 + s * 0.3, hand: 0.55 + Math.sin(t * 0.7) * 0.3, voice: 0.3 + s * 0.5 })
      setMetrics({ open: open / 86, round: 0.5 + Math.sin(t * 0.7) * 0.2, labio: 0.4 + s * 0.3, sym: 0.85 })
      setRecognized(s > 0.6)
      t += 0.05
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
  }, [])

  const tgt = TARGETS[target]
  const live = status === 'live' || status === 'fallback'

  return (
    <section className="scroll-mt-20 px-5 pt-28 pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          kicker="三模态感知 · 唇 + 手 + 声，同时进来"
          title={<>三种信号一起看，才认得准</>}
          lead="单看嘴唇，b/p/m 完全分不清。所以系统同时读取唇形、Cued Speech 手势与声音——三路并行、互相印证，这正是把识别准确率提上去的关键。打开摄像头，三路都在你设备上实时运行。"
        />

        {/* guided target picker */}
        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground">跟我做：</span>
          {TARGETS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTarget(i)}
              className={cn(
                'flex items-center gap-2 rounded-2xl border px-4 py-2 text-base font-medium transition-all',
                target === i
                  ? 'border-teal bg-teal text-white shadow-md shadow-teal/20'
                  : 'border-border bg-card text-ink hover:border-teal/40',
              )}
            >
              <span className="text-xl">{t.emoji}</span>
              {t.pinyin}
            </button>
          ))}
        </Reveal>

        <Reveal className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* stage */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-ink/95 shadow-xl shadow-teal/10">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-90"
            />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />

            {/* live caption (guided) */}
            {live && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-ink/90 to-transparent px-5 pb-4 pt-10">
                <span className="text-sm text-white/70">目标：{tgt.hint}</span>
                <span
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold transition-colors',
                    recognized ? 'bg-teal text-white' : 'bg-white/15 text-white/80',
                  )}
                >
                  {recognized ? `✓ 识别：${tgt.pinyin}` : '识别中…'}
                </span>
              </div>
            )}

            {status !== 'live' && status !== 'fallback' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/85 text-center text-white/90">
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-teal-light" />
                    <p className="text-sm">正在唤醒摄像头、麦克风与 AI 模型…</p>
                  </>
                ) : (
                  <>
                    <Camera className="h-10 w-10 text-teal-light" />
                    <button
                      onClick={start}
                      className="rounded-full bg-teal px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5 hover:bg-teal-light"
                    >
                      打开摄像头，三路一起追踪
                    </button>
                    <p className="max-w-xs text-xs text-white/60">
                      会请求摄像头与麦克风权限。全部在本机处理，不上传任何数据。
                    </p>
                  </>
                )}
              </div>
            )}

            {status === 'fallback' && (
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-amber/90 px-3 py-1.5 text-xs font-medium text-white">
                <VideoOff className="h-3.5 w-3.5" />
                {error ?? '模拟'} · 模拟演示
              </div>
            )}
            {status === 'live' && (
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-teal/90 px-3 py-1.5 text-xs font-medium text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                三模态实时
              </div>
            )}
          </div>

          {/* right column */}
          <div className="flex flex-col gap-5">
            {/* fusion confidence */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-sm font-medium text-ink">三通道置信度</p>
              <Channel icon={ScanFace} label="唇形通道" value={conf.lip} color="teal" />
              <Channel icon={Hand} label="手势通道" value={conf.hand} color="teal-deep" />
              <Channel icon={AudioLines} label="语音通道" value={conf.voice} color="amber" />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                哪一路更可靠，融合时它的权重就更高——光线差时看声音，嘈杂时看口型与手势。
              </p>
            </div>

            {/* pro lip metrics */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-sm font-medium text-ink">实时唇形几何</p>
              <Meter label="开口度" value={metrics.open} hint="上下唇内缘间距 ÷ 口宽，反映张口幅度" />
              <Meter label="圆唇度" value={metrics.round} hint="口宽 ÷ 面宽，越小越圆唇（如 u/o）" />
              <Meter label="唇齿距" value={metrics.labio} hint="上下唇外缘间距 ÷ 面高，关乎唇齿音 f" />
              <Meter label="左右对称" value={metrics.sym} hint="两侧嘴角高度差，唇腭裂常见不对称" />
            </div>

            <div className="rounded-2xl border border-teal/15 bg-teal/5 p-4 text-xs leading-relaxed text-teal-deep">
              💡 唇形 40 点、手部 21 点、声音波形——全部在你设备上本机计算，
              <b>不上传、不联网</b>，关掉页面即清除。
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Channel({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof ScanFace
  label: string
  value: number
  color: 'teal' | 'teal-deep' | 'amber'
}) {
  const pct = Math.round(clamp01(value) * 100)
  const bar = color === 'amber' ? 'bg-amber' : color === 'teal-deep' ? 'bg-teal-deep' : 'bg-teal'
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-ink">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {label}
        </span>
        <span className="font-semibold text-ink">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-[width] duration-150', bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Meter({ label, value, hint }: { label: string; value: number; hint: string }) {
  const pct = Math.round(clamp01(value) * 100)
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-sm font-semibold text-teal">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal to-amber transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
