import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown } from 'lucide-react'
import { SectionHead, Reveal } from './Reveal'

type QA = { q: string; a: string }

// AI 发音诊断助手 —— 把五维诊断背后的专业逻辑讲清楚。内容基于公开语音科学常识。
const QAS: QA[] = [
  {
    q: '为什么「气流」也是发音质量的一个维度？',
    a: '语音的能量来自呼气。呼吸支持（respiratory support）不稳，声音就会发虚、发抖、撑不住时长，送气塞音（p / t / k）也送不出去。所以气流强度直接关系到发音的清晰度与稳定性——它是其余维度的「能量地基」，先稳住气流，唇形和声调的训练才事半功倍。',
  },
  {
    q: 'b、p、m 口型几乎一样，系统靠什么区分？',
    a: '这三个都是双唇音，唇读时几乎无法分辨——这正是 Cued Speech 要解决的核心歧义。系统靠三件事区分：① 清浊与送气（b 不送气、p 送气）体现在气流与起音时间上；② 鼻腔共鸣（m 是鼻音）体现在鼻音化维度的低频能量；③ 手势编码（Cued Speech 用不同手形为同口型的辅音「贴标签」）。单看嘴分不清，多模态一起看就分得清。',
  },
  {
    q: '「鼻音化」分数低，意味着什么？',
    a: '鼻音化维度衡量的是口腔音与鼻腔音的「气流走向是否正确」。该高不高（如 m、n 该有鼻腔共鸣却不足），或该低不低（如 b、d 这类口腔音却漏气到鼻腔、出现鼻音化），都会被标记。它对唇腭裂术后人群尤其关键——腭咽闭合不全常表现为不该有的鼻音化，是康复评估的重要指标。',
  },
  {
    q: '五个维度的分数到底怎么算出来的？',
    a: '不是拍脑袋打分，而是把信号和「标准模板」做客观比对：唇形用关键点几何轨迹做 DTW（动态时间规整）对齐求相似度；声学做声母/韵母/声调的匹配；时长比对音节时长比；气流用音频 RMS 能量比估计送气强度；鼻音化用频带能量比估计鼻腔共鸣。每一维都落在 0~1，再换算成百分制。',
  },
  {
    q: '这套评估和普通语音识别（ASR）有什么不同？',
    a: '普通 ASR 只回答「你说了什么」，目标是把语音转成文字，发音不标准它会「猜」成最接近的词。我们要回答的是「你发得标不标准、哪里不到位、怎么改」——这是发音评估（pronunciation assessment / 构音诊断），面向的是康复训练而不是听写。所以我们要的不是「识别对」，而是「诊断准、能指导训练」。',
  },
]

export function DiagnosisQA() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section className="px-5 pb-24">
      <div className="mx-auto max-w-3xl">
        <SectionHead
          kicker="AI 发音诊断助手 · 追问"
          title={<>还想再深入一点？</>}
          lead="评分之外，关于「为什么这么诊断」的常见追问——由发音诊断助手逐条解释清楚。"
        />

        <Reveal className="mt-8 space-y-3">
          {QAS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-bold text-amber">
                      Q
                    </span>
                    <span className="font-medium text-ink">{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 border-t border-border bg-teal/[0.03] px-5 pb-5 pt-4">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-[15px] leading-relaxed text-ink">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
