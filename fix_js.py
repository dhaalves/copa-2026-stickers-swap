import re
with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = re.sub(
    r'el\.tabMatching\.addEventListener\("click", \(\) =>\s*switchTab\("section-matching"\),\s*\);',
    r'el.tabConnections.addEventListener("click", () => switchTab("section-connections"));',
    js
)
js = js.replace('switchTab("section-matching")', 'switchTab("section-connections")')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)
