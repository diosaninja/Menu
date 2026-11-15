// Funciona sin conexión: intenta la red primero y, si no hay, usa la copia guardada.
const C='menu-v5';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon.png'])).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const mine=u.origin===location.origin, ext=u.hostname.startsWith('fonts.g')||u.pathname.startsWith('/firebasejs/');
  if(!mine&&!ext)return; // Firebase y demás: sin tocar
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:mine}).then(r=>r||(mine?caches.match('index.html'):undefined))));
});
