import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { NAV_ITEMS } from './navItems'

/** Tablet/desktop left rail. */
export function Sidebar() {
  return (
    <aside className="border-line bg-surface fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r p-4 md:flex">
      <div className="mb-6 px-3 pt-2">
        <Logo size="sm" />
      </div>
      <nav aria-label="Main">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold transition-colors',
                    item.primary
                      ? 'bg-accent text-accent-ink my-2 justify-center'
                      : isActive
                        ? 'bg-accent-soft text-accent'
                        : 'text-muted hover:bg-surface-2',
                  )
                }
              >
                <Icon name={item.icon} />
                {item.primary ? 'Quick log' : item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-muted mt-auto px-3 text-xs">Eat well. Log it. Earn stamps. 🌮</p>
    </aside>
  )
}
