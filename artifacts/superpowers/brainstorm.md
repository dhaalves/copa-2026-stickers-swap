# Brainstorm: Group Stickers by World Cup Group & Country

## 🎯 Goal
Refactor the Copa 2026 Sticker Matching App UI to group stickers by official World Cup groups (Group A-L) and individual countries, displaying official 3-letter FIFA codes and country flags.

## ⚙️ Constraints
- **Format Compatibility**: Must parse and generate the exact same string format `SA26|1|<owned_ranges>|<repeated_quantities>` without breaking existing user codes.
- **Dynamic UI**: Layout must adjust cleanly to render sub-headers for each country and groups of 20 stickers.

## ⚠️ Risks
- **Data size**: Storing 48 teams info in client JS could grow file size slightly, but text objects are extremely lightweight (< 5KB), so performance is unaffected.
- **Index Errors**: Mapping sticker IDs (1 to 994) to 48 teams must be mathematically flawless.
  - *Stickers 1-34*: Intro/Stadiums
  - *Stickers 35-994*: 48 teams * 20 stickers each.

## ✅ Acceptance Criteria
1. Grid ranges tabs are replaced by Group tabs (Intro, Grupo A, ..., Grupo L).
2. Each country displays its flag emoji, 3-letter code, and name as a header (e.g. `🇺🇸 USA - Estados Unidos`).
3. Under each country, the grid shows its 20 stickers with absolute album numbers.
4. Matching results show the country flag and 3-letter code next to the sticker number (e.g., `🇺🇸 USA 35` or `35 (USA)`).
5. WhatsApp sharing copy includes flags/countries for ease of read.
