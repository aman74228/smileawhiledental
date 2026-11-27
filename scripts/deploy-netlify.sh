#!/usr/bin/env bash
# Redeploys the PREVIEW build (dummy content allowed) to the Netlify review site.
# Auth: the Netlify token is injected by the cloud environment's proxy for api.netlify.com
# (no token in this script or the repo). Elsewhere, export NETLIFY_AUTH_TOKEN and it is used.
# The deploy copy is noindex (X-Robots-Tag + disallow-all robots.txt) so sample content isn't indexed.
set -euo pipefail
SITE_ID="${NETLIFY_SITE_ID:-69ab51fc-81fb-4ce1-b17b-d0e48acd6354}"   # smileawhile-dental-preview.netlify.app
OUT="$(mktemp -d)"
npm run -s build:preview
cp -r dist "$OUT/site"
printf 'User-agent: *\nDisallow: /\n' > "$OUT/site/robots.txt"
printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > "$OUT/site/_headers"
(cd "$OUT/site" && python3 -c "import zipfile,os;z=zipfile.ZipFile('../site.zip','w',zipfile.ZIP_DEFLATED);[z.write(os.path.join(r,f),os.path.relpath(os.path.join(r,f),'.')) for r,_,fs in os.walk('.') for f in fs]")
AUTH=(); [ -n "${NETLIFY_AUTH_TOKEN:-}" ] && AUTH=(-H "Authorization: Bearer $NETLIFY_AUTH_TOKEN")
curl -sf "${AUTH[@]}" -H "Content-Type: application/zip" --data-binary @"$OUT/site.zip" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys" | python3 -c "import json,sys;d=json.load(sys.stdin);print('deploy',d['id'],d['state'],d.get('deploy_ssl_url'))"
