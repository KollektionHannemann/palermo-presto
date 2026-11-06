export const categories = [
  {id:'all',label:'Alles',icon:'sparkles'}, {id:'food',label:'Essen',icon:'utensils'},
  {id:'street',label:'Streetfood & Märkte',icon:'store'}, {id:'cafe',label:'Caffè',icon:'coffee'},
  {id:'pizza',label:'Pizza',icon:'pizza'}, {id:'wine',label:'Wein',icon:'wine'},
  {id:'rooftop',label:'Rooftops',icon:'sun'}, {id:'sweet',label:'Süßes',icon:'cake'},
  {id:'culture',label:'Kultur',icon:'landmark'}, {id:'outdoors',label:'Draußen',icon:'leaf'},
  {id:'other',label:'Noch zuordnen',icon:'compass'}
];
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'');
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) { try {const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';} }
export function distanceKm(a,b) {if(!a||!b)return null;const rad=x=>x*Math.PI/180;const dlat=rad(b[0]-a[0]),dlon=rad(b[1]-a[1]);return 6371*2*Math.atan2(Math.sqrt(Math.sin(dlat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dlon/2)**2),Math.sqrt(1-(Math.sin(dlat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dlon/2)**2)));}
export function romeClock(date=new Date()) {const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));return {day:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),minutes:Number(p.hour)*60+Number(p.minute)};}
const mins=t=>Number(t.split(':')[0])*60+Number(t.split(':')[1]);
export function openStatus(place,now=new Date()) {
  if(place.status==='check')return {state:'check',label:'Vorher prüfen'};
  if(place.alwaysAccessible)return {state:'open',label:'Frei zugänglich'};
  if(!place.hours||!place.checkedAt||Math.abs(now-new Date(place.checkedAt+'T12:00:00Z'))>45*86400000)return {state:'unknown',label:'Zeiten prüfen'};
  const {day,minutes}=romeClock(now),today=place.hours[String(day)]??[],yesterday=place.hours[String((day+6)%7)]??[];
  const active=today.some(([start,end])=>{const s=mins(start),e=mins(end);return e<=s?minutes>=s:minutes>=s&&minutes<e;})||yesterday.some(([start,end])=>mins(end)<=mins(start)&&minutes<mins(end));
  return active?{state:'open',label:'Laut Plan offen'}:{state:'closed',label:'Laut Plan zu'};
}
export function ratingValue(p){return p.rating&&Number.isFinite(p.rating.value)&&p.rating.scale>0?p.rating.value/p.rating.scale:-1;}
export function filterPlaces(places,filters,personal={},now=new Date()) {
  const terms=normalize(filters.search).split(/\s+/).filter(Boolean);
  let result=places.filter(p=>{
    if(filters.category&&filters.category!=='all'&&p.category!==filters.category)return false;
    if(filters.saved&&!personal[p.id]?.saved)return false;
    if(filters.host&&!p.host)return false;
    if(filters.area&&p.area!==filters.area)return false;
    if(filters.budget==='free'&&p.budget?.[1]!==0)return false;
    if(Number(filters.budget)>0&&(!p.budget||p.budget[1]>Number(filters.budget)))return false;
    if(Number(filters.duration)>0&&(!p.duration||p.duration>Number(filters.duration)))return false;
    if(filters.open&&openStatus(p,now).state!=='open')return false;
    const hay=normalize([p.name,p.area,p.address,p.tagline,p.best,...(p.tags??[])].join(' '));
    return terms.every(t=>hay.includes(t));
  });
  const priority=p=>(p.status==='check'?-100:0)+(p.host?6:0)+(['angeliche','canopia','stagnitta','cattedrale','barone','ballaro','doba','frida'].includes(p.id)?10:0)+(openStatus(p,now).state==='open'?2:0);
  result.sort((a,b)=>{
    if(filters.sort==='name')return a.name.localeCompare(b.name,'de');
    if(filters.sort==='price')return (a.budget?.[1]??Infinity)-(b.budget?.[1]??Infinity);
    if(filters.sort==='rating')return ratingValue(b)-ratingValue(a);
    if(filters.sort==='distance'&&filters.location)return (distanceKm(a.coords,filters.location)??Infinity)-(distanceKm(b.coords,filters.location)??Infinity);
    return priority(b)-priority(a)||a.name.localeCompare(b.name,'de');
  });return result;
}
export function recommend(places,filters,personal={},now=new Date()){
  const {minutes}=romeClock(now);const hour=minutes/60;
  const suited=hour<11?['cafe','sweet','street','culture']:hour<16?['food','street','culture','outdoors']:hour<19?['culture','outdoors','cafe','rooftop','wine']:['food','pizza','wine','rooftop','culture'];
  const base=filterPlaces(places,{...filters,sort:'recommended'},personal,now).filter(p=>p.status!=='check'&&openStatus(p,now).state!=='closed');
  return base.map(p=>({p,score:(suited.includes(p.category)?8:0)+(personal[p.id]?.visited?-5:0)+(p.host?2:0)+(filters.location?Math.max(0,4-(distanceKm(p.coords,filters.location)??10)):0)+Math.random()*3})).sort((a,b)=>b.score-a.score)[0]?.p??null;
}
export function cleanPersonal(raw){
  const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
  for(const [id,v] of Object.entries(raw).slice(0,1000)){
    if(!/^[a-z0-9][a-z0-9-]{0,99}$/i.test(id)||['constructor','prototype','__proto__'].includes(id)||!v||typeof v!=='object')continue;
    out[id]={saved:v.saved===true,visited:v.visited===true,note:String(v.note??'').slice(0,4000),rating:Number.isInteger(v.rating)&&v.rating>=1&&v.rating<=5?v.rating:0};
  }return out;
}
