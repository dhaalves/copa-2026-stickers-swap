const fs = require('fs');
const path = require('path');

// Mock a lightweight browser DOM environment
global.window = {};
global.document = {
    listeners: {},
    addEventListener(event, callback) {
        this.listeners[event] = callback;
    },
    getElementById(id) {
        return {
            id,
            value: '',
            addEventListener(event, callback) {
                this['on' + event] = callback;
            },
            classList: {
                add: () => {},
                remove: () => {}
            },
            style: {}
        };
    },
    querySelectorAll(selector) {
        return [];
    }
};

// Mock StickerParser
global.StickerParser = require('./js/parser');

// Load app.js code by executing it in a sandbox or reading and replacing DOMContentLoaded
let appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');

// Let's run a simulated test of the filter logic directly
function stripAccents(str) {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isMatch(sect, query) {
    const teamCode = stripAccents(sect.dataset.teamCode || '').toLowerCase();
    const teamName = stripAccents(sect.dataset.teamName || '').toLowerCase();
    const groupName = stripAccents(sect.dataset.groupName || '').toLowerCase();
    
    const groupEn = groupName.replace('grupo', 'group');
    
    // 1. Team Code match (prefix match, e.g. "me" or "mex" matches "mex")
    if (teamCode.startsWith(query)) {
        return true;
    }
    
    // 2. Team Name match starting at word boundary (e.g. "costa" in "costa do marfim", "herzegovina" in "bosnia-herzegovina")
    const index = teamName.indexOf(query);
    if (index === 0 || (index > 0 && (teamName[index - 1] === ' ' || teamName[index - 1] === '-'))) {
        return true;
    }
    
    // 3. Group match (e.g. "grupo a", "group a", "fwc & cc")
    const isGroupQuery = query.startsWith('grupo') || 
                         query.startsWith('group') || 
                         query === 'fwc & cc' || 
                         query === 'fwc e cc' || 
                         query === 'fwc and cc';
                         
    if (isGroupQuery) {
        if (query === 'grupo' || query === 'group') {
            return true;
        }
        
        // Normalize suffixes (e.g. "fwc & cc" -> "fwc and cc")
        const cleanSuffix = (str) => {
            return str.replace(/^(grupo|group)\s+/, '')
                      .replace(/\s*&\s*/g, ' and ')
                      .replace(/\s+e\s+/g, ' and ')
                      .trim();
        };
        
        const groupSuffixClean = cleanSuffix(groupName);
        const querySuffixClean = cleanSuffix(query);
        
        if (groupSuffixClean === querySuffixClean) {
            return true;
        }
        
        // Check if query suffix matches any word in the group suffix (e.g. "cc" in "fwc and cc")
        const groupSuffixWords = groupSuffixClean.split(/[^a-z0-9]+/);
        if (groupSuffixWords.includes(querySuffixClean)) {
            return true;
        }
    }
    
    return false;
}

// Let's run a simulated test of the filter logic directly
function simulateFilter(queryText) {
    console.log(`\n--- Simulating Search Filter for query: "${queryText}" ---`);
    const query = stripAccents(queryText.trim().toLowerCase());
    
    // Mock 50 sections
    const sections = [];
    
    // FWC
    sections.push({
        id: 'FWC',
        classList: new Set(['team-section', 'collapsed']),
        dataset: { sectionId: 'FWC', teamCode: 'FWC', teamName: 'FIFA World Cup', groupName: 'FWC & CC' }
    });
    
    // CC
    sections.push({
        id: 'CC',
        classList: new Set(['team-section', 'collapsed']),
        dataset: { sectionId: 'CC', teamCode: 'CC', teamName: 'Coca-Cola', groupName: 'FWC & CC' }
    });
    
    // Teams (MEX, RSA, BRA, etc.)
    StickerParser.TEAMS.forEach(team => {
        sections.push({
            id: team.code,
            classList: new Set(['team-section', 'collapsed']),
            dataset: { sectionId: team.code, teamCode: team.code, teamName: team.name, groupName: team.group }
        });
    });

    // Mock dividers
    const dividers = [];
    dividers.push({ group: 'FWC & CC', classList: new Set(['group-title-divider']), dataset: { group: 'FWC & CC' } });
    StickerParser.TEAMS.forEach(team => {
        if (!dividers.some(d => d.group === team.group)) {
            dividers.push({ group: team.group, classList: new Set(['group-title-divider']), dataset: { group: team.group } });
        }
    });

    // 1. Run Section filtering
    sections.forEach(sect => {
        if (isMatch(sect, query)) {
            sect.classList.delete('hidden');
            sect.classList.delete('collapsed');
        } else {
            sect.classList.add('hidden');
        }
    });

    // 2. Run Divider filtering
    dividers.forEach(divider => {
        const groupName = divider.dataset.group;
        let hasVisibleTeam = false;
        
        if (groupName === 'FWC & CC') {
            const fwc = sections.find(s => s.id === 'FWC');
            const cc = sections.find(s => s.id === 'CC');
            if ((fwc && !fwc.classList.has('hidden')) || (cc && !cc.classList.has('hidden'))) {
                hasVisibleTeam = true;
            }
        } else {
            const groupTeams = StickerParser.TEAMS.filter(t => t.group === groupName);
            for (const team of groupTeams) {
                const sect = sections.find(s => s.id === team.code);
                if (sect && !sect.classList.has('hidden')) {
                    hasVisibleTeam = true;
                    break;
                }
            }
        }

        if (hasVisibleTeam) {
            divider.classList.delete('hidden');
        } else {
            divider.classList.add('hidden');
        }
    });

    // Print results
    const visibleDividers = dividers.filter(d => !d.classList.has('hidden')).map(d => d.group);
    const visibleSections = sections.filter(s => !s.classList.has('hidden')).map(s => s.id);
    
    console.log('Visible Dividers:', visibleDividers);
    console.log('Visible Sections:', visibleSections);
}

simulateFilter('GER'); // Should only match Germany, NOT Bósnia-Herzegovina
simulateFilter('PAN'); // Should only match Panama, NOT Espanha
simulateFilter('CC');  // Should only match Coca-Cola, NOT FWC
simulateFilter('FWC'); // Should only match FWC, NOT Coca-Cola
simulateFilter('Grupo A'); // Should match FWC & CC? No, Group A teams
simulateFilter('Group A'); // Should match Group A teams
simulateFilter('grupo fwc'); // Should match FWC & CC (both)
simulateFilter('fwc & cc'); // Should match FWC & CC (both)
