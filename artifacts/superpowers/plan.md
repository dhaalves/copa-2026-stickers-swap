# Plan: Remove All Filter Code

This plan details the steps to completely remove the search filter element and its corresponding JavaScript controller logic and test scripts.

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [index.html](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/index.html)
- Remove the `<div class="grid-controls">` block (lines 90-97) containing the search input element.

### 2. [MODIFY] [js/app.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)
- Remove `stripAccents` helper function (lines 6-9).
- Remove `isMatch` helper function (lines 11-64).
- Remove DOM element mappings in `el` (lines 124-126): `searchInput`, `btnUnfoldAll`, `btnFoldAll`.
- Remove Global Unfold/Fold button listeners (lines 832-842).
- Remove the search filter logic input event listener (lines 844-899).

### 3. [DELETE] [test_search.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/test_search.js)
- Delete the file entirely as search is no longer a supported feature.

---

## 🔍 Verification Plan

### Automated Tests
- Run `node js/test_parser.js` to ensure the parser functionality is completely intact.

### Manual Verification
- Open the application.
- Verify that the search bar under "Marcar Figurinhas" is gone.
- Verify that clicking, incrementing, decrementing stickers, switching tabs, and matching functions still work without throwing any JavaScript console errors.
