/* KORTEKS — ekranlar: karşılama, ana sayfa, kategori, oyun tanıtımı, ilerleme, ayarlar ve yönlendirici */
'use strict';

const TAB_I={
  home:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.5L12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/></svg>',
  stats:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V11M10 20V4M16 20v-7M22 20H2"/></svg>',
  settings:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
};
function tabs(active){
  let nav=$('#tabs');
  if(!nav){nav=document.createElement('nav');nav.id='tabs';nav.className='tabs glass';document.body.appendChild(nav)}
  nav.innerHTML=[['home','#/','Bugün'],['stats','#/ilerleme','İlerleme'],['settings','#/ayarlar','Ayarlar']]
    .map(([k,h,l])=>`<a href="${h}" class="${k===active?'on':''}" ${k===active?'aria-current="page"':''}>${TAB_I[k]}<span>${l}</span></a>`).join('');
}
function page(cls){stopAll();app.className='app enter '+(cls||'');app.style.removeProperty('--h');window.scrollTo(0,0)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function greet(){const h=new Date().getHours();return h<6?'İyi geceler':h<12?'Günaydın':h<18?'İyi günler':'İyi akşamlar'}

/* ---------- karşılama ---------- */
function onboarding(){
  document.body.classList.add('ingame');
  page('onb');
  const catArt=`<div class="onb-cats">${Object.entries(CATS).map(([k,c],i)=>`<span style="--h:${c.h};animation-delay:${i*60}ms">${icon(k,26)}</span>`).join('')}</div>`;
  const ringArt=`<div class="onb-ring"><svg viewBox="0 0 120 120"><defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".5" stop-color="#8B7CFF"/><stop offset="1" stop-color="#F472B6"/></linearGradient></defs><circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="10"/><circle cx="60" cy="60" r="48" fill="none" stroke="url(#og)" stroke-width="10" stroke-linecap="round" stroke-dasharray="301.6" stroke-dashoffset="90" transform="rotate(-90 60 60)"/></svg><b class="num">712</b></div>`;
  const S=[
    {art:`<div class="onb-logo"><span>${logoSvg}</span></div>`,t:'KORTEKS\'e hoş geldin',p:'Her gün birkaç dakikalık oyunlarla zihnini çalıştır. Kısa, eğlenceli ve her seferinde biraz daha zor.'},
    {art:catArt,t:'8 alan, 50 oyun',p:'Hafızadan hıza, dilden uzamsal düşünmeye kadar her beceri için ayrı ayrı tasarlanmış özgün oyunlar.'},
    {art:ringArt,t:'Gelişimini izle',p:'Korteks Endeksi, gün serisi ve beceri haritası ile nerede güçlü olduğunu ve neyi çalışman gerektiğini gör.'},
    {art:`<div class="onb-logo small"><span>${logoSvg}</span></div>`,t:'Sana nasıl hitap edelim?',p:'Adın yalnızca bu cihazda saklanır.',name:true}];
  let i=0;
  function draw(){
    const s=S[i];
    app.innerHTML=`<div class="onb-top">${i<S.length-1?'<button class="link" id="skip">Geç</button>':'<span></span>'}</div>
    <div class="onb-art" key="${i}">${s.art}</div>
    <div class="onb-tx"><h1>${s.t}</h1><p>${s.p}</p>${s.name?`<label class="field-l" for="nm">Adın</label><input id="nm" class="inp glass" maxlength="24" autocomplete="given-name" placeholder="Örn. Batuhan" value="${esc(data.profile.name)}">`:''}</div>
    <div class="onb-dots">${S.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div>
    <button class="btn" id="nx">${s.name?'Başlayalım':'Devam'}</button>`;
    $('#nx').onclick=()=>{if(s.name){data.profile.name=($('#nm').value||'').trim().slice(0,24);data.onboarded=true;save();go('#/')}else{i++;draw()}};
    const sk=$('#skip');if(sk)sk.onclick=()=>{i=S.length-1;draw()};
    const nm=$('#nm');if(nm){nm.addEventListener('keydown',e=>{if(e.key==='Enter')$('#nx').click()})}
  }
  draw();
  let sx=null;app.ontouchstart=e=>{sx=e.touches[0].clientX};app.ontouchend=e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(dx<-50&&i<S.length-1){i++;draw()}else if(dx>50&&i>0){i--;draw()}};
}

/* ---------- ana sayfa ---------- */
function home(){
  page();tabs('home');
  const ix=index(),R=62,C=2*Math.PI*R,nr=nextRank(ix);
  let ticks='';for(let i=0;i<40;i++){const a=i/40*Math.PI*2;ticks+=`<line class="tick" x1="${75+Math.cos(a)*73}" y1="${75+Math.sin(a)*73}" x2="${75+Math.cos(a)*(i%5?70:67)}" y2="${75+Math.sin(a)*(i%5?70:67)}"/>`}
  const daily=dailyPicks(),td=playedToday(),doneN=daily.filter(g=>td.includes(g.id)).length;
  const nm=data.profile.name;
  app.innerHTML=`
  <header class="top">
    <div class="hello"><small>${greet()}</small><h1>${nm?esc(nm):'Zihin atleti'}</h1></div>
    <div class="row" style="gap:8px;flex-wrap:nowrap"><div class="streak glass" title="Gün serisi">${flame}<span class="num">${streak()}</span></div><a class="avatar" href="#/ayarlar" aria-label="Ayarlar">${nm?esc(tl(nm[0])):logoSvg}</a></div>
  </header>
  <section class="hero glass">
    <div class="ringwrap">
      <svg viewBox="0 0 150 150"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".5" stop-color="#8B7CFF"/><stop offset="1" stop-color="#F472B6"/></linearGradient></defs>
      ${ticks}<circle class="trk" cx="75" cy="75" r="${R}"/><circle class="val" id="ringv" cx="75" cy="75" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 75 75)"/></svg>
      <div class="ringin"><div class="big num" id="bs">0</div><div class="of">/ 1000</div></div>
    </div>
    <div class="herotx">
      <div class="lbl">Korteks Endeksi</div>
      <span class="lvlpill">${rank(ix)}</span>
      <p>${nr?`<b>${nr[1]}</b> seviyesine <b class="num">${nr[0]-ix}</b> puan kaldı.`:'En üst seviyedesin!'}</p>
    </div>
  </section>
  <section class="tour glass">
    <div class="tour-h"><div><div class="lbl">Günün turu</div><h2>5 alan, yaklaşık 6 dakika</h2></div><span class="num tour-n">${doneN}/5</span></div>
    <div class="tour-steps">${daily.map(g=>`<a href="#/oyun/${g.id}" class="tstep ${td.includes(g.id)?'done':''}" style="--h:${CATS[g.cat].h}" title="${g.name}"><span>${td.includes(g.id)?checkI:icon(g.cat,18)}</span><small>${CATS[g.cat].n}</small></a>`).join('')}</div>
    <button class="btn" id="tourgo">${doneN===5?'Tur tamamlandı · Yeniden oyna':doneN?'Tura devam et':'Turu başlat'}</button>
  </section>
  <div class="sec"><h2>Beyin alanları</h2><span>${Object.keys(data.best).length}/50 oyun denendi</span></div>
  <div class="catgrid">${Object.entries(CATS).map(([k,c])=>`<a class="cattile" href="#/kategori/${k}" style="--h:${c.h}">
      <span class="ci">${icon(k,28)}</span>
      <span class="cn">${c.n}</span>
      <span class="cm">${gamesOf(k).length} oyun · %${catPct(k)}</span>
      <span class="pb"><i style="width:${catPct(k)}%"></i></span></a>`).join('')}</div>`;
  $('#tourgo').onclick=()=>{const list=daily.map(g=>g.id);let i=list.findIndex(id=>!td.includes(id));if(i<0)i=0;tour={list,i};go('#/oyun/'+list[i])};
  countUp($('#bs'),ix,1400);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const rv=$('#ringv');if(rv)rv.style.strokeDashoffset=C*(1-Math.max(Math.min(1,ix/1000),.004))}));
}

/* ---------- kategori ---------- */
function category(k){
  page();tabs('home');const c=CATS[k],gs=gamesOf(k);app.style.setProperty('--h',c.h);
  app.innerHTML=`
  <div class="gtop"><a class="back glass" href="#/" aria-label="Ana sayfa">${backI}</a><h2>${c.n}</h2></div>
  <section class="cathero glass">
    <span class="ci big">${icon(k,40)}</span>
    <div><h1>${c.n}</h1><p>${c.about}</p></div>
    <div class="cstats"><div><b class="num">%${catPct(k)}</b><span>en iyi</span></div><div><b class="num">${catPlayed(k)}/${gs.length}</b><span>denendi</span></div><div><b class="num">${gs.reduce((s,g)=>s+(data.best[g.id]||0),0)}</b><span>toplam rekor</span></div></div>
  </section>
  <div class="glist">${gs.map((g,i)=>`<a class="grow glass" href="#/oyun/${g.id}">
      <span class="gl">${g.gl}</span>
      <span class="gt"><b>${g.name}</b><small>${shortOf(g)}</small></span>
      <span class="gr">${data.best[g.id]?`<b class="num">${data.best[g.id]}</b><small>rekor</small>`:'<em>Yeni</em>'}</span>
      <span class="chev">${chevI}</span></a>`).join('')}</div>`;
}

/* ---------- oyun tanıtımı ---------- */
function intro(id){
  const g=GM[id];stopAll();
  shell(g,[]);$('#timerwrap').hidden=true;
  $('#stage').innerHTML=`<div class="intro glass enter"><div class="bigg">${g.gl}</div><div><div class="k">${CATS[g.cat].n} · #${String(g.no).padStart(2,'0')}</div><h3>${g.name}</h3></div><p>${g.desc}</p><div class="rules">${tagsOf(g).map(t=>`<span>${t}</span>`).join('')}${data.best[id]?`<span>Rekor ${data.best[id]}</span>`:''}</div><button class="btn" id="go">Başla</button></div>`;
  $('#go').onclick=()=>{try{if(data.settings.sound){actx=actx||new (window.AudioContext||window.webkitAudioContext)();actx.resume&&actx.resume()}}catch(e){}start(g)};
}

/* ---------- ilerleme ---------- */
function radar(){
  const ks=Object.keys(CATS),cx=160,cy=150,R=100,n=ks.length;
  const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r]};
  let g='';[.25,.5,.75,1].forEach(f=>{g+=`<polygon points="${ks.map((_,i)=>pt(i,R*f).join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,${f===1?.16:.07})"/>`});
  ks.forEach((_,i)=>{const [x,y]=pt(i,R);g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,.07)"/>`});
  const vals=ks.map(k=>Math.max(.04,catPct(k)/100));
  const poly=ks.map((_,i)=>pt(i,R*vals[i]).join(',')).join(' ');
  let lab='';ks.forEach((k,i)=>{const [x,y]=pt(i,R+26);const [dx,dy]=pt(i,R*vals[i]);lab+=`<circle cx="${dx}" cy="${dy}" r="4" fill="${CATS[k].h}"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${CATS[k].h}" font-size="11.5" font-weight="700" font-family="Manrope,system-ui,sans-serif">${CATS[k].n}</text><text x="${x}" y="${y+14}" text-anchor="middle" fill="#9AA3C7" font-size="10" font-family="JetBrains Mono,monospace">%${catPct(k)}</text>`});
  return `<svg viewBox="0 0 320 305" class="radar"><defs><linearGradient id="rdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE" stop-opacity=".45"/><stop offset="1" stop-color="#F472B6" stop-opacity=".45"/></linearGradient></defs>${g}<polygon points="${poly}" fill="url(#rdg)" stroke="#C9C2FF" stroke-width="2" stroke-linejoin="round"/>${lab}</svg>`;
}
function stats(){
  page();tabs('stats');
  const set=new Set(data.days);const days=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push({on:set.has(key(d)),l:d.toLocaleDateString('tr-TR',{weekday:'narrow'}),t:i===0})}
  const recs=Object.keys(data.best).length;
  const hist=data.history.filter(h=>GM[h.g]);
  const ks=Object.keys(CATS).sort((a,b)=>catPct(b)-catPct(a));
  app.innerHTML=`
  <header class="top"><div class="hello"><small>Gelişimin</small><h1>İlerleme</h1></div></header>
  <div class="kpis"><div class="glass"><b class="num">${index()}</b><span>Endeks</span></div><div class="glass"><b class="num">${streak()}</b><span>Gün serisi</span></div><div class="glass"><b class="num">${hist.length}</b><span>Seans</span></div><div class="glass"><b class="num">${recs}</b><span>Rekor</span></div></div>
  <section class="card glass"><div class="sec"><h2>Beceri haritası</h2><span>alan başına en iyi</span></div>${radar()}
    ${recs?`<p class="note">En güçlü alanın <b style="color:${CATS[ks[0]].h}">${CATS[ks[0]].n}</b>. Gelişmeye en açık alan <b style="color:${CATS[ks[ks.length-1]].h}">${CATS[ks[ks.length-1]].n}</b>.</p>`:'<p class="note">Oyun oynadıkça harita dolacak.</p>'}</section>
  <section class="card glass"><div class="sec"><h2>Son 14 gün</h2><span>${days.filter(d=>d.on).length} aktif gün</span></div>
    <div class="days">${days.map(d=>`<div class="${d.on?'on':''} ${d.t?'t':''}"><i></i><small>${d.l}</small></div>`).join('')}</div></section>
  <div class="sec"><h2>Son seanslar</h2></div>
  <div class="hist">${hist.length?hist.slice(0,8).map(h=>`<a class="hrow glass" href="#/oyun/${h.g}" style="--h:${CATS[GM[h.g].cat].h}"><i class="dot"></i><div class="nm">${GM[h.g].name}<span>${h.d}</span></div><b class="num">${h.s}</b></a>`).join(''):'<div class="empty">Henüz seans yok. İlk skorun burada görünecek.</div>'}</div>`;
}

/* ---------- ayarlar ---------- */
function settings(){
  page();tabs('settings');
  const tg=(id,on,l,s)=>`<label class="set glass" for="${id}"><span><b>${l}</b><small>${s}</small></span><input type="checkbox" id="${id}" class="sw" ${on?'checked':''}></label>`;
  app.innerHTML=`
  <header class="top"><div class="hello"><small>Tercihlerin</small><h1>Ayarlar</h1></div></header>
  <div class="sgroup"><div class="slbl">Profil</div>
    <div class="set glass col"><label for="pname"><b>Adın</b><small>Ana sayfada seni böyle selamlarız</small></label><input id="pname" class="inp" maxlength="24" value="${esc(data.profile.name)}" placeholder="Adını yaz"></div></div>
  <div class="sgroup"><div class="slbl">Oyun</div>
    ${tg('ssound',data.settings.sound,'Ses efektleri','Doğru, yanlış ve rekor sesleri')}
    ${tg('svib',data.settings.vibrate,'Titreşim','Destekleyen cihazlarda yanlış cevapta titrer')}</div>
  <div class="sgroup"><div class="slbl">Veri</div>
    <div class="set glass col" id="resetbox"><span><b>İlerlemeyi sıfırla</b><small>Tüm rekorlar, seri ve geçmiş bu cihazdan silinir</small></span><button class="btn danger" id="reset">Sıfırla</button></div></div>
  <div class="sgroup"><div class="slbl">Hakkında</div>
    <a class="set glass" href="privacy.html"><span><b>Gizlilik politikası</b><small>Hiçbir kişisel veri toplanmaz</small></span>${chevI}</a>
    <button class="set glass" id="replay"><span><b>Karşılama ekranını göster</b><small>Tanıtımı yeniden izle</small></span>${chevI}</button>
    <div class="about"><div class="logo"><span>${logoSvg}</span></div><b>KORTEKS</b><small>Sürüm ${VERSION} · 50 özgün zihin oyunu</small></div></div>`;
  $('#pname').oninput=e=>{data.profile.name=e.target.value.trim().slice(0,24);save()};
  $('#ssound').onchange=e=>{data.settings.sound=e.target.checked;save();if(e.target.checked)sfx.ok()};
  $('#svib').onchange=e=>{data.settings.vibrate=e.target.checked;save();buzz(40)};
  $('#replay').onclick=()=>{data.onboarded=false;save();route()};
  $('#reset').onclick=()=>{const b=$('#resetbox');b.innerHTML=`<span><b>Emin misin?</b><small>Bu işlem geri alınamaz.</small></span><div class="row" style="justify-content:flex-start"><button class="btn ghost sm" id="rno">Vazgeç</button><button class="btn danger sm" id="ryes">Evet, sıfırla</button></div>`;
    $('#rno').onclick=settings;$('#ryes').onclick=()=>{const keep={profile:data.profile,settings:data.settings,onboarded:true};data=Object.assign(DEFAULTS(),keep);save();settings();const f=document.createElement('div');f.className='toast';f.textContent='İlerleme sıfırlandı';document.body.appendChild(f);setTimeout(()=>f.remove(),2200)}};
}

/* ---------- yönlendirici ---------- */
function route(){
  stopAll();document.body.classList.remove('ingame');
  const [a,b]=location.hash.replace(/^#\/?/,'').split('/');
  if(!data.onboarded){onboarding();return}
  if(a==='oyun'&&GM[b]){if(tour&&tour.list[tour.i]!==b)tour=null;intro(b);return}
  if(a!=='oyun')tour=tour&&tour.done?null:tour;
  if(a==='kategori'&&CATS[b])category(b);
  else if(a==='ilerleme')stats();
  else if(a==='ayarlar')settings();
  else home();
}
addEventListener('hashchange',route);
