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

  valueRef.current = value;

  const writeNow = useCallback(async () => {
    if (!user || !dirtyRef.current) return;
    dirtyRef.current = false;
    setStatus("saving");
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
      setStatus(error ? "error" : "saved");
    } catch {
      setStatus("error");
    }
  }, [user, workshopKey, fieldKey]);

  // Hydrate once on mount / when user becomes available
  useEffect(() => {
    let cancelled = false;
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

  // Wrapped setter: marks dirty and schedules a debounced save
  const setAndSave = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      if (Object.is(resolved, prev)) return prev;
      dirtyRef.current = true;
      setStatus("saving");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { writeNow(); }, DEBOUNCE_MS);
      return resolved;
    });
  }, [writeNow]);

  // Flush on unmount
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    writeNow();
  }, [writeNow]);

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
