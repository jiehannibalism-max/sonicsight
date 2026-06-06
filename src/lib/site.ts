// Resolve a public/ asset under the (possibly sub-path) Vite base.
export const asset = (p: string) =>
  `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`

export const SECTIONS = [
  { id: 'perception', label: '三模态感知' },
  { id: 'alignment', label: '时间的秘密' },
  { id: 'diagnosis', label: '五维诊断' },
  { id: 'training', label: '训练闭环' },
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
