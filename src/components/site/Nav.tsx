import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { asset, ROUTES } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
        scrolled || open ? 'glass border-b border-border/60 py-2.5' : 'py-3.5',
      )}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src={asset('brand/logo-mark.png')}
            alt="SonicSight"
            className="h-7 w-auto sm:h-8"
          />
          <span className="text-[1.05rem] font-semibold tracking-tight text-ink">
            Sonic<span className="text-teal">Sight</span>
            <span className="ml-1.5 hidden text-sm font-medium text-muted-foreground sm:inline">
              聆光科技
            </span>
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {ROUTES.map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal/10 text-teal'
                    : 'text-muted-foreground hover:bg-teal/8 hover:text-teal',
                )
              }
            >
              {r.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/perception"
            className="hidden rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition-transform hover:-translate-y-0.5 hover:bg-teal-deep sm:inline-flex"
          >
            开始体验
          </NavLink>
          {/* mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-ink lg:hidden"
            aria-label="菜单"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="mx-auto mt-2 grid w-full max-w-6xl grid-cols-2 gap-1.5 px-5 pb-3 lg:hidden">
          {ROUTES.map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-teal text-white' : 'bg-card text-ink',
                )
              }
            >
              {r.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
