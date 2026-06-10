# Brainstorm: Unified Horizontal Controls and Chevron Icons

## 🎯 Goal
Replace the text buttons for global actions ("Expandir Tudo", "Recolher Tudo") and group actions with standard fold/unfold icon symbols (`▼` / `▲` for groups, `▼▼` / `▲▲` for global). Optimize the header area by moving the search bar and global fold/unfold buttons into a single horizontal row.

## ⚙️ Constraints
- Keep icon targets clickable and visually aligned.
- Avoid text clutter in the controls section to maximize vertical screen real estate.
- Match existing color transitions and styling properties.

## ⚠️ Risks & Considerations
- **Touch targets**: Placing the global buttons next to the search input in a row must preserve a 38px touch height/width, which fits comfortably on mobile screens without squishing the input.

## ✅ Acceptance Criteria
1. The search input and global fold/unfold buttons sit side-by-side in a single row (`.grid-controls` flex-direction: row).
2. Global fold/unfold buttons display `▼▼` (double down chevron) and `▲▲` (double up chevron) instead of text.
3. Group action buttons display `▼` (single down chevron) and `▲` (single up chevron) instead of `＋` and `－`.
