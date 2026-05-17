// ============================================================
// questionHelpers.js — Shared helper functions for question banks
// ============================================================
// Usage:
//   import { pickQuestions, pickBalanced, pickByType } from './questionHelpers';
//   import { course4Questions } from './course4Questions';
//
//   // Old style (all MCQ):
//   const questions = pickBalanced(course4Questions, 7);
//
//   // New style (progressive difficulty):
//   const foundation = pickByType(course4Questions, "mcq", 3);
//   const advanced = pickAdvancedMix(course4Questions, 6);
// ============================================================

// ── Shuffle option order within a question and remap the correct index ──
// Prevents the "answer is always B" anti-pattern that lets students guess by position.
// Type-aware:
//   - mcq:          shuffle `opts` (zh+en) and remap `correct` (an index)
//   - multi_select: shuffle `opts` and remap `correctAll` (array of indices)
//   - spot_error:   shuffle `statements` (zh+en, kept in lockstep) and remap `correct`
//   - true_false, ordering: untouched (no positional-letter cheat to defeat)
// `correct === -1` (spot_error "no error in any option") is preserved as-is.
export function shuffleQuestionOptions(q) {
  const type = q.type || "mcq";
  if (type !== "mcq" && type !== "spot_error" && type !== "multi_select") return q;

  // spot_error uses `statements`; mcq/multi_select use `opts`.
  const field = type === "spot_error" ? "statements" : "opts";
  const len = (q.zh && q.zh[field] && q.zh[field].length) || (q.en && q.en[field] && q.en[field].length) || 0;
  if (len <= 1) return q;

  // perm[newPos] = oldIdx  (Fisher–Yates)
  const perm = Array.from({ length: len }, (_, i) => i);
  for (let i = perm.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const oldToNew = new Array(len);
  perm.forEach((oldIdx, newPos) => { oldToNew[oldIdx] = newPos; });
  const reorder = (arr) => perm.map(oldIdx => arr[oldIdx]);

  const out = { ...q };
  if (q.zh && q.zh[field]) out.zh = { ...q.zh, [field]: reorder(q.zh[field]) };
  if (q.en && q.en[field]) out.en = { ...q.en, [field]: reorder(q.en[field]) };

  if (type === "multi_select" && Array.isArray(q.correctAll)) {
    out.correctAll = q.correctAll.map(oldIdx => oldToNew[oldIdx]).sort((a, b) => a - b);
  } else if (typeof q.correct === "number" && q.correct >= 0 && q.correct < len) {
    out.correct = oldToNew[q.correct];
  }
  return out;
}

// ── Pick N random questions from a pool ──
export function pickQuestions(pool, n) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(shuffleQuestionOptions);
}

// ── Pick N questions with balanced category coverage ──
// Tries to pick evenly from each category, then fills remaining randomly
export function pickBalanced(pool, n, numCategories = 7) {
  const byCategory = {};
  pool.forEach(q => {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push(q);
  });

  // Shuffle within each category
  Object.values(byCategory).forEach(arr => arr.sort(() => Math.random() - 0.5));

  const picked = [];
  let round = 0;
  while (picked.length < n) {
    let addedThisRound = false;
    for (let cat = 0; cat < numCategories && picked.length < n; cat++) {
      if (byCategory[cat] && byCategory[cat][round]) {
        picked.push(byCategory[cat][round]);
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
    round++;
  }

  // Final shuffle so categories aren't in order, then per-question option shuffle
  return picked.sort(() => Math.random() - 0.5).map(shuffleQuestionOptions);
}

// ── Pick N questions of a specific type ──
export function pickByType(pool, type, n) {
  const filtered = pool.filter(q => (q.type || "mcq") === type);
  return pickBalanced(filtered, n);
}

// ── Pick N advanced (non-MCQ) questions with type variety ──
// Tries to balance across: true_false, multi_select, ordering, spot_error
export function pickAdvancedMix(pool, n) {
  const advPool = pool.filter(q => q.type && q.type !== "mcq");
  const byType = {};
  advPool.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });

  // Shuffle within each type
  Object.values(byType).forEach(arr => arr.sort(() => Math.random() - 0.5));

  // Target distribution for 6 questions: 2 true_false, 2 multi_select, 1 ordering, 1 spot_error
  const typeTargets = [
    ["true_false", 2],
    ["multi_select", 2],
    ["ordering", 1],
    ["spot_error", 1],
  ];

  const picked = [];
  for (const [type, count] of typeTargets) {
    const available = byType[type] || [];
    picked.push(...available.slice(0, count));
  }

  // Fill remaining if short
  const pickedIds = new Set(picked.map(q => q.id));
  const remaining = advPool.filter(q => !pickedIds.has(q.id));
  remaining.sort(() => Math.random() - 0.5);
  while (picked.length < n && remaining.length > 0) {
    picked.push(remaining.shift());
  }

  // Shuffle and return (with per-question option shuffle for mcq/spot_error/multi_select)
  return picked.slice(0, n).sort(() => Math.random() - 0.5).map(shuffleQuestionOptions);
}
