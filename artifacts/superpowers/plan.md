# Plan: Remove Flag Emojis from UI Headers & Badges

This plan removes flag emojis from country headers and matching list badges to prevent Windows browsers (which lack native flag fonts) from rendering them as redundant two-letter country codes (e.g. `CZ CZE` or `MX MEX`).

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [app.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)
- **Change**: 
  - In `renderStickerGrid()`, remove the flag span from team header generation so it only renders the 3-letter code and name.
  - In `renderMatchResults()`, remove the flag emoji from the sticker badges.
  - In `shareTradeOnWhatsapp()`, remove the flag emoji from the compiled WhatsApp share text.

---

## 🔍 Verification Plan
- **Manual Verification**: Verify that team headers display cleanly as `CZE República Tcheca` (without the redundant `CZ` prefix) and match badges render as `CZE 35`.
