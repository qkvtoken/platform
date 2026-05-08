/**
 * @qkvtoken/brand — single source of truth for QKV Token Corp brand tokens.
 *
 * Mirrors the design variables in qkvtoken.com's globals.css so any
 * QKV-owned property (web, docs, internal tools) can stay in lockstep.
 *
 * @example
 *   import brand, { colors, fonts } from "@qkvtoken/brand";
 *   element.style.color = colors.token;
 *   element.style.fontFamily = fonts.display;
 */

export interface Colors {
  /** Primary brand: QKV Navy */
  readonly navy: "#0E2050";
  /** Deeper navy used for buttons + dark insets */
  readonly navyDeep: "#07153A";
  /** Softer navy used for tinted bands + card hovers */
  readonly navySoft: "#1C3380";
  /** Accent: 3800K bright Token Yellow */
  readonly token: "#FFCD1A";
  /** Soft yellow for hover accents + secondary type on dark theme */
  readonly tokenSoft: "#FFE27A";
  /** Near-black ink used in light-theme contexts */
  readonly inkDark: "#0C0C0C";
  /** Off-white paper background for light-theme contexts */
  readonly paperLight: "#FAFAF7";
  /** Tinted paper used for cards + bands in light theme */
  readonly paperTint: "#F3F2EC";
  /** Hairline rule color for light theme */
  readonly rule: "rgba(12, 12, 12, 0.12)";
}

export interface ThemeInverted {
  /** Page background = navy */
  readonly paper: Colors["navy"];
  /** Card / hover band = soft navy */
  readonly paperTint: Colors["navySoft"];
  /** Body type = bright Token Yellow */
  readonly ink: Colors["token"];
  /** Secondary type = soft yellow */
  readonly inkSoft: Colors["tokenSoft"];
  /** Hairline rule color for inverted theme */
  readonly rule: "rgba(255, 205, 26, 0.18)";
}

export interface Fonts {
  /** Display sans for headings — Space Grotesk */
  readonly display: string;
  /** Editorial serif for body + display italics — Newsreader */
  readonly serif: string;
  /** Monospace for eyebrows, IDs, code — JetBrains Mono */
  readonly mono: string;
}

export interface Spacing {
  readonly xs: string;
  readonly s: string;
  readonly m: string;
  readonly l: string;
}

export interface Meta {
  readonly name: "QKV Token Corp";
  readonly tagline: "With intelligence we Token.";
  readonly domain: "qkvtoken.com";
  readonly email: "inform@qkvtoken.com";
}

export interface Brand {
  readonly colors: Colors;
  readonly themeInverted: ThemeInverted;
  readonly fonts: Fonts;
  readonly spacing: Spacing;
  readonly meta: Meta;
}

export const colors: Colors;
export const themeInverted: ThemeInverted;
export const fonts: Fonts;
export const spacing: Spacing;
export const meta: Meta;

declare const brand: Brand;
export default brand;
