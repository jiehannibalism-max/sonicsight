import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, Smile, AudioLines, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHead, Reveal } from './Reveal'

const WINDOW_MS = 600
const PERIOD = 3200

const TRACKS = [
  { key: 'hand', label: '手势', icon: Hand, raw: 70, color: '#134e5a', cap: '手势先出现 ✋' },
  { key: 'lip', label: '唇动', icon: Smile, raw: 250, color: '#1f7a86', cap: '嘴唇跟上 👄' },
  { key: 'audio', label: '声音', icon: AudioLines, raw: 410, color: '#e0934a', cap: '声音最后到 🔊' },
] as const

const STRATEGIES = ['时间戳粗对齐', '互相关精对齐', 'DTW 动态时间规整']

export function SectionAlignment() {
  const [aligned, setAligned] = useState(false)
  const [head, setHead] = useState(0)
  const rafRef = useRef(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      setHead((((now - startRef.current) % PERIOD) / PERIOD))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const headMs = head * WINDOW_MS
  const evMs = (t: (typeof TRACKS)[number]) => (aligned ? 250 : t.raw)

  // narrated caption follows the playhead (only in "对齐前")
  let caption = '三路信号在时间轴上是错开的'
  if (aligned) {
    caption = '三路拉齐 → 系统确认这是同一个「妈」'
  } else {
    const passed = TRACKS.filter((t) => headMs >= t.raw - 30)
    if (passed.length) caption = passed[passed.length - 1].cap
  }

  return (
    <section className="scroll-mt-20 px-5 pt-28 pb-24">
      <div className="mx-auto max-w-5xl">
        <SectionHead
          kicker="时间对齐 · 我们最硬核的一步"
          title={<>手，总是比嘴快半拍</>}
          lead="说一个「妈」，手势会比嘴唇早 144–239 毫秒出现，声音还要更晚。这不是误差，是 Cued Speech 的生理规律。不把三路在时间上拉齐，融合就会失败。"
        />

        <Reveal className="mt-12">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-teal/5 sm:p-8">
            {/* demo syllable + toggle */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐴</span>
                <div>
                  <p className="text-xs text-muted-foreground">正在演示</p>
                  <p className="text-xl font-semibold text-ink">说「妈」 → ma</p>
                </div>
              </div>
              <div className="inline-flex rounded-full border border-border bg-muted/60 p-1">
                <button
                  onClick={() => setAligned(false)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    !aligned ? 'bg-amber text-white shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  对齐前
                </button>
                <button
                  onClick={() => setAligned(true)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    aligned ? 'bg-teal text-white shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  对齐后
                </button>
              </div>
            </div>

            {/* narrated caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={caption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                  aligned ? 'bg-teal/10 text-teal' : 'bg-amber/10 text-amber',
                )}
              >
                {aligned && <Check className="h-4 w-4" />}
                {caption}
              </motion.div>
            </AnimatePresence>

            {/* timeline */}
            <div className="space-y-5">
              {TRACKS.map((t) => {
                const pct = (evMs(t) / WINDOW_MS) * 100
                const glow = Math.max(0, 1 - Math.abs(headMs - evMs(t)) / 70)
                return (
                  <div key={t.key} className="flex items-center gap-3">
                    <div className="flex w-16 shrink-0 items-center gap-2 text-sm font-medium text-ink">
                      <t.icon className="h-4 w-4" style={{ color: t.color }} />
                      {t.label}
                    </div>
                    <div className="relative h-12 flex-1 overflow-hidden rounded-xl bg-muted/70">
                      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                      <div
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-700 ease-out"
                        style={{ left: `${pct}%` }}
                      >
                        <div
                          className="flex items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{
                            width: 20 + glow * 16,
                            height: 20 + glow * 16,
                            background: t.color,
                            opacity: 0.3 + glow * 0.7,
                            boxShadow: `0 0 ${glow * 24}px ${t.color}`,
                          }}
                        >
                          {glow > 0.6 ? '妈' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* axis + playhead */}
              <div className="relative ml-[4.75rem] h-6">
                <div className="absolute top-0 h-6 w-px bg-ink/40" style={{ left: `${head * 100}%` }} />
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

            {/* bottom: gaps OR strategies */}
            <AnimatePresence mode="wait">
              {!aligned ? (
                <motion.div
                  key="gaps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-7 grid gap-3 sm:grid-cols-2"
                >
                  <Gap from="手势" to="唇动" ms="≈ 180ms" />
                  <Gap from="唇动" to="声音" ms="≈ 160ms" />
                </motion.div>
              ) : (
                <motion.div
                  key="strat"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-7"
                >
                  <p className="mb-3 text-sm text-muted-foreground">系统用三级策略把三路拉齐：</p>
                  <div className="flex flex-wrap gap-2">
                    {STRATEGIES.map((s, i) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1.5 text-sm font-medium text-teal-deep"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-xs text-white">
                          {i + 1}
                        </span>
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Gap({ from, to, ms }: { from: string; to: string; ms: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">
      <span className="text-sm text-muted-foreground">
        <b className="text-ink">{from}</b> 领先 <b className="text-ink">{to}</b>
      </span>
      <span className="text-lg font-semibold text-amber">{ms}</span>
    </div>
  )
}
