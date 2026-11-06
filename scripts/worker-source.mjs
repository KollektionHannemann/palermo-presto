export function workerSource(cache,assets){return `const CACHE=${JSON.stringify(cache)},ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('presto-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/data/places.json')){event.respondWith(fetch(event.request).then(r=>{if(r.ok){const copy=r.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return r;}).catch(()=>caches.match(event.request)));return;}
 if(event.request.mode==='navigate'){const index=new URL('./index.html',self.location).href;const fresh=fetch(event.request,{cache:'no-store'}).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(index,response.clone());}return response;});event.waitUntil(fresh.catch(()=>{}));event.respondWith(caches.match(index).then(cached=>cached||fresh));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
`;}
