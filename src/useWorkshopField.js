import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const DEBOUNCE_MS = 800;
const pendingFlushers = new Set();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    pendingFlushers.forEach((flush) => {
      try { flush(); } catch {}
    });
  });
}

// ── localStorage fallback ──
// Keyed per-user so logged-in users don't collide, plus an "anon" namespace
// for signed-out usage. Stored as JSON; parse failures fall back to default.
const LS_PREFIX = "workshop:";

function lsKey(userId, workshopKey, fieldKey) {
  return `${LS_PREFIX}${userId || "anon"}:${workshopKey}:${fieldKey}`;
}

function lsRead(userId, workshopKey, fieldKey) {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(lsKey(userId, workshopKey, fieldKey));
    if (raw == null) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function lsWrite(userId, workshopKey, fieldKey, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(lsKey(userId, workshopKey, fieldKey), JSON.stringify(value));
  } catch {}
}

function lsDelete(userId, workshopKey, fieldKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(lsKey(userId, workshopKey, fieldKey));
  } catch {}
}

function lsDeleteWorkshop(userId, workshopKey) {
  if (typeof window === "undefined") return;
  try {
    const prefix = `${LS_PREFIX}${userId || "anon"}:${workshopKey}:`;
    const toRemove = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {}
}

/**
 * useWorkshopField — persists a single workshop input to Supabase
 * `workshop_state` (per user, workshop_key, field_key), with debounced
 * autosave, hydration on mount, and a localStorage fallback that
 * survives Supabase outages and works for signed-out users.
 *
 * Behaves like useState but the value is restored across reloads.
 *
 *   const [pico, setPico, { hydrated, status }] =
 *     useWorkshopField(user, "course1_pico", "inputs.p", "");
 *
 * status: "idle" | "saving" | "saved" | "error"
 *   - "saved" is set whenever localStorage write succeeds, even if the
 *     Supabase round-trip later fails — local data is never lost.
 *   - "error" means the cloud sync failed; the value is still in
 *     localStorage and will be retried on the next change.
 */
export function useWorkshopField(user, workshopKey, fieldKey, defaultValue) {
  const userId = user?.id ?? null;

  // Initialize from localStorage synchronously so the UI never flashes
  // the default value before hydration when offline / signed out.
  const [value, setValue] = useState(() => {
    const cached = lsRead(userId, workshopKey, fieldKey);
    return cached === undefined ? defaultValue : cached;
  });
  const [hydrated, setHydrated] = useState(!user);
  const [status, setStatus] = useState("idle");

  const valueRef = useRef(value);
  const timerRef = useRef(null);
  const dirtyRef = useRef(false);
  const mountedRef = useRef(true);
  const lastUserIdRef = useRef(userId);
  const defaultValueRef = useRef(defaultValue);

  valueRef.current = value;
  defaultValueRef.current = defaultValue;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const safeSetStatus = useCallback((s) => {
    if (mountedRef.current) setStatus(s);
  }, []);

  const writeNow = useCallback(async () => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    // Always write to localStorage first — instant, can't fail meaningfully.
    lsWrite(userId, workshopKey, fieldKey, valueRef.current);
    if (!user) {
      safeSetStatus("saved");
      return;
    }
    safeSetStatus("saving");
    try {
      const { error } = await supabase
        .from("workshop_state")
        .upsert(
          {
            user_id: user.id,
            workshop_key: workshopKey,
            field_key: fieldKey,
            value: valueRef.current,
          },
          { onConflict: "user_id,workshop_key,field_key" }
        );
      // localStorage already has the value, so even on Supabase error the
      // user's work is safe. Surface "error" so the UI can show a hint,
      // but a refresh will still restore from localStorage.
      safeSetStatus(error ? "error" : "saved");
    } catch {
      safeSetStatus("error");
    }
  }, [user, userId, workshopKey, fieldKey, safeSetStatus]);

  const writeNowRef = useRef(writeNow);
  writeNowRef.current = writeNow;

  // Hydrate on mount / when user changes. Reset value first on user-change
  // so the previous user's data never leaks into the new user's session.
  useEffect(() => {
    let cancelled = false;
    const newUserId = user?.id ?? null;
    if (lastUserIdRef.current !== newUserId) {
      lastUserIdRef.current = newUserId;
      dirtyRef.current = false;
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      // Restore from THIS user's localStorage namespace, not the previous user's.
      const cached = lsRead(newUserId, workshopKey, fieldKey);
      setValue(cached === undefined ? defaultValueRef.current : cached);
      setHydrated(false);
    }
    if (!user) {
      setHydrated(true);
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase
          .from("workshop_state")
          .select("value")
          .eq("user_id", user.id)
          .eq("workshop_key", workshopKey)
          .eq("field_key", fieldKey)
          .maybeSingle();
        if (!cancelled && !error && data && data.value !== undefined && data.value !== null) {
          // Cloud value is the source of truth when reachable.
          setValue(data.value);
          lsWrite(user.id, workshopKey, fieldKey, data.value);
        }
        // If Supabase returns nothing or errors, the localStorage value
        // (already set above on user-change) remains as the fallback.
      } catch {}
      if (!cancelled) setHydrated(true);
    })();
    return () => { cancelled = true; };
  }, [user, userId, workshopKey, fieldKey]);

  // Register beforeunload flusher
  useEffect(() => {
    pendingFlushers.add(writeNow);
    return () => { pendingFlushers.delete(writeNow); };
  }, [writeNow]);

  // Wrapped setter: marks dirty and schedules a debounced save.
  // Skip writes until hydration completes so the default value never
  // overwrites the persisted value mid-load.
  const setAndSave = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      if (Object.is(resolved, prev)) return prev;
      if (hydrated) {
        dirtyRef.current = true;
        safeSetStatus("saving");
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => { writeNowRef.current(); }, DEBOUNCE_MS);
      }
      return resolved;
    });
  }, [hydrated, safeSetStatus]);

  // Flush only on TRUE unmount, not on every writeNow identity change.
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    writeNowRef.current();
  }, []);

  return [value, setAndSave, { hydrated, status, flush: writeNow }];
}

/**
 * resetWorkshop — wipes every persisted field for a workshop, both in
 * Supabase (for the signed-in user) and in localStorage (for that user's
 * namespace, or "anon" if signed out).
 * Caller is responsible for resetting local React state too.
 */
export async function resetWorkshop(user, workshopKey) {
  lsDeleteWorkshop(user?.id ?? null, workshopKey);
  if (!user) return;
  await supabase
    .from("workshop_state")
    .delete()
    .eq("user_id", user.id)
    .eq("workshop_key", workshopKey);
}

// Exported for tests / advanced consumers that need to wipe a single field.
export function clearWorkshopFieldLocal(user, workshopKey, fieldKey) {
  lsDelete(user?.id ?? null, workshopKey, fieldKey);
}
