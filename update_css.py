import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update .main-tabs
tab_search = r'(\.main-tabs \{.*?\n\})'
tab_replace = r'''\1

.main-tabs {
    /* Adjusted for 2 items */
    display: flex;
    background: rgba(15, 22, 38, 0.8);
    padding: 8px;
    margin: 16px 20px 24px;
    border-radius: 100px;
    border: 1px solid var(--border-color);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}

.tab-btn.active {
    background: var(--button-gradient);
    color: #fff;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}'''
css = re.sub(r'\.main-tabs \{.*?\n\}', '', css, flags=re.DOTALL) # remove old main-tabs
# Actually it's easier to just append overrides at the end!

overrides = '''

/* --- COMPACT UI OVERRIDES --- */

/* Tabs */
.main-tabs {
    background: rgba(0, 0, 0, 0.4);
    padding: 6px;
    margin: 16px 20px 24px;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
}
.tab-btn {
    padding: 14px 12px;
    font-size: 15px;
}
.tab-btn.active {
    background: var(--button-gradient);
    color: #fff;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    border: 1px solid rgba(255,255,255,0.1);
}

/* Stats panel integration */
.stats-panel {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0 20px 16px;
    margin-bottom: 0;
}
.stats-panel h2 {
    display: none; /* Hide 'Resumo' title since it's obvious */
}
.stats-grid-detailed {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 0;
}
.stat-box-detailed {
    flex-direction: column;
    padding: 12px 8px;
    gap: 8px;
    text-align: center;
    border-radius: var(--border-radius-md);
    background: rgba(255, 255, 255, 0.03);
}
/* Make completion stat span 3 columns and be horizontal */
.stat-box-detailed:first-child {
    grid-column: span 3;
    flex-direction: row;
    padding: 16px;
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
}
.stat-box-detailed:first-child .stat-box-text {
    align-items: flex-start;
    text-align: left;
}
.stat-box-detailed:first-child .stat-box-value {
    font-size: 28px;
    color: var(--accent-primary);
}
.stat-box-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
}
.stat-box-detailed:first-child .stat-box-icon {
    width: 56px;
    height: 56px;
}
.stat-box-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}
.stat-box-label {
    font-size: 11px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.stat-box-value {
    font-size: 16px;
    font-weight: 700;
}

/* Import/Compare separation */
.import-panel {
    background: rgba(0, 0, 0, 0.15);
}
'''

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(overrides)
