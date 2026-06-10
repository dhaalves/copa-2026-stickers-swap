# Plan: Fix Sticker Grid Layout Overflow

This plan corrects the layout issue where team sections are squished horizontally instead of stacking vertically.

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [index.html](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/index.html)
- **Change**: Rename the class on `#stickers-grid-container` from `stickers-grid` to `stickers-container` to avoid applying the 5-column grid style directly to the parent team section container.

### 2. [MODIFY] [style.css](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/style.css)
- **Change**: Add styling for `.stickers-container` to stack team sections vertically:
  ```css
  .stickers-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
  }
  ```

---

## 🔍 Verification Plan
- **Manual Verification**: Verify that each team (e.g. Mexico, Italy, etc.) stacks vertically, taking up the full container width, and showing their 20 sticker cells in a clean grid beneath their header.
