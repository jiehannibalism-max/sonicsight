import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  Image as ImageIcon,
  Baby,
  HeartPulse,
  GraduationCap,
  Zap,
  FileSearch,
  Route,
  Glasses,
  Quote,
  ArrowRight,
} from 'lucide-react'
import { SectionHead, Reveal } from '@/components/site/Reveal'
import { asset, fadeUp, stagger } from '@/lib/site'
import { MOCK_EVALUATION } from '@/lib/mock'
import { cn } from '@/lib/utils'

// 代表性应用场景——基于真实目标人群（见「了解项目」），人物为场景设想，非真实个案
const STORIES = [
  {
    icon: Baby,
    img: 'img/story-child.jpg',
    badge: '家庭端',
    name: '朵朵 · 5 岁 · 语前聋',
    before: '听不见自己的声音，发「妈/爸」口型几乎一样，家长无法判断哪里不对。',
    tech: ['三模态感知', '三级对齐'],
    after: '手势+唇形+声音同时被看见，系统逐音素指出薄弱点，妈妈在家就能带练。',
  },
  {
    icon: HeartPulse,
    img: 'img/story-surgery.jpg',
    badge: '学校端',
    name: '小宇 · 12 岁 · 唇腭裂术后',
    before: '术后送气、鼻音控制不稳，传统训练靠老师主观听辨，难以量化进步。',
    tech: ['五维诊断', '训练闭环'],
    after: '气流、鼻音化维度被量化打分，每周复测看得见曲线，专项包对症训练。',
  },
  {
    icon: GraduationCap,
    img: 'img/story-teacher.jpg',
    badge: '职业重建',
    name: '陈老师 · 成年 · 语前聋',
    before: '想成为特教老师，但自身发音清晰度不足，缺少可反复练习的客观工具。',
    tech: ['训练闭环', '课程体系'],
    after: '按分级词库自训，多 Agent 给出家长/老师/孩子三种口径的反馈，持续打磨。',
  },
]

// 产品功能 × 背后技术 × 给用户带来的价值
const VALUE = [
  {
    icon: Zap,
    feature: '实时发音反馈',
    module: '三级对齐 + 动态门控',
    benefit: '说完即看到结果，哪一路信号可靠就给它更高权重，反馈又快又稳。',
  },
  {
    icon: FileSearch,
    feature: '错误诊断报告',
    module: '五维评估 + 诊断引擎',
    benefit: '不止说「对/错」，而是定位到「气流偏弱」「声调略偏」这种可操作的原因。',
  },
  {
    icon: Route,
    feature: '个性化训练计划',
    module: '多 Agent + 历史数据',
    benefit: '按错误类型匹配专项包，并按家长 / 老师 / 孩子换不同说法，照着练就行。',
  },
  {
    icon: Glasses,
    feature: '智能眼镜辅助（规划中）',
    module: '端云协同 + AR 渲染',
    benefit: '把手势提示、唇形引导、识别文字叠加在视野里，让训练融入日常对话。',
  },
]

const RADAR = [
  { dim: '唇形', v: Math.round(MOCK_EVALUATION.scores!.lip_shape * 100) },
  { dim: '声学', v: Math.round(MOCK_EVALUATION.scores!.acoustic * 100) },
  { dim: '时长', v: Math.round(MOCK_EVALUATION.scores!.duration * 100) },
  { dim: '气流', v: Math.round(MOCK_EVALUATION.scores!.airflow * 100) },
  { dim: '鼻音', v: Math.round(MOCK_EVALUATION.scores!.nasalization * 100) },
]

export function Impact() {
  return (
    <div className="pt-24">
      {/* hero */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            kicker="应用场景 · 社会价值"
            title={<>技术落到人身上，是什么样子</>}
            lead="下面是三类代表性场景——人物为场景设想，但他们对应的人群、痛点与我们的技术介入路径都是真实的。我们想让语言康复，从「少数人可获得的专业服务」，走向「更多普通家庭可持续使用的能力」。"
          />
        </div>
      </section>

      {/* 典型应用场景 */}
      <section className="px-5 pb-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-6 md:grid-cols-3"
          >
            {STORIES.map((s) => (
              <motion.div
                key={s.name}
                variants={fadeUp}
                className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="relative h-44 w-full">
                  <ImgSlot src={s.img} label={s.name} />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    {s.badge}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-amber/90 px-2.5 py-1 text-[11px] font-medium text-white">
                    场景示意
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal/10 text-teal">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <h4 className="text-base font-semibold text-ink">{s.name}</h4>
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber">训练前</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.before}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal">技术介入</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.tech.map((t) => (
                      <span key={t} className="rounded-full bg-teal/8 px-2.5 py-1 text-xs font-medium text-teal-deep">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal">期望改变</p>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-ink">{s.after}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 技术如何创造价值 */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            align="left"
            kicker="从技术到价值"
            title="每个功能，背后都有一块硬技术"
            lead="把产品功能、背后的技术模块、和它真正给用户带来的东西摆在一起——这是「识别只是第一步」的完整下半场。"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VALUE.map((v) => (
              <Reveal key={v.feature} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber/10 text-amber">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-lg font-semibold text-ink">{v.feature}</h4>
                    <p className="font-mono text-xs text-teal">{v.module}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.benefit}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 一份示意诊断报告 */}
      <section className="bg-sand/40 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            align="left"
            kicker="看得见的结果"
            title="一份示意诊断报告"
            lead="这就是一次「妈 mā」发音走完全流程后，系统给出的东西——评分、定位、建议，一目了然。"
          />
          <Reveal className="mt-8 grid gap-6 overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2">
            {/* radar */}
            <div className="border-border p-6 md:border-r">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">五维评分</p>
                <span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal">综合 72</span>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={RADAR} outerRadius="68%">
                    <PolarGrid stroke="#d8d2c6" />
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize: 13, fill: '#4a4a4a' }} />
                    <Radar dataKey="v" stroke="#1f7a86" fill="#1f7a86" fillOpacity={0.32} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-xs text-muted-foreground">气流轴明显内凹 → 一眼看出短板</p>
            </div>
            {/* report text */}
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐴</span>
                <div>
                  <p className="text-xs text-muted-foreground">识别结果</p>
                  <p className="text-xl font-semibold text-ink">「妈 mā」 ✓ 与目标一致</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <ReportRow tone="ok" label="唇形 82 / 声学 80 / 鼻音 88" text="口型到位、声音清晰、无异常鼻腔共鸣。" />
                <ReportRow tone="warn" label="气流 45 —— 主要短板" text="发音时呼出的气流偏弱，是当前最该练的一项。" />
                <ReportRow tone="ok" label="建议：送气专项" text="吹纸条 / 吹泡泡小游戏，每天 5 分钟，1–2 周后复测。" />
              </div>
              <a
                href="#/studio"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                自己录一句试试
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
          <p className="mt-3 text-xs text-muted-foreground">* 示意报告，数据用于演示完整「识别 → 诊断 → 建议」链路。</p>
        </div>
      </section>

      {/* 社会价值与愿景 */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal className="rounded-3xl border border-teal/20 bg-teal/[0.04] p-8 text-center sm:p-12">
            <Quote className="mx-auto h-8 w-8 text-teal/40" />
            <p className="mx-auto mt-4 max-w-2xl text-xl font-medium leading-relaxed text-ink">
              让语言康复，从「少数人可获得的专业服务」，转变为「更多普通家庭可持续使用的智能化公共能力」。
            </p>
            <p className="mt-3 text-sm text-muted-foreground">—— 项目策划书 · 社会价值</p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Vision title="探索方向" text="中文 Cued Speech 的多模态时间对齐方案" />
            <Vision title="服务对象" text="听障儿童 · 唇腭裂术后 · 特教与康复工作者" />
            <Vision title="长期目标" text="面向儿童的、可负担的无障碍 AI 交互范式" />
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            以上为项目方向与愿景陈述；具体落地进展以正式披露为准。需求侧数据见
            <a href="#/about" className="text-teal hover:underline"> 了解项目</a> 页。
          </p>
        </div>
      </section>
    </div>
  )
}

function ImgSlot({ src, label }: { src: string; label: string }) {
  const [ok, setOk] = useState(true)
  if (ok) {
    return (
      <img
        src={asset(src)}
        alt={label}
        onError={() => setOk(false)}
        className="h-full w-full object-cover"
      />
    )
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-teal/15 to-amber/15 text-center">
      <ImageIcon className="h-7 w-7 text-teal/50" />
      <span className="px-4 text-xs leading-relaxed text-muted-foreground">
        概念示意图 · 待补
        <br />
        <code className="text-[11px] text-teal">{src.split('/').pop()}</code>
      </span>
    </div>
  )
}

function ReportRow({ tone, label, text }: { tone: 'ok' | 'warn'; label: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-3.5">
      <span
        className={cn(
          'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
          tone === 'warn' ? 'bg-amber' : 'bg-teal',
        )}
      />
      <div>
        <p className={cn('text-sm font-semibold', tone === 'warn' ? 'text-amber' : 'text-ink')}>{label}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

function Vision({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink">{text}</p>
    </div>
  )
}
