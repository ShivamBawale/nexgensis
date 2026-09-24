"use client";

import { useCallback, useRef, useState } from "react";

// Wraps an async action (login, save, delete) so it can only run once at a time.
//
// - A ref is used, not just state, because two very fast clicks can both run
//   before React re-renders the button as disabled.
// - After a success we stay locked, because the caller then navigates away or
//   closes the dialog; unlocking would allow a second request in between.
//   After a failure we unlock so the user can try again.
export function useSubmitGuard(action) {
  const runningRef = useRef(false);
  const [isRunning, setIsRunning] = useState(false);

  const run = useCallback(
    async (...args) => {
      if (runningRef.current) return;
      runningRef.current = true;
      setIsRunning(true);
      try {
        await action(...args);
      } catch (error) {
        runningRef.current = false;
        setIsRunning(false);
        throw error;
      }
    },
    [action]
  );

  return [run, isRunning];
}
