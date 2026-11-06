import {test} from 'node:test';
import assert from 'node:assert/strict';
import {openStatus,filterPlaces,ratingValue,cleanPersonal,safeUrl,distanceKm,normalize,recommend} from '../src/core.js';
const date='2026-11-06';
test('Palermo opening status handles previous-day closing past midnight and closed days',()=>{
 const p={hours:{'5':[['18:00','02:00']]},checkedAt:date};
 assert.equal(openStatus(p,new Date('2026-11-07T00:30:00Z')).state,'open');
 assert.equal(openStatus(p,new Date('2026-11-07T02:00:00Z')).state,'closed');
 assert.equal(openStatus(p,new Date('2026-11-06T16:30:00Z')).state,'closed');
 assert.equal(openStatus(p,new Date('2026-11-06T18:30:00Z')).state,'open');
});
test('Rome summer time and stale schedules remain truthful',()=>{
 const p={hours:{'5':[['09:00','10:00']]},checkedAt:'2026-07-03'};
 assert.equal(openStatus(p,new Date('2026-07-03T07:30:00Z')).state,'open');
 assert.equal(openStatus(p,new Date('2026-11-06T08:30:00Z')).state,'unknown');
 assert.equal(openStatus({...p,status:'check'},new Date('2026-07-03T07:30:00Z')).state,'check');
});
const list=[{id:'a',name:'Caffè',category:'cafe',area:'Kalsa',budget:[3,10],duration:30,tags:['Frühstück'],rating:{value:4.8,scale:5}}, {id:'b',name:'Pizza',category:'pizza',area:'Capo',budget:[15,30],duration:60,tags:[],rating:{value:9.2,scale:10}},{id:'c',name:'Piazza',category:'culture',area:'Kalsa',budget:[0,0],duration:30,tags:[]}];
test('Filters combine search, strict upper budget, time, area and favorites',()=>{
 assert.deepEqual(filterPlaces(list,{search:'fruhstuck',budget:'10',duration:'30',area:'Kalsa'}).map(p=>p.id),['a']);
 assert.deepEqual(filterPlaces(list,{budget:'free'}).map(p=>p.id),['c']);
 assert.deepEqual(filterPlaces(list,{saved:true},{b:{saved:true}}).map(p=>p.id),['b']);
 assert.equal(filterPlaces(list,{budget:'25'}).some(p=>p.id==='b'),false);
 assert.equal(normalize('Caffè dell’Oro'),'caffe delloro');
});
test('Ratings are sorted on their actual scales and unknown ratings come last',()=>{
 assert.deepEqual(filterPlaces(list,{sort:'rating'}).map(p=>p.id),['a','b','c']);
 assert.equal(ratingValue(list[0]),.96);
});
test('Recommendation respects filters and excludes unconfirmed operations',()=>{
 const items=list.map(p=>({...p,status:'check'}));assert.equal(recommend(items,{}),null);
 assert.equal(recommend(list,{category:'pizza'}).id,'b');
});
test('Untrusted backup data cannot inject prototype keys or unbounded notes',()=>{
 const raw=JSON.parse('{"__proto__":{"saved":true},"constructor":{"saved":true},"safe":{"saved":true,"rating":99,"note":"ok"}}');
 const cleaned=cleanPersonal(raw);assert.deepEqual(Object.keys(cleaned),['safe']);assert.equal(cleaned.safe.rating,0);assert.equal({}.saved,undefined);
 assert.equal(cleanPersonal({a:{note:'a'.repeat(5000)}}).a.note.length,4000);
});
test('External links reject executable URLs and credentials',()=>{assert.equal(safeUrl('javascript:alert(1)'),'');assert.equal(safeUrl('https://secret@example.com'),'');assert.equal(safeUrl('https://example.com'),'https://example.com/');});
test('Distances are symmetric and zero for identical coordinates',()=>{assert.equal(distanceKm([38,13],[38,13]),0);assert.equal(distanceKm(null,[38,13]),null);assert.ok(Math.abs(distanceKm([38,13],[38.01,13])-1.112)<.01);});
