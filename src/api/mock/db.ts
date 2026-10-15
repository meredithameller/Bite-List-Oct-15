import { buildSeed, type DbState } from './seed'

const STORAGE_KEY = 'bitelist.db.v1'

let state: DbState | null = null

export class StorageFullError extends Error {
  constructor() {
    super('Your device is out of space for photos. Remove a photo or two and try again.')
    this.name = 'StorageFullError'
  }
}

function read(): DbState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DbState
      if (parsed.version === 1) return parsed
    }
  } catch {
    // fall through to a fresh seed
  }
  const fresh = buildSeed()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  } catch {
    // seed is small; if even this fails we still run from memory
  }
  return fresh
}

export function getState(): DbState {
  state ??= read()
  return state
}

/** Applies an immutable update and persists it. Rolls back (and throws) if storage is full. */
export function commit(update: (current: DbState) => DbState): DbState {
  const next = update(getState())
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (error) {
    if (error instanceof DOMException) throw new StorageFullError()
    throw error
  }
  state = next
  return next
}

export function resetState(): void {
  state = buildSeed()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

/** Dev helper: add ?fail=1 to the URL to make every call fail and exercise error states. */
function shouldFail(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('fail') === '1'
  } catch {
    return false
  }
}

const randomDelay = () => 200 + Math.random() * 200

/**
 * Wraps a synchronous read/write in a Promise with an artificial 200-400ms delay,
 * so loading and error states get exercised like a real network call.
 */
export function simulate<T>(work: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new Error('Something went wrong reaching the kitchen. Please try again.'))
        return
      }
      try {
        resolve(work())
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error'))
      }
    }, randomDelay())
  })
}
