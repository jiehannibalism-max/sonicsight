import { Link } from 'react-router-dom'
import { ArrowRight, ScanFace, Gauge, Repeat } from 'lucide-react'
import { Reveal } from './Reveal'

const FLOW = [
  {
    icon: ScanFace,
    step: '你刚才看到的',
    title: '三模态实时感知',
    desc: '唇形几何、手部关键点、语音能量被同时采集——这是原始信号。',
  },
  {
    icon: Gauge,
    step: '接下来发生的',
    title: '送入五维诊断引擎',
    desc: '原始信号被换算成唇形 / 声学 / 时长 / 气流 / 鼻音五个维度的可训练评分。',
  },
  {
    icon: Repeat,
    step: '最终给到你',
    title: '诊断报告 + 训练建议',
    desc: '定位薄弱点，并生成家长 / 老师 / 孩子各自能懂的训练方案。',
  },
]

/**
 * 衔接条:感知页结束后,把用户引导到「五维诊断」,讲清三路信号接下来去哪、变成什么。
 */
export function PerceptionBridge() {
  return (
    <section className="px-5 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-teal/5 sm:p-9">
          <div className="text-center">
            <p className="text-sm font-semibold text-amber">感知，只是第一步</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
              那么——这些信号，接下来去哪了？
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              「看见」不等于「看懂」。刚才采集到的三路信号，会进入诊断引擎，变成一份能指导训练的报告。
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FLOW.map((f, i) => (
              <div key={f.title} className="relative rounded-2xl border border-border bg-background p-5">
                {i < FLOW.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-teal/40 md:block" />
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal/10 text-teal">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-wide text-amber">{f.step}</p>
                </div>
                <h4 className="mt-3 font-semibold text-ink">{f.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/diagnosis"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-teal px-7 text-base font-semibold text-white shadow-lg shadow-teal/25 transition-transform hover:-translate-y-0.5 hover:bg-teal-deep"
            >
              查看五维诊断报告
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/studio"
              className="inline-flex h-12 items-center rounded-full border border-border bg-white/70 px-6 text-base font-medium text-ink transition-colors hover:border-teal/40 hover:text-teal"
            >
              直接走完整训练闭环
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
