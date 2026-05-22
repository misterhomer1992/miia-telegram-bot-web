import { describe, expect, it } from "vitest";

describe("toolchain smoke", () => {
  it("can run a passing test", () => {
    expect(1 + 1).toBe(2);
  });
});
