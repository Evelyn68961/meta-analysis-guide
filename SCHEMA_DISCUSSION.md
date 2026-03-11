# Meta-Analysis 101 — Schema Discussion (Phase 3)

> **Purpose:** Lock down the database schema before wiring game components to Supabase.  
> **Date:** March 11, 2026  
> **Status:** ✅ All decisions locked in — ready for SQL migration + wiring

---

## The Progression Chain

Evelyn's core design: **each course's outcome gates the next course's options.**

```
Course 0 (EggHunt)      — each correct answer collects that category's egg
       ↓ collected eggs
Course 1 (EggHatch)     — pick from collected eggs → hatch or freeze
       ↓ hatched dinos
Course 2 (FoodRescue)   — pick from hatched dinos → rescue or fail
       ↓ rescued dinos
Course 3 (HomeSave)     — pick from rescued dinos → save or fail
       ↓ saved dinos
Course 4 (KeyQuest)     — pick from saved dinos → earn key or fail
       ↓ unlocked dinos
Course 5 (DoorEscape)   — pick from unlocked dinos → escape or trapped
```

This means progress rows become the **source of truth** for what's available in later courses.

---

## What Each Game Actually Produces (from code audit)

| Game | Course | `game_type` | Key state at game-end | Win condition | Lose condition | Dino/egg selection? |
|------|--------|-------------|----------------------|---------------|----------------|---------------------|
| **DinoEggHunt** | 0 | `egg_hunt` | `score` (correct out of 7 Qs, one per category), tier system (≥3/≥5/≥7) | Tier-based (no binary pass/fail) | No fail state | ❌ No egg/dino pick (but each Q maps to a category = dino_index) |
| **DinoEggHatch** | 1 | `dino_hatch` | `correctCount`, `wrongCount`, `chosenEgg` (0–6) | ≥5 correct → hatched | ≥3 wrong → frozen | ✅ `chosenEgg` (0–6) |
| **DinoFoodRescue** | 2 | `food_rescue` | `freedCount`, `wrongCount`, `chosenDino` (0–6) | ≥5 freed → rescued | ≥3 wrong → lost | ✅ `chosenDino` (0–6) |
| **DinoHomeSave** | 3 | `home_save` | `correctCount`, `wrongCount`, `chosenDino` (0–6), timer per question | ≥5 correct → saved | ≥3 wrong → lost (timeout counts as wrong) | ✅ `chosenDino` (0–6) |
| **DinoKeyQuest** | 4 | `key_quest` | `score` (0–9), `foundScore` (0–3 foundation), `selectedDino` (0–6), tier system | foundScore ≥2 + score tiers (master/explorer/apprentice/novice) | foundScore <2 → locked | ✅ `selectedDino` (0–6) |
| **DinoDoorEscape** | 5 | `door_escape` | `score` (0–9), `foundScore` (0–3 foundation), `doorChoice` (correct/wrong), `selectedDino` (0–6), `mapPieces` (found count) | choseDoorCorrectly + score tiers (master/navigator/seeker) | Wrong door → close/lost, foundScore <2 → locked | ✅ `selectedDino` (0–6) |

### C4 & C5 game structure (both use 3 foundation + 6 advanced = 9 questions)

- **DinoKeyQuest (C4):** 3 foundation questions → must get ≥2 to unlock advanced → 6 advanced questions → earn key fragments. Tier: master (≥8), explorer (≥6), apprentice (≥4), novice (<4), locked (foundation <2).
- **DinoDoorEscape (C5):** 3 foundation questions → must get ≥2 to unlock advanced → 6 advanced questions → collect map pieces → choose a door. Tiers: master (correct door + ≥8), navigator (correct door + ≥6), seeker (correct door + <6), close (wrong door + ≥6), lost (wrong door + <6), locked (foundation <2).

### Score denominators vary by game

| Game | Questions | Max score (saved to DB) | What "score" means | Early exit? |
|------|-----------|------------------------|-------------------|-------------|
| EggHunt (C0) | 7 (1 per category) | 7 | Correct answers out of 7 | No — always answers all 7 |
| EggHatch (C1) | 7 | 5 | `correctCount` — game ends at 5 correct | Yes — stops at ≥5 correct or ≥3 wrong |
| FoodRescue (C2) | 7 | 5 | `freedCount` — game ends at 5 freed | Yes — stops at ≥5 freed or ≥3 wrong |
| HomeSave (C3) | 7 | 5 | `correctCount` — game ends at 5 correct | Yes — stops at ≥5 correct or ≥3 wrong (timeout = wrong) |
| KeyQuest (C4) | 9 (3+6) | 9 | `score` — total correct across both phases | No early exit (but locked if foundation <2/3) |
| DoorEscape (C5) | 9 (3+6) + door | 9 | `score` — total correct (door choice is separate) | No early exit (but locked if foundation <2/3) |

**Important nuance for C1/C2/C3:** These games pick 7 questions but end early when the win (≥5 correct) or lose (≥3 wrong) threshold is hit. The `score` saved to DB is the actual correct count at game end (0–5 for a win, 0–4 for a loss). The `max_score` stored is 5 (the win threshold), not 7 (total questions). This matches what the UI displays (e.g., "☀️ 4/5 hatch").

---

## Issues Found with Original Schema

The original `progress` table from `BACKEND_UPGRADE_PLAN.md`:

```
progress: id, user_id, course, game_type, egg_index, dino_species, score, result, completed_at
```

**Problems:**

1. **`egg_index` doesn't apply to C0 (EggHunt)** — EggHunt is a quiz, not an egg-picking game. `egg_index` is a C1 concept.
2. **`dino_species` stored as TEXT** — fragile. Better to use a numeric index (0–6) that maps to species universally.
3. **`result` values unclear** — plan says `'hatched', 'frozen', 'fed', 'saved', 'lost'` but actual games produce: `hatched`/`frozen` (C1), `rescued`/`lost` (C2), `saved`/`lost` (C3). C0 has no binary pass/fail.
4. **ProfilePage mismatches:**
   - Line 52 expects `result === "found"` for egg_hunt — but EggHunt has no "found" concept
   - Line 134 displays all stats as `/7` — wrong for C0 (out of 7, OK), C2 (out of 5), C4/C5 (out of 9)
5. **No `max_score` column** — can't display correct denominators on ProfilePage without it.

---

## Proposed Schema Revision

Keep the flat `progress` table (one row = one game session). Replace `egg_index` + `dino_species` with a universal `dino_index`.

### `profiles` table (unchanged)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | References `auth.users.id` |
| display_name | TEXT | From Google profile |
| avatar_url | TEXT | From Google profile |
| created_at | TIMESTAMPTZ | Auto |

### `progress` table (revised)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK) | → `profiles.id` |
| course | INT | 0, 1, 2, 3, 4, 5 |
| game_type | TEXT | `egg_hunt`, `dino_hatch`, `food_rescue`, `home_save`, `key_quest`, `door_escape` |
| dino_index | INT | 0–6, the universal index linking egg ↔ dino across all courses |
| score | INT | Correct count for that session |
| max_score | INT | Denominator: 7 (C0), 5 (C1), 5 (C2), 5 (C3), 9 (C4), 9 (C5) |
| result | TEXT | See result values below |
| completed_at | TIMESTAMPTZ | Auto (`now()` default) |

### Result values by course

| Course | Possible `result` values | Meaning |
|--------|-------------------------|---------|
| C0 (EggHunt) | `collected` | One row per egg unlocked by correct answer |
| C1 (EggHatch) | `hatched` / `frozen` | Did the dino hatch or freeze? |
| C2 (FoodRescue) | `rescued` / `lost` | Was the food rescued? |
| C3 (HomeSave) | `saved` / `lost` | Was the home saved? |
| C4 (KeyQuest) | `unlocked` / `locked` | Did the dino earn the key? (foundation ≥2 + tier-based) |
| C5 (DoorEscape) | `escaped` / `trapped` | Did the dino escape through the correct door? |

**C4/C5 pass threshold: Explorer+ (score ≥6/9) ✅**

- **C4 (KeyQuest):** `result = 'unlocked'` when tier is explorer (≥6) or master (≥8). Otherwise `result = 'locked'`.
- **C5 (DoorEscape):** `result = 'escaped'` when tier is navigator (correct door + ≥6) or master (correct door + ≥8). Otherwise `result = 'trapped'`. (Choosing the wrong door = trapped regardless of score.)

### Gating queries

(See updated version in Decisions section below.)

---

## Decisions (Locked In ✅)

### 1. C0 → C1 gating: each correct answer unlocks 1 specific egg ✅

EggHunt already picks **exactly 7 questions, one per category**. Each category naturally maps 1:1 to a dino_index:

| Category (C0 question) | `dino_index` | Egg color | Dino name |
|------------------------|-------------|-----------|-----------|
| 0 — what-why | 0 | 🟢 `#2ECC71` | 翠牙龍 Rex (T-Rex) |
| 1 — data | 1 | 🔵 `#3498DB` | 蒼瀾龍 Azure (Plesiosaur) |
| 2 — forest | 2 | 🟡 `#F1C40F` | 金翼龍 Zephyr (Pterodactyl) |
| 3 — heterogeneity | 3 | 🔴 `#E74C3C` | 焰角龍 Blaze (Triceratops) |
| 4 — search | 4 | 🟣 `#9B59B6` | 紫棘龍 Thistle (Stegosaurus) |
| 5 — bias | 5 | 🟠 `#E67E22` | 珀爪龍 Velo (Velociraptor) |
| 6 — interpretation | 6 | ⚪ `#95A5A6` | 鐵穹龍 Dome (Pachycephalosaurus) |

**How it works:** When the player answers a question correctly, one row is inserted with `course=0, dino_index=<category number>, result='collected'`. If they answer wrong, no row. Replaying C0 can collect previously missed eggs.

**Code note:** `pickBalanced(course0Questions, 7, 7)` already picks 7 questions (1 per category). The category number on each question (`questions[current].category`) is the `dino_index`. No redesign needed — the mapping is already there.

### 2. Full linear chain: C0→C1→C2→C3→C4→C5 ✅

Each course gates the next:

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

**Gating queries (updated):**

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

**Implication:** A dino that gets frozen in C1 is NOT available in C2. A dino that fails food rescue in C2 is NOT available in C3. The player must replay to advance that dino. This creates strong motivation to replay and master each course.

### 3. Non-logged-in users: all 7 available, no gating, no saving ✅

- **Logged out:** All 7 eggs/dinos are shown in every course. No gating. Games are fully playable but results are not saved to Supabase.
- **Logged in:** Gating is active. Only unlocked eggs/dinos appear as selectable. Progress is saved.
- **No login wall.** The site remains fully playable without an account.

---

## ProfilePage Fixes Needed

Once schema is finalized, ProfilePage needs updates:

1. **Remove `result === "found"` check** (line 52) — replace with actual C0 result value
2. **Use `max_score` for denominators** — don't hardcode `/7` for all games
3. **Dino collection grid logic** — derive from `result = 'hatched'` in C1, not just "any interaction"
4. **Add progression visualization** — show egg → hatch → feed → save journey per dino

---

## Implementation Notes (from code audit)

### Variable names per game (for wiring)

| Game | Dino selection variable | Score variable | Props currently received | Props needed |
|------|----------------------|----------------|------------------------|-------------|
| DinoEggHunt | N/A (category from question) | `results.filter(r => r.correct).length` | `t, lang` | `t, lang, user` |
| DinoEggHatch | `chosenEgg` | `correctCount` | `t, lang, onNext` | `t, lang, onNext, user` |
| DinoFoodRescue | `chosenDino` | `freedCount` | `t, lang` | `t, lang, user` |
| DinoHomeSave | `chosenDino` | `correctCount` | `t, lang` | `t, lang, user` |
| DinoKeyQuest | `selectedDino` | `score` | `lang` | `lang, user` |
| DinoDoorEscape | `selectedDino` | `score` | `lang` | `lang, user` |

### C0 special case: multiple rows per game session

Unlike C1–C5 (which save ONE row per game session), C0 saves up to 7 rows — one `collected` row per correct answer. Each row uses the question's `.category` as `dino_index`. Wrong answers produce no row. This means:
- `score` and `max_score` on C0 rows are per-egg (always `score=1, max_score=1`) since each row represents one collected egg
- OR we save one summary row with score=N, max_score=7 PLUS individual `collected` rows for gating
- **Recommended:** Save individual `collected` rows only (for gating queries). The total score can be derived by counting rows: `SELECT COUNT(*) FROM progress WHERE user_id=? AND course=0 AND result='collected'`

### C4/C5 special case: `locked` result when foundation fails

If `foundScore < 2`, the player never reaches advanced questions. The game ends with `score` = foundScore (0 or 1 out of 3 attempted). We still save a row so the player can see their attempt history, but `result = 'locked'` means this dino is NOT available in the next course.

### C5 special case: door choice is separate from score

`score` (0–9) tracks question correctness. The door choice is a separate binary event. For the `result` field:
- `escaped` = correct door AND score ≥6 (navigator or master tier)
- `trapped` = anything else (wrong door, or correct door but score <6, or foundation locked)

### Question bank sizes

| Course | Bank size | Questions per game | Categories |
|--------|-----------|-------------------|------------|
| C0 | 35 | 7 (1 per category) | 7 |
| C1 | 70 | 7 (balanced) | 7 |
| C2 | 70 | 7 (balanced) | 7 |
| C3 | 70 | 7 (balanced) | 7 |
| C4 | 105 | 9 (3 MCQ foundation + 6 mixed advanced) | 7 |
| C5 | 105 | 9 (3 MCQ foundation + 6 mixed advanced) | 7 |

### ProfilePage GAME_TYPES needs expansion

Current ProfilePage only tracks 4 game types. Needs 2 more:
```js
{ key: "key_quest", emoji: "🔑", course: 4, color: "#2E86C1" },
{ key: "door_escape", emoji: "🚪", course: 5, color: "#C0392B" },
```

### Course accent colors (for consistent styling)

| Course | Color name | Hex | Used in |
|--------|-----------|-----|---------|
| C0 | Teal | `#0E7C86` | Course0, EggHunt, ProfilePage |
| C1 | Coral | `#E8734A` | Course1, EggHatch, ProfilePage |
| C2 | Purple | `#7B68C8` | Course2, FoodRescue, ProfilePage |
| C3 | Gold | `#D4A843` | Course3, HomeSave, ProfilePage |
| C4 | Blue | `#2E86C1` | Course4, KeyQuest |
| C5 | Crimson | `#C0392B` | Course5, DoorEscape |

---

## Files That Need Changes (Phase 3 wiring)

| File | What changes |
|------|-------------|
| `DinoEggHunt.jsx` | Save `collected` rows per correct answer (if logged in) |
| `DinoEggHatch.jsx` | Accept `user` prop, query available eggs from C0, save `hatched`/`frozen` result |
| `DinoFoodRescue.jsx` | Accept `user` prop, query available (hatched) dinos from C1, save `rescued`/`lost` result |
| `DinoHomeSave.jsx` | Accept `user` prop, query available (rescued) dinos from C2, save `saved`/`lost` result |
| `DinoKeyQuest.jsx` | Accept `user` prop, query available (saved) dinos from C3, save `unlocked`/`locked` result |
| `DinoDoorEscape.jsx` | Accept `user` prop, query available (unlocked) dinos from C4, save `escaped`/`trapped` result |
| `Course0.jsx` | Pass `user` prop to DinoEggHunt |
| `Course1.jsx` | Pass `user` prop to DinoEggHatch |
| `Course2.jsx` | Pass `user` prop to DinoFoodRescue |
| `Course3.jsx` | Pass `user` prop to DinoHomeSave |
| `Course4.jsx` | Pass `user` prop to DinoKeyQuest |
| `Course5.jsx` | Pass `user` prop to DinoDoorEscape |
| `ProfilePage.jsx` | Fix stats derivation, use `max_score`, fix dino collection logic, add C4/C5 game types |
| `Supabase SQL` | ALTER `progress` table: drop `egg_index` + `dino_species`, add `dino_index` + `max_score` |

---

*All decisions locked in on March 11, 2026. Ready for SQL migration and game component wiring.*
