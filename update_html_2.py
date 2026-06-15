import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make the import panel visually distinct inside the connections tab
import_panel_search = r'(<div class="card import-panel">.*?</div>)'
import_panel_replace = r'''<div class="card import-panel" style="margin-top: 24px; border-top: 1px solid var(--border-color);">
                    \1'''
# Since the python logic copied it directly:
html = html.replace('<div class="card import-panel">', '<div class="card import-panel" style="margin-top: 24px; border-top: 1px dashed var(--border-color);">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
