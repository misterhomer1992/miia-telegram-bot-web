import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Trans } from "./Trans";

describe("Trans", () => {
  it("renders plain text unchanged", () => {
    render(<Trans>{"Hello world"}</Trans>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders <em1> tokens as a blue-gradient emphasis span", () => {
    render(<Trans>{"Your AI <em1>co-pilot</em1>, ready."}</Trans>);
    const em = screen.getByText("co-pilot");
    expect(em.tagName).toBe("EM");
    expect(em).toHaveAttribute("data-variant", "blue");
  });

  it("renders <em2> tokens as an amber-gradient emphasis span", () => {
    render(<Trans>{"inside the chat <em2>you already use</em2>."}</Trans>);
    const em = screen.getByText("you already use");
    expect(em.tagName).toBe("EM");
    expect(em).toHaveAttribute("data-variant", "amber");
  });

  it("renders multiple tokens in order", () => {
    render(<Trans>{"a <em1>b</em1> c <em2>d</em2> e"}</Trans>);
    expect(screen.getByText("b")).toHaveAttribute("data-variant", "blue");
    expect(screen.getByText("d")).toHaveAttribute("data-variant", "amber");
  });

  it("renders <em3> tokens as a plain italic-serif emphasis span (no gradient)", () => {
    render(<Trans>{"<em3>Every</em3> capability."}</Trans>);
    const em = screen.getByText("Every");
    expect(em.tagName).toBe("EM");
    expect(em).toHaveAttribute("data-variant", "plain");
  });
});
