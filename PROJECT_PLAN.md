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
| | 3 | Data Extraction & Risk of Bias | Dino Home Save (pick 1 of 7 dinos, 7 Qs from 70-question bank, 10s timer, correct = fire grows, wrong/timeout = fire dims, 5 correct = win, 3 wrong = lose) | ✅ Built on `dev` (upgraded: +2 teaching sections, +3 interactive exercises, AI extraction reviewer) |
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
├── Course3.jsx          ← Course 3: Data Extraction & RoB (9 sections: 6 teaching + dual extraction + game + AI extraction reviewer; 7 interactive components)
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
```

---

## Git Strategy
- **`main` branch:** Public, deployed. Currently only Course 0.
- **`dev` branch:** Development. All courses. Push here freely.
- **To publish:** `main` ← merge `dev` when ready (via GitHub Desktop "Pull Request")
- **Tool:** GitHub Desktop (no command line needed)

---

## Course 1 Details (PICO)

### Sections (in order):
1. **Why PICO?** — Bad vs good question comparison
2. **PICO Elements** — 4 interactive cards (P, I, C, O) in 2×2 grid
3. **PICOS Extension** — The S (Study design) element
4. **Common Mistakes** — 5 PICO traps (bad/good comparison cards)
5. **Interactive PICO Builder** — Multiple-choice: pick best P, I, C, O for 3 scenarios (Cardiology/Infectious Disease/Psychiatry)
6. **Dino Egg Hatch Game** — Pick 1 of 7 eggs → 7 questions drawn from 70-question bank (balanced across 7 categories) → 5 correct = hatch dinosaur with sun particles, 3 wrong = freeze with snowflake particles
7. **AI PICO Workshop** — Pick from 3 preset scenarios, write free-text PICO, AI gives inline feedback per field + overall assessment
8. **AI Freestyle PICO** — User writes their own research topic, optional AI topic check, then writes PICO for their topic with per-field AI feedback + overall assessment. Separate section in sidebar catalog.

### Game Mechanics (Dino Egg Hatch):
- Standalone component in `DinoEggHatch.jsx`, imported by `Course1.jsx` (same pattern as Course 2's DinoFoodRescue)
- Also exports `DragonEgg` SVG component (named export) used decoratively in Course1 hero section
- 70-question bank in `course1Questions.js` (`course1Questions`), 10 per category × 7 categories:
  - Cat 0: Identifying correct PICO format
  - Cat 1: Population (P) — specificity & scope
  - Cat 2: Intervention (I) — defining the treatment
  - Cat 3: Comparison (C) — choosing comparators
  - Cat 4: Outcome (O) — measurable endpoints
  - Cat 5: PICOS & Study design (S)
  - Cat 6: Common mistakes & pitfalls
- `pickBalanced()` helper draws 7 questions evenly across categories, then shuffles
- Each playthrough gets different questions — high replayability
- 7 eggs with unique colors matching Course 0's palette: `#2ECC71, #3498DB, #F1C40F, #E74C3C, #9B59B6, #E67E22, #95A5A6`
- 7 dinosaur names (zh): 翠牙龍, 蒼瀾龍, 金翼龍, 焰角龍, 紫棘龍, 珀爪龍, 鐵穹龍
- 7 dinosaur names (en): Rex, Azure, Zephyr, Blaze, Thistle, Velo, Dome
- Correct → ☀️ sun particles fall + warm golden glow grows around egg
- Wrong → ❄️ snowflake particles fall + frost blue glow grows around egg
- Progress shown as: 5 sun circles ○○○○○ | 3 ice circles ○○○

### Known Issues:
- ~~**AI Workshop doesn't work**~~ — ✅ FIXED. AI Workshop now works via Vercel serverless proxy (`api/ai-feedback.js`). API key stored in Vercel environment variables. Same fix applied to Course 2.
- ~~**Game "Continue" button broken**~~ — ✅ FIXED. Button had no `onClick` handler and wrong label ("Course 2" instead of "AI Workshop"). Added `onNext` prop to `DinoEggHatch`, wired to scroll to `#ai-workshop` section. Label update pending in `i18n.js` (`c1gameContinue` key).
- Emoji rendering: some newer Unicode emojis (🫀🦠🧠) don't render on all systems. Use older, safer alternatives.

---

## Course 2 Details (Literature Search & PRISMA)

### Sections (in order):
1. **Why Systematic Search?** — Random vs systematic comparison cards + **"Spot the Search" interactive quiz** (4 scenarios, classify as systematic vs casual, instant feedback)
2. **Database Overview** — PubMed, Embase, Cochrane, WoS, CINAHL, Grey literature (6 hover-cards)
3. **Boolean Operators** — AND/OR/NOT with interactive Venn diagrams + **interactive Boolean combo builder** (3 switchable clinical scenarios: HF/SGLT2i, Asthma/ICS, CKD/GLP-1 RA — replaces old hardcoded combo example)
4. **MeSH & Controlled Vocabulary** ← NEW — Expandable MeSH tree explorer (Heart Failure hierarchy) + 4 clickable concept cards (MeSH vs free text, explosion, subheadings, truncation)
5. **PRISMA Flow Diagram** — Interactive animated visualization with step-through + exclusion branches
6. **Screening Tips & Drill** — 4 practical tip cards + **screening practice drill** (4 mock abstracts, learner decides include/exclude against a given PICO, instant feedback with explanations)
7. **Grey Literature** ← NEW — Teaching section on publication bias + **"Grey Lit Scavenger Hunt"** (8-source checkbox quiz: ClinicalTrials.gov, conference abstracts, dissertations, WHO reports, preprints, reference lists vs Wikipedia, PubMed indexed)
8. **Search Strategy Pitfalls** ← NEW — 4 bad/good trap cards (language restrictions, outcome terms in search, MeSH-only vs combined, skipping citation tracking)
9. **Dino Food Rescue Game** — Pick 1 of 7 dinos → 7 shuffled questions → crack ice cubes with pickaxe to free food
10. **AI Boolean Query Checker** — Learner pastes their PubMed search syntax, AI critiques Boolean logic, missing synonyms, scope issues, and suggests improvements. Uses `/api/ai-feedback` Vercel serverless proxy.

### Interactive Components (new in upgrade):
- **SpotTheSearch** — 4-scenario quiz in S1: classify systematic vs casual, with per-scenario explanations
- **BooleanComboBuilder** — 3 clinical scenario tabs in S3: auto-generates color-coded Boolean syntax with PICO concept labels
- **MeSHTreeExplorer** — Expandable tree in S4 (new section): Heart Failure → HFrEF/HFpEF/Cardiomyopathies + 4 clickable concept cards
- **ScreeningDrill** — 4 mock abstracts in S6: include/exclude decisions against a PICO, with detailed feedback
- **GreyLitHunt** — 8-source checkbox quiz in S7 (new section): identify grey literature sources
- **AIBooleanChecker** — AI-powered search syntax reviewer in S10

### Sidebar catalog: 10 items
1. Why Systematic Search (with Spot the Search quiz)
2. Database Overview
3. Boolean Operators (with interactive combo builder)
4. MeSH & Controlled Vocabulary ← NEW
5. PRISMA Flow Diagram
6. Screening Tips & Drill (with screening practice)
7. Grey Literature ← NEW
8. Search Strategy Pitfalls ← NEW
9. Dino Food Rescue
10. AI Workshop (Boolean Query Checker)

### Game Mechanics (Dino Food Rescue):
- Standalone component in `DinoFoodRescue.jsx`, imported by `Course2.jsx`
- Pick 1 of 7 dinos → each has species-matched food trapped in ice cubes
- 70-question bank in `course2Questions.js` (`course2Questions`), 10 per category × 7 categories:
  - Cat 0: Systematic vs casual search
  - Cat 1: Databases (PubMed, Embase, Cochrane, etc.)
  - Cat 2: Boolean operators & search syntax (AND, OR, NOT, MeSH, truncation)
  - Cat 3: PRISMA flow diagram
  - Cat 4: Screening process
  - Cat 5: Grey literature & search completeness
  - Cat 6: Search strategy pitfalls & best practices
- 7 questions drawn per playthrough via `pickBalanced()` — different each time
- **Win/Lose mechanic (matches DinoEggHatch pattern):** 5 correct = win (dino eats happily), 3 wrong = lose (dino starves). No retries on wrong answers. Game ends early when either threshold is hit.
- Correct → pickaxe swing animation (400ms delay) → ice crack lines grow → ice shatters into particles → food pops out → dino bounces happily
- Wrong → pickaxe bounces off → ice shakes → explanation shown → "Next" button (no retry)
- Progress display: `🐟 3/5` correct + `❌ 1/3` wrong (similar to egg hatch sun/ice counters)
- Pickaxe positioned to right of ice cube, swing pivots from handle grip (tip hits ice)
- Dino reactions: happy bounce (correct), sad shake (wrong), eating animation (food freed)
- Thought bubble shows desired food floating above dino (absolute positioned, top-right)
- Species-matched food: Rex→🍖, Azure→🐟, Zephyr→🦐, Blaze→🌿, Thistle→🌱, Velo→🥚, Dome→🍄
- Results screen: win = celebration with bouncing dino + food emojis, lose = encouraging retry message
- Bilingual UI strings handled internally (no new i18n keys needed)

### Known Issues:
- ~~**Venn diagram text too small**~~ — ✅ FIXED. SVG text bumped from 9–10px to 12–13px, diagram size increased from 120 to 180.
- ~~**Monospace font in Boolean examples**~~ — ✅ FIXED. Replaced `monospace` with `'Noto Sans TC', 'Outfit', sans-serif` in example boxes and search strategy block.
- ~~**Pickaxe positioned wrong / swing direction wrong**~~ — ✅ FIXED. Pickaxe moved to right of ice, transformOrigin changed to `75% 75%`, swing animations reversed.
- ~~**Food thought bubble on dino's head**~~ — ✅ FIXED. Changed to absolute positioning (top-right of dino wrapper).
- ~~**No delay between axe swing and ice crack**~~ — ✅ FIXED. Added 400ms delay.
- ~~**Retry mechanic removed**~~ — ✅ Replaced with DinoEggHatch-style 5-correct/3-wrong win/lose system.

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

## Course 3 Details (Data Extraction & Risk of Bias)

### Sections (in order):
1. **Why Data Extraction Matters** — Opening hook: "reading the nutrition label, not just the food packaging." Bad example (grabbing only p-values from abstracts) vs good example (structured extraction of events, sample sizes, means, SDs). Emphasizes garbage-in-garbage-out.
2. **The Extraction Table** — Interactive demo of a standardized data extraction form. 8 clickable columns: Author/Year, Study Design, Population (n), Intervention details, Comparator, Outcome definition, Results (raw numbers), Notes. Click each to see what goes in it with example data. Cooking analogy: "measuring each ingredient precisely before adding it to the pot."
3. **What Numbers to Extract** — Two clickable tracks side by side: (a) Dichotomous outcomes → events + totals per group, and (b) Continuous outcomes → mean, SD, n per group. Also covers Wan/Luo conversion. + **Extraction Drill** ← NEW: 2 mock studies (1 dichotomous DAPA-HF, 1 continuous Metformin), learner picks correct numbers from 4 options each, with explanations.
4. **Risk of Bias: Why Quality Matters** — Analogy: "checking freshness of ingredients before cooking." Concept that not all included studies are trustworthy. Cooking analogy: one spoiled ingredient ruins the whole pot → sensitivity analysis.
5. **RoB Tools** — Two interactive cards: Cochrane RoB 2 (5 domains, traffic-light levels) + NOS (3 categories, star system). + **"Rate This Study" exercise** ← NEW: Mock Metformin RCT, learner assigns Low/Some Concerns/High to each of 5 RoB 2 domains with per-domain feedback.
6. **Putting It Together** — Interactive traffic-light matrix for 5 example studies, with a "sensitivity analysis" toggle button that excludes the high-risk study and shows the pooled estimate change.
7. **Dual Extraction & Disagreement Resolution** ← NEW — 4-step workflow cards (independent extraction → compare with Cohen's kappa → resolve disagreements → pilot calibrate) + tool tip about Covidence/Rayyan.
8. **Dino Home Save Game** — Pick 1 of 7 dinos → 7 questions → 10s timer → keep the fireplace burning
9. **AI Extraction Reviewer** ← NEW — DAPA-HF study scenario: learner fills in extraction fields (events/totals per group), AI checks if they grabbed the right numbers and flags common mistakes (ITT vs per-protocol, percentages vs raw counts). Uses `/api/ai-feedback` Vercel serverless proxy.

### Sidebar catalog: 9 items
1. Why It Matters
2. Extraction Table
3. What Numbers (with Extraction Drill)
4. Risk of Bias
5. RoB Tools (with Rate This Study)
6. Putting It Together
7. Dual Extraction ← NEW
8. Dino Home Save
9. AI Workshop ← NEW

### Game Mechanics (Dino Home Save):
- Standalone component in `DinoHomeSave.jsx`, imported by `Course3.jsx`
- Pick 1 of 7 dinos → each needs to keep their home warm during a blizzard
- 70-question bank in `course3Questions.js` (`course3Questions`), 10 per category × 7 categories:
  - Cat 0: Purpose and principles of data extraction
  - Cat 1: What to extract for dichotomous outcomes
  - Cat 2: What to extract for continuous outcomes + conversions (median→mean)
  - Cat 3: Cochrane RoB 2 domains
  - Cat 4: Newcastle-Ottawa Scale for observational studies
  - Cat 5: Dual extraction, disagreement resolution, and error prevention
  - Cat 6: Sensitivity analysis and handling problematic studies
- 7 questions drawn per playthrough via `pickBalanced()` — different each time
- **10-second timer** per question — snow keeps falling while timer counts down
- Correct → fire in fireplace grows larger and brighter, dino warms up, background shifts to warm tones
- Wrong/Timeout → fire dims, dino shivers, more snow falls, background shifts to cold tones
- **Win condition:** 5 correct answers → home saved! (roaring fire, happy dino)
- **Lose condition:** 3 wrong/timeout → home frozen (fire out, sad dino, ice overlay)
- No second chances (unlike Course 2) — the timer pressure is the difficulty mechanic
- Progress shown as: 5 fire circles 🔥🔥🔥🔥🔥 | 3 ice circles ❄❄❄
- SVG animated fireplace with flickering flames (5 intensity levels)
- Falling snow particles with intensity proportional to fire weakness
- Background color transitions: warm gold (fire strong) → cold blue (fire weak)
- Bilingual UI strings handled internally (no new i18n keys needed for game — all in-component)
- `course3Categories` exported from `course3Questions.js` for reference

### Interactive Components:
- **ExtractionTableDemo** — 8 clickable column cards, detail panel shows description + example data
- **OutcomeTracksDemo** — Dichotomous vs Continuous toggle cards with extraction format details
- **ExtractionDrill** ← NEW — 2 mock study scenarios (dichotomous + continuous), pick correct extraction data from 4 options
- **RoBToolCards** — Two expandable cards: RoB 2 (5 domains, traffic-light levels) and NOS (3 categories, star system)
- **RateThisStudy** ← NEW — Mock RCT, assign Low/Some Concerns/High to 5 RoB 2 domains with per-domain feedback
- **TrafficLightDemo** — 5-study matrix with colored dots, sensitivity analysis toggle button that excludes high-risk study and updates pooled effect live
- **AIExtractionReviewer** ← NEW — DAPA-HF study scenario, learner fills extraction form, AI reviews accuracy

---

## Course 4 Details (Effect Sizes & Forest Plots)

### Accent Color: `#2E86C1` (deep blue)

### Sections (in order):
1. **What Is an Effect Size?** — Opening: "A study says the drug 'works' — but how much?" Introduces effect size as the single number encoding magnitude. Analogy: "the Yelp rating for a study — not just thumbs up/down, but a score."
2. **Types of Effect Sizes** — Four interactive expandable cards in 2×2 grid: (a) Odds Ratio (OR) — binary outcomes, with formula and pharmacy example. (b) Risk Ratio (RR) — same 2×2 table, different calculation. (c) Mean Difference (MD) — continuous outcomes, same scale. (d) SMD/Cohen's d — different scales. Each shows formula visually + null value.
3. **Weighting: Not All Studies Are Equal** — Interactive demo: toggle between inverse-variance weighted average and simple average. Visualizes n=30 vs n=3000 study weights. Square sizes change dynamically. Analogy: "trusting a poll of 10,000 more than a poll of 10."
4. **Fixed vs Random Effects** — Side-by-side toggle. 5-study mini forest plot recalculates under each model. Watch CI widen under random effects. Shows how small study weights shift. Explanation box updates with model description.
5. **Anatomy of a Forest Plot** — Interactive click-based visualization (matching Course 0 pattern). Build a 5-study forest plot piece by piece: study labels, squares (point estimates), CI lines, square sizes (weight), null line (OR=1, dashed), pooled diamond. Click each element for explanations in a panel above the plot.
6. **Reading a Forest Plot** — Three practice exercises with guided questions: "Does the pooled effect cross the null?" "Which study has the most weight?" "Is the overall result significant?" Answer options with immediate feedback and explanations.
7. **Common Pitfalls** ← NEW — Six clickable cards in 2×2 grid covering the most common interpretation mistakes: (a) Significant ≠ Meaningful (p < 0.05 ≠ clinical importance). (b) OR ≠ RR (can't interchange). (c) Don't Ignore CI Width. (d) SD ≠ SE (mixing them up). (e) Non-Significant ≠ No Effect (absence of evidence). (f) Don't Mix Effect Size Types (must convert before pooling). Each card has bilingual description + pharmacy example.

### Interactive Components:
- **EffectSizeCards** — 4 expandable cards in 2×2 grid (OR, RR, MD, SMD) with formulas, descriptions, pharmacy examples, null values
- **WeightingDemo** — Toggle weighted vs simple average, dynamic square sizes, pooled diamond position shifts
- **FixedRandomToggle** — 5-study forest plot that recalculates under fixed/random models, CI width changes visible
- **ForestPlotAnatomy** — Click-based forest plot (Course 0 pattern) with 4 clickable elements (squares, lines, null line, diamond), explanation panel above plot, proper log-scale OR axis, dashed null line
- **ForestPlotExercise** — 3 progressive practice questions with answer feedback
- **CommonPitfalls** ← NEW — 6 expandable cards in 2×2 grid (significance vs meaningfulness, OR vs RR, CI width, SD vs SE, non-significant vs no effect, mixing effect size types), red accent on active

### Question Bank (105 Qs = 70 MCQ + 35 advanced):
- `course4Questions.js` with `course4Categories` export
- **MCQ (70 Qs: 10 × 7 categories):**
  - Cat 0: What effect sizes are and why they matter
  - Cat 1: Odds Ratio and Risk Ratio (calculation, interpretation)
  - Cat 2: Mean Difference and SMD (when to use, interpretation)
  - Cat 3: Weighting and inverse-variance method
  - Cat 4: Fixed-effect vs. random-effects models
  - Cat 5: Forest plot anatomy and reading
  - Cat 6: Common mistakes (e.g., confusing OR with RR, misreading CIs)
- **Advanced (35 Qs: 5 per category × 7 categories):**
  - Per category: 2 true/false, 1 multi-select, 1 ordering, 1 spot-error
  - All questions have `type` field: `"mcq"`, `"true_false"`, `"multi_select"`, `"ordering"`, `"spot_error"`

### Sidebar catalog: 8 items
1. What Is an Effect Size
2. Types of Effect Sizes (with 2×2 expandable cards)
3. Weighting (with interactive demo)
4. Fixed vs Random Effects (with toggle forest plot)
5. Forest Plot Anatomy (with click-based interactive plot)
6. Reading Forest Plots (with 3 practice exercises)
7. Common Pitfalls ← NEW (with 6 expandable mistake cards)
8. Dino Key Quest Game

### Game: Dino Key Quest ✅ BUILT & FIXED
- Standalone component in `DinoKeyQuest.jsx`, imported by `Course4.jsx`
- **Narrative:** The dinos need to find the KEY to their new home — explore a crystal cave and collect key fragments
- **Progressive difficulty (unique to Courses 4–5):**
  - **Phase 1 (Foundation):** 3 standard MCQ from the 70-MCQ pool. Must pass ≥2/3 to unlock Phase 2. Gate animation on success.
  - **Phase 2 (Advanced):** 6 mixed-type questions from the 35-advanced pool (2 true/false, 2 multi-select, 1 ordering, 1 spot-error). Shuffled each playthrough.
- **Visual theme:** Crystal cave (dark blue/purple gradient), glowing crystal sparkles, warm glow grows in advanced phase
- **Progress tracker:** 9 key fragments (3 gold circles for foundation handle + 6 blue hexagons for advanced blade). Filled with glow animation on correct.
- **Correct →** fragment lights up with pulse animation
- **Wrong →** shake animation, fragment stays dark
- **Result tiers:** Master (≥8/9), Explorer (≥6), Apprentice (≥4), Novice (<4), Locked (failed foundation)
- **Question type renderers:** Each type has its own UI component:
  - MCQ: standard 4-option buttons with A/B/C/D labels
  - True/False: two large buttons (✓/✗)
  - Multi-select: checkboxes with "Confirm" button, shows correct count hint
  - Ordering: numbered items with ▲▼ arrow buttons, "Confirm Order" button
  - Spot-the-error: numbered statements, click the wrong one (or "All correct" for trick questions)
- **Type badges:** Colored labels above each question showing type (選擇題/是非題/複選題/排序題/找錯題)
- Accent color: BLUE `#2E86C1` (matching Course 4)
- Bilingual UI strings handled internally

### Known Issues (Course 4):
- ~~Game needs visual polish and bug fixes~~ ✅ FIXED: CuteDino prop `species` → `index`, game container widened to 880px, text sizes increased across all renderers, dino display scaled up in gameplay header
- ~~ForestPlotAnatomy was hover-based~~ ✅ FIXED: Converted to click-based pattern matching Course 0's ForestPlotExplainer, proper log-scale axis with positioned ticks, dashed null line
- ~~EffectSizeCards in 4-column layout with small text~~ ✅ FIXED: 2×2 grid, text sizes bumped up, proper font family applied
- ~~Paragraph maxWidth mismatch~~ ✅ FIXED: Paragraph component widened from 640px to 880px to match section containers
- ~~Category 6 "Common Mistakes" questions tested untaught content~~ ✅ FIXED: Added Section 7 "Common Pitfalls" teaching all 6 mistake types before the game

### Note:
- AI workshop section planned but not yet designed — backend proxy is now ready (`api/ai-feedback.js`), so future AI sections just need frontend implementation (Heterogeneity & Publication Bias)

### Accent Color: `#C0392B` (deep red)

### Sections (in order):
1. **What Is Heterogeneity?** — Opening: "You combined 10 studies, but they disagree wildly." Analogy: "averaging the temperature of 5 cities — Arctic + Sahara = meaningless." Introduces between-study variation concept.
2. **Measuring Heterogeneity** — Interactive I² slider (0%→95%) with dynamic visualization: dots spread apart as I² increases. Color-coded labels (green→yellow→orange→red). Also introduces Cochran's Q and prediction intervals conceptually.
3. **Why Does Heterogeneity Happen?** — Four expandable cards: (a) Clinical diversity (populations, doses, durations). (b) Methodological diversity (study designs, RoB levels). (c) Statistical diversity (outcome definitions, time points). (d) Unexplained. Each with pharmacy-relevant examples.
4. **Exploring Heterogeneity** — Subgroup analysis demo: toggle "Overall Pooled" vs "Split by Dose" view. Bar chart shows how high-dose (0.55) and low-dose (0.20) effects are hidden by overall (0.38). Also introduces meta-regression conceptually (bubble plots).
5. **Publication Bias** — Interactive funnel plot: toggle symmetric (good) vs asymmetric (suspicious). SVG with dots, funnel outline, and highlighted "missing zone." Introduces Egger's test and trim-and-fill conceptually.
6. **Reporting Your Meta-Analysis** — PRISMA 2020 checklist highlights: 6 clickable items (register protocol, document search, PRISMA flow, RoB assessment, report ALL results, share data). Wraps the entire 6-course journey with a congratulatory message.

### Interactive Components:
- **HeterogeneitySlider** — I² range slider (0-95%), color-coded levels, dot scatter visualization, contextual explanation
- **HeterogeneitySourceCards** — 4 expandable cards (clinical, methodological, statistical, unexplained) with color-coded examples
- **SubgroupDemo** — Toggle overall vs dose-split view, bar chart with subgroup pooled effects
- **FunnelPlotDemo** — SVG funnel plot, toggle symmetric vs biased, highlighted missing-study zone
- **PrismaHighlights** — 6 clickable checklist items with expand-on-click descriptions

### Question Bank (105 Qs = 70 MCQ + 35 advanced):
- `course5Questions.js` with `course5Categories` export
- **MCQ (70 Qs: 10 × 7 categories):**
  - Cat 0: What heterogeneity is and why it matters
  - Cat 1: I², Q statistic, and prediction intervals
  - Cat 2: Sources of heterogeneity (clinical, methodological, statistical)
  - Cat 3: Subgroup analysis and meta-regression
  - Cat 4: Publication bias concept and funnel plots
  - Cat 5: Egger's test, trim-and-fill, and other detection methods
  - Cat 6: PRISMA reporting and overall interpretation pitfalls
- **Advanced (35 Qs: 5 per category × 7 categories):**
  - Per category: 2 true/false, 1 multi-select, 1 ordering, 1 spot-error
  - All questions have `type` field: `"mcq"`, `"true_false"`, `"multi_select"`, `"ordering"`, `"spot_error"`

### Game: Dino Map Escape ✅ BUILT & FIXED
- Standalone component in `DinoDoorEscape.jsx`, imported by `Course5.jsx`
- **Narrative:** The dinos must find pieces of a treasure map to discover which door leads to their new home
- **Progressive difficulty (same structure as Course 4):**
  - **Phase 1 (Foundation):** 3 standard MCQ. Must pass ≥2/3 to unlock Phase 2.
  - **Phase 2 (Advanced):** 6 mixed-type questions (2 true/false, 2 multi-select, 1 ordering, 1 spot-error).
- **Visual theme:** Dark corridor (purple gradient), torch-like flickering lights, crimson glow in advanced phase
- **Treasure map mechanic:** 3×3 SVG grid map assembles piece by piece as questions are answered:
  - **Found pieces** (correct answer) → tile revealed showing part of the illustrated map
  - **Missed pieces** (wrong answer) → tile stays as dark fog with "?"
  - The full map shows a path from a dino (top-left) winding right then down to Door 3 (bottom-right)
  - Top row: dino start → path right → path turns down
  - Middle row: trees/scenery → rocks → path continues down
  - Bottom row: Door 1 → Door 2 → Door 3 (path ends here, golden glow)
- **Door choice phase:** After all 9 questions, player sees their assembled map + 3 doors to pick from
  - More pieces found = clearer path visible = easier to identify correct door
  - Critical piece: bottom-right tile (piece 9) shows path connecting to Door 3
  - If player missed key tiles, they must guess
- **Result tiers:** Map Master (≥8 + correct door), Navigator (≥6 + correct door), Seeker (correct door), So Close (wrong door but good score), Lost (<4), Locked (failed foundation)
- **Question type renderers:** Same types as Course 4 but with crimson accent color
- **Text selection:** `::selection` CSS override ensures text is readable when highlighted inside dark game background
- Accent color: CRIMSON `#C0392B` (matching Course 5)
- Bilingual UI strings handled internally

### Known Issues (Course 5):
- ~~Game used generic door open/lock mechanic~~ ✅ FIXED: Redesigned as treasure map puzzle — 3×3 SVG grid with path illustration, door choice phase at end
- ~~CuteDino prop `species` not recognized~~ ✅ FIXED: Changed to `index` to match CuteDino component API
- ~~Game container narrower than course sections~~ ✅ FIXED: `maxWidth: 700` → `880` to match other sections
- ~~Dino select grid clipped 7th dino~~ ✅ FIXED: Matched DinoKeyQuest's grid pattern (`repeat(auto-fit, minmax(110px, 1fr))`, `maxWidth: 600`)
- ~~MSRenderer/OrderRenderer kept state across questions~~ ✅ FIXED: Added `key={qi}` to force remount (same fix applied to DinoKeyQuest)
- ~~SERenderer crashed on spot_error questions~~ ✅ FIXED: Was reading `data.opts` but spot_error uses `data.statements`; changed to `(data.statements || data.opts)`
- ~~Selected text invisible in dark game area~~ ✅ FIXED: Added `::selection` CSS to CorridorBackground (same fix applied to DinoKeyQuest's CaveBackground)
- ~~Section label "報告你的分析" was awkward Chinese~~ ✅ FIXED: Changed to "完整報告" in i18n.js + sidebar catalog
- ~~PRISMA checklist in 5-column layout~~ ✅ FIXED: Changed to `repeat(3, 1fr)` for 3×2 grid
- ~~Paragraph maxWidth mismatch~~ ✅ FIXED: Removed `maxWidth: 640` from Paragraph component

### Note:
- AI workshop section planned but not yet designed — backend proxy is now ready (`api/ai-feedback.js`), so future AI sections just need frontend implementation
- Course 5 footer has no "Next Course" button — it shows "🎓 Course Complete!" as this is the final course

---

## MA Workshop: Planning (Midterm — After Course 3) ✅ BUILT

### Concept:
- **Guided hands-on workshop** replacing the old midterm checkpoint. Instead of a quiz, the user plans their own meta-analysis from scratch (or uses demo data).
- Open-ended: user brings their own clinical question. AI provides feedback at key checkpoints.
- **Route:** `#midterm` | **Accent color:** Gold `#8B6914` | **Component:** `Midterm.jsx`
- **Hub integration:** Clickable `CheckpointCard` (🔬 emoji) at the bottom of the Foundations section.

### 5-Step Wizard:
1. **Define PICO** — Free-text clinical question + P/I/C/O form fields. 🤖 **AI check** validates specificity, searchability, feasibility.
2. **Search Strategy** — Database picker (PubMed, Embase, Cochrane, etc.) + Boolean query builder + grey literature sources. 🤖 **AI check** validates syntax, coverage, appropriateness.
3. **Add Studies** — Collapsible study cards. Citation, design, N, P/I/C/O per study. Include/exclude toggle with reason field. Minimum 3 included studies required.
4. **Data Extraction** — Per included study: binary (events/total per arm) or continuous (mean/SD/N per arm). Outcome type toggle.
5. **Risk of Bias** — Interactive traffic light matrix. 5 domains (Randomization, Blinding, Attrition, Selective Reporting, Other) × L/S/H rating. Overall auto-derived from worst domain.

### Phase Gate:
- **Requirements to unlock Phase 2:** PICO must pass AI check (✅ in response) + at least 3 included studies.
- Both conditions shown as checklist. "Go to Analysis Workshop →" button navigates to `#final`.

### Demo Data:
- Hidden "試用範例資料 / Try with example data" link (top-right, subtle) loads 5 SGLT2i/CKD RCTs (CREDENCE, DAPA-CKD, EMPA-KIDNEY, EMPA-REG OUTCOME, CANVAS) with full extraction data and RoB ratings.
- PICO pass flag is NOT pre-set — user must still run AI check.

### State:
- All data stored in single `project` state object, persisted to `sessionStorage` key `ma_project_midterm`.
- Bilingual text is self-contained inside `Midterm.jsx` (not in `i18n.js`), since the workshop is a standalone module.

---

## MA Workshop: Analysis (Final — After Course 5) ✅ BUILT

### Concept:
- **Continuation of Phase 1.** User takes their planned MA from the Midterm and runs the actual analysis using external tools, then interprets results and writes conclusions.
- **Tool-agnostic design:** workshop guides the methodology; computation is delegated to Onlinemeta (web) or R/metafor (code). No in-browser statistics engine.
- **Route:** `#final` | **Accent color:** Crimson `#C0392B` | **Component:** `Final.jsx`
- **Hub integration:** Clickable `CheckpointCard` (📊 emoji) at the bottom of the Advanced section.

### 5-Step Wizard:
1. **Effect Size & Model** — Choose effect size type (OR/RR/RD for binary; MD/SMD for continuous) with per-option explanations. Choose fixed vs random effects model with rationale text area.
2. **Prepare Data** — Auto-formatted table of extracted data from Phase 1. "Copy Table" (TSV to clipboard), "Download CSV" buttons. Data is ready to paste into external tools.
3. **Run Analysis** — Two-tab interface:
   - **🌐 Online Calculator tab:** Step-by-step guide to [Onlinemeta](https://smuonco.shinyapps.io/Onlinemeta/) with direct link. Alternative links to MetaAnalysisOnline.com and Meta-Mar.
   - **📟 R Code tab:** Auto-generated `metafor` R script with the user's actual study data pre-filled. Includes `escalc()`, `rma()`, `forest()`, `funnel()`. Dark-themed code block with copy button. Supports both binary and continuous data.
4. **Interpret & Report** — Opens with a blue guidance box: checklist of what to report (pooled effect, CI, p-value, I², study count) + bilingual example write-up. Then: 4 interpretation text areas (pooled effect meaning, consistency/weight, heterogeneity, funnel plot). Publication bias test selector (Egger's, Trim-and-Fill, Begg's, Fail-safe N). Subgroup/sensitivity analysis plan.
5. **Conclusions** — Main finding, GRADE certainty selector (High/Moderate/Low/Very Low) with rationale, limitations, clinical implications. 🤖 **AI check** evaluates consistency with described results, GRADE reasonableness, reporting completeness (checks if user included necessary statistics).

### Completion:
- Summary card showing: PICO, study count, effect size type/model, user's interpretation, main finding, GRADE, implications.
- No poster PDF generation — users take their plots (from Onlinemeta/R) and content into their own poster template.

### R Code Generator (`buildRCode()`):
- Dynamically writes a complete `metafor` script using the user's citations, data, effect size choice, and model.
- Binary: `escalc(measure="OR", ai=..., n1i=..., ci=..., n2i=...)` → `rma()` → `forest(atransf=exp)` → `funnel()`
- Continuous: `escalc(measure="MD", m1i=..., sd1i=..., n1i=..., m2i=..., sd2i=..., n2i=...)` → `rma()` → `forest()` → `funnel()`
- Includes `cat()` statements for key statistics printout.

### AI Usage (across both phases):
- **3 checkpoints total:** PICO (Midterm Step 1), Search Strategy (Midterm Step 2), Conclusions (Final Step 5)
- Estimated cost: ~$0.01–0.03 per full workshop run (3 API calls)
- All calls use existing `/api/ai-feedback` endpoint with step-specific system prompts

### State:
- Reads Phase 1 data from `sessionStorage` key `ma_project_midterm`.
- Analysis state persisted to `sessionStorage` key `ma_project_final`.
- Supabase persistence is Phase 3 work (not yet wired).

### External Tools Linked:
- [Onlinemeta](https://smuonco.shinyapps.io/Onlinemeta/) — primary recommendation (R-Shiny based, free, no login, published in JMIR 2025)
- [MetaAnalysisOnline.com](https://metaanalysisonline.com/) — alternative
- [Meta-Mar](https://www.meta-mar.com/) — alternative with AI features

---

## Technical Notes

### Adding a New Course:
1. Create `CourseN.jsx` with teaching sections + AI workshop
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
- **Courses using it:** Course 1 AI PICO Workshop + Freestyle PICO, Course 2 AI Boolean Query Checker, Course 3 AI Extraction Reviewer, **MA Workshop: Planning** (PICO check + Search strategy check), **MA Workshop: Analysis** (Conclusions check)
- **Future courses:** Can reuse the same `/api/ai-feedback` endpoint — just send different system prompts from frontend

### Backend Status (Supabase Integration):
- See `BACKEND_UPGRADE_PLAN.md` for full details
- **Supabase project:** `meta-analysis-101` at `https://souaycpzgabrxdwvqpmq.supabase.co`
- **Auth:** Google OAuth configured and working (login/logout tested locally)
- **Database:** `profiles` and `progress` tables created with RLS policies + auto-profile trigger
- **Frontend wiring:** `supabaseClient.js` created, `App.jsx` updated with auth state, user props passed to all courses
- **Unified navbar:** `SiteNav.jsx` — site-wide nav with login/profile UI, replaces per-course inline navs
- **About page:** `AboutPage.jsx` — standalone page at `#about`
- **Profile dashboard:** `ProfilePage.jsx` — progress dashboard at `#profile` (reads from `progress` table; clickable dino cards link to DinoIntro codex; UI built, awaiting Phase 3 data)
- **Next:** Wire progress saving into game components (Phase 3), then data will populate in Profile page
