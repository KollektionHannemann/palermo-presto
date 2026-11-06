import json,urllib.parse,urllib.request,io,re
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parent.parent
credits=json.loads((root/'public/data/photo-credits.json').read_text())
files={'hero':'Palermo Cathedral Facade.jpg','wine':'Red and white wine in glass.jpg','palatina':'Palermo - Cappella Palatina - 5.jpg','foro':'Foro Italico 9-2011-02-03.jpg'}
headers={'User-Agent':'PalermoPresto/1.0 (https://github.com/KollektionHannemann/palermo-presto)'}
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=40) as r:return r.read()
for key,title in files.items():
    params={'action':'query','titles':'File:'+title,'prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':1400 if key=='hero' else 740,'format':'json'}
    data=json.loads(get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
    p=next(iter(data['query']['pages'].values()));info=p['imageinfo'][0];m=info['extmetadata']
    im=Image.open(io.BytesIO(get(info.get('thumburl',info['url'])))).convert('RGB');im.thumbnail((1400,1000) if key=='hero' else (740,620));im.save(root/'public/images'/f'{key}.webp','WEBP',quality=78)
    credits[key]={'file':f'images/{key}.webp','title':title,'author':re.sub('<[^>]+>','',m.get('Artist',{}).get('value','Wikimedia Commons')).strip(),'license':m['LicenseShortName']['value'],'licenseUrl':m.get('LicenseUrl',{}).get('value','https://commons.wikimedia.org/wiki/Commons:Licensing'),'source':info['descriptionurl'],'modified':'Verkleinert, als WebP komprimiert'}
    print(key,credits[key]['license'])
# Historical postcard was misleading as a present-day photo. Use contemporary category illustration.
credits.pop('butera',None)
(root/'public/images/butera.webp').unlink(missing_ok=True)
(root/'public/data/photo-credits.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
for size in [192,512]:
    im=Image.new('RGB',(size,size),'#e35b38');d=ImageDraw.Draw(im)
    f=ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia.ttf',int(size*.84))
    d.text((size*.19,-size*.04),'p',font=f,fill='#fff7e8');d.ellipse((size*.72,size*.70,size*.81,size*.79),fill='#fff7e8');im.save(root/f'public/icon-{size}.png')
