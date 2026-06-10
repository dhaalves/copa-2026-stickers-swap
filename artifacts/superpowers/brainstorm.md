# Brainstorm: Unlimited Repeated Stickers and In-Cell Controls

## 🎯 Goal
Allow users to have an unlimited number of repeated stickers (removing the hard cap of +3) and introduce intuitive increment/decrement control regions directly inside the sticker cells.

## ⚙️ Constraints
- Keep sticker cells mobile-friendly (approx. 80px width).
- Hide the control regions when the sticker is not owned to prevent visual clutter.
- Maintain full compatibility with the existing parsing and URL compression format `SA26|1|owned_ranges|repeated_quantities` (which already natively supports repeated counts > 3).
- Must prevent button clicks from bubbling up to the main cell click handler to avoid toggling states accidentally.

## ⚠️ Risks & Considerations
- **Touch Target Sizes**: In a tight 5-column grid (approx. 80px cell width), putting two buttons at the bottom of the cell leaves less space for clicking the center to toggle ownership. We must position them at the bottom corners and style them distinctly.
- **Click Bubbling**: Tapping the `+` or `-` buttons must use `event.stopPropagation()` to prevent triggering the main cell's toggle-ownership handler.
- **Visual Clutter**: Showing controls on all 994 stickers would be visually overwhelming. We will only display controls on hover (desktop) or when the sticker is owned/repeated (mobile/desktop).

## ✅ Acceptance Criteria
1. Clicking the sticker cell main area toggles ownership (Missing <-> Owned).
2. Once owned, a controls area with `-` and `+` buttons appears at the bottom of the cell.
3. Clicking the `+` button increments the repeated count indefinitely (no limit like +3).
4. Clicking the `-` button decrements the repeated count. If the count reaches 0, the repeated badge disappears and the sticker returns to the plain "Owned" state.
5. Clicking the `-` button on an "Owned" sticker (repeated count is 0) marks the sticker as "Missing".
6. All existing unit tests and parser functionality continue to pass successfully.
