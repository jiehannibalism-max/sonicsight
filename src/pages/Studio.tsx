import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Gauge,
  FileText,
  ListChecks,
  Play,
  Check,
  Clock,
} from 'lucide-react'
import { SectionTraining } from '@/components/site/SectionTraining'
import { SectionHead, Reveal } from '@/components/site/Reveal'
import { MOCK_EVALUATION, getMockAgent } from '@/lib/mock'
import type { Audience } from '@/types'
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

          {/* controls */}
          <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex rounded-full border border-border bg-card p-1">
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
            <button
              onClick={run}
              className="inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber/20 transition-transform hover:-translate-y-0.5"
            >
              <Play className="h-4 w-4" />
              {step === -1 ? '运行完整流程' : '重新运行'}
            </button>
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
                          {agent.training_plan.actions.map((a) => (
                            <div key={a.id} className="rounded-2xl border border-border bg-background p-4">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-ink">{a.title}</p>
                                <span className="flex items-center gap-1 text-xs text-amber">
                                  <Clock className="h-3 w-3" />
                                  {a.duration}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
                            </div>
                          ))}
                        </div>
                      </Stage>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}

          {step === -1 && (
            <Reveal className="mt-10 rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
              👆 选择对象，点「运行完整流程」，看一份发音如何走完识别→诊断→建议
            </Reveal>
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
