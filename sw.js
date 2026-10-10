const C='da-wiki-v'+1791657218;
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','wiki.css','search.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','pages.json']))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>
  caches.open(C).then(c=>fetch('pages.json').then(r=>r.json()).then(list=>{ let i=0; const next=()=>{ const batch=list.slice(i,i+20); i+=20; if(!batch.length) return; return c.addAll(batch).catch(()=>{}).then(next); }; return next(); })).catch(()=>{}))); });
// pages open from the saved copy at once and are refreshed in the background; each release (a new cache name) saves them all again
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(caches.open(C).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{ if(r.ok) c.put(e.request,r.clone()); return r; });
    if(hit){ e.waitUntil(net.catch(()=>{})); return hit; }
    return net.catch(()=>c.match('index.html')); }))); });
