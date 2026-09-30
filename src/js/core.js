/* KORTEKS — çekirdek: durum, yardımcılar, oyun kaydı ve oyun motorları */
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const app=$('#app');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const VERSION='1.1.0';

/* ---------- kalıcı durum ---------- */
const store={
  get(){try{return JSON.parse(localStorage.getItem('korteks-v1'))||null}catch(e){return null}},
  set(v){try{localStorage.setItem('korteks-v1',JSON.stringify(v))}catch(e){}}
};
const DEFAULTS=()=>({best:{},history:[],days:[],played:{},settings:{sound:true,vibrate:true},profile:{name:''},onboarded:false});
let data=Object.assign(DEFAULTS(),store.get()||{});
data.settings=Object.assign({sound:true,vibrate:true},data.settings);
data.profile=Object.assign({name:''},data.profile);
const save=()=>store.set(data);

/* ---------- geri bildirim: titreşim ve ses ---------- */
const buzz=ms=>{if(!data.settings.vibrate)return;try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};
let actx=null;
function tone(f,d,type,vol,delay){if(!data.settings.sound)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime+(delay||0);const o=actx.createOscillator(),g=actx.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(vol||.07,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(actx.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const sfx={ok(){tone(740,.09,'sine',.06);tone(1110,.12,'sine',.05,.06)},no(){tone(170,.2,'triangle',.08)},tap(){tone(520,.04,'sine',.03)},
  win(){[523,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.06,i*.09))},tick(){tone(440,.06,'sine',.05)},go(){tone(880,.15,'sine',.06)}};

/* ---------- helpers ---------- */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sample=(a,n)=>shuf(a).slice(0,n);
function mk(correct,wrongs,extra){const all=shuf([correct,...wrongs]);return Object.assign({opts:all.map(String),ans:all.indexOf(correct)},extra||{})}
function near(c,n,spread,min){min=min===undefined?0:min;const s=new Set();let g=0;while(s.size<n&&g<400){g++;const v=c+ri(-spread,spread);if(v>=min&&v!==c)s.add(v)}let k=1;while(s.size<n){if(!s.has(c+spread+k))s.add(c+spread+k);k++}return [...s]}
const tl=s=>s.toLocaleUpperCase('tr-TR');
const COLV={kırmızı:'#FF5A6A',mavi:'#4D8DFF',sarı:'#FACC15',yeşil:'#34D399',mor:'#B08CFF'};
const CN=Object.keys(COLV);
const KINDS=['circle','square','triangle','diamond','star','hex','plus','ring'];
function shp(k,c,s){s=s||40;const f=`fill="${c}"`;const P={
  circle:`<circle cx="20" cy="20" r="15" ${f}/>`,square:`<rect x="6" y="6" width="28" height="28" rx="4" ${f}/>`,
  triangle:`<path d="M20 4L37 34H3Z" ${f}/>`,diamond:`<path d="M20 3L37 20L20 37L3 20Z" ${f}/>`,
  star:`<path d="M20 3l5 11 12 1-9 8 3 12-11-7-11 7 3-12-9-8 12-1z" ${f}/>`,hex:`<path d="M11 5h18l9 15-9 15H11L2 20z" ${f}/>`,
  plus:`<path d="M15 4h10v11h11v10H25v11H15V25H4V15h11z" ${f}/>`,ring:`<circle cx="20" cy="20" r="12" fill="none" stroke="${c}" stroke-width="6"/>`};
  return `<svg class="shp" viewBox="0 0 40 40" width="${s}" height="${s}">${P[k]}</svg>`}
const TOK=[];KINDS.forEach(k=>CN.forEach(c=>TOK.push(k+'|'+c)));
const tok=(t,s)=>{const [k,c]=t.split('|');return shp(k,COLV[c],s)};
function similar(t,avoid){const [k,c]=t.split('|');let o;let g=0;do{o=Math.random()<.5?k+'|'+pick(CN):pick(KINDS)+'|'+c;g++}while((o===t||(avoid&&avoid.includes(o)))&&g<100);return o}
const swatch=c=>`<span class="swatch" style="background:${COLV[c]};color:${COLV[c]}"></span>`;
const frac=(a,b)=>`<span class="frac"><b>${a}</b><span>${b}</span></span>`;
const money=v=>v.toFixed(2).replace('.',',')+' ₺';

/* ---------- neural background ---------- */
(function net(){
  const c=$('#net'),x=c.getContext('2d');let W,H,pts=[];const dpr=Math.min(2,devicePixelRatio||1);
  function size(){W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr;const n=Math.round(Math.min(55,innerWidth*innerHeight/15000));
    pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25*dpr,vy:(Math.random()-.5)*.25*dpr,r:(Math.random()*1.6+.6)*dpr}))}
  size();addEventListener('resize',size);const L=130*dpr;
  function f(){x.clearRect(0,0,W,H);
    for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<L){x.strokeStyle=`rgba(139,124,255,${(1-d/L)*.32})`;x.lineWidth=dpr;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
    for(const p of pts){x.fillStyle='rgba(180,210,255,.8)';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}
    if(!reduce)requestAnimationFrame(f)}
  f();
})();
function confetti(){
  if(reduce)return;
  const c=$('#fx'),x=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1);
  c.width=innerWidth*dpr;c.height=innerHeight*dpr;
  const cols=['#22D3EE','#F472B6','#FBBF24','#A3E635','#8B7CFF'];
  const ps=Array.from({length:140},()=>({x:c.width/2,y:c.height*.35,vx:(Math.random()-.5)*16*dpr,vy:(Math.random()*-14-4)*dpr,s:(Math.random()*6+4)*dpr,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:pick(cols)}));
  let t=0;(function f(){x.clearRect(0,0,c.width,c.height);t++;
    for(const p of ps){p.vy+=.35*dpr;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()}
    if(t<180)requestAnimationFrame(f);else x.clearRect(0,0,c.width,c.height)})();
}

/* ---------- kategoriler ve oyun kaydı ---------- */
const ICON={
  hafiza:'<rect x="3" y="7" width="13" height="14" rx="2.5"/><path d="M8 3.5h10.5A2.5 2.5 0 0 1 21 6v11"/>',
  dikkat:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2"/>',
  hiz:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  esneklik:'<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
  mantik:'<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="12" cy="18" r="2.6"/><path d="M7.4 8.3l3.4 7.3M16.6 8.3l-3.4 7.3M8.6 6h6.8"/>',
  sayi:'<path d="M5 9h15M4 15h15M10 3.5L8 20.5M16 3.5l-2 17"/>',
  dil:'<path d="M4 4.5h16v11.5H10l-6 4.5z"/><path d="M8 8.5h8M8 12h5"/>',
  uzam:'<path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3z"/><path d="M3.5 7.3L12 12l8.5-4.7M12 12v9.5"/>'
};
const icon=(k,s)=>`<svg viewBox="0 0 24 24" width="${s||24}" height="${s||24}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;
const CATS={
  hafiza:{n:'Hafıza',h:'#22D3EE',about:'Bilgiyi kısa süre aklında tutma ve doğru sırayla geri çağırma.'},
  dikkat:{n:'Dikkat',h:'#A3E635',about:'Kalabalığın içinde önemli olanı fark etme ve odağı koruma.'},
  hiz:{n:'Hız',h:'#FB923C',about:'Gördüğünü hızla işleme ve anında tepki verme.'},
  esneklik:{n:'Esneklik',h:'#F472B6',about:'Kurallar değiştiğinde düşünme biçimini hızla uyarlama.'},
  mantik:{n:'Mantık',h:'#FBBF24',about:'Örüntüleri çözme ve ipuçlarından sonuç çıkarma.'},
  sayi:{n:'Sayılar',h:'#B08CFF',about:'Kafadan hesap, tahmin ve sayı duygusu.'},
  dil:{n:'Dil',h:'#60A5FA',about:'Kelime bilgisi, yazım ve sözel akıcılık.'},
  uzam:{n:'Uzamsal',h:'#34D399',about:'Şekilleri zihinde döndürme ve yön bulma.'}};
const ALL=[],GM={};
function def(g){g.no=ALL.length+1;ALL.push(g);GM[g.id]=g}
const gamesOf=cat=>ALL.filter(g=>g.cat===cat);
const shortOf=g=>g.desc.split(/(?<=[.!?])\s/)[0];
const parOf=g=>g.par||(g.mode==='rounds'?1200:2200);
function pct(id){const g=GM[id];return Math.min(100,Math.round(((data.best[id]||0)/parOf(g))*100))}
function catPct(cat){return Math.max(0,...gamesOf(cat).map(g=>pct(g.id)))}
function catPlayed(cat){return gamesOf(cat).filter(g=>data.best[g.id]).length}
function index(){const cs=Object.keys(CATS);return Math.round(cs.reduce((s,c)=>s+catPct(c),0)/cs.length*10)}
const RANKS=[[800,'Dahi'],[600,'Usta'],[400,'Keskin'],[150,'Gelişiyor'],[0,'Çaylak']];
function rank(s){return RANKS.find(r=>s>=r[0])[1]}
function nextRank(s){const i=RANKS.findIndex(r=>s>=r[0]);return i>0?RANKS[i-1]:null}
function key(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function today(){return key(new Date())}
function streak(){const set=new Set(data.days);let n=0;const d=new Date();if(!set.has(today()))d.setDate(d.getDate()-1);while(set.has(key(d))){n++;d.setDate(d.getDate()-1)}return n}
function dailyPicks(){let s=0;for(const ch of today())s=(s*31+ch.charCodeAt(0))>>>0;const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
  const cats=Object.keys(CATS).sort(()=>rnd()-.5).slice(0,5);return cats.map(c=>{const gs=gamesOf(c);return gs[Math.floor(rnd()*gs.length)]})}
const playedToday=()=>data.played[today()]||[];
function countUp(el,to,ms){if(!el)return;if(reduce||!to){el.textContent=to;return}const t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/ms),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e);if(k<1)requestAnimationFrame(f)})(t0)}
const go=h=>{if(location.hash===h)window.dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=h};
let tour=null; /* {list:[id], i} — günün turu oynanırken */

const logoSvg='<svg viewBox="0 0 24 24" fill="none"><path d="M5 7L12 17L19 6M5 7L19 6M12 17V22" stroke="#C9C2FF" stroke-width="1.4" opacity=".8"/><circle cx="5" cy="7" r="2.8" fill="#22D3EE"/><circle cx="19" cy="6" r="2.4" fill="#F472B6"/><circle cx="12" cy="17" r="3.2" fill="#FBBF24"/></svg>';
const backI='<svg viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const chevI='<svg viewBox="0 0 18 18" width="16" height="16" fill="none"><path d="M7 3l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const checkI='<svg viewBox="0 0 12 12" fill="none"><path d="M2 6.5L5 9l5-6" stroke="#07230F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const playI='<svg viewBox="0 0 12 12" width="12" height="12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
const flame='<svg class="flame" viewBox="0 0 14 18"><defs><linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F472B6"/><stop offset="1" stop-color="#FBBF24"/></linearGradient></defs><path d="M7 0C8 4 13 6 13 11.5A6 6 0 0 1 1 11.5C1 8.5 3 7 3.5 5 5 7 5.5 8 6 9 7.5 6 7 3 7 0z" fill="url(#fl)"/></svg>';

/* ---------- oyun kabuğu ---------- */
let timers=[],raf=null,moveRaf=null,loops=[];
function later(fn,ms){const t=setTimeout(fn,ms);timers.push(t);return t}
function every(fn,ms){const t=setInterval(fn,ms);loops.push(t);return t}
function stopAll(){timers.forEach(clearTimeout);timers=[];loops.forEach(clearInterval);loops=[];if(raf)cancelAnimationFrame(raf);raf=null;if(moveRaf)cancelAnimationFrame(moveRaf);moveRaf=null}
function shell(g,chips){
  document.body.classList.add('ingame');
  app.className='app';
  app.style.setProperty('--h',CATS[g.cat].h);
  app.innerHTML=`
  <div class="gtop"><button class="back glass" id="back" aria-label="Geri">${backI}</button><h2>${g.name}${tour&&tour.list[tour.i]===g.id?`<small>Günün turu · ${tour.i+1}/5</small>`:''}</h2>
  <div class="stats">${chips.map(c=>`<div class="chip glass">${c[0]}<b id="${c[1]}">${c[2]}</b></div>`).join('')}</div></div>
  <div class="timer" id="timerwrap"><i id="timer"></i></div>
  <div class="stage" id="stage"></div>`;
  $('#back').onclick=()=>{stopAll();go('#/kategori/'+g.cat)};
  window.scrollTo(0,0);
}
function tagsOf(g){if(g.tags)return g.tags;if(g.mode==='rounds')return['3 hak','Seviyeli'];return[(g.time||45)+' sn','Seri çarpanı']}
function start(g){stopAll();if(g.mode==='quiz')runQuiz(g);else if(g.mode==='rounds')runRounds(g);else g.run(g)}
function countdown(cb){
  const st=$('#stage');const o=document.createElement('div');o.className='count';st.appendChild(o);
  let n=3;(function t(){if(n===0){o.remove();sfx.go();cb();return}o.innerHTML=`<span>${n}</span>`;sfx.tick();n--;later(t,reduce?300:700)})();
}
function runTimer(sec,onEnd){
  const t0=performance.now(),bar=$('#timer'),wrap=$('#timerwrap');wrap.hidden=false;
  const tick=now=>{const f=Math.max(0,1-(now-t0)/(sec*1000));if(bar)bar.style.width=(f*100)+'%';if(wrap)wrap.classList.toggle('low',f<.2);if(f<=0){raf=null;onEnd();return}raf=requestAnimationFrame(tick)};
  raf=requestAnimationFrame(tick);
}
function fb(ok,txt,pts,anchor){
  if(ok)sfx.ok();else sfx.no();
  const f=$('#fb');if(f){f.className='feedback '+(ok?'ok':'no');f.textContent=txt||(ok?'Doğru!':'Yanlış');later(()=>{f.textContent=''},600)}
  const st=$('#stage');if(!st)return;
  if(!ok){buzz(60);st.classList.remove('shake');void st.offsetWidth;st.classList.add('shake')}
  else if(pts){const fl=document.createElement('div');fl.className='floater';fl.textContent='+'+pts;
    const r=(anchor||st).getBoundingClientRect(),sr=st.getBoundingClientRect();
    fl.style.left=(r.left-sr.left+r.width/2-20)+'px';fl.style.top=(r.top-sr.top)+'px';st.appendChild(fl);later(()=>fl.remove(),800)}
}
const pctStat=(ok,w)=>'%'+(ok+w?Math.round(ok*100/(ok+w)):0);
function finish(id,score,stats){
  stopAll();
  const prev=data.best[id]||0,isBest=score>prev&&score>0;
  const ixBefore=index();
  if(isBest)data.best[id]=score;
  const d=new Date();
  data.history.unshift({g:id,s:score,t:Date.now(),d:d.toLocaleDateString('tr-TR',{day:'numeric',month:'long'})+' · '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})});
  data.history=data.history.slice(0,60);
  if(!data.days.includes(today()))data.days.push(today());
  data.days=data.days.slice(-120);
  const td=data.played[today()]=data.played[today()]||[];if(!td.includes(id))td.push(id);
  for(const k in data.played)if(k!==today())delete data.played[k];
  save();
  const ixAfter=index();
  $('#timerwrap').hidden=true;
  const g=GM[id];
  let nextBtn='';
  if(tour&&tour.list[tour.i]===id){
    if(tour.i<tour.list.length-1){const nx=GM[tour.list[tour.i+1]];nextBtn=`<button class="btn" id="nxt">Turda sıradaki: ${nx.name}</button>`}
    else{nextBtn='';tour.done=true}
  }else{const gs=gamesOf(g.cat),nx=gs[(gs.indexOf(g)+1)%gs.length];nextBtn=`<button class="btn ghost" id="nxt">Sıradaki: ${nx.name}</button>`}
  $('#stage').innerHTML=`<div class="result glass enter">
    ${tour&&tour.done?'<div><span class="badge">Günün turu tamamlandı</span></div>':isBest?'<div><span class="badge">Yeni rekor</span></div>':`<div class="prompt">Rekorun: <b class="num">${prev}</b></div>`}
    <div><div class="lbl">Skor</div><div class="score num" id="fs">0</div></div>
    <div class="rgrid">${stats.map(s=>`<div><b>${s[1]}</b>${s[0]}</div>`).join('')}</div>
    ${ixAfter>ixBefore?`<div class="gain">Korteks Endeksi <b class="num">${ixBefore} → ${ixAfter}</b></div>`:''}
    ${tour&&!tour.done?nextBtn:''}
    <button class="btn ${tour&&!tour.done?'ghost':''}" id="again">Tekrar oyna</button>
    ${tour?'':nextBtn}
    <button class="btn ghost" id="home">${tour&&tour.done?'Ana sayfaya dön':CATS[g.cat].n+' kategorisine dön'}</button></div>`;
  countUp($('#fs'),score,1000);
  if(isBest||(tour&&tour.done)){later(confetti,300);sfx.win()}
  $('#again').onclick=()=>start(g);
  const nb=$('#nxt');if(nb)nb.onclick=()=>{if(tour&&!tour.done){tour.i++;go('#/oyun/'+tour.list[tour.i])}else{const gs=gamesOf(g.cat);go('#/oyun/'+gs[(gs.indexOf(g)+1)%gs.length].id)}};
  $('#home').onclick=()=>{if(tour&&tour.done){tour=null;go('#/')}else{tour=null;go('#/kategori/'+g.cat)}};
}

/* ---------- QUIZ ENGINE ---------- */
function renderOpts(Q,onPick){
  const o=$('#opts');o.innerHTML='';o.className='opts'+(Q.txt?' txt':'');o.style.setProperty('--c',Q.cols||2);
  if(!Q.opts){o.hidden=true;return}
  o.hidden=false;
  Q.opts.forEach((v,i)=>{const b=document.createElement('button');b.className='glass'+(Q.cls&&Q.cls[i]?' '+Q.cls[i]:'');b.innerHTML=v;b.onclick=()=>onPick(i,b);o.appendChild(b)});
}
function bindTaps(onPick){$$('#q [data-a]').forEach(el=>el.onclick=()=>onPick(+el.dataset.a,el))}
function runQuiz(g){
  shell(g,[['Doğru','ok','0'],['Çarpan','mx','x1'],['Skor','sc','0']]);
  $('#timerwrap').hidden=true;
  let score=0,ok=0,wrong=0,run=0,live=false,Q=null;const st=g.init?g.init():{};
  $('#stage').innerHTML=`<div class="prompt" id="pm"></div><div class="qwrap glass" id="q"><div class="qsmall">Hazır ol</div></div><div class="feedback" id="fb"></div><div class="opts" id="opts"></div>`;
  const mult=()=>1+Math.min(4,Math.floor(run/4));
  function next(){
    Q=g.gen(1+Math.floor(ok/4),st);
    $('#pm').innerHTML=Q.p||'';
    const q=$('#q');q.innerHTML=Q.q;q.classList.remove('pop');void q.offsetWidth;q.classList.add('pop');
    renderOpts(Q,pickA);if(!Q.opts)bindTaps(pickA);
  }
  function pickA(i,el){
    if(!live)return;
    const good=Q.check?Q.check(i):i===Q.ans;
    if(g.onAns)g.onAns(good,st);
    if(good){ok++;run++;const p=(g.pts||50)*mult();score+=p;fb(true,null,p,el)}
    else{wrong++;run=0;fb(false,Q.why?Q.why:null)}
    $('#ok').textContent=ok;$('#mx').textContent='x'+mult();$('#sc').textContent=score;
    if(!good&&g.pause){live=false;const bs=$$('#opts button');if(bs[Q.ans])bs[Q.ans].classList.add('right');later(()=>{live=true;next()},g.pause)}
    else next();
  }
  countdown(()=>{live=true;next();runTimer(g.time||45,()=>{live=false;finish(g.id,score,[['Doğru',ok],['Yanlış',wrong],['İsabet',pctStat(ok,wrong)]])})});
}

/* ---------- ROUNDS ENGINE ---------- */
function runRounds(g){
  shell(g,[['Sv','lv','1'],['Hak','lf','3'],['Skor','sc','0']]);
  $('#timerwrap').hidden=true;
  let lv=1,lives=3,score=0,rounds=0,maxLv=1,active=false,Q=null;
  $('#stage').innerHTML=`<div class="prompt" id="pm"></div><div class="qwrap glass" id="q"></div><div class="feedback" id="fb"></div><div class="opts" id="opts"></div>`;
  function round(){
    $('#lv').textContent=lv;$('#lf').textContent=lives;$('#sc').textContent=score;
    Q=g.gen(lv);active=false;
    $('#opts').hidden=true;$('#opts').innerHTML='';
    $('#pm').innerHTML=Q.p1||'Aklında tut…';
    const q=$('#q');
    const ask=()=>{$('#pm').innerHTML=Q.p2||'';q.innerHTML=Q.q;q.classList.remove('pop');void q.offsetWidth;q.classList.add('pop');renderOpts(Q,pickA);if(!Q.opts)bindTaps(pickA);active=true};
    if(Q.seq){
      const ms=Q.ms||900;q.innerHTML='';
      Q.seq.forEach((fr,i)=>{later(()=>{q.innerHTML=fr;q.classList.remove('pop');void q.offsetWidth;q.classList.add('pop')},400+i*ms);later(()=>{q.innerHTML=''},400+i*ms+ms*.8)});
      later(ask,400+Q.seq.length*ms+150);
    }else{q.innerHTML=Q.show;q.classList.remove('pop');void q.offsetWidth;q.classList.add('pop');later(ask,Q.ms||2000)}
  }
  function pickA(i,el){
    if(!active)return;active=false;
    const good=Q.check?Q.check(i):i===Q.ans;
    if(good){el.classList.add('right');rounds++;const p=(g.pts||25)*lv;score+=p;fb(true,null,p,el);lv++;maxLv=Math.max(maxLv,lv);$('#sc').textContent=score;later(round,900)}
    else{el.classList.add('wrong');const t=Q.opts?$$('#opts button')[Q.ans]:$(`#q [data-a="${Q.ans}"]`);if(t)t.classList.add('right');
      lives--;$('#lf').textContent=lives;fb(false,Q.why||null);lv=Math.max(1,lv-1);
      if(lives<=0)later(()=>finish(g.id,score,[['Tur',rounds],['Max sv.',maxLv],['Hak',0]]),1400);else later(round,1500)}
  }
  later(round,300);
}
