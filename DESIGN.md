# Provenance (Design System)

## Brand Identity & Aesthetic POV
- **Aesthetic World**: Swiss Modernist / Editorial Precision. Clean, understated, academic, authoritative.
- **Palette**: Warm Editorial Charcoal (`#141416`), Warm Off-White Canvas (`#F8F7F4`), Pure White (`#FFFFFF`), with a single strong accent: **Warm Vermilion** (`#E04B28` light / `#EA580C` dark). Strictly no blue or generic tech gradients.
- **Iconography & Logo**: Monolithic flat vector mark (`BrandMark.tsx`). Negative-space provenance channel forming a "P" over an origin datum tile.

## Color Tokens & Semantics
- **Surfaces**:
  - Light Canvas: `#F8F7F4` | Light Card: `#FFFFFF` | Recessed Well: `rgba(20, 20, 22, 0.045)`
  - Dark Canvas: `#0D0D0F` | Dark Card: `#151518` | Recessed Well: `rgba(255, 255, 255, 0.045)`
- **Brand Accent**:
  - Light: `#E04B28` (Warm Vermilion) | Dark: `#EA580C` (Radiant Vermilion Ember)
- **Status Tokens (4.5:1 Contrast Validated)**:
  - Good / Verified: `#18794E` (Light) / `#2B8A3E` (Dark)
  - Warn / Suspicious: `#A85900` (Light) / `#D97706` (Dark)
  - Bad / Reused: `#C92A2A` (Light) / `#E03131` (Dark)

## Typography
- Font Family: `Inter` with platform system UI fallbacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- Monospace: `ui-monospace, Menlo, Monaco, Consolas, monospace` for SHA-256 hashes, timestamps, and GPS coordinates.
- Tracking: `-0.026em` on display headings, tight editorial kerning on `PROVENANCE` wordmark.

## Motion & Springs
- Powered by `motion/react`.
- Smooth spring physics (`springMove`, `springSnappy`) for fluid, interruptible feedback.
- Full support for `prefers-reduced-motion`.
