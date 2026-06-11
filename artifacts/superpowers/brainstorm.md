# Superpowers Brainstorm

## Task
crie uma maneira de compartilhar o link do album preenchido

## Goal
Implement a way for users to share a link to their filled album. When another user opens this link, the shared album is automatically loaded as the partner's album, and the app compares the two albums to show potential sticker trades.

## Constraints
- **Consistency**: Must align with the existing mobile-first UI (dark theme, outfit/jakarta typography).
- **No Extra Dependencies**: Use vanilla JS and existing styles.
- **URL Limit**: Keep the generated URL query string as clean as possible. Fortunately, the existing `StickerParser.generateAlbumCode` produces a highly compressed string (`SA26|1|4,21,24-27|24:1,26:1`).
- **Mobile First / Native Feel**: Use the Web Share API where supported (useful for mobile WhatsApp/social sharing), and fall back to clipboard copy.

## Known context
- The app already supports loading a partner's code via the `partner` query parameter (checked in `checkQueryParams()` in `js/app.js` on DOM load).
- Currently, the header contains a single button `btn-copy-my-code` with icon `🔗` which actually copies the raw code (not a link). This is slightly counterintuitive since `🔗` represents a link.
- A previous requirement hid the raw sharing textarea, leaving only copy/paste buttons.

## Risks
- **Long URLs**: Very large albums (e.g., 900+ owned stickers and lots of duplicates) might generate long codes (though compression helps). Browsers/servers handle up to 2000+ characters easily, which is plenty for our compressed code.
- **Copy Feedback**: Sharing must provide clear feedback so the user knows if the copy succeeded.

## Options
1. **Option 1: Add a new "Copiar Link" button in the header.**
   Change the existing `btn-copy-my-code` icon to `📋` (representing copying the raw code) and add a second button `btn-copy-my-link` with icon `🔗` (representing copying the link). Place them in a `.header-actions` container.
2. **Option 2: Replace "Copiar Código" with "Compartilhar Link" in the header.**
   Only keep a single button in the header that shares/copies the link directly. If the user wants the raw code, they must go to the "Importar" tab or copy it elsewhere.
3. **Option 3: Add a Share Section under Section A: My Album.**
   Add a beautiful, dedicated card for sharing under the stats, containing two buttons: "Copiar Link do Álbum" and "Copiar Código do Álbum", styled with premium glassmorphism.

## Recommendation
**Option 1** is recommended because it keeps both functionalities (copying raw code for backup/restore/import and sharing link for comparison) easily accessible in the header without cluttering the main screen. It also utilizes the premium header space perfectly.

## Acceptance criteria
1. A new button `btn-copy-my-link` is added to the header.
2. The existing `btn-copy-my-code` button icon is changed to `📋` and its title is updated to "Copiar Código do Álbum (Copia & Cola)".
3. Clicking `btn-copy-my-link` generates a URL containing the user's current album code as the `partner` query param (e.g., `https://.../?partner=SA26|...`).
4. The share handler attempts to use the Web Share API (`navigator.share`) for a native sharing experience if available (especially on mobile), and falls back to copying the URL to the clipboard.
5. Visual feedback (changing icon to `✅`, styling change) is shown on success.
6. Verification tests ensure the link is correctly generated and parsed when loaded.
