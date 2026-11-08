import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Short description shown when the boundary catches an error. */
  label?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Keeps one broken app from taking down the whole desktop. The boundary is
 * reset by giving it a new `key` (for example, the window/app id).
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[3manuelOS] app crashed", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        role="alert"
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-os-bg p-6 text-center font-mono"
      >
        <p className="text-[0.8rem] font-bold text-os-red">
          {this.props.label ?? "This app crashed."}
        </p>
        <p className="max-w-sm text-[0.65rem] leading-relaxed text-os-dim">
          The rest of the desktop is still running. Try again, or reload the
          page to restart the app.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="border border-os-border px-3 py-1.5 text-[0.62rem] text-os-text hover:border-os-accent hover:text-os-accent"
          >
            try again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="border border-os-accent bg-os-accent px-3 py-1.5 text-[0.62rem] text-black hover:opacity-90"
          >
            reload
          </button>
        </div>
      </div>
    );
  }
}
