# Plan: Unlimited Repeated Stickers & In-Cell Controls

This plan adds in-cell `+` and `-` controls to sticker cells when owned/repeated, allowing users to increment repeated sticker counts indefinitely and decrement them back to owned/missing states without a limit.

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [app.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)
* **Change**:
  * In `createStickerCell(i)`:
    * Wrap the relative number text in a `span` with class `.sticker-label`.
    * Create and append a `.cell-controls` container at the bottom of the cell.
    * Add `-` (`.btn-dec`) and `+` (`.btn-inc`) buttons inside `.cell-controls`.
    * Set click event listeners on the buttons, calling `stopPropagation()` to prevent triggering the cell's main click handler.
  * In `handleStickerClick(id, cellElement)`:
    * Simplify to only toggle between Owned and Missing. If it becomes Missing, clear all ownership and repeated states for that sticker ID.
  * Add helper functions:
    * `handleIncrementClick(id, cellElement)`: Increments the repeated quantity, marks as repeated, adds/updates the badge, and saves.
    * `handleDecrementClick(id, cellElement)`: Decrements the repeated quantity. If it reaches 0, it removes the badge and switches back to the plain "Owned" state. If decremented again from 0, it marks the sticker as "Missing".

### 2. [MODIFY] [style.css](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/style.css)
* **Change**:
  * Style `.cell-controls` to absolute position at the bottom of `.sticker-cell`.
  * Make `.cell-controls` visible only when the parent cell has the `.owned` or `.repeated` class.
  * Style `.control-btn` as small, readable buttons with hover and active states (using red tones for `-` and emerald/amber tones for `+` on hover).
  * Align the sticker label center-vertically slightly offset upwards to accommodate the bottom controls.

---

## 🔍 Verification Plan

### Automated Tests
- Run `node js/test_parser.js` to verify that existing parser and matcher functions behave correctly.
- Run `node js/check_user_input.js` to ensure the parser handles complex and large inputs.

### Manual Verification
- Launch the application and click a sticker to mark it as owned. Verify the `-` and `+` buttons appear.
- Click the `+` button multiple times. Verify that the repeated count increases beyond `+3` (e.g., `+4`, `+5`, `+6`).
- Click the `-` button to decrement the count. Check that the badge updates correctly.
- Click `-` when the badge is gone (quantity = 0) and verify that the sticker reverts to the "Missing" state.
- Click the main area of the cell to toggle its owned state directly.
