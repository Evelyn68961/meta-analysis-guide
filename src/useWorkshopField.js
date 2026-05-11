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

/**
 * useWorkshopField — persists a single workshop input to Supabase
 * `workshop_state` (per user, workshop_key, field_key), with debounced
 * autosave and hydration on mount.
 *
 * Behaves like useState but the value is restored across reloads when
 * the user is signed in.
 *
 *   const [pico, setPico, { hydrated, status }] =
 *     useWorkshopField(user, "course1_pico", "inputs.p", "");
 *
 * status: "idle" | "saving" | "saved" | "error"
 */
export function useWorkshopField(user, workshopKey, fieldKey, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(!user);
  const [status, setStatus] = useState("idle");

  const valueRef = useRef(value);
  const timerRef = useRef(null);
  const dirtyRef = useRef(false);
  const mountedRef = useRef(true);
  const lastUserIdRef = useRef(user?.id ?? null);
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
    if (!user || !dirtyRef.current) return;
    dirtyRef.current = false;
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
      safeSetStatus(error ? "error" : "saved");
    } catch {
      safeSetStatus("error");
    }
  }, [user, workshopKey, fieldKey, safeSetStatus]);

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
      setValue(defaultValueRef.current);
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
          setValue(data.value);
        }
      } catch {}
      if (!cancelled) setHydrated(true);
    })();
    return () => { cancelled = true; };
  }, [user, workshopKey, fieldKey]);

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
 * resetWorkshop — wipes every persisted field for a workshop.
 * Caller is responsible for resetting local React state too.
 */
export async function resetWorkshop(user, workshopKey) {
  if (!user) return;
  await supabase
    .from("workshop_state")
    .delete()
    .eq("user_id", user.id)
    .eq("workshop_key", workshopKey);
}
