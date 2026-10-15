import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { NAV_ITEMS } from './navItems'

/** Mobile bottom tab bar. The center Log tab is a raised, always-reachable button. */
export function TabBar() {
  return (
    <nav
      aria-label="Main"
      className="border-line bg-surface/95 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 items-end px-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex justify-center">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              aria-label={item.label}
              className={({ isActive }) =>
                clsx(
                  'flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors',
                  item.primary
                    ? 'bg-accent text-accent-ink shadow-card -mt-5 h-14 w-14 rounded-full'
                    : isActive
                      ? 'text-accent'
                      : 'text-muted',
                )
              }
            >
              <Icon name={item.icon} size={item.primary ? 28 : 22} />
              {!item.primary && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
