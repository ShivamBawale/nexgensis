// Keeps the logged-in session in localStorage and lets React subscribe to it
// with useSyncExternalStore (see context/AuthContext.js).

const SESSION_KEY = "nexgensis.session";
const SESSION_EVENT = "nexgensis:session-change";

function readRawSession() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function parseSession(raw) {
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    return session?.accessToken ? session : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return parseSession(readRawSession())?.accessToken ?? null;
}

export function saveSession({ accessToken, refreshToken, ...user }) {
  try {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ accessToken, refreshToken, user })
    );
  } catch {
    // Storage can be blocked (private mode); the user just won't stay logged in.
  }
  notifySessionChange();
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear.
  }
  notifySessionChange();
}

export function subscribeToSession(callback) {
  window.addEventListener(SESSION_EVENT, callback);
  // "storage" fires when another tab logs in or out.
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export const getSessionSnapshot = readRawSession;

// On the server we can't know the session yet, so we report "undefined" (= loading).
export function getServerSessionSnapshot() {
  return undefined;
}
