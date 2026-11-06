"""Download explicitly licensed Commons images and retain credit / license metadata."""
import json,urllib.request,urllib.parse,re,io,time
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
ua={'User-Agent':'PalermoPresto/1.0 (https://github.com/KollektionHannemann/palermo-presto)'}
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=ua),timeout=40) as r:return r.read()
def api(params):return json.loads(get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
queries={
 'hero':'Palermo Cathedral facade daylight', 'culture':'Teatro Massimo Palermo exterior',
 'street':'Ballaro market Palermo', 'cafe':'espresso coffee cup', 'sweet':'Cannoli siciliani',
 'pizza':'Pizza Margherita', 'food':'Pasta alla Norma', 'wine':'Sicilian wine glass',
 'outdoors':'Mondello beach Palermo', 'rooftop':'Palermo skyline',
 'cattedrale':'Palermo Cathedral facade', 'palatina':'Cappella Palatina interior Palermo',
 'quattro':'Quattro Canti Palermo', 'botanico':'Orto botanico Palermo ficus',
 'butera':'Palazzo Butera Palermo exterior', 'foro':'Foro Italico Palermo sea'}
credits={}
for key,q in queries.items():
    try:
        res=api({'action':'query','generator':'search','gsrsearch':q+' filetype:bitmap','gsrnamespace':6,'gsrlimit':5,'prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':1400 if key=='hero' else 700,'format':'json'})
        pages=sorted(res.get('query',{}).get('pages',{}).values(),key=lambda p:p.get('index',0))
        for p in pages:
            info=p.get('imageinfo',[{}])[0];meta=info.get('extmetadata',{})
            lic=meta.get('LicenseShortName',{}).get('value','')
            if not any(x in lic.lower() for x in ['cc by','public domain','cc0']):continue
            raw=get(info.get('thumburl',info['url']));im=Image.open(io.BytesIO(raw)).convert('RGB')
            if im.width<400 or im.height<250:continue
            im.thumbnail((1400,1050) if key=='hero' else (740,620))
            im.save(root/'public/images'/f'{key}.webp','WEBP',quality=78 if key=='hero' else 73)
            clean=lambda v:re.sub('<[^>]+>','',v).strip()
            credits[key]={'file':f'images/{key}.webp','title':p['title'].removeprefix('File:'),'author':clean(meta.get('Artist',{}).get('value','Wikimedia Commons')),'license':lic,'licenseUrl':meta.get('LicenseUrl',{}).get('value','https://commons.wikimedia.org/wiki/Commons:Licensing'),'source':info['descriptionurl'],'modified':'Verkleinert, als WebP komprimiert'}
            print(key,p['title'],lic,flush=True);break
        time.sleep(.3)
    except Exception as e:print(key,str(e),flush=True)
    (root/'public/data/photo-credits.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
