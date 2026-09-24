"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";

// Runs `load(signal)` whenever `key` changes and tracks loading / data / error.
//
// Out-of-order responses can never win:
//  1. When the key changes, the previous request is aborted (AbortController).
//  2. Every result is saved together with the key it belongs to, and we only
//     treat it as current if that key is still the latest one.
export function useRequest(load, key) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const requestKey = `${key}#${reloadCount}`;

  // Always calls the newest `load` without re-running the effect for every render.
  const runLoad = useEffectEvent((signal) => load(signal));

  useEffect(() => {
    const controller = new AbortController();

    runLoad(controller.signal).then(
      (data) => setResult({ key: requestKey, data, error: null }),
      (error) => {
        if (controller.signal.aborted) return; // replaced by a newer request
        setResult((previous) => ({ key: requestKey, data: previous.data, error }));
      }
    );

    return () => controller.abort();
  }, [requestKey]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const isLoading = result.key !== requestKey;

  return {
    data: result.data,
    error: isLoading ? null : result.error,
    isLoading,
    reload,
  };
}
