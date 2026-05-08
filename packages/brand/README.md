# @qkvtoken/brand

> Single source of truth for **QKV Token Corp** brand tokens — colors, typography, spacing.

Mirrors the design variables in [qkvtoken.com](https://qkvtoken.com)'s
stylesheet so any QKV-owned property (web, docs, internal tools) can stay
in lockstep without copy-pasting hex codes.

## Install

```bash
npm i @qkvtoken/brand
# or
pnpm add @qkvtoken/brand
```

## Usage

### JavaScript / TypeScript

```ts
import brand, { colors, fonts, spacing } from "@qkvtoken/brand";

console.log(colors.navy);          // "#0E2050"
console.log(colors.token);         // "#FFCD1A"
console.log(fonts.display);        // 'Space Grotesk', 'Inter', ...
console.log(spacing.l);            // clamp(6rem, 9vw + 1rem, 12rem)
console.log(brand.meta.tagline);   // "With intelligence we Token."
```

### CSS — drop-in tokens

```css
@import "@qkvtoken/brand/tokens.css";

.btn-primary {
  background: var(--qkv-color-token);
  color: var(--qkv-color-navy-deep);
  font-family: var(--qkv-font-display);
}

/* Inverted theme: navy bg, yellow type */
.dark-section {
  data-qkv-theme: inverted;
  /* Now --qkv-color-paper resolves to navy, --qkv-color-ink to yellow */
}
```

## Tokens at a glance

### Colors

| Token | Hex | Use |
|---|---|---|
| `navy` | `#0E2050` | Primary brand, buttons (light theme), dark sections |
| `navyDeep` | `#07153A` | Deeper navy for hover insets |
| `navySoft` | `#1C3380` | Tinted band, hover background on dark theme |
| `token` | `#FFCD1A` | 3800K bright Token Yellow — accents, focus rings |
| `tokenSoft` | `#FFE27A` | Soft yellow for hover, secondary type |
| `inkDark` | `#0C0C0C` | Light-theme body text |
| `paperLight` | `#FAFAF7` | Light-theme background |
| `paperTint` | `#F3F2EC` | Light-theme cards, hover |

### Typography

| Family | Token | Usage |
|---|---|---|
| Space Grotesk | `fonts.display` | Headlines, display, eyebrows |
| Newsreader | `fonts.serif` | Body, italic emphasis (e.g. *intelligence*) |
| JetBrains Mono | `fonts.mono` | Eyebrows, IDs, code |

### Spacing (fluid `clamp()`)

```
xs  →  clamp(1.5rem, 1.5vw + 1rem, 2.5rem)
s   →  clamp(2.5rem, 4vw + 1rem, 6rem)
m   →  clamp(4rem, 6vw + 1rem, 9rem)
l   →  clamp(6rem, 9vw + 1rem, 12rem)
```

## License

MIT © QKV Token Corp.

## Brand stewardship

This package is part of the QKV Token Corp internal platform monorepo at
[qkvtoken/platform](https://github.com/qkvtoken/platform). External
contributions are welcome via PR; please discuss brand-affecting changes
in an issue first.

For non-engineering brand questions: [inform@qkvtoken.com](mailto:inform@qkvtoken.com).
