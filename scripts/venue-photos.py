"""Refresh visually verified venue photos from the registry. Requires Pillow.
Only explicitly reviewed originalImage URLs are used; no automatic stock/logo fallback.
"""
import json,io,urllib.request
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
credits=json.loads((root/'public/data/photo-credits.json').read_text())
for key,c in credits.items():
 if c.get('kind')!='venue':continue
 req=urllib.request.Request(c['originalImage'],headers={'User-Agent':'Mozilla/5.0','Referer':c['source']})
 with urllib.request.urlopen(req,timeout=30) as r:im=Image.open(io.BytesIO(r.read())).convert('RGB')
 im.thumbnail((1000,760));im.save(root/'public'/c['file'],'WEBP',quality=79)
 print(key)
