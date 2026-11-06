import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(f=>f.isDirectory()?walk(dir+'/'+f.name):dir+'/'+f.name))).flat();}
const files=(await walk('dist')).filter(p=>!p.endsWith('sw.js'));
const hash=createHash('sha256');for(const f of files)hash.update(await readFile(f));const version='presto-'+hash.digest('hex').slice(0,14);
const urls=files.map(p=>'./'+p.slice(5));
await writeFile('dist/sw.js',`const CACHE=${JSON.stringify(version)},ASSETS=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('presto-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/data/places.json')){event.respondWith(fetch(event.request).then(r=>{if(r.ok){const copy=r.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return r;}).catch(()=>caches.match(event.request)));return;}
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('./index.html',self.location).href)));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
`);
console.log('Offline cache:',version,'·',files.length,'local files');
