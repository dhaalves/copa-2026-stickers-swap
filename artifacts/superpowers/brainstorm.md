# Brainstorm: Foldable Grid Advanced Navigation (Search, Default Fold, Group Controls)

## 🎯 Goal
Implement advanced navigation features for the scrollable sticker list:
1. Start all sections folded (collapsed) by default on load.
2. Add a visual search bar to filter country sections by name or code (matching sections display, non-matching hide; matching sections auto-expand).
3. Add global controls to "Expand All" (Expandir Tudo) and "Collapse All" (Recolher Tudo).
4. Add group-level controls on each group header (e.g. "Grupo A") to expand or collapse only the country cards within that group.

## ⚙️ Constraints
- Keep page speed and filter response instantaneous.
- Fit search inputs and buttons inside the existing `480px` mobile container frame cleanly without crowding.
- Maintain compatibility with dynamic progress updates when stickers inside collapsed/expanded cards are modified.

## ⚠️ Risks & Considerations
- **Layout shift**: Showing/hiding sections during filtering must be smooth.
- **Search Auto-Expand**: When filtering, matching sections should expand automatically so the user can immediately interact with the sticker cells. When search is cleared, we should restore a clean state (either keep current fold state or collapse everything). Let's collapse everything when the search is cleared to return to the clean default state!
- **Selector Bubbling**: Event listeners on the group divider header buttons must not conflict or cause issues. We should bind specific actions to the group unfold/fold buttons.

## ✅ Acceptance Criteria
1. On initial page load, all 50 country/sticker sections are collapsed (folded).
2. A search input is displayed at the top of the stickers panel. Typing a query (e.g. "BRA" or "Brasil" or "Grupo C") hides non-matching sections and displays matching ones.
3. Matching sections during search are automatically expanded (unfolded). Clearing search collapses everything back to the default state.
4. Two global buttons "Expandir Tudo" and "Recolher Tudo" are visible and function correctly.
5. Each group header divider displays inline small actions "Expandir" and "Recolher" that control only the country sections inside that specific group.
