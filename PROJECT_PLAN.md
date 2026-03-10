# Meta-Analysis 101 — Project Plan & Strategy

## Overview
An interactive bilingual (ZH/EN) educational website teaching meta-analysis from beginner to advanced. Built with React, using a shared i18n system and hash-based routing between courses. Each course ends with a unique mini-game (2-3 min) to reinforce learning.

## Teaching Schedule
- **Precourse:** Course 0 (Introduction to Meta-Analysis)
- **Foundations:** Courses 1–3 (PICO, Search, Data Extraction) → **Midterm** (checkpoint assessment)
- **Advanced Courses:** Courses 4–5 (Analysis & Interpretation) → **Final Exam** (comprehensive knowledge check)
- Games are kept short (2-3 min each) for live classroom use

---

## Course Structure

| Section | Course | Topic | Game | Status |
|---------|--------|-------|------|--------|
| **Precourse** | 0 | What is Meta-Analysis? | Dino Egg Hunt (7 eggs, 7 categories, 35-question bank, cheat sheet rewards) | ✅ Live on `main` |
| **Foundations** | 1 | PICO/PICOS Research Question | Dino Egg Hatch (pick 1 of 7 eggs, 7 Qs from 70-question bank, 5 correct = hatch, 3 wrong = freeze, sun/frost particles) | ✅ Built on `dev` |
| | 2 | Literature Search & PRISMA | Dino Food Rescue (pick 1 of 7 dinos, 7 Qs from 70-question bank, crack ice with pickaxe, second chance on wrong, species-matched food) | ✅ Built on `dev` |
| | 3 | Data Extraction & Risk of Bias | Dino Home Save (pick 1 of 7 dinos, 7 Qs from 70-question bank, 10s timer, correct = fire grows, wrong/timeout = fire dims, 5 correct = win, 3 wrong = lose) | ✅ Built on `dev` |
| | **—** | **Midterm** | **Clickable checkpoint card in hub; assessment page TBD** | ❌ Not started |
| **Advanced** | 4 | Effect Sizes & Forest Plots | TBD (70-question bank ready) | ✅ Teaching built on `dev` (game TBD) |
| | 5 | Heterogeneity & Publication Bias | TBD (70-question bank ready) | ✅ Teaching built on `dev` (game TBD) |
| | **—** | **Final Exam** | **Clickable checkpoint card in hub; 3-stage assessment TBD** | ❌ Not started |

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
├── Course1.jsx          ← Course 1: PICO (teaching sections + AI workshop; game extracted to DinoEggHatch)
├── Course2.jsx          ← Course 2: Literature Search & PRISMA (teaching sections + AI workshop; game extracted to DinoFoodRescue)
├── Course3.jsx          ← Course 3: Data Extraction & RoB (6 teaching sections; game extracted to DinoHomeSave)
├── Course4.jsx          ← Course 4: Effect Sizes & Forest Plots (6 teaching sections + 4 interactive demos; game TBD)
├── Course5.jsx          ← Course 5: Heterogeneity & Publication Bias (6 teaching sections + 4 interactive demos; game TBD)
│
├── DinoEggHunt.jsx      ← Course 0 game: egg hunt quiz (7 eggs, 7 categories, cheat sheet rewards; exports StylishEgg SVG)
├── DinoEggHatch.jsx     ← Course 1 game: dragon egg hatching (exports DragonEgg SVG)
├── DinoFoodRescue.jsx   ← Course 2 game: ice-breaking food rescue
├── DinoHomeSave.jsx     ← Course 3 game: save dino's home from freezing
├── CuteDino.jsx         ← Shared dinosaur SVG component (7 unique species, used across courses)
├── DinoIntro.jsx        ← Dino Codex page (RPG-style character intro; accessible at #dino or #dino=N; linked from ProfilePage dino cards)
│
├── questionHelpers.js   ← Shared helper functions: pickQuestions(), pickBalanced()
├── course0Questions.js  ← Course 0 question bank (35 Qs: 5 per category × 7 categories)
├── course1Questions.js  ← Course 1 question bank (70 Qs: 10 per category × 7 categories)
├── course2Questions.js  ← Course 2 question bank (70 Qs: 10 per category × 7 categories)
├── course3Questions.js  ← Course 3 question bank (70 Qs: 10 per category × 7 categories)
├── course4Questions.js  ← Course 4 question bank (70 Qs: 10 per category × 7 categories)
├── course5Questions.js  ← Course 5 question bank (70 Qs: 10 per category × 7 categories)
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
7. **AI PICO Workshop** — Pick scenario, write free-text PICO, AI gives inline feedback per field + overall assessment

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
- Emoji rendering: some newer Unicode emojis (🫀🦠🧠) don't render on all systems. Use older, safer alternatives.

---

## Course 2 Details (Literature Search & PRISMA)

### Sections:
1. **Why Systematic Search?** — Random vs systematic comparison
2. **Database Overview** — PubMed, Embase, Cochrane, WoS, CINAHL, Grey literature
3. **Boolean Operators** — AND/OR/NOT with interactive Venn diagrams
4. **PRISMA Flow Diagram** — Interactive visualization
5. **Screening Tips** — 4 practical tips
6. **Dino Food Rescue Game** — Pick 1 of 7 dinos → 7 shuffled questions → crack ice cubes with pickaxe to free food
7. **AI Search Strategy Workshop** — ✅ Working via Vercel serverless proxy

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
- Correct → pickaxe swing animation → ice crack lines grow → ice shatters into particles → food pops out → dino bounces happily
- Wrong → pickaxe bounces off → ice shakes → explanation shown → "Swing Again" retry button (second chance)
- Score tracks first-try correct count; all food is always eventually rescued
- Progress bar: 7 ice cube icons, each replaced by ✅ when freed
- Dino reactions: happy bounce (correct), sad shake (wrong), eating animation (food freed)
- Species-matched food: Rex→🍖, Azure→🐟, Zephyr→🦐, Blaze→🌿, Thistle→🌱, Velo→🥚, Dome→🍄
- Results screen: tiered message (master ≥6, good ≥4, learning <4), dino with all freed food displayed
- Bilingual UI strings handled internally (no new i18n keys needed)

### TODO:
- ~~Fix AI workshop (backend proxy issue)~~ ✅ DONE

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
3. **What Numbers to Extract** — Two clickable tracks side by side: (a) Dichotomous outcomes → events + totals per group (e.g., 15/100 vs 22/100), and (b) Continuous outcomes → mean, SD, n per group. Also covers: what to do when studies report medians/IQR (Wan/Luo conversion formulas), and handling zero events (continuity corrections).
4. **Risk of Bias: Why Quality Matters** — Analogy: "checking freshness of ingredients before cooking." Concept that not all included studies are trustworthy. Cooking analogy: one spoiled ingredient ruins the whole pot → sensitivity analysis.
5. **RoB Tools** — Two interactive cards: (a) Cochrane RoB 2 for RCTs — the 5 domains (randomization, deviations from intended intervention, missing outcome data, outcome measurement, selective reporting) shown as traffic-light levels (low/some concerns/high risk). (b) Newcastle-Ottawa Scale for observational studies — the 3 categories (selection, comparability, outcome) with star ratings. Click each card to expand details.
6. **Putting It Together** — Interactive traffic-light matrix for 5 example studies, with a "sensitivity analysis" toggle button that excludes the high-risk study and shows the pooled estimate change. Reinforces: two independent extractors, resolve disagreements, document everything.
7. **Dino Home Save Game** — Pick 1 of 7 dinos → 7 questions → 10s timer → keep the fireplace burning

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
- **RoBToolCards** — Two expandable cards: RoB 2 (5 domains, traffic-light levels) and NOS (3 categories, star system)
- **TrafficLightDemo** — 5-study matrix with colored dots, sensitivity analysis toggle button that excludes high-risk study and updates pooled effect live

---

## Course 4 Details (Effect Sizes & Forest Plots)

### Accent Color: `#2E86C1` (deep blue)

### Sections (in order):
1. **What Is an Effect Size?** — Opening: "A study says the drug 'works' — but how much?" Introduces effect size as the single number encoding magnitude. Analogy: "the Yelp rating for a study — not just thumbs up/down, but a score."
2. **Types of Effect Sizes** — Four interactive expandable cards: (a) Odds Ratio (OR) — binary outcomes, with formula and pharmacy example. (b) Risk Ratio (RR) — same 2×2 table, different calculation. (c) Mean Difference (MD) — continuous outcomes, same scale. (d) SMD/Cohen's d — different scales. Each shows formula visually + null value.
3. **Weighting: Not All Studies Are Equal** — Interactive demo: toggle between inverse-variance weighted average and simple average. Visualizes n=30 vs n=3000 study weights. Square sizes change dynamically. Analogy: "trusting a poll of 10,000 more than a poll of 10."
4. **Fixed vs Random Effects** — Side-by-side toggle. 5-study mini forest plot recalculates under each model. Watch CI widen under random effects. Shows how small study weights shift. Explanation box updates with model description.
5. **Anatomy of a Forest Plot** — Interactive hover-based visualization. Build a 5-study forest plot piece by piece: study labels, squares (point estimates), CI lines, square sizes (weight), null line (OR=1), pooled diamond. Hover each element for explanations.
6. **Reading a Forest Plot** — Three practice exercises with guided questions: "Does the pooled effect cross the null?" "Which study has the most weight?" "Is the overall result significant?" Answer options with immediate feedback and explanations.

### Interactive Components:
- **EffectSizeCards** — 4 expandable cards (OR, RR, MD, SMD) with formulas, descriptions, pharmacy examples, null values
- **WeightingDemo** — Toggle weighted vs simple average, dynamic square sizes, pooled diamond position shifts
- **FixedRandomToggle** — 5-study forest plot that recalculates under fixed/random models, CI width changes visible
- **ForestPlotAnatomy** — Hover-based forest plot with 6 named parts, tooltip panel
- **ForestPlotExercise** — 3 progressive practice questions with answer feedback

### Question Bank (70 Qs = 10 × 7 categories):
- `course4Questions.js` with `course4Categories` export
  - Cat 0: What effect sizes are and why they matter
  - Cat 1: Odds Ratio and Risk Ratio (calculation, interpretation)
  - Cat 2: Mean Difference and SMD (when to use, interpretation)
  - Cat 3: Weighting and inverse-variance method
  - Cat 4: Fixed-effect vs. random-effects models
  - Cat 5: Forest plot anatomy and reading
  - Cat 6: Common mistakes (e.g., confusing OR with RR, misreading CIs)

### Game: TBD
- 70-question bank is ready; game component not yet created
- Placeholder shown in Course4.jsx

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

### Question Bank (70 Qs = 10 × 7 categories):
- `course5Questions.js` with `course5Categories` export
  - Cat 0: What heterogeneity is and why it matters
  - Cat 1: I², Q statistic, and prediction intervals
  - Cat 2: Sources of heterogeneity (clinical, methodological, statistical)
  - Cat 3: Subgroup analysis and meta-regression
  - Cat 4: Publication bias concept and funnel plots
  - Cat 5: Egger's test, trim-and-fill, and other detection methods
  - Cat 6: PRISMA reporting and overall interpretation pitfalls

### Game: TBD
- 70-question bank is ready; game component not yet created
- Placeholder shown in Course5.jsx

### Note:
- AI workshop section planned but not yet designed — backend proxy is now ready (`api/ai-feedback.js`), so future AI sections just need frontend implementation
- Course 5 footer has no "Next Course" button — it shows "🎓 Course Complete!" as this is the final course

---

## Midterm (After Course 3)

### Concept:
- **Gate between Foundations and Advanced sections.** After completing Courses 1–3 (and their dino games), the user must have at least 3 dinos alive/healthy to unlock Course 4.
- The "dinos alive" count is a cumulative tracker across the Course 1–3 games. Each game can result in a dino surviving or not (depending on game outcome: hatch success, food rescued, home saved, etc.).
- This acts as a **midterm check** — ensuring the user has engaged with and understood the foundational material (PICO, search, PRISMA, data extraction, RoB) before moving to the quantitative/analysis courses.
- **Hub integration:** Midterm appears as a clickable `CheckpointCard` (dashed border, tinted background) at the bottom of the Foundations section in the hub. Navigates to `#midterm`. Page not yet built.

### Design (TBD — not yet built):
- **Trigger:** After Course 3 game ends, or when user tries to navigate to Course 4
- **Pass (≥3 dinos alive):** Celebratory screen showing surviving dinos, then unlocks Course 4
- **Fail (<3 dinos alive):** Encouraging screen explaining they need more dinos. Options to replay Course 1–3 games to improve results. Not punitive — framed as "your dinos need more help!"
- **Tracking:** Needs state management to track dino survival across courses (could use Supabase `progress` table if logged in, or local state for anonymous users)
- **Open questions:**
  - Exact definition of "dino alive" per game (e.g., Course 1: egg hatched = alive; Course 3: home saved = alive)
  - Whether Course 0's egg hunt counts toward dino count (it doesn't hatch/save a specific dino)
  - UI/UX for the checkpoint screen itself
  - Whether to allow bypass for classroom/demo mode

---

## Final Exam (After Course 5)

### Concept:
- **Three-stage capstone assessment** after completing all courses. Not a simple multiple-choice quiz — each stage tests a different skill level (apply → critique → create), mirroring Bloom's taxonomy.
- Designed to feel like a real culmination, not a rehash of the mini-games.
- All three stages must be passed to earn completion. Stages unlock sequentially.
- **Hub integration:** Final Exam appears as a clickable `CheckpointCard` (dashed border, tinted background) at the bottom of the Advanced section in the hub. Navigates to `#final`. Page not yet built.

### Stage 1: Scenario Walk-Through (Apply)
- **Format:** A complete meta-analysis scenario presented as a narrative case. The user makes decisions at each step of the workflow, walking through the full process they learned across Courses 0–5.
- **Flow:** The user is given a clinical question (e.g., "Does Drug X reduce hospitalizations in heart failure patients?") and must:
  1. **Formulate PICO** — Pick the best P, I, C, O from options (Course 1)
  2. **Design search strategy** — Choose databases, Boolean operators, identify grey literature needs (Course 2)
  3. **Screen & extract** — Given 3 study abstracts, decide include/exclude; then extract the right numbers from a mock results table (Courses 2–3)
  4. **Assess quality** — Rate RoB for a mock study using traffic-light levels (Course 3)
  5. **Choose effect size & model** — Pick OR vs RR vs MD, fixed vs random, justify why (Course 4)
  6. **Interpret forest plot** — Read a provided forest plot: identify pooled effect, significance, heaviest study, heterogeneity level (Course 4)
  7. **Evaluate heterogeneity & bias** — Given I² and a funnel plot, assess trustworthiness and suggest next steps (Course 5)
- **Mechanics:** ~10 decision points. Each is a branching choice (not free-text). Correct = advance. Wrong = explanation + one retry. Must get ≥7/10 to pass.
- **Presentation:** Could be styled as a "research mission" narrative — the user is a pharmacist tasked with preparing an evidence summary for their hospital's P&T committee.

### Stage 2: Critical Appraisal (Critique)
- **Format:** The user is shown 3–4 flawed visualizations or reports and must identify the errors. Tests deeper understanding — not just "can you follow steps" but "can you spot what's wrong."
- **Examples of flawed materials:**
  - A **forest plot with errors** — e.g., diamond crosses null but text claims "significant"; square sizes don't match reported weights; OR labeled as RR; CI missing for one study
  - A **funnel plot that's clearly asymmetric** but the report says "no evidence of publication bias" — user must identify the contradiction
  - A **PRISMA flow diagram with missing/inconsistent numbers** — e.g., numbers don't add up between stages, exclusion reasons missing, duplicates not accounted for
  - A **results paragraph with common misinterpretations** — e.g., "OR = 2.5 means risk increased 2.5 times," or "I² = 80% so we used fixed-effect model," or "p = 0.06 means the drug doesn't work"
- **Mechanics:** Each item presents the flawed material + 3–4 clickable "error zones" or statement-based options. User must find all errors. Partial credit possible (e.g., find 2/3 errors = partial pass). Must pass ≥3/4 items.
- **Presentation:** Styled as "peer review" — "You're reviewing a colleague's draft. Find the problems before it gets submitted."

### Stage 3: AI-Powered Mini Plan (Create)
- **Format:** Free-text creative task. The user writes a brief meta-analysis plan for a given clinical scenario, and AI provides structured feedback.
- **Flow:**
  1. User is given a clinical scenario (randomly selected from 3–5 pre-written scenarios, e.g., "Your hospital wants to know if SGLT2 inhibitors reduce CKD progression")
  2. User writes: (a) PICO statement, (b) 2–3 key databases they'd search, (c) what effect size type they'd use and why, (d) how they'd handle heterogeneity, (e) one potential source of bias and how they'd check for it
  3. AI evaluates each component with inline feedback (similar to Course 1–2 AI workshops but more comprehensive)
  4. AI gives an overall assessment: strengths, areas to improve, and a pass/needs-revision verdict
- **Mechanics:** This is the "creation" level — no multiple choice, the user must synthesize everything. AI feedback is formative (helpful, not punitive). If "needs revision," user can revise and resubmit once.
- **Requirement:** Same backend proxy as Course 1–2 AI workshops (Anthropic API via serverless function). This stage won't work until the backend is built.

### Passing & Rewards:
- Must pass all 3 stages to earn completion
- **Reward:** Final celebration screen with all surviving dinos from the journey, completion certificate (downloadable?), summary of the user's meta-analysis learning path
- **If not passed:** Specific feedback on which stage(s) need work, with links back to the relevant course sections for review. Can retry each stage independently.

### Open Questions:
- Exact scenario content for each stage (how many scenarios to write, how much variety)
- Visual design of the 3-stage progression UI (linear steps? map? unlock animation?)
- Whether Stage 3 should be optional (since it depends on backend AI) or required
- Certificate design and whether it includes the user's name (requires login)
- Whether to track stage results in Supabase for analytics
- Time limits per stage? (probably not — let users think carefully)
- Whether the final is replayable or one-shot with retries

---

## Technical Notes

### Adding a New Course:
1. Create `CourseN.jsx` with teaching sections + AI workshop
2. Add sticky sidebar catalog with `catalogItems` array, `activeSection` state, and IntersectionObserver (copy pattern from any existing course)
3. Create game as standalone component (e.g., `DinoGameN.jsx`) — import by CourseN
4. Create `courseNQuestions.js` with 70 bilingual questions (10 per category × 7 categories); import `pickBalanced` from `questionHelpers.js`
5. Add translations to `i18n.js` with `cN` prefix (UI strings only — game questions stay in courseNQuestions.js)
6. Add route in `App.jsx` switch statement
7. Add course card in `App.jsx` — to `precourse`, `section1Courses`, or `section2Courses` as appropriate
8. Update hub status from "coming" to "available"
9. Update previous course's footer "Next Course" button from disabled/Coming Soon to active link

### Question Bank Architecture (split per course):
- Each course has its own question file: `course0Questions.js`, `course1Questions.js`, etc.
- Shared helpers in `questionHelpers.js`: `pickQuestions()`, `pickBalanced()`
- Each question: `{ id, category, zh: { q, opts, exp }, en: { q, opts, exp }, correct }`
- `id` format: `"cN-XXX"` (e.g., `"c0-WW01"`, `"c1-042"`, `"c2-015"`)
- `category` (0–6) maps to 7 thematic groups per course
- Helper functions in `questionHelpers.js`:
  - `pickQuestions(pool, n)` — pure random pick
  - `pickBalanced(pool, n, numCategories)` — even coverage across categories, then shuffle
- Game components localize at runtime: `q[lang].q`, `q[lang].opts`, `q.correct`, `q[lang].exp`
- Currently: 385 questions total (35 Course 0 + 70 Course 1 + 70 Course 2 + 70 Course 3 + 70 Course 4 + 70 Course 5)

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
- **Courses using it:** Course 1 AI PICO Workshop, Course 2 AI Search Strategy Workshop
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
