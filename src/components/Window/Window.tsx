import React, { useCallback, useRef, useState } from "react";
import { type WindowInstance, TASKBAR_HEIGHT, useWindowManager } from "../../context/WindowManagerContext";
import { APPS } from "../../data/appRegistry";
import { AppIcon } from "../AppIcons";

interface WindowProps {
  window: WindowInstance;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    activeWindowId,
  } = useWindowManager();
  const desc = APPS[window.appId];
  const drag = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resize = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const isFocused = activeWindowId === window.id;
  const [closing, setClosing] = useState(false);
  const windowId = window.id;

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    globalThis.setTimeout(() => closeWindow(windowId), 140);
  }, [closing, closeWindow, windowId]);

  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (window.maximized) return;
      if (e.button !== 0) return;
      e.preventDefault();
      focusWindow(window.id);
      drag.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: window.x,
        origY: window.y,
      };
      const onMove = (ev: PointerEvent) => {
        if (!drag.current) return;
        moveWindow(
          window.id,
          drag.current.origX + (ev.clientX - drag.current.startX),
          drag.current.origY + (ev.clientY - drag.current.startY),
        );
      };
      const onUp = () => {
        drag.current = null;
        globalThis.removeEventListener("pointermove", onMove);
        globalThis.removeEventListener("pointerup", onUp);
      };
      globalThis.addEventListener("pointermove", onMove);
      globalThis.addEventListener("pointerup", onUp);
    },
    [window, focusWindow, moveWindow],
  );

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (window.maximized) return;
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      focusWindow(window.id);
      resize.current = {
        startX: e.clientX,
        startY: e.clientY,
        origW: window.width,
        origH: window.height,
      };
      const onMove = (ev: PointerEvent) => {
        if (!resize.current) return;
        resizeWindow(
          window.id,
          resize.current.origW + (ev.clientX - resize.current.startX),
          resize.current.origH + (ev.clientY - resize.current.startY),
        );
      };
      const onUp = () => {
        resize.current = null;
        globalThis.removeEventListener("pointermove", onMove);
        globalThis.removeEventListener("pointerup", onUp);
      };
      globalThis.addEventListener("pointermove", onMove);
      globalThis.addEventListener("pointerup", onUp);
    },
    [window, focusWindow, resizeWindow],
  );

  const style: React.CSSProperties = window.maximized
    ? {
        left: 0,
        top: 0,
        width: "100vw",
        height: globalThis.innerHeight ? globalThis.innerHeight - TASKBAR_HEIGHT : undefined,
      }
    : { left: window.x, top: window.y, width: window.width, height: window.height };

  const AppComponent = desc.component;

  return (
    <div
      role="dialog"
      aria-label={window.title}
      aria-modal="false"
      tabIndex={-1}
      className={`${
        closing ? "window-leave" : "window-enter"
      } pointer-events-auto absolute flex flex-col overflow-hidden border bg-os-surface ${
        window.maximized
          ? "transition-[left,top,width,height] duration-150 ease-out"
          : "shadow-[0_10px_40px_rgba(0,0,0,0.55)]"
      } ${
        isFocused
          ? "border-os-border2"
          : "border-os-border opacity-90"
      }`}
      style={{
        ...style,
        zIndex: window.zIndex,
        display: window.minimized ? "none" : "flex",
        pointerEvents: closing ? "none" : undefined,
      }}
      onPointerDown={() => {
        if (!isFocused) focusWindow(window.id);
      }}
    >
      {/* Title bar */}
      <div
        className={`no-select flex h-9 shrink-0 items-center gap-2 border-b px-2 ${
          isFocused ? "cursor-grab border-os-border2 bg-os-surface2" : "border-os-border bg-[#131826]"
        } active:cursor-grabbing`}
        style={{ touchAction: "none" }}
        onPointerDown={onTitlePointerDown}
        onDoubleClick={() => toggleMaximize(window.id)}
      >
        <span className="flex items-center gap-1.5">
          <AppIcon name={desc.icon} size={15} />
          <span className="truncate text-xs tracking-wide text-os-text">{window.title}</span>
        </span>
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Minimize"
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(window.id);
            }}
            className="flex h-6 w-7 items-center justify-center border border-os-border text-xs text-os-dim hover:bg-os-border hover:text-os-text"
          >
            &#95;
          </button>
          <button
            type="button"
            aria-label={window.maximized ? "Restore" : "Maximize"}
            title={window.maximized ? "Restore" : "Maximize"}
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize(window.id);
            }}
            className="flex h-6 w-7 items-center justify-center border border-os-border text-[0.6rem] text-os-dim hover:bg-os-border hover:text-os-text"
          >
            {window.maximized ? "\u2750" : "\u25A1"}
          </button>
          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              requestClose();
            }}
            className="flex h-6 w-7 items-center justify-center border border-os-border text-xs text-os-dim hover:bg-os-red hover:text-black"
          >
            &#10005;
          </button>
        </span>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto">
        <AppComponent />
      </div>

      {/* Resize handle */}
      {!window.maximized && (
        <div
          className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-se-resize"
          style={{ touchAction: "none" }}
          onPointerDown={onResizePointerDown}
          title="Resize"
          aria-hidden="true"
        />
      )}
    </div>
  );
};