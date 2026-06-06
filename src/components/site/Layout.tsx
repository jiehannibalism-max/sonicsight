import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { asset } from '@/lib/site'

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return (
    <div className="relative flex min-h-svh flex-col">
      {/* 全站固定背景:hero 图 + 柔和遮罩(不太暗) + 蓝(青)/黄(琥珀)光 */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
        <img
          src={asset('hero-bg.jpg')}
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* 浅色遮罩:压一点但保证文字清晰 */}
        <div className="absolute inset-0 bg-background/80" />
        {/* 顶部更通透,底部稍稳 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/55" />
        {/* 蓝(青)光 + 黄(琥珀)光 */}
        <div className="absolute -left-40 -top-44 h-[44rem] w-[44rem] rounded-full bg-teal/20 blur-[130px]" />
        <div className="absolute -bottom-52 -right-44 h-[46rem] w-[46rem] rounded-full bg-amber/[0.18] blur-[130px]" />
        <div className="absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-teal-light/10 blur-[120px]" />
      </div>

      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
