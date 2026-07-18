/**
 * UI Controller for Stickers Swap FWC 2026
 */
document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    myAlbum: {
      albumId: StickerParser.ALBUM_ID,
      version: StickerParser.VERSION,
      owned: new Set(),
      repeated: new Map(),
    },
    partnerState: null,
  };

  // Local Storage Keys
  const LOCAL_STORAGE_KEY = "copamatch26_my_album_code";
  const GRID_PREFS_KEY = "copamatch26_grid_prefs";

  // Sticker grid view preferences (persisted)
  const gridPrefs = {
    hideCompleted: false,
    sortAlphabetical: false,
  };

  // Active "Falta / Tenho / Repetida" legend filter (session-only, not persisted).
  // One of "empty" | "owned" | "repeated" | null (no filter).
  let activeStatusFilter = null;

  // DOM Elements
  const el = {
    title: document.getElementById("app-title"),
    statsCompletion: document.getElementById("stats-completion"),
    statsProgressFill: document.getElementById("stats-progress-fill"),
    statsRepeated: document.getElementById("stats-repeated"),
    btnMenuToggle: document.getElementById("btn-menu-toggle"),
    dropdownMenu: document.getElementById("dropdown-menu"),
    detailedStatCompletion: document.getElementById("detailed-stat-completion"),
    detailedStatCompletionRing: document.getElementById("detailed-stat-completion-ring"),
    detailedStatMissing: document.getElementById("detailed-stat-missing"),
    detailedStatOwned: document.getElementById("detailed-stat-owned"),
    detailedStatRepeats: document.getElementById("detailed-stat-repeats"),
    detailedStatShiny: document.getElementById("detailed-stat-shiny"),
    sectionMyAlbum: document.getElementById("section-my-album"),
    sectionMatching: document.getElementById("section-matching"),
    sectionImport: document.getElementById("section-import"),
    myCodeTextarea: document.getElementById("my-code-textarea"),
    btnOpenShareModal: document.getElementById("btn-open-share-modal"),
    shareModal: document.getElementById("share-modal"),
    btnCloseShareModal: document.getElementById("btn-close-share-modal"),
    btnShareImport: document.getElementById("btn-share-import"),
    btnShareCompare: document.getElementById("btn-share-compare"),
    btnShareMissing: document.getElementById("btn-share-missing"),
    btnShareRepeats: document.getElementById("btn-share-repeats"),
    gridSearchInput: document.getElementById("grid-search-input"),
    gridSearchClear: document.getElementById("grid-search-clear"),
    gridNoResults: document.getElementById("grid-no-results"),
    btnToggleHideCompleted: document.getElementById("btn-toggle-hide-completed"),
    btnToggleSortAlpha: document.getElementById("btn-toggle-sort-alpha"),
    legendFilterBtns: document.querySelectorAll(".legend-item[data-status]"),
    stickersGrid: document.getElementById("stickers-grid-container"),
    partnerCodeTextarea: document.getElementById("partner-code-textarea"),
    btnCalculateMatch: document.getElementById("btn-calculate-match"),
    matchResultsPanel: document.getElementById("match-results-panel"),
    matchEmptyPanel: document.getElementById("match-empty-panel"),
    matchSummarySubtitle: document.getElementById("match-summary-subtitle"),
    matchGiveTitle: document.getElementById("match-give-title"),
    matchReceiveTitle: document.getElementById("match-receive-title"),
    matchGiveList: document.getElementById("match-give-list"),
    matchReceiveList: document.getElementById("match-receive-list"),
    btnShareWhatsapp: document.getElementById("btn-share-whatsapp"),
    btnUpdateAlbumFromMatch: document.getElementById("btn-update-album-from-match"),
    importCodeTextarea: document.getElementById("import-code-textarea"),
    btnImportConfirm: document.getElementById("btn-import-confirm"),
    indepAlbum1Textarea: document.getElementById("indep-album1-textarea"),
    indepAlbum2Textarea: document.getElementById("indep-album2-textarea"),
    btnCalculateIndependentMatch: document.getElementById("btn-calculate-independent-match"),
    indepMatchResultsPanel: document.getElementById("indep-match-results-panel"),
    indepMatchEmptyPanel: document.getElementById("indep-match-empty-panel"),
    indepMatchSummarySubtitle: document.getElementById("indep-match-summary-subtitle"),
    indepMatch1to2Title: document.getElementById("indep-match-1to2-title"),
    indepMatch2to1Title: document.getElementById("indep-match-2to1-title"),
    indepMatch1to2List: document.getElementById("indep-match-1to2-list"),
    indepMatch2to1List: document.getElementById("indep-match-2to1-list"),
  };

  /* ==========================================================================
       INITIALIZATION
       ========================================================================== */

  function init() {
    // 1. Load my album state from localStorage or initialize
    loadMyAlbumFromStorage();
    loadGridPrefs();
    reflectGridPrefButtons();

    // 2. Render all sticker grids
    renderStickerGrid();

    // 3. Update Header and Share textareas
    updateMyAlbumUI();

    // 4. Setup event listeners
    bindEvents();

    // 5. Check URL query params for shared partner codes
    checkQueryParams();
  }

  /* ==========================================================================
       STATE MANAGEMENT & LOCAL STORAGE
       ========================================================================== */

  function saveMyAlbumToStorage() {
    const code = StickerParser.generateAlbumCode(state.myAlbum);
    localStorage.setItem(LOCAL_STORAGE_KEY, code);
  }

  function loadMyAlbumFromStorage() {
    const savedCode = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCode) {
      try {
        state.myAlbum = StickerParser.parseAlbumCode(savedCode);
      } catch (err) {
        console.error("Erro ao carregar álbum do localStorage:", err);
        resetMyAlbumState();
      }
    } else {
      resetMyAlbumState();
    }
  }

  function loadGridPrefs() {
    const raw = localStorage.getItem(GRID_PREFS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      gridPrefs.hideCompleted = !!parsed.hideCompleted;
      gridPrefs.sortAlphabetical = !!parsed.sortAlphabetical;
    } catch (err) {
      // Ignore malformed prefs, keep defaults
    }
  }

  function saveGridPrefs() {
    localStorage.setItem(GRID_PREFS_KEY, JSON.stringify(gridPrefs));
  }

  function resetMyAlbumState() {
    state.myAlbum = {
      albumId: StickerParser.ALBUM_ID,
      version: StickerParser.VERSION,
      owned: new Set(),
      repeated: new Map(),
    };
  }

  function importAlbumFromCode(codeStr) {
    if (!codeStr || !codeStr.trim()) return false;
    try {
      const parsed = StickerParser.parseAlbumCode(codeStr);
      // Quick validation of format
      if (
        parsed.owned.size === 0 &&
        parsed.repeated.size === 0 &&
        !codeStr.includes("|")
      ) {
        return false;
      }
      state.myAlbum = parsed;
      saveMyAlbumToStorage();
      updateMyAlbumUI();
      renderStickerGrid();

      // If we have a partner code filled, trigger recalculation
      if (el.partnerCodeTextarea.value.trim()) {
        calculateMatch();
      }
      return true;
    } catch (err) {
      console.error("Erro ao importar código:", err);
      return false;
    }
  }

  /* ==========================================================================
       UI RENDERING
       ========================================================================== */

  const LONG_PRESS_MS = 600;
  const LONG_PRESS_MOVE_TOLERANCE_PX = 10;

  /**
   * Fires `onLongPress` when the element is pressed and held (mouse or
   * touch) without moving. Returns a `consume()` function that reports —
   * and clears — whether a long press just fired, so the element's click
   * handler can skip its normal action after a long press.
   */
  function attachLongPress(element, onLongPress) {
    let timer = null;
    let startX = 0;
    let startY = 0;
    let fired = false;

    const cancel = () => {
      clearTimeout(timer);
      timer = null;
    };

    element.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      fired = false;
      timer = setTimeout(() => {
        fired = true;
        onLongPress();
      }, LONG_PRESS_MS);
    });
    element.addEventListener("pointermove", (e) => {
      if (
        timer !== null &&
        Math.hypot(e.clientX - startX, e.clientY - startY) >
          LONG_PRESS_MOVE_TOLERANCE_PX
      ) {
        cancel();
      }
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((type) =>
      element.addEventListener(type, cancel),
    );
    // A mobile long press would also open the context menu on top of ours
    element.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      const wasFired = fired;
      fired = false;
      return wasFired;
    };
  }

  /** Long-press action: offer to mark every sticker in the section as owned. */
  function promptCompleteSection(section, name) {
    const start = parseInt(section.dataset.start, 10);
    const end = parseInt(section.dataset.end, 10);
    if (getOwnedCountInRange(start, end) === end - start + 1) return;
    if (!confirm(`Marcar todas as figurinhas de ${name} como obtidas?`)) return;

    for (let i = start; i <= end; i++) {
      state.myAlbum.owned.add(i);
    }
    section.querySelectorAll(".sticker-cell").forEach((cell) => {
      if (!cell.classList.contains("repeated")) {
        cell.classList.add("owned");
      }
    });

    saveMyAlbumToStorage();
    updateMyAlbumUI();
    updateSectionProgress(section.dataset.sectionId);
    if (activeStatusFilter) {
      applyStatusFilter();
    }
  }

  /**
   * Builds a collapsible team section (header + sticker grid) for the
   * given ID range. Used for FWC, CC, and each of the 48 teams.
   * Long-pressing the header offers to complete the whole section.
   */
  function createTeamSection(code, name, start, end, headerLeftHtml) {
    const total = end - start + 1;

    const ownedCount = getOwnedCountInRange(start, end);
    const repeatsCount = getRepeatedCountInRange(start, end);
    const isComplete = ownedCount === total;

    const section = document.createElement("div");
    section.className = "team-section collapsed";
    section.dataset.sectionId = code;
    section.dataset.start = start;
    section.dataset.end = end;
    section.classList.toggle(
      "completion-hidden",
      gridPrefs.hideCompleted && isComplete,
    );

    const header = document.createElement("div");
    header.className = isComplete
      ? "team-section-header team-complete"
      : "team-section-header";
    header.innerHTML = `
            <div class="team-header-left">${headerLeftHtml}</div>
            <div class="team-header-right">
                <span class="team-progress">${ownedCount}/${total}</span>
                <span class="team-repeats"${repeatsCount === 0 ? " hidden" : ""}>${repeatsCount}</span>
                <span class="chevron-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </div>
            <div class="team-progress-bar-container">
                <div class="team-progress-bar-fill" style="width: ${(ownedCount / total) * 100}%"></div>
            </div>
        `;

    const grid = document.createElement("div");
    grid.className = "stickers-grid";
    for (let i = start; i <= end; i++) {
      grid.appendChild(createStickerCell(i));
    }

    section.appendChild(header);
    section.appendChild(grid);

    const consumeLongPress = attachLongPress(header, () =>
      promptCompleteSection(section, name),
    );
    header.addEventListener("click", () => {
      if (consumeLongPress()) return;
      section.classList.toggle("collapsed");
    });

    return section;
  }

  // Non-team sections rendered after the 48 teams, always anchored at the end
  const SPECIAL_SECTIONS = [
    { code: "FWC", name: "FIFA World Cup", start: 1, end: 20, badge: "badge-fwc", emoji: "⭐" },
    { code: "CC", name: "Coca-Cola", start: 21, end: 34, badge: "badge-cc", emoji: "🥤" },
  ];

  function renderStickerGrid() {
    el.stickersGrid.innerHTML = "";

    // The 48 teams, in album (group) order or alphabetical per the sort pref.
    // Each team's ID range is fixed by its position in TEAMS, so compute the
    // start before any reordering.
    const teams = StickerParser.TEAMS.map((team, teamIdx) => ({
      team,
      start: 35 + teamIdx * 20,
    }));
    if (gridPrefs.sortAlphabetical) {
      teams.sort((a, b) => a.team.code.localeCompare(b.team.code));
    }

    teams.forEach(({ team, start }) => {
      el.stickersGrid.appendChild(
        createTeamSection(
          team.code,
          team.name,
          start,
          start + 19,
          `<img class="team-flag" src="https://flagcdn.com/${team.iso}.svg" alt="${team.name}" loading="lazy" width="20" height="14">
           <span class="team-code">${team.code}</span>
           <span class="team-name">${team.name}</span>`,
        ),
      );
    });

    SPECIAL_SECTIONS.forEach(({ code, name, start, end, badge, emoji }) => {
      el.stickersGrid.appendChild(
        createTeamSection(
          code,
          name,
          start,
          end,
          `<span class="badge-icon ${badge}">${emoji}</span><span class="team-name special-team-name">${code}</span>`,
        ),
      );
    });

    // Re-apply the legend status filter (if active) after rebuilding the grid
    if (activeStatusFilter) {
      applyStatusFilter();
    }

    // Re-apply active filter after re-rendering the grid
    if (el.gridSearchInput) {
      applyGridFilter(el.gridSearchInput.value);
    }
  }

  function getOwnedCountInRange(start, end) {
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (state.myAlbum.owned.has(i)) {
        count++;
      }
    }
    return count;
  }

  function getRepeatedCountInRange(start, end) {
    let count = 0;
    for (let i = start; i <= end; i++) {
      count += state.myAlbum.repeated.get(i) || 0;
    }
    return count;
  }

  /* --------------------------------------------------------------------------
     GRID FILTER (by team / team+number)
     -------------------------------------------------------------------------- */

  function stripAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function parseFilterQuery(query) {
    const trimmed = query.trim();
    if (!trimmed) return null;

    const lower = stripAccents(trimmed.toLowerCase());
    let codeQuery = lower;
    let numPart = null;

    // "BRA 5", "BRA-5", "Brasil 5" (separator between code/name and number)
    const withSep = lower.match(/^(.+?)[\s-]+(\d{1,2})$/);
    // "BRA5", "MEX20" (number attached to code)
    const attached = !withSep ? lower.match(/^([a-z]+?)(\d{1,2})$/) : null;

    if (withSep) {
      codeQuery = withSep[1].trim();
      numPart = parseInt(withSep[2], 10);
    } else if (attached) {
      codeQuery = attached[1];
      numPart = parseInt(attached[2], 10);
    }

    const allTeams = [
      { code: "FWC", name: "FIFA World Cup" },
      { code: "CC", name: "Coca-Cola" },
      ...StickerParser.TEAMS.map((t) => ({ code: t.code, name: t.name })),
    ];

    const matchingCodes = [];
    for (const team of allTeams) {
      const codeLower = team.code.toLowerCase();
      const nameLower = stripAccents(team.name.toLowerCase());
      if (
        codeLower === codeQuery ||
        codeLower.startsWith(codeQuery) ||
        nameLower.startsWith(codeQuery)
      ) {
        matchingCodes.push(team.code);
      }
    }

    return { codes: matchingCodes, numPart, raw: trimmed };
  }

  function applyGridFilter(query) {
    const filterResult = parseFilterQuery(query);
    const clearBtn = el.gridSearchClear;
    const noResultsEl = el.gridNoResults;

    // Reset previous filter state
    document
      .querySelectorAll(".team-section")
      .forEach((s) => s.classList.remove("hidden"));
    document
      .querySelectorAll(".sticker-cell")
      .forEach((c) => c.classList.remove("filter-highlight", "filter-dim"));

    if (!filterResult || filterResult.codes.length === 0) {
      if (clearBtn) clearBtn.style.display = "";
      if (noResultsEl) {
        if (filterResult && filterResult.codes.length === 0) {
          noResultsEl.textContent = `Nenhuma figurinha encontrada para "${filterResult.raw}"`;
          noResultsEl.classList.remove("hidden");
        } else {
          noResultsEl.classList.add("hidden");
        }
      }
      // Query cleared entirely: restore "hide completed" visibility
      if (!filterResult) {
        reapplyCompletionHiddenState();
      }
      return;
    }

    if (clearBtn) clearBtn.style.display = "flex";
    if (noResultsEl) noResultsEl.classList.add("hidden");

    const { codes, numPart } = filterResult;

    let firstHighlighted = null;

    document.querySelectorAll(".team-section").forEach((section) => {
      const sectionCode = section.dataset.sectionId;
      if (codes.includes(sectionCode)) {
        section.classList.remove("hidden");
        section.classList.remove("collapsed"); // expand matching team
        section.classList.remove("completion-hidden"); // reveal even if "hide completed" is on

        if (numPart !== null) {
          section.querySelectorAll(".sticker-cell").forEach((cell) => {
            const id = parseInt(cell.dataset.id, 10);
            const info = StickerParser.getStickerInfo(id);
            if (info) {
              const relInt = parseInt(info.relativeNumber, 10);
              if (!isNaN(relInt) && relInt === numPart) {
                cell.classList.add("filter-highlight");
                if (!firstHighlighted) firstHighlighted = cell;
              } else {
                cell.classList.add("filter-dim");
              }
            }
          });
        }
      } else {
        section.classList.add("hidden");
      }
    });

    if (firstHighlighted) {
      firstHighlighted.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function createStickerCell(i) {
    const cell = document.createElement("div");
    cell.className = "sticker-cell";

    const info = StickerParser.getStickerInfo(i);
    cell.dataset.id = i;
    if (info) {
      cell.title = `${info.code} #${info.relativeNumber} (Álbum: ${i})`;
    }

    // Create main label span for the sticker number
    const label = document.createElement("span");
    label.className = "sticker-label";
    label.textContent = info ? info.relativeNumber : i;
    cell.appendChild(label);

    const isOwned = state.myAlbum.owned.has(i);
    const repeatedQty = state.myAlbum.repeated.get(i) || 0;

    // Create the controls container
    const controls = document.createElement("div");
    controls.className = "cell-controls";

    const btnDec = document.createElement("button");
    btnDec.className = "control-btn btn-dec";
    btnDec.textContent = "-";
    btnDec.title = "Remover repetida / Marcar como não possuído";
    btnDec.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDecrementClick(i, cell);
    });

    const btnInc = document.createElement("button");
    btnInc.className = "control-btn btn-inc";
    btnInc.textContent = "+";
    btnInc.title = "Adicionar repetida";
    btnInc.addEventListener("click", (e) => {
      e.stopPropagation();
      handleIncrementClick(i, cell);
    });

    controls.appendChild(btnDec);
    controls.appendChild(btnInc);
    cell.appendChild(controls);

    if (repeatedQty > 0) {
      cell.classList.add("repeated");
      setBadge(cell, repeatedQty);
    } else if (isOwned) {
      cell.classList.add("owned");
    }

    cell.addEventListener("click", () => {
      handleStickerClick(i, cell);
    });

    return cell;
  }

  /** Shared tail for any single-cell state change: persist + refresh UI. */
  function commitCellChange(id, cellElement) {
    saveMyAlbumToStorage();
    updateMyAlbumUI();

    const info = StickerParser.getStickerInfo(id);
    if (info) {
      updateSectionProgress(info.code);
    }
    updateStatusFilterForCell(cellElement);
  }

  function handleStickerClick(id, cellElement) {
    const isOwned = state.myAlbum.owned.has(id);

    // Clean cell state
    cellElement.classList.remove("owned", "repeated");
    removeBadge(cellElement);
    state.myAlbum.repeated.delete(id);

    if (!isOwned) {
      // Missing -> Owned
      state.myAlbum.owned.add(id);
      cellElement.classList.add("owned");
    } else {
      // Owned/Repeated -> Missing
      state.myAlbum.owned.delete(id);
    }

    commitCellChange(id, cellElement);
  }

  function handleIncrementClick(id, cellElement) {
    state.myAlbum.owned.add(id);
    const newQty = (state.myAlbum.repeated.get(id) || 0) + 1;
    state.myAlbum.repeated.set(id, newQty);

    cellElement.classList.remove("owned");
    cellElement.classList.add("repeated");
    setBadge(cellElement, newQty);

    commitCellChange(id, cellElement);
  }

  function handleDecrementClick(id, cellElement) {
    if (!state.myAlbum.owned.has(id)) return;

    const currentQty = state.myAlbum.repeated.get(id) || 0;
    if (currentQty > 1) {
      state.myAlbum.repeated.set(id, currentQty - 1);
      setBadge(cellElement, currentQty - 1);
    } else if (currentQty === 1) {
      state.myAlbum.repeated.delete(id);
      cellElement.classList.remove("repeated");
      cellElement.classList.add("owned");
      removeBadge(cellElement);
    } else {
      // Dec from 0 repeats -> marks as missing
      state.myAlbum.owned.delete(id);
      cellElement.classList.remove("owned", "repeated");
      removeBadge(cellElement);
    }

    commitCellChange(id, cellElement);
  }

  function updateSectionProgress(code) {
    const sectionEl = document.querySelector(
      `.team-section[data-section-id="${code}"]`,
    );
    if (!sectionEl) return;

    const progressEl = sectionEl.querySelector(".team-progress");
    if (!progressEl) return;

    const start = parseInt(sectionEl.dataset.start, 10);
    const end = parseInt(sectionEl.dataset.end, 10);
    const total = end - start + 1;
    const ownedCount = getOwnedCountInRange(start, end);
    progressEl.textContent = `${ownedCount}/${total}`;

    const repeatsEl = sectionEl.querySelector(".team-repeats");
    if (repeatsEl) {
      const repeatsCount = getRepeatedCountInRange(start, end);
      repeatsEl.textContent = `${repeatsCount}`;
      repeatsEl.hidden = repeatsCount === 0;
    }

    const progressBarFill = sectionEl.querySelector(".team-progress-bar-fill");
    if (progressBarFill) {
      progressBarFill.style.width = `${(ownedCount / total) * 100}%`;
    }

    const isComplete = ownedCount === total;
    const headerEl = sectionEl.querySelector(".team-section-header");
    if (headerEl) {
      headerEl.classList.toggle("team-complete", isComplete);
    }

    // A legend status filter forces every section unhidden; don't let
    // gridPrefs re-hide it out from under the filter.
    sectionEl.classList.toggle(
      "completion-hidden",
      !activeStatusFilter && gridPrefs.hideCompleted && isComplete,
    );
  }

  /** True when every sticker in the section's ID range is owned. */
  function isSectionComplete(sectionEl) {
    const start = parseInt(sectionEl.dataset.start, 10);
    const end = parseInt(sectionEl.dataset.end, 10);
    return getOwnedCountInRange(start, end) === end - start + 1;
  }

  /**
   * Restores "hide completed" visibility across all sections.
   * Used after a search filter (which force-reveals matches) is cleared.
   */
  function reapplyCompletionHiddenState() {
    el.stickersGrid.querySelectorAll(".team-section").forEach((section) => {
      section.classList.toggle(
        "completion-hidden",
        !activeStatusFilter && gridPrefs.hideCompleted && isSectionComplete(section),
      );
    });
  }

  /**
   * Re-applies the default collapsed view + "hide completed" pref to the
   * existing grid, instead of rebuilding ~1000 cells (which would also
   * lose the scroll position).
   */
  function applyGridViewPrefs() {
    el.stickersGrid.querySelectorAll(".team-section").forEach((section) => {
      section.classList.add("collapsed");
    });
    reapplyCompletionHiddenState();
    // A live search filter overrides pref visibility on matched sections
    if (el.gridSearchInput && el.gridSearchInput.value.trim()) {
      applyGridFilter(el.gridSearchInput.value);
    }
  }

  /** Syncs the toggle button visuals with the current gridPrefs. */
  function reflectGridPrefButtons() {
    el.btnToggleHideCompleted.setAttribute(
      "aria-pressed",
      String(gridPrefs.hideCompleted),
    );
    el.btnToggleSortAlpha.setAttribute(
      "aria-pressed",
      String(gridPrefs.sortAlphabetical),
    );
  }

  /* --------------------------------------------------------------------------
     LEGEND STATUS FILTER (Falta / Tenho / Repetida)
     -------------------------------------------------------------------------- */

  function getCellStatus(cellEl) {
    if (cellEl.classList.contains("repeated")) return "repeated";
    if (cellEl.classList.contains("owned")) return "owned";
    return "empty";
  }

  /**
   * Applies (or clears) the legend status filter across the whole grid:
   * only cells matching the selected status stay visible, every team
   * section is force-expanded and unhidden so matches are visible across
   * the whole album. Clearing restores the normal gridPrefs-based view.
   */
  function applyStatusFilter() {
    if (!activeStatusFilter) {
      el.stickersGrid
        .querySelectorAll(".status-filter-hidden")
        .forEach((node) => node.classList.remove("status-filter-hidden"));
      applyGridViewPrefs();
      return;
    }

    el.stickersGrid.querySelectorAll(".team-section").forEach((section) => {
      section.classList.remove("collapsed", "completion-hidden");

      let anyVisible = false;
      section.querySelectorAll(".sticker-cell").forEach((cell) => {
        const match = getCellStatus(cell) === activeStatusFilter;
        cell.classList.toggle("status-filter-hidden", !match);
        if (match) anyVisible = true;
      });
      section.classList.toggle("status-filter-hidden", !anyVisible);
    });
  }

  /**
   * Incrementally updates a single sticker cell (and its section/divider)
   * after its owned/repeated state changes, instead of rescanning the
   * whole grid. No-op when no status filter is active.
   */
  function updateStatusFilterForCell(cellElement) {
    if (!activeStatusFilter) return;

    const match = getCellStatus(cellElement) === activeStatusFilter;
    cellElement.classList.toggle("status-filter-hidden", !match);

    const section = cellElement.closest(".team-section");
    if (!section) return;

    const anyVisible = Array.from(
      section.querySelectorAll(".sticker-cell"),
    ).some((c) => !c.classList.contains("status-filter-hidden"));
    section.classList.toggle("status-filter-hidden", !anyVisible);
  }

  /** Syncs the legend filter buttons' pressed state with activeStatusFilter. */
  function reflectStatusFilterButtons() {
    el.legendFilterBtns.forEach((btn) => {
      btn.setAttribute(
        "aria-pressed",
        String(btn.dataset.status === activeStatusFilter),
      );
    });
  }

  /** Creates or updates the "+N" repeats badge on a cell. */
  function setBadge(cellElement, qty) {
    let badge = cellElement.querySelector(".sticker-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "sticker-badge";
      cellElement.appendChild(badge);
    }
    badge.textContent = `+${qty}`;
  }

  function removeBadge(cellElement) {
    const badge = cellElement.querySelector(".sticker-badge");
    if (badge) badge.remove();
  }

  function updateMyAlbumUI() {
    const ownedCount = state.myAlbum.owned.size;
    const total = StickerParser.TOTAL_STICKERS;

    // Sum all repeated quantities
    let repeatedCount = 0;
    for (const qty of state.myAlbum.repeated.values()) {
      repeatedCount += qty;
    }

    // Update Header stats
    const percentage = (ownedCount / total) * 100;
    el.statsCompletion.textContent = `${ownedCount} / ${total} (${percentage.toFixed(1)}%)`;
    el.statsProgressFill.style.width = `${percentage}%`;
    el.statsRepeated.textContent = repeatedCount;

    // Detailed Stats Tab
    const missingCount = total - ownedCount;

    // Calculate Shiny (Brilhantes): IDs 1-20 (FWC) + First sticker of each team (35, 55, 75...)
    let shinyCount = 0;
    for (let i = 1; i <= 20; i++) {
      if (state.myAlbum.owned.has(i)) shinyCount++;
    }
    for (let i = 0; i < 48; i++) {
      const teamFirstStickerId = 35 + (i * 20);
      if (state.myAlbum.owned.has(teamFirstStickerId)) shinyCount++;
    }

    if (el.detailedStatCompletion) {
      el.detailedStatCompletion.textContent = `${Math.round(percentage)}%`;

      // Update circular progress bar (circumference is 125.6)
      const circumference = 125.6;
      const offset = circumference - (percentage / 100) * circumference;
      if (el.detailedStatCompletionRing) {
        el.detailedStatCompletionRing.style.strokeDashoffset = offset;
      }

      el.detailedStatMissing.textContent = missingCount;
      el.detailedStatOwned.textContent = ownedCount;
      el.detailedStatRepeats.textContent = repeatedCount;
      el.detailedStatShiny.textContent = `${shinyCount}/68`;
    }

    // Generate and update sharing code
    const code = StickerParser.generateAlbumCode(state.myAlbum);
    el.myCodeTextarea.value = code;
  }

  /* ==========================================================================
       MATCH COMPARISON & WHATSAPP
       ========================================================================= */

  /**
   * Renders a list of sticker IDs as badges inside `listEl`, or an empty
   * message when there are none. Shared by the my-album match panel and
   * the independent (third-party) comparison panel.
   */
  function populateStickerBadgeList(listEl, ids, emptyText) {
    listEl.innerHTML = "";
    if (ids.length > 0) {
      ids.forEach((id) => {
        const info = StickerParser.getStickerInfo(id);
        const badge = document.createElement("span");
        badge.className = "match-sticker-badge";
        badge.textContent = info ? `${info.code} ${info.relativeNumber}` : id;
        if (info) {
          badge.title = `${info.name} - #${info.relativeNumber}`;
        }
        listEl.appendChild(badge);
      });
    } else {
      listEl.innerHTML = `<span class="col-desc">${emptyText}</span>`;
    }
  }

  function calculateMatch() {
    const partnerCode = el.partnerCodeTextarea.value.trim();
    if (!partnerCode) {
      alert("Por favor, insira o código do parceiro para comparar.");
      return;
    }

    try {
      state.partnerState = StickerParser.parseAlbumCode(partnerCode);
      const match = StickerParser.matchAlbums(
        state.myAlbum,
        state.partnerState,
      );

      renderMatchResults(match);
    } catch (err) {
      alert(
        "Não foi possível processar o código do parceiro. Verifique se copiou corretamente.",
      );
      console.error(err);
    }
  }

  /**
   * Fills one column of a match-results panel: the badge list plus its
   * "<label> (<count>)" title.
   */
  function renderMatchColumn(titleEl, listEl, label, ids, emptyText) {
    populateStickerBadgeList(listEl, ids, emptyText);
    titleEl.textContent = `${label} (${ids.length})`;
  }

  function renderMatchResults(match) {
    // Hide empty state, show results panel
    el.matchEmptyPanel.classList.add("hidden");
    el.matchResultsPanel.classList.remove("hidden");

    const totalSwaps = match.give.length + match.receive.length;
    el.matchSummarySubtitle.textContent = `Vocês podem negociar até ${totalSwaps} figurinha(s)!`;

    renderMatchColumn(
      el.matchGiveTitle,
      el.matchGiveList,
      "Figurinhas que VOCÊ DÁ",
      match.give,
      "Nenhuma figurinha para dar.",
    );
    renderMatchColumn(
      el.matchReceiveTitle,
      el.matchReceiveList,
      "Figurinhas que VOCÊ RECEBE",
      match.receive,
      "Nenhuma figurinha para receber.",
    );

    // Update button visibility
    el.btnUpdateAlbumFromMatch.classList.toggle("hidden", totalSwaps === 0);

    // Store matches on button to build whatsapp link later
    el.btnShareWhatsapp.dataset.give = match.give.join(",");
    el.btnShareWhatsapp.dataset.receive = match.receive.join(",");
  }

  /* ==========================================================================
       INDEPENDENT COMPARISON (two third-party albums, not the user's own)
       ========================================================================= */

  function calculateIndependentMatch() {
    const text1 = el.indepAlbum1Textarea.value.trim();
    const text2 = el.indepAlbum2Textarea.value.trim();

    if (!text1 || !text2) {
      alert("Cole as listas dos dois álbuns para comparar.");
      return;
    }

    try {
      const album1State = StickerParser.parseAlbumCode(text1);
      const album2State = StickerParser.parseAlbumCode(text2);
      const match = StickerParser.matchAlbums(album1State, album2State);

      renderIndependentMatchResults(match);
    } catch (err) {
      alert(
        "Não foi possível processar as listas informadas. Verifique se colou corretamente as Faltantes e Repetidas de cada álbum.",
      );
      console.error(err);
    }
  }

  function renderIndependentMatchResults(match) {
    // Hide empty state, show results panel
    el.indepMatchEmptyPanel.classList.add("hidden");
    el.indepMatchResultsPanel.classList.remove("hidden");

    const totalSwaps = match.give.length + match.receive.length;
    el.indepMatchSummarySubtitle.textContent = `Eles podem trocar até ${totalSwaps} figurinha(s)!`;

    // "give" = Album 1's repeats that Album 2 lacks; "receive" = the inverse
    renderMatchColumn(
      el.indepMatch1to2Title,
      el.indepMatch1to2List,
      "Álbum 1 dá para Álbum 2",
      match.give,
      "Nenhuma figurinha para dar.",
    );
    renderMatchColumn(
      el.indepMatch2to1Title,
      el.indepMatch2to1List,
      "Álbum 2 dá para Álbum 1",
      match.receive,
      "Nenhuma figurinha para dar.",
    );
  }

  function updateAlbumFromMatch() {
    if (!state.partnerState) return;

    const match = StickerParser.matchAlbums(state.myAlbum, state.partnerState);

    if (match.give.length === 0 && match.receive.length === 0) {
      alert("Não há figurinhas para atualizar (nenhuma troca pendente).");
      return;
    }

    if (!confirm("Deseja atualizar seu álbum com essa troca? As figurinhas que você dá serão removidas das repetidas e as que recebe serão adicionadas ao seu álbum.")) {
      return;
    }

    // 1. Remove figurinhas que eu dou (das minhas repetidas)
    match.give.forEach((id) => {
      const currentQty = state.myAlbum.repeated.get(id) || 0;
      if (currentQty > 0) {
        const newQty = currentQty - 1;
        if (newQty === 0) {
          state.myAlbum.repeated.delete(id);
        } else {
          state.myAlbum.repeated.set(id, newQty);
        }
      }
    });

    // 2. Adicionar figurinhas que eu recebo (ao meu álbum)
    match.receive.forEach((id) => {
      state.myAlbum.owned.add(id);
    });

    // 3. Salvar e atualizar interface
    saveMyAlbumToStorage();
    updateMyAlbumUI();
    renderStickerGrid();
    calculateMatch(); // Recalcula a combinação (agora deve ser 0)

    alert("Álbum atualizado com sucesso!");
  }

  function openWhatsappShare(msg) {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  function shareTradeOnWhatsapp() {
    const giveStr = el.btnShareWhatsapp.dataset.give || "";
    const receiveStr = el.btnShareWhatsapp.dataset.receive || "";

    const giveArr = giveStr ? giveStr.split(",") : [];
    const receiveArr = receiveStr ? receiveStr.split(",") : [];

    const formatTradeSection = (label, ids) =>
      `*${label} (${ids.length}):*\n` +
      (ids.length > 0 ? formatStickerGroups(ids) : "Nenhuma\n");

    // Build neat summary message matching requested format
    const msg =
      `Stickers Swap FWC 2026 - https://dhaalves.github.io/copa-2026-stickers-swap/\n\n` +
      formatTradeSection("Repetidas minha que você não tem", giveArr) +
      `\n` +
      formatTradeSection("Repetidas suas que eu não tenho", receiveArr);

    // 1. Copy to clipboard, then 2. open the WhatsApp share link
    navigator.clipboard
      .writeText(msg)
      .then(() => {
        // Temporary button state change
        const originalNodes = [...el.btnShareWhatsapp.childNodes];

        const span = document.createElement("span");
        span.textContent = "✅ Copiado para a Área de Transferência!";
        el.btnShareWhatsapp.replaceChildren(span);

        setTimeout(() => {
          el.btnShareWhatsapp.replaceChildren(...originalNodes);
          openWhatsappShare(msg);
        }, 1500);
      })
      .catch((err) => {
        console.error("Erro ao copiar para clipboard:", err);
        // Fallback: Open whatsapp directly anyway
        openWhatsappShare(msg);
      });
  }

  function formatStickerGroups(stickerIds, quantitiesMap) {
    const grouped = {};

    for (const id of stickerIds) {
      const info = StickerParser.getStickerInfo(parseInt(id, 10));
      if (info) {
        if (!grouped[info.code]) {
          grouped[info.code] = { flag: info.flag, items: [] };
        }

        const qty = quantitiesMap ? quantitiesMap.get(parseInt(id, 10)) : 1;
        grouped[info.code].items.push({ num: info.relativeNumber, qty: qty });
      }
    }

    let msg = "";
    // Mirror the grid's sort preference: team codes A–Z when the alphabetical
    // toggle is on, album (group) order otherwise. FWC and CC stay anchored
    // at the end.
    const teamCodes = StickerParser.TEAMS.map((t) => t.code);
    if (gridPrefs.sortAlphabetical) {
      teamCodes.sort((a, b) => a.localeCompare(b));
    }
    const teamOrder = [...teamCodes, "FWC", "CC"];

    for (const code of teamOrder) {
      if (grouped[code] && grouped[code].items.length > 0) {
        let flag = grouped[code].flag || "";

        grouped[code].items.sort((a, b) => {
          if (a.num === "00") return -1;
          if (b.num === "00") return 1;
          return parseInt(a.num) - parseInt(b.num);
        });

        const formattedItems = grouped[code].items.map(item => {
          if (item.qty > 1) {
            return `${item.num} (x${item.qty})`;
          }
          return item.num;
        });

        msg += `${code} ${flag}: ${formattedItems.join(", ")}\n`;
      }
    }

    return msg;
  }

  function generateFullText(stateParam) {
    let msg = "";

    // Owned
    const ownedIds = [];
    for (let i = 1; i <= StickerParser.TOTAL_STICKERS; i++) {
      if (stateParam.owned.has(i)) {
        ownedIds.push(i);
      }
    }
    msg += formatStickerGroups(ownedIds);

    // Repeated
    const repeatIds = [];
    for (const id of stateParam.repeated.keys()) {
      repeatIds.push(id);
    }

    if (repeatIds.length > 0) {
      msg += `\nRepetidas\n`;
      msg += formatStickerGroups(repeatIds, stateParam.repeated);
    }

    return msg.trim();
  }

  function generateShareText(type) {
    let msg = `Stickers Swap FWC 2026 - https://dhaalves.github.io/copa-2026-stickers-swap/\n\n`;

    if (type === "missing") {
      msg += `**Faltantes**\n`;

      const missingIds = [];
      for (let i = 1; i <= StickerParser.TOTAL_STICKERS; i++) {
        if (!state.myAlbum.owned.has(i)) {
          missingIds.push(i);
        }
      }
      msg += formatStickerGroups(missingIds);
    } else if (type === "repeats") {
      msg += `**Repetidas**\n`;

      const repeatIds = [];
      for (const id of state.myAlbum.repeated.keys()) {
        repeatIds.push(id);
      }
      msg += formatStickerGroups(repeatIds, state.myAlbum.repeated);
    }

    return msg;
  }

  /**
   * Wires a share-modal button to try the native Web Share API first,
   * falling back to copy-to-clipboard (with a temporary confirmation label).
   * `buildShareOptions()` is called fresh on each click so the payload
   * (album code, generated text, etc.) always reflects current state.
   */
  function setupShareButton(button, { buildShareOptions, copiedLabel }) {
    button.addEventListener("click", () => {
      const { clipboardText, shareData } = buildShareOptions();

      const performClipboardFallback = () => {
        navigator.clipboard
          .writeText(clipboardText)
          .then(() => {
            const originalNodes = [...button.childNodes];
            button.textContent = copiedLabel;
            button.style.borderColor = "var(--accent-primary)";
            button.style.background = "var(--accent-primary-glow)";
            setTimeout(() => {
              button.replaceChildren(...originalNodes);
              button.style.borderColor = "";
              button.style.background = "";
              el.shareModal.classList.add("hidden");
            }, 1500);
          })
          .catch((err) => {
            console.error("Falha ao copiar:", err);
          });
      };

      if (navigator.share) {
        navigator
          .share(shareData)
          .then(() => {
            el.shareModal.classList.add("hidden");
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              performClipboardFallback();
            }
          });
      } else {
        performClipboardFallback();
      }
    });
  }

  /* ==========================================================================
       EVENT LISTENERS & NAVIGATION
       ========================================================================== */

  function bindEvents() {
    // Grid filter (team / team+number)
    if (el.gridSearchInput) {
      el.gridSearchInput.addEventListener("input", (e) => {
        const value = e.target.value;
        // Text search and the legend status filter are mutually exclusive
        // view filters; clear the status filter before applying a search so
        // the two never compose into stale hidden state.
        if (value.trim() && activeStatusFilter) {
          activeStatusFilter = null;
          reflectStatusFilterButtons();
          applyStatusFilter();
        }
        applyGridFilter(value);
      });
    }
    if (el.gridSearchClear) {
      el.gridSearchClear.addEventListener("click", () => {
        if (el.gridSearchInput) {
          el.gridSearchInput.value = "";
          applyGridFilter("");
          el.gridSearchInput.focus();
        }
      });
    }

    // Grid view toggles: hide completed teams / sort teams alphabetically.
    // Hide-completed re-applies view state in place; the sort toggle needs a
    // full grid rebuild to reorder the sections. A status filter forces its
    // own expand/unhide state; re-assert it instead of letting the
    // prefs-based view clobber it (renderStickerGrid already does).
    [
      [
        el.btnToggleHideCompleted,
        "hideCompleted",
        () => (activeStatusFilter ? applyStatusFilter() : applyGridViewPrefs()),
      ],
      [el.btnToggleSortAlpha, "sortAlphabetical", renderStickerGrid],
    ].forEach(([btn, pref, applyView]) => {
      btn.addEventListener("click", () => {
        gridPrefs[pref] = !gridPrefs[pref];
        saveGridPrefs();
        reflectGridPrefButtons();
        applyView();
      });
    });

    // Legend filter: click "Falta"/"Tenho"/"Repetida" to show only that
    // status (hiding the other two) and expand every team section.
    // Clicking the active one again clears the filter.
    el.legendFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const status = btn.dataset.status;
        activeStatusFilter = activeStatusFilter === status ? null : status;
        reflectStatusFilterButtons();
        // Text search and the legend status filter are mutually exclusive
        // view filters; clear any active search before applying the status
        // filter so the two never compose into stale hidden state.
        if (
          activeStatusFilter &&
          el.gridSearchInput &&
          el.gridSearchInput.value.trim()
        ) {
          el.gridSearchInput.value = "";
          applyGridFilter("");
        }
        applyStatusFilter();
      });
    });

    // Tab switching — every menu item declares its section via data-target
    const menuItems = document.querySelectorAll(".menu-item[data-target]");
    menuItems.forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.target));
    });

    // Toggle Dropdown Menu
    if (el.btnMenuToggle && el.dropdownMenu) {
      el.btnMenuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        el.dropdownMenu.classList.toggle("hidden");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!el.dropdownMenu.contains(e.target) && e.target !== el.btnMenuToggle) {
          el.dropdownMenu.classList.add("hidden");
        }
      });
    }

    // Open Share Modal
    el.btnOpenShareModal.addEventListener("click", () => {
      el.shareModal.classList.remove("hidden");
    });

    // Close Share Modal
    el.btnCloseShareModal.addEventListener("click", () => {
      el.shareModal.classList.add("hidden");
    });

    // Share Album Link for Import
    setupShareButton(el.btnShareImport, {
      copiedLabel: "✅ Link copiado!",
      buildShareOptions: () => {
        const code = el.myCodeTextarea.value;
        const shareUrl = `${window.location.origin}${window.location.pathname}?import=${encodeURIComponent(code)}`;
        return {
          clipboardText: shareUrl,
          shareData: {
            title: "Stickers Swap FWC 2026",
            text: "Confira as minhas figurinhas para importar o álbum!",
            url: shareUrl,
          },
        };
      },
    });

    // Share Album Link for Compare
    setupShareButton(el.btnShareCompare, {
      copiedLabel: "✅ Link copiado!",
      buildShareOptions: () => {
        const code = el.myCodeTextarea.value;
        const shareUrl = `${window.location.origin}${window.location.pathname}?compare=${encodeURIComponent(code)}`;
        return {
          clipboardText: shareUrl,
          shareData: {
            title: "Stickers Swap FWC 2026",
            text: "Confira as minhas figurinhas e vamos comparar nossos álbuns!",
            url: shareUrl,
          },
        };
      },
    });

    // Share Missing List
    setupShareButton(el.btnShareMissing, {
      copiedLabel: "✅ Lista copiada!",
      buildShareOptions: () => {
        const msg = generateShareText("missing");
        return {
          clipboardText: msg,
          shareData: { title: "Minhas Figurinhas Faltantes - Copa 2026", text: msg },
        };
      },
    });

    // Share Repeats List
    setupShareButton(el.btnShareRepeats, {
      copiedLabel: "✅ Lista copiada!",
      buildShareOptions: () => {
        const msg = generateShareText("repeats");
        return {
          clipboardText: msg,
          shareData: { title: "Minhas Figurinhas Repetidas - Copa 2026", text: msg },
        };
      },
    });

    // Confirm Import from Tab
    el.btnImportConfirm.addEventListener("click", () => {
      const code = el.importCodeTextarea.value.trim();
      if (importAlbumFromCode(code)) {
        alert("🎉 Álbum importado e restaurado com sucesso!");
        el.importCodeTextarea.value = "";
        switchTab("section-my-album");
      } else {
        alert(
          "⚠️ Código inválido! Por favor, cole o código no formato correto (ex: SA26|1|...)",
        );
      }
    });

    // Calculate Match
    el.btnCalculateMatch.addEventListener("click", calculateMatch);

    // Calculate Independent Match (two third-party albums)
    el.btnCalculateIndependentMatch.addEventListener("click", calculateIndependentMatch);

    // Share Whatsapp
    el.btnShareWhatsapp.addEventListener("click", shareTradeOnWhatsapp);

    // Update Album from Match
    el.btnUpdateAlbumFromMatch.addEventListener("click", updateAlbumFromMatch);

    // Swipe to navigate between tabs
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;
    const minSwipeDistance = 50;

    // Swipe order follows the dropdown menu order
    const sections = Array.from(menuItems, (btn) => btn.dataset.target);

    document.addEventListener("touchstart", (e) => {
      touchstartX = e.changedTouches[0].screenX;
      touchstartY = e.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (e) => {
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;
      handleSwipe();
    });

    function handleSwipe() {
      const diffX = touchendX - touchstartX;
      const diffY = touchendY - touchstartY;

      // Ensure the swipe is mostly horizontal and meets minimum distance
      if (Math.abs(diffX) < minSwipeDistance || Math.abs(diffX) <= Math.abs(diffY)) return;

      // Find active section
      const activeSection = document.querySelector(".tab-section.active");
      if (!activeSection) return;

      const currentIndex = sections.indexOf(activeSection.id);
      if (currentIndex === -1) return;

      if (diffX < 0) {
        // Swipe left -> go right (next)
        if (currentIndex < sections.length - 1) {
          switchTab(sections[currentIndex + 1]);
        }
      } else {
        // Swipe right -> go left (prev)
        if (currentIndex > 0) {
          switchTab(sections[currentIndex - 1]);
        }
      }
    }
  }

  function switchTab(sectionId) {
    // Toggle dropdown items active state
    document.querySelectorAll(".menu-item").forEach((btn) => {
      if (btn.dataset.target === sectionId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Toggle sections active state
    document.querySelectorAll(".tab-section").forEach((sect) => {
      if (sect.id === sectionId) {
        sect.classList.add("active");
      } else {
        sect.classList.remove("active");
      }
    });

    // Hide dropdown menu after selection
    if (el.dropdownMenu) {
      el.dropdownMenu.classList.add("hidden");
    }
  }

  /* ==========================================================================
       QUERY PARAMS HANDLING (URL SHARE LINKS)
       ========================================================================== */

  function checkQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // For backwards compatibility, 'partner' behaves like 'compare'
    const compareCode = urlParams.get("compare") || urlParams.get("partner");
    const importCode = urlParams.get("import");

    if (compareCode) {
      const parsedState = StickerParser.parseAlbumCode(compareCode);
      const transcribedText = generateFullText(parsedState);
      el.partnerCodeTextarea.value = transcribedText;
      switchTab("section-matching");
      calculateMatch();
    } else if (importCode) {
      const parsedState = StickerParser.parseAlbumCode(importCode);
      const transcribedText = generateFullText(parsedState);
      el.importCodeTextarea.value = transcribedText;
      switchTab("section-import");
    }
  }

  // Launch app
  init();
});
