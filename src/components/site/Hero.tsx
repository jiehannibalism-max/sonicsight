import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { asset, fadeUp, stagger } from '@/lib/site'
import { Soundwave } from './Soundwave'

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16 text-center"
    >
      {/* layered background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* optional AI-generated hero image — drop a file at public/hero-bg.jpg
            and it appears automatically; otherwise the CSS backdrop shows. */}
        <img
          src={asset('hero-bg.jpg')}
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="absolute inset-0 h-full w-full object-cover opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        {/* soft brand gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-sand/60 via-background/80 to-background" />
        <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute top-1/3 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-amber/10 blur-3xl" />
        <div className="bg-grain absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        {/* giant hollow watermark mark */}
        <img
          src={asset('brand/logo-mark.png')}
          alt=""
          className="animate-float-slow absolute left-1/2 top-[18%] w-[min(92vw,860px)] -translate-x-1/2 opacity-[0.10]"
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
          <a
            href="#perception"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-teal px-7 text-base font-semibold text-white shadow-lg shadow-teal/25 transition-transform hover:-translate-y-0.5 hover:bg-teal-deep"
          >
            打开摄像头体验
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#diagnosis"
            className="inline-flex h-12 items-center rounded-full border border-border bg-white/70 px-6 text-base font-medium text-ink backdrop-blur-sm transition-colors hover:border-teal/40 hover:text-teal"
          >
            看一份发音诊断
          </a>
        </motion.div>
      </motion.div>

      {/* live soundwave at the base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 -z-10 mx-auto max-w-5xl px-6 opacity-80">
        <Soundwave height={160} bars={96} />
      </div>

      <motion.a
        href="#perception"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground"
        aria-label="向下滚动"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.a>
    </section>
  )
}
