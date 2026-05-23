import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

  it("does not persist to localStorage on initial render (no user override)", () => {
    renderHook(() => useTheme());
    expect(localStorage.getItem("miia.theme")).toBeNull();
  });

  it("follows OS prefers-color-scheme change when no user override", () => {
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];
    const mql = {
      matches: false,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
      removeEventListener: vi.fn(),
    };
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe("dark");

    act(() => {
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent));
    });
    expect(result.current[0]).toBe("light");

    window.matchMedia = original;
  });

  it("stops following OS once user has toggled", () => {
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];
    const mql = {
      matches: false,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
      removeEventListener: vi.fn(),
    };
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useTheme());
    act(() => result.current[1]());
    expect(result.current[0]).toBe("light");
    expect(localStorage.getItem("miia.theme")).toBe("light");

    act(() => {
      listeners.forEach((cb) => cb({ matches: false } as MediaQueryListEvent));
    });
    expect(result.current[0]).toBe("light");

    window.matchMedia = original;
  });
});
