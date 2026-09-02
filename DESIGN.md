# Provenance — Design System

## Aesthetic POV: the Evidence Dossier

The interface is built like a physical forensic case file, because that is what
the product actually is. Three devices carry the identity:

1. **The index rail.** A fixed spine down the page's left margin holding a
   vertical stamp, a ruler-graduated scroll spine that fills with the accent,
   section marks, and a mono percentage read-out. The page grid reserves its
   width so nothing ever slides beneath it. Below `lg` it is not rendered — the
   exhibit headers carry the same index marks inline.
2. **Exhibit bands.** Sections run edge to edge and alternate ground: paper →
   ink → paper → **accent** → paper. A band does not merely contain colour, it
   *is* that colour, and everything inside it re-reads its palette from the band.
3. **Rules, not boxes.** Data groups are separated by hairlines (`.ruled`) and
   space. A card is reserved for content that genuinely sits *above* the page.

Symmetry, centred heroes and three-equal-card feature rows are deliberately
absent. Content sits on an asymmetric 12-column grid: display type in the
reading column, ledes and metadata hanging in the outer one.

## Colour

### Tokens
Raw values live in `:root`, are re-declared per theme, and again per **field**;
`@theme inline` maps them onto Tailwind utilities (`bg-surface`, `text-ink-2`,
`border-rule`, `shadow-card`) so markup never reaches for a `var()` by hand.

- **Surfaces** — Light: canvas `#f7f5f1`, card `#ffffff`, recessed `#efece6`.
  Dark: canvas `#0b0a0c`, card `#131215`, recessed `#1a181c`.
- **Lines, three weights** — `--line` (hairline), `--rule` (the structural
  hairline that does the work a border-box used to), `--line-strong`.
- **Ink** — Light `#14110f` (warm near-black) at three emphasis levels.
- **Accent: Warm Vermilion** — `#e04b28` light, `#ea580c` dark, now with a
  tonal ramp so it can build structure instead of only underlining it:
  `--accent-wash` (9%), `--accent-veil` (16%), `--accent-edge` (32%),
  `--accent-hi`, and `--accent-deep` — the text-safe step that clears 4.5:1 on
  the wash, which the raw brand value does not.
- **Status (4.5:1 validated)** — Good `#18794e`/`#2b8a3e`, Warn
  `#a85900`/`#d97706`, Bad `#c92a2a`/`#e03131`.
- **Shadows are tinted warm**, never neutral black. A grey shadow on a warm
  ground is the tell of an unconsidered theme.

### Fields — colour as architecture
`[data-field="ink"]` and `[data-field="accent"]` re-declare *every* colour token
for their whole subtree. Because the app addresses colour only through tokens,
any component dropped into a field inverts itself with no variant prop, no
`dark:` duplication, and no per-component override. On a vermilion field the
accent role passes to white: "the emphatic colour" is a role, not a hue. Status
colours are re-tuned per field so contrast survives the inversion.

## Typography

Three self-hosted variable faces, served from `/public/fonts` rather than a font
CDN — a system whose promise is that the photograph never leaves the device
should not announce every page view to a third party, and it means the app
renders correctly with no network at all.

- **Display — Bricolage Grotesque.** Optical-size and width axes let display
  type be set condensed (`font-stretch: 82%`) and tightly tracked
  (`-0.035em`) while small headings stay open. Used by `.t-display`,
  `.t-headline`, `.t-title-1/2/3`.
- **Reading — Inter.** Better hinted at UI sizes than any display face.
  Used by `.t-body`, `.t-callout`, `.t-footnote`, `.t-caption`.
- **Evidence — JetBrains Mono.** Hashes, coordinates, timestamps, identifiers
  and every measured figure, where telling `0` from `O` is correctness, not
  preference. Exposed as `.t-num` (tabular) and `.t-mark` (the uppercase,
  wide-tracked stamp that labels exhibits, columns and rail positions).

Tracking is size-specific: negative and tight as type grows, near zero for body,
wide for the smallest mono labels. Everything sizes in `rem`.

## Layout primitives

- `.dossier` — the page grid, with named `page / full / content` column lines.
  A section opts into full width by carrying `.bleed`; `.bleed-inner` aligns its
  contents back onto the reading column. No viewport-unit arithmetic is
  involved, which is what keeps a band exactly as wide as the page regardless of
  scrollbar or reserved rail.
- `.ruled` / `.ruled-x` — hairline separation in place of card borders.
- `.numeral-ghost` — outlined display figures for margin indices and the footer
  wordmark.
- `.grid-paper` — graph-paper ground for recessed wells (the lab-notebook
  reference).
- `.grain` — fixed, `pointer-events-none` film grain; never on a scrolling layer.

## Motion

Powered by `motion/react`. House style is critically damped (`bounce: 0`);
overshoot is reserved for motion the user's own gesture put in flight.

- **Springs** — `springMove` (0.4s), `springSnappy` (0.3s), `springSheet`,
  `springArrive` (0.7s, section scale).
- **Easing** — `--ease-out-expo` `cubic-bezier(0.16,1,0.3,1)` is the house curve
  for CSS transitions; mirrored in `lib/motion.ts` so a Motion transition and a
  CSS transition on the same element cannot drift apart.
- **Arrival** — `Reveal` pairs travel with a resolving blur (a focus pull), and
  takes `mode="scroll"` below the fold so the page reveals as it is read.
- **Signatures** — the travelling nav thumb (`layoutId`), the morphing
  hamburger, the staggered mask reveal in the mobile overlay, magnetic primary
  buttons (motion values only — never `useState` on pointer move), the
  button-in-button arrow well, row wipes that bleed into the page margin, the
  scroll-driven rail, the kinetic ledger marquee, and the shared-element
  thumbnail that travels drop → scan → verdict.
- **Reduced motion** — travel, blur, marquee, drift and blink are all dropped;
  feedback survives, the vestibular part does not. `prefers-reduced-transparency`
  and `prefers-contrast: more` are also handled, including inside fields.

## Small screens

The dossier holds its shape on a phone, but four of its devices need explicit
handling. These are rules, not observations — breaking them reintroduces bugs
that were found by auditing real 320px and 390px viewports.

- **Cell grids use `.rule-quad` / `.rule-trio`, never `.ruled-x`.** `.ruled-x`
  draws its rules with `> * + *`, which cannot know which cell begins a new
  line: on a grid that changes column count it puts a vertical rule against the
  page gutter and leaves the row break unruled, while `first:pl-0` unindents
  only the very first cell so column one falls out of alignment on every row
  after the first. `.ruled-x` is correct only for a row that never wraps (the
  three department codes on the location card).
- **The index rail is desktop-only, and so are the scroll controls.** Below
  `lg` there is no margin for a rail; below `sm` the scroll panel lands on top
  of body copy and directly over the FAQ's own toggles, making them untappable.
  The exhibit headers carry the same index marks inline, and a phone scrolls by
  flick.
- **One thing owns the bottom edge.** The sticky action bar has it below `sm`;
  the contact trigger takes a `raised` prop so it clears the bar *only* on
  pages that have one, rather than moving the collision up the page everywhere
  else.
- **Controls that are wider than the column scroll, they do not wrap.** The
  ledger's status filters use `.scroll-strip` — a sideways scroller with its
  scrollbar hidden — so the page itself never gains horizontal scroll.

Two composition rules follow from the same audit: an `Exhibit` action drops to
its own row below `sm` (sharing the line leaves the rule a ten-pixel stub), and
the hero's calls to action go full-width and stacked rather than wrapping into
two capsules of different lengths. Section padding scales from 64px on a phone
to 160px on a desktop: macro-whitespace is a desktop luxury, and at 96px a
phone pays a quarter-screen at every one of the landing page's ten band
boundaries.

## Preserved by request

`components/ui/scroll-split-card.tsx` — the scroll-driven 3D split-and-flip deck
— is the user's own component and is kept as built. The redesign gives it an ink
field to sit on so the flip reads with real contrast.
