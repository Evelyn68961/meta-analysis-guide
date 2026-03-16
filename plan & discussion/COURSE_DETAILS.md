# Meta-Analysis 101 — Course Details

> **Purpose:** Detailed reference for every course, game, interactive component, and workshop. Read this when working on a specific course.
>
> **Related docs:**
> - `PROJECT_PLAN.md` — High-level project overview, file structure, design system, technical notes
> - `BACKEND_UPGRADE_PLAN.md` — Schema, auth, Supabase, progress tracking
> - `WIRING_GUIDE.md` — Step-by-step Phase 3 backend wiring instructions

---

## Course 0 — What is Meta-Analysis?

**Accent color:** TEAL `#0E7C86` | **File:** `Course0.jsx` (572 lines) | **Game:** `DinoEggHunt.jsx` (459 lines)

### Sidebar Catalog (6 items)
1. What Is Meta-Analysis (`#what`)
2. Why It Matters (`#why`)
3. Study Combiner Demo (`#combiner`)
4. 8-Step Method (`#how`)
5. Forest Plot (`#tools`)
6. Egg Hunt Game (`#quiz`)

### Sections
1. **What Is Meta-Analysis?** — Definition, "combining evidence" concept. 3 concept cards (🧮 combine, ⚖️ weigh, 🔍 detect) + analogy callout box.
2. **Why It Matters** — 6 reason cards with hover effects (🔋 statistical power, 🤝 resolve conflicts, 🔎 detect small effects, 🏛️ inform guidelines, 🕵️ identify bias, 🗺️ map knowledge gaps).
3. **Study Combiner Demo** — **StudyCombiner** interactive: 5 studies with effect sizes and sample sizes. Click "Combine" → studies animate from scattered to forest-plot alignment → weighted pooled effect calculated.
4. **8-Step Method** — **MethodStep** expandable accordion: 8 steps of the systematic review process, each with analogy and 4 detail points. Click to expand/collapse.
5. **Forest Plot** — **ForestPlotExplainer** interactive: 6-study click-based forest plot with 4 clickable elements (squares, CI lines, null line, pooled diamond). Click each for explanation panel. + **Glossary** with 6 key terms (effect size, CI, I², funnel plot, fixed/random, PRISMA).
6. **Dino Egg Hunt Game** — Find hidden eggs by answering meta-analysis basics.

### Interactive Components
- **StudyCombiner** — 5-study scatter→combine animation with weighted pooled effect
- **MethodStep** — Expandable accordion for 8-step method (with analogies)
- **ForestPlotExplainer** — 6-study click-based forest plot with explanation panel + 6-term glossary

### Game: Dino Egg Hunt

- **File:** `DinoEggHunt.jsx` — exports `StylishEgg` (SVG) + `EGG_COLORS` + `EGG_CATEGORIES` as named exports
- **Mechanic:** 7 questions, one per category. Each correct answer "collects" that category's egg. No fail state — player always answers all 7.
- **Question bank:** 35 Qs in `course0Questions.js` (5 per category × 7 categories)
- **Categories (from `course0Categories`):**
  - 0: what-why (🟢 `#2ECC71`)
  - 1: data (🔵 `#3498DB`)
  - 2: forest (🟡 `#F1C40F`)
  - 3: heterogeneity (🔴 `#E74C3C`)
  - 4: search (🟣 `#9B59B6`)
  - 5: bias (🟠 `#E67E22`)
  - 6: interpretation (⚪ `#95A5A6`)
- **Scoring:** `score` = correct answers out of 7
- **Tiers:** 🏆 Master (7/7), 🥈 Explorer (≥5), 🥉 Apprentice (≥3), 🔍 Keep Trying (<3)
- **Cheat sheet rewards:** Each correct answer unlocks that category's downloadable cheat sheet PNG. Score ≥5 (`unlockAll`) unlocks all 7 cheat sheets even for categories answered wrong. Score 7/7 additionally shows a "download all" button.
- **Phases:** `welcome` → `playing` → `results`
- **Props received:** `t, lang`
- **DB save (Phase 3):** One `collected` row per correct answer, `dino_index` = question category

---

## Course 1 — PICO/PICOS Research Question

**Accent color:** CORAL `#E8734A` | **File:** `Course1.jsx` (1114 lines) | **Game:** `DinoEggHatch.jsx` (366 lines)

### Sidebar Catalog (8 items)
1. Why PICO? (`#s1`)
2. PICO Elements (`#s2`)
3. PICOS Extension (`#s3`)
4. Common Mistakes (`#s4`)
5. PICO Builder (`#s5`)
6. Dino Egg Hatch (`#game`)
7. AI Workshop (`#ai-workshop`)
8. My Own PICO (`#ai-freestyle`)

### Sections
1. **Why PICO?** — Bad vs good question comparison
2. **PICO Elements** — 4 interactive cards (P, I, C, O) in 2×2 grid
3. **PICOS Extension** — The S (Study design) element
4. **Common Mistakes** — 5 PICO traps (bad/good comparison cards)
5. **Interactive PICO Builder** — Multiple-choice: pick best P, I, C, O for 3 scenarios (Cardiology/Infectious Disease/Psychiatry)
6. **Dino Egg Hatch Game** — Pick 1 of 7 eggs → hatch or freeze
7. **AI PICO Workshop** — Pick from 3 preset scenarios, write free-text PICO, AI gives inline feedback per field + overall assessment
8. **AI Freestyle PICO** — User writes their own research topic, optional AI topic check, then writes PICO for their topic with per-field AI feedback + overall assessment

### Game: Dino Egg Hatch

- **File:** `DinoEggHatch.jsx` — exports `DragonEgg` (SVG with idle/crack/frozen states) as named export
- **Mechanic:** Pick 1 of 7 eggs → 7 questions from 70-question bank (balanced across categories) → 5 correct = hatch with sun particles ☀️, 3 wrong = freeze with snowflake particles ❄️. Early exit when either threshold hit.
- **Question bank:** 70 Qs in `course1Questions.js` (10 per category × 7 categories)
- **Categories (from `course1Categories`):**
  - 0: Identifying PICO Format
  - 1: Population (P)
  - 2: Intervention (I)
  - 3: Comparison (C)
  - 4: Outcome (O)
  - 5: PICOS & Study Design (S)
  - 6: Common Mistakes & Pitfalls
- **Selection helper:** `pickBalanced()` — even coverage across categories
- **Scoring:** `correctCount` (0–5 for win, 0–4 for loss), `max_score` = 5
- **Progress display:** 5 sun circles ○○○○○ | 3 ice circles ○○○
- **Phases:** `welcome` → `pick` → `playing` → `results`
- **Key state:** `chosenEgg` (0–6), `correctCount`, `wrongCount`
- **Props received:** `t, lang, onNext` (onNext scrolls to AI workshop)
- **DB save (Phase 3):** `result` = `hatched` (≥5 correct) or `frozen` (≥3 wrong), `dino_index` = `chosenEgg`

### Known Issues (all resolved)
- ~~AI Workshop doesn't work~~ ✅ FIXED via `api/ai-feedback.js` serverless proxy
- ~~Game "Continue" button broken~~ ✅ FIXED: Added `onNext` prop, wired to scroll to `#ai-workshop`

---

## Course 2 — Literature Search & PRISMA

**Accent color:** PURPLE `#7B68C8` | **File:** `Course2.jsx` (1335 lines) | **Game:** `DinoFoodRescue.jsx` (628 lines)

### Sidebar Catalog (10 items)
1. Why Systematic Search (`#s1`)
2. Database Overview (`#s2`)
3. Boolean Operators (`#s3`)
4. MeSH & Controlled Vocab (`#s3b`)
5. PRISMA Flow (`#s4`)
6. Screening Tips & Drill (`#s5`)
7. Grey Literature (`#s6`)
8. Strategy Pitfalls (`#s7`)
9. Dino Food Rescue (`#game`)
10. AI Workshops (`#ai-workshop`)

### Sections
1. **Why Systematic Search?** — Random vs systematic comparison cards + **SpotTheSearch** interactive quiz (4 scenarios, classify as systematic vs casual, instant feedback)
2. **Database Overview** — PubMed, Embase, Cochrane, WoS, CINAHL, Grey literature (6 hover-cards)
3. **Boolean Operators** — AND/OR/NOT with **BooleanVisualizer** (interactive Venn diagrams) + **BooleanComboBuilder** (3 switchable clinical scenarios: HF/SGLT2i, Asthma/ICS, CKD/GLP-1 RA — auto-generates color-coded Boolean syntax)
4. **MeSH & Controlled Vocabulary** — **MeSHTreeExplorer** (expandable Heart Failure hierarchy) + 4 clickable concept cards (MeSH vs free text, explosion, subheadings, truncation)
5. **PRISMA Flow Diagram** — Interactive animated visualization with step-through + exclusion branches
6. **Screening Tips & Drill** — **ScreeningTipCards** (4 practical tips) + **ScreeningDrill** (4 mock abstracts, learner decides include/exclude against a given PICO, instant feedback with explanations)
7. **Grey Literature** — Teaching section on publication bias + **GreyLitHunt** (8-source checkbox quiz: identify grey literature sources)
8. **Search Strategy Pitfalls** — 4 bad/good trap cards (language restrictions, outcome terms in search, MeSH-only vs combined, skipping citation tracking)
9. **Dino Food Rescue Game** — Pick 1 of 7 dinos → crack ice to rescue food
10. **AI Boolean Query Checker** — **AIBooleanChecker**: learner pastes PubMed search syntax, AI critiques Boolean logic, missing synonyms, scope issues, suggests improvements. Uses `/api/ai-feedback` proxy.

### Interactive Components (in Course2.jsx)
- **SpotTheSearch** — 4-scenario quiz: classify systematic vs casual
- **BooleanVisualizer** — Interactive Venn diagrams for AND/OR/NOT
- **BooleanComboBuilder** — 3 clinical scenario tabs with auto-generated Boolean syntax
- **MeSHTreeExplorer** — Expandable tree: Heart Failure → HFrEF/HFpEF/Cardiomyopathies + 4 concept cards
- **ScreeningTipCards** — 4 practical screening tip cards
- **ScreeningDrill** — 4 mock abstracts with include/exclude decisions
- **GreyLitHunt** — 8-source checkbox quiz
- **AIBooleanChecker** — AI-powered search syntax reviewer

### Game: Dino Food Rescue

- **File:** `DinoFoodRescue.jsx`
- **Mechanic:** Pick 1 of 7 dinos → each has species-matched food trapped in ice cubes. Correct = pickaxe swing animation (400ms delay) → ice cracks → shatters → food freed → dino bounces. Wrong = pickaxe bounces off → ice shakes → explanation → "Next". 5 correct = win, 3 wrong = lose. Early exit.
- **Question bank:** 70 Qs in `course2Questions.js` (10 per category × 7 categories)
- **Categories (from `course2Categories`):**
  - 0: Systematic vs Casual Search
  - 1: Databases
  - 2: Boolean Operators & Search Syntax
  - 3: PRISMA Flow Diagram
  - 4: Screening Process
  - 5: Grey Literature & Search Completeness
  - 6: Search Strategy Pitfalls & Best Practices
- **Species-matched food:** Rex→🍖, Azure→🐟, Zephyr→🦐, Blaze→🌿, Thistle→🌱, Velo→🥚, Dome→🍄
- **Progress display:** `🐟 3/5` correct + `❌ 1/3` wrong
- **Phases:** `welcome` → `playing` → `results`
- **Key state:** `chosenDino` (0–6), `freedCount`, `wrongCount`
- **Props received:** `t, lang`
- **DB save (Phase 3):** `result` = `rescued` (≥5 freed) or `lost` (≥3 wrong), `dino_index` = `chosenDino`

### Known Issues (all resolved)
- ~~Venn diagram text too small~~ ✅ FIXED: 9–10px → 12–13px, diagram 120 → 180
- ~~Monospace font~~ ✅ FIXED: replaced with project fonts
- ~~Pickaxe positioned wrong~~ ✅ FIXED: moved to right, transformOrigin `75% 75%`
- ~~Food thought bubble on dino's head~~ ✅ FIXED: absolute positioning top-right
- ~~No delay between swing and crack~~ ✅ FIXED: 400ms delay
- ~~Retry mechanic removed~~ ✅ Replaced with 5-correct/3-wrong system

---

## Course 3 — Data Extraction & Risk of Bias

**Accent color:** GOLD `#D4A843` | **File:** `Course3.jsx` (935 lines) | **Game:** `DinoHomeSave.jsx` (650 lines)

### Sidebar Catalog (8 items)
1. Why It Matters (`#s1`)
2. Extraction Table (`#s2`)
3. What Numbers (`#s3`)
4. Risk of Bias (`#s4`)
5. RoB Tools (`#s5`)
6. Putting It Together (`#s6`)
7. Dual Extraction (`#s7`)
8. Dino Home Save (`#game`)

### Sections
1. **Why Data Extraction Matters** — "Reading the nutrition label, not just the food packaging." Bad example (grabbing only p-values) vs good example (structured extraction).
2. **The Extraction Table** — **ExtractionTableDemo**: 8 clickable columns (Author/Year, Study Design, Population, Intervention, Comparator, Outcome, Results, Notes). Click each for description + example data.
3. **What Numbers to Extract** — **OutcomeTracksDemo**: two clickable tracks (Dichotomous: events + totals; Continuous: mean, SD, n). Covers Wan/Luo conversion. + **ExtractionDrill**: 2 mock studies (DAPA-HF dichotomous, Metformin continuous), pick correct numbers from 4 options each.
4. **Risk of Bias: Why Quality Matters** — "Checking freshness of ingredients before cooking." Not all included studies are trustworthy.
5. **RoB Tools** — **RoBToolCards**: two interactive cards (Cochrane RoB 2 with 5 domains, NOS with 3 categories). + **RateThisStudy**: mock Metformin RCT, assign Low/Some Concerns/High to 5 RoB 2 domains with per-domain feedback.
6. **Putting It Together** — **TrafficLightDemo**: 5-study traffic-light matrix with colored dots + sensitivity analysis toggle that excludes high-risk study and shows pooled estimate change.
7. **Dual Extraction & Disagreement Resolution** — 4-step workflow cards (independent extraction → compare with Cohen's kappa → resolve disagreements → pilot calibrate) + Covidence/Rayyan tool tips.
8. **Dino Home Save Game** — Keep the fireplace burning during a blizzard

### Interactive Components (in Course3.jsx)
- **ExtractionTableDemo** — 8 clickable column cards with detail panel
- **OutcomeTracksDemo** — Dichotomous vs Continuous toggle cards
- **ExtractionDrill** — 2 mock study scenarios with extraction practice
- **RateThisStudy** — Mock RCT, assign RoB 2 ratings with feedback
- **RoBToolCards** — Two expandable cards: RoB 2 (5 domains) and NOS (3 categories)
- **TrafficLightDemo** — 5-study matrix with sensitivity analysis toggle

### Game: Dino Home Save

- **File:** `DinoHomeSave.jsx`
- **Mechanic:** Pick 1 of 7 dinos → 7 questions with **10-second timer** per question. Correct = fire grows larger, dino warms up. Wrong/Timeout = fire dims, dino shivers, more snow. 5 correct = home saved (roaring fire). 3 wrong/timeout = home frozen (fire out, ice overlay). No second chances. Early exit.
- **Question bank:** 70 Qs in `course3Questions.js` (10 per category × 7 categories)
- **Categories (from `course3Categories`):**
  - 0: Purpose & Principles of Data Extraction
  - 1: Dichotomous Outcome Extraction
  - 2: Continuous Outcomes & Conversions
  - 3: Cochrane RoB 2 Domains
  - 4: Newcastle-Ottawa Scale
  - 5: Dual Extraction & Disagreement Resolution
  - 6: Sensitivity Analysis & Problematic Studies
- **Visual effects:** SVG animated fireplace (5 intensity levels), falling snow particles (intensity ∝ fire weakness), background color warm gold → cold blue
- **Progress display:** 🔥🔥🔥🔥🔥 (5 fire circles) | ❄❄❄ (3 ice circles)
- **Phases:** `welcome` → `playing` → `results`
- **Key state:** `chosenDino` (0–6), `correctCount`, `wrongCount`, timer state
- **Props received:** `t, lang`
- **DB save (Phase 3):** `result` = `saved` (≥5 correct) or `lost` (≥3 wrong), `dino_index` = `chosenDino`

---

## Course 4 — Effect Sizes & Forest Plots

**Accent color:** BLUE `#2E86C1` | **File:** `Course4.jsx` (866 lines) | **Game:** `DinoKeyQuest.jsx` (473 lines)

### Sidebar Catalog (8 items)
1. What Is an Effect Size (`#s1`)
2. Types of Effect Sizes (`#s2`)
3. Weighting (`#s3`)
4. Fixed vs Random (`#s4`)
5. Forest Plot Anatomy (`#s5`)
6. Reading Forest Plots (`#s6`)
7. Common Pitfalls (`#s7`)
8. Dino Key Quest (`#game`)

### Sections
1. **What Is an Effect Size?** — "A study says the drug 'works' — but how much?" Effect size as the single number encoding magnitude. Analogy: "the Yelp rating for a study."
2. **Types of Effect Sizes** — **EffectSizeCards**: 4 interactive expandable cards in 2×2 grid: (a) Odds Ratio (OR) — binary outcomes, formula, pharmacy example. (b) Risk Ratio (RR) — same 2×2 table, different calculation. (c) Mean Difference (MD) — continuous, same scale. (d) SMD/Cohen's d — different scales. Each shows formula visually + null value.
3. **Weighting: Not All Studies Are Equal** — **WeightingDemo**: toggle between inverse-variance weighted average and simple average. Visualizes n=30 vs n=3000 study weights. Square sizes change dynamically. Analogy: "trusting a poll of 10,000 more than a poll of 10."
4. **Fixed vs Random Effects** — **FixedRandomToggle**: side-by-side toggle. 5-study mini forest plot recalculates under each model. Watch CI widen under random effects. Shows how small study weights shift.
5. **Anatomy of a Forest Plot** — **ForestPlotAnatomy**: click-based interactive forest plot (5 studies, log-scale OR axis). 4 clickable elements: point estimate squares (weighted by size), confidence interval lines, dashed null line (OR=1), pooled diamond. Click each to highlight and see explanation in panel above plot.
6. **Reading a Forest Plot** — **ForestPlotExercise**: 3 practice scenarios (Antibiotic UTI prevention, Statin comparison, Pain medication). Each presents forest plot data and a guided question ("Does the pooled effect cross the null?", "Which study has the most weight?", "Is the overall result significant?"). 2 answer options with immediate feedback, explanations, and progress dots.
7. **Common Pitfalls** — **CommonPitfalls**: 6 expandable cards in 2×2 grid covering common interpretation mistakes: (a) Significant ≠ Meaningful (p < 0.05 ≠ clinical importance). (b) OR ≠ RR (can't interchange). (c) Don't Ignore CI Width. (d) SD ≠ SE (mixing them up). (e) Non-Significant ≠ No Effect (absence of evidence). (f) Don't Mix Effect Size Types. Each card has bilingual description + pharmacy example.

### Interactive Components (in Course4.jsx)
- **EffectSizeCards** — 4 expandable cards in 2×2 grid (OR, RR, MD, SMD) with formulas, examples, null values
- **WeightingDemo** — Toggle weighted vs simple average, dynamic square sizes, pooled diamond shift
- **FixedRandomToggle** — 5-study forest plot recalculating under fixed/random models, CI width changes
- **ForestPlotAnatomy** — 5-study click-based forest plot with 4 clickable elements (squares, CI lines, null line, diamond), explanation panel, log-scale OR axis
- **ForestPlotExercise** — 3 practice scenarios (UTI, Statin, Pain) with 2-option Q&A and feedback
- **CommonPitfalls** — 6 expandable cards in 2×2 grid with red accent

### Game: Dino Key Quest

- **File:** `DinoKeyQuest.jsx`
- **Narrative:** Dinos need crystal keys to unlock the door to their new home. Key fragments hidden in crystal cave.
- **Progressive difficulty:**
  - **Phase 1 (Foundation):** 3 standard MCQ from the 70-MCQ pool. Must pass ≥2/3 to unlock Phase 2. Gate animation on success.
  - **Phase 2 (Advanced):** 6 mixed-type questions from the 35-advanced pool (2 true/false, 2 multi-select, 1 ordering, 1 spot-error). Shuffled each playthrough.
- **Visual theme:** Crystal cave background (dark blue/purple gradient), glowing crystal sparkles, warm glow in advanced phase
- **Progress tracker:** 9 key fragments (3 gold circles for foundation handle + 6 blue hexagons for advanced blade). Filled with glow animation on correct.
- **Question type renderers:** Each type has its own UI component:
  - MCQ: standard 4-option buttons with A/B/C/D labels
  - True/False: two large buttons (✓/✗)
  - Multi-select: checkboxes with "Confirm" button, shows correct count hint
  - Ordering: numbered items with ▲▼ arrow buttons, "Confirm Order" button
  - Spot-the-error: numbered statements, click the wrong one (or "All correct" for trick questions)
- **Type badges:** Colored labels above each question showing type (選擇題/是非題/複選題/排序題/找錯題)
- **Question bank:** 105 Qs in `course4Questions.js`: 70 MCQ (10 × 7 categories) + 35 advanced (per category: 2 true/false, 1 multi-select, 1 ordering, 1 spot-error)
- **Categories (from `course4Categories`):**
  - 0: What Effect Sizes Are
  - 1: Odds Ratio & Risk Ratio
  - 2: Mean Difference & SMD
  - 3: Weighting & Inverse-Variance
  - 4: Fixed vs Random Effects
  - 5: Forest Plot Anatomy & Reading
  - 6: Common Mistakes
- **Result tiers:** Key Master (≥8/9), Explorer (≥6), Apprentice (≥4), Novice (<4), Locked (failed foundation <2/3)
- **Phases:** `select` → `foundation` → `gate` → `advanced` → `result`
- **Key state:** `selectedDino` (0–6), `score` (0–9), `foundScore` (0–3)
- **Props received:** `lang`
- **DB save (Phase 3):** `result` = `unlocked` (foundation ≥2 AND score ≥6) or `locked`, `dino_index` = `selectedDino`
- **`::selection` CSS** override for text readability in dark cave background

### Known Issues (all resolved)
- ~~CuteDino prop `species` not recognized~~ ✅ FIXED: Changed to `index`
- ~~Game container narrower than course sections~~ ✅ FIXED: `maxWidth: 700` → `880`
- ~~EffectSizeCards in 4-column layout with small text~~ ✅ FIXED: 2×2 grid, text sizes bumped
- ~~Paragraph maxWidth mismatch~~ ✅ FIXED: widened from 640px to 880px
- ~~Category 6 questions tested untaught content~~ ✅ FIXED: Added Section 7 "Common Pitfalls"
- ~~ForestPlotAnatomy was hover-based~~ ✅ FIXED: Converted to click-based with log-scale axis

---

## Course 5 — Heterogeneity & Publication Bias

**Accent color:** CRIMSON `#C0392B` | **File:** `Course5.jsx` (668 lines) | **Game:** `DinoDoorEscape.jsx` (696 lines)

### Sidebar Catalog (7 items)
1. What Is Heterogeneity (`#s1`)
2. Measuring Heterogeneity (`#s2`)
3. Sources (`#s3`)
4. Exploring (`#s4`)
5. Publication Bias (`#s5`)
6. Reporting (`#s6`)
7. Dino Map Escape (`#game`)

### Sections
1. **What Is Heterogeneity?** — "You combined 10 studies, but they disagree wildly." Analogy: "averaging the temperature of 5 cities — Arctic + Sahara = meaningless." Between-study variation concept.
2. **Measuring Heterogeneity** — **HeterogeneitySlider**: interactive I² slider (0%→95%) with dynamic visualization: dots spread apart as I² increases. Color-coded labels (green→yellow→orange→red). Introduces Cochran's Q and prediction intervals.
3. **Why Does Heterogeneity Happen?** — **HeterogeneitySourceCards**: 4 expandable cards: (a) Clinical diversity (populations, doses, durations). (b) Methodological diversity (study designs, RoB levels). (c) Statistical diversity (outcome definitions, time points). (d) Unexplained. Each with pharmacy-relevant examples.
4. **Exploring Heterogeneity** — **SubgroupDemo**: toggle "Overall Pooled" vs "Split by Dose" view. Bar chart shows how high-dose (0.55) and low-dose (0.20) effects are hidden by overall (0.38). Also introduces meta-regression conceptually.
5. **Publication Bias** — **FunnelPlotDemo**: interactive funnel plot. Toggle symmetric (good) vs asymmetric (suspicious). SVG with dots, funnel outline, highlighted "missing zone." Introduces Egger's test and trim-and-fill.
6. **Reporting Your Meta-Analysis** — **PrismaHighlights**: PRISMA 2020 checklist highlights: 6 clickable items (register protocol, document search, PRISMA flow, RoB assessment, report ALL results, share data). Congratulatory wrap-up message for completing all 6 courses.

### Interactive Components (in Course5.jsx)
- **HeterogeneitySlider** — I² range slider (0–95%), color-coded levels, dot scatter visualization
- **HeterogeneitySourceCards** — 4 expandable cards (clinical, methodological, statistical, unexplained)
- **SubgroupDemo** — Toggle overall vs dose-split view, bar chart with subgroup pooled effects
- **FunnelPlotDemo** — SVG funnel plot, toggle symmetric vs biased, highlighted missing-study zone
- **PrismaHighlights** — 6 clickable checklist items with expand-on-click descriptions

### Game: Dino Map Escape (DinoDoorEscape)

- **File:** `DinoDoorEscape.jsx`
- **Narrative:** Dinos must find pieces of a treasure map to discover which door leads to their new home.
- **Progressive difficulty (same structure as Course 4):**
  - **Phase 1 (Foundation):** 3 standard MCQ. Must pass ≥2/3 to unlock Phase 2.
  - **Phase 2 (Advanced):** 6 mixed-type questions (2 true/false, 2 multi-select, 1 ordering, 1 spot-error).
- **Treasure map mechanic:** 3×3 SVG grid map assembles piece by piece as questions are answered:
  - **Found pieces** (correct answer) → tile revealed showing part of the illustrated map
  - **Missed pieces** (wrong answer) → tile stays as dark fog with "?"
  - The full map shows a path from a dino (top-left) winding right then down to Door 3 (bottom-right)
  - Top row: dino start → path right → path turns down
  - Middle row: trees/scenery → rocks → path continues down
  - Bottom row: Door 1 → Door 2 → Door 3 (path ends here, golden glow)
- **Door choice phase:** After all 9 questions, player sees assembled map + 3 doors. More pieces found = clearer path = easier to identify correct door. Critical piece: bottom-right tile (piece 9) shows path connecting to Door 3.
- **Visual theme:** Dark corridor (purple gradient), torch-like flickering lights, crimson glow in advanced phase
- **Question type renderers:** Same types as Course 4 but with crimson accent color
- **`::selection` CSS** override for text readability in dark game background
- **Question bank:** 105 Qs in `course5Questions.js`: 70 MCQ (10 × 7 categories) + 35 advanced (per category: 2 true/false, 1 multi-select, 1 ordering, 1 spot-error)
- **Categories (from `course5Categories`):**
  - 0: What Heterogeneity Is
  - 1: I², Q Statistic & Prediction Intervals
  - 2: Sources of Heterogeneity
  - 3: Subgroup Analysis & Meta-Regression
  - 4: Publication Bias & Funnel Plots
  - 5: Egger's Test & Trim-and-Fill
  - 6: PRISMA Reporting & Interpretation
- **Result tiers:** Map Master (correct door + ≥8), Navigator (correct door + ≥6), Seeker (correct door + <6), So Close (wrong door + ≥6), Lost (wrong door + <6), Locked (failed foundation <2/3)
- **Phases:** `select` → `foundation` → `gate` → `advanced` → `choose` → `result`
- **Key state:** `selectedDino` (0–6), `score` (0–9), `foundScore` (0–3), `mapPieces` (Array(9): hidden/found/missed), `doorChoice` (null or {door, correct})
- **Props received:** `lang`
- **DB save (Phase 3):** `result` = `escaped` (foundation ≥2 AND correct door AND score ≥6) or `trapped`, `dino_index` = `selectedDino`
- **Course 5 footer:** No "Next Course" button — shows "🎓 Course Complete!" as final course

### Known Issues (all resolved)
- ~~Game used generic door open/lock mechanic~~ ✅ FIXED: Redesigned as treasure map puzzle with 3×3 SVG grid
- ~~CuteDino prop `species` not recognized~~ ✅ FIXED: Changed to `index`
- ~~Game container narrower than course sections~~ ✅ FIXED: `maxWidth: 700` → `880`
- ~~Dino select grid clipped 7th dino~~ ✅ FIXED: Matched DinoKeyQuest's grid pattern
- ~~MSRenderer/OrderRenderer kept state across questions~~ ✅ FIXED: Added `key={qi}` to force remount
- ~~SERenderer crashed on spot_error questions~~ ✅ FIXED: `data.opts` → `(data.statements || data.opts)`
- ~~Selected text invisible in dark game area~~ ✅ FIXED: Added `::selection` CSS
- ~~Section label "報告你的分析" was awkward Chinese~~ ✅ FIXED: Changed to "完整報告"
- ~~PRISMA checklist in 5-column layout~~ ✅ FIXED: Changed to 3×2 grid
- ~~Paragraph maxWidth mismatch~~ ✅ FIXED: Removed `maxWidth: 640`

---

## MA Workshop: Planning (Midterm — After Course 3)

**Accent color:** Gold `#8B6914` | **File:** `Midterm.jsx` (1045 lines) | **Route:** `#midterm`

**Hub integration:** Clickable `CheckpointCard` (🛠️ emoji) at bottom of Foundations section.

### 5-Step Wizard
1. **Define PICO** (定義 PICO) — Free-text clinical question + P/I/C/O form fields. 🤖 **AI check** validates specificity, searchability, feasibility.
2. **Search Strategy** (搜尋策略) — Database picker (PubMed, Embase, Cochrane, etc.) + Boolean query builder + grey literature sources. 🤖 **AI check** validates syntax, coverage, appropriateness.
3. **Add Studies** (納入研究) — Collapsible study cards. Citation, design, N, P/I/C/O per study. Include/exclude toggle with reason field. Minimum 3 included studies required.
4. **Data Extraction** (資料萃取) — Per included study: binary (events/total per arm) or continuous (mean/SD/N per arm). Outcome type toggle.
5. **Risk of Bias** (偏差風險評估) — Interactive traffic light matrix. 5 domains (Randomization, Blinding, Attrition, Selective Reporting, Other) × Low/Some Concerns/High rating. Overall auto-derived from worst domain.

### Phase Gate
- **Requirements to unlock Phase 2 (Final):** PICO must pass AI check (✅ in response) + at least 3 included studies.
- Both conditions shown as checklist. "Go to Analysis Workshop →" button navigates to `#final`.

### AI Workshop Gating (Phase 3)
- AI check buttons require: User logged in + at least 1 dino with `result = 'saved'` in Course 3 progress
- Workshop UI always visible; only AI buttons are disabled when requirements not met

### Demo Data
- Hidden "試用範例資料 / Try with example data" link (top-right, subtle) loads 5 SGLT2i/CKD RCTs (CREDENCE, DAPA-CKD, EMPA-KIDNEY, EMPA-REG OUTCOME, CANVAS) with full extraction data and RoB ratings.
- PICO pass flag is NOT pre-set — user must still run AI check.

### State
- All data in single `project` state object, persisted to `sessionStorage` key `ma_project_midterm`.
- Bilingual text is self-contained in `Midterm.jsx` (not in `i18n.js`) — standalone module.

---

## MA Workshop: Analysis (Final — After Course 5)

**Accent color:** Crimson `#C0392B` | **File:** `Final.jsx` (lines TBD) | **Route:** `#final`

**Hub integration:** Clickable `CheckpointCard` (📈 emoji) at bottom of Advanced section.

### 5-Step Wizard
1. **Effect Size & Model** (效果量與模型) — Choose effect size type (OR/RR/RD for binary; MD/SMD for continuous) with per-option explanations. Choose fixed vs random effects model with rationale text area.
2. **Prepare Data** (準備資料) — Auto-formatted table of extracted data from Phase 1. "Copy Table" (TSV to clipboard), "Download CSV" buttons.
3. **Run Analysis** (執行分析) — Two-tab interface:
   - **🌐 Online Calculator tab:** Step-by-step guide to [Onlinemeta](https://smuonco.shinyapps.io/Onlinemeta/). Alternative links to MetaAnalysisOnline.com and Meta-Mar.
   - **📟 R Code tab:** Auto-generated `metafor` R script with user's study data pre-filled. Includes `escalc()`, `rma()`, `forest()`, `funnel()`. Dark-themed code block with copy button.
4. **Interpret & Report** (解讀與報告) — Blue guidance box (checklist of what to report). 4 interpretation text areas (pooled effect, consistency/weight, heterogeneity, funnel plot). Publication bias test selector. Subgroup/sensitivity analysis plan.
5. **Conclusions** (撰寫結論) — Main finding, GRADE certainty selector (High/Moderate/Low/Very Low) with rationale, limitations, clinical implications. 🤖 **AI check** evaluates consistency, GRADE reasonableness, reporting completeness.

### AI Workshop Gating (Phase 3)
- AI check button requires: User logged in + at least 1 dino with `result = 'escaped'` in Course 5 progress (full journey completed)
- Workshop UI always visible; only AI button is disabled when requirements not met

### Completion
- Summary card showing: PICO, study count, effect size type/model, interpretation, main finding, GRADE, implications.
- No poster PDF generation — users take plots (from Onlinemeta/R) and content into their own template.

### R Code Generator (`buildRCode()`)
- Binary: `escalc(measure="OR", ai=..., n1i=..., ci=..., n2i=...)` → `rma()` → `forest(atransf=exp)` → `funnel()`
- Continuous: `escalc(measure="MD", m1i=..., sd1i=..., n1i=..., m2i=..., sd2i=..., n2i=...)` → `rma()` → `forest()` → `funnel()`
- Includes `cat()` statements for key statistics printout.

### AI Usage (across both phases)
- **3 checkpoints total:** PICO (Midterm Step 1), Search Strategy (Midterm Step 2), Conclusions (Final Step 5)
- Estimated cost: ~$0.01–0.03 per full workshop run (3 API calls)
- All calls use existing `/api/ai-feedback` endpoint with step-specific system prompts
- **Gated behind login + course completion** to control costs

### State
- Reads Phase 1 data from `sessionStorage` key `ma_project_midterm`.
- Analysis state persisted to `sessionStorage` key `ma_project_final`.
- Supabase persistence is Phase 3 work (not yet wired).

### External Tools Linked
- [Onlinemeta](https://smuonco.shinyapps.io/Onlinemeta/) — primary (R-Shiny, free, no login, published in JMIR 2025)
- [MetaAnalysisOnline.com](https://metaanalysisonline.com/) — alternative
- [Meta-Mar](https://www.meta-mar.com/) — alternative with AI features

---

*Last updated: March 12, 2026*
