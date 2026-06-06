import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Gauge,
  FileText,
  ListChecks,
  Check,
  Clock,
  Target,
  FlaskConical,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'
import { SectionTraining } from '@/components/site/SectionTraining'
import { SectionHead, Reveal } from '@/components/site/Reveal'
import { VoiceCapture } from '@/components/site/VoiceCapture'
import { MOCK_EVALUATION, getMockAgent } from '@/lib/mock'
import type { Audience, TrainingAction } from '@/types'
import { cn } from '@/lib/utils'

const AUDS: { id: Audience; label: string; emoji: string }[] = [
  { id: 'parent', label: '家长', emoji: '👨‍👩‍👧' },
  { id: 'teacher', label: '老师', emoji: '🧑‍🏫' },
  { id: 'child', label: '孩子', emoji: '🧒' },
]

const STAGES = [
  { icon: Mic, label: '采集与识别', key: 'recognize' },
  { icon: Gauge, label: '五维评分', key: 'score' },
  { icon: FileText, label: '诊断解读', key: 'diagnose' },
  { icon: ListChecks, label: '训练建议', key: 'plan' },
]

export function Studio() {
  const [aud, setAud] = useState<Audience>('parent')
  const [step, setStep] = useState(-1) // -1 idle; 0..3 running/done
  const agent = getMockAgent(aud)
  const ev = MOCK_EVALUATION
  const done = step >= STAGES.length - 1

  function run() {
    setStep(0)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setStep(i)
      if (i >= STAGES.length - 1) window.clearInterval(id)
    }, 850)
  }

  return (
    <div className="pt-28">
      <section className="px-5 pb-8">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            kicker="训练闭环 · 从识别到建议"
            title={<>完整走一遍：识别 → 诊断 → 建议</>}
            lead="识别音素只是第一步。系统把五维评分解读成自然语言诊断，再生成个性化训练建议——而且会按家长、老师、孩子不同对象，换不同的说法。"
          />

          {/* audience + real voice capture */}
          <Reveal className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-border bg-card p-1">
              <span className="px-3 py-2 text-sm text-muted-foreground">反馈对象</span>
              {AUDS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAud(a.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    aud === a.id ? 'bg-teal text-white shadow-sm' : 'text-muted-foreground hover:text-teal',
                  )}
                >
                  <span className="mr-1">{a.emoji}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-6 max-w-2xl">
            <VoiceCapture onComplete={run} />
          </Reveal>

          {/* pipeline */}
          {step >= 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-[200px_1fr]">
              {/* stepper */}
              <div className="flex gap-3 sm:flex-col">
                {STAGES.map((s, i) => {
                  const active = step >= i
                  return (
                    <div key={s.key} className="flex flex-1 items-center gap-3 sm:flex-none">
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors',
                          active ? 'border-teal bg-teal text-white' : 'border-border bg-card text-muted-foreground',
                        )}
                      >
                        {step > i ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                      </span>
                      <span className={cn('text-sm font-medium', active ? 'text-ink' : 'text-muted-foreground')}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* stage content */}
              <div className="min-h-[340px] rounded-3xl border border-border bg-card p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 0 && (
                      <Stage title="采集与识别">
                        <p className="text-muted-foreground">三模态信号进入，识别出目标音素：</p>
                        <div className="mt-4 flex items-center gap-4">
                          <span className="text-5xl">🐴</span>
                          <div>
                            <p className="text-3xl font-semibold text-ink">{ev.recognized_phoneme}</p>
                            <p className="text-sm text-teal">识别置信度高，与目标一致 ✓</p>
                          </div>
                        </div>
                      </Stage>
                    )}
                    {step === 1 && (
                      <Stage title="五维评分">
                        <div className="space-y-2.5">
                          {ev.scores &&
                            (['lip_shape', 'acoustic', 'duration', 'airflow', 'nasalization'] as const).map((k) => {
                              const labels = { lip_shape: '唇形', acoustic: '声学', duration: '时长', airflow: '气流', nasalization: '鼻音' }
                              const v = Math.round((ev.scores![k]) * 100)
                              const weak = ev.weak_dimensions.includes(k)
                              return (
                                <div key={k} className="flex items-center gap-3">
                                  <span className="w-10 text-sm text-muted-foreground">{labels[k]}</span>
                                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                    <motion.div
                                      className={cn('h-full rounded-full', weak ? 'bg-amber' : 'bg-teal')}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${v}%` }}
                                      transition={{ duration: 0.8 }}
                                    />
                                  </div>
                                  <span className={cn('w-8 text-right text-sm font-semibold', weak ? 'text-amber' : 'text-ink')}>{v}</span>
                                </div>
                              )
                            })}
                        </div>
                      </Stage>
                    )}
                    {step === 2 && (
                      <Stage title="诊断解读">
                        <p className="text-base leading-relaxed text-ink">{agent.diagnosis.body}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {agent.diagnosis.highlights.map((h) => (
                            <span key={h} className="rounded-full bg-teal/8 px-3 py-1.5 text-xs font-medium text-teal-deep">
                              {h}
                            </span>
                          ))}
                        </div>
                      </Stage>
                    )}
                    {step >= 3 && (
                      <Stage title={agent.training_plan.title}>
                        <div className="space-y-3">
                          {agent.training_plan.actions.map((a, i) => (
                            <TaskCard key={a.id} a={a} defaultOpen={i === 0} />
                          ))}
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                          每个任务都附训练目标、科学原理与达标标准——照着练，不是「玩一下」。
                        </p>
                      </Stage>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}

          {done && (
            <Reveal className="mt-6 text-center text-sm text-teal">
              ✓ 完整流程跑通——这正是下面这套多 Agent 闭环在背后做的事
            </Reveal>
          )}
        </div>
      </section>

      {/* multi-agent ring */}
      <SectionTraining />
    </div>
  )
}

function Stage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-teal">{title}</p>
      {children}
    </div>
  )
}

function TaskCard({ a, defaultOpen }: { a: TrainingAction; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  const hasDetail = a.goal || a.rationale || a.steps?.length || a.criteria || a.progression
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <p className="font-medium text-ink">{a.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="flex items-center gap-1 whitespace-nowrap text-xs text-amber">
            <Clock className="h-3 w-3" />
            {a.duration}
          </span>
          {hasDetail && (
            <ChevronDown
              className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')}
            />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && hasDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-border px-4 pb-4 pt-3 text-sm">
              {a.goal && <DetailRow icon={Target} label="训练目标" tone="teal">{a.goal}</DetailRow>}
              {a.rationale && (
                <DetailRow icon={FlaskConical} label="科学原理" tone="teal">{a.rationale}</DetailRow>
              )}
              {a.steps?.length > 0 && (
                <div className="flex gap-2.5">
                  <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal">操作步骤</p>
                    <ol className="mt-1.5 space-y-1">
                      {a.steps.map((st, i) => (
                        <li key={i} className="flex gap-2 text-muted-foreground">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal/10 text-[10px] font-semibold text-teal">
                            {i + 1}
                          </span>
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
              {a.criteria && (
                <DetailRow icon={CheckCircle2} label="达标标准" tone="amber">{a.criteria}</DetailRow>
              )}
              {a.progression && (
                <DetailRow icon={TrendingUp} label="进阶方向" tone="amber">{a.progression}</DetailRow>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  tone,
  children,
}: {
  icon: typeof Target
  label: string
  tone: 'teal' | 'amber'
  children: ReactNode
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tone === 'amber' ? 'text-amber' : 'text-teal')} />
      <div>
        <p
          className={cn(
            'text-xs font-semibold uppercase tracking-wide',
            tone === 'amber' ? 'text-amber' : 'text-teal',
          )}
        >
          {label}
        </p>
        <p className="mt-0.5 leading-relaxed text-muted-foreground">{children}</p>
      </div>
    </div>
  )
}
