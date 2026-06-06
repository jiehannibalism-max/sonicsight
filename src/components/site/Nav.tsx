import { useEffect, useState } from 'react'
import { asset, SECTIONS } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-border/60 py-2.5' : 'py-4',
      )}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src={asset('brand/logo-mark.png')}
            alt="SonicSight"
            className="h-7 w-auto drop-shadow-sm sm:h-8"
          />
          <span className="text-[1.05rem] font-semibold tracking-tight text-ink">
            Sonic<span className="text-teal">Sight</span>
            <span className="ml-1.5 hidden text-sm font-medium text-muted-foreground sm:inline">
              聆光科技
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-teal/8 hover:text-teal"
            >
              {s.label}
            </a>
          ))}
        </div>

        <a
          href="#perception"
          className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition-transform hover:-translate-y-0.5 hover:bg-teal-deep"
        >
          开始体验
        </a>
      </nav>
    </header>
  )
}
