with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update DOM Elements
js = js.replace('tabMatching: document.getElementById("tab-trigger-matching"),', 'tabConnections: document.getElementById("tab-trigger-connections"),')
js = js.replace('tabImport: document.getElementById("tab-trigger-import"),\n', '')
js = js.replace('tabStats: document.getElementById("tab-trigger-stats"),\n', '')

js = js.replace('sectionMatching: document.getElementById("section-matching"),', 'sectionConnections: document.getElementById("section-connections"),')
js = js.replace('sectionImport: document.getElementById("section-import"),\n', '')
js = js.replace('sectionStats: document.getElementById("section-stats"),\n', '')

# 2. Update Event Listeners
js = js.replace('el.tabMatching.addEventListener("click", () => switchTab("section-matching"));', 'el.tabConnections.addEventListener("click", () => switchTab("section-connections"));')
js = js.replace('el.tabImport.addEventListener("click", () => switchTab("section-import"));\n', '')
js = js.replace('el.tabStats.addEventListener("click", () => switchTab("section-stats"));\n', '')

# 3. Update query params behavior
js = js.replace('switchTab("section-matching");', 'switchTab("section-connections");')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)
