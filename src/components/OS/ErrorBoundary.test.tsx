import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

function Boom(): JSX.Element {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("keeps the rest of the UI alive and shows a fallback", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <div>
        <p>safe sibling</p>
        <ErrorBoundary label="Test app crashed.">
          <Boom />
        </ErrorBoundary>
      </div>,
    );

    expect(screen.getByText("safe sibling")).toBeInTheDocument();
    expect(screen.getByText("Test app crashed.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
