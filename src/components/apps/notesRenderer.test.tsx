import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoteBody } from "./notesRenderer";

describe("NoteBody", () => {
  it("renders headings, inline formatting, lists, links, and code fences", () => {
    const content = [
      "# A heading",
      "",
      "Hello **world** with `inline code` and [a link](https://example.com).",
      "",
      "- first",
      "- second",
      "",
      "```",
      "const x = 1;",
      "```",
    ].join("\n");

    render(<NoteBody content={content} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "A heading" }),
    ).toBeInTheDocument();
    expect(screen.getByText("world").tagName).toBe("STRONG");
    expect(screen.getByText("inline code").tagName).toBe("CODE");
    expect(screen.getByRole("link", { name: "a link" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByText("first").tagName).toBe("LI");
    expect(screen.getByText("second").tagName).toBe("LI");
    expect(screen.getByText("const x = 1;").tagName).toBe("PRE");
  });
});
