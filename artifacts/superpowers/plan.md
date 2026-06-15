# Superpowers Plan - Improving Header "FWC 2026" Presentation

## Goal
Improve the presentation of "FWC 2026" in the header to make it look modern, professional, and premium by styling it as a gold/amber-accented tournament badge next to the main title.

## Assumptions
- Custom classes can be added to `style.css` without conflicts.
- A simple badge element is preferred rather than moving "FWC 2026" to another location.

## Plan

### Step 1: Update HTML
- **Files**: [index.html](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/index.html)
- **Change**: Replace `<h1 id="app-title">Stickers Swap <br /> FWC 2026</h1>` with `<h1 id="app-title">Stickers Swap <span class="fwc-badge">FWC 2026</span></h1>`
- **Verify**: Confirm that the `<br />` is removed and `<span class="fwc-badge">FWC 2026</span>` is correctly placed.

### Step 2: Update CSS
- **Files**: [style.css](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/style.css)
- **Change**:
  - Add style rule for `.fwc-badge` inside the header section:
    ```css
    .fwc-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(234, 179, 8, 0.1);
        color: var(--accent-secondary);
        border: 1px solid rgba(234, 179, 8, 0.3);
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        vertical-align: middle;
        margin-left: 8px;
        text-transform: uppercase;
        box-shadow: 0 0 10px rgba(234, 179, 8, 0.1);
    }
    ```
- **Verify**: Ensure the badge renders correctly, aligns with the main text, and adapts to narrow screens gracefully.

## Risks & mitigations
- *Text Wrapping*: Title + badge might wrap on very narrow viewports.
  - *Mitigation*: The `.brand` flex layout and font sizes will keep the wraps clean, and inline-flex on the badge ensures it wraps neatly with the text.

## Rollback plan
- Revert changes via git: `git checkout index.html style.css`
