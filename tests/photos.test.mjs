import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
test('Reviewed culinary venues have distinct, attributed original photographs',async()=>{
 const {places}=JSON.parse(await readFile('public/data/places.json'));
 const credits=JSON.parse(await readFile('public/data/photo-credits.json'));
 const venues=places.filter(p=>(p.host||p.id==='i-segreti-del-chiostro-0c207e')&&['food','street','pizza','cafe','wine','rooftop','sweet'].includes(p.category));
 const hashes=new Set();
 for(const p of venues){const c=credits[p.id];assert.equal(c?.kind,'venue',p.name);assert(c.originalImage.startsWith('https://'));assert(c.source.startsWith('https://'));const hash=createHash('sha256').update(await readFile('public/'+c.file)).digest('hex');assert(!hashes.has(hash),'Repeated photograph: '+p.name);hashes.add(hash);}
 assert.equal(venues.length,28);
});
