import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  FaceLandmarker,
  HandLandmarker,
  DrawingUtils,
} from '@mediapipe/tasks-vision'
import { Camera, Hand, Smile, Loader2, VideoOff } from 'lucide-react'
import { asset } from '@/lib/site'
import { cn } from '@/lib/utils'
import { SectionHead, Reveal } from './Reveal'

type Mode = 'face' | 'hand'
type Status = 'idle' | 'loading' | 'live' | 'fallback'

// distance between two normalized landmarks
function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function SectionPerception() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const faceRef = useRef<FaceLandmarker | null>(null)
  const handRef = useRef<HandLandmarker | null>(null)
  const rafRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const drawRef = useRef<DrawingUtils | null>(null)
  const mpRef = useRef<typeof import('@mediapipe/tasks-vision') | null>(null)
  const modeRef = useRef<Mode>('face')

  const [mode, setMode] = useState<Mode>('face')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  // live readouts
  const [metrics, setMetrics] = useState({ open: 0, round: 0, hands: 0 })

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => () => stop(), [stop])

  const start = useCallback(async () => {
    setError(null)
    setStatus('loading')
    try {
      // 1) camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 960, height: 720, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current!
      video.srcObject = stream
      await video.play()

      // 2) models (self-hosted) — load the heavy lib on demand
      const mp = await import('@mediapipe/tasks-vision')
      mpRef.current = mp
      const vision = await mp.FilesetResolver.forVisionTasks(asset('mediapipe/wasm'))
      const makeDelegate = async (delegate: 'GPU' | 'CPU') => {
        faceRef.current = await mp.FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: asset('mediapipe/models/face_landmarker.task'),
            delegate,
          },
          runningMode: 'VIDEO',
          numFaces: 1,
        })
        handRef.current = await mp.HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: asset('mediapipe/models/hand_landmarker.task'),
            delegate,
          },
          runningMode: 'VIDEO',
          numHands: 2,
        })
      }
      try {
        await makeDelegate('GPU')
      } catch {
        await makeDelegate('CPU')
      }

      const canvas = canvasRef.current!
      drawRef.current = new mp.DrawingUtils(canvas.getContext('2d')!)
      setStatus('live')
      loop()
    } catch (e) {
      console.warn('perception start failed', e)
      setError(
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? '摄像头未授权'
          : '未检测到可用摄像头',
      )
      setStatus('fallback')
      stop()
      runFallback()
    }
  }, [stop])

  // ---- live detection loop ----
  const loop = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const draw = drawRef.current
    if (!video || !canvas || !draw) return
    const ctx = canvas.getContext('2d')!
    if (video.videoWidth) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const ts = performance.now()

    const mp = mpRef.current
    if (!mp) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }

    if (modeRef.current === 'face' && faceRef.current) {
      const res = faceRef.current.detectForVideo(video, ts)
      const lm = res.faceLandmarks?.[0]
      if (lm) {
        draw.drawConnectors(lm, mp.FaceLandmarker.FACE_LANDMARKS_LIPS, {
          color: 'rgba(31,122,134,0.95)',
          lineWidth: 2.5,
        })
        // lip keypoints
        const pts = mp.FaceLandmarker.FACE_LANDMARKS_LIPS.flatMap((c) => [
          c.start,
          c.end,
        ])
        const uniq = [...new Set(pts)]
        ctx.fillStyle = 'rgba(224,147,74,0.95)'
        for (const i of uniq) {
          const p = lm[i]
          ctx.beginPath()
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
        // geometry: openness & roundness
        const w = dist(lm[61], lm[291]) // mouth width (corner to corner)
        const h = dist(lm[13], lm[14]) // inner lip gap
        const open = Math.min(1, h / (w + 1e-6) / 0.6)
        const round = Math.min(1, w / (dist(lm[1], lm[152]) + 1e-6) / 0.42) // width vs face height
        setMetrics((m) => ({
          ...m,
          open: m.open + (open - m.open) * 0.25,
          round: m.round + (round - m.round) * 0.25,
        }))
      }
    } else if (modeRef.current === 'hand' && handRef.current) {
      const res = handRef.current.detectForVideo(video, ts)
      const hands = res.landmarks ?? []
      for (const h of hands) {
        draw.drawConnectors(h, mp.HandLandmarker.HAND_CONNECTIONS, {
          color: 'rgba(31,122,134,0.9)',
          lineWidth: 3,
        })
        draw.drawLandmarks(h, {
          color: 'rgba(224,147,74,0.95)',
          lineWidth: 1,
          radius: 4,
        })
      }
      setMetrics((m) => ({ ...m, hands: hands.length }))
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  // ---- synthetic fallback (no camera) ----
  const runFallback = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 960
    canvas.height = 720
    const ctx = canvas.getContext('2d')!
    let t = 0
    const cx = 480
    const cy = 360
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const open = (Math.sin(t) * 0.5 + 0.5) * 70 + 16
      const w = 150
      // synthetic lip outline
      ctx.strokeStyle = 'rgba(31,122,134,0.9)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.ellipse(cx, cy, w, open, 0, 0, Math.PI * 2)
      ctx.stroke()
      // keypoints around the ellipse
      ctx.fillStyle = 'rgba(224,147,74,0.95)'
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(cx + Math.cos(a) * w, cy + Math.sin(a) * open, 4, 0, Math.PI * 2)
        ctx.fill()
      }
      setMetrics((m) => ({
        ...m,
        open: open / 86,
        round: 0.5 + Math.sin(t * 0.7) * 0.2,
      }))
      t += 0.05
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <section id="perception" className="relative scroll-mt-20 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          kicker="三模态感知 · 现场实时运行"
          title={<>看见每一个音，是怎么发出来的</>}
          lead="打开摄像头，AI 会实时勾出你唇部的关键点与手部的发音手势——这正是系统感知层的真实技术，全部在你的浏览器里运行，不上传、不联网。"
        />

        <Reveal className="mt-12">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* video stage */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-ink/95 shadow-xl shadow-teal/10">
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-90"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full -scale-x-100"
              />

              {/* idle / loading overlay */}
              {status !== 'live' && status !== 'fallback' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/80 text-center text-white/90">
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-teal-light" />
                      <p className="text-sm">正在唤醒摄像头与 AI 模型…</p>
                    </>
                  ) : (
                    <>
                      <Camera className="h-10 w-10 text-teal-light" />
                      <button
                        onClick={start}
                        className="rounded-full bg-teal px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5 hover:bg-teal-light"
                      >
                        打开摄像头，开始追踪
                      </button>
                      <p className="max-w-xs text-xs text-white/60">
                        浏览器会询问摄像头权限。画面只在本机处理，不会上传任何数据。
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* fallback banner */}
              {status === 'fallback' && (
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-amber/90 px-3 py-1.5 text-xs font-medium text-white">
                  <VideoOff className="h-3.5 w-3.5" />
                  {error ?? '模拟演示'} · 展示模拟追踪效果
                </div>
              )}
              {status === 'live' && (
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-teal/90 px-3 py-1.5 text-xs font-medium text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  实时追踪中
                </div>
              )}
            </div>

            {/* controls + readouts */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
                {(
                  [
                    { id: 'face', label: '唇形关键点', icon: Smile },
                    { id: 'hand', label: 'Cued 手势', icon: Hand },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setMode(t.id)}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors',
                      mode === t.id
                        ? 'bg-teal text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-teal/8',
                    )}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                ))}
              </div>

              {mode === 'face' ? (
                <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-ink">实时唇形几何</p>
                  <Meter label="开口度" value={metrics.open} hint="嘴唇上下张开的幅度" />
                  <Meter label="圆唇度" value={metrics.round} hint="嘴角横向展开的程度" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    系统从 MediaPipe 提取的 40 个唇部关键点中实时计算几何特征——这是判断
                    “这个音口型到不到位” 的基础。
                  </p>
                </div>
              ) : (
                <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-ink">Cued Speech 手势</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-teal">
                      {metrics.hands}
                    </span>
                    <span className="text-sm text-muted-foreground">只手在画面中</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Cued Speech 用 <b className="text-ink">8 种手形 × 5 个位置</b>{' '}
                    给发音“消歧”——比如 b / p / m 嘴型完全一样，靠手势区分。系统实时追踪
                    21 个手部关键点作为识别基础。
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-teal/15 bg-teal/5 p-4 text-xs leading-relaxed text-teal-deep">
                💡 这一切都跑在你的设备上：摄像头画面 <b>不上传、不联网</b>，
                关掉页面即清除。
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Meter({
  label,
  value,
  hint,
}: {
  label: string
  value: number
  hint: string
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-sm font-semibold text-teal">{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal to-amber transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
