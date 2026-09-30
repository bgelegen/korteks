/* Uygulamayı başlat */
'use strict';
route();

/* Çevrimdışı çalışma: servis çalışanını kaydet (yalnızca http/https'te) */
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

/* Android geri tuşu (Capacitor içinde çalışırken) */
(function(){
  const cap=window.Capacitor,App=cap&&cap.Plugins&&cap.Plugins.App;
  if(!App)return;
  App.addListener('backButton',()=>{
    const h=location.hash;
    if(!h||h==='#/'||h==='#')App.exitApp();
    else if(h.startsWith('#/oyun/')){const g=GM[h.split('/')[2]];go(g?'#/kategori/'+g.cat:'#/')}
    else go('#/');
  });
})();
