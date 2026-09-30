/* ===================== ESNEKLİK ===================== */
def({id:'tersakis',cat:'esneklik',gl:'⇅',name:'Ters Akış',mode:'custom',par:2400,tags:['45 sn','Kaydır veya dokun'],
  desc:'Ok TURKUAZ ise gösterdiği yöne, PEMBE ise tam tersine bas ya da kaydır. Kural her okta değişebilir.',
  run(g){
    shell(g,[['Doğru','ok','0'],['Çarpan','mx','x1'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let score=0,ok=0,wrong=0,run=0,live=false,want=null;
    const chev=r=>`<svg viewBox="0 0 26 26" style="transform:rotate(${r}deg)"><path d="M6 16l7-7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    $('#stage').innerHTML=`<div class="chipline"><span style="color:#22D3EE">Turkuaz: aynı yön</span><span style="color:#F472B6">Pembe: ters yön</span></div>
    <div class="arrowbox glass" id="ab"><svg viewBox="0 0 120 120" id="arw"><path d="M60 12L104 58H76V108H44V58H16Z" fill="rgba(255,255,255,.15)"/></svg></div><div class="feedback" id="fb"></div>
    <div class="pad"><button class="u glass" data-d="0" aria-label="Yukarı" disabled>${chev(0)}</button><button class="l glass" data-d="3" aria-label="Sol" disabled>${chev(-90)}</button><div class="mid">veya<br>kaydır</div><button class="r glass" data-d="1" aria-label="Sağ" disabled>${chev(90)}</button><button class="d glass" data-d="2" aria-label="Aşağı" disabled>${chev(180)}</button></div>`;
    const arw=$('#arw'),path=arw.querySelector('path');
    function next(){const dir=ri(0,3),rev=Math.random()<.5;want=rev?(dir+2)%4:dir;const c=rev?'#F472B6':'#22D3EE';path.setAttribute('fill',c);arw.style.filter=`drop-shadow(0 0 16px ${c})`;arw.style.transform=`rotate(${dir*90}deg)`;const ab=$('#ab');ab.classList.remove('pop');void ab.offsetWidth;ab.classList.add('pop')}
    const mult=()=>1+Math.min(4,Math.floor(run/4));
    function ans(d,el){if(!live)return;if(d===want){ok++;run++;const p=50*mult();score+=p;fb(true,null,p,el)}else{wrong++;run=0;fb(false)}$('#ok').textContent=ok;$('#mx').textContent='x'+mult();$('#sc').textContent=score;next()}
    $$('.pad button').forEach(b=>b.onclick=()=>ans(+b.dataset.d,b));
    const ab=$('#ab');let sx=0,sy=0;ab.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
    ab.addEventListener('pointerup',e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<28)return;ans(Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?2:0),ab)});
    countdown(()=>{live=true;$$('.pad button').forEach(b=>b.disabled=false);next();runTimer(45,()=>{live=false;finish(g.id,score,[['Doğru',ok],['Yanlış',wrong],['İsabet',pctStat(ok,wrong)]])})});
  }});

def({id:'ikilikural',cat:'esneklik',gl:'5|5',name:'İkili Kural',mode:'quiz',
  desc:'Üstteki kural her soruda değişebilir. DEĞER sorulursa sayı 5\'ten büyük mü, BOYUT sorulursa sayı iri mi yazılmış, ona bak.',
  gen(){const v=pick([1,2,3,4,6,7,8,9]);const big=Math.random()<.5;const rule=Math.random()<.5?'DEĞER':'BOYUT';const yes=rule==='DEĞER'?v>5:big;
    return{q:`<div class="qsmall" style="color:var(--h);font-size:14px">${rule==='DEĞER'?'DEĞER: 5\'ten büyük mü?':'BOYUT: İri mi yazılmış?'}</div><div class="qbig" style="font-size:${big?96:34}px;height:110px;display:grid;place-items:center">${v}</div>`,opts:['Hayır','Evet'],ans:yes?1:0,cls:['no','yes'],txt:true}}});

def({id:'kuralibul',cat:'esneklik',gl:'?!',name:'Kuralı Bul',mode:'quiz',time:60,pause:700,tags:['60 sn','Gizli kural'],
  desc:'Alttaki kartı dört karttan birine eşle. Kural RENK, ŞEKİL ya da SAYI olabilir ve sana söylenmez. Geri bildirimden kuralı çöz. Kural arada bir sessizce değişir!',
  init(){return{rule:pick(['renk','sekil','sayi']),streak:0}},
  onAns(ok,st){if(ok){st.streak++;if(st.streak>=5){st.rule=pick(['renk','sekil','sayi'].filter(r=>r!==st.rule));st.streak=0}}else st.streak=0},
  gen(lv,st){const REF=[{n:1,k:'triangle',c:'kırmızı'},{n:2,k:'star',c:'yeşil'},{n:3,k:'square',c:'sarı'},{n:4,k:'circle',c:'mavi'}];
    let s;do{s={n:ri(1,4),k:pick(REF).k,c:pick(REF).c}}while(REF.some(r=>r.n===s.n&&r.k===s.k&&r.c===s.c));
    const card=o=>`<span class="row" style="gap:3px;max-width:80px">${Array.from({length:o.n},()=>shp(o.k,COLV[o.c],o.n>2?20:26)).join('')}</span>`;
    const ans=REF.findIndex(r=>st.rule==='renk'?r.c===s.c:st.rule==='sekil'?r.k===s.k:r.n===s.n);
    return{q:`<div class="qsmall">Bu kartı eşle</div><div style="padding:14px 18px;border-radius:16px;background:rgba(255,255,255,.07);border:1px solid var(--stroke)">${card(s)}</div>`,opts:REF.map(card),ans,cols:4,why:'Kural başka'}}});

def({id:'tersislem',cat:'esneklik',gl:'+⇄−',name:'Ters İşlem',mode:'quiz',
  desc:'Bu oyunda işaretler yer değiştirir. Üstte yazan kurala göre hesap yap. Kural birkaç soruda bir değişir.',
  init(){return{n:0,sw:null}},
  gen(lv,st){if(st.n%5===0)st.sw=pick([['+','−'],['+','×'],['−','×']]);st.n++;const [x,y]=st.sw;
    const op=pick(['+','−','×']);const a=ri(3,lv<3?12:20),b=ri(2,op==='×'?9:a);const real=op===x?y:op===y?x:op;
    const A=Math.max(a,b),B=Math.min(a,b);const calc=(o,p,q)=>o==='+'?p+q:o==='−'?p-q:p*q;const r=calc(real,A,B);
    return Object.assign(mk(r,near(r,3,6,0)),{q:`<div class="chipline"><span style="color:var(--h)">${x} ⇄ ${y}</span></div><div class="qmono" style="font-size:44px">${A} ${op} ${B}</div>`,cols:2,p:`Bu turda <b>${x}</b> gördüğün yerde <b>${y}</b> yap, tersi de geçerli`})}});

def({id:'karsitkutu',cat:'esneklik',gl:'◂▸',name:'Karşıt Kutu',mode:'quiz',time:40,
  desc:'Kutuda SOL ya da SAĞ yazıyor ve kutu ekranın bir tarafında duruyor. Üstteki kural KELİME diyorsa yazıya, KONUM diyorsa kutunun yerine göre cevap ver.',
  gen(){const w=pick(['SOL','SAĞ']);const side=pick(['SOL','SAĞ']);const rule=Math.random()<.5?'KELİME':'KONUM';const a=rule==='KELİME'?w:side;
    return{q:`<div class="qsmall" style="color:var(--h);font-size:14px">Kural: ${rule}</div><div style="width:100%;display:flex;justify-content:${side==='SOL'?'flex-start':'flex-end'}"><span style="padding:16px 22px;border-radius:16px;background:var(--h);color:#0A0D22;font-family:var(--display);font-weight:900;font-size:26px">${w}</span></div>`,opts:['◀ SOL','SAĞ ▶'],ans:a==='SOL'?0:1,txt:true}}});
