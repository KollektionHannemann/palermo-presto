import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {safeUrl,categories} from '../src/core.js';
const {places}=JSON.parse(await readFile('public/data/places.json','utf8'));
const credits=JSON.parse(await readFile('public/data/photo-credits.json','utf8'));
assert(places.length>=40);assert.equal(new Set(places.map(p=>p.id)).size,places.length);
assert.equal(places.filter(p=>p.host).length,30);
for(const p of places){assert(p.name&&p.best&&p.tip&&p.sources.length,p.id+' missing editorial data');assert(categories.some(c=>c.id===p.category),p.id+' category');assert(p.sources.every(s=>safeUrl(s.url)),p.id+' source URL');if(p.coords)assert(p.coords.length===2&&p.coords.every(Number.isFinite));if(p.budget)assert(p.budget.length===2&&p.budget[0]<=p.budget[1]);if(p.rating)assert(p.rating.value>=0&&p.rating.value<=p.rating.scale&&safeUrl(p.rating.url)&&p.rating.checkedAt);for(const id of p.related)assert(places.some(q=>q.id===id));assert(credits[p.id]||credits[p.category]||p.category==='other');}
for(const c of Object.values(credits)){assert(safeUrl(c.source)&&c.license&&c.author);await access('public/'+c.file);}
await access('public/images/hero.webp');await access('public/fonts/dm-sans-latin.woff2');await access('public/fonts/OFL.txt');
console.log('Validated',places.length,'places, 30 host recommendations,',Object.keys(credits).length,'licensed photos.');
