# Meta-Analysis 101 — Backend Upgrade Plan

## Summary of Decision

We are upgrading Meta-Analysis 101 from a frontend-only React site to a **frontend + backend** project with user authentication and a database. The goal is to let users **track their progress** across sessions and devices — how many eggs they collect, how many dinos they hatch, how many dinos survive, course completion, and more. This adds a persistent gamification loop that ties users more deeply into the learning experience.

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
│    Food Rescue, Home Save            │
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
│  - Real-time subscriptions (future)  │
└─────────────────────────────────────┘
```

**Key principle:** Supabase provides a client SDK that talks directly to the database with Row-Level Security, so the React app can read/write user data securely **without a separate backend server** for most operations. Vercel serverless functions are only needed for custom logic (e.g., AI workshop API proxy).

---

## Database Schema (Live)

### `profiles` table
Stores basic user info, auto-created on first Google login.

| Column       | Type        | Notes                              |
|--------------|-------------|------------------------------------|
| id           | UUID (PK)   | References Supabase auth.users.id  |
| display_name | TEXT        | From Google profile                |
| avatar_url   | TEXT        | From Google profile (optional)     |
| created_at   | TIMESTAMPTZ | Auto-set on creation               |

### `progress` table
Tracks per-user game achievements across all courses.

| Column         | Type        | Notes                                       |
|----------------|-------------|---------------------------------------------|
| id             | UUID (PK)   | Auto-generated                              |
| user_id        | UUID (FK)   | References profiles.id                      |
| course         | INT         | 0, 1, 2, 3, 4, 5                           |
| game_type      | TEXT        | 'egg_hunt', 'dino_hatch', 'food_rescue', 'home_save' |
| egg_index      | INT         | Which egg was chosen (0-6)                  |
| dino_species   | TEXT        | e.g., 'Rex', 'Azure', etc.                 |
| score          | INT         | Number of correct answers                   |
| result         | TEXT        | 'hatched', 'frozen', 'fed', 'saved', 'lost' |
| completed_at   | TIMESTAMPTZ | When this game session happened             |

> **Note:** This schema is a starting point. We may refine it during implementation — e.g., adding a separate `course_completion` table or `badges` table as features grow.

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

### Phase 1 — Database Schema ✅ COMPLETE
7. ✅ Open Supabase dashboard → SQL Editor
8. ✅ Create `profiles` table with SQL
9. ✅ Create `progress` table with SQL
10. ✅ Set up a trigger to auto-create a profile row when a new user signs up via Google
    - Function: `handle_new_user()` extracts `full_name`/`name` and `avatar_url`/`picture` from Google metadata
    - Trigger: `on_auth_user_created` fires after insert on `auth.users`
11. ✅ Enable Row-Level Security (RLS) on both tables
12. ✅ Write RLS policies: users can only SELECT/INSERT/UPDATE their own rows

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
- **⚠️ Vercel deployment:** Must add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` to Vercel → Settings → Environment Variables before deploying, or login will break in production (same `.env` issue as local).

### Phase 2.5 — Unified Navbar + About + Profile Pages ✅ COMPLETE
- ✅ Created `SiteNav.jsx` — shared navbar component used on every page (Hub, all courses, About, Profile)
  - Site logo (clickable → Hub), Course selector dropdown, About link, User profile/login, Language toggle
  - Inside courses: adds back arrow + course label badge with accent color
  - Mobile: hamburger menu with full course list, about, profile, login/logout, language toggle
  - Font consistency: `'Noto Sans TC', 'Outfit', sans-serif'` applied via `FONT` constant everywhere
- ✅ Created `AboutPage.jsx` — standalone About page at `#about` with 4 info cards (goal, audience, structure, sources) + tech stack badges
- ✅ Created `ProfilePage.jsx` — user progress dashboard at `#profile`
  - Not logged in: shows lock icon + login prompt
  - Logged in: fetches from Supabase `progress` table; displays 4 stat overview cards (eggs/7, hatched/7, fed/7, saved/7), dino collection grid (7 slots with hatched/fed/saved status icons), best scores per game, empty state with "Start Learning" button
- ✅ Updated `App.jsx`:
  - Added `useRef` import, `SiteNav`, `AboutPage`, `ProfilePage` imports
  - Replaced Hub's inline nav with `<SiteNav />`
  - All 6 courses now receive `user`, `onLogin`, `onLogout` props
  - Added `#about` and `#profile` routes in switch statement
- ✅ Updated all Course files (0–5):
  - Each imports `SiteNav` and accepts `user`/`onLogin`/`onLogout` props
  - Old per-course inline `<nav>` blocks replaced with `<SiteNav courseId="courseX" courseLabel={...} courseColor="..." />`
  - Course 0: additionally removed redundant section-link nav + mobile hamburger (sidebar catalog is sufficient)
- ✅ Updated `i18n.js`:
  - Added nav keys: `navCourses`, `navAbout`, `navLogin`, `navLogout`, `navLoginSave`, `navProfile`
  - Added ~20 About page keys + ~15 Profile page keys (zh + en)

### Phase 3 — Wire Up Progress Saving ⬅️ NEXT
21. **Course 0 (Egg Hunt):** When user finds an egg → save to `progress` table
22. **Course 1 (Dino Egg Hatch):** When game ends → save egg chosen, dino species, score, result (hatched/frozen)
23. **Course 2 (Dino Food Rescue):** When game ends → save dino chosen, score, result
24. **Course 3 (Dino Home Save):** When game ends → save dino chosen, score, result (saved/lost)
25. **Load on login:** When a user signs in, fetch their progress and reflect it in the UI
26. **Guest mode:** If not logged in, games work normally but nothing is saved to database
- Each game component needs: `import { supabase } from "./supabaseClient"` and a save function that checks `if (user)` before inserting
- The `user` object must be passed down from App.jsx → Course → Game component as a prop

### Phase 4 — Progress Dashboard ✅ COMPLETE (via ProfilePage.jsx)
27. ✅ Built "My Progress" page (`ProfilePage.jsx`) accessible from navbar (avatar click or mobile menu)
28. ✅ Visual summary showing:
    - Eggs collected: X/7
    - Dinos hatched: X/7 (with species names and colors)
    - Dinos fed: X/7
    - Homes saved: X/7
    - Dino collection grid (7 species, reveal on interaction, hatched/fed/saved badges)
    - Best scores per game type
29. Add visual indicators on Course Hub cards (checkmarks, completion badges) — **TODO**
30. ✅ Bilingual support — all i18n keys added for Profile page (English + Traditional Chinese)
- **Note:** Profile page UI is built and queries Supabase. Data will appear once Phase 3 (progress saving) is wired up in game components.

### Phase 5 — Bonus / Polish (Future)
31. **Leaderboard:** Anonymous aggregate stats (e.g., "78% of pharmacists hatched their first dino")
32. **Badges/Achievements:** "Collected all 7 eggs!", "Perfect score on Course 2", etc.
33. **AI Workshop Backend Proxy:** Since Supabase + Vercel are now in the stack, set up Vercel serverless functions to proxy Anthropic API calls — this fixes the existing broken AI workshops in Courses 1 and 2 (noted in PROJECT_PLAN.md as a known issue)
34. **Row-Level Security hardening:** Review and tighten RLS policies before any public launch

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
- **Hash routing:** The current app uses hash-based routing (`#hub`, `#course0`, etc.). Auth callback from Google returns to the site URL, so ensure the redirect lands correctly (may need to handle `#` in redirect URL).

### Mobile & Tablet Responsiveness
- **The site must work well on phones and tablets**, not just desktops. All new UI (login button, progress dashboard, auth modals) must be designed mobile-first or at minimum fully responsive.
- **Login button placement:** Must be easily tappable on mobile — avoid tiny icons in corners. Consider placing it in the existing hamburger menu on mobile, and as a visible button in the nav bar on desktop.
- **Google OAuth on mobile browsers:** `signInWithOAuth` triggers a redirect (not a popup) on mobile, which is the correct behavior. The user leaves the site → signs in on Google's page → returns. Ensure the return redirect URL works correctly with hash routing.
- **Progress Dashboard:** Use a card/grid layout that stacks vertically on narrow screens. Avoid wide tables that require horizontal scrolling on phones.
- **Touch targets:** All interactive elements (buttons, cards, toggles) should be at least 44×44px for comfortable tapping on touchscreens.
- **Existing mobile issues to keep in mind:** The Egg Hunt game previously had a mobile layout issue with 7 eggs overflowing — a hamburger menu was added to fix nav overflow. Any new UI should be tested against similar overflow scenarios on small screens.

### Development Workflow
- **Evelyn uses GitHub Desktop** (not command-line Git) for version control
- **Dev server:** `npm start` (not `npm run dev`)
- **Branch strategy:** Develop on `dev` branch, merge to `main` when ready
- **Prefer plain-language explanations** of code changes — what each piece does and where to apply it — rather than receiving auto-modified files

### Database Considerations
- Supabase free tier: 500MB database, 50K monthly active users — more than sufficient for this project's scale
- The schema above is a starting point. As features grow (Courses 4-5, badges, leaderboards), new tables can be added without disrupting existing data.
- Consider adding an `updated_at` column to `progress` if we want to track replays or best scores over time.

---

## What We're NOT Doing (Scope Boundaries)

- **No custom backend server.** Supabase handles auth + database directly from the client SDK. Vercel serverless functions only if custom logic is needed.
- **No email/password login.** Google OAuth only, to keep things simple. Can be added later if users request it.
- **No native mobile app.** This is a responsive web application that works on phones, tablets, and desktops — not a separate iOS/Android app.
- **No real-time multiplayer features.** Progress tracking is per-user, not collaborative.
- **No paid tier features.** Everything stays within Supabase and Vercel free tiers.

---

## File Changes

### Already done:

| File | Changes |
|------|---------|
| `package.json` | ✅ Added `@supabase/supabase-js` dependency |
| `App.jsx` | ✅ Auth state management, imports SiteNav/AboutPage/ProfilePage, passes user props to all courses, `#about` + `#profile` routes |
| `src/supabaseClient.js` | ✅ Created — initializes Supabase client with URL + anon key from `.env` |
| `.env` | ✅ Created — stores `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` (not in Git) |
| `SiteNav.jsx` | ✅ Created — unified navbar with course dropdown, about link, user profile, language toggle, mobile hamburger |
| `AboutPage.jsx` | ✅ Created — About page with project info cards, tech stack, bilingual |
| `ProfilePage.jsx` | ✅ Created — Progress dashboard with stat cards, dino collection grid, best scores, empty state |
| `Course0.jsx` | ✅ Stripped old section-link nav/mobile menu, uses SiteNav, accepts user props |
| `Course1.jsx` | ✅ Old nav replaced with SiteNav, accepts user props |
| `Course2.jsx` | ✅ Old nav replaced with SiteNav, accepts user props |
| `Course3.jsx` | ✅ Old nav replaced with SiteNav, accepts user props |
| `Course4.jsx` | ✅ Old nav replaced with SiteNav, accepts user props |
| `Course5.jsx` | ✅ Old nav replaced with SiteNav, accepts user props |
| `i18n.js` | ✅ Added nav keys, About page keys, Profile page keys (zh + en) |

### Still needed:

| File | Changes |
|------|---------|
| `DinoEggHunt.jsx` | Add progress saving when eggs are found (if logged in); needs `user` prop from Course0 |
| `DinoEggHatch.jsx` | Add progress saving when game ends; needs `user` prop from Course1 |
| `DinoFoodRescue.jsx` | Add progress saving when game ends; needs `user` prop from Course2 |
| `DinoHomeSave.jsx` | Add progress saving when game ends; needs `user` prop from Course3 |

---

## Lessons Learned During Setup

- **Supabase renamed their keys.** What used to be called `anon key` is now `Publishable key` (starts with `sb_publishable_`). What was `service_role key` is now `Secret key` (starts with `sb_secret_`). Same functionality, new names.
- **`.env` requires dev server restart.** React only reads `.env` at startup. After creating or editing `.env`, you must stop (`Ctrl+C`) and restart (`npm start`). Forgetting this causes `supabaseUrl is required` error.
- **Google Cloud Console UI has changed.** The OAuth setup now goes through "Google Auth Platform" with a left sidebar (Overview, Branding, Audience, Clients, Data Access). The old "OAuth consent screen" flow is replaced.
- **Authorized domains in Branding:** `supabase.co` alone is rejected as "not a top private domain." Use the full project domain instead: `souaycpzgabrxdwvqpmq.supabase.co`.
- **Google OAuth Client Secret is shown only once.** Download the JSON backup immediately when creating the client. Store in Bitwarden, never in Git.
- **Google OAuth starts in Testing mode.** Only manually added test users can sign in. Must "Publish App" under Audience before public launch.

---



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

### Listen for auth changes
```javascript
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    // User is logged in — session.user has their info
  } else {
    // User is logged out
  }
})
```

### Save progress
```javascript
const { error } = await supabase.from('progress').insert({
  user_id: user.id,
  course: 1,
  game_type: 'dino_hatch',
  egg_index: 3,
  dino_species: 'Blaze',
  score: 5,
  result: 'hatched'
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

---

*Document created: March 8, 2026*
*Last updated: March 9, 2026*
*Status: Phases 0-2.5 complete (Supabase + Google OAuth + unified navbar + About page + Profile dashboard). Phase 4 UI built. Next: Phase 3 (wire progress saving into game components so Profile page populates with data).*
