// ============================================================
// questionHelpers.js — Shared helper functions for question banks
// ============================================================
// Usage:
//   import { pickQuestions, pickBalanced } from './questionHelpers';
//   import { course1Questions } from './course1Questions';
//   const questions = pickBalanced(course1Questions, 7);
// ============================================================

// ── Pick N random questions from a pool ──
export function pickQuestions(pool, n) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
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

  // Final shuffle so categories aren't in order
  return picked.sort(() => Math.random() - 0.5);
}
