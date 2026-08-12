# Design QA — Portfolio late sections

## Reference and test state

- Reference: `F:\网站\design-reference-before.png` (user screenshot showing the broken state)
- Implementation: `http://localhost:3000/#strengths` and `http://localhost:3000/#contact`
- Browser viewport: 2048 × 1127
- Capture state: desktop, after 1.4–1.5 seconds of section entry animation

## Visual comparison

### Fourth screen — capabilities

- **Before:** heading broke into three colliding lines and sat behind the oversized background word.
- **After:** heading is a stable two-line composition at 92 px / 1.04 line-height, with a 1233 × 191 px measured box and clear separation from the cards.
- **Before:** floating navigation was trapped inside the hero stacking context and could be covered by later sections.
- **After:** the floating header is portalled directly under `body`, fixed at 16 px from the top, with z-index `2147483000`. Three point hit-tests across the bar all returned header descendants.
- **Animation:** 171 SplitText characters and 49 SplitText words are active in the section; the section is no longer excluded by `data-split-ignore`.

### Fifth screen — contact

- **Before:** the requested TextPressure treatment was absent or conflicted with a second SplitText pass.
- **After:** the heading is two independent responsive TextPressure lines: “一起把它” and “剪成现实”; there is no final punctuation.
- **Animation:** both lines enter through their own intersection reveal. Pointer testing changed character weight from 360 to 384–423 and changed horizontal scale/skew, confirming the pressure response is active.
- **Other text effects:** 159 SplitText characters and 56 SplitText words remain active for the supporting copy, CTA, and contact details. The TextPressure title alone is intentionally excluded from SplitText to prevent DOM conflicts.

## Runtime verification

- Production build: passed.
- Clean in-app browser tab: no console errors.
- Ballpit/WebGL now has a capability check and CSS fallback, preventing the previous renderer crash on unsupported contexts.

## Outcome

**PASS** — the navigation remains above all content, the fourth-screen heading no longer overlaps, and the fourth/fifth-screen text effects are active without competing DOM transforms.
