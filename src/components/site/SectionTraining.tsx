import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ClipboardCheck, GraduationCap, Trophy, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHead, Reveal } from './Reveal'

const NODES = [
  { icon: Camera, label: '采集', desc: '摄像头 + 麦克风同步采集一次发音，唇形、手势、声音一起进来。' },
  { icon: ClipboardCheck, label: '评估 Agent', desc: '把五维评分翻译成家长 / 老师 / 孩子各自听得懂的自然语言诊断。' },
  { icon: GraduationCap, label: '训练 Agent', desc: '按薄弱音推荐针对性的训练词表、口型示范与练习时长。' },
  { icon: Trophy, label: '激励 Agent', desc: '游戏化打卡与奖励反馈，让孩子愿意一次次开口练下去。' },
  { icon: RefreshCw, label: '复测', desc: '再采集一次，对比五维分数的进步，闭环回到起点。' },
]

export function SectionTraining() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % NODES.length),
      2600,
    )
    return () => window.clearInterval(id)
  }, [])

  const R = 140 // ring radius
  const size = 360

  return (
    <section
      id="training"
      className="relative scroll-mt-20 bg-sand/40 px-5 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHead
          kicker="训练闭环 · 零代码 Agent 编排"
          title={<>评完不是结束，是下一次练习的开始</>}
          lead="评估 → 训练 → 激励 → 再评估，五个 Coze 智能体接力，把三甲医院言语治疗师的能力，变成家里就能用的训练闭环。"
        />

        <Reveal className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          {/* ring */}
          <div className="relative mx-auto" style={{ width: size, height: size }}>
            {/* connecting circle */}
            <svg
              className="absolute inset-0"
              viewBox={`0 0 ${size} ${size}`}
              fill="none"
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={R}
                stroke="var(--border)"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={R}
                stroke="var(--teal)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * R}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * R * (1 - (active + 1) / NODES.length),
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ rotate: -90, transformOrigin: 'center' }}
              />
            </svg>

            {/* center */}
            <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-card text-center shadow-lg">
              <span className="text-2xl font-semibold text-gradient">闭环</span>
              <span className="text-xs text-muted-foreground">训练系统</span>
            </div>

            {/* nodes */}
            {NODES.map((n, i) => {
              const ang = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
              const x = size / 2 + Math.cos(ang) * R
              const y = size / 2 + Math.sin(ang) * R
              const on = i === active
              const Icon = n.icon
              return (
                <button
                  key={n.label}
                  onClick={() => setActive(i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: x, top: y }}
                >
                  <motion.div
                    animate={{ scale: on ? 1.12 : 1 }}
                    className={cn(
                      'flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-2xl border text-center transition-colors',
                      on
                        ? 'border-teal bg-teal text-white shadow-lg shadow-teal/30'
                        : 'border-border bg-card text-muted-foreground',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium leading-tight">
                      {n.label}
                    </span>
                  </motion.div>
                </button>
              )
            })}
          </div>

          {/* detail */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-lg shadow-teal/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-medium text-amber">
                  第 {active + 1} 步 / 共 {NODES.length} 步
                </span>
                <h3 className="mt-2 flex items-center gap-2 text-2xl font-semibold text-ink">
                  {NODES[active].label}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {NODES[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-1.5">
              {NODES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors',
                    i === active ? 'bg-teal' : 'bg-border',
                  )}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
