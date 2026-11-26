# Builds preview/system.html as a single self-contained file:
# inlines the icon sprite, tokens.css and the subset font (base64) so it renders anywhere.
import pathlib, base64
root = pathlib.Path(__file__).resolve().parent.parent
src = (root/'preview/system.src.html').read_text()
icons = (root/'src/icons/glass-icons.svg').read_text()
font = base64.b64encode((root/'public/fonts/GoogleSans-Variable-latin.woff2').read_bytes()).decode()
tokens = (root/'src/styles/tokens.css').read_text().replace(
    'url("/fonts/GoogleSans-Variable-latin.woff2")', f'url("data:font/woff2;base64,{font}")')
out = (src.replace('<!--ICONS-->', icons)
          .replace('<link rel="stylesheet" href="../src/styles/tokens.css">', f'<style>\n{tokens}\n</style>')
          .replace('<link rel="preload" href="../assets/fonts/GoogleSans-Variable-latin.woff2" as="font" type="font/woff2" crossorigin>\n', ''))
assert 'tokens.css">' not in out and '<!--ICONS-->' not in out
(root/'preview/system.html').write_text(out)
print('built preview/system.html', round(len(out)/1024), 'KB')
