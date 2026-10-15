import { useId, useState } from 'react'
import { PlaceImage } from '@/components/ui/PlaceImage'
import { Icon } from '@/components/ui/Icon'
import { resizeImageToDataUrl } from '@/lib/image'
import { MAX_PHOTOS } from './schema'

interface PhotoPickerProps {
  photos: string[]
  onChange: (photos: string[]) => void
}

export function PhotoPicker({ photos, onChange }: PhotoPickerProps) {
  const inputId = useId()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const full = photos.length >= MAX_PHOTOS

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    setBusy(true)
    try {
      const room = MAX_PHOTOS - photos.length
      const picked = [...files].slice(0, room)
      const resized = await Promise.all(picked.map((f) => resizeImageToDataUrl(f)))
      onChange([...photos, ...resized])
    } catch {
      setError('One of those photos could not be read. Try a different image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-4 gap-2" aria-label="Photos for this visit">
        {photos.map((p, i) => (
          <li key={i} className="relative aspect-square">
            <PlaceImage photo={p} alt={`Photo ${i + 1}`} className="size-full rounded-xl" />
            <button
              type="button"
              aria-label={`Remove photo ${i + 1}`}
              onClick={() => onChange(photos.filter((_, j) => j !== i))}
              className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-black/70 text-white"
            >
              <Icon name="x" size={16} />
            </button>
          </li>
        ))}
        {!full && (
          <li className="aspect-square">
            <label
              htmlFor={inputId}
              className="border-line text-muted hover:bg-surface-2 focus-within:outline-accent flex size-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-xs font-semibold has-[:focus-visible]:outline-3"
            >
              <Icon name="camera" />
              {busy ? 'Adding…' : 'Add'}
              <input
                id={inputId}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  void handleFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          </li>
        )}
      </ul>
      <p className="text-muted text-xs">
        Optional. Up to {MAX_PHOTOS} photos, shrunk to fit on your device.
      </p>
      {error && (
        <p role="alert" className="text-danger text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
