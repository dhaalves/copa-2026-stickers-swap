# Brainstorm: Fix Search Selection Filter (Part 2)

## 🎯 Goal
Diagnose and resolve remaining search filter issues where searches like "GER" match "Bósnia-Herzegovina", "PAN" matches "Espanha", "CC" matches "FWC", and English group queries like "Group A" do not work.

## 🔍 Root Cause Analysis
1. **Substring Collisions**: 
   - The current search matches substring `keywords.includes(query)`.
   - Searching Germany's code `GER` matches `BIH` because `herzegovina` contains `ger`.
   - Searching Panama's code `PAN` matches `ESP` because `espanha` contains `pan`.
   - Searching Coca-Cola's code `CC` matches FWC because both share the group name `fwc & cc` in their keywords, and `fwc & cc` contains `cc`.
2. **Lack of Language Localization Support**:
   - English terms like "Group" do not match the Portuguese "Grupo" stored in the dataset.
3. **No Strict Separation of Contexts**:
   - Merging team name, team code, and group name into a single string for substring matching makes it impossible to distinguish between a search for a specific team vs. a search for a group.

## 🛠️ Proposed Solution
1. Store separate search metadata attributes on each section element:
   - `data-team-code` (e.g., `MEX`, `CC`, `FWC`)
   - `data-team-name` (e.g., `México`, `Coca-Cola`, `FIFA World Cup`)
   - `data-group-name` (e.g., `Grupo A`, `FWC & CC`)
2. Implement a precise multi-layer matcher function `isMatch(sect, query)` that handles:
   - **Team Code Matching**: Checks if the team code starts with the query.
   - **Team Name Matching**: Checks if the team name contains the query.
   - **Group Matching**: Explicitly triggers only when the query starts with group-related keywords ("grupo", "group", "fwc & cc", etc.) and maps the group suffixes.
3. Use diacritic stripping (`stripAccents`) on all terms.

## ✅ Acceptance Criteria
1. Searching `CC` shows only the Coca-Cola section (hides FWC).
2. Searching `FWC` shows only the FWC section (hides CC).
3. Searching `GER` shows only Germany (hides Bósnia-Herzegovina).
4. Searching `PAN` shows only Panama (hides Espanha).
5. Searching `Grupo A` or `Group A` displays all Group A teams and hides others.
6. Searching `fwc & cc` or `grupo fwc` displays both FWC and CC sections.
