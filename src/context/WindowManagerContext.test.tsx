import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OsSoundProvider } from "./OsSoundContext";
import { WindowManagerProvider, useWindowManager } from "./WindowManagerContext";

const Harness = () => {
  const { windows, openApp, closeWindow, toggleMaximize } = useWindowManager();
  return (
    <div>
      <span data-testid="count">{windows.length}</span>
      <span data-testid="maximized">
        {String(windows[0]?.maximized ?? false)}
      </span>
      <button type="button" onClick={() => openApp("about")}>
        open
      </button>
      <button
        type="button"
        onClick={() => windows[0] && toggleMaximize(windows[0].id)}
      >
        maximize
      </button>
      <button
        type="button"
        onClick={() => windows[0] && closeWindow(windows[0].id)}
      >
        close
      </button>
    </div>
  );
};

const renderManager = () =>
  render(
    <OsSoundProvider>
      <WindowManagerProvider>
        <Harness />
      </WindowManagerProvider>
    </OsSoundProvider>,
  );

describe("WindowManager", () => {
  it("opens an app once, focuses it, maximizes it, and closes it", () => {
    renderManager();
    expect(screen.getByTestId("count")).toHaveTextContent("0");

    fireEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: "maximize" }));
    expect(screen.getByTestId("maximized")).toHaveTextContent("true");

    fireEvent.click(screen.getByRole("button", { name: "close" }));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
});
