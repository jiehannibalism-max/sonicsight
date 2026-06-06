import { motion } from 'framer-motion'
import { Check, X, Hand, Ear, Baby, HeartPulse, GraduationCap } from 'lucide-react'
import { SectionHead, Reveal } from '@/components/site/Reveal'
import { TechFoundation } from '@/components/site/TechFoundation'
import { fadeUp, stagger } from '@/lib/site'

// b/p/m … 口型相同、靠手势区分
const AMBIGUOUS = [
  { combo: 'b / p / m', mouth: '双唇闭合后打开', diff: '清浊 / 送气 / 鼻化不同', note: '看起来完全一样' },
  { combo: 'd / t / n', mouth: '舌尖抵齿龈', diff: '清浊 / 送气 / 鼻化不同', note: '看起来完全一样' },
  { combo: 'g / k', mouth: '舌根抬起', diff: '送气与否不同', note: '看起来几乎一样' },
]

const COMPARE = [
  ['性质', '口语的视觉化辅助工具', '独立完整的语言系统'],
  ['编码对象', '音素（辅音 + 元音）', '概念 / 词义'],
  ['手势数量', '极少：8 种手形 + 5 个位置', '数千个词手势'],
  ['作用', '消除唇读歧义', '替代口语进行交流'],
  ['与口语关系', '辅助口语，不可独立使用', '完全独立于口语'],
]

const SERVE = [
  { icon: Baby, title: '听障儿童（语前聋）', desc: '从零学习口语发音，用视觉手势补偿听觉缺失，精准感知每个音素。' },
  { icon: HeartPulse, title: '唇腭裂术后患者', desc: '术后发音矫正与功能康复，音素级薄弱点诊断 + 多维评估反馈。' },
  { icon: GraduationCap, title: '教育 / 康复工作者', desc: '可视化教学辅助、可量化评估，降低 Cued Speech 推广门槛。' },
]

const NOT_SERVE = [
  '以中国手语为母语、不需要学口语的成年聋人',
  '一般言语发育迟缓儿童（不替代专业语言治疗）',
  '普通话学习者（健听人）',
]

const STATS = [
  { num: '2780', unit: '万', label: '中国听力残疾人', src: '中国残联' },
  { num: '~30', unit: '%', label: '纯唇读能传递的音素信息上限', src: 'Bernstein 等研究' },
  { num: '<2000', unit: '人', label: '全国持证言语治疗师', src: '供需严重失衡' },
  { num: '95→40', unit: '%', label: '障碍语音让通用识别准确率骤降', src: '行业现状' },
  { num: '240', unit: '万', label: '唇腭裂患者（保守估计）', src: '年新增 1.4–1.6 万' },
  { num: '8.45', unit: '%', label: '残疾人接受系统康复训练比例', src: '需求率达 27.69%' },
]

export function About() {
  return (
    <div className="pt-24">
      {/* 科普 */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            kicker="先讲清楚一件事"
            title={
              <>
                我们做的是 <span className="text-gradient">Cued Speech</span>，
                <br className="hidden sm:block" />
                不是手语
              </>
            }
            lead="一看“听障 + 手势 + AI”很容易误会成手语翻译。但本项目的“手势”是 Cued Speech（线索语）的发音消歧手势——它辅助口语，帮人看清每个音素，和中国手语完全不同。"
          />
        </div>
      </section>

      {/* 为什么唇读不够 */}
      <section className="bg-sand/40 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h3 className="text-2xl font-semibold text-ink">为什么只看嘴唇不够？</h3>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              许多发音的口型完全相同，只看嘴唇根本分不清——这是听障儿童学口语的第一道认知障碍。
            </p>
          </Reveal>
          <Reveal className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="grid grid-cols-3 bg-teal/8 px-5 py-3 text-sm font-semibold text-teal sm:grid-cols-4">
              <span>音素</span>
              <span>口型特征</span>
              <span className="hidden sm:block">真正差别</span>
              <span className="text-right sm:text-left">唇读问题</span>
            </div>
            {AMBIGUOUS.map((r) => (
              <div
                key={r.combo}
                className="grid grid-cols-3 items-center border-t border-border px-5 py-4 text-sm sm:grid-cols-4"
              >
                <span className="font-mono text-base font-semibold text-ink">{r.combo}</span>
                <span className="text-muted-foreground">{r.mouth}</span>
                <span className="hidden text-muted-foreground sm:block">{r.diff}</span>
                <span className="text-right font-medium text-amber sm:text-left">{r.note}</span>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-6">
            <div className="rounded-2xl border border-teal/20 bg-teal/5 p-5 text-sm leading-relaxed text-teal-deep">
              <Hand className="mb-2 h-5 w-5" />
              Cued Speech 用 <b>8 种手形</b> 编码辅音、<b>5 个面部位置</b> 编码元音，配合口型，
              让每个音素在视觉上唯一可分。研究表明：配合手势后，听障人群对口语的视觉感知可接近 100%。
            </div>
          </Reveal>
        </div>
      </section>

      {/* 对比表 */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h3 className="text-2xl font-semibold text-ink">Cued Speech vs 中国手语</h3>
          </Reveal>
          <Reveal className="mt-8 overflow-hidden rounded-3xl border border-border">
            <div className="grid grid-cols-3 bg-card text-sm">
              <div className="border-b border-border px-5 py-4 font-semibold text-muted-foreground">
                维度
              </div>
              <div className="border-b border-l border-border bg-teal/8 px-5 py-4 font-semibold text-teal">
                Cued Speech · 本项目
              </div>
              <div className="border-b border-l border-border px-5 py-4 font-semibold text-muted-foreground">
                中国手语 CSL · 不做
              </div>
              {COMPARE.map((row) => (
                <div key={row[0]} className="contents">
                  <div className="border-b border-border px-5 py-3.5 text-sm font-medium text-ink">
                    {row[0]}
                  </div>
                  <div className="flex items-start gap-2 border-b border-l border-border bg-teal/[0.03] px-5 py-3.5 text-sm text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    {row[1]}
                  </div>
                  <div className="flex items-start gap-2 border-b border-l border-border px-5 py-3.5 text-sm text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
                    {row[2]}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 服务对象 */}
      <section className="bg-sand/40 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead align="left" kicker="服务边界" title="我们服务谁，不服务谁" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {SERVE.map((s) => (
              <Reveal key={s.title} className="rounded-3xl border border-border bg-card p-6">
                <s.icon className="h-7 w-7 text-teal" />
                <h4 className="mt-4 text-lg font-semibold text-ink">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6 rounded-2xl border border-border bg-card/60 p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
              <Ear className="h-4 w-4 text-muted-foreground" />
              以下人群不在服务范围（明确边界 = 专业）
            </p>
            <ul className="grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-3">
              {NOT_SERVE.map((n) => (
                <li key={n} className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 真实数据墙 */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            kicker="为什么这件事值得做"
            title="真实的行业缺口"
            lead="没有华丽的奖项堆砌，只有可查证的行业数据——这才是 SonicSight 要填补的空白。"
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="rounded-3xl border border-border bg-card p-6"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-gradient">{s.num}</span>
                  <span className="text-lg font-semibold text-teal">{s.unit}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{s.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.src}</p>
              </motion.div>
            ))}
          </motion.div>
          <Reveal className="mt-8 rounded-2xl border border-amber/30 bg-amber/5 p-5 text-sm leading-relaxed text-ink">
            目前已完成核心算法原型与产品 MVP，并在 <b>15 位用户</b> 的小规模试点中取得
            <b> 92% 满意度</b>。下一步将扩大试点、完善中文 Cued Speech 标准化编码体系。
          </Reveal>
        </div>
      </section>

      {/* 学术与开源基石 */}
      <TechFoundation />
    </div>
  )
}
