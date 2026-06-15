# Superpowers Brainstorm - Improving Header "FWC 2026" Presentation

## Goal
Improve the presentation of "FWC 2026" in the application header. The current `<h1 id="app-title">Stickers Swap <br /> FWC 2026</h1>` feels awkward due to the hard line break and lack of distinction for the tournament label.

## Constraints
- Must align properly with the rotating ball logo (`⚽`) and the action buttons.
- Must fit within the 480px max-width container, especially on narrow mobile viewports (down to 320px-360px).
- Must match the modern, dark, glassmorphism design system.

## Known context
- The application currently uses:
  - `--brand-gradient`: `linear-gradient(135deg, #10b981 0%, #06b6d4 100%)` (Emerald/Cyan)
  - `--accent-secondary`: `#eab308` (Amber Yellow / Gold)
  - `--font-display`: `'Outfit', sans-serif`
- Current HTML is:
  ```html
  <h1 id="app-title">Stickers Swap <br /> FWC 2026</h1>
  <p class="subtitle">Organize & Troque Figurinhas</p>
  ```

## Risks
- **Text Wrapping & Overflow**: On smaller screens, having a large title + a badge might push items to multiple lines or cause layout breakages if not styled responsively.
- **Visual Clutter**: Adding too many gradients or shapes near the rotating logo and the main title might distract from the core brand name.

## Options (2–4)
- **Option 1 (Gold/Amber Badge)**: Format "FWC 2026" as a stylized tournament badge (gold border, semi-transparent gold background) placed inline with "Stickers Swap", removing the `<br />`.
  - *HTML*: `<h1 id="app-title">Stickers Swap <span class="fwc-badge">FWC 2026</span></h1>`
- **Option 2 (Subtitle Alignment)**: Simplify the main title to "Stickers Swap" and move "FWC 2026" next to the subtitle, styled as a subtle text tag.
  - *HTML*:
    ```html
    <h1 id="app-title">Stickers Swap</h1>
    <div class="subtitle-row">
        <span class="fwc-badge-pill">FWC 2026</span>
        <span class="subtitle">Organize & Troque Figurinhas</span>
    </div>
    ```
- **Option 3 (Modern Neon Tag)**: Keep the break but style "FWC 2026" on the second line with a smaller font size, a clean tracking/letter-spacing, and a different color (e.g., gold or neon green) without a background badge.
  - *HTML*: `<h1 id="app-title">Stickers Swap <span class="tournament-label">FWC 2026</span></h1>`

## Recommendation
- **Option 1** is recommended. Placing a gold pill-shaped badge next to the gradient text makes the app look extremely premium, mimicking high-end sports apps.

## Acceptance criteria
1. The hard `<br />` is removed from the title.
2. "FWC 2026" is styled as a clean badge/tag with yellow/gold colors to represent the FIFA World Cup trophy/theme.
3. The layout is fully responsive and looks balanced on both mobile and desktop screens.
