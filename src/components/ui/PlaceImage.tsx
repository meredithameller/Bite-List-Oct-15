import clsx from 'clsx'
import { isArt, parseArt } from '@/lib/image'

interface PlaceImageProps {
  /** A data URL or an "art:" placeholder (see lib/image.ts). */
  photo: string
  alt?: string
  className?: string
}

/** Real photo or an illustrated placeholder: a warm gradient with a big emoji. */
export function PlaceImage({ photo, alt = '', className }: PlaceImageProps) {
  if (!isArt(photo)) {
    return <img src={photo} alt={alt} loading="lazy" className={clsx('object-cover', className)} />
  }
  const { hue, emoji } = parseArt(photo)
  return (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={clsx('relative flex items-center justify-center overflow-hidden', className)}
      style={{
        background: `radial-gradient(circle at 25% 20%, hsl(${hue + 25} 95% 78%), transparent 55%), linear-gradient(135deg, hsl(${hue} 85% 60%), hsl(${hue + 35} 80% 45%))`,
      }}
    >
      <span className="text-[min(30vw,6rem)] drop-shadow-lg select-none" aria-hidden="true">
        {emoji}
      </span>
    </div>
  )
}
