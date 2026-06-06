import { ExternalLink, Database, FileText, Network, BookMarked } from 'lucide-react'
import { SectionHead, Reveal } from './Reveal'

// 全部为真实、可查证的公开研究 / 数据集(2025)。引用=站在领域基础上,非声称自有。
const REFS = [
  {
    icon: Database,
    name: 'MCCSD · 普通话 Cued Speech 数据集',
    org: '港科大(广州) + 深圳大数据研究院 · Li Liu 团队',
    note: '首个大规模普通话 Cued Speech 视频数据集(1000 句 / 4 位手势者),提供精细标注。',
    use: '作为中文 Cued Speech 识别的领域基准与可对接语料。',
    license: '科研授权(需签署协议)',
    href: 'https://mccs-2023.github.io/',
    host: 'mccs-2023.github.io',
  },
  {
    icon: Network,
    name: 'Cued-Agent · 多智能体 CS 识别',
    org: 'ACM MM 2025',
    note: '用协作式多智能体系统做自动 Cued Speech 识别——与本项目「多 Agent 诊断闭环」思路一致。',
    use: '佐证多智能体方案在 CS 识别上的有效性,启发我们的 Agent 编排。',
    license: '学术论文 (arXiv 2508.00391)',
    href: 'https://arxiv.org/abs/2508.00391',
    host: 'arxiv.org/abs/2508.00391',
  },
  {
    icon: FileText,
    name: 'UniCUE · 中文 CS 识别与生成',
    org: 'AAAI 2025',
    note: '统一的中文 Cued Speech 识别+语音生成框架,含 UniCUE-HI 大规模数据(11,282 视频 / 14 人)。',
    use: '前沿方法对标,为视觉线索到语音的映射提供参考。',
    license: '学术论文 (arXiv 2506.04134)',
    href: 'https://arxiv.org/abs/2506.04134',
    host: 'arxiv.org/abs/2506.04134',
  },
  {
    icon: BookMarked,
    name: 'Chinese-LiPS · 中文视听语料',
    org: '智源研究院 BAAI',
    note: '100 小时中文音视频语料(207 位说话人),含唇读视频与转写,公开可下载。',
    use: '可用于唇形模态的预训练 / 验证(开放许可)。',
    license: 'CC BY-NC-SA 4.0',
    href: 'https://github.com/flageval-baai/Chinese-LiPS',
    host: 'github.com/flageval-baai/Chinese-LiPS',
  },
]

/**
 * 学术与开源基石:用真实可查的公开研究/数据集,佐证项目的专业性与技术路线。
 * 诚实原则:引用代表「站在领域基础上」,不声称这些成果由本项目完成或已全部接入。
 */
export function TechFoundation() {
  return (
    <section className="bg-sand/40 px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHead
          kicker="站在巨人肩膀上"
          title="学术与开源基石"
          lead="中文 Cued Speech 是一个正在快速成形的前沿方向。我们的技术路线建立在这些真实、可查证的公开研究与数据集之上——既是专业背书，也表明我们清楚自己站在哪里。"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {REFS.map((r) => (
            <Reveal key={r.name}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-colors hover:border-teal/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-teal" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-ink">{r.name}</h4>
                <p className="mt-0.5 text-xs font-medium text-amber">{r.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.note}</p>
                <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-ink">
                  <span className="font-medium text-teal">用法 · </span>
                  {r.use}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{r.host}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5">{r.license}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6 text-xs leading-relaxed text-muted-foreground">
          * 以上为公开学术成果与数据集，著作权归原作者/机构所有；本项目按各自许可作为研究基准与参考，
          引用不代表已全部接入或由本项目完成。
        </Reveal>
      </div>
    </section>
  )
}
