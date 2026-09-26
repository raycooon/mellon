/**
 * WCAG 2.x relative luminance and contrast ratio helpers.
 * Used by tests to verify that the shipped design tokens meet the target
 * contrast levels, rather than trusting hand-written estimates.
 */

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, "");
  const expanded =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Not a hex color: ${hex}`);
  }
  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colors, from 1:1 to 21:1. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsAA(a: string, b: string): boolean {
  return contrastRatio(a, b) >= 4.5;
}

export function meetsAALarge(a: string, b: string): boolean {
  return contrastRatio(a, b) >= 3;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Parse the `--token: #hex;` declarations out of a CSS custom-property block. */
export function parseCssTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const pattern = /--([a-z-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css)) !== null) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
