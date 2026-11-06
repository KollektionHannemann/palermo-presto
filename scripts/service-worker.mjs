import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {workerSource} from './worker-source.mjs';
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(f=>f.isDirectory()?walk(dir+'/'+f.name):dir+'/'+f.name))).flat();}
const files=(await walk('dist')).filter(p=>!p.endsWith('sw.js'));
const hash=createHash('sha256');for(const f of files)hash.update(await readFile(f));const version='presto-'+hash.digest('hex').slice(0,14);
const urls=files.map(p=>'./'+p.slice(5));
await writeFile('dist/sw.js',workerSource(version,urls));
console.log('Offline cache:',version,'·',files.length,'local files');
