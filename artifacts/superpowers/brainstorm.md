# Brainstorm: Copa 2026 Sticker Matching App

## 🎯 Goal
Develop a minimalist, modern, and professional mobile-first web application to match Copa 2026 sticker albums for trades.

## ⚙️ Constraints
- **Platform**: Client-side single page web application (HTML5, Javascript, Vanilla CSS).
- **Album**: Fixed album for Copa 2026 (994 stickers).
- **Core Matching Flow**: 100% client-side. Users generate shareable text codes or URLs with their album state and compare them locally without backend accounts.
- **Sticker Input UI**: A visually premium grid of numbers (1-994) divided into tabs/pages (e.g., 1-100, 101-200) that allows clicking to cycle states (Missing, Owned, Repeated with quantity). Plus, a raw text area to copy/paste the code.
- **Output/Sharing**: Clear lists of "You Give" and "You Receive", swap counters, and a button to copy a trade summary formatted for WhatsApp.
- **Code Format**: Parses/generates the format: `SA26|1|<owned_ranges>|<repeated_quantities>`.

## ⚠️ Risks
- **DOM Overhead**: Displaying 994 interactive elements can lag on mobile.
  - *Mitigation*: Divide stickers into tabbed chunks (e.g., 100 per tab) so only ~100 are rendered at any time, keeping rendering lightning-fast.
- **Parsing Errors**: Handling malformed strings pasted by users.
  - *Mitigation*: Implement a robust parser function with error handling and fallback behaviors.
- **Responsive Layout**: Making a dense information layout fit cleanly on small mobile screens.
  - *Mitigation*: Design with a mobile-first, vertical stacking layout, using collapsable details and clear badge indicators.

## ✅ Acceptance Criteria
1. Pasting a valid code string updates the app state instantly.
2. Clicking/tapping any sticker in the grid correctly updates state: Empty ➔ Owned ➔ Repeated (1x) ➔ Repeated (2x) ➔ Repeated (3x) ➔ Empty.
3. Comparative matching accurately shows matches:
   - "You Give" (User A repeated stickers that User B is missing).
   - "You Receive" (User B repeated stickers that User A is missing).
4. Matches can be copied to the clipboard with a single click formatted nicely for WhatsApp.
5. The UI has a dark-mode-first aesthetic with smooth animations, using no heavy external libraries.
