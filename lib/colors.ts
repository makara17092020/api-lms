// lib/colors.ts
export const colors = {
  primary: {
    teal: "#14B8A6",
    tealDark: "#0D9488", // for hover
  },
  accent: {
    violet: "#7C3AED",
    violetDark: "#6D28D9",
  },
  info: {
    blue: "#0EA5E9",
  },
  semantic: {
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  neutral: {
    // Light mode
    bg: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
    textHeading: "#0F172A",
    textBody: "#334155",
    textMuted: "#64748B",
  },
} as const;
