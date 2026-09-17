/**
 * Safe wrappers around Web Storage.
 *
 * `localStorage` is not guaranteed to exist or be usable: it throws on access
 * in some privacy modes, inside sandboxed iframes, and when the browser has
 * blocked site data. An exception in module scope or during render would take
 * the whole React tree down, so every access is guarded here.
 */

export const TOKEN_KEY = 'jsix_token';

const getStore = (): Storage | null => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
};

export const safeGetItem = (key: string): string | null => {
  try {
    return getStore()?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

export const safeSetItem = (key: string, value: string): void => {
  try {
    getStore()?.setItem(key, value);
  } catch {
    /* storage unavailable or quota exceeded — non-fatal */
  }
};

export const safeRemoveItem = (key: string): void => {
  try {
    getStore()?.removeItem(key);
  } catch {
    /* storage unavailable — non-fatal */
  }
};

export const readToken = (): string | null => {
  const token = safeGetItem(TOKEN_KEY);
  // Guard against literal "undefined"/"null" strings left by earlier writes.
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
};

export const writeToken = (token: string | null | undefined): void => {
  if (typeof token !== 'string' || !token) {
    safeRemoveItem(TOKEN_KEY);
    return;
  }
  safeSetItem(TOKEN_KEY, token);
};

export const clearToken = (): void => safeRemoveItem(TOKEN_KEY);

/** Parse JSON without throwing; returns `fallback` on any malformed input. */
export const safeJsonParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
};
