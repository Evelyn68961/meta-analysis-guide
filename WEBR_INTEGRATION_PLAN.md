# WebR Integration Plan — In-Browser R Execution for Final Workshop

> **Purpose:** Document the discussion, final decisions, and execution plan for adding in-browser R computation (via WebR + metafor) to the MA Workshop: Analysis (Final.jsx).
> **Date:** March 12, 2026
> **Last updated:** March 13, 2026 — Added Layer 2 advanced analysis design
> **Status:** Plan approved. Ready for proof-of-concept, then integration.

---

## Background & Motivation

The current Final.jsx (MA Workshop: Analysis) has a 5-step wizard:

1. **Effect Size & Model** — user picks effect type (OR/RR/RD/MD/SMD) and model (fixed/random)
2. **Prepare Data** — displays the extracted study data in a table; offers Copy Table, Download CSV, Copy R Code
3. **Run Analysis** — guides users to external tools (Onlinemeta Shiny app or copy-paste R code to RStudio)
4. **Interpret & Report** — user manually fills in interpretation questions
5. **Conclusions** — user writes conclusions; AI checks them (1 AI call)

**The problem:** Step 3 delegates computation entirely to external tools. Users must leave the platform, use a separate website or install R, then come back to interpret results. This creates friction and breaks the learning flow.

**The goal:** Add an option to run `metafor` R code directly in the browser using WebR, so users can see real forest plots, funnel plots, and statistical output without leaving the platform. Additionally, offer AI-guided advanced analyses (subgroup, meta-regression, sensitivity) that differentiate this platform from every other MA website.

**The differentiator:** Other MA websites run static, pre-defined analyses. MA101 uses AI to judge which advanced analyses are appropriate for the user's specific dataset, then assembles and executes the corresponding R code — all in-browser. The user experience feels conversational and custom; the code execution is safe and deterministic.

---

## Discussion Summary

### Options Evaluated

| Option | Description | Verdict |
|--------|-------------|---------|
| **A. WebR (browser)** | R compiled to WebAssembly, runs in browser | ✅ Selected |
| **B. Server-side R** | Docker container or cloud service running R | ❌ Too much infrastructure |
| **C. AI simulates output** | AI predicts what R would produce | ❌ Not real computation |
| **D. JavaScript computation** | Reimplement meta-analysis math in JS | ❌ Credibility concern — "you didn't use R" |

### Key Concerns Addressed

**Concern 1: "Can WebR run metafor comprehensively?"**
- `metafor` is a pure R package (no compiled C/Fortran of its own). Its dependencies (`Matrix`, `nlme`, `numDeriv`, `pbapply`) are standard packages available in WebR.
- Core functions needed for MA101 scope all work: `escalc()`, `rma()`, `forest()`, `funnel()`, `regtest()`, `trimfill()`, `leave1out()`, `confint()`
- Advanced features like `rma.glmm` (depends on `lme4`) may not work, but these are beyond MA101 scope
- **Verification needed:** Confirm `metafor` is in the WebR binary repo at https://repo.r-wasm.org before implementation

**Concern 2: "Can WebR produce forest plots?"**
- Yes. WebR supports `webr::canvas()` graphics device and Cairo-based bitmap output (`png()`)
- Using `captureR()`, plot image data is captured as ImageBitmap and drawn to HTML `<canvas>` elements
- Works in all modern browsers (OffscreenCanvas supported since Safari 16.4)

**Concern 3: "AI generates different code every time"**
- Solved by a **two-layer architecture:**
  - **Layer 1 (basic analysis):** `buildRCode()` in Final.jsx deterministically assembles R code from the user's wizard choices. No AI involved. Same inputs → same R code every time.
  - **Layer 2 (advanced analysis):** AI outputs a **structured JSON decision** (not R code). JavaScript validates the JSON and assembles R code from **pre-written static template blocks**. The R code is still deterministic for the same inputs — AI only decides *which* template to use and *which parameters* to fill in.
- AI never writes a single line of R code in either layer.

**Concern 4: "Will I be challenged at conferences for not using R?"**
- With WebR + metafor, the platform genuinely runs R in the browser
- The R code is visible to the user (full transparency)
- The forest plot is a real `metafor::forest()` output, not a JavaScript recreation

**Concern 5: "How is this different from other MA websites?"**
- Other MA websites: user inputs data → static code runs → fixed results
- MA101: basic analysis runs automatically → AI evaluates the results and user's data context → AI recommends which advanced analyses are appropriate and why → user selects from guided options → platform assembles and runs the corresponding R code → AI interprets the new results
- The AI-as-interface layer between user intent and R execution is the differentiator. No other MA teaching platform does this.

---

## Architecture: Two-Layer Design

### Layer 1 — Basic Analysis (deterministic, no AI)

```
User's wizard choices (Step 1) + extracted data (from Midterm)
    │
    ▼
buildRCode()  ← ALREADY EXISTS in Final.jsx
    │            Deterministic: same inputs = same R code
    │            No AI involved
    ▼
WebR executes R code in browser
    │  - captureR() returns: text output + plot images
    │  - Forest plot → HTML <canvas>
    │  - Funnel plot → HTML <canvas>
    │  - Numerical output → text panel
    ▼
User clicks "AI Interpret Results"
    │
    ▼
/api/ai-feedback  ← EXISTING Vercel proxy
    │  - Receives: R text output + PICO context
    │  - Returns: structured plain-language interpretation
    ▼
User sees: R code + forest plot + funnel plot + output + AI interpretation
```

### Layer 2 — Advanced Analysis (AI-guided, static templates)

```
Layer 1 R output (I², Q, k, tau², etc.) + PICO context + available moderators
    │
    ▼
User selects from GUIDED MENU of advanced analysis types
    │  - Leave-one-out sensitivity
    │  - Trim-and-fill
    │  - Egger's regression test
    │  - Influence diagnostics
    │  - Subgroup analysis (requires moderator column)
    │  - Meta-regression (requires moderator column)
    │
    ▼  (for subgroup / meta-regression)
User selects moderator variable from dropdown
    │  - Dropdown populated from moderator columns defined in Midterm
    │
    ▼
JavaScript assembles R code from STATIC TEMPLATE BLOCKS
    │  - Template selected by analysis type
    │  - Moderator variable name slotted in
    │  - No AI involved in code generation
    ▼
WebR executes the assembled R code
    │  - Returns: text output + additional plots
    ▼
AI interprets the new output
    │  - /api/ai-feedback with analysis-specific system prompt
    ▼
User sees: advanced analysis results + AI interpretation

FUTURE EXPANSION (v2):
    User types free-text question about their data
        │  e.g., "依照研究地區做次群組分析"
        ▼
    AI parses request → structured JSON
        │  e.g., { "analysis": "subgroup", "moderator": "region" }
        ▼
    Same pipeline as above (JS assembles → WebR runs → AI interprets)
```

### Layer 2 Static Template Blocks

These are pre-written R code snippets that build on the `res` object from Layer 1:

| Analysis | Template | Requires Moderator? |
|----------|----------|-------------------|
| Leave-one-out | `leave1out(res)` | No |
| Trim-and-fill | `tf <- trimfill(res); print(tf); funnel(tf)` | No |
| Egger's regression | `regtest(res)` | No |
| Influence diagnostics | `inf <- influence(res); print(inf); plot(inf)` | No |
| Subgroup analysis | `rma(yi, vi, data=dat, subset=({mod}=="{value}"), {method}, slab=dat$study)` per level, then combined forest | Yes (categorical) |
| Meta-regression | `rma(yi, vi, mods=~{mod}, data=dat, {method}, slab=dat$study)` | Yes (continuous or categorical) |

For subgroup analysis, JavaScript loops through unique values of the moderator and generates a separate `rma()` call per subgroup, plus a combined display.

For meta-regression, JavaScript slots the moderator column name into the `mods=~` formula.

---

## Moderator Columns — Midterm Modification

### Why this is needed

Subgroup analysis and meta-regression — the most clinically important advanced analyses — require moderator variables (study region, dosage, duration, risk of bias rating, etc.). The current Midterm data extraction only collects outcome data (events/totals or means/SDs). Without moderator columns, Layer 2 is limited to sensitivity/publication bias analyses only.

### What changes in Midterm

**Step 4 (Data Extraction)** gets an "Add Moderator" feature:

1. An "＋ Add Moderator Column" button appears below the extraction fields
2. User clicks it → enters a column name (e.g., "Region", "Dosage (mg)", "Study Duration (weeks)")
3. A new input field appears for each study under that moderator name
4. User fills in values per study (e.g., "Asia", "Europe" for region; "500", "250" for dosage)
5. Multiple moderator columns can be added
6. Moderator data is stored in each study object as `moderators: { region: "Asia", dosage: "500" }`

### Data flow

```
Midterm Step 4: user adds moderator columns
    │
    ▼
sessionStorage("ma_project_midterm") — study objects now include `moderators: {}`
    │
    ▼
Final.jsx reads project from sessionStorage
    │
    ▼
Layer 2 guided menu: dropdown populated from Object.keys(studies[0].moderators)
    │
    ▼
buildRCode() and Layer 2 templates: moderator data included in R data.frame
```

### Study object change

```javascript
// Before
{ id, citation, ..., tx: {}, ctrl: {}, rob: {} }

// After
{ id, citation, ..., tx: {}, ctrl: {}, rob: {}, moderators: {} }
//                                                 ↑ NEW
// Example:
// moderators: { region: "Asia", dosage: "500", duration: "12" }
```

### buildRCode() modification

When moderator columns exist, `buildRCode()` adds them to the R `data.frame`:

```r
dat <- data.frame(
  study = c("Wang 2020", "Chen 2021"),
  ai    = c(45, 52),
  n1i   = c(120, 100),
  ci    = c(30, 41),
  n2i   = c(115, 98),
  region = c("Asia", "Europe"),       # ← from moderators
  dosage = c(500, 250)                # ← from moderators
)
```

---

## What Changes vs. What Stays

| Component | Change |
|-----------|--------|
| `Midterm.jsx` Step 4 (Data Extraction) | **Modified** — add moderator column feature |
| `Midterm.jsx` `newStudy()` template | **Modified** — add `moderators: {}` |
| `Midterm.jsx` default demo data | **Modified** — add sample moderator data |
| `Final.jsx` Step 1 (Effect Size & Model) | No change |
| `Final.jsx` Step 2 (Prepare Data) | **Minor** — show moderator columns in data table |
| `Final.jsx` Step 3 (Run Analysis) | **Modified** — add WebR tab (Layer 1) + Advanced Analysis section (Layer 2) |
| `Final.jsx` Step 4 (Interpret & Report) | No change (but easier for user — they have real numbers now) |
| `Final.jsx` Step 5 (Conclusions + AI check) | No change |
| `buildRCode()` | **Modified** — include moderator columns in R data.frame when present |
| `WebRRunner.jsx` | **New** — standalone component for WebR execution |
| `/api/ai-feedback` endpoint | No change — reused for interpretation calls |
| `i18n.js` | No change — Final/Midterm use inline `T` objects |

---

## AI Call Count

| Checkpoint | Location | Status | Trigger |
|-----------|----------|--------|---------|
| PICO validation | Midterm Step 1 | Existing | User clicks AI check |
| Search strategy check | Midterm Step 2 | Existing | User clicks AI check |
| Layer 1 result interpretation | Final Step 3 (WebR tab) | **NEW** | User clicks "AI Interpret" |
| Layer 2 result interpretation | Final Step 3 (Advanced section) | **NEW** | User runs advanced analysis |
| Conclusion check | Final Step 5 | Existing | User clicks AI check |

Total: up to 5 AI calls across the entire platform (was 3). Layer 2 interpretation only triggers if the user actively uses advanced analysis. Most users will hit 4 calls. Still very lean on cost.

---

## Three Tabs in Step 3

The modified Step 3 offers three parallel paths:

1. **🧪 In-Browser Analysis (NEW)** — WebR runs metafor. Shows Layer 1 results (forest + funnel + stats + AI interpretation), then Layer 2 Advanced Analysis section below.
2. **🌐 Online Calculator (existing)** — Onlinemeta / MetaAnalysisOnline links with step-by-step guidance. For users who prefer a GUI.
3. **📟 R Code (existing)** — Copy-paste code for RStudio. For users learning standalone R.

All three tabs use the same deterministic R code from `buildRCode()`. Tab 1 executes it; Tab 3 displays it for copying. Layer 2 advanced analysis is only available in Tab 1 (WebR).

---

## Layer 2 Guided Menu UI

After Layer 1 results display in the WebR tab, an "Advanced Analysis" section appears:

```
┌─────────────────────────────────────────────────────┐
│  📊 Advanced Analysis / 進階分析                     │
│                                                     │
│  Select an analysis type:                           │
│                                                     │
│  ○ Leave-one-out sensitivity analysis               │
│  ○ Trim-and-fill (publication bias adjustment)      │
│  ○ Egger's regression test                          │
│  ○ Influence diagnostics                            │
│  ○ Subgroup analysis                                │
│      └─ By: [ Region        ▾ ]                     │
│  ○ Meta-regression                                  │
│      └─ Moderator: [ Dosage (mg) ▾ ]               │
│                                                     │
│  [ ▶ Run Advanced Analysis ]                        │
│                                                     │
│  ─────────────────────────────────────               │
│  (Results appear here after execution)              │
│  [ 🤖 AI Interpret Results ]                        │
└─────────────────────────────────────────────────────┘
```

- Subgroup and meta-regression options show a dropdown populated from the user's moderator columns (defined in Midterm Step 4)
- If no moderator columns exist, subgroup and meta-regression options are disabled with a note: "Add moderator columns in the Planning workshop to enable this analysis"
- The "Run" button assembles R code from the selected template block + moderator selection, then executes via WebR
- AI interpretation uses an analysis-specific system prompt

### Future expansion (v2)

Add a free-text input above the menu: "Ask a question about your data..." AI parses the request into the same structured format the menu produces. The backend pipeline stays identical — only the input method changes.

---

## Compatibility Check

### Does this conflict with existing systems?

| System | Conflict? | Notes |
|--------|-----------|-------|
| **Vercel deployment** | ✅ No conflict | WebR loads from CDN (`webr.r-wasm.org`), no server-side changes. New npm dependency (`webr`) is client-side only. |
| **`/api/ai-feedback` proxy** | ✅ No conflict | Reuses existing endpoint with new system prompts for interpretation. Same `{ system, userMessage }` interface. |
| **Supabase auth + progress** | ✅ No conflict | WebR integration is purely frontend. No new database tables needed. AI gating (WIRING_GUIDE Step 7) applies to the interpretation button the same way it applies to existing AI check buttons. |
| **`buildRCode()` function** | ⚠️ Small modification | Add moderator columns to the R data.frame when present. Existing behavior unchanged when no moderators exist. |
| **Session storage (`ma_project_midterm`)** | ⚠️ Small modification | Study objects gain `moderators: {}` field. Backward compatible — old saved projects without moderators work fine (empty object). |
| **Session storage (`ma_project_final`)** | ✅ No conflict | WebR results (plots, output text) are ephemeral display state — not saved to sessionStorage. |
| **Phase 3 Supabase wiring** | ✅ No conflict | WebR integration is independent of game progress tracking. Both can proceed in parallel or in any order. |
| **i18n pattern** | ✅ No conflict | Final.jsx and Midterm.jsx use their own inline `T` objects (not `i18n.js`). New bilingual strings go into the same `T` objects. |
| **Mobile responsiveness** | ⚠️ Minor concern | WebR loads ~20MB. On slow mobile connections, the loading experience needs careful handling (progress bar, timeout fallback). Canvas plots need responsive sizing. |
| **Vercel network/egress** | ✅ No conflict | WebR assets load from `webr.r-wasm.org` CDN, not through Vercel. No impact on Vercel bandwidth or serverless function limits. |

### Does this conflict with BACKEND_UPGRADE_PLAN?

No. The backend plan covers Supabase auth, progress tracking, game wiring, and AI gating. WebR is a purely client-side addition that doesn't touch the database schema, auth flow, or progress tracking system. The one intersection point — AI gating — works identically: the "AI Interpret" button in the WebR tab follows the same `disabled={!aiUnlocked}` pattern documented in WIRING_GUIDE Step 7.

### Does this conflict with the "computation belongs in specialized tools" principle?

This **fulfills** that principle rather than contradicting it. The earlier decision (documented in memory) was to delegate computation to external tools rather than reimplementing statistics in JavaScript. WebR runs the actual `metafor` R package — it IS the specialized tool, just running in-browser instead of requiring a separate application.

---

## Package Availability: ✅ Confirmed

**metafor has a WebAssembly (WASM) binary available.** Verified on March 12, 2026.

R-universe (https://wviechtb.r-universe.dev/metafor) lists `metafor_4.9-30.tgz(r-4.5-emscripten)` — the `emscripten` suffix confirms it is compiled for WebR. This is a pre-built binary that WebR can download and install at runtime.

### Two package sources available

| Source | URL | Status |
|--------|-----|--------|
| **R-universe** | `https://wviechtb.r-universe.dev` | ✅ Confirmed — WASM binary listed |
| **Official WebR repo** | `https://repo.r-wasm.org` | Very likely available (metafor is pure R with standard dependencies) |

In the implementation, both repos are specified as fallback:

```javascript
await webR.evalRVoid(`
  webr::install("metafor", repos = c(
    "https://repo.r-wasm.org",
    "https://wviechtb.r-universe.dev"
  ))
`);
```

### Manual verification (optional — do this yourself to see it work)

1. Open the WebR REPL: https://webr.r-wasm.org/latest/
2. Wait for R to load (takes 10-20 seconds)
3. Type and run the following commands one by one:

```r
webr::install("metafor")
library(metafor)
dat <- dat.bcg
res <- rma(ai=tpos, bi=tneg, ci=cpos, di=cneg, data=dat, measure="OR")
print(res)
forest(res)
```

4. If you see numerical output from `print(res)` and a forest plot appears in the plot panel → metafor works in WebR. This is the same code path our platform will use.

---

## Execution Plan

### Phase 0: Proof of Concept (do first)

**Goal:** Build a standalone component and confirm the full pipeline works in our React environment.

**Deliverable:** A standalone `WebRRunner.jsx` component that:
1. Initializes WebR on mount
2. Installs the `metafor` package
3. Accepts an R code string as prop
4. Executes via `captureR()`
5. Renders: forest plot canvas, funnel plot canvas, text output
6. Shows loading states and error handling

**Test with:** Hard-coded sample data (e.g., BCG vaccine dataset from metafor docs) to confirm:
- [ ] `metafor` installs successfully in WebR
- [ ] `escalc()` + `rma()` produce correct output
- [ ] `forest()` renders to canvas
- [ ] `funnel()` renders to canvas
- [ ] Total load time is acceptable (target: <30s on broadband, <60s on slower connections)
- [ ] Works in Chrome, Firefox, Safari

### Phase 1: Integrate Layer 1 into Final.jsx

**Modify Step 3** to add the WebR tab with basic analysis:

1. Add bilingual strings to `T` object (tab label, loading messages, button labels, error messages)
2. Add third tab option: `"webr"` alongside existing `"online"` and `"r"`
3. When WebR tab is selected:
   - Initialize WebR (if not already loaded — lazy init on first tab click)
   - Show loading progress bar while WebR engine + metafor downloads
   - Once ready, show "▶ Run Analysis" button
   - On click: execute `buildRCode(inc, bin, analysis.effectType, analysis.model)` via WebR
   - Display results: forest plot canvas, funnel plot canvas, R output text, collapsible R code
4. Add "🤖 AI Interpret Results" button below the output
5. Wire interpretation to `/api/ai-feedback` with a structured system prompt

**Files changed:**
- `Final.jsx` — add WebR tab logic, import WebRRunner
- `WebRRunner.jsx` — new standalone component (follows project convention of standalone game/interactive files)

**Files NOT changed:**
- `App.jsx` — no new routes
- `i18n.js` — Final uses inline T object
- `api/ai-feedback.js` — reused as-is
- All other course files — untouched

### Phase 1.5: Add Moderator Columns to Midterm

**Modify Step 4 (Data Extraction)** to support moderator variables:

1. Add bilingual strings to Midterm's `T` object
2. Add "＋ Add Moderator Column" button below extraction fields
3. Implement moderator column management (add column, name it, remove column)
4. Add moderator value input field per study per column
5. Store moderator data in study object: `moderators: { columnName: value }`
6. Update `newStudy()` template to include `moderators: {}`
7. Add sample moderator data to default demo studies

**Modify `buildRCode()` in Final.jsx** to include moderator columns in R data.frame when present.

**Files changed:**
- `Midterm.jsx` — Step 4 moderator UI, newStudy template, demo data
- `Final.jsx` — `buildRCode()` modification

### Phase 2: Build Layer 2 Advanced Analysis

**Add Advanced Analysis section** below Layer 1 results in WebR tab:

1. Build guided menu UI with radio buttons for analysis types
2. Wire subgroup/meta-regression dropdowns to moderator columns from Midterm data
3. Build static R template blocks for each analysis type
4. Add JSON validation between menu selection and code assembly
5. Execute assembled code via WebR
6. Add AI interpretation with analysis-specific system prompts
7. Add bilingual strings for all new UI elements

**Files changed:**
- `Final.jsx` — Layer 2 UI and logic within Step 3 WebR tab
- `WebRRunner.jsx` — may need to support multiple sequential executions

### Phase 3: Polish & Edge Cases

1. **Loading UX:** Progress indicator showing WebR download status (engine → packages → ready)
2. **Error recovery:** If WebR fails to load or R code errors, show clear message + fallback to Tab 2/3
3. **Mobile handling:** Responsive canvas sizing; consider showing a "Desktop recommended" note for WebR tab on mobile
4. **Pre-initialization:** Optionally start loading WebR when user enters Final wizard (not just when they click the tab), to reduce perceived wait time
5. **Plot download:** Add "Download Forest Plot" / "Download Funnel Plot" buttons (canvas → PNG)
6. **Disabled states:** Subgroup/meta-regression disabled with explanation when no moderator columns exist

### Phase 4: Documentation

- Update `PROJECT_PLAN.md` — add WebR + Layer 2 to Final workshop description, note new dependency and moderator feature
- Update `COURSE_DETAILS.md` — document the three-tab Step 3 structure and Layer 2 advanced analyses
- This file (`WEBR_INTEGRATION_PLAN.md`) serves as the design record

---

## AI Interpretation Prompt Design

### Layer 1: Basic Analysis Interpretation

The interpretation call sends the raw R console output (text, not images) to Claude via the existing `/api/ai-feedback` proxy.

#### System prompt:

```
[zh version]
你是統合分析方法學專家。根據以下 metafor 輸出結果，為臨床研究者提供結構化的解讀。
研究主題 — P: {pico.p} | I: {pico.i} | C: {pico.c} | O: {pico.o}
效果量類型：{effectType}　模型：{model}

請依序解讀：
1. 整體效果（方向、大小、顯著性）
2. 異質性（I²、Q 檢定、意義）
3. 個別研究貢獻（權重分布、是否有離群值）
4. 臨床意義（不僅是統計顯著性）

4-8 句繁體中文。不用 Markdown。

[en version]
You are a meta-analysis methodology expert. Interpret these metafor
results for a clinical researcher.
Study topic — P: {pico.p} | I: {pico.i} | C: {pico.c} | O: {pico.o}
Effect measure: {effectType} | Model: {model}

Structure your response as:
1. Overall effect (direction, magnitude, significance)
2. Heterogeneity (I², Q-test, implications)
3. Individual study contributions (weights, outliers)
4. Clinical significance (not just statistical)

4-8 sentences. No Markdown.
```

#### User message:

The raw text captured from `captureR()` — the full `print(res)` + key statistics output. This is deterministic (same data → same R output → consistent interpretation).

### Layer 2: Advanced Analysis Interpretation

Each analysis type gets a tailored system prompt. Examples:

#### Leave-one-out:

```
[zh] 你是統合分析專家。以下是逐一排除敏感性分析結果。請解讀：
1. 排除哪篇研究後效果量變化最大？
2. 整體結論是否穩健？
3. 是否有任何研究對結果有不成比例的影響？
3-5 句。不用 Markdown。

[en] You are a meta-analysis expert. These are leave-one-out sensitivity results. Interpret:
1. Which study's removal most changes the effect?
2. Is the overall conclusion robust?
3. Does any study have disproportionate influence?
3-5 sentences. No Markdown.
```

#### Subgroup analysis:

```
[zh] 你是統合分析專家。以下是依「{moderator}」分組的次群組分析結果。請解讀：
1. 各組效果量及方向
2. 組間差異是否有統計意義
3. 可能的臨床解釋
3-5 句。不用 Markdown。

[en] You are a meta-analysis expert. These are subgroup analysis results by "{moderator}". Interpret:
1. Effect size and direction per subgroup
2. Whether between-group differences are statistically significant
3. Possible clinical explanations
3-5 sentences. No Markdown.
```

#### Meta-regression:

```
[zh] 你是統合分析專家。以下是以「{moderator}」為調節變項的統合迴歸結果。請解讀：
1. 調節變項的係數及顯著性
2. 是否能解釋研究間異質性
3. 臨床意義
3-5 句。不用 Markdown。

[en] You are a meta-analysis expert. These are meta-regression results with "{moderator}" as moderator. Interpret:
1. Moderator coefficient and significance
2. Whether it explains between-study heterogeneity
3. Clinical significance
3-5 sentences. No Markdown.
```

---

## New Dependencies

| Package | Version | Purpose | Size impact |
|---------|---------|---------|-------------|
| `webr` | latest (npm) | WebR JavaScript API for loading and running R in browser | ~20MB runtime download (from CDN, not bundled) |

The `webr` npm package is a thin JS wrapper (~50KB). The heavy WebR engine (~20MB) loads at runtime from `https://webr.r-wasm.org/latest/` CDN. This does NOT increase the Vercel bundle size.

The `metafor` R package (~2MB) is downloaded at runtime from the WebR binary package repository when the user first uses the WebR tab.

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `metafor` not in WebR repo | Low (pure R package) | Blocks entire feature | Check repo first in Phase 0; fallback to R-universe |
| Slow load on poor connections | Medium | Bad UX | Progress bar; pre-init; "Desktop recommended" note |
| R code execution error (Layer 1) | Low (deterministic code) | User confusion | Try-catch with clear error message + fallback tabs |
| R code execution error (Layer 2) | Low-Medium | User confusion | Templates are pre-tested; try-catch with clear error + note to try a different analysis |
| Forest plot rendering issues | Low | Incomplete output | Test across browsers in Phase 0; fallback to text-only output |
| AI returns invalid JSON for Layer 2 | N/A (v1 uses guided menu) | N/A | v1 uses menu selection, not AI parsing. JSON validation added for future v2 free-text input. |
| Moderator data missing/incomplete | Medium | Layer 2 partially disabled | Disable subgroup/meta-regression with clear note; other analyses still work |
| Conference reviewers questioning WebR validity | Very low | Credibility concern | WebR runs real R (CRAN packages, real computation) — same results as desktop R |
| Cost of additional AI calls | Very low | Budget | ~$0.003–0.01 per call; max 5 calls total; gated behind login |

---

## Relationship to Other Planned Work

| Planned work | Dependency on WebR? | WebR dependency on it? |
|-------------|---------------------|----------------------|
| Phase 3 Supabase wiring (games) | None | None |
| ProfilePage fixes | None | None |
| AI workshop gating | None | WebR's "AI Interpret" button uses same gating pattern |
| `main` branch merge | WebR should be stable on `dev` before merging | None |
| Conference abstracts (EBHC/Cochrane/APMEC) | WebR + Layer 2 strengthens the demo and differentiator story | None |

**Recommended sequencing:**
1. **Phase 0** — WebR proof-of-concept (validate technology)
2. **Phase 1** — Layer 1 integration into Final.jsx (basic analysis in-browser)
3. **Phase 1.5** — Moderator columns in Midterm (prepare data flow for Layer 2)
4. **Phase 2** — Layer 2 advanced analysis (the differentiator)
5. **Phase 3** — Polish & edge cases
6. **Phase 4** — Documentation

Phase 1.5 (Midterm moderator columns) can run in parallel with Phase 1 since they modify different files. Phase 3 Supabase wiring is independent and can happen in any order.

---

## Key Design Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Mar 12 | WebR over server-side R | No infrastructure needed; runs in browser |
| Mar 12 | AI interprets but doesn't generate R code | Deterministic code, zero variability |
| Mar 12 | Three-tab design for Step 3 | Preserves all learning paths |
| Mar 13 | **Layer 2 advanced analysis added** | Differentiator vs other MA websites |
| Mar 13 | **Full analysis set (including subgroup + meta-regression)** | These are the analyses researchers care about most |
| Mar 13 | **Moderator columns added to Midterm** | Required for subgroup/meta-regression; easier to add now than retrofit |
| Mar 13 | **Guided menu for v1, free-text input for v2** | Safe launch; AI prompt designed for future expansion |
| Mar 13 | **AI decides which analysis, static templates execute** | Zero risk of broken R code; AI used where judgment matters |

---

*Document created: March 12, 2026*
*Last updated: March 13, 2026*
*Status: Plan approved with Layer 2 expansion. Next step: Phase 0 proof-of-concept.*
