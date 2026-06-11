# Plan: Navigation Redesign & Top Share Icon

This plan details the steps to move the Import functionality to a dedicated tab, remove the modal structure, remove the card displaying the sharing code, and introduce a sharing icon button at the top right of the header.

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [style.css](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/style.css)

- Add styling for the header main row wrapper (`.header-main-row`) to align the brand details and the new share button side-by-side.
- Add styling for the top header sharing button (`.header-share-btn`), including hover scales, background states, and transition glow.
- Adjust font sizes or padding for `.tab-btn` if needed to ensure three tabs fit beautifully on very small screens.

### 2. [MODIFY] [index.html](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/index.html)

- Wrap the brand title and logo in a `.header-main-row` alongside a new `#btn-copy-my-code` button labeled with a share icon (`🔗`).
- Add the third tab button (`#tab-trigger-import`) to `#main-nav-tabs`.
- Remove the `.code-panel` card from `#section-my-album`.
- Add a hidden `#my-code-textarea` at the bottom of the body (or top) to serve as a hidden value holder.
- Add the `#section-import` section with the import instructions, textarea `#import-code-textarea`, and restore button `#btn-import-confirm`.
- Remove the old `<div class="modal-backdrop hidden" id="import-modal-backdrop">` markup.

### 3. [MODIFY] [js/app.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)

- Update `el` DOM cache references:
  - Add `tabImport` (`#tab-trigger-import`) and `btnImportConfirm` (`#btn-import-confirm`).
  - Remove deleted modal references (`importModalBackdrop`, `btnModalCancel`, `btnModalConfirm`, etc.).
- Update tab switching event listeners to support the new `section-import` tab.
- Update `#btn-copy-my-code` click handler to temporarily swap the inner HTML icon to `✅` and apply a green border/background glow instead of rewriting text.
- Implement the new `#btn-import-confirm` handler to validate input, trigger restoration, alert success, clear textarea, and switch to `Meu Álbum`.

---

## 🔍 Verification Plan

### Automated Tests
- Run `node js/test_parser.js` to verify parsing logic remains 100% correct.
- Run `node test_search.js` to ensure the search simulation functions properly.

### Manual Verification
- Open the application.
- Verify that three tabs are displayed in the nav bar: "Meu Álbum", "Comparar & Trocar", and "Importar Código" (or similar).
- Verify the header features the brand title and logo on the left, and a circular sharing button (`🔗`) on the right.
- Click the sharing button, verify it turns green with a `✅` icon, and copies the valid code to the clipboard.
- Go to the new "Importar" tab, paste the code, and click the confirmation button. Verify it shows a success alert and redirects to the "Meu Álbum" tab showing the restored stickers.
