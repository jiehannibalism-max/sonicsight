import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { Smile, AudioLines, Timer, Wind, Waves, Sparkles } from 'lucide-react'
import type { DimensionKey } from '@/types'
import { cn } from '@/lib/utils'
import { SectionHead, Reveal } from './Reveal'
import { Soundwave } from './Soundwave'

const DIM_ICON: Record<DimensionKey, typeof Smile> = {
  lip_shape: Smile,
  acoustic: AudioLines,
  duration: Timer,
  airflow: Wind,
  nasalization: Waves,
}
const DIM_LABEL: Record<DimensionKey, string> = {
  lip_shape: '唇形',
  acoustic: '声学',
  duration: '时长',
  airflow: '气流',
  nasalization: '鼻音',
}
const DIM_ORDER: DimensionKey[] = [
  'lip_shape',
  'acoustic',
  'duration',
  'airflow',
  'nasalization',
]

type Sample = {
  id: string
  pinyin: string
  emoji: string
  overall: number
  scores: Record<DimensionKey, number>
  weak: DimensionKey
  focus: string
}

const SAMPLES: Sample[] = [
  { id: 'ma', pinyin: 'mā', emoji: '🐴', overall: 72, focus: '送气力度偏弱', weak: 'airflow',
    scores: { lip_shape: 82, acoustic: 80, duration: 65, airflow: 45, nasalization: 88 } },
  { id: 'ba', pinyin: 'bā', emoji: '🍃', overall: 67, focus: '爆破音带了点鼻音', weak: 'nasalization',
    scores: { lip_shape: 78, acoustic: 74, duration: 70, airflow: 60, nasalization: 55 } },
  { id: 'da', pinyin: 'dā', emoji: '🥁', overall: 74, focus: '舌尖位置略偏', weak: 'acoustic',
    scores: { lip_shape: 85, acoustic: 64, duration: 72, airflow: 70, nasalization: 84 } },
  { id: 'ta', pinyin: 'tā', emoji: '💨', overall: 76, focus: '音拖得有点长', weak: 'duration',
    scores: { lip_shape: 80, acoustic: 77, duration: 56, airflow: 84, nasalization: 80 } },
  { id: 'ge', pinyin: 'gē', emoji: '🎵', overall: 70, focus: '舌根音不够靠后', weak: 'acoustic',
    scores: { lip_shape: 71, acoustic: 60, duration: 75, airflow: 72, nasalization: 85 } },
]

const TONES = [
  { id: 'parent', label: '给家长', emoji: '👨‍👩‍👧' },
  { id: 'teacher', label: '给老师', emoji: '🧑‍🏫' },
  { id: 'child', label: '给孩子', emoji: '🧒' },
] as const

function diagnosisText(tone: string, s: Sample): string {
  const w = DIM_LABEL[s.weak]
  if (tone === 'parent')
    return `孩子的「${s.pinyin}」整体不错，${s.overall} 分！嘴型和声音都挺准，主要是${s.focus}。在家陪他练几天就能上来，不用紧张。`
  if (tone === 'teacher')
    return `「${s.pinyin}」综合得分 ${s.overall}。多数维度达标，${w}维度偏低（${s.focus}），建议安排 1–2 周${w}专项训练后复测，建立纵向档案。`
  return `哇！你的「${s.pinyin}」已经 ${s.overall} 分啦 🎉 嘴巴张得超好看！我们再一起练一个小魔法——${s.focus}，很快就能拿满分！`
}

export function SectionDiagnosis() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'done'>('idle')
  const [tone, setTone] = useState<string>('parent')
  const s = SAMPLES[idx]

  const radarData = useMemo(
    () =>
      DIM_ORDER.map((k) => ({ short: DIM_LABEL[k], value: s.scores[k], key: k })),
    [s],
  )

  function run(i: number) {
    setIdx(i)
    setPhase('analyzing')
    window.setTimeout(() => setPhase('done'), 1500)
  }

  return (
    <section id="diagnosis" className="relative scroll-mt-20 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          kicker="五维诊断 · 不只是听懂，更要发得准"
          title={<>一个音，五个维度看穿它</>}
          lead="普通语音识别只回答“你说了什么”。我们回答“发得标不标准、哪里不到位、怎么改”——从唇形、声学、时长、气流、鼻音五个维度，给出可训练的诊断。"
        />

        {/* phoneme picker */}
        <Reveal className="mt-10 flex flex-wrap justify-center gap-3">
          {SAMPLES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => run(i)}
              className={cn(
                'flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-base font-medium transition-all',
                idx === i && phase !== 'idle'
                  ? 'border-teal bg-teal text-white shadow-md shadow-teal/20'
                  : 'border-border bg-card text-ink hover:border-teal/40 hover:-translate-y-0.5',
              )}
            >
              <span className="text-xl">{p.emoji}</span>
              {p.pinyin}
            </button>
          ))}
        </Reveal>

        {phase === 'idle' && (
          <Reveal className="mt-10 text-center text-sm text-muted-foreground">
            👆 选一个音，看 AI 当场出一份发音诊断
          </Reveal>
        )}

        <AnimatePresence mode="wait">
          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-12 max-w-xl"
            >
              <div className="rounded-3xl border border-border bg-card p-8 text-center">
                <p className="mb-4 text-sm font-medium text-teal">
                  正在分析「{s.pinyin}」的唇形、声学与气流…
                </p>
                <Soundwave height={120} bars={72} />
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]"
            >
              {/* radar + overall */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-teal/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.emoji}</span>
                    <div>
                      <p className="text-sm text-muted-foreground">目标音</p>
                      <p className="text-2xl font-semibold text-ink">{s.pinyin}</p>
                    </div>
                  </div>
                  <Gauge value={s.overall} />
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="short"
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 13 }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      dataKey="value"
                      stroke="var(--teal)"
                      fill="var(--teal)"
                      fillOpacity={0.25}
                      strokeWidth={2}
                      isAnimationActive
                      animationDuration={1100}
                      dot={{ r: 3, fill: 'var(--amber)', strokeWidth: 0 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>

                {/* dimension bars */}
                <div className="mt-2 space-y-2.5">
                  {DIM_ORDER.map((k) => {
                    const Icon = DIM_ICON[k]
                    const v = s.scores[k]
                    const weak = k === s.weak
                    return (
                      <div key={k} className="flex items-center gap-3">
                        <Icon
                          className={cn('h-4 w-4 shrink-0', weak ? 'text-amber' : 'text-teal')}
                        />
                        <span className="w-10 shrink-0 text-sm text-muted-foreground">
                          {DIM_LABEL[k]}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={cn(
                              'h-full rounded-full',
                              weak ? 'bg-amber' : 'bg-teal',
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${v}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                          />
                        </div>
                        <span
                          className={cn(
                            'w-8 shrink-0 text-right text-sm font-semibold',
                            weak ? 'text-amber' : 'text-ink',
                          )}
                        >
                          {v}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* diagnosis card + tone */}
              <div className="flex flex-col gap-5">
                <div className="rounded-3xl border border-amber/30 bg-amber/5 p-6">
                  <div className="mb-2 flex items-center gap-2 text-amber">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">薄弱点诊断</span>
                  </div>
                  <p className="text-lg font-medium text-ink">{s.focus}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    其余维度表现良好，重点针对「{DIM_LABEL[s.weak]}」训练即可。
                  </p>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6">
                  <div className="mb-4 inline-flex rounded-full border border-border bg-muted/60 p-1">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={cn(
                          'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                          tone === t.id
                            ? 'bg-teal text-white shadow-sm'
                            : 'text-muted-foreground hover:text-teal',
                        )}
                      >
                        <span className="mr-1">{t.emoji}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={tone + idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-[15px] leading-relaxed text-ink"
                    >
                      {diagnosisText(tone, s)}
                    </motion.p>
                  </AnimatePresence>
                  <p className="mt-4 text-xs text-muted-foreground">
                    同一份诊断，由 Coze 多 Agent 自动翻译成家长、老师、孩子各自能懂的话。
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Gauge({ value }: { value: number }) {
  const r = 30
  const c = 2 * Math.PI * r
  const off = c * (1 - value / 100)
  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--muted)" strokeWidth="8" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--teal)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-ink">{value}</span>
        <span className="text-[10px] text-muted-foreground">综合</span>
      </div>
    </div>
  )
}
