# Plan: Fix Search Selection Filter (Part 2)

This plan details the implementation to fix all search collisions (such as GER matching Herzegovina, CC matching FWC) and support Group synonyms (Group A/Grupo A).

---

## 🛠️ Proposed Changes

### 1. [MODIFY] [app.js](file:///C:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)

#### A. Set precise dataset properties in `renderStickerGrid()`
Replace the generic `dataset.search` properties:
- **FWC section** (around lines 197-198):
  ```javascript
  fwcSection.dataset.teamCode = 'FWC';
  fwcSection.dataset.teamName = 'FIFA World Cup';
  fwcSection.dataset.groupName = 'FWC & CC';
  ```
- **CC section** (around lines 232-233):
  ```javascript
  ccSection.dataset.teamCode = 'CC';
  ccSection.dataset.teamName = 'Coca-Cola';
  ccSection.dataset.groupName = 'FWC & CC';
  ```
- **Team sections** (around lines 312-313):
  ```javascript
  section.dataset.teamCode = team.code;
  section.dataset.teamName = team.name;
  section.dataset.groupName = team.group;
  ```

#### B. Implement matching function `isMatch(sect, query)`
Implement the `isMatch` helper inside the `DOMContentLoaded` scope. It will use structured logic to prevent collisions and resolve group names in Portuguese/English.

#### C. Update the search event listener
Replace the current `.team-section` filtering loop with:
```javascript
            document.querySelectorAll('.team-section').forEach(sect => {
                if (isMatch(sect, query)) {
                    sect.classList.remove('hidden');
                    sect.classList.remove('collapsed'); // auto unfold search results
                } else {
                    sect.classList.add('hidden');
                }
            });
```

---

## 🔍 Verification Plan

### Automated Tests
- Run `node js/test_parser.js` to ensure the parser functionality is intact.

### Manual Verification
- Open the application.
- Search for "CC" -> verify only CC is shown (FWC is hidden).
- Search for "FWC" -> verify only FWC is shown (CC is hidden).
- Search for "GER" -> verify only Germany is shown (BIH/Bosnia-Herzegovina is hidden).
- Search for "PAN" -> verify only Panama is shown (Spain/Espanha is hidden).
- Search for "Grupo A" -> verify MEX, RSA, KOR, CZE are shown.
- Search for "Group A" -> verify MEX, RSA, KOR, CZE are shown.
- Search for "grupo fwc" -> verify both FWC and CC are shown.
