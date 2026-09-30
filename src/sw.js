/* KORTEKS servis çalışanı: uygulamayı çevrimdışı kullanılabilir yapar.
   Dosya ekledikten sonra CACHE sürümünü artır (npm run sw ile otomatik). */
const CACHE='korteks-1.1.0';
const FILES=["./","css/fonts.css","css/style.css","fonts/jetbrains-mono-latin-600-normal.woff2","fonts/jetbrains-mono-latin-800-normal.woff2","fonts/jetbrains-mono-latin-ext-600-normal.woff2","fonts/jetbrains-mono-latin-ext-800-normal.woff2","fonts/manrope-latin-400-normal.woff2","fonts/manrope-latin-500-normal.woff2","fonts/manrope-latin-600-normal.woff2","fonts/manrope-latin-700-normal.woff2","fonts/manrope-latin-800-normal.woff2","fonts/manrope-latin-ext-400-normal.woff2","fonts/manrope-latin-ext-500-normal.woff2","fonts/manrope-latin-ext-600-normal.woff2","fonts/manrope-latin-ext-700-normal.woff2","fonts/manrope-latin-ext-800-normal.woff2","fonts/unbounded-latin-500-normal.woff2","fonts/unbounded-latin-700-normal.woff2","fonts/unbounded-latin-900-normal.woff2","fonts/unbounded-latin-ext-500-normal.woff2","fonts/unbounded-latin-ext-700-normal.woff2","fonts/unbounded-latin-ext-900-normal.woff2","icons/apple-touch-icon.png","icons/favicon-96.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","js/core.js","js/games/dikkat.js","js/games/dil.js","js/games/esneklik.js","js/games/hafiza.js","js/games/hiz.js","js/games/mantik.js","js/games/sayilar.js","js/games/uzamsal.js","js/main.js","js/ui.js","js/words.js","manifest.webmanifest","privacy.html"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
    return res}).catch(()=>caches.match('index.html'))));
});
