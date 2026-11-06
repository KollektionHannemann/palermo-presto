import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {workerSource} from '../scripts/worker-source.mjs';

function harness(fetcher){
 const handlers={},entries=new Map([['https://guide.test/palermo/index.html',new Response('old page')]]);
 const key=r=>typeof r==='string'?r:r.url;
 const cache={put:async(r,v)=>entries.set(key(r),v),addAll:async()=>{}};
 const self={location:new URL('https://guide.test/palermo/sw.js'),addEventListener:(type,fn)=>handlers[type]=fn};
 runInNewContext(workerSource('presto-test',[]),{self,URL,caches:{open:async()=>cache,match:async r=>entries.get(key(r))?.clone()},fetch:fetcher});
 function request(url,mode='navigate'){
  let response;const tasks=[];handlers.fetch({request:{url,mode,method:'GET'},respondWith:p=>response=p,waitUntil:p=>tasks.push(p)});
  return {response,tasks};
 }return {request,entries};
}
test('Offline navigation returns the saved guide when the network fails',async()=>{
 const h=harness(async()=>{throw Error('offline');});const r=h.request('https://guide.test/palermo/');
 assert.equal(await (await r.response).text(),'old page');await Promise.all(r.tasks);
});
test('Cached navigation is immediate and refreshes HTML for the next visit',async()=>{
 let resolveNetwork;const h=harness(()=>new Promise(resolve=>resolveNetwork=resolve));
 const first=h.request('https://guide.test/palermo/');assert.equal(await (await first.response).text(),'old page');
 resolveNetwork(new Response('new deployment'));await Promise.all(first.tasks);
 assert.equal(await h.entries.get('https://guide.test/palermo/index.html').clone().text(),'new deployment');
 const second=h.request('https://guide.test/palermo/');assert.equal(await (await second.response).text(),'new deployment');
 resolveNetwork(new Response('new deployment'));await Promise.all(second.tasks);
});
test('OpenStreetMap tiles bypass the service worker and are never prefetched',()=>{
 let called=false;const h=harness(()=>{called=true;});const r=h.request('https://tile.openstreetmap.org/14/1/2.png','cors');assert.equal(r.response,undefined);assert.equal(called,false);
});
