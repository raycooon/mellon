import type { Config } from "tailwindcss";

/**
 * Tailwind is configured to consume the semantic CSS custom properties defined
 * in `src/styles/globals.css`. Components should use these named utilities
 * (bg-surface, text-ink-muted, border-line, ...) rather than raw hex values,
 * so theming and contrast can be adjusted centrally.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "surface-subtle": "var(--surface-subtle)",
        "surface-hover": "var(--surface-hover)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        "accent-wash": "var(--accent-wash)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        "focus-ring": "var(--focus-ring)",
      },
      fontSize: {
        // Display 36/42, page title 30/36, section 20/26, card title 16/22,
        // body 14/21, supporting 12/17.
        display: ["36px", { lineHeight: "42px" }],
        "page-title": ["30px", { lineHeight: "36px" }],
        section: ["20px", { lineHeight: "26px" }],
        "card-title": ["16px", { lineHeight: "22px" }],
        body: ["14px", { lineHeight: "21px" }],
        supporting: ["12px", { lineHeight: "17px" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
      },
      borderRadius: {
        control: "8px",
        card: "12px",
        panel: "16px",
      },
      boxShadow: {
        floating: "0 8px 28px rgba(37, 36, 33, 0.10)",
      },
      maxWidth: {
        content: "1160px",
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      transitionDuration: {
        control: "150ms",
        panel: "240ms",
      },
    },
  },
  plugins: [],
};

export default config;
