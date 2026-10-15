import type { Place } from '@/api'
import { Icon } from '@/components/ui/Icon'

/** Stand-in for a real map. A styled grid with a pin, so the layout is ready for one later. */
export function MapPlaceholder({ place }: { place: Place }) {
  return (
    <div
      role="img"
      aria-label={`Map placeholder for ${place.name} in ${place.neighborhood}`}
      className="bg-surface-2 border-line relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[1.25rem] border"
      style={{
        backgroundImage:
          'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <div className="text-accent flex flex-col items-center">
        <Icon name="pin" size={40} filled />
      </div>
      <p className="bg-surface/90 absolute bottom-2 left-2 rounded-full px-3 py-1 text-xs font-semibold">
        {place.neighborhood}, {place.city} · map coming soon
      </p>
    </div>
  )
}
