# Plan: Update Teams to Match Official draw (Final image)

This plan replaces play-off placeholder teams in our database with the actual countries shown in the second image.

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [parser.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/parser.js)
- **Change**: Replace TEAMS list to reflect:
  - Group A: MEX, RSA, KOR, CZE
  - Group B: CAN, BIH, QAT, SUI
  - Group C: BRA, MAR, HAI, SCO
  - Group D: USA, PAR, AUS, TUR
  - Group E: GER, CUW, CIV, ECU
  - Group F: NED, JPN, SWE, TUN
  - Group G: BEL, EGY, IRN, NZL
  - Group H: ESP, CPV, KSA, URU
  - Group I: FRA, SEN, IRQ, NOR
  - Group J: ARG, ALG, AUT, JOR
  - Group K: POR, COD, UZB, COL
  - Group L: ENG, CRO, GHA, PAN

### 2. [MODIFY] [test_parser.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/test_parser.js)
- **Change**: Align assertions with the updated team indexes.
  - Sticker 994 (index 47) -> PAN (Panama)
  - Sticker 55 (index 1) -> RSA (South Africa)
  - Sticker 35 (index 0) -> MEX (Mexico)

---

## 🔍 Verification Plan
- **Automated Tests**: Run `node js/test_parser.js` and `node js/check_user_input.js` to ensure the mapping boundaries and parsing works cleanly.
