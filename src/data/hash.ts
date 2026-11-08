import { APPS, type AppId } from "./appRegistry";

function parseAppHash(hash: string | undefined): AppId | null {
  const raw = hash?.replace(/^#\/?/, "").trim();
  if (!raw) return null;
  return (Object.keys(APPS) as AppId[]).find((id) => id === raw) ?? null;
}

// Captured once when the module loads, before any app auto-opens and changes
// the URL. Used to distinguish a real deep link from an auto-opened window.
const initialHash = globalThis.location?.hash;

/** Return the app id encoded in the current URL hash, if it is valid. */
export function getHashAppId(): AppId | null {
  return parseAppHash(globalThis.location?.hash);
}

export function hasAppHash(): boolean {
  return getHashAppId() !== null;
}

export function hasInitialAppHash(): boolean {
  return parseAppHash(initialHash) !== null;
}
