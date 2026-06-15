import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Navigation Tabs
nav_search = r'(<nav class="main-tabs" id="main-nav-tabs">).*?(</nav>)'
nav_replace = r'''\1
            <button class="tab-btn active" id="tab-trigger-my-album" data-target="section-my-album">
                <span>🎴 Meu Álbum</span>
            </button>
            <button class="tab-btn" id="tab-trigger-connections" data-target="section-connections">
                <span>🔄 Conexões</span>
            </button>
        \2'''
html = re.sub(nav_search, nav_replace, html, flags=re.DOTALL)

# 2. Extract section-stats content
stats_search = r'<section class="tab-section" id="section-stats">\s*(<div class="card stats-panel">.*?</div>)\s*</section>'
stats_match = re.search(stats_search, html, flags=re.DOTALL)
if stats_match:
    stats_content = stats_match.group(1)
    # Remove section-stats
    html = re.sub(stats_search, '', html, flags=re.DOTALL)

    # 3. Insert stats into section-my-album, right before the grid-panel
    grid_search = r'(<!-- Sticker Grid Panel -->\s*<div class="card grid-panel">)'
    html = re.sub(grid_search, stats_content + r'\n\n                \1', html)

# 4. Extract section-import content
import_search = r'<section class="tab-section" id="section-import">\s*(<div class="card import-panel">.*?</div>)\s*</section>'
import_match = re.search(import_search, html, flags=re.DOTALL)
if import_match:
    import_content = import_match.group(1)
    # Remove section-import
    html = re.sub(import_search, '', html, flags=re.DOTALL)

    # 5. Rename section-matching to section-connections
    html = html.replace('<section class="tab-section" id="section-matching">', '<section class="tab-section" id="section-connections">')

    # 6. Append import_content to the end of section-connections
    section_conn_end = r'(</section>\s*<!-- Section D: Estatisticas -->)'
    # Wait, section-stats was removed, so let's just find the end of section-connections
    # In the original, it was:
    # </section>
    # <!-- Section D: Estatisticas -->

html = html.replace('<!-- Section B: Matching -->', '<!-- Section B: Connections -->')
html = html.replace('<!-- Section C: Import -->\n', '')
html = html.replace('<!-- Section D: Estatisticas -->\n', '')

# Instead of regex for appending to section-connections, let's just replace the closing tag of section-connections
conn_close_search = r'(<div class="card empty-match-card" id="match-empty-panel">.*?</div>\s*)</section>'
if import_match:
    conn_close_replace = r'\1\n                <!-- Import Panel -->\n                ' + import_content + r'\n            </section>'
    html = re.sub(conn_close_search, conn_close_replace, html, flags=re.DOTALL)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
