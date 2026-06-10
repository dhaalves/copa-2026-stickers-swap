# Plan: Group Stickers by World Cup Group & Country

This plan implements grouping stickers by World Cup Groups (A-L) and individual Countries, displaying flag emojis and official 3-letter FIFA codes, and enhancing the match results with country indicators.

---

## 🛠️ Step 1: Update Data Mapping (parser.js)
- **Action**: Add a comprehensive team and group mapping database inside `parser.js`. Create a helper function `getStickerInfo(id)` that maps sticker numbers 1-994 to their respective Group, Country Name, 3-letter Code, and Flag.
- **Files**:
  - `[MODIFY]` `copa-2026-stickers/js/parser.js`
- **Verification**:
  - Run the node tests and assert that `getStickerInfo(1)` returns Intro/Stadiums and `getStickerInfo(35)` returns `USA` with Group A.

---

## 🎨 Step 2: Update UI Grid Component (app.js & style.css)
- **Action**: 
  - Update `app.js` range definition to be group-based (Intro, Grupo A to L).
  - Update the grid rendering logic: instead of rendering a flat 100 stickers, render sub-sections for each Country inside the selected Group. Each sub-section will have a header (e.g., `🇺🇸 USA - Estados Unidos`) and its 20 stickers.
  - Style the sub-sections and headers in `style.css` to look clean, polished, and mobile-friendly.
- **Files**:
  - `[MODIFY]` `copa-2026-stickers/js/app.js`
  - `[MODIFY]` `copa-2026-stickers/style.css`
- **Verification**:
  - Verify that selecting a group renders the correct teams and their respective sticker ranges.

---

## 🔄 Step 3: Enhance Match Display & WhatsApp Output
- **Action**:
  - Update match badge rendering in `app.js` to display the flag emoji and 3-letter code next to the sticker number (e.g., `🇺🇸 USA 35`).
  - Update WhatsApp message compiler to include flags or country codes so traders can easily read the list of swaps.
- **Files**:
  - `[MODIFY]` `copa-2026-stickers/js/app.js`
- **Verification**:
  - Perform matching with the test string and check that output list shows flag-embellished badges.

---

## 🧪 Step 4: Verification and Audit
- **Action**: Run the test suite and verify UI layout.
- **Verification**:
  - Check browser logs and run `node js/test_parser.js` to ensure no regressions.
