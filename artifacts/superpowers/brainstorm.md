# Brainstorm: Split Intro Section into FWC & CC

## 🎯 Goal
Refactor the "Intro" section into two distinct sections:
- **FWC (FIFA World Cup)**: 20 stickers (numbered `00`, then `1` to `19`). Corresponds to album sticker numbers 1-20.
- **CC (Coca-Cola)**: 14 stickers (numbered `1` to `14`). Corresponds to album sticker numbers 21-34.
Both sections should render under the "FWC & CC" tab in a stacked vertical card layout, matching the visual styles of the provided user screenshot.

## ⚙️ Constraints
- Preserve exact 994 sticker size.
- Maintain compatibility with `SA26|1|owned_ranges|repeated_quantities` string format.
- Display custom logo badges and live progress counters (`owned_count/total`) in headers.

## ✅ Acceptance Criteria
1. Tab "Intro" is renamed to "FWC & CC".
2. Sticker 1 returns FWC `00`.
3. Sticker 20 returns FWC `19`.
4. Sticker 21 returns CC `1`.
5. Sticker 34 returns CC `14`.
6. Custom Orange Star badge for FWC header, Red Soda/Cup badge for CC header.
7. Headers show progress counters (e.g. `2/20` and `2/14`).
