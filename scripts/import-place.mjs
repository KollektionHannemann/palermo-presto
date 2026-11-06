import {readFile,writeFile} from 'node:fs/promises';
import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {normalize,safeUrl} from '../src/core.js';

export const USER_AGENT='PalermoPresto/1.0 (+https://github.com/KollektionHannemann/palermo-presto)';
export function publicIP(address){
 if(address.includes(':')){const a=address.toLowerCase();return !a.startsWith('::')&&!a.startsWith('fc')&&!a.startsWith('fd')&&!a.startsWith('fe')&&!a.startsWith('ff')&&!a.startsWith('2001:db8');}
 const [a,b]=address.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&[0,168].includes(b)||a===100&&b>=64&&b<=127||a===198&&[18,19,51].includes(b)||a===203&&b===0);
}
export async function validateURL(value,resolver=lookup){
 const valid=safeUrl(value);if(!valid||value.length>2048)throw Error('Nur öffentliche HTTPS-Links ohne Zugangsdaten sind erlaubt.');
 const u=new URL(valid),hostname=u.hostname.replace(/^\[|\]$/g,'');
 if(u.port&&u.port!=='443')throw Error('Abweichende Ports sind nicht erlaubt.');
 if(hostname==='localhost'||!hostname.includes('.')&&!isIP(hostname)||/\.(local|internal|localhost)$/i.test(hostname))throw Error('Lokale Adressen sind nicht erlaubt.');
 const addresses=isIP(hostname)?[{address:hostname}]:await resolver(hostname,{all:true});
 if(!addresses.length||addresses.some(a=>!publicIP(a.address)))throw Error('Private oder reservierte Netzwerkadresse blockiert.');
 return u;
}
export async function fetchPage(value){
 let current=value;
 for(let redirects=0;redirects<7;redirects++){
  const u=await validateURL(current);
  const r=await fetch(u,{redirect:'manual',headers:{'User-Agent':USER_AGENT,'Accept':'text/html,application/json'},signal:AbortSignal.timeout(18000)});
  if([301,302,303,307,308].includes(r.status)){const loc=r.headers.get('location');if(!loc)throw Error('Weiterleitung ohne Ziel.');current=new URL(loc,u).href;await r.body?.cancel();continue;}
  if(!r.ok)throw Error('Quelle nicht erreichbar (HTTP '+r.status+').');
  if(!/text\/html|application\/(json|ld\+json)/i.test(r.headers.get('content-type')??''))throw Error('Der Link muss auf eine HTML-Seite oder Ortsdaten zeigen.');
  const reader=r.body.getReader();let size=0,chunks=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2_000_000){await reader.cancel();throw Error('Seite ist für den Import zu groß.');}chunks.push(value);}
  return {url:u.href,html:Buffer.concat(chunks).toString('utf8')};
 }throw Error('Zu viele Weiterleitungen.');
}
const decode=s=>String(s??'').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&#(\d+);/g,(_,n)=>{const c=Number(n);return c<=0x10ffff?String.fromCodePoint(c):'';});
const text=s=>decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
export function parseMetadata(html,source){
 const metas={};for(const tag of html.matchAll(/<meta\b[^>]*>/gi)){const attrs={};for(const a of tag[0].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g))attrs[a[1].toLowerCase()]=decode(a[2]??a[3]??a[4]);const key=attrs.property??attrs.name;if(key&&attrs.content)metas[key.toLowerCase()]=attrs.content;}
 const nodes=[];const walk=(v,depth=0)=>{if(depth>8||!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,depth+1));return;}nodes.push(v);if(v['@graph'])walk(v['@graph'],depth+1);};
 for(const script of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{walk(JSON.parse(script[1]));}catch{}}
 const business=nodes.find(n=>/Restaurant|CafeOrCoffeeShop|BarOrPub|FoodEstablishment|LocalBusiness|TouristAttraction|Museum|Theater|Park|Store|Place/i.test(String(n['@type'])))??{};
 const u=new URL(source),q=u.searchParams.get('q')??u.searchParams.get('query');
 const mapName=/google\.|goo\.gl/.test(u.hostname)?(u.pathname.match(/\/place\/([^/]+)/)?.[1]??q):null;
 let name=text(business.name??metas['og:title']??html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??'');
 if(mapName){try{name=decodeURIComponent(mapName.replace(/\+/g,' '));}catch{name=mapName;}}
 name=name.replace(/\s*[-|–]\s*(Google (Maps|Search)|Home|Sito ufficiale).*$/i,'').replace(/^(Home|Homepage|Benvenuti)\s*[|–-]\s*/i,'').trim();
 if(!name||/^(Google( Maps| Search)?|Instagram|Facebook|Just a moment|Access Denied|Consent)/i.test(name))throw Error('Die Quelle stellt keinen lesbaren Ortsnamen bereit. Bitte die offizielle Website oder einen ausführlichen Maps-Link verwenden.');
 const address=typeof business.address==='string'?text(business.address):text([business.address?.streetAddress,business.address?.postalCode,business.address?.addressLocality].filter(Boolean).join(', '));
 const coord=html.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
 const lat=Number(business.geo?.latitude??coord?.[1]),lon=Number(business.geo?.longitude??coord?.[2]);
 const coords=Number.isFinite(lat)&&Number.isFinite(lon)?[lat,lon]:null;
 const paragraph=[...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(p=>text(p[1])).find(p=>p.length>70&&/palerm|sicil|pasticcer|cucina|monaster|ristor|caffe|coffee|museum/i.test(p)&&!/cookie|privacy|newsletter/i.test(p));
 const desc=text(business.description||metas.description||metas['og:description']||paragraph||'').slice(0,220);
 return {name:name.slice(0,120),address,description:desc,coords,type:String(business['@type']??''),cuisine:String(business.servesCuisine??''),phone:text(business.telephone??''),rating:business.aggregateRating,priceRange:text(business.priceRange??''),menu:safeUrl(business.hasMenu??business.menu??''),source};
}
export function inferCategory(meta){const s=normalize(meta.type+' '+meta.cuisine+' '+meta.name+' '+meta.description);if(/pizza/.test(s))return 'pizza';if(/cafe|coffee|caffe|torrefaz/.test(s))return 'cafe';if(/pasticcer|cannol|gelater|dessert|dolceria|confectionery|bakery/.test(s))return 'sweet';if(/wine|enotec|barorpub/.test(s))return 'wine';if(/rooftop|terrace|terraz/.test(s))return 'rooftop';if(/museum|theat|teatro|chiesa|cathedral|palazzo|museo|touristattraction/.test(s))return 'culture';if(/park|beach|garden|orto |spiaggia/.test(s))return 'outdoors';if(/streetfood|mercato/.test(s))return 'street';if(/restaurant|ristor|osteria|trattoria|foodestablishment/.test(s))return 'food';return 'culture';}
export function withinPalermo(c){return Array.isArray(c)&&c.length===2&&c[0]>=37.95&&c[0]<=38.30&&c[1]>=13.15&&c[1]<=13.50;}
async function geocode(meta,cache){
 const street=meta.address.split(',')[0].replace(/^(\d+)\s+(.+)$/,'$2 $1');
 const queries=[meta.name+' Palermo Italia',...(street?[street+' Palermo Italia']:[])];
 for(const query of queries){
  if(Object.hasOwn(cache,query)){if(cache[query])return cache[query];continue;}
  // Serialized workflow, cached results; at most two lookups per explicit import, never autocomplete.
  await new Promise(r=>setTimeout(r,1100));
  const u=new URL('https://nominatim.openstreetmap.org/search');u.search=new URLSearchParams({q:query,format:'jsonv2',limit:'1',countrycodes:'it',viewbox:'13.15,38.30,13.50,37.95',bounded:'1',addressdetails:'1',extratags:'1'});
  const r=await fetch(u,{headers:{'User-Agent':USER_AGENT},signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('Geocoding nicht verfügbar.');const rows=await r.json();cache[query]=rows[0]??null;if(rows[0])return rows[0];
 }return null;
}
export async function enrichPlace(input,existing=[],options={}){
 const page=await (options.fetchPage??fetchPage)(input),meta=parseMetadata(page.html,page.url);
 const duplicate=existing.find(p=>p.mapsUrl===input||p.website===page.url||normalize(p.name)===normalize(meta.name));if(duplicate)return {place:duplicate,duplicate:true};
 if(meta.coords&&!withinPalermo(meta.coords))throw Error('Dieser Ort liegt außerhalb des Palermo-Gebiets.');
 let geo=null;try{geo=await (options.geocode??geocode)(meta,options.cache??{});}catch{}
 const candidate=meta.coords??(geo?[Number(geo.lat),Number(geo.lon)]:null),coords=withinPalermo(candidate)?candidate:null;
 const category=inferCategory({...meta,type:meta.type+' '+(geo?.type??'')}),date=new Date().toISOString().slice(0,10),tagline=meta.description||'Neu entdeckt. Prüfe die Quelle für aktuelle Details.';
 const place={id:normalize(meta.name).replace(/[^a-z0-9]+/g,'-').slice(0,65).replace(/-$/,'')+'-'+createHash('sha256').update(input).digest('hex').slice(0,6),name:meta.name,category,area:geo?.address?.suburb??geo?.address?.quarter??'Noch zuordnen',address:meta.address||geo?.display_name?.split(',').slice(0,3).join(',')||'Adresse noch nicht bestätigt',budget:null,priceKind:'unknown',host:false,tagline,best:'Neu importiert · Details in der Quelle prüfen',tip:'Automatisch aus öffentlich verfügbaren Ortsdaten übernommen. Empfehlungen, Preise und Zeiten sind nur enthalten, wenn sie aus der Quelle sicher lesbar waren.',website:page.url,phone:meta.phone.replace(/[^+\d\s()-]/g,'').slice(0,40),mapsUrl:input,sources:[{label:'Importierte Originalquelle',url:input}],checkedAt:date,duration:null,tags:['Neu importiert'],image:category,coords,locationPrecision:meta.coords?'address':geo?.category==='highway'?'area':geo?'address':'unknown',related:[],status:'check',warning:'Automatisch importiert · Angaben noch prüfen'};
 if(meta.priceRange)place.tip+=' Preisangabe der Quelle: '+meta.priceRange.slice(0,50)+'.';
 if(geo){place.sources.push({label:'OpenStreetMap / Nominatim',url:'https://www.openstreetmap.org/'+geo.osm_type+'/'+geo.osm_id});if(!place.phone)place.phone=String(geo.extratags?.phone??'').slice(0,40);}
 const rating=meta.rating,value=Number(rating?.ratingValue),scale=Number(rating?.bestRating??5),count=Number(rating?.reviewCount??rating?.ratingCount);
 if(Number.isFinite(value)&&value>=0&&value<=scale&&[5,10].includes(scale))place.rating={value,scale,count:Number.isFinite(count)?count:null,source:'Strukturierte Daten der Quelle',url:page.url,checkedAt:date};
 place.related=existing.filter(p=>coords&&p.coords).map(p=>({id:p.id,d:(p.coords[0]-coords[0])**2+(p.coords[1]-coords[1])**2})).sort((a,b)=>a.d-b.d).slice(0,4).map(p=>p.id);
 return {place,duplicate:false};
}
async function main(){
 const root=resolve(fileURLToPath(new URL('..',import.meta.url))),dbPath=resolve(root,'public/data/places.json'),cachePath=resolve(root,'scripts/import-cache.json');
 let input=process.env.IMPORT_URL??process.argv[2]??'';
 if(process.env.GITHUB_EVENT_PATH){const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));if(event.issue)input=event.issue.body?.match(/^URL:\s*(https:\/\/\S+)\s*$/m)?.[1]??'';}
 if(!input)throw Error('Kein Import-Link gefunden. Erwartet: URL: https://…');
 const db=JSON.parse(await readFile(dbPath,'utf8'));let cache={};try{cache=JSON.parse(await readFile(cachePath,'utf8'));}catch{}
 const result=await enrichPlace(input,db.places,{cache});if(!result.duplicate){db.places.push(result.place);db.updatedAt=new Date().toISOString().slice(0,10);await writeFile(dbPath,JSON.stringify(db,null,2)+'\n');await writeFile(cachePath,JSON.stringify(cache,null,2)+'\n');}
 if(process.env.GITHUB_OUTPUT)await writeFile(process.env.GITHUB_OUTPUT,'place_id='+result.place.id+'\nduplicate='+result.duplicate+'\n',{flag:'a'});
 console.log(JSON.stringify({id:result.place.id,name:result.place.name,duplicate:result.duplicate}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
