import { asset } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-5 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <img
              src={asset('brand/logo-mark.png')}
              alt="SonicSight"
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold tracking-tight text-ink">
              Sonic<span className="text-teal">Sight</span>
              <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                聆光科技
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            基于 Cued Speech 的中文 AI 口语训练系统。让听得见的声音被看见，
            让说不出的语言被听见。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-3 font-semibold text-ink">服务对象</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>听障儿童（语前聋）</li>
              <li>唇腭裂术后患者</li>
              <li>言语康复 / 特教工作者</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-ink">核心能力</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>唇形 + 手势 + 语音三模态</li>
              <li>五维发音诊断</li>
              <li>个性化训练闭环</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6 text-xs text-muted-foreground">
        © 2026 SonicSight 聆光科技 · 本页为技术体验演示原型
      </div>
    </footer>
  )
}
