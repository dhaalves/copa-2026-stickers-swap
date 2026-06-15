# Superpowers Review - Improving Header "FWC 2026" Presentation

## Review Pass

### Blocker
*None*

### Major
*None*

### Minor
*None*

### Nit
- **Viewport scaling**: On viewports narrower than 340px, the title "Stickers Swap" and the badge "FWC 2026" might wrap. This is handled gracefully by using `display: inline-flex` on the badge, causing it to fall to the next line below "Stickers Swap" instead of breaking inside the text.
