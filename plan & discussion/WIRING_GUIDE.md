# Backend Wiring Guide — Step by Step

> **What this covers:** Everything you need to do to go from the current state (schema designed, auth working, no game data saving) to fully working backend (games save progress, ProfilePage shows real data, AI workshops are gated, old data auto-cleans).
>
> **How to use this:** Do the steps in order. Each step tells you exactly where to go and what to do.

---

## Before You Start: What's Already Done vs What's Not

**Already done (Phases 0–2):**
- Supabase project exists, `supabaseClient.js` works
- Google OAuth login/logout works
- `profiles` and `progress` tables exist in Supabase (but `progress` has the OLD columns)
- `SiteNav.jsx` shows login/logout
- `ProfilePage.jsx` exists but reads old column names that don't match the new schema
- All 6 courses pass `user` prop down from `App.jsx`

**What you're about to do (Phase 3):**
1. Fix the database table to match the new schema
2. Add `last_login_at` to profiles (for 3-month cleanup)
3. Wire each game to save results when logged in
4. Fix ProfilePage to read the new columns
5. Gate AI workshops behind login + course completion
6. Set up automatic 3-month cleanup

---

## Step 1: Fix the `progress` Table in Supabase

**Where:** Supabase Dashboard → SQL Editor

**Why:** The current `progress` table has `egg_index` and `dino_species` (old design). The new schema uses `dino_index` and adds `max_score`.

**Copy-paste this SQL and run it:**

```sql
-- Step 1a: Drop the old columns
ALTER TABLE progress DROP COLUMN IF EXISTS egg_index;
ALTER TABLE progress DROP COLUMN IF EXISTS dino_species;

-- Step 1b: Add the new columns
ALTER TABLE progress ADD COLUMN IF NOT EXISTS dino_index INT;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS max_score INT;

-- Step 1c: Update game_type to include all 6 games
-- (No SQL needed — game_type is just TEXT, so new values like
--  'key_quest' and 'door_escape' will work automatically when inserted)
```

**After running:** Click on "Table Editor" in the left sidebar → select `progress` → verify you see these columns: `id, user_id, course, game_type, dino_index, score, max_score, result, completed_at`.

---

## Step 2: Add `last_login_at` to `profiles`

**Where:** Supabase Dashboard → SQL Editor

**Why:** This tracks when the user last logged in. After 3 months of no login, their data gets auto-deleted to keep the database lean.

**Copy-paste this SQL and run it:**

```sql
-- Add the column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT now();

-- Set existing users' last_login_at to their created_at (so they don't immediately expire)
UPDATE profiles SET last_login_at = created_at WHERE last_login_at IS NULL;
```

---

## Step 3: Update `last_login_at` on Every Login

**Where:** `App.jsx` — inside the existing auth listener

**Why:** Every time the user logs in (or returns to the site with an active session), we update `last_login_at` so their 3-month clock resets.

**Find this code (around line 322–331):**

```js
// Listen for auth state changes
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null);
    }
  );
  return () => subscription.unsubscribe();
}, []);
```

**Replace with:**

```js
// Listen for auth state changes
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    const u = session?.user ?? null;
    setUser(u);
    // Update last_login_at whenever a session exists
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

**What changed:** Added 2 lines that update `last_login_at` to "right now" whenever a user session is detected. The `.then()` at the end means "fire and forget" — we don't need to wait for it.

---

## Step 4: Wire Each Game to Save Progress

This is the biggest step. Each game needs to:
- Accept `user` as a prop
- When the game ends, if `user` exists, insert a row into `progress`
- If `user` is null (not logged in), do nothing — game plays normally but doesn't save

### The Pattern (same for every game)

At the top of each game file, add:

```js
import { supabase } from "./supabaseClient";
```

Then at the point where the game ends (win or lose), add a save function. Here's what each game saves:

---

### 4a. DinoEggHunt (Course 0) — saves one row per correct answer

**Props change:** The parent `Course0.jsx` already passes `user` to `DinoEggHunt` (or will need to — check that `<DinoEggHunt ... user={user} />` is in the JSX).

**Where to save:** Inside DinoEggHunt, right after a question is answered correctly. Each correct answer saves one `collected` row.

```js
// Call this when a question is answered correctly
const saveEggCollected = async (categoryIndex) => {
  if (!user) return; // not logged in, skip
  try {
    await supabase.from("progress").insert({
      user_id: user.id,
      course: 0,
      game_type: "egg_hunt",
      dino_index: categoryIndex,  // 0-6, from the question's .category
      score: 1,
      max_score: 1,
      result: "collected",
    });
  } catch (e) {
    console.error("Failed to save egg:", e);
  }
};
```

**Important:** C0 is the only game that saves multiple rows per session (one per correct answer). All other games save exactly one row at game end.

---

### 4b. DinoEggHatch (Course 1)

**When to save:** At game end — either hatched (≥5 correct) or frozen (≥3 wrong).

```js
const saveHatchResult = async (chosenEggIndex, correctCount, didHatch) => {
  if (!user) return;
  try {
    await supabase.from("progress").insert({
      user_id: user.id,
      course: 1,
      game_type: "dino_hatch",
      dino_index: chosenEggIndex,  // 0-6, from chosenEgg state
      score: correctCount,
      max_score: 5,
      result: didHatch ? "hatched" : "frozen",
    });
  } catch (e) {
    console.error("Failed to save hatch:", e);
  }
};
```

---

### 4c. DinoFoodRescue (Course 2)

```js
const saveFoodResult = async (chosenDinoIndex, freedCount, didRescue) => {
  if (!user) return;
  try {
    await supabase.from("progress").insert({
      user_id: user.id,
      course: 2,
      game_type: "food_rescue",
      dino_index: chosenDinoIndex,
      score: freedCount,
      max_score: 5,
      result: didRescue ? "rescued" : "lost",
    });
  } catch (e) {
    console.error("Failed to save food rescue:", e);
  }
};
```

---

### 4d. DinoHomeSave (Course 3)

```js
const saveHomeResult = async (chosenDinoIndex, correctCount, didSave) => {
  if (!user) return;
  try {
    await supabase.from("progress").insert({
      user_id: user.id,
      course: 3,
      game_type: "home_save",
      dino_index: chosenDinoIndex,
      score: correctCount,
      max_score: 5,
      result: didSave ? "saved" : "lost",
    });
  } catch (e) {
    console.error("Failed to save home:", e);
  }
};
```

---

### 4e. DinoKeyQuest (Course 4)

**Extra logic:** `result` depends on both foundation score and total score.

```js
const saveKeyResult = async (selectedDinoIndex, totalScore, foundScore) => {
  if (!user) return;
  // unlocked = foundation passed (≥2) AND explorer tier or above (total ≥6)
  const didUnlock = foundScore >= 2 && totalScore >= 6;
  try {
    await supabase.from("progress").insert({
      user_id: user.id,
      course: 4,
      game_type: "key_quest",
      dino_index: selectedDinoIndex,
      score: totalScore,
      max_score: 9,
      result: didUnlock ? "unlocked" : "locked",
    });
  } catch (e) {
    console.error("Failed to save key quest:", e);
  }
};
```

---

### 4f. DinoDoorEscape (Course 5)

**Extra logic:** `result` depends on foundation score, total score, AND door choice.

```js
const saveDoorResult = async (selectedDinoIndex, totalScore, foundScore, choseCorrectDoor) => {
  if (!user) return;
  // escaped = foundation passed + correct door + navigator tier or above (total ≥6)
  const didEscape = foundScore >= 2 && choseCorrectDoor && totalScore >= 6;
  try {
    await supabase.from("progress").insert({
      user_id: user.id,
      course: 5,
      game_type: "door_escape",
      dino_index: selectedDinoIndex,
      score: totalScore,
      max_score: 9,
      result: didEscape ? "escaped" : "trapped",
    });
  } catch (e) {
    console.error("Failed to save door escape:", e);
  }
};
```

---

### Where exactly to call these functions

You need to find the game-end moment in each file. Look for the state change that triggers the results screen. For example:

- In **DinoEggHatch**: look for where `correctCount >= 5` (win) or `wrongCount >= 3` (lose) — call `saveHatchResult()` right there
- In **DinoFoodRescue**: look for where `freedCount >= 5` (win) or `wrongCount >= 3` (lose)
- And so on for each game

The exact line numbers differ per file, so when you're ready to wire a specific game, share the relevant section of that game file and I'll tell you exactly where to insert the call.

---

## Step 5: Wire Dino Gating (Logged-In Users Only)

**What this does:** When logged in, each game only shows dinos that were successfully advanced in the previous course. When logged out, all 7 are available.

**The pattern** — add this to each game component (C1–C5):

```js
const [availableDinos, setAvailableDinos] = useState([0,1,2,3,4,5,6]); // default: all

useEffect(() => {
  if (!user) return; // not logged in → keep all 7 available
  const fetchAvailable = async () => {
    const { data } = await supabase
      .from("progress")
      .select("dino_index")
      .eq("user_id", user.id)
      .eq("course", PREVIOUS_COURSE_NUMBER)   // ← change per game
      .eq("result", PREVIOUS_SUCCESS_RESULT);  // ← change per game
    if (data) {
      const indices = [...new Set(data.map(r => r.dino_index))];
      if (indices.length > 0) setAvailableDinos(indices);
    }
  };
  fetchAvailable();
}, [user]);
```

**Values per game:**

| Game (file) | `PREVIOUS_COURSE_NUMBER` | `PREVIOUS_SUCCESS_RESULT` |
|---|---|---|
| DinoEggHatch (C1) | `0` | `"collected"` |
| DinoFoodRescue (C2) | `1` | `"hatched"` |
| DinoHomeSave (C3) | `2` | `"rescued"` |
| DinoKeyQuest (C4) | `3` | `"saved"` |
| DinoDoorEscape (C5) | `4` | `"unlocked"` |

Then in the dino/egg selection UI, only render options where `availableDinos.includes(index)`.

---

## Step 6: Fix ProfilePage

**Where:** `ProfilePage.jsx`

The current code references old columns (`egg_index`, `dino_species`, `result === "found"`). Here's what to change:

### 6a. Update GAME_TYPES (line 16–21)

**Replace:**
```js
const GAME_TYPES = [
  { key: "egg_hunt", emoji: "🥚", course: 0, color: "#0E7C86" },
  { key: "dino_hatch", emoji: "🐣", course: 1, color: "#E8734A" },
  { key: "food_rescue", emoji: "🍖", course: 2, color: "#7B68C8" },
  { key: "home_save", emoji: "🏠", course: 3, color: "#D4A843" },
];
```

**With:**
```js
const GAME_TYPES = [
  { key: "egg_hunt", emoji: "🥚", course: 0, color: "#0E7C86", maxScore: 7 },
  { key: "dino_hatch", emoji: "🐣", course: 1, color: "#E8734A", maxScore: 5 },
  { key: "food_rescue", emoji: "🍖", course: 2, color: "#7B68C8", maxScore: 5 },
  { key: "home_save", emoji: "🏠", course: 3, color: "#D4A843", maxScore: 5 },
  { key: "key_quest", emoji: "🔑", course: 4, color: "#2E86C1", maxScore: 9 },
  { key: "door_escape", emoji: "🚪", course: 5, color: "#C0392B", maxScore: 9 },
];
```

### 6b. Fix stats derivation (lines 52–58)

**Replace:**
```js
const eggsCollected = new Set(progress.filter(p => p.game_type === "egg_hunt" && p.result === "found").map(p => p.egg_index)).size;
const dinosHatched = progress.filter(p => p.game_type === "dino_hatch" && p.result === "hatched");
const hatchedSpecies = new Set(dinosHatched.map(p => p.dino_species));
const dinosFed = progress.filter(p => p.game_type === "food_rescue");
const fedSpecies = new Set(dinosFed.map(p => p.dino_species));
const homesSaved = progress.filter(p => p.game_type === "home_save" && p.result === "saved");
const savedSpecies = new Set(homesSaved.map(p => p.dino_species));
```

**With:**
```js
// Count unique dinos at each stage (using dino_index instead of species name)
const eggsCollected = new Set(progress.filter(p => p.course === 0 && p.result === "collected").map(p => p.dino_index)).size;
const hatchedSet = new Set(progress.filter(p => p.course === 1 && p.result === "hatched").map(p => p.dino_index));
const rescuedSet = new Set(progress.filter(p => p.course === 2 && p.result === "rescued").map(p => p.dino_index));
const savedSet = new Set(progress.filter(p => p.course === 3 && p.result === "saved").map(p => p.dino_index));
const unlockedSet = new Set(progress.filter(p => p.course === 4 && p.result === "unlocked").map(p => p.dino_index));
const escapedSet = new Set(progress.filter(p => p.course === 5 && p.result === "escaped").map(p => p.dino_index));
```

### 6c. Fix best scores to use max_score from data (lines 60–66)

**Replace:**
```js
const bestScores = {};
GAME_TYPES.forEach(g => {
  const games = progress.filter(p => p.game_type === g.key);
  if (games.length > 0) {
    bestScores[g.key] = Math.max(...games.map(p => p.score || 0));
  }
});
```

**With:**
```js
const bestScores = {};
GAME_TYPES.forEach(g => {
  const games = progress.filter(p => p.game_type === g.key);
  if (games.length > 0) {
    bestScores[g.key] = {
      score: Math.max(...games.map(p => p.score || 0)),
      maxScore: g.maxScore,
    };
  }
});
```

### 6d. Fix the score display (line 251)

**Replace:** `{score}/7`

**With:** `{bestScores[g.key].score}/{bestScores[g.key].maxScore}`

(And update the score variable reference on line 236 — `const bs = bestScores[g.key]; if (!bs) return null;` then use `bs.score` / `bs.maxScore`.)

### 6e. Fix dino collection grid (lines 175–179)

**Replace:**
```js
const isHatched = hatchedSpecies.has(name);
const isFed = fedSpecies.has(name);
const isSaved = savedSpecies.has(name);
const hasAny = isHatched || isFed || isSaved;
```

**With:**
```js
const isHatched = hatchedSet.has(i);
const isRescued = rescuedSet.has(i);
const isSaved = savedSet.has(i);
const isUnlocked = unlockedSet.has(i);
const isEscaped = escapedSet.has(i);
const hasAny = isHatched || isRescued || isSaved || isUnlocked || isEscaped;
```

### 6f. Fix dino progress icons (lines 210–213)

**Replace:**
```jsx
<span title={isZh ? "孵化" : "Hatched"} style={{ fontSize: 14, opacity: isHatched ? 1 : 0.2 }}>🐣</span>
<span title={isZh ? "餵食" : "Fed"} style={{ fontSize: 14, opacity: isFed ? 1 : 0.2 }}>🍖</span>
<span title={isZh ? "拯救" : "Saved"} style={{ fontSize: 14, opacity: isSaved ? 1 : 0.2 }}>🏠</span>
```

**With:**
```jsx
<span title={isZh ? "孵化" : "Hatched"} style={{ fontSize: 14, opacity: isHatched ? 1 : 0.2 }}>🐣</span>
<span title={isZh ? "餵食" : "Rescued"} style={{ fontSize: 14, opacity: isRescued ? 1 : 0.2 }}>🍖</span>
<span title={isZh ? "拯救" : "Saved"} style={{ fontSize: 14, opacity: isSaved ? 1 : 0.2 }}>🏠</span>
<span title={isZh ? "鑰匙" : "Key"} style={{ fontSize: 14, opacity: isUnlocked ? 1 : 0.2 }}>🔑</span>
<span title={isZh ? "逃脫" : "Escaped"} style={{ fontSize: 14, opacity: isEscaped ? 1 : 0.2 }}>🚪</span>
```

---

## Step 7: Gate AI Workshops Behind Login + Course Completion

**Where:** `Midterm.jsx` and `Final.jsx`

**The idea:** The workshop UI is always visible (anyone can read the instructions). But the AI check buttons are disabled unless the user is logged in AND has completed the required courses.

### Midterm (MA Workshop: Planning)

**Requires:** logged in + at least 1 dino with `result = 'saved'` in Course 3 (meaning they progressed through C0→C1→C2→C3).

Add near the top of the component:

```js
import { supabase } from "./supabaseClient";

// Inside the component:
const [aiUnlocked, setAiUnlocked] = useState(false);

useEffect(() => {
  if (!user) { setAiUnlocked(false); return; }
  const checkEligibility = async () => {
    const { data } = await supabase
      .from("progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("course", 3)
      .eq("result", "saved")
      .limit(1);
    setAiUnlocked(data && data.length > 0);
  };
  checkEligibility();
}, [user]);
```

Then on each AI check button, add `disabled={!aiUnlocked}` and show a message when locked:

```jsx
{!aiUnlocked && (
  <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
    {lang === "zh"
      ? "🔒 登入並完成課程 1–3 的遊戲即可解鎖 AI 回饋"
      : "🔒 Log in and complete Course 1–3 games to unlock AI feedback"}
  </div>
)}
```

### Final (MA Workshop: Analysis)

**Requires:** logged in + at least 1 dino with `result = 'escaped'` in Course 5 (full journey completed).

Same pattern, just change `course: 5` and `result: "escaped"` in the query.

---

## Step 8: Set Up 3-Month Auto-Cleanup

**Where:** Supabase Dashboard → SQL Editor (for the function), then Database → Extensions (for pg_cron)

**Why:** Automatically delete all progress data for users who haven't logged in for 3 months.

### 8a. Enable pg_cron extension

Go to Supabase Dashboard → Database → Extensions → search "pg_cron" → Enable it.

### 8b. Create the cleanup function and schedule it

```sql
-- Create the cleanup function
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS void AS $$
BEGIN
  -- Delete progress rows for users inactive > 3 months
  DELETE FROM progress
  WHERE user_id IN (
    SELECT id FROM profiles
    WHERE last_login_at < now() - interval '3 months'
  );

  -- Optionally delete the profile too (uncomment if you want full cleanup)
  -- DELETE FROM profiles
  -- WHERE last_login_at < now() - interval '3 months';
END;
$$ LANGUAGE plpgsql;

-- Schedule it to run once per day at 3 AM UTC
SELECT cron.schedule(
  'cleanup-inactive-users',
  '0 3 * * *',
  'SELECT cleanup_inactive_users()'
);
```

**What this does:** Every day at 3 AM UTC, it checks for users whose `last_login_at` is more than 3 months ago. It deletes their progress rows. Their profile row stays (it's tiny and harmless) — but you can uncomment the second DELETE if you want full cleanup.

---

## Step 9: Update BACKEND_UPGRADE_PLAN.md

The current `BACKEND_UPGRADE_PLAN.md` still shows the old schema (`egg_index`, `dino_species`, `result = 'fed'`). Update it to match the new schema from `SCHEMA_DISCUSSION.md` so the two documents don't contradict each other. Specifically:

- Replace the `progress` table definition with the new one (dino_index, max_score)
- Update the code snippets (save progress example) to use the new columns
- Add `key_quest` and `door_escape` to the game_type list
- Update the result values to match the schema discussion
- Add `last_login_at` to the profiles table definition
- Mark Phase 3 status as in-progress

---

## Recommended Order of Work

Here's the order I'd suggest for actually doing this:

1. **SQL first** (Steps 1 + 2) — fix the tables before writing any code
2. **App.jsx login tracking** (Step 3) — small change, do it right away
3. **One game at a time** (Step 4) — start with DinoEggHunt (simplest), test it locally with `vercel dev`, check Supabase Table Editor to see if rows appear. Then do DinoEggHatch, and so on.
4. **Dino gating** (Step 5) — wire this after at least C0 + C1 are saving, so you can test that C1 only shows eggs collected in C0
5. **ProfilePage** (Step 6) — fix once you have real data flowing in
6. **AI workshop gating** (Step 7) — can do anytime after Step 4
7. **pg_cron cleanup** (Step 8) — do last, it's a one-time setup
8. **Update docs** (Step 9) — keep the plan in sync

---

## How to Test Locally

1. Open terminal in your project folder
2. Run `vercel dev` (not `npm start`)
3. Open `http://localhost:3000`
4. Log in with Google
5. Play a game (e.g., Course 0 Egg Hunt)
6. Go to Supabase Dashboard → Table Editor → `progress`
7. You should see new rows with your user_id, course=0, result="collected"
8. If rows appear → it's working. If not → check browser console for errors.

---

## Open Design Decisions (Not Blocking — Decide Later)

These came up during the schema review. None of them block the wiring work above, but you should decide them eventually:

1. **C5 escape threshold:** Currently a player needs correct door + score ≥6 to get `escaped`. A player who picks the right door but scores 5/9 gets `trapped`. Is that what you want? (This only matters for gating — whether that dino is considered "done".)

2. **Tier column:** C4/C5 have tiers (master/explorer/apprentice/novice). Right now you're only saving binary results (unlocked/locked). If you want to show tier badges on ProfilePage later, you'd need to either add a `tier` TEXT column now, or re-derive tiers from score later. Adding it now is cheap: `ALTER TABLE progress ADD COLUMN tier TEXT;`

3. **Replay behavior:** When a user replays the same dino in the same course, a new row is inserted (accumulating history). The gating queries use `SELECT DISTINCT` so multiple rows don't cause problems. This means users can retry until they succeed, and their play history is preserved. Confirm this is what you want (vs. overwriting/keeping only the best result).
