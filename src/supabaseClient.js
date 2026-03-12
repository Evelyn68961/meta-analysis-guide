import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Save game progress with "keep best" logic.
 * - Success results always upsert (overwrite failures or same result with higher score).
 * - Failure results only insert if no row exists yet for that user+course+dino.
 */
const WIN_RESULTS = ["collected", "hatched", "rescued", "saved", "unlocked", "escaped"];

export const saveProgress = async (user, row) => {
  if (!user) return;
  const data = { user_id: user.id, ...row };
  const isWin = WIN_RESULTS.includes(row.result);

  if (isWin) {
    // Win: always upsert — overwrites any previous row (failure or lower score)
    await supabase.from("progress").upsert(data, { onConflict: "user_id,course,dino_index" });
  } else {
    // Loss: only insert if no row exists yet (don't overwrite a previous win)
    await supabase.from("progress").upsert(data, { onConflict: "user_id,course,dino_index", ignoreDuplicates: true });
  }
};