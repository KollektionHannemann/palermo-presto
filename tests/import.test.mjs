import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publicIP,validateURL,parseMetadata,enrichPlace,withinPalermo} from '../scripts/import-place.mjs';
test('Importer blocks internal targets including numeric hosts, IPv6 and credentials',async()=>{
 for(const input of ['https://127.0.0.1','https://2130706433','https://[::1]','https://[::ffff:127.0.0.1]','https://10.0.0.1','https://169.254.169.254/latest','http://example.com','https://example.com:8080','https://a:b@example.com'])await assert.rejects(()=>validateURL(input));
 await assert.rejects(()=>validateURL('https://example.com',async()=>[{address:'10.0.0.2'}]));
 assert.equal(publicIP('8.8.8.8'),true);assert.equal((await validateURL('https://example.com',async()=>[{address:'93.184.216.34'}])).hostname,'example.com');
});
const html=`<html><title>Fallback</title><meta content="Local seasonal plates" property="og:description"><script type="application/ld+json">{"@graph":[{"@type":"Restaurant","name":"Test Osteria","address":{"streetAddress":"Via Roma 4","addressLocality":"Palermo"},"geo":{"latitude":"38.12","longitude":"13.36"},"aggregateRating":{"ratingValue":4.6,"bestRating":5,"reviewCount":12}}]}</script></html>`;
test('Reads structured business data, reversed meta attributes and Maps redirect names',()=>{
 const m=parseMetadata(html,'https://example.com');assert.equal(m.name,'Test Osteria');assert.equal(m.address,'Via Roma 4, Palermo');assert.equal(m.description,'Local seasonal plates');assert.deepEqual(m.coords,[38.12,13.36]);
 assert.equal(parseMetadata('<title>Google Search</title>','https://www.google.com/search?q=Le+Angeliche').name,'Le Angeliche');
});
test('End-to-end enrichment retains evidence, missing values and coordinates; deduplicates names',async()=>{
 const options={fetchPage:async()=>({html,url:'https://example.com/osteria'}),geocode:async()=>null};
 const r=await enrichPlace('https://example.com/osteria',[],options);assert.equal(r.place.name,'Test Osteria');assert.equal(r.place.category,'food');assert.equal(r.place.budget,null);assert.equal(r.place.rating.value,4.6);assert.equal(r.place.status,'check');assert.ok(withinPalermo(r.place.coords));
 const duplicate=await enrichPlace('https://example.com/other',[r.place],options);assert.equal(duplicate.duplicate,true);
});
test('Rejects another city and unreadable generic pages without inventing a location',async()=>{
 await assert.rejects(()=>enrichPlace('https://example.com',[],{fetchPage:async()=>({html:html.replace('38.12','48.12'),url:'https://example.com'})}));
 assert.throws(()=>parseMetadata('<title>Just a moment…</title>','https://example.com'));
});
