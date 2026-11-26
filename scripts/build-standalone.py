# Builds ONE self-contained HTML file for sharing/previewing (no server needed):
# inlines the Vite CSS + JS bundle, the font, and one WebP per image (≤1200w) as data URIs.
# Usage:  npm run build && python3 scripts/build-standalone.py
# Output: preview/smileadental-homepage.html
import base64, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
dist = root / 'dist'
html = (dist / 'index.html').read_text()

def data_uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

# 1 · CSS (with the font inlined)
def inline_css(m):
    css = (dist / m.group(1).lstrip('/')).read_text()
    css = re.sub(r'url\((["\']?)/fonts/([^"\')]+)\1\)',
                 lambda f: f'url("{data_uri(dist / "fonts" / f.group(2), "font/woff2")}")', css)
    return f'<style>\n{css}\n</style>'
html = re.sub(r'<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>', inline_css, html)

# 2 · JS bundle (module)
def inline_js(m):
    js = (dist / m.group(1).lstrip('/')).read_text().replace('</script', '<\\/script')
    return f'<script type="module">\n{js}\n</script>'
html = re.sub(r'<script type="module" crossorigin src="([^"]+\.js)"></script>', inline_js, html)

# 3 · Drop the font preload (font is now inside the CSS)
html = re.sub(r'<link rel="preload"[^>]*woff2[^>]*>\s*', '', html)

# 4 · Images: one WebP per <picture> (largest ≤1200w), sources removed
def pick(srcset):
    cands = []
    for part in srcset.split(','):
        url, w = part.strip().rsplit(' ', 1)
        cands.append((int(w[:-1]), url))
    ok = [c for c in cands if c[0] <= 1200] or cands
    return max(ok)[1]

def inline_picture(m):
    block = m.group(0)
    webp = re.search(r'<source type="image/webp"(?![^>]*media=)[^>]*srcset="([^"]+)"', block)
    url = pick(webp.group(1)) if webp else re.search(r'<img[^>]*src="([^"]+)"', block).group(1)
    uri = data_uri(dist / url.lstrip('/'), 'image/webp')
    img = re.search(r'<img[^>]*>', block).group(0)
    img = re.sub(r'src="[^"]+"', f'src="{uri}"', img)
    return f'<picture>{img}</picture>'
html = re.sub(r'<picture>.*?</picture>', inline_picture, html, flags=re.S)

# 5 · og:image / schema image → harmless relative paths are fine; leave as-is.
out = root / 'preview' / 'smileadental-homepage.html'
out.write_text(html)
print(f'wrote {out.relative_to(root)}  ({out.stat().st_size / 1024:.0f} KB)')
