# Plan: Copa 2026 Sticker Matching App

This plan sets up the project directory and implements the Copa 2026 Sticker Matching App, including the core matching algorithms, interactive grid interface, and WhatsApp sharing.

---

## 🛠️ Step 1: Project Initialization
- **Action**: Create the project subdirectory `copa-2026-stickers` under `scratch/`. Initialize git, and copy the `.agent` superpowers framework into it.
- **Files**: 
  - `[NEW]` `copa-2026-stickers/.gitignore`
  - `[NEW]` `copa-2026-stickers/artifacts/superpowers/` (copied)
- **Verification**: 
  - Run `git status` in the new folder.
  - Verify `.agent/` folder is present.

---

## 🧪 Step 2: Parser and Matching Logic with Tests
- **Action**: Create `parser.js` and `test_parser.js`. Implement a robust parser that parses `SA26|1|<owned_ranges>|<repeated_quantities>` and a matcher function that compares User A and User B to find:
  - Repeated stickers A has that B needs.
  - Repeated stickers B has that A needs.
  - Total trade counter.
- **Files**:
  - `[NEW]` `copa-2026-stickers/js/parser.js`
  - `[NEW]` `copa-2026-stickers/js/test_parser.js`
- **Verification**:
  - Run the tests using Node.js: `node js/test_parser.js` to assert core parsing and matching logic.

---

## 🧱 Step 3: Web App UI Skeleton
- **Action**: Create `index.html` with structure:
  - Header: Logo, stats, Import/Export text areas.
  - Grid Section: Tabs (1-100, 101-200, ... 901-994), Grid of stickers.
  - Matcher Panel: Paste field for User B (the partner), Match details box, Copy for WhatsApp button.
- **Files**:
  - `[NEW]` `copa-2026-stickers/index.html`
- **Verification**:
  - Open and verify HTML structure using basic inspection.

---

## 🎨 Step 4: Premium Dark-Mode-First CSS Styling
- **Action**: Create `style.css` with a modern dark mode design, rich emerald-green/yellow accents (World Cup vibes), glassmorphism (backdrop-filter), modern typography, custom tabs, interactive sticker cells, and responsive flex/grid layouts.
- **Files**:
  - `[NEW]` `copa-2026-stickers/style.css`
- **Verification**:
  - Verify stylesheet is linked correctly in `index.html`.

---

## ⚙️ Step 5: Application State and UI Controller
- **Action**: Create `app.js` to manage the local user's album state, render the selected page/tab of stickers dynamically, handle clicks to cycle sticker status (Missing ➔ Owned ➔ Repeated + count), update the textarea code, parse pasted codes, and trigger the matching comparison showing results and copying to WhatsApp.
- **Files**:
  - `[NEW]` `copa-2026-stickers/js/app.js`
- **Verification**:
  - Run local server if needed or open in browser to verify that clicking stickers cycles states, updates code, and correctly compares.

---

## 🔍 Verification & Review
- **Action**: Run a checklist on the UI to confirm responsiveness, smooth micro-animations, no errors in browser console, and verify the WhatsApp copy-paste text formatting works.
