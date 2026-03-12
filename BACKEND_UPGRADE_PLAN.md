# Meta-Analysis 101 — Backend Upgrade Plan

## Summary of Decision

We are upgrading Meta-Analysis 101 from a frontend-only React site to a **frontend + backend** project with user authentication and a database. The goal is to let users **track their progress** across sessions and devices — how many eggs they collect, how many dinos they hatch, how many dinos survive, course completion, and more. This adds a persistent gamification loop that ties users more deeply into the learning experience.

**Secondary goal: cost control for AI features.** AI workshops (Midterm/Final) use the Anthropic API via Vercel serverless proxy, which costs money per call. By gating AI features behind login + course completion, we ensure only serious learners consume API credits.

**Tertiary goal: database hygiene.** User progress data is auto-deleted 3 months after the user's last login to keep the database lean over years of usage.

---

## Technology Choices & Rationale

### Backend: Supabase (not Firebase)

**Decision:** Supabase over Firebase.

**Why Supabase:**
- Uses **PostgreSQL** (relational database) — Evelyn already has SQL experience, so this eliminates a major learning curve
- Data is naturally tabular: users, progress records, scores — all fit cleanly into relational tables with rows and columns
- Supabase client SDK reads like SQL translated into JavaScript (e.g., `supabase.from('progress').select('*').eq('user_id', userId)`)
- Supports complex queries naturally (JOINs, filtering, aggregation) — e.g., "show all users who completed Course 2 but haven't hatched a dino" is trivial in SQL
- **Open-source** and built on PostgreSQL, so data/skills are portable — no vendor lock-in
- Bundles **auth + database + real-time** in one package
- Has a built-in SQL editor and visual table dashboard for managing data directly
- Generous free tier: 50,000 monthly active users, 500MB database

**Why not Firebase:**
- Uses Firestore (NoSQL document store) — different mental model, no SQL
- Queries are more limited — no native JOINs, harder complex filtering
- Google-proprietary — harder to migrate away
- Better suited for mobile-first apps or real-time chat, which isn't our use case

### Authentication: Google OAuth Only

**Decision:** Google sign-in only (no email/password, no magic link).

**Why Google only:**
- Target audience is pharmacists doing continuing education — virtually all have a Google account
- One click to sign in, zero passwords to manage
- No "forgot password" flow to build
- No email verification to configure
- Cuts auth implementation work in half compared to multiple login methods
- Login is **optional** — the site remains fully playable without an account, so the rare person without Google just plays without saving progress (no one is locked out)
- Can always add email/magic link later if users actually request it

**Supabase fully supports Google OAuth.** The setup involves:
1. Creating a Google Cloud project + OAuth Client ID (one-time)
2. Adding Client ID/Secret to Supabase dashboard under Authentication → Providers → Google
3. In React code, it's essentially one line: `supabase.auth.signInWithOAuth({ provider: 'google' })`

### Hosting: Vercel (unchanged)

- Already deployed on Vercel at `meta-analysis-101.vercel.app`
- Vercel supports serverless API routes if custom backend logic is needed
- No infrastructure changes required

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│   React Frontend (Vercel)            │
│   Responsive: phone, tablet, desktop │
│  - Course Hub, Courses 0-5           │
│  - Games: Egg Hunt, Dino Hatch,      │
│    Food Rescue, Home Save,           │
│    Key Quest, Door Escape            │
│  - Login button (Google OAuth)       │
│  - Progress Dashboard                │
│  - Supabase JS Client SDK           │
└──────────────┬──────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│         Supabase (Cloud)             │
│  - PostgreSQL Database               │
│  - Auth (Google OAuth)               │
│  - Row-Level Security (RLS)          │
│  - pg_cron (3-month auto-cleanup)    │
└─────────────────────────────────────┘
```

**Key principle:** Supabase provides a client SDK that talks directly to the database with Row-Level Security, so the React app can read/write user data securely **without a separate backend server** for most operations. Vercel serverless functions are only needed for custom logic (e.g., AI workshop API proxy).

---

## Database Schema

> **Updated March 12, 2026.** Replaces the original schema (which had `egg_index` and `dino_species` columns). All decisions locked in via Schema Discussion on March 11, 2026.

### `profiles` table

Stores basic user info, auto-created on first Google login.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | References Supabase `auth.users.id` |
| display_name | TEXT | From Google profile |
| avatar_url | TEXT | From Google profile (optional) |
| created_at | TIMESTAMPTZ | Auto-set on creation |
| last_login_at | TIMESTAMPTZ | Updated on each login; used for 3-month cleanup |

### `progress` table

Tracks per-user game achievements across all 6 courses. One row = one game session (except C0 which saves one row per collected egg).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK) | References `profiles.id` |
| course | INT | 0, 1, 2, 3, 4, 5 |
| game_type | TEXT | `egg_hunt`, `dino_hatch`, `food_rescue`, `home_save`, `key_quest`, `door_escape` |
| dino_index | INT | 0–6, the universal index linking egg ↔ dino across all courses |
| score | INT | Correct count for that session |
| max_score | INT | Denominator: 7 (C0 — but see note), 5 (C1/C2/C3), 9 (C4/C5) |
| result | TEXT | See result values below |
| completed_at | TIMESTAMPTZ | Auto (`now()` default) |

### Result values by course

| Course | Game | Possible `result` values | Meaning |
|--------|------|-------------------------|---------|
| C0 | EggHunt | `collected` | One row per egg unlocked by correct answer |
| C1 | EggHatch | `hatched` / `frozen` | Did the dino hatch or freeze? |
| C2 | FoodRescue | `rescued` / `lost` | Was the food rescued? |
| C3 | HomeSave | `saved` / `lost` | Was the home saved? |
| C4 | KeyQuest | `unlocked` / `locked` | Did the dino earn the key? |
| C5 | DoorEscape | `escaped` / `trapped` | Did the dino escape through the correct door? |

### Score denominators & special cases

| Game | Questions per session | `max_score` saved | Early exit? | Notes |
|------|----------------------|-------------------|-------------|-------|
| EggHunt (C0) | 7 (1 per category) | 1 (per row) | No | Saves individual `collected` rows; total derived by counting |
| EggHatch (C1) | 7 | 5 | Yes (≥5 correct or ≥3 wrong) | `score` = correctCount at game end |
| FoodRescue (C2) | 7 | 5 | Yes (≥5 freed or ≥3 wrong) | `score` = freedCount at game end |
| HomeSave (C3) | 7 | 5 | Yes (≥5 correct or ≥3 wrong) | Timeout counts as wrong |
| KeyQuest (C4) | 9 (3 foundation + 6 advanced) | 9 | No (but locked if foundation <2) | `unlocked` requires foundation ≥2 AND total ≥6 |
| DoorEscape (C5) | 9 (3 foundation + 6 advanced) + door | 9 | No (but locked if foundation <2) | `escaped` requires foundation ≥2 AND correct door AND total ≥6 |

### dino_index ↔ species mapping (universal across all courses)

| `dino_index` | Egg color | ZH name | EN name | Species |
|-------------|-----------|---------|---------|---------|
| 0 | 🟢 `#2ECC71` | 翠牙龍 | Rex | T-Rex |
| 1 | 🔵 `#3498DB` | 蒼瀾龍 | Azure | Plesiosaur |
| 2 | 🟡 `#F1C40F` | 金翼龍 | Zephyr | Pterodactyl |
| 3 | 🔴 `#E74C3C` | 焰角龍 | Blaze | Triceratops |
| 4 | 🟣 `#9B59B6` | 紫棘龍 | Thistle | Stegosaurus |
| 5 | 🟠 `#E67E22` | 珀爪龍 | Velo | Velociraptor |
| 6 | ⚪ `#95A5A6` | 鐵穹龍 | Dome | Pachycephalosaurus |

### Progression chain & gating queries

Each course's outcome gates the next course's available dinos:

```
C0 (EggHunt)     → collect eggs        → result = 'collected'
    ↓ collected eggs become available in C1
C1 (EggHatch)    → hatch dinos         → result = 'hatched' | 'frozen'
    ↓ hatched dinos become available in C2
C2 (FoodRescue)  → rescue food         → result = 'rescued' | 'lost'
    ↓ rescued dinos become available in C3
C3 (HomeSave)    → save homes          → result = 'saved' | 'lost'
    ↓ saved dinos become available in C4
C4 (KeyQuest)    → earn keys           → result = 'unlocked' | 'locked'
    ↓ unlocked dinos become available in C5
C5 (DoorEscape)  → escape the maze     → result = 'escaped' | 'trapped'
```

**Gating is logged-in users only.** Non-logged-in users see all 7 dinos in every course with no gating and no saving.

```sql
-- C1 available eggs: collected in C0
SELECT DISTINCT dino_index FROM progress
WHERE user_id = ? AND course = 0 AND result = 'collected';

-- C2 available dinos: hatched in C1
SELECT DISTINCT dino_index FROM progress
WHERE user_id = ? AND course = 1 AND result = 'hatched';

-- C3 available dinos: rescued in C2
SELECT DISTINCT dino_index FROM progress
WHERE user_id = ? AND course = 2 AND result = 'rescued';

-- C4 available dinos: saved in C3
SELECT DISTINCT dino_index FROM progress
WHERE user_id = ? AND course = 3 AND result = 'saved';

-- C5 available dinos: unlocked in C4
SELECT DISTINCT dino_index FROM progress
WHERE user_id = ? AND course = 4 AND result = 'unlocked';
```

**Replay semantics:** Replaying a game inserts a new row (accumulates history). Gating queries use `SELECT DISTINCT` so duplicates don't cause problems. Players can retry until they succeed.

### AI Workshop Gating

AI workshop features (Midterm/Final AI check buttons) are **only available to logged-in users who have completed the required courses.** This controls API cost.

- **Midterm AI checks:** Require ≥1 row with `course = 3, result = 'saved'` (meaning the user advanced at least one dino through C0→C1→C2→C3)
- **Final AI check:** Requires ≥1 row with `course = 5, result = 'escaped'` (meaning at least one dino completed the full C0→C1→C2→C3→C4→C5 journey)
- Workshop UI is always visible (anyone can read instructions and enter data). Only the AI check buttons are disabled when requirements aren't met.

### 3-Month Data Retention

**Purpose:** Keep the database lean. Not a pedagogical urgency mechanic — no user-facing countdown.

- `profiles.last_login_at` is updated on every login/session restore
- A pg_cron job runs nightly and deletes all `progress` rows for users whose `last_login_at` is >3 months ago
- Users who return after a long break simply start fresh
- Active users (logged in at least once every 3 months) keep everything

---

## Implementation Phases

### Phase 0 — Foundation Setup ✅ COMPLETE
1. ✅ Create Supabase account at supabase.com
2. ✅ Create a new Supabase project (name: `meta-analysis-101`)
3. ✅ Copy the **Project URL** and **anon (public) key** from Settings → API
   - Project URL: `https://souaycpzgabrxdwvqpmq.supabase.co`
   - Publishable key: stored in `.env` (new key format: `sb_publishable_...` replaces old `anon` naming)
4. ✅ Install Supabase client in React project: `npm install @supabase/supabase-js`
5. ✅ Create a `supabaseClient.js` file initializing the client with URL + anon key
6. ✅ Store credentials in environment variables (`.env` file, already in `.gitignore`)

### Phase 1 — Database Schema ✅ COMPLETE (updated March 12, 2026)
7. ✅ Open Supabase dashboard → SQL Editor
8. ✅ Create `profiles` table with SQL
9. ✅ Create `progress` table with SQL
10. ✅ Set up a trigger to auto-create a profile row when a new user signs up via Google
    - Function: `handle_new_user()` extracts `full_name`/`name` and `avatar_url`/`picture` from Google metadata
    - Trigger: `on_auth_user_created` fires after insert on `auth.users`
11. ✅ Enable Row-Level Security (RLS) on both tables
12. ✅ Write RLS policies: users can only SELECT/INSERT/UPDATE their own rows
- ⬅️ **Schema migration needed:** Drop `egg_index` + `dino_species`, add `dino_index` + `max_score`, add `last_login_at` to profiles. See WIRING_GUIDE.md Steps 1–2 for exact SQL.

### Phase 2 — Authentication (Google OAuth) ✅ COMPLETE
13. ✅ Create a Google Cloud project at console.cloud.google.com (project name: `meta-analysis-101`)
14. ✅ Create OAuth 2.0 Client ID (Web application type, name: `Meta-Analysis 101`)
15. ✅ Set Authorized JavaScript origins: `https://meta-analysis-101.vercel.app` + `http://localhost:3000` (dev)
16. ✅ Set Authorized redirect URI: `https://souaycpzgabrxdwvqpmq.supabase.co/auth/v1/callback`
17. ✅ In Supabase dashboard: Authentication → Providers → Google → Enable + paste Client ID + Secret
18. ✅ Build login UI in React:
    - A "Sign in to save progress" button with "G" icon (visible when logged out) — bilingual (登入以儲存進度 / Sign in to save progress)
    - User Google avatar + display name (visible when logged in) — clickable to go to Profile page
    - Sign out button (登出 / Logout)
    - All placed in **unified site-wide navbar** (`SiteNav.jsx`), visible on Hub + all courses + About + Profile pages
19. ✅ Handle auth state with `supabase.auth.getSession()` + `supabase.auth.onAuthStateChange()` in App.jsx
20. ✅ **Login is optional** — all courses and games remain fully accessible without login
- **⚠️ Note:** Google OAuth is currently in **Testing mode** — only manually added test users can sign in. Must click "Publish App" in Google Cloud Console → Audience before public launch.
- **⚠️ Vercel deployment:** Must add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` to Vercel → Settings → Environment Variables before deploying, or login will break in production.

### Phase 2.5 — Unified Navbar + About + Profile Pages ✅ COMPLETE
- ✅ Created `SiteNav.jsx` — shared navbar component used on every page
- ✅ Created `AboutPage.jsx` — standalone About page at `#about`
- ✅ Created `ProfilePage.jsx` — user progress dashboard at `#profile`
- ✅ Updated `App.jsx` with SiteNav, About, Profile imports + routes
- ✅ Updated all Course files (0–5) to use SiteNav and accept user props
- ✅ Updated `i18n.js` with nav, About, Profile keys

### Phase 3 — Wire Up Progress Saving ⬅️ CURRENT
See **`WIRING_GUIDE.md`** for step-by-step instructions. Summary:

1. Run schema migration SQL (drop old columns, add new ones, add `last_login_at`)
2. Update `App.jsx` auth listener to update `last_login_at` on login
3. Wire each game component (C0–C5) to save progress rows when logged in
4. Wire dino gating (C1–C5) to query previous course's results for logged-in users
5. Fix `ProfilePage.jsx` to use new column names and add C4/C5 game types
6. Gate AI workshop buttons behind login + course completion
7. Set up pg_cron for 3-month auto-cleanup

| File | What changes |
|------|-------------|
| Supabase SQL | ALTER `progress` table + add `last_login_at` to profiles |
| `App.jsx` | Update `last_login_at` on auth state change |
| `DinoEggHunt.jsx` | Save `collected` rows per correct answer (if logged in) |
| `DinoEggHatch.jsx` | Accept `user` prop, query available eggs from C0, save `hatched`/`frozen` result |
| `DinoFoodRescue.jsx` | Accept `user` prop, query available dinos from C1, save `rescued`/`lost` result |
| `DinoHomeSave.jsx` | Accept `user` prop, query available dinos from C2, save `saved`/`lost` result |
| `DinoKeyQuest.jsx` | Accept `user` prop, query available dinos from C3, save `unlocked`/`locked` result |
| `DinoDoorEscape.jsx` | Accept `user` prop, query available dinos from C4, save `escaped`/`trapped` result |
| `Course0.jsx` – `Course5.jsx` | Pass `user` prop to game components |
| `ProfilePage.jsx` | Fix stats derivation, use `max_score`, fix dino collection logic, add C4/C5 game types |
| `Midterm.jsx` | Gate AI check buttons behind login + C3 completion |
| `Final.jsx` | Gate AI check buttons behind login + C4 completion |

### Phase 4 — Progress Dashboard ✅ COMPLETE (UI only — awaiting Phase 3 data)
- ✅ Built `ProfilePage.jsx` — stat cards, dino collection grid, best scores, empty state
- ⬅️ **Needs Phase 3 fixes:** Old column references (`egg_index`, `dino_species`, `result === "found"`, hardcoded `/7` denominators)

### Phase 5 — Bonus / Polish (Future)
31. **Leaderboard:** Anonymous aggregate stats (e.g., "78% of pharmacists hatched their first dino")
32. **Badges/Achievements:** "Collected all 7 eggs!", "Perfect score on Course 2", etc.
33. **Hub completion indicators:** Visual checkmarks on Course Hub cards showing which courses are completed
34. **Row-Level Security hardening:** Review and tighten RLS policies before any public launch

---

## Variable Names per Game (for wiring reference)

| Game | Dino selection variable | Score variable | Props currently received | Props needed |
|------|----------------------|----------------|------------------------|-------------|
| DinoEggHunt | N/A (category from question) | `results.filter(r => r.correct).length` | `t, lang` | `t, lang, user` |
| DinoEggHatch | `chosenEgg` | `correctCount` | `t, lang, onNext` | `t, lang, onNext, user` |
| DinoFoodRescue | `chosenDino` | `freedCount` | `t, lang` | `t, lang, user` |
| DinoHomeSave | `chosenDino` | `correctCount` | `t, lang` | `t, lang, user` |
| DinoKeyQuest | `selectedDino` | `score` | `lang` | `lang, user` |
| DinoDoorEscape | `selectedDino` | `score` | `lang` | `lang, user` |

---

## Important Cautions & Notes

### Security
- **Never expose Supabase `service_role` key in frontend code.** Only the `anon` (public) key goes in the React app. The service_role key bypasses RLS and must only be used server-side.
- **Enable RLS on every table.** Without it, any authenticated user could read/write any row.
- **Environment variables:** Store `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in `.env` file. Add `.env` to `.gitignore` so keys don't get committed to GitHub.
- **Vercel environment variables:** For production, add these same variables in Vercel dashboard → Settings → Environment Variables.

### Google OAuth Setup
- After creating the Google Cloud OAuth client, the app starts in "Testing" mode — only test users you explicitly add can log in. You must click **"Publish App"** in Google Cloud Console to allow any Google user to sign in.
- Google may require app verification if you request sensitive scopes, but basic sign-in (email + profile) usually doesn't trigger a full review.
- **Authorized redirect URI must exactly match** the callback URL from Supabase dashboard — even a trailing slash mismatch will cause errors.
- Remember to add both production URL and localhost to authorized origins.

### Migration & Compatibility
- **No breaking changes to existing site.** Login is purely additive — the site continues to work exactly as before for users who don't sign in.
- **Bilingual support:** All new UI elements (login button, progress dashboard, etc.) need entries in `i18n.js` for both English and Traditional Chinese.
- **Hash routing:** The current app uses hash-based routing (`#hub`, `#course0`, etc.). Auth callback from Google returns to the site URL, so ensure the redirect lands correctly.

### Mobile & Tablet Responsiveness
- All new UI (login button, progress dashboard, auth modals) must be mobile-first or fully responsive.
- Login button in hamburger menu on mobile, visible in nav bar on desktop.
- Google OAuth on mobile: `signInWithOAuth` triggers a redirect (not popup), which is correct.
- Touch targets: ≥44×44px for comfortable tapping.

### Development Workflow
- **Evelyn uses GitHub Desktop** (not command-line Git)
- **Dev server:** `vercel dev` for testing with serverless functions; `npm start` for frontend-only
- **Branch strategy:** Develop on `dev` branch, merge to `main` when ready

---

## Code Reference

### Initialize client
```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
)
```

### Google sign-in
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

### Sign out
```javascript
await supabase.auth.signOut()
```

### Listen for auth changes (with last_login_at update)
```javascript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    const u = session?.user ?? null;
    setUser(u);
    if (u) {
      supabase.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", u.id).then();
    }
  });
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        supabase.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", u.id).then();
      }
    }
  );
  return () => subscription.unsubscribe();
}, []);
```

### Save progress (example: C1 EggHatch)
```javascript
const { error } = await supabase.from('progress').insert({
  user_id: user.id,
  course: 1,
  game_type: 'dino_hatch',
  dino_index: 3,          // chosenEgg (0-6)
  score: 5,               // correctCount
  max_score: 5,           // win threshold for C1
  result: 'hatched'       // or 'frozen'
})
```

### Load progress
```javascript
const { data, error } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', user.id)
  .order('completed_at', { ascending: false })
```

### Query available dinos for gating (example: C2)
```javascript
const { data } = await supabase
  .from('progress')
  .select('dino_index')
  .eq('user_id', user.id)
  .eq('course', 1)
  .eq('result', 'hatched');
const available = [...new Set(data.map(r => r.dino_index))];
```

---

## Lessons Learned During Setup

- **Supabase renamed their keys.** What used to be called `anon key` is now `Publishable key` (starts with `sb_publishable_`). What was `service_role key` is now `Secret key` (starts with `sb_secret_`). Same functionality, new names.
- **`.env` requires dev server restart.** React only reads `.env` at startup. After creating or editing `.env`, you must stop (`Ctrl+C`) and restart. Forgetting this causes `supabaseUrl is required` error.
- **Google Cloud Console UI has changed.** The OAuth setup now goes through "Google Auth Platform" with a left sidebar (Overview, Branding, Audience, Clients, Data Access). The old "OAuth consent screen" flow is replaced.
- **Authorized domains in Branding:** `supabase.co` alone is rejected as "not a top private domain." Use the full project domain instead: `souaycpzgabrxdwvqpmq.supabase.co`.
- **Google OAuth Client Secret is shown only once.** Download the JSON backup immediately when creating the client. Store in Bitwarden, never in Git.
- **Google OAuth starts in Testing mode.** Only manually added test users can sign in. Must "Publish App" under Audience before public launch.

---

## What We're NOT Doing (Scope Boundaries)

- **No custom backend server.** Supabase handles auth + database directly from the client SDK. Vercel serverless functions only for AI proxy.
- **No email/password login.** Google OAuth only, to keep things simple. Can be added later.
- **No native mobile app.** Responsive web only.
- **No real-time multiplayer features.** Progress tracking is per-user.
- **No paid tier features.** Everything stays within Supabase and Vercel free tiers.
- **No `tier` column (for now).** C4/C5 tiers (master/explorer/etc.) are collapsed to binary result values for gating. Tiers can be re-derived from `score` if needed later for badges. Adding a `tier` TEXT column is a cheap future migration if we want it.

---

*Document created: March 8, 2026*
*Last updated: March 12, 2026*
*Status: Phases 0–2.5 complete. Phase 3 (wiring) in progress. Schema migration needed before wiring.*
