/**
 * Thin, safe localStorage wrapper with JSON (de)serialization.
 * All reads are guarded so a corrupt value never crashes the app.
 */
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}
