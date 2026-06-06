import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/site'
import { cn } from '@/lib/utils'

/** Scroll-into-view reveal wrapper. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/** Section heading: small kicker + big title + optional lead line. */
export function SectionHead({
  kicker,
  title,
  lead,
  align = 'center',
  className,
}: {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {kicker && (
        <span className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/5 px-3.5 py-1.5 text-sm font-medium text-teal">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          {kicker}
        </span>
      )}
      <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {lead && (
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lead}
        </p>
      )}
    </Reveal>
  )
}
