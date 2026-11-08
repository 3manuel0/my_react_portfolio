/**
 * localStorage/sessionStorage can throw in private modes, when storage is
 * disabled, or when the quota is full. These helpers keep the UI alive.
 */
export function getLocal(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function setLocal(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function removeLocal(key: string): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getSession(key: string): string | null {
  try {
    return globalThis.sessionStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function setSession(key: string, value: string): void {
  try {
    globalThis.sessionStorage?.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function removeSession(key: string): void {
  try {
    globalThis.sessionStorage?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getJSON<T>(key: string): T | null {
  const raw = getLocal(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setJSON(key: string, value: unknown): void {
  try {
    setLocal(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
