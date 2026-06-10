/**
 * UI Controller for Copa Match 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    const state = {
        myAlbum: {
            albumId: StickerParser.ALBUM_ID,
            version: StickerParser.VERSION,
            owned: new Set(),
            repeated: new Map()
        },
        currentGroup: 'FWC & CC',
        partnerState: null
    };

    // Group definitions matching the 12 Copa groups plus FWC & CC
    const GROUPS = [
        { id: 'FWC & CC', label: 'FWC & CC' },
        { id: 'Grupo A', label: 'Grupo A' },
        { id: 'Grupo B', label: 'Grupo B' },
        { id: 'Grupo C', label: 'Grupo C' },
        { id: 'Grupo D', label: 'Grupo D' },
        { id: 'Grupo E', label: 'Grupo E' },
        { id: 'Grupo F', label: 'Grupo F' },
        { id: 'Grupo G', label: 'Grupo G' },
        { id: 'Grupo H', label: 'Grupo H' },
        { id: 'Grupo I', label: 'Grupo I' },
        { id: 'Grupo J', label: 'Grupo J' },
        { id: 'Grupo K', label: 'Grupo K' },
        { id: 'Grupo L', label: 'Grupo L' }
    ];

    // Local Storage Keys
    const LOCAL_STORAGE_KEY = 'copamatch26_my_album_code';

    // DOM Elements
    const el = {
        title: document.getElementById('app-title'),
        statsCompletion: document.getElementById('stats-completion'),
        statsProgressFill: document.getElementById('stats-progress-fill'),
        statsRepeated: document.getElementById('stats-repeated'),
        tabMyAlbum: document.getElementById('tab-trigger-my-album'),
        tabMatching: document.getElementById('tab-trigger-matching'),
        sectionMyAlbum: document.getElementById('section-my-album'),
        sectionMatching: document.getElementById('section-matching'),
        myCodeTextarea: document.getElementById('my-code-textarea'),
        btnCopyMyCode: document.getElementById('btn-copy-my-code'),
        btnImportMyCode: document.getElementById('btn-import-my-code'),
        gridRangeSelector: document.getElementById('grid-range-selector'),
        stickersGrid: document.getElementById('stickers-grid-container'),
        partnerCodeTextarea: document.getElementById('partner-code-textarea'),
        btnCalculateMatch: document.getElementById('btn-calculate-match'),
        matchResultsPanel: document.getElementById('match-results-panel'),
        matchEmptyPanel: document.getElementById('match-empty-panel'),
        matchSummarySubtitle: document.getElementById('match-summary-subtitle'),
        matchGiveList: document.getElementById('match-give-list'),
        matchReceiveList: document.getElementById('match-receive-list'),
        btnShareWhatsapp: document.getElementById('btn-share-whatsapp'),
        importModalBackdrop: document.getElementById('import-modal-backdrop'),
        importCodeTextarea: document.getElementById('import-code-textarea'),
        btnModalCancel: document.getElementById('btn-modal-cancel'),
        btnModalConfirm: document.getElementById('btn-modal-confirm')
    };

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */

    function init() {
        // 1. Generate range buttons
        renderRangeSelector();

        // 2. Load my album state from localStorage or initialize
        loadMyAlbumFromStorage();

        // 3. Render grid for the first range
        renderStickerGrid();

        // 4. Update Header and Share textareas
        updateMyAlbumUI();

        // 5. Setup event listeners
        bindEvents();

        // 6. Check URL query params for shared partner codes
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
            repeated: new Map()
        };
    }

    function importAlbumFromCode(codeStr) {
        if (!codeStr || !codeStr.trim()) return false;
        try {
            const parsed = StickerParser.parseAlbumCode(codeStr);
            // Quick validation of format
            if (parsed.owned.size === 0 && parsed.repeated.size === 0 && !codeStr.includes('|')) {
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

    function renderRangeSelector() {
        el.gridRangeSelector.innerHTML = '';
        GROUPS.forEach(group => {
            const btn = document.createElement('button');
            btn.className = `range-btn ${group.id === state.currentGroup ? 'active' : ''}`;
            btn.textContent = group.label;
            btn.dataset.group = group.id;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentGroup = group.id;
                renderStickerGrid();
            });
            el.gridRangeSelector.appendChild(btn);
        });
    }

    function renderStickerGrid() {
        el.stickersGrid.innerHTML = '';
        
        if (state.currentGroup === 'FWC & CC') {
            // 1. Render FWC section
            const fwcSection = document.createElement('div');
            fwcSection.className = 'team-section';
            
            const fwcOwned = getOwnedCountInRange(1, 20);
            const fwcHeader = document.createElement('div');
            fwcHeader.className = 'team-section-header';
            fwcHeader.innerHTML = `
                <div class="team-header-left">
                    <span class="badge-icon badge-fwc">⭐</span>
                    <span class="team-name" style="font-family: var(--font-display); font-weight:800; font-size:15px;">FWC</span>
                </div>
                <span class="team-progress">${fwcOwned}/20</span>
            `;
            
            const fwcGrid = document.createElement('div');
            fwcGrid.className = 'stickers-grid';
            for (let i = 1; i <= 20; i++) {
                fwcGrid.appendChild(createStickerCell(i));
            }
            
            fwcSection.appendChild(fwcHeader);
            fwcSection.appendChild(fwcGrid);
            el.stickersGrid.appendChild(fwcSection);

            // 2. Render CC section
            const ccSection = document.createElement('div');
            ccSection.className = 'team-section';
            
            const ccOwned = getOwnedCountInRange(21, 34);
            const ccHeader = document.createElement('div');
            ccHeader.className = 'team-section-header';
            ccHeader.innerHTML = `
                <div class="team-header-left">
                    <span class="badge-icon badge-cc">🥤</span>
                    <span class="team-name" style="font-family: var(--font-display); font-weight:800; font-size:15px;">CC</span>
                </div>
                <span class="team-progress">${ccOwned}/14</span>
            `;
            
            const ccGrid = document.createElement('div');
            ccGrid.className = 'stickers-grid';
            for (let i = 21; i <= 34; i++) {
                ccGrid.appendChild(createStickerCell(i));
            }
            
            ccSection.appendChild(ccHeader);
            ccSection.appendChild(ccGrid);
            el.stickersGrid.appendChild(ccSection);
        } else {
            const groupTeams = StickerParser.TEAMS.filter(t => t.group === state.currentGroup);
            
            groupTeams.forEach(team => {
                const teamIdx = StickerParser.TEAMS.indexOf(team);
                const start = 35 + teamIdx * 20;
                const end = start + 19;
                
                const section = document.createElement('div');
                section.className = 'team-section';
                
                const ownedCount = getOwnedCountInRange(start, end);
                const header = document.createElement('div');
                header.className = 'team-section-header';
                header.innerHTML = `
                    <div class="team-header-left">
                        <span class="team-code">${team.code}</span>
                        <span class="team-name">${team.name}</span>
                    </div>
                    <span class="team-progress">${ownedCount}/20</span>
                `;
                
                const grid = document.createElement('div');
                grid.className = 'stickers-grid';
                
                for (let i = start; i <= end; i++) {
                    const cell = createStickerCell(i);
                    grid.appendChild(cell);
                }
                
                section.appendChild(header);
                section.appendChild(grid);
                el.stickersGrid.appendChild(section);
            });
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

    function createStickerCell(i) {
        const cell = document.createElement('div');
        cell.className = 'sticker-cell';
        
        const info = StickerParser.getStickerInfo(i);
        cell.dataset.id = i;
        if (info) {
            cell.title = `${info.code} #${info.relativeNumber} (Álbum: ${i})`;
        }

        // Create main label span for the sticker number
        const label = document.createElement('span');
        label.className = 'sticker-label';
        label.textContent = info ? info.relativeNumber : i;
        cell.appendChild(label);

        const isOwned = state.myAlbum.owned.has(i);
        const repeatedQty = state.myAlbum.repeated.get(i) || 0;

        // Create the controls container
        const controls = document.createElement('div');
        controls.className = 'cell-controls';

        const btnDec = document.createElement('button');
        btnDec.className = 'control-btn btn-dec';
        btnDec.textContent = '-';
        btnDec.title = 'Remover repetida / Marcar como não possuído';
        btnDec.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDecrementClick(i, cell);
        });

        const btnInc = document.createElement('button');
        btnInc.className = 'control-btn btn-inc';
        btnInc.textContent = '+';
        btnInc.title = 'Adicionar repetida';
        btnInc.addEventListener('click', (e) => {
            e.stopPropagation();
            handleIncrementClick(i, cell);
        });

        controls.appendChild(btnDec);
        controls.appendChild(btnInc);
        cell.appendChild(controls);

        if (repeatedQty > 0) {
            cell.classList.add('repeated');
            addBadge(cell, repeatedQty);
        } else if (isOwned) {
            cell.classList.add('owned');
        }

        cell.addEventListener('click', () => {
            handleStickerClick(i, cell);
        });

        return cell;
    }

    function handleStickerClick(id, cellElement) {
        const isOwned = state.myAlbum.owned.has(id);

        // Clean cell state
        cellElement.classList.remove('owned', 'repeated');
        const badge = cellElement.querySelector('.sticker-badge');
        if (badge) badge.remove();

        if (!isOwned) {
            // Missing -> Owned
            state.myAlbum.owned.add(id);
            state.myAlbum.repeated.delete(id);
            cellElement.classList.add('owned');
        } else {
            // Owned/Repeated -> Missing
            state.myAlbum.owned.delete(id);
            state.myAlbum.repeated.delete(id);
        }

        // Save and Update UI
        saveMyAlbumToStorage();
        updateMyAlbumUI();
    }

    function handleIncrementClick(id, cellElement) {
        // If not owned, mark as owned first
        if (!state.myAlbum.owned.has(id)) {
            state.myAlbum.owned.add(id);
        }

        const currentQty = state.myAlbum.repeated.get(id) || 0;
        const newQty = currentQty + 1;
        state.myAlbum.repeated.set(id, newQty);

        cellElement.classList.remove('owned');
        cellElement.classList.add('repeated');

        let badge = cellElement.querySelector('.sticker-badge');
        if (badge) {
            badge.textContent = `+${newQty}`;
        } else {
            addBadge(cellElement, newQty);
        }

        saveMyAlbumToStorage();
        updateMyAlbumUI();
    }

    function handleDecrementClick(id, cellElement) {
        if (!state.myAlbum.owned.has(id)) return;

        const currentQty = state.myAlbum.repeated.get(id) || 0;
        if (currentQty > 0) {
            const newQty = currentQty - 1;
            if (newQty === 0) {
                state.myAlbum.repeated.delete(id);
                cellElement.classList.remove('repeated');
                cellElement.classList.add('owned');
                const badge = cellElement.querySelector('.sticker-badge');
                if (badge) badge.remove();
            } else {
                state.myAlbum.repeated.set(id, newQty);
                const badge = cellElement.querySelector('.sticker-badge');
                if (badge) badge.textContent = `+${newQty}`;
            }
        } else {
            // Dec from 0 repeats -> marks as missing
            state.myAlbum.owned.delete(id);
            state.myAlbum.repeated.delete(id);
            cellElement.classList.remove('owned', 'repeated');
            const badge = cellElement.querySelector('.sticker-badge');
            if (badge) badge.remove();
        }

        saveMyAlbumToStorage();
        updateMyAlbumUI();
    }

    function addBadge(element, qty) {
        const badge = document.createElement('span');
        badge.className = 'sticker-badge';
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
        el.statsCompletion.textContent = `${ownedCount} / ${total}`;
        const percentage = (ownedCount / total) * 100;
        el.statsProgressFill.style.width = `${percentage}%`;
        el.statsRepeated.textContent = repeatedCount;

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
            const match = StickerParser.matchAlbums(state.myAlbum, state.partnerState);

            renderMatchResults(match);
        } catch (err) {
            alert("Não foi possível processar o código do parceiro. Verifique se copiou corretamente.");
            console.error(err);
        }
    }

    function renderMatchResults(match) {
        // Hide empty state, show results panel
        el.matchEmptyPanel.classList.add('hidden');
        el.matchResultsPanel.classList.remove('hidden');

        // Update counts
        const totalSwaps = match.give.length + match.receive.length;
        el.matchSummarySubtitle.textContent = `Vocês podem negociar até ${totalSwaps} figurinha(s)!`;

        // Render Give List
        el.matchGiveList.innerHTML = '';
        if (match.give.length > 0) {
            match.give.forEach(id => {
                const info = StickerParser.getStickerInfo(id);
                const badge = document.createElement('span');
                badge.className = 'match-sticker-badge';
                badge.textContent = info ? `${info.code} ${id}` : id;
                if (info) {
                    badge.title = `${info.name} - #${info.relativeNumber}`;
                }
                el.matchGiveList.appendChild(badge);
            });
            // Update title header count
            el.matchGiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ DÁ (${match.give.length})`;
        } else {
            el.matchGiveList.innerHTML = '<span class="col-desc">Nenhuma figurinha para dar.</span>';
            el.matchGiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ DÁ (0)`;
        }

        // Render Receive List
        el.matchReceiveList.innerHTML = '';
        if (match.receive.length > 0) {
            match.receive.forEach(id => {
                const info = StickerParser.getStickerInfo(id);
                const badge = document.createElement('span');
                badge.className = 'match-sticker-badge';
                badge.textContent = info ? `${info.code} ${id}` : id;
                if (info) {
                    badge.title = `${info.name} - #${info.relativeNumber}`;
                }
                el.matchReceiveList.appendChild(badge);
            });
            // Update title header count
            el.matchReceiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ RECEBE (${match.receive.length})`;
        } else {
            el.matchReceiveList.innerHTML = '<span class="col-desc">Nenhuma figurinha para receber.</span>';
            el.matchReceiveList.previousElementSibling.previousElementSibling.textContent = `Figurinhas que VOCÊ RECEBE (0)`;
        }

        // Store matches on button to build whatsapp link later
        el.btnShareWhatsapp.dataset.give = match.give.join(',');
        el.btnShareWhatsapp.dataset.receive = match.receive.join(',');
    }

    function shareTradeOnWhatsapp() {
        const giveStr = el.btnShareWhatsapp.dataset.give || '';
        const receiveStr = el.btnShareWhatsapp.dataset.receive || '';

        const giveArr = giveStr ? giveStr.split(',') : [];
        const receiveArr = receiveStr ? receiveStr.split(',') : [];

        // Build neat summary message
        let msg = `*Copa Match 2026 - Sugestão de Troca* ⚽\n\n`;
        msg += `🤝 Encontrei combinações interessantes para trocarmos!\n\n`;

        if (giveArr.length > 0) {
            const giveFormatted = giveArr.map(id => {
                const info = StickerParser.getStickerInfo(parseInt(id, 10));
                return info ? `${info.code} ${id}` : id;
            });
            msg += `*Eu te dou* (${giveArr.length} itens):\n`;
            msg += `👉 ${giveFormatted.join(', ')}\n\n`;
        } else {
            msg += `*Eu te dou*:\n👉 Nenhuma repetida que você precise\n\n`;
        }

        if (receiveArr.length > 0) {
            const receiveFormatted = receiveArr.map(id => {
                const info = StickerParser.getStickerInfo(parseInt(id, 10));
                return info ? `${info.code} ${id}` : id;
            });
            msg += `*Eu recebo de você* (${receiveArr.length} itens):\n`;
            msg += `👉 ${receiveFormatted.join(', ')}\n\n`;
        } else {
            msg += `*Eu recebo de você*:\n👉 Nenhuma repetida que eu precise\n\n`;
        }

        msg += `Gerado de forma rápida e local no aplicativo *Copa Match 26*.`;

        // 1. Copy to clipboard
        navigator.clipboard.writeText(msg).then(() => {
            // Temporary button state change
            const originalHTML = el.btnShareWhatsapp.innerHTML;
            el.btnShareWhatsapp.innerHTML = '<span>✅ Copiado para a Área de Transferência!</span>';
            
            setTimeout(() => {
                el.btnShareWhatsapp.innerHTML = originalHTML;
                
                // 2. Open WhatsApp Share Link
                const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
                window.open(url, '_blank');
            }, 1500);
        }).catch(err => {
            console.error("Erro ao copiar para clipboard:", err);
            // Fallback: Open whatsapp directly anyway
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
        });
    }

    /* ==========================================================================
       EVENT LISTENERS & NAVIGATION
       ========================================================================== */

    function bindEvents() {
        // Tab switching
        el.tabMyAlbum.addEventListener('click', () => switchTab('section-my-album'));
        el.tabMatching.addEventListener('click', () => switchTab('section-matching'));

        // Copy Share Code
        el.btnCopyMyCode.addEventListener('click', () => {
            const code = el.myCodeTextarea.value;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = el.btnCopyMyCode.textContent;
                el.btnCopyMyCode.textContent = "Copiado!";
                el.btnCopyMyCode.classList.add('btn-primary');
                el.btnCopyMyCode.classList.remove('btn-secondary');
                setTimeout(() => {
                    el.btnCopyMyCode.textContent = originalText;
                    el.btnCopyMyCode.classList.add('btn-secondary');
                    el.btnCopyMyCode.classList.remove('btn-primary');
                }, 1500);
            }).catch(err => {
                console.error("Falha ao copiar código:", err);
            });
        });

        // Open Import Modal
        el.btnImportMyCode.addEventListener('click', () => {
            el.importCodeTextarea.value = '';
            el.importModalBackdrop.classList.remove('hidden');
            el.importCodeTextarea.focus();
        });

        // Close Import Modal
        el.btnModalCancel.addEventListener('click', () => {
            el.importModalBackdrop.classList.add('hidden');
        });

        el.importModalBackdrop.addEventListener('click', (e) => {
            if (e.target === el.importModalBackdrop) {
                el.importModalBackdrop.classList.add('hidden');
            }
        });

        // Confirm Import Modal
        el.btnModalConfirm.addEventListener('click', () => {
            const code = el.importCodeTextarea.value.trim();
            if (importAlbumFromCode(code)) {
                el.importModalBackdrop.classList.add('hidden');
            } else {
                alert("Código inválido! Por favor, cole o código no formato correto (ex: SA26|1|...)");
            }
        });

        // Calculate Match
        el.btnCalculateMatch.addEventListener('click', calculateMatch);

        // Share Whatsapp
        el.btnShareWhatsapp.addEventListener('click', shareTradeOnWhatsapp);
    }

    function switchTab(sectionId) {
        // Toggle tabs active state
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.target === sectionId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle sections active state
        document.querySelectorAll('.tab-section').forEach(sect => {
            if (sect.id === sectionId) {
                sect.classList.add('active');
            } else {
                sect.classList.remove('active');
            }
        });
    }

    /* ==========================================================================
       QUERY PARAMS HANDLING (URL SHARE LINKS)
       ========================================================================== */

    function checkQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // check if sharing partner code (which is our friend's repeats list)
        const partnerCode = urlParams.get('partner');
        if (partnerCode) {
            el.partnerCodeTextarea.value = partnerCode;
            switchTab('section-matching');
            calculateMatch();
            
            // Clean up the URL so reloading doesn't prompt again or keep it dirty
            // window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Launch app
    init();
});
