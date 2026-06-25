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
    currentGroup: "FWC & CC",
    partnerState: null,
  };

  // Group definitions matching the 12 Copa groups plus FWC & CC
  const GROUPS = [
    { id: "FWC & CC", label: "FWC & CC" },
    { id: "Grupo A", label: "Grupo A" },
    { id: "Grupo B", label: "Grupo B" },
    { id: "Grupo C", label: "Grupo C" },
    { id: "Grupo D", label: "Grupo D" },
    { id: "Grupo E", label: "Grupo E" },
    { id: "Grupo F", label: "Grupo F" },
    { id: "Grupo G", label: "Grupo G" },
    { id: "Grupo H", label: "Grupo H" },
    { id: "Grupo I", label: "Grupo I" },
    { id: "Grupo J", label: "Grupo J" },
    { id: "Grupo K", label: "Grupo K" },
    { id: "Grupo L", label: "Grupo L" },
  ];

  // Local Storage Keys
  const LOCAL_STORAGE_KEY = "copamatch26_my_album_code";

  // DOM Elements
  const el = {
    title: document.getElementById("app-title"),
    statsCompletion: document.getElementById("stats-completion"),
    statsProgressFill: document.getElementById("stats-progress-fill"),
    statsRepeated: document.getElementById("stats-repeated"),
    tabMyAlbum: document.getElementById("menu-trigger-my-album"),
    tabMatching: document.getElementById("menu-trigger-matching"),
    tabImport: document.getElementById("menu-trigger-import"),
    tabStats: document.getElementById("menu-trigger-stats"),
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
    gridRangeSelector: document.getElementById("grid-range-selector"),
    gridSearchInput: document.getElementById("grid-search-input"),
    gridSearchClear: document.getElementById("grid-search-clear"),
    gridNoResults: document.getElementById("grid-no-results"),
    stickersGrid: document.getElementById("stickers-grid-container"),
    partnerCodeTextarea: document.getElementById("partner-code-textarea"),
    btnCalculateMatch: document.getElementById("btn-calculate-match"),
    matchResultsPanel: document.getElementById("match-results-panel"),
    matchEmptyPanel: document.getElementById("match-empty-panel"),
    matchSummarySubtitle: document.getElementById("match-summary-subtitle"),
    matchGiveList: document.getElementById("match-give-list"),
    matchReceiveList: document.getElementById("match-receive-list"),
    btnShareWhatsapp: document.getElementById("btn-share-whatsapp"),
    btnUpdateAlbumFromMatch: document.getElementById("btn-update-album-from-match"),
    importCodeTextarea: document.getElementById("import-code-textarea"),
    btnImportConfirm: document.getElementById("btn-import-confirm"),
  };

  /* ==========================================================================
       INITIALIZATION
       ========================================================================== */

  function init() {
    // 1. Load my album state from localStorage or initialize
    loadMyAlbumFromStorage();

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

  function renderStickerGrid() {
    el.stickersGrid.innerHTML = "";

    // Render Group title for FWC & CC
    const fwcCcDivider = document.createElement("div");
    fwcCcDivider.className = "group-title-divider";
    fwcCcDivider.dataset.group = "FWC & CC";

    const fwcCcTitleText = document.createElement("span");
    fwcCcTitleText.textContent = "FWC & CC";
    fwcCcDivider.appendChild(fwcCcTitleText);

    const fwcCcActions = document.createElement("div");
    fwcCcActions.className = "group-actions";

    const btnFwcCcUnfold = document.createElement("button");
    btnFwcCcUnfold.className = "group-action-btn btn-group-unfold";
    btnFwcCcUnfold.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>';
    btnFwcCcUnfold.title = "Expandir grupo";
    btnFwcCcUnfold.addEventListener("click", (e) => {
      e.stopPropagation();
      expandGroupTeams("FWC & CC");
    });

    const btnFwcCcFold = document.createElement("button");
    btnFwcCcFold.className = "group-action-btn btn-group-fold";
    btnFwcCcFold.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 18 5-5 5 5"/><path d="m7 11 5-5 5 5"/></svg>';
    btnFwcCcFold.title = "Recolher grupo";
    btnFwcCcFold.addEventListener("click", (e) => {
      e.stopPropagation();
      collapseGroupTeams("FWC & CC");
    });

    fwcCcActions.appendChild(btnFwcCcUnfold);
    fwcCcActions.appendChild(btnFwcCcFold);
    fwcCcDivider.appendChild(fwcCcActions);
    el.stickersGrid.appendChild(fwcCcDivider);

    // 1. Render FWC section
    const fwcSection = document.createElement("div");
    fwcSection.className = "team-section collapsed";
    fwcSection.dataset.sectionId = "FWC";
    fwcSection.dataset.teamCode = "FWC";
    fwcSection.dataset.teamName = "FIFA World Cup";
    fwcSection.dataset.groupName = "FWC & CC";

    const fwcOwned = getOwnedCountInRange(1, 20);
    const fwcRepeats = getRepeatedCountInRange(1, 20);
    const fwcHeader = document.createElement("div");
    fwcHeader.className =
      fwcOwned === 20
        ? "team-section-header team-complete"
        : "team-section-header";
    fwcHeader.innerHTML = `
            <div class="team-header-left">
                <span class="badge-icon badge-fwc">⭐</span>
                <span class="team-name" style="font-family: var(--font-display); font-weight:800; font-size:15px;">FWC</span>
            </div>
            <div class="team-header-right">
                <span class="team-progress">${fwcOwned}/20</span>
                <span class="team-repeats"${fwcRepeats === 0 ? " hidden" : ""}>${fwcRepeats}</span>
                <span class="chevron-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </div>
            <div class="team-progress-bar-container">
                <div class="team-progress-bar-fill" style="width: ${(fwcOwned / 20) * 100}%"></div>
            </div>
        `;

    const fwcGrid = document.createElement("div");
    fwcGrid.className = "stickers-grid";
    for (let i = 1; i <= 20; i++) {
      fwcGrid.appendChild(createStickerCell(i));
    }

    fwcSection.appendChild(fwcHeader);
    fwcSection.appendChild(fwcGrid);

    fwcHeader.addEventListener("click", () => {
      fwcSection.classList.toggle("collapsed");
    });

    el.stickersGrid.appendChild(fwcSection);

    // 2. Render CC section
    const ccSection = document.createElement("div");
    ccSection.className = "team-section collapsed";
    ccSection.dataset.sectionId = "CC";
    ccSection.dataset.teamCode = "CC";
    ccSection.dataset.teamName = "Coca-Cola";
    ccSection.dataset.groupName = "FWC & CC";

    const ccOwned = getOwnedCountInRange(21, 34);
    const ccRepeats = getRepeatedCountInRange(21, 34);
    const ccHeader = document.createElement("div");
    ccHeader.className =
      ccOwned === 14
        ? "team-section-header team-complete"
        : "team-section-header";
    ccHeader.innerHTML = `
            <div class="team-header-left">
                <span class="badge-icon badge-cc">🥤</span>
                <span class="team-name" style="font-family: var(--font-display); font-weight:800; font-size:15px;">CC</span>
            </div>
            <div class="team-header-right">
                <span class="team-progress">${ccOwned}/14</span>
                <span class="team-repeats"${ccRepeats === 0 ? " hidden" : ""}>${ccRepeats}</span>
                <span class="chevron-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </div>
            <div class="team-progress-bar-container">
                <div class="team-progress-bar-fill" style="width: ${(ccOwned / 14) * 100}%"></div>
            </div>
        `;

    const ccGrid = document.createElement("div");
    ccGrid.className = "stickers-grid";
    for (let i = 21; i <= 34; i++) {
      ccGrid.appendChild(createStickerCell(i));
    }

    ccSection.appendChild(ccHeader);
    ccSection.appendChild(ccGrid);

    ccHeader.addEventListener("click", () => {
      ccSection.classList.toggle("collapsed");
    });

    el.stickersGrid.appendChild(ccSection);

    // 3. Render all Group A to L Teams
    let lastGroup = null;
    StickerParser.TEAMS.forEach((team) => {
      const teamIdx = StickerParser.TEAMS.indexOf(team);
      const start = 35 + teamIdx * 20;
      const end = start + 19;

      // Insert Group title if it changed
      if (team.group !== lastGroup) {
        lastGroup = team.group;
        const groupTitle = document.createElement("div");
        groupTitle.className = "group-title-divider";
        groupTitle.dataset.group = team.group;

        const titleText = document.createElement("span");
        titleText.textContent = team.group;
        groupTitle.appendChild(titleText);

        const groupActions = document.createElement("div");
        groupActions.className = "group-actions";

        const btnGroupUnfold = document.createElement("button");
        btnGroupUnfold.className = "group-action-btn btn-group-unfold";
        btnGroupUnfold.innerHTML =
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>';
        btnGroupUnfold.title = "Expandir grupo";
        btnGroupUnfold.addEventListener("click", (e) => {
          e.stopPropagation();
          expandGroupTeams(team.group);
        });

        const btnGroupFold = document.createElement("button");
        btnGroupFold.className = "group-action-btn btn-group-fold";
        btnGroupFold.innerHTML =
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 18 5-5 5 5"/><path d="m7 11 5-5 5 5"/></svg>';
        btnGroupFold.title = "Recolher grupo";
        btnGroupFold.addEventListener("click", (e) => {
          e.stopPropagation();
          collapseGroupTeams(team.group);
        });

        groupActions.appendChild(btnGroupUnfold);
        groupActions.appendChild(btnGroupFold);
        groupTitle.appendChild(groupActions);

        el.stickersGrid.appendChild(groupTitle);
      }

      const section = document.createElement("div");
      section.className = "team-section collapsed";
      section.dataset.sectionId = team.code;
      section.dataset.teamCode = team.code;
      section.dataset.teamName = team.name;
      section.dataset.groupName = team.group;

      const ownedCount = getOwnedCountInRange(start, end);
      const repeatsCount = getRepeatedCountInRange(start, end);
      const header = document.createElement("div");
      header.className =
        ownedCount === 20
          ? "team-section-header team-complete"
          : "team-section-header";
      header.innerHTML = `
                <div class="team-header-left">
                    <img class="team-flag" src="https://flagcdn.com/${team.iso}.svg" alt="${team.name}" loading="lazy" width="20" height="14">
                    <span class="team-code">${team.code}</span>
                    <span class="team-name">${team.name}</span>
                </div>
                <div class="team-header-right">
                    <span class="team-progress">${ownedCount}/20</span>
                    <span class="team-repeats"${repeatsCount === 0 ? " hidden" : ""}>${repeatsCount}</span>
                    <span class="chevron-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
                </div>
                <div class="team-progress-bar-container">
                    <div class="team-progress-bar-fill" style="width: ${(ownedCount / 20) * 100}%"></div>
                </div>
            `;

      const grid = document.createElement("div");
      grid.className = "stickers-grid";

      for (let i = start; i <= end; i++) {
        const cell = createStickerCell(i);
        grid.appendChild(cell);
      }

      section.appendChild(header);
      section.appendChild(grid);

      header.addEventListener("click", () => {
        section.classList.toggle("collapsed");
      });

      el.stickersGrid.appendChild(section);
    });

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

  function parseFilterQuery(query) {
    const trimmed = query.trim();
    if (!trimmed) return null;

    const lower = trimmed.toLowerCase();
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
      const nameLower = team.name.toLowerCase();
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
      .querySelectorAll(".group-title-divider")
      .forEach((d) => d.classList.remove("hidden"));
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
      return;
    }

    if (clearBtn) clearBtn.style.display = "flex";
    if (noResultsEl) noResultsEl.classList.add("hidden");

    const { codes, numPart } = filterResult;

    // Hide all group dividers when filtering
    document
      .querySelectorAll(".group-title-divider")
      .forEach((d) => d.classList.add("hidden"));

    let firstHighlighted = null;

    document.querySelectorAll(".team-section").forEach((section) => {
      const sectionCode = section.dataset.sectionId;
      if (codes.includes(sectionCode)) {
        section.classList.remove("hidden");
        section.classList.remove("collapsed"); // expand matching team

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
      addBadge(cell, repeatedQty);
    } else if (isOwned) {
      cell.classList.add("owned");
    }

    cell.addEventListener("click", () => {
      handleStickerClick(i, cell);
    });

    return cell;
  }

  function handleStickerClick(id, cellElement) {
    const isOwned = state.myAlbum.owned.has(id);

    // Clean cell state
    cellElement.classList.remove("owned", "repeated");
    const badge = cellElement.querySelector(".sticker-badge");
    if (badge) badge.remove();

    if (!isOwned) {
      // Missing -> Owned
      state.myAlbum.owned.add(id);
      state.myAlbum.repeated.delete(id);
      cellElement.classList.add("owned");
    } else {
      // Owned/Repeated -> Missing
      state.myAlbum.owned.delete(id);
      state.myAlbum.repeated.delete(id);
    }

    // Save and Update UI
    saveMyAlbumToStorage();
    updateMyAlbumUI();

    const info = StickerParser.getStickerInfo(id);
    if (info) {
      updateSectionProgress(info.code);
    }
  }

  function handleIncrementClick(id, cellElement) {
    // If not owned, mark as owned first
    if (!state.myAlbum.owned.has(id)) {
      state.myAlbum.owned.add(id);
    }

    const currentQty = state.myAlbum.repeated.get(id) || 0;
    const newQty = currentQty + 1;
    state.myAlbum.repeated.set(id, newQty);

    cellElement.classList.remove("owned");
    cellElement.classList.add("repeated");

    let badge = cellElement.querySelector(".sticker-badge");
    if (badge) {
      badge.textContent = `+${newQty}`;
    } else {
      addBadge(cellElement, newQty);
    }

    saveMyAlbumToStorage();
    updateMyAlbumUI();

    const info = StickerParser.getStickerInfo(id);
    if (info) {
      updateSectionProgress(info.code);
    }
  }

  function handleDecrementClick(id, cellElement) {
    if (!state.myAlbum.owned.has(id)) return;

    const currentQty = state.myAlbum.repeated.get(id) || 0;
    if (currentQty > 0) {
      const newQty = currentQty - 1;
      if (newQty === 0) {
        state.myAlbum.repeated.delete(id);
        cellElement.classList.remove("repeated");
        cellElement.classList.add("owned");
        const badge = cellElement.querySelector(".sticker-badge");
        if (badge) badge.remove();
      } else {
        state.myAlbum.repeated.set(id, newQty);
        const badge = cellElement.querySelector(".sticker-badge");
        if (badge) badge.textContent = `+${newQty}`;
      }
    } else {
      // Dec from 0 repeats -> marks as missing
      state.myAlbum.owned.delete(id);
      state.myAlbum.repeated.delete(id);
      cellElement.classList.remove("owned", "repeated");
      const badge = cellElement.querySelector(".sticker-badge");
      if (badge) badge.remove();
    }

    saveMyAlbumToStorage();
    updateMyAlbumUI();

    const info = StickerParser.getStickerInfo(id);
    if (info) {
      updateSectionProgress(info.code);
    }
  }

  function updateSectionProgress(code) {
    const sectionEl = document.querySelector(
      `.team-section[data-section-id="${code}"]`,
    );
    if (!sectionEl) return;

    const progressEl = sectionEl.querySelector(".team-progress");
    if (!progressEl) return;

    let start, end;
    if (code === "FWC") {
      start = 1;
      end = 20;
    } else if (code === "CC") {
      start = 21;
      end = 34;
    } else {
      const team = StickerParser.TEAMS.find((t) => t.code === code);
      const teamIdx = StickerParser.TEAMS.indexOf(team);
      start = 35 + teamIdx * 20;
      end = start + 19;
    }

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

    const headerEl = sectionEl.querySelector(".team-section-header");
    if (headerEl) {
      if (ownedCount === total) {
        headerEl.classList.add("team-complete");
      } else {
        headerEl.classList.remove("team-complete");
      }
    }
  }

  function expandGroupTeams(groupName) {
    if (groupName === "FWC & CC") {
      const fwc = document.querySelector(
        '.team-section[data-section-id="FWC"]',
      );
      const cc = document.querySelector('.team-section[data-section-id="CC"]');
      if (fwc) fwc.classList.remove("collapsed");
      if (cc) cc.classList.remove("collapsed");
    } else {
      const groupTeams = StickerParser.TEAMS.filter(
        (t) => t.group === groupName,
      );
      groupTeams.forEach((team) => {
        const sect = document.querySelector(
          `.team-section[data-section-id="${team.code}"]`,
        );
        if (sect) sect.classList.remove("collapsed");
      });
    }
  }

  function collapseGroupTeams(groupName) {
    if (groupName === "FWC & CC") {
      const fwc = document.querySelector(
        '.team-section[data-section-id="FWC"]',
      );
      const cc = document.querySelector('.team-section[data-section-id="CC"]');
      if (fwc) fwc.classList.add("collapsed");
      if (cc) cc.classList.add("collapsed");
    } else {
      const groupTeams = StickerParser.TEAMS.filter(
        (t) => t.group === groupName,
      );
      groupTeams.forEach((team) => {
        const sect = document.querySelector(
          `.team-section[data-section-id="${team.code}"]`,
        );
        if (sect) sect.classList.add("collapsed");
      });
    }
  }

  function addBadge(element, qty) {
    const badge = document.createElement("span");
    badge.className = "sticker-badge";
    badge.textContent = `+${qty}`;
    element.appendChild(badge);
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

  function renderMatchResults(match) {
    // Hide empty state, show results panel
    el.matchEmptyPanel.classList.add("hidden");
    el.matchResultsPanel.classList.remove("hidden");

    // Update counts
    const totalSwaps = match.give.length + match.receive.length;
    el.matchSummarySubtitle.textContent = `Vocês podem negociar até ${totalSwaps} figurinha(s)!`;

    // Render Give List
    el.matchGiveList.innerHTML = "";
    if (match.give.length > 0) {
      match.give.forEach((id) => {
        const info = StickerParser.getStickerInfo(id);
        const badge = document.createElement("span");
        badge.className = "match-sticker-badge";
        badge.textContent = info ? `${info.code} ${info.relativeNumber}` : id;
        if (info) {
          badge.title = `${info.name} - #${info.relativeNumber}`;
        }
        el.matchGiveList.appendChild(badge);
      });
      // Update title header count
      el.matchGiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ DÁ (${match.give.length})`;
    } else {
      el.matchGiveList.innerHTML =
        '<span class="col-desc">Nenhuma figurinha para dar.</span>';
      el.matchGiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ DÁ (0)`;
    }

    // Render Receive List
    el.matchReceiveList.innerHTML = "";
    if (match.receive.length > 0) {
      match.receive.forEach((id) => {
        const info = StickerParser.getStickerInfo(id);
        const badge = document.createElement("span");
        badge.className = "match-sticker-badge";
        badge.textContent = info ? `${info.code} ${info.relativeNumber}` : id;
        if (info) {
          badge.title = `${info.name} - #${info.relativeNumber}`;
        }
        el.matchReceiveList.appendChild(badge);
      });
      // Update title header count
      el.matchReceiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ RECEBE (${match.receive.length})`;
    } else {
      el.matchReceiveList.innerHTML =
        '<span class="col-desc">Nenhuma figurinha para receber.</span>';
      el.matchReceiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ RECEBE (0)`;
    }

    // Update button visibility
    if (totalSwaps > 0) {
      el.btnUpdateAlbumFromMatch.classList.remove("hidden");
    } else {
      el.btnUpdateAlbumFromMatch.classList.add("hidden");
    }

    // Store matches on button to build whatsapp link later
    el.btnShareWhatsapp.dataset.give = match.give.join(",");
    el.btnShareWhatsapp.dataset.receive = match.receive.join(",");
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

  function shareTradeOnWhatsapp() {

    const giveStr = el.btnShareWhatsapp.dataset.give || "";
    const receiveStr = el.btnShareWhatsapp.dataset.receive || "";

    const giveArr = giveStr ? giveStr.split(",") : [];
    const receiveArr = receiveStr ? receiveStr.split(",") : [];

    // Build neat summary message matching requested format
    let msg = `Stickers Swap FWC 2026 - https://dhaalves.github.io/copa-2026-stickers-swap/\n\n`;

    if (giveArr.length > 0) {
      msg += `*Repetidas minha que você não tem (${giveArr.length}):*\n`;
      msg += formatStickerGroups(giveArr);
    } else {
      msg += `*Repetidas minha que você não tem (0):*\nNenhuma\n`;
    }

    msg += `\n`;

    if (receiveArr.length > 0) {
      msg += `*Repetidas suas que eu não tenho (${receiveArr.length}):*\n`;
      msg += formatStickerGroups(receiveArr);
    } else {
      msg += `*Repetidas suas que eu não tenho (0):*\nNenhuma\n`;
    }

    // 1. Copy to clipboard
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

          // 2. Open WhatsApp Share Link
          const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
          window.open(url, "_blank");
        }, 1500);
      })
      .catch((err) => {
        console.error("Erro ao copiar para clipboard:", err);
        // Fallback: Open whatsapp directly anyway
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
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
    const teamOrder = ["FWC", ...StickerParser.TEAMS.map((t) => t.code), "CC"];

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
      msg += formatStickerGroups(repeatIds, stateParam ? stateParam.repeated : state.myAlbum.repeated);
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

  /* ==========================================================================
       EVENT LISTENERS & NAVIGATION
       ========================================================================== */

  function bindEvents() {
    // Grid filter (team / team+number)
    if (el.gridSearchInput) {
      el.gridSearchInput.addEventListener("input", (e) => {
        applyGridFilter(e.target.value);
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

    // Tab switching
    if (el.tabMyAlbum) {
      el.tabMyAlbum.addEventListener("click", () => switchTab("section-my-album"));
    }
    if (el.tabStats) {
      el.tabStats.addEventListener("click", () => switchTab("section-stats"));
    }
    if (el.tabMatching) {
      el.tabMatching.addEventListener("click", () => switchTab("section-matching"));
    }
    if (el.tabImport) {
      el.tabImport.addEventListener("click", () => switchTab("section-import"));
    }

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

    // Copy Share Code (Still present in markup though not in header)
    if (el.btnCopyMyCode) {
      el.btnCopyMyCode.addEventListener("click", () => {
        const code = el.myCodeTextarea.value;
        navigator.clipboard
          .writeText(code)
          .then(() => {
            const originalNodes = [...el.btnCopyMyCode.childNodes];
            el.btnCopyMyCode.textContent = "✅";
            el.btnCopyMyCode.style.borderColor = "var(--accent-primary)";
            el.btnCopyMyCode.style.background = "var(--accent-primary-glow)";
            setTimeout(() => {
              el.btnCopyMyCode.replaceChildren(...originalNodes);
              el.btnCopyMyCode.style.borderColor = "";
              el.btnCopyMyCode.style.background = "";
            }, 1500);
          })
          .catch((err) => {
            console.error("Falha ao copiar código:", err);
          });
      });
    }

    // Share Album Link for Import
    el.btnShareImport.addEventListener("click", () => {
      const code = el.myCodeTextarea.value;
      const shareUrl = `${window.location.origin}${window.location.pathname}?import=${encodeURIComponent(code)}`;

      const performClipboardFallback = () => {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            const originalNodes = [...el.btnShareImport.childNodes];
            el.btnShareImport.textContent = "✅ Link copiado!";
            el.btnShareImport.style.borderColor = "var(--accent-primary)";
            el.btnShareImport.style.background = "var(--accent-primary-glow)";
            setTimeout(() => {
              el.btnShareImport.replaceChildren(...originalNodes);
              el.btnShareImport.style.borderColor = "";
              el.btnShareImport.style.background = "";
              el.shareModal.classList.add("hidden");
            }, 1500);
          })
          .catch((err) => {
            console.error("Falha ao copiar link:", err);
          });
      };

      if (navigator.share) {
        navigator
          .share({
            title: "Stickers Swap FWC 2026",
            text: "Confira as minhas figurinhas para importar o álbum!",
            url: shareUrl,
          })
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

    // Share Album Link for Compare
    el.btnShareCompare.addEventListener("click", () => {
      const code = el.myCodeTextarea.value;
      const shareUrl = `${window.location.origin}${window.location.pathname}?compare=${encodeURIComponent(code)}`;

      const performClipboardFallback = () => {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            const originalNodes = [...el.btnShareCompare.childNodes];
            el.btnShareCompare.textContent = "✅ Link copiado!";
            el.btnShareCompare.style.borderColor = "var(--accent-primary)";
            el.btnShareCompare.style.background = "var(--accent-primary-glow)";
            setTimeout(() => {
              el.btnShareCompare.replaceChildren(...originalNodes);
              el.btnShareCompare.style.borderColor = "";
              el.btnShareCompare.style.background = "";
              el.shareModal.classList.add("hidden");
            }, 1500);
          })
          .catch((err) => {
            console.error("Falha ao copiar link:", err);
          });
      };

      if (navigator.share) {
        navigator
          .share({
            title: "Stickers Swap FWC 2026",
            text: "Confira as minhas figurinhas e vamos comparar nossos álbuns!",
            url: shareUrl,
          })
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

    // Share Missing List
    el.btnShareMissing.addEventListener("click", () => {
      const msg = generateShareText("missing");

      const performClipboardFallback = () => {
        navigator.clipboard
          .writeText(msg)
          .then(() => {
            const originalNodes = [...el.btnShareMissing.childNodes];
            el.btnShareMissing.textContent = "✅ Lista copiada!";
            el.btnShareMissing.style.borderColor = "var(--accent-primary)";
            el.btnShareMissing.style.background = "var(--accent-primary-glow)";
            setTimeout(() => {
              el.btnShareMissing.replaceChildren(...originalNodes);
              el.btnShareMissing.style.borderColor = "";
              el.btnShareMissing.style.background = "";
              el.shareModal.classList.add("hidden");
            }, 1500);
          })
          .catch((err) => {
            console.error("Falha ao copiar lista:", err);
          });
      };

      if (navigator.share) {
        navigator
          .share({
            title: "Minhas Figurinhas Faltantes - Copa 2026",
            text: msg,
          })
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

    // Share Repeats List
    el.btnShareRepeats.addEventListener("click", () => {
      const msg = generateShareText("repeats");

      const performClipboardFallback = () => {
        navigator.clipboard
          .writeText(msg)
          .then(() => {
            const originalNodes = [...el.btnShareRepeats.childNodes];
            el.btnShareRepeats.textContent = "✅ Lista copiada!";
            el.btnShareRepeats.style.borderColor = "var(--accent-primary)";
            el.btnShareRepeats.style.background = "var(--accent-primary-glow)";
            setTimeout(() => {
              el.btnShareRepeats.replaceChildren(...originalNodes);
              el.btnShareRepeats.style.borderColor = "";
              el.btnShareRepeats.style.background = "";
              el.shareModal.classList.add("hidden");
            }, 1500);
          })
          .catch((err) => {
            console.error("Falha ao copiar lista:", err);
          });
      };

      if (navigator.share) {
        navigator
          .share({
            title: "Minhas Figurinhas Repetidas - Copa 2026",
            text: msg,
          })
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

    const sections = [
      "section-my-album",
      "section-stats",
      "section-matching",
      "section-import"
    ];

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
