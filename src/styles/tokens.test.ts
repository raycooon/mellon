import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseCssTokens, round2 } from "@/lib/contrast";

// Resolved from the project root so Vite's module transform cannot change it.
const css = readFileSync(join(process.cwd(), "src/styles/globals.css"), "utf8");
const tokens = parseCssTokens(css);

function ratio(a: string, b: string) {
  return round2(contrastRatio(tokens[a], tokens[b]));
}

describe("design token contrast (WCAG 2.2 AA)", () => {
  it("defines every semantic color token", () => {
    const expected = [
      "canvas",
      "surface",
      "surface-subtle",
      "surface-hover",
      "ink",
      "ink-muted",
      "ink-faint",
      "line",
      "line-strong",
      "accent",
      "accent-strong",
      "accent-wash",
      "success",
      "warning",
      "danger",
      "focus-ring",
    ];
    for (const name of expected) {
      expect(tokens[name], `missing token --${name}`).toBeTruthy();
    }
  });

  it("primary text meets AA on every text surface", () => {
    expect(ratio("ink", "canvas")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("ink", "surface")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("ink", "surface-subtle")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("ink", "accent-wash")).toBeGreaterThanOrEqual(4.5);
  });

  it("secondary and metadata text meet AA on canvas and surface", () => {
    expect(ratio("ink-muted", "canvas")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("ink-muted", "surface")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("ink-faint", "canvas")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("ink-faint", "surface")).toBeGreaterThanOrEqual(4.5);
  });

  it("interactive accent text meets AA", () => {
    expect(ratio("accent-strong", "surface")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("accent-strong", "canvas")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("accent-strong", "accent-wash")).toBeGreaterThanOrEqual(4.5);
  });

  it("the persimmon accent is a signal, not text-safe on white", () => {
    // Used for markers/borders/icons only; must still clear the 3:1 non-text bar.
    const accent = ratio("accent", "surface");
    expect(accent).toBeGreaterThanOrEqual(3);
  });

  it("status colors meet AA on surface", () => {
    expect(ratio("success", "surface")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("warning", "surface")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("danger", "surface")).toBeGreaterThanOrEqual(4.5);
  });

  it("focus ring is visible against surfaces", () => {
    expect(ratio("focus-ring", "surface")).toBeGreaterThanOrEqual(3);
    expect(ratio("focus-ring", "canvas")).toBeGreaterThanOrEqual(3);
  });
});
