const C='da-wiki-v'+1791531028;
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','wiki.css','search.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','pages.json']))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>
  caches.open(C).then(c=>fetch('pages.json').then(r=>r.json()).then(list=>{ let i=0; const next=()=>{ const batch=list.slice(i,i+20); i+=20; if(!batch.length) return; return c.addAll(batch).catch(()=>{}).then(next); }; return next(); })).catch(()=>{}))); });
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); } return r; }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html')))); });
