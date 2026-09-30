/* KORTEKS — çekirdek: yardımcılar, kayıt, ana sayfa, oyun motorları */
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const app=$('#app');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={
  get(){try{return JSON.parse(localStorage.getItem('korteks-v1'))||null}catch(e){return null}},
  set(v){try{localStorage.setItem('korteks-v1',JSON.stringify(v))}catch(e){}}
};
let data=store.get()||{best:{},history:[],days:[],played:{}};
data.played=data.played||{};
const buzz=ms=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};

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

/* ---------- registry ---------- */
const CATS={
  hafiza:{n:'Hafıza',h:'#22D3EE'},dikkat:{n:'Dikkat',h:'#A3E635'},hiz:{n:'Hız',h:'#FB923C'},esneklik:{n:'Esneklik',h:'#F472B6'},
  mantik:{n:'Mantık',h:'#FBBF24'},sayi:{n:'Sayılar',h:'#B08CFF'},dil:{n:'Dil',h:'#60A5FA'},uzam:{n:'Uzamsal',h:'#34D399'}};
const ALL=[],GM={};
function def(g){g.no=ALL.length+1;ALL.push(g);GM[g.id]=g}
const parOf=g=>g.par||(g.mode==='rounds'?1200:2200);
function pct(id){const g=GM[id];return Math.min(100,Math.round(((data.best[id]||0)/parOf(g))*100))}
function catPct(cat){const gs=ALL.filter(g=>g.cat===cat);return Math.max(0,...gs.map(g=>pct(g.id)))}
function index(){const cs=Object.keys(CATS);return Math.round(cs.reduce((s,c)=>s+catPct(c),0)/cs.length*10)}
function rank(s){return s>=800?'Dahi':s>=600?'Usta':s>=400?'Keskin':s>=150?'Gelişiyor':'Çaylak'}
function key(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function today(){return key(new Date())}
function streak(){const set=new Set(data.days);let n=0;const d=new Date();if(!set.has(today()))d.setDate(d.getDate()-1);while(set.has(key(d))){n++;d.setDate(d.getDate()-1)}return n}
function dailyPicks(){let s=0;for(const ch of today())s=(s*31+ch.charCodeAt(0))>>>0;const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
  const cats=Object.keys(CATS).sort(()=>rnd()-.5).slice(0,5);return cats.map(c=>{const gs=ALL.filter(g=>g.cat===c);return gs[Math.floor(rnd()*gs.length)]})}
function countUp(el,to,ms){if(!el)return;if(reduce||!to){el.textContent=to;return}const t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/ms),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e);if(k<1)requestAnimationFrame(f)})(t0)}

const logoSvg='<svg viewBox="0 0 24 24" fill="none"><path d="M5 7L12 17L19 6M5 7L19 6M12 17V22" stroke="#C9C2FF" stroke-width="1.4" opacity=".8"/><circle cx="5" cy="7" r="2.8" fill="#22D3EE"/><circle cx="19" cy="6" r="2.4" fill="#F472B6"/><circle cx="12" cy="17" r="3.2" fill="#FBBF24"/></svg>';
const backI='<svg viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const checkI='<svg viewBox="0 0 12 12" fill="none"><path d="M2 6.5L5 9l5-6" stroke="#07230F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const flame='<svg class="flame" viewBox="0 0 14 18"><defs><linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F472B6"/><stop offset="1" stop-color="#FBBF24"/></linearGradient></defs><path d="M7 0C8 4 13 6 13 11.5A6 6 0 0 1 1 11.5C1 8.5 3 7 3.5 5 5 7 5.5 8 6 9 7.5 6 7 3 7 0z" fill="url(#fl)"/></svg>';

/* ---------- HOME ---------- */
let filter='all';
function home(){
  stopAll();
  app.style.removeProperty('--h');
  const ix=index(),frac1=Math.min(1,ix/1000),R=62,C=2*Math.PI*R;
  const playedN=Object.keys(data.best).length;
  let ticks='';for(let i=0;i<40;i++){const a=i/40*Math.PI*2;ticks+=`<line class="tick" x1="${75+Math.cos(a)*73}" y1="${75+Math.sin(a)*73}" x2="${75+Math.cos(a)*(i%5?70:67)}" y2="${75+Math.sin(a)*(i%5?70:67)}"/>`}
  const daily=dailyPicks(),td=data.played[today()]||[];
  app.className='app enter';
  app.innerHTML=`
  <header class="top">
    <div class="brand"><div class="logo"><span>${logoSvg}</span></div><div><b>KORTEKS</b><small>50 özgün zihin oyunu</small></div></div>
    <div class="streak glass">${flame}<span class="num">${streak()}</span> gün</div>
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
      <p>${playedN?'8 beyin alanındaki en iyi performansının özeti.':'Bir oyun oyna, endeksin burada yükselsin.'}</p>
      <div class="minis"><span><b>${playedN}</b>/50 oyun</span><span><b>${data.history.length}</b> seans</span></div>
    </div>
  </section>
  <div class="sec"><h2>Günün beyin turu</h2><span>${td.filter(id=>daily.some(g=>g.id===id)).length}/5 tamam</span></div>
  <div class="daily">${daily.map((g,i)=>`<button class="dcard" data-g="${g.id}" style="--h:${CATS[g.cat].h}">${td.includes(g.id)?`<span class="done">${checkI}</span>`:''}<span class="n">${i+1}. ${tl(CATS[g.cat].n)}</span><span class="gl">${g.gl}</span><h3>${g.name}</h3></button>`).join('')}</div>
  <div class="cats" id="cats"><button class="cat ${filter==='all'?'on':''}" data-c="all" style="--h:#C9C2FF"><i></i>Tümü · 50</button>${Object.entries(CATS).map(([k,c])=>`<button class="cat ${filter===k?'on':''}" data-c="${k}" style="--h:${c.h}"><i></i>${c.n}</button>`).join('')}</div>
  <div class="games" id="games"></div>
  <div class="sec"><h2>Beceri haritası</h2><span>alan başına en iyi</span></div>
  <div class="skills glass">${Object.entries(CATS).map(([k,c])=>`<div class="bar" style="--h:${c.h}"><span>${c.n}</span><div class="t"><i data-w="${catPct(k)}"></i></div><span class="v">%${catPct(k)}</span></div>`).join('')}</div>
  <div class="sec"><h2>Son seanslar</h2></div>
  <div class="hist">${data.history.filter(h=>GM[h.g]).length?data.history.filter(h=>GM[h.g]).slice(0,5).map(h=>`<div class="hrow glass" style="--h:${CATS[GM[h.g].cat].h}"><i class="dot"></i><div class="nm">${GM[h.g].name}<span>${h.d}</span></div><b class="num">${h.s}</b></div>`).join(''):'<div class="empty">Henüz seans yok. İlk skorun burada parlayacak.</div>'}</div>`;
  drawGames();
  $$('#cats .cat').forEach(b=>b.onclick=()=>{filter=b.dataset.c;$$('#cats .cat').forEach(x=>x.classList.toggle('on',x===b));drawGames()});
  $$('.dcard').forEach(b=>b.onclick=()=>intro(b.dataset.g));
  countUp($('#bs'),ix,1400);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const rv=$('#ringv');if(rv)rv.style.strokeDashoffset=C*(1-Math.max(frac1,.004));$$('.bar i').forEach(i=>i.style.width=i.dataset.w+'%')}));
  window.scrollTo(0,0);
}
function drawGames(){
  const list=ALL.filter(g=>filter==='all'||g.cat===filter);
  $('#games').innerHTML=list.map(g=>`<button class="gcard" data-g="${g.id}" style="--h:${CATS[g.cat].h}">
    <div class="row"><span class="gl">${g.gl}</span><span class="no">#${String(g.no).padStart(2,'0')}</span></div>
    <div><div class="skill">${CATS[g.cat].n}</div><h3>${g.name}</h3></div>
    <div class="pb"><i style="width:${pct(g.id)}%"></i></div>
    <div class="best">Rekor <b>${data.best[g.id]||'—'}</b></div></button>`).join('');
  $$('#games .gcard').forEach(b=>b.onclick=()=>intro(b.dataset.g));
}

/* ---------- shell ---------- */
let timers=[],raf=null,moveRaf=null,loops=[];
function later(fn,ms){const t=setTimeout(fn,ms);timers.push(t);return t}
function every(fn,ms){const t=setInterval(fn,ms);loops.push(t);return t}
function stopAll(){timers.forEach(clearTimeout);timers=[];loops.forEach(clearInterval);loops=[];if(raf)cancelAnimationFrame(raf);raf=null;if(moveRaf)cancelAnimationFrame(moveRaf);moveRaf=null}
function shell(g,chips){
  app.className='app';
  app.style.setProperty('--h',CATS[g.cat].h);
  app.innerHTML=`
  <div class="gtop"><button class="back glass" id="back" aria-label="Ana sayfaya dön">${backI}</button><h2>${g.name}</h2>
  <div class="stats">${chips.map(c=>`<div class="chip glass">${c[0]}<b id="${c[1]}">${c[2]}</b></div>`).join('')}</div></div>
  <div class="timer" id="timerwrap"><i id="timer"></i></div>
  <div class="stage" id="stage"></div>`;
  $('#back').onclick=home;
  window.scrollTo(0,0);
}
function tagsOf(g){if(g.tags)return g.tags;if(g.mode==='rounds')return['3 hak','Seviyeli'];return[(g.time||45)+' sn','Seri çarpanı']}
function intro(id){
  stopAll();const g=GM[id];
  shell(g,[]);$('#timerwrap').hidden=true;
  $('#stage').innerHTML=`<div class="intro glass enter"><div class="bigg">${g.gl}</div><div><div class="k">${CATS[g.cat].n} · #${String(g.no).padStart(2,'0')}</div><h3>${g.name}</h3></div><p>${g.desc}</p><div class="rules">${tagsOf(g).map(t=>`<span>${t}</span>`).join('')}${data.best[id]?`<span>Rekor ${data.best[id]}</span>`:''}</div><button class="btn" id="go">Başla</button></div>`;
  $('#go').onclick=()=>start(g);
}
function start(g){stopAll();if(g.mode==='quiz')runQuiz(g);else if(g.mode==='rounds')runRounds(g);else g.run(g)}
function countdown(cb){
  const st=$('#stage');const o=document.createElement('div');o.className='count';st.appendChild(o);
  let n=3;(function t(){if(n===0){o.remove();cb();return}o.innerHTML=`<span>${n}</span>`;n--;later(t,reduce?300:700)})();
}
function runTimer(sec,onEnd){
  const t0=performance.now(),bar=$('#timer'),wrap=$('#timerwrap');wrap.hidden=false;
  const tick=now=>{const f=Math.max(0,1-(now-t0)/(sec*1000));if(bar)bar.style.width=(f*100)+'%';if(wrap)wrap.classList.toggle('low',f<.2);if(f<=0){raf=null;onEnd();return}raf=requestAnimationFrame(tick)};
  raf=requestAnimationFrame(tick);
}
function fb(ok,txt,pts,anchor){
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
  if(isBest)data.best[id]=score;
  const d=new Date();
  data.history.unshift({g:id,s:score,d:d.toLocaleDateString('tr-TR',{day:'numeric',month:'long'})+' · '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})});
  data.history=data.history.slice(0,30);
  if(!data.days.includes(today()))data.days.push(today());
  const td=data.played[today()]=data.played[today()]||[];if(!td.includes(id))td.push(id);
  for(const k in data.played)if(k!==today())delete data.played[k];
  store.set(data);
  $('#timerwrap').hidden=true;
  const g=GM[id],i=ALL.indexOf(g),nx=ALL[(i+1)%ALL.length];
  $('#stage').innerHTML=`<div class="result glass enter">
    ${isBest?'<div><span class="badge">Yeni rekor</span></div>':`<div class="prompt">Rekorun: <b class="num">${prev}</b></div>`}
    <div><div class="lbl">Skor</div><div class="score num" id="fs">0</div></div>
    <div class="rgrid">${stats.map(s=>`<div><b>${s[1]}</b>${s[0]}</div>`).join('')}</div>
    <button class="btn" id="again">Tekrar oyna</button>
    <button class="btn ghost" id="nxt">Sıradaki: ${nx.name}</button>
    <button class="btn ghost" id="home">Ana sayfa</button></div>`;
  countUp($('#fs'),score,1000);
  if(isBest)later(confetti,300);
  $('#again').onclick=()=>start(g);
  $('#nxt').onclick=()=>intro(nx.id);
  $('#home').onclick=home;
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
