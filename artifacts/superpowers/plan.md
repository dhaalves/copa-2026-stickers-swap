# Plan: Split Intro Section into FWC and CC Sections

This plan implements the "FWC & CC" section, splitting the initial 34 stickers into a 20-sticker FWC section (numbered 00 to 19) and a 14-sticker CC section (numbered 1 to 14), with custom logo badges and progress trackers matching the user's image.

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [parser.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/parser.js)
- **Change**: Update `getStickerInfo(id)` to map:
  - Stickers 1 to 20: code `FWC`, group `FWC & CC`, name `FIFA World Cup`, relativeNumber `00` (for id 1) or `id - 1` (for ids 2-20).
  - Stickers 21 to 34: code `CC`, group `FWC & CC`, name `Coca-Cola`, relativeNumber `id - 20`.

### 2. [MODIFY] [app.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)
- **Change**:
  - Update group definitions: rename `Intro` to `FWC & CC`.
  - In `renderStickerGrid()`, if current group is `FWC & CC`, render two separate `.team-section` elements vertically:
    - FWC section: Orange badge icon `⭐`, text `FWC`, progress count (`owned_FWC / 20`).
    - CC section: Red badge icon `🥤`, text `CC`, progress count (`owned_CC / 14`).
  - For Country sections, append progress trackers (`owned_country / 20`) on the right side of the headers.

### 3. [MODIFY] [style.css](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/style.css)
- **Change**: Add CSS classes for the progress trackers (`.team-progress`), orange and red header icons (`.badge-icon`, `.badge-fwc`, `.badge-cc`), and justify layout inside headers.

### 4. [MODIFY] [test_parser.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/test_parser.js)
- **Change**: Align assertions for stickers 1, 20, 21, and 34 to match FWC/CC specifications.

---

## 🔍 Verification Plan
- **Automated Tests**: Run `node js/test_parser.js` and `node js/check_user_input.js`.
- **Manual Verification**: Check that selecting the FWC & CC tab displays two separate stacked cards: FWC (with Star and 20 stickers) and CC (with Cup/Soda and 14 stickers) and their respective progress counters.
