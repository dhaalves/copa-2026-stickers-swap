# Brainstorming: Navigation Redesign & Header Share Icon

Redesigning the app's sharing and import interface to make it more intuitive and cleaner.

## Goal
- Move the Import features out of modals/buttons and into a dedicated tab alongside "Meu Álbum" and "Comparar & Trocar".
- Remove the card "Meu Código de Compartilhamento" from the "Meu Álbum" tab.
- Place a single share icon button in the header at the top right of the page to copy the sharing code to clipboard.

## Constraints & Requirements
- Mobile-first: UI must look premium on mobile screens, and not crowd the header.
- Maintain existing codebase functions (loading, parsing, saving) without breaking existing tests.
- Circular icon design for the top header share button. It should fit the styling palette perfectly.
- Clean up any unused elements (like the modal backdrop) to avoid DOM bloating.

## Design Options for Top Share Icon
1. **Plain Button next to Title**: A subtle icon button at the end of the brand title row.
2. **Glowing Round Button**: A styled circular button `🔗` that glows emerald on hover and updates to `✅` temporarily upon copying. (Recommended - high aesthetics).

## Design Options for Import Tab
1. **Three-Tab Navigation**: Redesign the tab bar to have three tabs of equal width: "Meu Álbum", "Comparar & Trocar", "Importar". (Recommended - straightforward and cleans up the modal flow).
2. **Dropdown Menu**: A header dropdown menu. (Overkill for our requirements).
