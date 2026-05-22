import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "dark";
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("reads initial theme from document.documentElement.dataset.theme", () => {
    document.documentElement.dataset.theme = "light";
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe("light");
  });

  it("toggling flips between dark and light", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe("dark");
    act(() => result.current[1]());
    expect(result.current[0]).toBe("light");
    act(() => result.current[1]());
    expect(result.current[0]).toBe("dark");
  });

  it("toggling writes data-theme attribute on documentElement", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current[1]());
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("toggling persists to localStorage under miia.theme", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current[1]());
    expect(localStorage.getItem("miia.theme")).toBe("light");
  });
});
