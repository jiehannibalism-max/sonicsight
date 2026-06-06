import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ScanFace,
  Clock,
  Gauge,
  Repeat,
  BookOpen,
  Info,
} from 'lucide-react'
import { asset, fadeUp, stagger } from '@/lib/site'
import { Soundwave } from '@/components/site/Soundwave'
import { Reveal } from '@/components/site/Reveal'
import { ImgSlot } from '@/components/site/ImgSlot'

const CARDS = [
  {
    to: '/perception',
    icon: ScanFace,
    title: '三模态感知',
    desc: '打开摄像头，唇形、手势、声音三路信号同时被看见。',
    tag: '现场实时运行',
    img: 'img/card-perception.jpg',
  },
  {
    to: '/alignment',
    icon: Clock,
    title: '时间对齐',
    desc: '手势比嘴快半拍——看系统如何把三路信号拉到同一刻。',
    tag: '核心技术难点',
    img: 'img/card-alignment.jpg',
  },
  {
    to: '/diagnosis',
    icon: Gauge,
    title: '五维诊断',
    desc: '一个音，从唇形/声学/时长/气流/鼻音五维看穿它。',
    tag: '发音评估引擎',
    img: 'img/card-diagnosis.jpg',
  },
  {
    to: '/studio',
    icon: Repeat,
    title: '训练闭环',
    desc: '识别 → 诊断 → 建议 → 再训练，完整走一遍。',
    tag: '多 Agent 编排',
    img: 'img/card-studio.jpg',
  },
  {
    to: '/courses',
    icon: BookOpen,
    title: '课程体系',
    desc: '三层训练词库与 Cued Speech 编码图谱。',
    tag: '分级训练',
    img: 'img/card-courses.jpg',
  },
  {
    to: '/about',
    icon: Info,
    title: '了解项目',
    desc: '什么是 Cued Speech、我们服务谁、行业真实痛点。',
    tag: '科普 · 数据',
    img: 'img/card-about.jpg',
  },
]

export function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-12 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img
            src={asset('hero-bg.jpg')}
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="absolute inset-0 h-full w-full object-cover opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand/60 via-background/80 to-background" />
          <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-teal/10 blur-3xl" />
          <div className="absolute top-1/3 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-amber/10 blur-3xl" />
          <div className="bg-grain absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <img
            src={asset('brand/logo-mark.png')}
            alt=""
            className="animate-float-slow absolute left-1/2 top-[16%] w-[min(92vw,820px)] -translate-x-1/2 opacity-[0.10]"
          />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex max-w-3xl flex-col items-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-teal backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
            </span>
            基于 Cued Speech 的中文 AI 口语训练系统
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-7 text-balance text-5xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            看见声音，
            <br />
            <span className="text-gradient">说出清晰的每个字</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            为听障儿童与唇腭裂术后患者，把唇形、手势与声音三种信号融为一体，
            看清每个音是怎么发出来的——这一次，发音可以被看见。
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/perception"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-teal px-7 text-base font-semibold text-white shadow-lg shadow-teal/25 transition-transform hover:-translate-y-0.5 hover:bg-teal-deep"
            >
              打开摄像头体验
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex h-12 items-center rounded-full border border-border bg-white/70 px-6 text-base font-medium text-ink backdrop-blur-sm transition-colors hover:border-teal/40 hover:text-teal"
            >
              什么是 Cued Speech？
            </Link>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 -z-10 mx-auto max-w-5xl px-6 opacity-80">
          <Soundwave height={140} bars={96} />
        </div>
      </section>

      {/* vision video */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-5xl">
          <Reveal className="group relative overflow-hidden rounded-3xl border border-border shadow-xl shadow-teal/10">
            <div className="relative aspect-video bg-ink">
              <video
                src={asset('hero.mp4')}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                <p className="text-sm font-medium text-amber">A Moment of Hope · 愿景短片</p>
                <h2 className="mt-1.5 text-2xl font-semibold text-white sm:text-3xl">
                  让每一个想说话的孩子，都能被听见
                </h2>
                <p className="mt-2 max-w-xl text-sm text-white/80">
                  技术的终点不是分数，而是一个孩子第一次清楚地喊出「妈妈」。
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* experience cards */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CARDS.map((c) => (
              <motion.div key={c.to} variants={fadeUp}>
                <Link
                  to={c.to}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-teal/40 hover:shadow-xl hover:shadow-teal/10"
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <ImgSlot
                      src={c.img}
                      alt={c.title}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-teal shadow-sm backdrop-blur">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-ink/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                      {c.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold text-ink">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {c.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal">
                      进入体验
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
