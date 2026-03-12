# Meta-Analysis 101 — Project Plan & Strategy

## Overview
An interactive bilingual (ZH/EN) educational website teaching meta-analysis from beginner to advanced. Built with React, using a shared i18n system and hash-based routing between courses. Each course ends with a unique mini-game (2-3 min) to reinforce learning.

### Game Narrative Arc: "The Great Dino Migration"
Across all 6 courses, the dino games tell a connected story:
- **Course 0:** Discover dino eggs hidden in the research world (Egg Hunt)
- **Course 1:** Hatch the eggs into baby dinos (Egg Hatch)
- **Course 2:** Feed the dinos by rescuing food from ice (Food Rescue)
- **Course 3:** Save the dinos' homes from a blizzard (Home Save)
- **Courses 4–5 (The Migration):** The environment gets too harsh — dinos must find new homes.
  - **Course 4:** Find the KEY to the new home (Key Quest — crystal cave)
  - **Course 5:** Find the right DOOR using a treasure MAP (Map Escape — corridor with 3×3 map puzzle)

Courses 4–5 games introduce **progressive difficulty** (3 foundation MCQ → gate → 6 advanced mixed-type questions) and **diverse question types** (true/false, multi-select, ordering, spot-the-error) beyond the standard MCQ used in Courses 0–3.

## Teaching Schedule
- **Precourse:** Course 0 (Introduction to Meta-Analysis)
- **Foundations:** Courses 1–3 (PICO, Search, Data Extraction) → **MA Workshop: Planning** (guided hands-on practice)
- **Advanced Courses:** Courses 4–5 (Analysis & Interpretation) → **MA Workshop: Analysis** (run MA + write conclusions)
- Games are kept short (2-3 min each) for live classroom use
- Workshops are open-ended: users bring their own clinical question and build a real meta-analysis across both phases

---

## Course Structure

| Section | Course | Topic | Game | Status |
|---------|--------|-------|------|--------|
| **Precourse** | 0 | What is Meta-Analysis? | Dino Egg Hunt (7 eggs, 7 categories, 35-question bank, cheat sheet rewards) | ✅ Live on `main` |
| **Foundations** | 1 | PICO/PICOS Research Question | Dino Egg Hatch (pick 1 of 7 eggs, 7 Qs from 70-question bank, 5 correct = hatch, 3 wrong = freeze, sun/frost particles) | ✅ Built on `dev` |
| | 2 | Literature Search & PRISMA | Dino Food Rescue (pick 1 of 7 dinos, 7 Qs from 70-question bank, crack ice with pickaxe, second chance on wrong, species-matched food) | ✅ Built on `dev` (upgraded: +3 teaching sections, +4 interactive exercises, AI Boolean checker) |
| | 3 | Data Extraction & Risk of Bias | Dino Home Save (pick 1 of 7 dinos, 7 Qs from 70-question bank, 10s timer, correct = fire grows, wrong/timeout = fire dims, 5 correct = win, 3 wrong = lose) | ✅ Built on `dev` (upgraded: +2 teaching sections, +3 interactive exercises, layout polish) |
| | **—** | **MA Workshop: Planning** | **5-step guided workshop: Define PICO (🤖 AI), Search Strategy (🤖 AI), Add Studies, Data Extraction, Risk of Bias. Gate: PICO ✅ + ≥3 studies.** | ✅ Built on `dev` |
| **Advanced** | 4 | Effect Sizes & Forest Plots | Dino Key Quest (pick 1 of 7 dinos, 9 Qs from 105-question bank: 3 foundation MCQ + 6 advanced mixed-type, progressive unlock, crystal cave theme) | ✅ Built on `dev` (upgraded: +1 teaching section "Common Pitfalls", click-based forest plot, 2×2 effect size cards, wider layout) |
| | 5 | Heterogeneity & Publication Bias | Dino Door Escape → Dino Map Escape (pick 1 of 7 dinos, 9 Qs from 105-question bank: 3 foundation MCQ + 6 advanced mixed-type, progressive unlock, treasure map + door theme) | ✅ Built on `dev` |
| | **—** | **MA Workshop: Analysis** | **5-step guided workshop: Effect Size & Model, Prepare Data (CSV + R code), Run Analysis (Onlinemeta / R), Interpret & Report, Conclusions (🤖 AI).** | ✅ Built on `dev` |

---

## File Structure (on `dev` branch)

```
src/
├── App.jsx              ← Router + Course Hub page (hash routing: #hub, #course0–#course5, #about, #profile, #dino, #dino=N, #midterm, #final)
│                           Hub layout: Precourse (C0) → Foundations (C1-C3) + Midterm card → Advanced (C4-C5) + Final card
│                           CourseCard component (course cards) + CheckpointCard component (Midterm/Final clickable cards)
│                           Supabase auth state, Google login/logout, user props passed to all courses + pages
├── SiteNav.jsx          ← Unified site-wide navbar (course dropdown, about, profile, login, lang toggle)
├── AboutPage.jsx        ← About page with project info, audience, structure, sources
├── ProfilePage.jsx      ← User progress dashboard (stats, clickable dino collection → links to DinoIntro codex, best scores)
├── supabaseClient.js    ← Supabase client initialization (imports URL + anon key from .env)
│
├── Course0.jsx          ← Precourse: What is Meta-Analysis? (teaching sections; game extracted to DinoEggHunt)
├── Course1.jsx          ← Course 1: PICO (teaching sections + AI workshop + AI freestyle PICO; game extracted to DinoEggHatch)
├── Course2.jsx          ← Course 2: Literature Search & PRISMA (10 teaching sections + 4 interactive exercises + AI Boolean checker; game extracted to DinoFoodRescue)
├── Course3.jsx          ← Course 3: Data Extraction & RoB (8 sections: 6 teaching + dual extraction + game; 7 interactive components)
├── Course4.jsx          ← Course 4: Effect Sizes & Forest Plots (7 teaching sections + 5 interactive demos; game: DinoKeyQuest)
├── Course5.jsx          ← Course 5: Heterogeneity & Publication Bias (6 teaching sections + 4 interactive demos; game: DinoDoorEscape)
│
├── DinoEggHunt.jsx      ← Course 0 game: egg hunt quiz (7 eggs, 7 categories, cheat sheet rewards; exports StylishEgg SVG)
├── DinoEggHatch.jsx     ← Course 1 game: dragon egg hatching (exports DragonEgg SVG)
├── DinoFoodRescue.jsx   ← Course 2 game: ice-breaking food rescue
├── DinoHomeSave.jsx     ← Course 3 game: save dino's home from freezing
├── DinoKeyQuest.jsx     ← Course 4 game: crystal cave key fragment collection (progressive: 3 foundation MCQ + 6 advanced mixed-type)
├── DinoDoorEscape.jsx   ← Course 5 game: treasure map escape (progressive: 3 foundation MCQ + 6 advanced mixed-type; 3×3 SVG map assembles piece by piece, path leads to correct door)
├── CuteDino.jsx         ← Shared dinosaur SVG component (7 unique species, used across courses)
├── DinoIntro.jsx        ← Dino Codex page (RPG-style character intro; accessible at #dino or #dino=N; linked from ProfilePage dino cards)
│
├── Midterm.jsx          ← MA Workshop Phase 1: Plan Your Meta-Analysis (5-step wizard; PICO + Search with AI checks; study entry, extraction, RoB; gate to Phase 2)
├── Final.jsx            ← MA Workshop Phase 2: Analysis & Conclusions (5-step wizard; effect size/model choice; data prep with CSV + auto-generated R code; external tool guidance; interpretation with reporting guide; conclusions with AI check)
│
├── questionHelpers.js   ← Shared helper functions: pickQuestions(), pickBalanced(), pickByType(), pickAdvancedMix()
├── course0Questions.js  ← Course 0 question bank (35 Qs: 5 per category × 7 categories)
├── course1Questions.js  ← Course 1 question bank (70 Qs: 10 per category × 7 categories)
├── course2Questions.js  ← Course 2 question bank (70 Qs: 10 per category × 7 categories)
├── course3Questions.js  ← Course 3 question bank (70 Qs: 10 per category × 7 categories)
├── course4Questions.js  ← Course 4 question bank (105 Qs: 70 MCQ + 35 advanced — 14 true/false, 7 multi-select, 7 ordering, 7 spot-error)
├── course5Questions.js  ← Course 5 question bank (105 Qs: 70 MCQ + 35 advanced — 14 true/false, 7 multi-select, 7 ordering, 7 spot-error)
│
├── i18n.js              ← All translations (Course 0–5 + Hub + Nav + About + Profile); UI strings only — game questions in separate files
└── index.js             ← Entry point (wraps App in I18nProvider)

Root files:
├── .env                 ← REACT_APP_SUPABASE_URL + REACT_APP_SUPABASE_ANON_KEY (NOT in Git)
├── .env.local           ← Local dev overrides pulled from Vercel (NOT in Git)
├── .gitignore           ← Already includes .env, .env.local
│
api/
└── ai-feedback.js       ← Vercel serverless function: proxies AI workshop requests to Anthropic API (hides API key server-side)

Project docs:
├── BACKEND_UPGRADE_PLAN.md  ← Full backend plan: tech choices, schema, implementation phases, code reference
├── WIRING_GUIDE.md          ← Step-by-step instructions for Phase 3 wiring
├── COURSE_DETAILS.md        ← Per-course reference: sections, interactive components, game mechanics, question banks, known issues
└── PROJECT_PLAN.md          ← This file: high-level overview, design system, technical notes
```

---

## Git Strategy
- **`main` branch:** Public, deployed. Currently only Course 0.
- **`dev` branch:** Development. All courses. Push here freely.
- **To publish:** `main` ← merge `dev` when ready (via GitHub Desktop "Pull Request")
- **Tool:** GitHub Desktop (no command line needed)

---

## Course & Workshop Details

> **See `COURSE_DETAILS.md`** for the full reference on every course, game, interactive component, and workshop. That file covers:
> - Per-course: sidebar catalog, section descriptions, interactive component inventory, game mechanics (file, mechanic, question bank, categories, scoring, phases, key state, props, DB save plan), known issues
> - Midterm & Final: 5-step wizard details, AI gating rules, demo data, state management, external tools

---

## Design System

### Colors:
- TEAL: `#0E7C86` (primary, Course 0)
- CORAL: `#E8734A` (accent, Course 1)
- PURPLE: `#7B68C8` (Course 2 accent)
- GOLD: `#D4A843` (Course 3 accent)
- BLUE: `#2E86C1` (Course 4 accent — deep blue, evokes precision/data visualization)
- CRIMSON: `#C0392B` (Course 5 accent — deep red, evokes warning signals/critical appraisal)
- DARK: `#1D2B3A` (text)
- LIGHT_BG: `#F8F7F4` (background)
- MUTED: `#6B7A8D` (secondary text)
- LIGHT_BORDER: `#E8E6E1`

### Fonts:
- Headings: 'Noto Sans TC', 'Source Serif 4', serif
- Body: 'Noto Sans TC', 'Outfit', sans-serif

### Shared Components:
- `SiteNav` — Unified site-wide navbar with course dropdown, about, profile, login, language toggle (lives in `SiteNav.jsx`)
- `FadeIn` — Intersection observer scroll animation
- `SectionLabel` — Uppercase colored label with line
- `SectionTitle` — Responsive heading
- `Paragraph` — Styled body text
- `CuteDino` — 7 unique dinosaur SVGs (T-Rex, Plesiosaur, Pterodactyl, Triceratops, Stegosaurus, Velociraptor, Pachycephalosaurus)
- `DragonEgg` — SVG egg with states: idle, crack, frozen (lives in `DinoEggHatch.jsx`, exported as named export)
- `StylishEgg` — SVG egg with variants: solid, ghost, dashed, cracked-correct, cracked-wrong (lives in `DinoEggHunt.jsx`, exported as named export)

### Dino Codex (DinoIntro):
- RPG-style character intro page at `#dino` (full roster) or `#dino=N` (opens specific dino, N = 0–6)
- **Roster strip** at top: all 7 dinos as selectable buttons with breathing animation on active
- **Detail card** per dino: large CuteDino illustration, character name + species subtitle, element badge, personality tag, skill badge, bilingual lore paragraph, animated stat bars (PWR/WIS/SPD/CHR)
- **"Back to Profile"** nav button at bottom
- Linked from ProfilePage: each dino card in the collection grid is clickable → navigates to `#dino=N`
- ProfilePage also has a "View Codex →" link next to the Dino Collection header
- Dinos are **not** tied to specific courses — they are collectible characters across all games
- Colors match original CuteDino palette: `#2ECC71, #3498DB, #F1C40F, #E74C3C, #9B59B6, #E67E22, #95A5A6`
- Bilingual: character names (翠牙龍/Rex, 蒼瀾龍/Azure, etc.), species names, lore text, stat labels, all UI strings

### Navigation Pattern (all courses):
- **Unified site-wide navbar** (`SiteNav.jsx`) — Fixed, frosted glass. Present on every page (Hub, Courses 0–5, About, Profile). Contains:
  - Site logo "統合分析 101" (clickable → Hub)
  - Course selector dropdown (all 6 courses with emojis + active indicator)
  - "About" link (→ `#about` page)
  - User area: logged in = avatar (clickable → Profile) + name + logout; logged out = "Sign in" button
  - Language toggle (EN/中)
  - Inside courses: adds back arrow (← Hub) + course label badge with accent color + `/` separator
  - Mobile (≤768px): hamburger menu with full course list, about, profile, hub link, login/logout, language toggle
- **Sticky sidebar catalog** — Fixed on left side (desktop ≥1100px only), shows numbered section list with active section highlighted. Uses course accent color (TEAL/CORAL/PURPLE/GOLD/BLUE/CRIMSON) for active indicator. Hides on mobile/tablet (<1100px).
- **Active section tracking** — IntersectionObserver watches all section IDs, updates `activeSection` state as user scrolls, highlights current item in sidebar.
- **"Next →" buttons** — At the bottom of each teaching section, scrolls to next section. Last teaching section uses CORAL accent to signal game section.
- **Footer navigation** — "← Back to Previous Course" + "Course Hub" + "Next Course →" buttons. Precourse (Course 0) has no back button (first course). Course 5's "Next" is disabled (final course, shows "🎓 Course Complete!").
- **Mobile** — Navbar hamburger provides course navigation; sidebar hidden; "Next →" buttons for section navigation within courses.

### i18n Pattern:
- All keys prefixed by course: `c1` for Course 1, `c2` for Course 2, `c3` for Course 3, `c4` for Course 4, `c5` for Course 5
- Template literals like `` t(`c1trap${n}Title`) `` need the prefix inside the backtick
- Function values (e.g., gameQ, gameScore) use `t("key", arg)` NOT `t("key")(arg)`
- Hub keys use `hub` prefix: `hubPrecourse`, `hubPrecourseDesc`, `hubSection1`, `hubSection1Desc`, `hubSection2`, `hubSection2Desc`, `hubMidtermTitle`, `hubMidtermDesc`, `hubFinalTitle`, `hubFinalDesc`
- Old `hubHour1`/`hubHour2` keys removed — replaced by section/checkpoint keys above
- **Game questions are NOT in i18n.js** — they live in per-course question files (`course0Questions.js`, `course1Questions.js`, etc.) with bilingual text embedded per question object
- **Cleaned up:** `eggQ_*` keys (Course 0 questions) and `c2gq*` keys (Course 2 game questions) removed from `i18n.js` — now in their respective question files

---

## Technical Notes

### Adding a New Course:
1. Create `CourseN.jsx` with teaching sections (AI workshop optional — only if AI feedback adds clear value beyond existing interactive exercises)
2. Add sticky sidebar catalog with `catalogItems` array, `activeSection` state, and IntersectionObserver (copy pattern from any existing course)
3. Create game as standalone component (e.g., `DinoGameN.jsx`) — import by CourseN
4. Create `courseNQuestions.js` — for foundation courses: 70 bilingual MCQ (10 per category × 7 categories); for advanced courses: 70 MCQ + 35 advanced (5 per category: 2 true/false, 1 multi-select, 1 ordering, 1 spot-error); import helpers from `questionHelpers.js`
5. Add translations to `i18n.js` with `cN` prefix (UI strings only — game questions stay in courseNQuestions.js)
6. Add route in `App.jsx` switch statement
7. Add course card in `App.jsx` — to `precourse`, `section1Courses`, or `section2Courses` as appropriate
8. Update hub status from "coming" to "available"
9. Update previous course's footer "Next Course" button from disabled/Coming Soon to active link

### Question Bank Architecture (split per course):
- Each course has its own question file: `course0Questions.js`, `course1Questions.js`, etc.
- Shared helpers in `questionHelpers.js`: `pickQuestions()`, `pickBalanced()`, `pickByType()`, `pickAdvancedMix()`
- **Standard MCQ questions:** `{ id, category, type: "mcq", zh: { q, opts, exp }, en: { q, opts, exp }, correct }`
- **Advanced question types (Courses 4–5):**
  - `type: "true_false"` — statement + `correct: true/false`
  - `type: "multi_select"` — `opts` array + `correctAll: [indices]` (pick ALL correct)
  - `type: "ordering"` — `items` array + `correctOrder: [indices]` (arrange in order)
  - `type: "spot_error"` — `statements` array + `correct: index` of the error (-1 = no error / trick question)
- `id` format: `"cN-XXX"` (e.g., `"c0-WW01"`, `"c1-042"`, `"c4-085"`)
- `category` (0–6) maps to 7 thematic groups per course
- Helper functions in `questionHelpers.js`:
  - `pickQuestions(pool, n)` — pure random pick
  - `pickBalanced(pool, n, numCategories)` — even coverage across categories, then shuffle
  - `pickByType(pool, type, n)` — pick N questions of a specific type with balanced categories
  - `pickAdvancedMix(pool, n)` — pick N non-MCQ questions with type variety (2 true/false, 2 multi-select, 1 ordering, 1 spot-error for n=6)
- Game components localize at runtime: `q[lang].q`, `q[lang].opts`, `q.correct`, `q[lang].exp`
- Currently: 525 questions total (35 Course 0 + 70 Course 1 + 70 Course 2 + 70 Course 3 + 105 Course 4 + 105 Course 5 + 70 reserve per advanced course)

### Common Pitfalls:
- Template literal translation keys MUST include prefix: `` t(`c1scenario${s}`) `` not `` t(`scenario${s}`) ``
- Function translation values: use `t("key", arg)` not `t("key")(arg)`
- Test emoji rendering across systems — prefer pre-2020 Unicode
- ~~AI features need backend proxy for API key — currently broken in browser~~ ✅ FIXED via `api/ai-feedback.js`

### Backend: AI Workshop Proxy ✅ COMPLETE
- **Vercel serverless function:** `api/ai-feedback.js` proxies requests to Anthropic API
- **How it works:** Frontend sends `{ system, userMessage }` to `/api/ai-feedback` → serverless function calls Anthropic with hidden API key → returns AI response
- **API key:** Stored in Vercel Environment Variables (`ANTHROPIC_API_KEY`), never exposed in frontend code
- **Local dev:** Use `vercel dev` (not `npm start`) to test serverless functions locally; `.env.local` pulled from Vercel
- **Cost:** ~$0.003–0.01 per AI check (prepaid credits at console.anthropic.com)
- **Courses using it:** Course 1 AI PICO Workshop + Freestyle PICO, Course 2 AI Boolean Query Checker, **MA Workshop: Planning** (PICO check + Search strategy check), **MA Workshop: Analysis** (Conclusions check)
- **Future courses:** Can reuse the same `/api/ai-feedback` endpoint — just send different system prompts from frontend
- **Cost control (Phase 3):** AI workshop features gated behind login + course completion

### Backend Status (Supabase Integration):
- See `BACKEND_UPGRADE_PLAN.md` for full details (schema, implementation phases, code reference)
- See `WIRING_GUIDE.md` for step-by-step Phase 3 instructions
- **Supabase project:** `meta-analysis-101` at `https://souaycpzgabrxdwvqpmq.supabase.co`
- **Auth:** Google OAuth configured and working (login/logout tested locally)
- **Database:** `profiles` table (with `last_login_at` for 3-month cleanup) + `progress` table (with `dino_index`, `max_score`) — RLS policies + auto-profile trigger active
- **Schema:** `dino_index` (INT 0–6) replaces old `egg_index` + `dino_species`. `max_score` column added for correct score denominators. See BACKEND_UPGRADE_PLAN.md for full schema.
- **Frontend wiring:** `supabaseClient.js` created, `App.jsx` updated with auth state, user props passed to all courses
- **Unified navbar:** `SiteNav.jsx` — site-wide nav with login/profile UI, replaces per-course inline navs
- **About page:** `AboutPage.jsx` — standalone page at `#about`
- **Profile dashboard:** `ProfilePage.jsx` — progress dashboard at `#profile` (reads from `progress` table; clickable dino cards link to DinoIntro codex; UI built, needs Phase 3 fixes for new column names)
- **3-month data retention:** pg_cron auto-deletes progress for users inactive >3 months (based on `last_login_at`). Silent cleanup, not user-facing.
- **AI workshop gating:** AI check buttons in Midterm/Final disabled unless user is logged in + completed required courses. Controls API cost.
- **Next:** Run schema migration SQL, then wire progress saving into game components (Phase 3)
