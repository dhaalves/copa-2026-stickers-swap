# Execution: Fix Search Selection Filter (Part 2)

## Checklist

- [x] Modify `js/app.js` to store structured dataset elements (`data-team-code`, `data-team-name`, `data-group-name`) on section elements.
- [x] Implement `isMatch(sect, query)` helper function in `js/app.js` with structured matching.
- [x] Update search filter event listener in `js/app.js` to call `isMatch`.
- [x] Run existing tests (`node js/test_parser.js` and `node js/check_user_input.js`) to verify parsing logic remains intact.
- [x] Perform manual validation.
