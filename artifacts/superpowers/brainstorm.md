# Brainstorm: Remove Flag Emojis from UI

## 🎯 Goal
Remove the flag emojis from the country headers, matching badges, and WhatsApp output.

## ⚙️ Constraints
- Windows browsers display country flag emojis as raw two-letter text strings (e.g. `CZ` for Czechia, `MX` for Mexico).
- Having `CZ CZE` or `MX MEX` next to each other creates redundancy and looks unprofessional.
- The UI should instead use clean 3-letter codes and names.

## ✅ Acceptance Criteria
1. Headers display `CZE República Tcheca` (no `CZ` prefix).
2. Match list badges show `CZE 35` (no flag prefix).
3. WhatsApp share texts display `CZE 35` (no flag prefix).
