# WebR Integration Plan — In-Browser R Execution for Final Workshop

> **Purpose:** Document the discussion, final decisions, and execution plan for adding in-browser R computation (via WebR + metafor) to the MA Workshop: Analysis (Final.jsx).
> **Date:** March 12, 2026
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

**The goal:** Add an option to run `metafor` R code directly in the browser using WebR, so users can see real forest plots, funnel plots, and statistical output without leaving the platform. This also strengthens the platform's credibility for conference presentations — it actually runs R with the gold-standard meta-analysis package.

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
- Solved by **not using AI for code generation at all**
- The existing `buildRCode()` function in Final.jsx (line 380) already deterministically assembles R code from the user's wizard choices + extracted study data
- Same inputs → same R code every time, zero variability
- AI is only used for **interpreting results** after R executes

**Concern 4: "Will I be challenged at conferences for not using R?"**
- With WebR + metafor, the platform genuinely runs R in the browser
- The R code is visible to the user (full transparency)
- The forest plot is a real `metafor::forest()` output, not a JavaScript recreation

---

## Final Decision

### Architecture

```
User's wizard choices (Step 1) + extracted data (from Midterm)
    │
    ▼
buildRCode()  ← ALREADY EXISTS in Final.jsx line 380
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

### What Changes vs. What Stays

| Component | Change |
|-----------|--------|
| `Final.jsx` Step 1 (Effect Size & Model) | No change |
| `Final.jsx` Step 2 (Prepare Data) | No change |
| `Final.jsx` Step 3 (Run Analysis) | **Modified** — add WebR tab alongside existing Online and R Code tabs |
| `Final.jsx` Step 4 (Interpret & Report) | No change (but easier for user — they have real numbers now) |
| `Final.jsx` Step 5 (Conclusions + AI check) | No change |
| `buildRCode()` | No change — already produces the R code we need |
| `/api/ai-feedback` endpoint | No change — reused for interpretation call |
| `i18n.js` | No change — Final uses inline `T` object, not i18n.js |

### AI Call Count

| Checkpoint | Location | Status |
|-----------|----------|--------|
| PICO validation | Midterm Step 1 | Existing |
| Search strategy check | Midterm Step 2 | Existing |
| **Result interpretation** | **Final Step 3 (WebR tab)** | **NEW** |
| Conclusion check | Final Step 5 | Existing |

Total: 4 AI calls across the entire platform (was 3, adding 1). Still very lean on cost.

### Three Tabs in Step 3

The modified Step 3 offers three parallel paths:

1. **🧪 In-Browser Analysis (NEW)** — WebR runs metafor, shows forest plot + funnel plot + output + AI interpretation. One-click experience.
2. **🌐 Online Calculator (existing)** — Onlinemeta / MetaAnalysisOnline links with step-by-step guidance. For users who prefer a GUI.
3. **📟 R Code (existing)** — Copy-paste code for RStudio. For users learning standalone R.

All three tabs use the same deterministic R code from `buildRCode()`. Tab 1 executes it; Tab 3 displays it for copying.

---

## Compatibility Check

### Does this conflict with existing systems?

| System | Conflict? | Notes |
|--------|-----------|-------|
| **Vercel deployment** | ✅ No conflict | WebR loads from CDN (`webr.r-wasm.org`), no server-side changes. New npm dependency (`webr`) is client-side only. |
| **`/api/ai-feedback` proxy** | ✅ No conflict | Reuses existing endpoint with a new system prompt for interpretation. Same `{ system, userMessage }` interface. |
| **Supabase auth + progress** | ✅ No conflict | WebR integration is purely frontend. No new database tables needed. AI gating (WIRING_GUIDE Step 7) applies to the interpretation button the same way it applies to existing AI check buttons. |
| **`buildRCode()` function** | ✅ No conflict | Used as-is. The function already generates complete, runnable metafor R code from wizard state. WebR just executes what it already produces. |
| **Session storage (`ma_project_final`)** | ✅ No conflict | WebR results (plots, output text) are ephemeral display state — not saved to sessionStorage. The analysis state object (`effectType`, `model`, `rationale`, etc.) is unchanged. |
| **Phase 3 Supabase wiring** | ✅ No conflict | WebR integration is independent of game progress tracking. Both can proceed in parallel or in any order. |
| **i18n pattern** | ✅ No conflict | Final.jsx uses its own inline `T` object (not `i18n.js`). New bilingual strings for WebR UI go into the same `T` object following the established pattern. |
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

### Phase 1: Integrate into Final.jsx

**Modify Step 3** to add the WebR tab:

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

### Phase 2: Polish & Edge Cases

1. **Loading UX:** Progress indicator showing WebR download status (engine → packages → ready)
2. **Error recovery:** If WebR fails to load or R code errors, show clear message + fallback to Tab 2/3
3. **Mobile handling:** Responsive canvas sizing; consider showing a "Desktop recommended" note for WebR tab on mobile
4. **Pre-initialization:** Optionally start loading WebR when user enters Final wizard (not just when they click the tab), to reduce perceived wait time
5. **Plot download:** Add "Download Forest Plot" / "Download Funnel Plot" buttons (canvas → PNG)

### Phase 3: Documentation

- Update `PROJECT_PLAN.md` — add WebR to Final workshop description, note new dependency
- Update `COURSE_DETAILS.md` — document the three-tab Step 3 structure
- This file (`WEBR_INTEGRATION_PLAN.md`) serves as the design record

---

## AI Interpretation Prompt Design

The interpretation call sends the raw R console output (text, not images) to Claude via the existing `/api/ai-feedback` proxy.

### System prompt:

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

### User message:

The raw text captured from `captureR()` — the full `print(res)` + key statistics output. This is deterministic (same data → same R output → consistent interpretation).

---

## New Dependency

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
| R code execution error | Low (deterministic code) | User confusion | Try-catch with clear error message + fallback tabs |
| Forest plot rendering issues | Low | Incomplete output | Test across browsers in Phase 0; fallback to text-only output |
| Conference reviewers questioning WebR validity | Very low | Credibility concern | WebR runs real R (CRAN packages, real computation) — same results as desktop R |
| Cost of additional AI call | Very low | Budget | ~$0.003–0.01 per interpretation; gated behind login |

---

## Relationship to Other Planned Work

| Planned work | Dependency on WebR? | WebR dependency on it? |
|-------------|---------------------|----------------------|
| Phase 3 Supabase wiring (games) | None | None |
| ProfilePage fixes | None | None |
| AI workshop gating | None | WebR's "AI Interpret" button uses same gating pattern |
| `main` branch merge | WebR should be stable on `dev` before merging | None |
| Conference abstracts (EBHC/Cochrane/APMEC) | WebR strengthens the demo, but abstracts don't depend on it | None |

**Recommended sequencing:** WebR integration can proceed independently of Phase 3 Supabase wiring. Both are frontend work on `dev` branch and don't touch the same files (WebR modifies Final.jsx; Phase 3 modifies game components + ProfilePage). They can happen in parallel or in either order.

---

*Document created: March 12, 2026*
*Status: Plan approved. Next step: Phase 0 proof-of-concept.*
