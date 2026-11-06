"""One-off geocoding. Cached, serialized, <= 1 request/s. Never used for autocomplete.
Policy: https://operations.osmfoundation.org/policies/nominatim/
"""
import json,time,urllib.request,urllib.parse
from pathlib import Path
root=Path(__file__).resolve().parent.parent
path=root/'public/data/places.json'
data=json.loads(path.read_text())
cachepath=root/'scripts/geocode-cache.json'
cache=json.loads(cachepath.read_text()) if cachepath.exists() else {}
for p in data['places']:
    if p['locationPrecision']=='landmark':continue
    query=p['address'].replace(' · Palazzo Aiutamicristo','')+', Palermo, Italia'
    if query not in cache:
        time.sleep(1.2)
        url='https://nominatim.openstreetmap.org/search?'+urllib.parse.urlencode({'q':query,'format':'jsonv2','limit':1,'countrycodes':'it','viewbox':'13.25,38.24,13.43,38.05','bounded':1})
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'PalermoPresto/1.0 (https://github.com/KollektionHannemann/palermo-presto)'})
            with urllib.request.urlopen(req,timeout=15) as r:cache[query]=json.load(r)
            cachepath.write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n')
        except Exception as e:print(p['id'],str(e),flush=True);continue
    rows=cache[query]
    if rows:
        r=rows[0];p['coords']=[float(r['lat']),float(r['lon'])]
        p['locationPrecision']='address' if r.get('type') not in ['administrative','suburb','quarter','city','town'] else 'area'
        p['sources'].append({'label':'Position · OpenStreetMap','url':'https://www.openstreetmap.org/'+r['osm_type']+'/'+str(r['osm_id'])})
    print(p['id'],p['locationPrecision'],flush=True)
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
