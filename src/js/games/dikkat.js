/* ===================== DİKKAT ===================== */
def({id:'sinyal',cat:'dikkat',gl:'◎',name:'Sinyal Avı',mode:'custom',par:1400,tags:['3 hak','Küreleri izle'],
  desc:'Birkaç küre bir an parlayacak, sonra hepsi aynı görünüp karışacak. Gözünü ayırma ve parlayanları bul.',
  run(g){
    shell(g,[['Sv','lv','1'],['Hak','lf','3'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let level=1,lives=3,score=0,rounds=0,maxLevel=1;
    $('#stage').innerHTML=`<div class="prompt" id="pm"></div><div class="field glass" id="fd"></div><div class="feedback" id="fb"></div>`;
    function round(){if(moveRaf)cancelAnimationFrame(moveRaf);
      $('#lv').textContent=level;$('#lf').textContent=lives;$('#sc').textContent=score;
      const fd=$('#fd');fd.innerHTML='';const W=fd.clientWidth||320,H=fd.clientHeight||320,R=24;
      const n=Math.min(11,5+level),k=Math.min(5,2+Math.floor((level-1)/2)),spd=(60+level*12)*(W/340),dur=3600+level*150;const orbs=[];
      for(let i=0;i<n;i++){let x,y,t=0;do{x=R+Math.random()*(W-2*R);y=R+Math.random()*(H-2*R);t++}while(t<50&&orbs.some(o=>Math.hypot(o.x-x,o.y-y)<2.2*R));
        const a=Math.random()*Math.PI*2,el=document.createElement('button');el.className='orb';el.setAttribute('aria-label','Küre');fd.appendChild(el);orbs.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,el,t:i<k,done:false})}
      const place=()=>orbs.forEach(o=>o.el.style.transform=`translate(${o.x}px,${o.y}px)`);place();orbs.forEach(o=>o.t&&o.el.classList.add('tgt'));
      $('#pm').innerHTML=`Parlayan <b>${k}</b> küreyi aklında tut`;let active=false,found=0;
      later(()=>{orbs.forEach(o=>o.el.classList.remove('tgt'));$('#pm').innerHTML='Gözünü <b>ayırma</b>…';let last=performance.now(),t0=last;
        const mv=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;
          for(const o of orbs){o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.x<R){o.x=R;o.vx=Math.abs(o.vx)}if(o.x>W-R){o.x=W-R;o.vx=-Math.abs(o.vx)}if(o.y<R){o.y=R;o.vy=Math.abs(o.vy)}if(o.y>H-R){o.y=H-R;o.vy=-Math.abs(o.vy)}
            if(Math.random()<.02){const a=Math.atan2(o.vy,o.vx)+(Math.random()-.5)*1.2;o.vx=Math.cos(a)*spd;o.vy=Math.sin(a)*spd}}
          place();if(now-t0<dur)moveRaf=requestAnimationFrame(mv);else{moveRaf=null;active=true;$('#pm').innerHTML=`Parlayan <b>${k}</b> küreyi seç`}};
        moveRaf=requestAnimationFrame(mv)},1700);
      orbs.forEach(o=>o.el.onclick=()=>{if(!active||o.done)return;o.done=true;
        if(o.t){o.el.classList.add('pick');found++;score+=15*level;$('#sc').textContent=score;buzz(10);
          if(found===k){active=false;rounds++;const b=30*level;score+=b;$('#sc').textContent=score;fb(true,'Hepsini yakaladın!',b,fd);level++;maxLevel=Math.max(maxLevel,level);later(round,1000)}}
        else{active=false;o.el.classList.add('wrong');orbs.forEach(x=>{if(x.t&&!x.done)x.el.classList.add('missed')});lives--;$('#lf').textContent=lives;fb(false,'Yanlış küre');level=Math.max(1,level-1);
          if(lives<=0)later(()=>finish(g.id,score,[['Tur',rounds],['Max sv.',maxLevel],['Hak',0]]),1400);else later(round,1400)}});
    }
    later(round,200);
  }});

def({id:'tekfark',cat:'dikkat',gl:'b|d',name:'Tek Farklı',mode:'quiz',
  desc:'Birbirine çok benzeyen karakterlerle dolu bir ızgara göreceksin. Farklı olan tek karakteri bul ve dokun.',
  gen(lv){const P=[['b','d'],['p','q'],['6','9'],['M','N'],['E','F'],['O','Q'],['ı','i'],['o','ö'],['u','ü'],['c','ç'],['s','ş'],['g','ğ'],['8','B'],['5','S'],['2','Z'],['1','l'],['V','Y'],['C','G']];
    const [a,b]=shuf(pick(P));const n=Math.min(7,3+Math.floor(lv/2));const k=ri(0,n*n-1);const fs=Math.max(18,46-n*4);
    return{q:`<div class="tg" style="grid-template-columns:repeat(${n},1fr)">${Array.from({length:n*n},(_,i)=>`<button data-a="${i}" style="font-size:${fs}px;font-family:var(--body)">${i===k?b:a}</button>`).join('')}</div>`,ans:k,p:'Farklı olanı <b>bul</b>'}}});

def({id:'harfsay',cat:'dikkat',gl:'Kx',name:'Harf Sayacı',mode:'quiz',pts:60,
  desc:'Karışık harflerden oluşan bir dizide istenen harfin kaç kez geçtiğini say.',
  gen(lv){const set=sample(['K','X','Y','V','W','Z','N','M','H','A'],4);const T=set[0];const len=Math.min(32,12+lv*2);
    let s=[];for(let i=0;i<len;i++)s.push(pick(set));const c=s.filter(x=>x===T).length;
    return Object.assign(mk(c,near(c,3,3,0)),{q:`<div class="qsmall">Kaç tane <b style="color:var(--h);font-size:22px">${T}</b> var?</div><div class="qmono" style="font-size:22px;letter-spacing:.18em;line-height:1.7">${s.join('')}</div>`,cols:4})}});

def({id:'cogunluk',cat:'dikkat',gl:'∴',name:'Çoğunluk',mode:'quiz',
  desc:'Ekrana dağılmış renkli noktalara bak. Hangi renkten daha çok olduğunu hızlıca söyle.',
  gen(lv){const k=lv<3?3:4;const cs=sample(CN,k);const diff=Math.max(1,5-Math.floor(lv/2));const base=ri(4,6+lv);
    const counts=cs.map((_,i)=>i===0?base+diff:ri(Math.max(1,base-4),base));const pts=[];
    cs.forEach((c,i)=>{for(let j=0;j<counts[i];j++){let x,y,t=0;do{x=ri(12,288);y=ri(12,168);t++}while(t<40&&pts.some(p=>Math.hypot(p.x-x,p.y-y)<20));pts.push({x,y,c})}});
    const svg=`<svg viewBox="0 0 300 180" style="width:100%;max-width:340px">${shuf(pts).map(p=>`<circle cx="${p.x}" cy="${p.y}" r="8" fill="${COLV[p.c]}"/>`).join('')}</svg>`;
    const r=mk(cs[0],cs.slice(1));r.opts=r.opts.map(c=>swatch(c));return Object.assign(r,{q:svg,cols:k,p:'Hangi renk <b>çoğunlukta?</b>'})}});

def({id:'kodkontrol',cat:'dikkat',gl:'≟',name:'Kod Kontrol',mode:'quiz',
  desc:'Üst üste iki kod göreceksin. Birebir aynılar mı, yoksa tek bir karakter bile farklı mı?',
  gen(lv){const len=Math.min(12,5+lv);const A='ABCDEFGHJKLMNPRSTUVXYZ0123456789';let a='';for(let i=0;i<len;i++)a+=pick([...A]);
    const same=Math.random()<.5;let b=a;if(!same){const CF={O:'0','0':'O',I:'1','1':'I',S:'5','5':'S',B:'8','8':'B',Z:'2','2':'Z',E:'F',F:'E',M:'N',N:'M',U:'V',V:'U',C:'G',G:'C',P:'R',R:'P'};const c=[...a];const i=ri(0,len-1);c[i]=CF[c[i]]||(c[i]==='A'?'4':'A');b=c.join('')}
    return{q:`<div class="qmono" style="font-size:26px">${a}</div><div class="qmono" style="font-size:26px">${b}</div>`,opts:['Farklı','Aynı'],ans:same?1:0,cls:['no','yes'],txt:true,p:'Kodlar <b>aynı mı?</b>'}}});

def({id:'hedefyildiz',cat:'dikkat',gl:'✦',name:'Hedef Arama',mode:'quiz',
  desc:'Üstte aradığın şeklin hem rengi hem biçimi var. Kalabalığın içinde ikisi birden tutan tek şekli bul.',
  gen(lv){const n=lv<3?4:lv<6?5:6;const T=pick(TOK);const [k,c]=T.split('|');const cells=[];const tot=n*n,ti=ri(0,tot-1);
    for(let i=0;i<tot;i++){if(i===ti){cells.push(T);continue}let d;do{d=Math.random()<.5?k+'|'+pick(CN):pick(KINDS)+'|'+c}while(d===T);cells.push(d)}
    return{q:`<div class="row" style="gap:10px"><span class="qsmall">Aranan</span>${tok(T,34)}</div><div class="tg" style="grid-template-columns:repeat(${n},1fr)">${cells.map((t,i)=>`<button data-a="${i}">${tok(t,Math.max(20,40-n*3))}</button>`).join('')}</div>`,ans:ti}}});
