# Plan: Foldable Scrollable Sticker Grid

This plan removes the horizontal range selector tab buttons and displays all sticker sections (FWC, CC, and 48 countries) in a single continuous scrollable view. Each section will be collapsible/expandable by clicking its header.

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [index.html](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/index.html)
* **Change**:
  * Remove or comment out the `.range-selector` container (`#grid-range-selector`) to eliminate the tag pickers.
  * Adjust instructions text slightly to align with the current interaction style.

### 2. [MODIFY] [app.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)
* **Change**:
  * In `init()`:
    * Remove the call to `renderRangeSelector()`.
  * Remove the definition of `renderRangeSelector()`.
  * Refactor `renderStickerGrid()`:
    * Instead of conditionally rendering based on `state.currentGroup`, render FWC, CC, and all 48 country sections sequentially.
    * For country sections, insert a visual `.group-title-divider` whenever the team's group (e.g., "Grupo A", "Grupo B") changes.
    * Add custom `dataset.sectionId` attributes on `.team-section` elements.
    * Append `.chevron-icon` to the header layout.
    * Add click listeners to `.team-section-header` that toggles the `.collapsed` class on the parent `.team-section`.
  * Add helper `updateSectionProgress(code)` to query and dynamically update progress numbers (e.g., `MEX 12/20`) when stickers are modified.
  * Call `updateSectionProgress()` in `handleStickerClick()`, `handleIncrementClick()`, and `handleDecrementClick()`.

### 3. [MODIFY] [style.css](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/style.css)
* **Change**:
  * Hide or remove unused range selector styling.
  * Add cursor and hover styles to `.team-section-header`.
  * Add styles for `.group-title-divider` to separate Copa groups with a premium look (sticky headers, sleek text).
  * Add styles for `.chevron-icon` with rotation transition.
  * Implement `.team-section.collapsed .stickers-grid` display toggling (and rotate chevron).

---

## 🔍 Verification Plan

### Automated Tests
- Run `node js/test_parser.js` and `node js/check_user_input.js` to ensure the core parser is unaffected.

### Manual Verification
- Open the app. The range selector tags should be gone.
- Verify that FWC, CC, and all Groups A to L are rendered on the page.
- Click a team header (e.g., FWC or RSA). The grid below it should collapse, and the chevron should rotate. Click it again to expand.
- Toggle/edit sticker counts inside a section. Verify that both the section progress counter (e.g., `1/20`) and global completion counter in the header update immediately.
