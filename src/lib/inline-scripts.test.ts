import { describe, expect, it } from "vitest";
import { themeScript, langRedirectScript } from "./inline-scripts";

describe("themeScript", () => {
  it("is a non-empty string", () => {
    expect(typeof themeScript).toBe("string");
    expect(themeScript.length).toBeGreaterThan(0);
  });

  it("contains the dataset assignment", () => {
    expect(themeScript).toContain("documentElement.dataset.theme");
  });

  it("references the storage key 'miia.theme'", () => {
    expect(themeScript).toContain("miia.theme");
  });
});

describe("langRedirectScript", () => {
  it("is a non-empty string", () => {
    expect(typeof langRedirectScript).toBe("string");
    expect(langRedirectScript.length).toBeGreaterThan(0);
  });

  it("only redirects from the root path", () => {
    expect(langRedirectScript).toContain('location.pathname===\"/\"');
  });

  it("uses location.replace to avoid polluting history", () => {
    expect(langRedirectScript).toContain("location.replace");
  });

  it("references the storage key 'miia.lang'", () => {
    expect(langRedirectScript).toContain("miia.lang");
  });
});
