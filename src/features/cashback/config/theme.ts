/**
 * Centralized Theme & Styling Configuration Hub for the Cashback Module.
 * 
 * To change fonts, brand colors, money colors, background, borders, or text styles
 * for the ENTIRE cashback module, simply edit the values below or in `cashback.css`.
 */
export const CASHBACK_THEME_CONFIG = {
  /** Font Family Configuration (1 single font used across all cashback components) */
  fontFamily: "var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  /** Color System Configuration */
  colors: {
    /** Primary Brand Accent Color (Shopee Orange) */
    primary: '#ff5722',
    primaryHover: '#f4511e',
    primaryGlow: 'rgba(255, 87, 34, 0.15)',
    primaryBorder: 'rgba(255, 87, 34, 0.25)',

    /** Money & Paid Amount Color (Yellow/Amber) */
    moneyLight: '#f59e0b',
    moneyDark: '#fbbf24',

    /** Light Theme Palette */
    light: {
      bg: 'oklch(98.5% 0.005 30deg)',
      surface: 'oklch(100% 0 0deg)',
      border: 'oklch(92% 0.01 30deg)',
      text: 'oklch(20% 0.015 30deg)',
      heading: 'oklch(12% 0.02 30deg)',
      muted: 'oklch(48% 0.015 30deg)',
    },

    /** Dark Theme Palette */
    dark: {
      bg: 'oklch(15% 0.008 30deg)',
      surface: 'oklch(19% 0.012 30deg / 85%)',
      border: 'oklch(28% 0.015 30deg / 70%)',
      text: 'oklch(86% 0.008 30deg)',
      heading: 'oklch(95% 0.003 30deg)',
      muted: 'oklch(65% 0.008 30deg)',
    },
  },
} as const;
