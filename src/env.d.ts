/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Leave unset to run on the local mock layer. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase publishable (anon) key. Safe for the browser; protected by row-level security. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
