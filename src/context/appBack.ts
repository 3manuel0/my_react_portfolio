import { useEffect, useRef } from "react";
import type { AppId } from "../data/appRegistry";

type BackHandler = () => boolean;

const handlers = new Map<AppId, BackHandler>();

function registerAppBack(appId: AppId, handler: BackHandler) {
  handlers.set(appId, handler);
  return () => {
    if (handlers.get(appId) === handler) handlers.delete(appId);
  };
}

/**
 * Ask an app to consume a phone "back" press. Returns true when the app
 * handled it (for example, closing a project detail), false when the shell
 * should close the app instead.
 */
export function runAppBack(appId: AppId): boolean {
  return handlers.get(appId)?.() ?? false;
}

/** Register an internal back handler while a phone app is in a sub-view. */
export function useAppBack(
  appId: AppId,
  handler: BackHandler,
  enabled = true,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    return registerAppBack(appId, () => handlerRef.current());
  }, [appId, enabled]);
}
