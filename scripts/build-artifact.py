# Packages the preview build (dist/) for a static host that serves files under a sub-path
# (e.g. a claude.ai artifact): copies dist/ to <out>/site/ and rewrites every root-relative
# URL ("/services/", "/images/…", url(/fonts/…)) to a relative one for that file's depth.
# Directory links get an explicit index.html, since such hosts don't resolve folders.
# Usage: npm run build:preview && python3 scripts/build-artifact.py <out_dir>
import pathlib, re, shutil, sys

root = pathlib.Path(__file__).resolve().parent.parent
dist = root / 'dist'
out = pathlib.Path(sys.argv[1]).resolve()
site = out / 'site'
if site.exists(): shutil.rmtree(site)
shutil.copytree(dist, site)

def rel_url(url, depth):
    if not url.startswith('/') or url.startswith('//'): return url
    prefix = '../' * depth if depth else './'
    path, frag = (url.split('#', 1) + [''])[:2]
    path, query = (path.split('?', 1) + [''])[:2]
    path = path.lstrip('/')
    if path == '' or path.endswith('/'): path += 'index.html'
    return prefix + path + (f'?{query}' if query else '') + (f'#{frag}' if frag else '')

for f in site.rglob('*.html'):
    depth = len(f.relative_to(site).parts) - 1
    s = f.read_text()
    s = re.sub(r'\b(href|src|data-map-src)="(/[^"]*)"', lambda m: f'{m.group(1)}="{rel_url(m.group(2), depth)}"', s)
    s = re.sub(r'\bsrcset="([^"]*)"', lambda m: 'srcset="' + ', '.join(
        ' '.join([rel_url(p.strip().split(' ')[0], depth)] + p.strip().split(' ')[1:]) for p in m.group(1).split(',')) + '"', s)
    f.write_text(s)

for f in site.rglob('*.css'):
    depth = len(f.relative_to(site).parts) - 1
    s = f.read_text()
    s = re.sub(r'url\((["\']?)(/[^)"\']+)\1\)', lambda m: f'url("{rel_url(m.group(2), depth)}")', s)
    f.write_text(s)

left = [str(f.relative_to(site)) for f in site.rglob('*.html') if re.search(r'\b(href|src)="/(?!/)', f.read_text())]
print(f'packaged {sum(1 for _ in site.rglob("*") if _.is_file())} files into {site}')
print('root-relative URLs left:', left or 'none')
