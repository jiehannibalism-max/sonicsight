import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { asset } from '@/lib/site'
import { cn } from '@/lib/utils'

/**
 * 图片位:有图就显示图,没图就显示品牌渐变占位 + 期望的文件名。
 * 用户把图按文件名放进 public/img/ 即自动生效,无需改代码。
 */
export function ImgSlot({
  src,
  alt = '',
  className,
  showName = true,
}: {
  src: string
  alt?: string
  className?: string
  showName?: boolean
}) {
  const [ok, setOk] = useState(true)
  if (ok) {
    return (
      <img
        src={asset(src)}
        alt={alt}
        onError={() => setOk(false)}
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-teal/15 via-card to-amber/15 text-center">
      <ImageIcon className="h-6 w-6 text-teal/50" />
      {showName && <code className="text-[10px] text-teal/70">{src.split('/').pop()}</code>}
    </div>
  )
}
