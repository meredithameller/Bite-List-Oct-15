import { useState } from 'react'
import type { WishlistRow, WishlistSource } from '@/api'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Field } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { SOURCES, sourceLabel } from '@/features/wishlist/sources'

export function AddToWishlist({
  placeId,
  entry,
}: {
  placeId: string
  entry: WishlistRow | undefined
}) {
  const add = useAddToWishlist()
  const remove = useRemoveFromWishlist()
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<WishlistSource>('friend')
  const [note, setNote] = useState('')

  if (entry) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="anim-pop bg-accent-soft text-accent inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold">
          <Icon name="heart" size={18} filled /> On your wishlist · {sourceLabel(entry.source)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => remove.mutate(placeId)}
          disabled={remove.isPending}
        >
          Remove
        </Button>
      </div>
    )
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Icon name="heart" size={18} /> Add to Wishlist
      </Button>
    )
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Where did you hear about it?</legend>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <Chip key={s.value} selected={source === s.value} onClick={() => setSource(s.value)}>
              <span aria-hidden="true">{s.emoji}</span> {s.label}
            </Chip>
          ))}
        </div>
      </fieldset>
      <Field
        label="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What should you order?"
      />
      {add.isError && (
        <p role="alert" className="text-danger text-sm">
          {add.error.message}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          onClick={() =>
            add.mutate({ placeId, source, note: note.trim() }, { onSuccess: () => setOpen(false) })
          }
          disabled={add.isPending}
        >
          {add.isPending ? 'Saving…' : 'Save to wishlist'}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </Card>
  )
}
