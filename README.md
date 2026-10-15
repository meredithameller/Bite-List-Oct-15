# Bite List 🍴

A mobile-first food journal and discovery app for creators: log restaurant visits and the dishes you ordered, get a personalized **Next Up** feed, and complete quests for rewards.

> "Bite List" is a working name. Change `APP_NAME` in [`src/lib/config.ts`](src/lib/config.ts) and the whole app follows.

**Front end only.** There is no back end yet. All data comes from a local mock layer persisted to `localStorage`, so logged visits survive a refresh.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command             | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the dev server               |
| `npm run build`     | Typecheck and build for production |
| `npm run typecheck` | TypeScript (strict)                |
| `npm run lint`      | ESLint                             |
| `npm test`          | Vitest + React Testing Library     |
| `npm run format`    | Prettier                           |

Handy while developing:

- **Profile → Reset demo data** restores the seed data and first-run onboarding.
- Add **`?fail=1`** to any URL to make every mock call fail and see the error states.
- The **Eating in: Tampa / Nashville** switch on Next Up sets the mock "current location" used for distances.

## Stack

React 19 + TypeScript (strict) + Vite, React Router, Tailwind CSS v4, TanStack Query, React Hook Form + Zod, Zustand, Vitest + Testing Library, ESLint + Prettier.

## Screens

| Route         | Screen                                                          |
| ------------- | --------------------------------------------------------------- |
| `/onboarding` | 3-step taste quiz                                               |
| `/`           | Next Up feed (max 5 cards, at most **one** sponsored)           |
| `/log`        | Quick Log, a full-screen flow with an autosaved draft           |
| `/places/:id` | Place page: visits, "My Usual Order", map placeholder, wishlist |
| `/wishlist`   | Wishlist, filterable by city and source                         |
| `/quests/:id` | Quest detail                                                    |
| `/passport`   | City stamps, badges, points, streak, quests                     |
| `/profile`    | Creator stats, media kit (stub), settings                       |

## Architecture

```
src/
  api/        types.ts (domain types + repository interfaces)
              index.ts (THE single entry point the app imports)
              mock/    in-memory + localStorage implementations, seed data
  components/ ui/ (primitives), layout/ (shell, tab bar, sidebar)
  features/   feed, log, quests, places, wishlist, passport, profile, onboarding
  hooks/      TanStack Query hooks (useVisits, useNextUp, ...)
  routes/     router + the Quick Log route
  store/      Zustand: UI prefs, autosaved Quick Log draft
  styles/     design tokens (CSS variables, light/dark) + animations
  lib/        config.ts (APP_NAME) + pure logic: quests, feed, rewards, geo, formatting
```

Data flow: **component → hook (TanStack Query) → `api` (src/api/index.ts) → repository**.

- Components and hooks **never** import from `src/api/mock/`. An ESLint rule (`no-restricted-imports`) enforces it; only `src/api/index.ts` is exempt.
- Each repository in `src/api/types.ts` (`VisitsRepository`, `PlacesRepository`, `QuestsRepository`, `FeedRepository`, `WishlistRepository`, `PassportRepository`, `ProfileRepository`) returns Promises. The mocks add a 200-400ms delay so loading and error states are real.
- Business rules are pure functions in `src/lib/` so they are easy to test: `quests.ts` (progress), `feed.ts` (single-sponsor rule), `rewards.ts` (points, streak, badges).

### Product guardrails

- **Rewards are for logging, not ratings.** No function that computes points takes a rating (there is a test for this).
- **Sponsored content is always labeled**, sponsored visits show a disclosure reminder, and the feed shows at most one sponsored card.
- **Quests favor quality over volume.** Progress counts distinct places (a specific dish, a new opening, a neighborhood), so repeat visits do not inflate it.

### Design

Warm, food-forward theme using CSS variables (`src/styles/index.css`). Dark mode follows the OS and can be overridden in Profile. Animations (quest progress, badge unlocks, wishlist heart) are disabled under `prefers-reduced-motion`. Photos are real uploads shrunk to about 600px and stored as data URLs; placeholders are built-in illustrated gradients (no network needed).

## Supabase back end

The app talks to Supabase when `.env.local` has both variables, and falls back to the built-in mock data when they are unset.

```bash
cp .env.example .env.local   # then fill in:
# VITE_SUPABASE_URL=https://<project-ref>.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Restart `npm run dev` after changing env vars. The publishable key is safe in the browser; row-level security protects the data. Never put a `service_role` key in this app.

**What lives where**

| Piece                                | Location                                                               |
| ------------------------------------ | ---------------------------------------------------------------------- |
| The switch (Supabase vs. mock)       | [`src/api/index.ts`](src/api/index.ts)                                 |
| Supabase repositories, mappers, auth | [`src/api/supabase/`](src/api/supabase)                                |
| Generated DB types                   | `src/api/supabase/database.types.ts` (regenerate after schema changes) |
| Schema, RLS policies, signup trigger | [`supabase/migrations/…_init_schema.sql`](supabase/migrations)         |
| Places, quests, badges, feed seed    | [`supabase/migrations/…_seed_catalog.sql`](supabase/migrations)        |

**Data model**

- Shared, read-only catalog (signed-in users can read): `places`, `badges`, `quests`, `feed_items`.
- Private to each user (RLS on `auth.uid()`): `profiles`, `visits`, `items`, `wishlist`, `quest_starts`, `feed_dismissals`.
- A trigger creates a `profiles` row on signup. `anon` has no access to any table, so sign-in is required.
- Quest progress, passport, stats and feed ranking are computed in the app from visits (`src/lib/`), the same code the mock uses.

**Good to know**

- If Supabase "Confirm email" is on (the default), new accounts must click the emailed link before signing in. For quick local testing you can turn it off under Authentication → Providers → Email.
- Catalog dates (quest windows, "new opening" dates) were seeded relative to the day the migration ran. Update `quests.ends_at` when they expire.
- Photos are still stored as small data URLs in `visits.photos`. Moving them to Supabase Storage is the natural next step.
- Profile → "Reset my data" deletes the signed-in user's visits, wishlist, quest starts and dismissals, and restarts onboarding.
