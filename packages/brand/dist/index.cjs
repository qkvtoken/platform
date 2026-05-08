"use strict";
/**
 * @qkvtoken/brand — single source of truth for QKV Token Corp brand tokens.
 * CommonJS build for legacy require() consumers.
 */

const colors = Object.freeze({
  navy: "#0E2050",
  navyDeep: "#07153A",
  navySoft: "#1C3380",
  token: "#FFCD1A",
  tokenSoft: "#FFE27A",
  inkDark: "#0C0C0C",
  paperLight: "#FAFAF7",
  paperTint: "#F3F2EC",
  rule: "rgba(12, 12, 12, 0.12)",
});

const themeInverted = Object.freeze({
  paper: colors.navy,
  paperTint: colors.navySoft,
  ink: colors.token,
  inkSoft: colors.tokenSoft,
  rule: "rgba(255, 205, 26, 0.18)",
});

const fonts = Object.freeze({
  display: '"Space Grotesk", "Inter", system-ui, sans-serif',
  serif: '"Newsreader", "Iowan Old Style", "Source Serif Pro", Georgia, serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
});

const spacing = Object.freeze({
  xs: "clamp(1.5rem, 1.5vw + 1rem, 2.5rem)",
  s: "clamp(2.5rem, 4vw + 1rem, 6rem)",
  m: "clamp(4rem, 6vw + 1rem, 9rem)",
  l: "clamp(6rem, 9vw + 1rem, 12rem)",
});

const meta = Object.freeze({
  name: "QKV Token Corp",
  tagline: "With intelligence we Token.",
  domain: "qkvtoken.com",
  email: "inform@qkvtoken.com",
});

const brand = Object.freeze({ colors, themeInverted, fonts, spacing, meta });

module.exports = brand;
module.exports.colors = colors;
module.exports.themeInverted = themeInverted;
module.exports.fonts = fonts;
module.exports.spacing = spacing;
module.exports.meta = meta;
module.exports.default = brand;
