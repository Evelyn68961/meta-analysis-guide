# Notes Drawer & Workshop Persistence — Plan

Two related features to add to the courses:

1. **Per-course collapsible note-taking side tab** with autosave + email/download export.
2. **Real-time persistence for workshops** so users who pause mid-workshop don't lose their inputs, AI feedback, or analysis state.

---

## Feature 1 — Notes Drawer

### Goal
Logged-in users can take free-form notes per course, kept in sync across devices, and exportable to their email or as a downloadable file.

### UX

**Entry point.** A vertical 40px tab pinned to the right edge of every Course page (Course0–5), always visible and fixed to the viewport (does not move with scroll).

**Drawer.** Click the tab → drawer slides out from the right.
- Desktop: ~360px wide, page content stays put underneath.
- Mobile (< 640px): ~92vw with a semi-transparent backdrop.
- Drawer header: course title + close (×) button.
- Body: a single large `<textarea>` filling the drawer.
- Status line under textarea: `Saving…` → `Saved · just now` → `Saved · 2 min ago`.
- Action bar at bottom: `Download ▼` (.txt / .docx) and `Email me`.

**No save button.** All saves are automatic. ⌘/Ctrl+S triggers an immediate flush as a power-user shortcut.

### Layout safety — drawer must NOT disturb the page underneath

| Rule | Reason |
|---|---|
| Drawer + tab use `position: fixed` | Taken out of document flow — page never reflows when drawer toggles |
| Animate via `transform: translateX(...)`, never `width` | Compositor-only, no layout/reflow per frame |
| Mount the drawer via `ReactDOM.createPortal(..., document.body)` | Avoids inheriting `transform` from `FadeIn` ancestors in Course pages, which would break `position: fixed` |
| No `padding-right` on `<body>` when open | Would reflow page content |
| No `body { overflow: hidden }` on desktop | Scrollbar disappearing causes page-width jump |
| Mobile scroll-lock must compensate for scrollbar width via `padding-right` | Prevents 15px content jump when drawer opens |
| Tab is always `position: fixed`, never `absolute` | Prevents tab moving with page scroll |

### Storage

**Supabase table `course_notes`**
```sql
create table course_notes (
  user_id uuid references auth.users(id) on delete cascade,
  course_id int not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table course_notes enable row level security;

create policy "users read own notes" on course_notes
  for select using (auth.uid() = user_id);
create policy "users write own notes" on course_notes
  for insert with check (auth.uid() = user_id);
create policy "users update own notes" on course_notes
  for update using (auth.uid() = user_id);
```

One note per `(user_id, course_id)` pair. Simpler UX, simpler schema, matches how students actually take running notes per topic. Schema can extend with a `note_id` later if multi-note is ever needed.

### Autosave behavior

- **Debounce 800ms** after last keystroke, then upsert to Supabase.
- **Flush on drawer collapse** — write any pending debounced change immediately.
- **Flush on `beforeunload`** via `navigator.sendBeacon` so a tab close doesn't lose the last keystrokes.
- **Failure fallback**: write to `localStorage` keyed by `user.id + course_id`. Show a "⚠ saved locally — will sync when reconnected" badge. On next successful Supabase write, clear the local copy. Last-write-wins on reconcile (fine for personal notes).

### Not-logged-in users
- Drawer still works, writing only to `localStorage`.
- Banner: "Sign in to sync these notes across devices."
- On login, one-shot prompt: "Import N chars of unsynced notes from this device?"

### Export

All export is client-side — no backend needed for v1.

- **Download `.txt`** — `Blob` + `URL.createObjectURL`.
- **Download `.docx`** — reuse the existing `docx` dependency (pattern in [generateReport.js](../src/generateReport.js)).
- **Email** — `mailto:` link with subject + URL-encoded body. No backend, no deliverability risk, opens user's mail client. Caveat: ~2KB body limit in some clients.
- Filenames timestamped: `meta-analysis-course1-notes-2026-05-02.docx`.

If users later need long-form email or a permanent record, add a serverless `/api/email-notes` endpoint that calls Resend/SendGrid and pulls the recipient address server-side from Supabase auth (never trust the client to specify the recipient — that's an open relay).

### Reading notes later

Three access points:

1. **Drawer on the same course page** — rehydrated from Supabase on mount. Primary read path.
2. **Profile page** — new "My Notes" section listing each course with notes: preview (~150 chars), char count, last-edited timestamp, and `[Open] [Download] [Email]` actions per row. Clicking `Open` navigates to the course with the drawer pre-opened.
3. **Email / downloaded file** — the user's permanent personal artifact.

### Lifecycle table

| Stage | Where it lives | How it gets there |
|---|---|---|
| Drafting | React state | onChange |
| Persisted | Supabase `course_notes` | Debounced autosave (800ms) |
| Cross-device | Supabase | Auto-pulled on drawer mount when logged in |
| Offline backup | `localStorage` | Mirror of every save |
| Personal archive | User's email / Downloads | One-click export |

---

## Feature 2 — Workshop Real-Time Persistence

### Problem
Current workshops save only on completion:
- `AIPicoWorkshop` ([Course1.jsx:328](../src/Course1.jsx#L328)) keeps everything in local React state — refresh / pause loses all PICO inputs and AI feedback.
- WebRRunner advanced analysis fires `onAdvComplete` only after a successful run ([WebRRunner.jsx:1264](../src/WebRRunner.jsx#L1264)). There's no real "finish workshop" event, so progress between runs is lost.

### Goal
Every meaningful field (text input, scenario selection, AI feedback, completed-analysis history) is persisted as it happens. Pausing mid-workshop and returning later restores the full state.

### Storage

**Supabase table `workshop_state`** — generic key/value, one row per field:
```sql
create table workshop_state (
  user_id uuid references auth.users(id) on delete cascade,
  workshop_key text not null,    -- e.g. 'course1_pico', 'webr_advanced'
  field_key text not null,       -- e.g. 'inputs.p', 'advHistory'
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, workshop_key, field_key)
);

alter table workshop_state enable row level security;
-- same per-user RLS policies as course_notes
```

JSON value lets us store strings, arrays (`advHistory`), and small objects without schema changes.

### What gets saved per workshop

**`AIPicoWorkshop` (workshop_key: `course1_pico`)**
- `scenario` (A/B/C selection)
- `inputs.p`, `inputs.i`, `inputs.c`, `inputs.o`
- `feedback.p`, `feedback.i`, `feedback.c`, `feedback.o` — cache AI responses across sessions so users don't re-burn API calls
- `overallFeedback`

**WebRRunner advanced analysis (workshop_key: `webr_advanced`)**
- `advSelectedType`
- `advSelectedMod`
- `advRCode`
- `advOutput`
- `advHistory[]` — appended after each successful run, **not** at end of workshop

### Save behavior
- Debounce 600–1000ms per field.
- On mount, hydrate state from `workshop_state` before first render.
- Flush on `beforeunload`.
- Explicit "Reset workshop" button — never auto-clear. Users will lose work to a refresh and blame the app otherwise.

### Tradeoff (worth flagging)
Per-keystroke debounce = a Supabase write per field per pause. Fine for class-sized usage (hundreds of concurrent students). If this product ever runs at 10K concurrent, add a buffering layer (Redis / edge worker). Not a current concern.

---

## Implementation order

Workshop persistence first — it's a regression fix for an existing broken behavior. Notes drawer second — net-new feature.

1. **Supabase migration** — create `course_notes` and `workshop_state` tables + RLS policies. (User runs the SQL.)
2. **Workshop persistence**
   - Small `useWorkshopField(workshopKey, fieldKey, defaultValue)` hook that wraps `useState` + autosave + hydration.
   - Migrate `AIPicoWorkshop` field-by-field.
   - Migrate WebRRunner advanced state.
   - Add "Reset workshop" button to each.
3. **Notes drawer**
   - `<CourseNotes user={user} courseId={n} />` component, portal-mounted.
   - Autosave hook + `localStorage` fallback + offline-merge prompt on login.
   - Wire into Course0–5.
4. **Export**
   - `.txt` download, `.docx` download (reuse `docx` dep), `mailto:` email.
5. **Profile page "My Notes" section** — list view + per-row actions.

### Files expected to change
- `src/supabaseClient.js` — add note/workshop helpers.
- `src/CourseNotes.jsx` (new) — drawer component.
- `src/useWorkshopField.js` (new) — autosave hook for workshop state.
- `src/Course0.jsx` … `src/Course5.jsx` — mount `<CourseNotes>`.
- `src/Course1.jsx` — migrate `AIPicoWorkshop` to `useWorkshopField`.
- `src/WebRRunner.jsx` — migrate advanced-analysis state to `useWorkshopField`.
- `src/ProfilePage.jsx` — add "My Notes" section.
- `src/i18n.js` — translation keys for drawer UI / email subject.

### Open questions to resolve before coding
- Confirm the right edge of each course page (Course0–5) is genuinely empty in the rightmost 360px when drawer is open — verify per course before committing.
- Confirm `mailto:` is acceptable for v1, or whether we should plan the serverless email endpoint up front.
- Confirm note scope: one note per course (recommended) vs. allow multiple named notes per course.
