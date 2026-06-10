# Brainstorm: Fix Sticker Grid Layout Overflow

## 🎯 Goal
Fix the layout rendering bug where the team sections (Mexico, Italy, South Korea, Cameroon) are rendered side-by-side inside the main grid container, causing visual squishing and overflow.

## ⚙️ Constraints
- Keep parent container as a block/flex-column vertical list.
- Keep child team grids as 5-column grids.

## ✅ Acceptance Criteria
1. Each team section is rendered vertically one below another.
2. Stickers within each team section form a 5-column grid.
3. No horizontal overflow on the grid card.
