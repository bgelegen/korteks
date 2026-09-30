/* ===================== UZAMSAL ===================== */
def({id:'ayna',cat:'uzam',gl:'⧉',name:'Ayna Dokunuş',mode:'quiz',
  desc:'Sol ızgarada bir kare yanıyor. Ortadaki aynaya göre yansımasının sağ ızgarada nereye düşeceğini bul.',
  gen(lv){const n=lv<3?3:lv<6?4:5;const r=ri(0,n-1),c=ri(0,n-1);const a=r*n+(n-1-c);const w=Math.min(150,n*38);
    const left=`<div class="tg" style="grid-template-columns:repeat(${n},1fr);width:${w}px;gap:4px">${Array.from({length:n*n},(_,i)=>`<div class="${i===r*n+c?'lit':''}"></div>`).join('')}</div>`;
    const right=`<div class="tg" style="grid-template-columns:repeat(${n},1fr);width:${w}px;gap:4px">${Array.from({length:n*n},(_,i)=>`<button data-a="${i}" aria-label="Kare"></button>`).join('')}</div>`;
    return{q:`<div class="row" style="gap:10px;flex-wrap:nowrap">${left}<span style="width:3px;align-self:stretch;background:repeating-linear-gradient(var(--h) 0 6px,transparent 6px 12px)"></span>${right}</div>`,ans:a,p:'Yansımaya <b>dokun</b>'}}});

function polyo(n){let cells=[[0,0]];const key=c=>c[0]+','+c[1];while(cells.length<n){const b=pick(cells);const d=pick([[1,0],[-1,0],[0,1],[0,-1]]);const nc=[b[0]+d[0],b[1]+d[1]];if(!cells.some(c=>key(c)===key(nc)))cells.push(nc)}return cells}
const pnorm=cs=>{const mx=Math.min(...cs.map(c=>c[0])),my=Math.min(...cs.map(c=>c[1]));return cs.map(c=>[c[0]-mx,c[1]-my]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])};
const pkey=cs=>pnorm(cs).map(c=>c.join(',')).join(';');
const prot=cs=>cs.map(([x,y])=>[y,-x]);const pmir=cs=>cs.map(([x,y])=>[-x,y]);
function pdraw(cs,s){cs=pnorm(cs);const W=Math.max(...cs.map(c=>c[0]))+1,H=Math.max(...cs.map(c=>c[1]))+1,u=14;return `<svg viewBox="-2 -2 ${W*u+4} ${H*u+4}" width="${s}" height="${s}">${cs.map(c=>`<rect x="${c[0]*u}" y="${c[1]*u}" width="${u-2}" height="${u-2}" rx="2" fill="var(--h)"/>`).join('')}</svg>`}
def({id:'dondur',cat:'uzam',gl:'↻',name:'Döndür Eşle',mode:'quiz',pts:70,time:60,
  desc:'Üstteki parça yalnızca döndürülmüş hâliyle aşağıda bir kez var. Diğerleri aynadan yansımış. Döndürülmüş olanı bul.',
  gen(lv){let p,R,M,g=0;do{p=polyo(lv<4?5:6);R=[];let c=p;for(let i=0;i<4;i++){R.push(c);c=prot(c)}M=[];c=pmir(p);for(let i=0;i<4;i++){M.push(c);c=prot(c)}g++;
    var rk=new Set(R.map(pkey)),mk2=[...new Map(M.map(m=>[pkey(m),m])).values()].filter(m=>!rk.has(pkey(m)))}while(mk2.length<3&&g<200);
    const right=R[ri(1,3)];const all=shuf([right,...sample(mk2,3)]);
    return{q:pdraw(p,90),opts:all.map(c=>pdraw(c,58)),ans:all.indexOf(right),cols:4,p:'Döndürülmüş olanı <b>bul</b>'}}});

def({id:'pusula',cat:'uzam',gl:'N',name:'Pusula',mode:'quiz',pts:60,
  desc:'Bir yöne bakıyorsun ve sırayla dönüyorsun. Tüm dönüşlerden sonra hangi yöne baktığını bul.',
  gen(lv){const D=['Kuzey','Doğu','Güney','Batı'],DT=['Kuzeye','Doğuya','Güneye','Batıya'];let d=ri(0,3);const s=d;const n=Math.min(7,1+lv);const moves=[];
    for(let i=0;i<n;i++){const m=pick([['sağa dön',1],['sola dön',-1],['sağa dön',1],['sola dön',-1],['geri dön',2]]);moves.push(m[0]);d=(d+m[1]+4)%4}
    return{q:`<div class="qtext"><b>${DT[s]}</b> bakıyorsun.</div><div class="chipline">${moves.map(m=>`<span>${m}</span>`).join('')}</div><div class="qsmall">Şimdi nereye bakıyorsun?</div>`,opts:D,ans:d,cols:2,txt:true}}});

def({id:'haritayolu',cat:'uzam',gl:'⌖',name:'Harita Yolu',mode:'quiz',pts:60,time:60,
  desc:'Başlangıç karesinden okları sırayla takip et. Nereye vardığını haritada göster.',
  gen(lv){const n=lv<4?5:6;let r=ri(0,n-1),c=ri(0,n-1);const s=r*n+c;const k=Math.min(9,2+lv);const mv=[];const A={U:[-1,0,'↑'],D:[1,0,'↓'],L:[0,-1,'←'],R:[0,1,'→']};
    while(mv.length<k){const m=pick(Object.keys(A));const nr=r+A[m][0],nc=c+A[m][1];if(nr<0||nc<0||nr>=n||nc>=n)continue;r=nr;c=nc;mv.push(A[m][2])}
    return{q:`<div class="chipline">${mv.map(m=>`<span style="font-size:18px">${m}</span>`).join('')}</div><div class="tg" style="grid-template-columns:repeat(${n},1fr);width:min(100%,${n*52}px);gap:5px">${Array.from({length:n*n},(_,i)=>`<button data-a="${i}" class="${i===s?'start':''}" style="font-size:12px">${i===s?'★':''}</button>`).join('')}</div>`,ans:r*n+c,p:'Yıldızdan başla, <b>varış</b> karesine dokun'}}});

def({id:'saat',cat:'uzam',gl:'◷',name:'Saat Kaç?',mode:'quiz',
  desc:'Analog saati oku ve doğru saati seç. İlerleyen seviyelerde rakamlar kaybolur.',
  gen(lv){const h=ri(1,12),m=pick([0,5,10,15,20,25,30,35,40,45,50,55]);const f=(h,m)=>String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
    const ha=(h%12+m/60)*30,ma=m*6;const nums=lv<4;let t='';for(let i=1;i<=12;i++){const a=i*30*Math.PI/180;t+=nums?`<text x="${60+Math.sin(a)*40}" y="${64+-Math.cos(a)*40}" fill="#C9D0F0" font-size="11" text-anchor="middle" font-family="monospace">${i}</text>`:`<line x1="${60+Math.sin(a)*42}" y1="${60-Math.cos(a)*42}" x2="${60+Math.sin(a)*(i%3?46:38)}" y2="${60-Math.cos(a)*(i%3?46:38)}" stroke="#C9D0F0" stroke-width="${i%3?1.5:3}"/>`}
    const svg=`<svg viewBox="0 0 120 120" width="150" height="150"><circle cx="60" cy="60" r="54" fill="rgba(255,255,255,.05)" stroke="var(--h)" stroke-width="3"/>${t}<line x1="60" y1="60" x2="${60+Math.sin(ha*Math.PI/180)*24}" y2="${60-Math.cos(ha*Math.PI/180)*24}" stroke="#fff" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="60" x2="${60+Math.sin(ma*Math.PI/180)*38}" y2="${60-Math.cos(ma*Math.PI/180)*38}" stroke="var(--h)" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#fff"/></svg>`;
    const ans=f(h,m);const w=new Set();const hm=(m/5)||12;[f(h%12+1,m),f(hm,(h%12)*5),f(h,(m+5)%60),f(h===1?12:h-1,m),f(h,(m+55)%60)].forEach(x=>{if(x!==ans&&w.size<3)w.add(x)});
    return Object.assign(mk(ans,[...w]),{q:svg,cols:2})}});
