import { useEffect, useRef, useState } from 'react'
import { Hand, Smile, AudioLines } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHead, Reveal } from './Reveal'

const WINDOW_MS = 600 // timeline spans 0..600ms
const PERIOD = 2600 // one sweep cycle

const TRACKS = [
  { key: 'hand', label: '手势', icon: Hand, raw: 70, color: '#1f7a86' },
  { key: 'lip', label: '唇动', icon: Smile, raw: 250, color: '#4aa9b3' },
  { key: 'audio', label: '声音', icon: AudioLines, raw: 410, color: '#e0934a' },
] as const

export function SectionAlignment() {
  const [aligned, setAligned] = useState(false)
  const [head, setHead] = useState(0) // 0..1 playhead
  const rafRef = useRef(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const p = ((now - startRef.current) % PERIOD) / PERIOD
      setHead(p)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const headMs = head * WINDOW_MS
  const target = (t: (typeof TRACKS)[number]) => (aligned ? 250 : t.raw)

  return (
    <section
      id="alignment"
      className="relative scroll-mt-20 bg-sand/40 px-5 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHead
          kicker="时间的秘密 · 签名级技术"
          title={<>手，总是比嘴快半拍</>}
          lead="Cued Speech 有个反直觉的规律：发音手势会比嘴唇动作领先 144–239 毫秒。不处理这个时间差，三种信号就对不齐。这是我们融合算法的核心。"
        />

        <Reveal className="mt-12">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-teal/5 sm:p-8">
            {/* toggle */}
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex rounded-full border border-border bg-muted/60 p-1">
                <button
                  onClick={() => setAligned(false)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    !aligned ? 'bg-amber text-white shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  对齐前 · 各说各话
                </button>
                <button
                  onClick={() => setAligned(true)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    aligned ? 'bg-teal text-white shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  对齐后 · 三流合一
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {aligned
                  ? '系统把手势延后、声音提前，三个信号落在同一时刻 —— 才能判断这是同一个「ma」。'
                  : '同一个「ma」，手势先到、嘴跟上、声音最后 —— 时间轴上是错开的。'}
              </p>
            </div>

            {/* timeline */}
            <div className="space-y-5">
              {TRACKS.map((t) => {
                const evMs = target(t)
                const evPct = (evMs / WINDOW_MS) * 100
                // pulse strength when playhead is near the event
                const dpx = Math.abs(headMs - evMs)
                const glow = Math.max(0, 1 - dpx / 70)
                return (
                  <div key={t.key} className="flex items-center gap-3">
                    <div className="flex w-20 shrink-0 items-center gap-2 text-sm font-medium text-ink">
                      <t.icon className="h-4 w-4" style={{ color: t.color }} />
                      {t.label}
                    </div>
                    <div className="relative h-12 flex-1 overflow-hidden rounded-xl bg-muted/70">
                      {/* baseline */}
                      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                      {/* event marker */}
                      <div
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-500 ease-out"
                        style={{ left: `${evPct}%` }}
                      >
                        <div
                          className="rounded-full"
                          style={{
                            width: 18 + glow * 18,
                            height: 18 + glow * 18,
                            background: t.color,
                            opacity: 0.25 + glow * 0.75,
                            boxShadow: `0 0 ${glow * 26}px ${t.color}`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* shared time axis + playhead */}
              <div className="relative ml-[5.75rem] h-6">
                <div
                  className="absolute top-0 h-6 w-px bg-ink/40"
                  style={{ left: `${head * 100}%` }}
                />
                {[0, 150, 300, 450, 600].map((ms) => (
                  <span
                    key={ms}
                    className="absolute -translate-x-1/2 text-[11px] text-muted-foreground"
                    style={{ left: `${(ms / WINDOW_MS) * 100}%`, top: 8 }}
                  >
                    {ms}ms
                  </span>
                ))}
              </div>
            </div>

            {/* lead gap callout */}
            {!aligned && (
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <GapCard from="手势" to="唇动" ms="≈ 180ms" />
                <GapCard from="唇动" to="声音" ms="≈ 160ms" />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function GapCard({ from, to, ms }: { from: string; to: string; ms: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">
      <span className="text-sm text-muted-foreground">
        <b className="text-ink">{from}</b> 领先 <b className="text-ink">{to}</b>
      </span>
      <span className="text-lg font-semibold text-amber">{ms}</span>
    </div>
  )
}
