import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, Smile, AudioLines, Check, X, Layers, Crosshair, Waypoints, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHead, Reveal } from './Reveal'

const WINDOW_MS = 600
const PERIOD = 3200

const TRACKS = [
  { key: 'hand', label: '手势', icon: Hand, raw: 70, color: '#134e5a', cap: '手势先出现 ✋' },
  { key: 'lip', label: '唇动', icon: Smile, raw: 250, color: '#1f7a86', cap: '嘴唇跟上 👄' },
  { key: 'audio', label: '声音', icon: AudioLines, raw: 410, color: '#e0934a', cap: '声音最后到 🔊' },
] as const

const STEPS = [
  {
    icon: Layers,
    n: '①',
    title: '时间戳粗对齐',
    analogy: '像给三路各发一个计时器，先按大致起点把它们切成对应的片段。',
    tech: '以毫秒级时间戳为锚点，把手势 / 唇动 / 声音切成同名音节区间，先消掉「整段错位」。',
  },
  {
    icon: Crosshair,
    n: '②',
    title: '互相关精对齐',
    analogy: '像调音师对齐两条音轨——来回滑动，找到最「合拍」的那个位置。',
    tech: '在 ±300ms 内滑动计算三路特征的互相关，相关性峰值即最优偏移量，锁定到帧级。',
  },
  {
    icon: Waypoints,
    n: '③',
    title: 'DTW 动态时间规整',
    analogy: '像导航动态绕开拥堵——允许局部快一点、慢一点，弹性地一一对上。',
    tech: '用动态时间规整逐帧软对齐，吸收个体语速差异，让三路最终在每一帧上精确配准。',
  },
]

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
          title={<>手，总是比嘴快半拍——这反而是我们的优势</>}
          lead="说一个「妈」，手势会比嘴唇早出现，声音还要更晚。这不是误差，是 Cued Speech 的生理规律。别人的系统把三路「强行同步」，结果把音听错；我们把它们「聪明地对齐」，所以听得准。"
        />

        {/* 大数字带 */}
        <Reveal className="mt-10 grid gap-3 sm:grid-cols-3">
          <Stat big="144–239" unit="ms" label="手势天生领先唇动" sub="Cued Speech 生理规律，非系统延迟" />
          <Stat big="3" unit="路" label="手势 · 唇动 · 声音同时入" sub="缺一路，识别就不稳" />
          <Stat big="3" unit="级" label="粗 → 精 → 弹性 逐级对齐" sub="对到帧级，再做融合" />
        </Reveal>

        {/* 交互时间轴 */}
        <Reveal className="mt-8">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-teal/5 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐴</span>
                <div>
                  <p className="text-xs text-muted-foreground">拖动开关，看错位是怎么被拉齐的</p>
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
                  key="ok"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-7 flex items-center gap-2 rounded-2xl border border-teal/20 bg-teal/5 px-5 py-4 text-sm text-teal-deep"
                >
                  <Check className="h-5 w-5 shrink-0" />
                  三路对到同一时刻，融合才有意义——这是后面五维诊断能成立的前提。
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* 为什么是优势：传统 vs 聆光 */}
        <Reveal className="mt-16">
          <h3 className="text-center text-2xl font-semibold text-ink">同一段「妈」，两种系统两种结果</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            手势、唇动、声音落在不同时刻。怎么处理这半拍的差，直接决定听得对不对。
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <CompareCard
              variant="bad"
              tag="传统多模态系统"
              method="按「同一时刻」硬切三路"
              chain={['同一帧强行取手势+唇+声', '三路特征其实错开了半拍', '特征对不上、互相干扰']}
              out="bā"
              outNote="把「妈」误判成「八」——b / p / m 都是双唇音，靠时序和气流才分得开"
            />
            <CompareCard
              variant="good"
              tag="聆光 · 三级对齐"
              method="先各归其位，再融合"
              chain={['粗对齐切片 → 精对齐找偏移', 'DTW 逐帧弹性配准', '三路特征精准对上']}
              out="mā"
              outNote="稳定输出「妈」——把生理性的「半拍差」从干扰变成了可用的信息"
            />
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            * 时序差 144–239ms 引自项目策划书核心创新点；上图为机制示意，说明「为何对齐与否会改变识别结果」。
          </p>
        </Reveal>

        {/* 怎么做到的：三级机制 */}
        <Reveal className="mt-16">
          <h3 className="text-center text-2xl font-semibold text-ink">我们怎么做到的：三级对齐机制</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            不是「强行拉齐」，而是从粗到精、再到弹性，逐级把三路对到一起。
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-3xl border border-border bg-card p-6">
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-3.5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-teal/40 md:block" />
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal/10 text-teal">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-amber">{s.n}</p>
                    <h4 className="text-lg font-semibold text-ink">{s.title}</h4>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink">{s.analogy}</p>
                <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                  {s.tech}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Stat({ big, unit, label, sub }: { big: string; unit: string; label: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 text-center">
      <p className="text-3xl font-bold text-teal">
        {big}
        <span className="ml-1 text-base font-semibold text-amber">{unit}</span>
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
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

function CompareCard({
  variant,
  tag,
  method,
  chain,
  out,
  outNote,
}: {
  variant: 'good' | 'bad'
  tag: string
  method: string
  chain: string[]
  out: string
  outNote: string
}) {
  const good = variant === 'good'
  return (
    <div
      className={cn(
        'flex flex-col rounded-3xl border p-6',
        good ? 'border-teal/30 bg-teal/[0.04]' : 'border-amber/30 bg-amber/[0.04]',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full text-white',
            good ? 'bg-teal' : 'bg-amber',
          )}
        >
          {good ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </span>
        <span className={cn('text-sm font-semibold', good ? 'text-teal-deep' : 'text-amber')}>{tag}</span>
      </div>
      <p className="mt-3 text-base font-medium text-ink">{method}</p>
      <ol className="mt-4 space-y-2">
        {chain.map((c, i) => (
          <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-ink">
              {i + 1}
            </span>
            {c}
          </li>
        ))}
      </ol>
      <div
        className={cn(
          'mt-5 rounded-2xl border p-4',
          good ? 'border-teal/20 bg-card' : 'border-amber/20 bg-card',
        )}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">输出</span>
          <span className={cn('font-mono text-3xl font-bold', good ? 'text-teal' : 'text-amber')}>{out}</span>
          <span className={good ? 'text-teal' : 'text-amber'}>{good ? '✓' : '✗'}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{outNote}</p>
      </div>
    </div>
  )
}
