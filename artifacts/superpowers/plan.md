1. **Modify app.js to include a progress bar for each team.**
   - Append a `.team-progress-bar-container` div inside each `.team-section-header`.
   - Add `.team-progress-bar-fill` inside the container with `style="width: ...%"`.
   - Update `updateSectionProgress(code)` in `app.js` to modify the progress bar width when a sticker is marked/unmarked.
2. **Modify style.css to style the progress bar.**
   - Define `.team-progress-bar-container` to take full width and add some visual style like background and margin.
   - Define `.team-progress-bar-fill` with `height: 100%`, `transition: width 0.3s ease`, and background color matching the accent.
   - Use `flex-wrap: wrap;` in `.team-section-header` so the progress bar wraps to a new line spanning the entire width, effectively looking like a neat progress bar right below the header stats.
3. **Verify changes.**
   - Verify the changes made to `app.js` and `style.css` by running `git diff`.
4. **Run tests.**
   - Run the existing unit tests using `node js/test_parser.js` to verify no regressions were introduced.
5. **Pre-commit steps.**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
6. **Submit changes.**
   - Commit and submit.
