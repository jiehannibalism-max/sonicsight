import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, MapPin, Wind, Waves, Languages, Volume2, PlayCircle, ExternalLink, BookOpen } from 'lucide-react'
import { SectionHead, Reveal } from '@/components/site/Reveal'
import { ImgSlot } from '@/components/site/ImgSlot'
import { fadeUp, stagger } from '@/lib/site'
import { cn } from '@/lib/utils'

// 8 手形 → 辅音组（依据 Cued-Agent 2025 整理，示例分组）
const HANDSHAPES = [
  { id: 1, cons: 'd / p / ' + 'zh' },
  { id: 2, cons: 'k / v / z' },
  { id: 3, cons: 'h / s / r' },
  { id: 4, cons: 'b / n' },
  { id: 5, cons: 'm / t / f' },
  { id: 6, cons: 'l / sh / w' },
  { id: 7, cons: 'g / j / c' },
  { id: 8, cons: 'q / x / ch' },
]

// 5 位置 → 元音组
const POSITIONS = [
  { id: 1, place: '喉部', vowel: 'a' },
  { id: 2, place: '下巴', vowel: 'o / ɔ' },
  { id: 3, place: '嘴角', vowel: 'e / ə' },
  { id: 4, place: '脸颊', vowel: 'i / u' },
  { id: 5, place: '喉侧', vowel: 'ü / er' },
]

const TIERS = [
  {
    id: 'basic',
    label: '基础层 · 单字',
    desc: '高频问题音的单音节，先把每个音发到位。',
    words: ['妈 mā', '爸 bà', '大 dà', '哥 gē', '鹅 é', '衣 yī', '屋 wū', '鱼 yú', '泡 pào', '土 tǔ'],
  },
  {
    id: 'mid',
    label: '进阶层 · 词语',
    desc: '双音节词，练连续发音与节奏。',
    words: ['妈妈', '爸爸', '哥哥', '苹果', '香蕉', '老师', '喝水', '吃饭', '谢谢', '你好'],
  },
  {
    id: 'adv',
    label: '扩展层 · 短句',
    desc: '生活短句，迁移到真实表达。',
    words: ['我爱妈妈', '我要喝水', '谢谢老师', '今天真好', '我们回家', '一起玩吧'],
  },
]

// 真实可查的公开学习资源（外链，非自建内容）
const RESOURCES = [
  {
    title: 'National Cued Speech Association',
    desc: '美国提示语官方组织：手形 / 位置图谱、入门科普、家长指南，权威且免费。',
    href: 'https://cuedspeech.org',
    host: 'cuedspeech.org',
  },
  {
    title: 'Cue College 在线课程',
    desc: '系统的 Cued Speech 在线教学课程，从零基础到进阶，含视频示范。',
    href: 'https://www.cuecollege.org',
    host: 'cuecollege.org',
  },
  {
    title: 'Bilibili · 提示语 / 唇读教学',
    desc: '中文社区里的手势语、唇读与言语康复教学视频合辑，可直接检索观看。',
    href: 'https://search.bilibili.com/all?keyword=cued%20speech',
    host: 'search.bilibili.com',
  },
]

const PACKS = [
  { icon: Waves, title: '鼻音化矫正', focus: 'b / p / d / t / g / k', desc: '针对该口腔音却带鼻音的典型问题，强化口鼻气流分离。', img: 'img/pack-nasal.jpg' },
  { icon: Wind, title: '气流强化训练', focus: 'p / t / k 送气音', desc: '用可视化送气反馈，提升爆破音的气流力度。', img: 'img/pack-airflow.jpg' },
  { icon: Volume2, title: '舌根音专项', focus: 'g / k / h', desc: '纠正舌位前移，避免听起来像 d / t / x。', img: 'img/pack-tongue.jpg' },
  { icon: Languages, title: '塞擦音专项', focus: 'z c s / zh ch sh', desc: '稳定舌位，区分平翘舌，减少音被替换。', img: 'img/pack-affricate.jpg' },
]

export function Courses() {
  const [tier, setTier] = useState(0)

  return (
    <div className="pt-24">
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            kicker="课程体系 · 分级训练"
            title={<>从一个音，到一句话</>}
            lead="评估找出薄弱点之后，训练要有章法。课程按 Cued Speech 编码规则组织，从单字到短句分级递进，并配有针对高频问题音的专项包。"
          />
        </div>
      </section>

      {/* 编码图谱 */}
      <section className="bg-sand/40 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h3 className="text-2xl font-semibold text-ink">Cued Speech 中文编码图谱</h3>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              <b className="text-ink">8 种手形</b> 编码辅音，
              <b className="text-ink">5 个面部位置</b> 编码元音，三者组合让每个音节在视觉上唯一可分。
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-3xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2 text-teal">
                <Hand className="h-5 w-5" />
                <span className="font-semibold">8 手形 → 辅音</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {HANDSHAPES.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-2xl border border-border bg-background p-3 text-center"
                  >
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-teal/10 text-sm font-semibold text-teal">
                      {h.id}
                    </div>
                    <p className="mt-2 font-mono text-xs text-ink">{h.cons}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="rounded-3xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2 text-amber">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">5 位置 → 元音</span>
              </div>
              <div className="space-y-2.5">
                {POSITIONS.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-2.5"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-ink">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber/15 text-xs font-semibold text-amber">
                        {p.id}
                      </span>
                      {p.place}
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">{p.vowel}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-4 text-xs text-muted-foreground">
            * 手形-音素具体映射依据 Cued-Agent（港科大 + 腾讯 AI Lab，2025）方案整理，最终以标准化文档为准。
          </Reveal>
        </div>
      </section>

      {/* 三层词库 */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h3 className="text-2xl font-semibold text-ink">三层训练词库</h3>
          </Reveal>
          <Reveal className="mt-6 inline-flex flex-wrap gap-2 rounded-full border border-border bg-card p-1.5">
            {TIERS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTier(i)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  tier === i ? 'bg-teal text-white shadow-sm' : 'text-muted-foreground hover:text-teal',
                )}
              >
                {t.label}
              </button>
            ))}
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mt-6"
            >
              <p className="mb-4 text-sm text-muted-foreground">{TIERS[tier].desc}</p>
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-2.5"
              >
                {TIERS[tier].words.map((w) => (
                  <motion.span
                    key={w}
                    variants={fadeUp}
                    className="rounded-2xl border border-border bg-card px-4 py-2.5 text-base font-medium text-ink"
                  >
                    {w}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 专项包 */}
      <section className="bg-sand/40 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead align="left" kicker="对症下药" title="专项训练包" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {PACKS.map((p) => (
              <Reveal key={p.title} className="overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative h-28 w-full overflow-hidden">
                  <ImgSlot src={p.img} alt={p.title} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                  <span className="absolute bottom-3 left-4 flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-teal shadow-sm backdrop-blur">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <h4 className="text-lg font-semibold text-ink">{p.title}</h4>
                      <p className="font-mono text-xs text-amber">{p.focus}</p>
                    </span>
                  </span>
                </div>
                <p className="px-6 py-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 flex items-center gap-3 rounded-2xl border border-teal/20 bg-teal/5 p-5 text-sm text-teal-deep">
            <PlayCircle className="h-6 w-6 shrink-0" />
            <span>
              <b>标准手势示范视频库</b>（500 个常用音节 / 单词，多角度 + 慢动作分解）正在录制中，即将上线。
            </span>
          </Reveal>
        </div>
      </section>

      {/* 公开学习资源 */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            align="left"
            kicker="延伸学习"
            title="公开学习资源"
            lead="在我们的示范视频库上线前，这些是真实可查的权威提示语（Cued Speech）学习资源，家长和老师可以先用起来。"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {RESOURCES.map((r) => (
              <Reveal key={r.title}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-colors hover:border-teal/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber/10 text-amber">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-teal" />
                  </div>
                  <h4 className="mt-4 text-base font-semibold text-ink">{r.title}</h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                  <span className="mt-4 font-mono text-xs text-teal">{r.host}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
