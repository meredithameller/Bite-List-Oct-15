import clsx from 'clsx'
import symbol from '@/assets/lips-bite-symbol.svg'
import { APP_NAME } from '@/lib/config'

interface LogoProps {
  /** lg: sign-in hero. sm: headers and the sidebar. */
  size?: 'sm' | 'lg'
  className?: string
}

/** Brand lockup: the lips "bite" symbol plus the app name set in Manrope ExtraBold. */
export function Logo({ size = 'lg', className }: LogoProps) {
  const large = size === 'lg'
  return (
    <span className={clsx('inline-flex items-center', large ? 'gap-5' : 'gap-2.5', className)}>
      <img
        src={symbol}
        alt=""
        aria-hidden="true"
        className={clsx('block w-auto shrink-0', large ? 'h-[70px]' : 'h-7')}
      />
      <span
        className={clsx(
          'font-logo text-ink leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap',
          large ? 'text-[44px] sm:text-[49px]' : 'text-[22px]',
        )}
      >
        {APP_NAME}
      </span>
    </span>
  )
}
