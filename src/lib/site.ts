// Resolve a public/ asset under the (possibly sub-path) Vite base.
export const asset = (p: string) =>
  `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`

// Top-nav routes (HashRouter paths). Home is separate.
export const ROUTES = [
  { path: '/perception', label: '三模态感知' },
  { path: '/alignment', label: '时间对齐' },
  { path: '/diagnosis', label: '五维诊断' },
  { path: '/studio', label: '训练闭环' },
  { path: '/courses', label: '课程体系' },
  { path: '/about', label: '了解项目' },
] as const

// Shared framer-motion reveal variants
export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
}
