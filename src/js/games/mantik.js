/* ===================== MANTIK ===================== */
def({id:'hedefsayi',cat:'mantik',gl:'Σ',name:'Hedef Sayı',mode:'custom',par:2400,tags:['60 sn','Toplamı tuttur'],
  desc:'Kartlardan bazılarını seç ve toplamlarını hedef sayıya tam olarak eşitle. Hedefi aşarsan seçimin sıfırlanır.',
  run(g){
    shell(g,[['Çözülen','ok','0'],['Çarpan','mx','x1'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let score=0,solved=0,miss=0,run=0,maxRun=0,live=false,goal=0,sel=new Set(),vals=[];
    $('#stage').innerHTML=`<div class="target glass"><small>Hedef</small><div class="tv num" id="tv">?</div></div><div class="meter" id="mt"><i></i></div><div class="sumline" id="sl">Kart seçerek toplamı oluştur</div><div class="tiles" id="tl"></div><div class="feedback" id="fb"></div><button class="clear glass" id="clr">Seçimi temizle</button>`;
    function gen(){const lvl=Math.min(4,Math.floor(solved/3)),hi=9+lvl*3,k=lvl<1?2:lvl<3?ri(2,3):ri(3,4);vals=Array.from({length:6},()=>ri(1,hi));
      goal=sample([0,1,2,3,4,5],k).reduce((s,i)=>s+vals[i],0);sel=new Set();$('#tv').textContent=goal;const tv=$('.target');tv.classList.remove('pop');void tv.offsetWidth;tv.classList.add('pop');
      const t=$('#tl');t.innerHTML='';vals.forEach((v,i)=>{const b=document.createElement('button');b.className='num glass';b.textContent=v;b.onclick=()=>tap(i,b);t.appendChild(b)});upd()}
    const sum=()=>{let s=0;sel.forEach(i=>s+=vals[i]);return s};
    function upd(){const s=sum();$('#mt').classList.toggle('over',s>goal);$('#mt i').style.width=Math.min(100,s/goal*100)+'%';$('#sl').innerHTML=sel.size?[...sel].map(i=>vals[i]).join(' + ')+` = <b>${s}</b>`:'Kart seçerek toplamı oluştur'}
    const mult=()=>1+Math.min(4,Math.floor(run/2));
    const reset=()=>{sel.clear();$$('.tiles button').forEach(x=>x.classList.remove('sel'));upd()};
    function tap(i,b){if(!live)return;if(sel.has(i)){sel.delete(i);b.classList.remove('sel');upd();return}sel.add(i);b.classList.add('sel');upd();const s=sum();
      if(s===goal){solved++;run++;maxRun=Math.max(maxRun,run);const p=40*sel.size*mult();score+=p;fb(true,'Tam isabet!',p,$('.target'));$('#ok').textContent=solved;$('#mx').textContent='x'+mult();$('#sc').textContent=score;live=false;later(()=>{live=true;gen()},350)}
      else if(s>goal){miss++;run=0;fb(false,'Hedef aşıldı');$('#mx').textContent='x1';live=false;later(()=>{reset();live=true},450)}}
    $('#clr').onclick=reset;
    countdown(()=>{live=true;gen();runTimer(60,()=>{live=false;finish(g.id,score,[['Çözülen',solved],['Aşım',miss],['En uzun seri',maxRun]])})});
  }});

def({id:'oruntu',cat:'mantik',gl:'2,4,?',name:'Örüntü Avcısı',mode:'quiz',pts:70,time:60,
  desc:'Sayı dizisindeki gizli kuralı çöz ve sıradaki sayıyı bul. Toplama, çarpma, sıçrama… her şey olabilir.',
  gen(lv){const types=lv<2?['ar']:lv<4?['ar','geo','alt']:['ar','geo','alt','grow','fib','sq'];const t=pick(types);let s=[];
    if(t==='ar'){const a=ri(1,20),d=pick([2,3,4,5,6,7,9,11,-3,-4]);for(let i=0;i<6;i++)s.push(a+i*d)}
    if(t==='geo'){const a=ri(1,4),r=pick([2,3]);for(let i=0;i<6;i++)s.push(a*Math.pow(r,i))}
    if(t==='alt'){const a=ri(5,20),x=ri(3,9),y=ri(1,x-1);let v=a;for(let i=0;i<6;i++){s.push(v);v+=i%2===0?x:-y}}
    if(t==='grow'){let v=ri(1,10),d=ri(1,3);for(let i=0;i<6;i++){s.push(v);v+=d;d++}}
    if(t==='fib'){let a=ri(1,4),b=ri(2,6);for(let i=0;i<6;i++){s.push(a);[a,b]=[b,a+b]}}
    if(t==='sq'){const o=ri(0,5);for(let i=1;i<=6;i++)s.push(i*i+o)}
    const ans=s[5];return Object.assign(mk(ans,near(ans,3,Math.max(4,Math.abs(ans)>50?12:5),-50)),{q:`<div class="qmono" style="font-size:26px">${s.slice(0,5).join(', ')}, <span style="color:var(--h)">?</span></div>`,cols:2})}});

def({id:'sekildizi',cat:'mantik',gl:'▲●▲',name:'Şekil Dizisi',mode:'quiz',
  desc:'Şekiller bir kalıba göre sıralanıyor. Kalıbı çöz ve soru işaretinin yerine gelecek şekli seç.',
  gen(lv){const pats=lv<3?['AB','ABC','AAB']:['AB','ABC','AAB','ABB','AABB','ABCB','ABAC','ABCD'];const p=pick(pats);const letters=[...new Set(p)];
    const toks=sample(TOK,letters.length);const m={};letters.forEach((l,i)=>m[l]=toks[i]);const L=Math.max(7,p.length*2+1);const seq=[];for(let i=0;i<=L;i++)seq.push(m[p[i%p.length]]);
    const ans=seq[L];const wr=[...new Set(toks.filter(t=>t!==ans))];while(wr.length<3)wr.push(similar(ans,[...wr,...toks]));
    const r=mk(ans,wr.slice(0,3));r.opts=r.opts.map(t=>tok(t,36));return Object.assign(r,{q:`<div class="row" style="gap:4px">${seq.slice(0,L).map(t=>tok(t,26)).join('')}<span class="qbig" style="font-size:28px;color:var(--h)">?</span></div>`,cols:4})}});

def({id:'terazi',cat:'mantik',gl:'⚖',name:'Terazi',mode:'quiz',pts:70,time:60,
  desc:'Teraziler dengede. Şekillerin ağırlık ilişkisini kullanarak sorunun cevabını bul.',
  gen(lv){const A='triangle|kırmızı',B='circle|mavi',C='square|sarı';const k=ri(2,lv>2?4:3),m=ri(2,3);const rep=(t,n)=>Array.from({length:n},()=>tok(t,22)).join('');
    const two=lv>3&&Math.random()<.5;const eq1=two?`${rep(B,2)} <b>=</b> ${rep(A,2*k)}`:`${rep(B,1)} <b>=</b> ${rep(A,k)}`;
    const ans=k*m;const line=h=>`<div class="row" style="gap:6px;padding:8px 12px;border-radius:14px;background:rgba(255,255,255,.05)">${h}</div>`;
    return Object.assign(mk(ans,near(ans,3,3,1)),{q:`${line(eq1)}${line(`${rep(C,1)} <b>=</b> ${rep(B,m)}`)}<div class="row qtext">${tok(C,22)} kaç ${tok(A,22)} eder?</div>`,cols:4})}});

def({id:'kimnerede',cat:'mantik',gl:'A>B',name:'Sıralama Dedektifi',mode:'quiz',pts:80,time:60,
  desc:'İpuçlarını oku ve kişileri kafanda sırala. Sonra sorulan kişiyi bul.',
  gen(lv){const n=lv<3?3:4;const names=sample(['Ali','Ece','Can','Zeynep','Mert','Deniz','Ayşe','Kaan','Efe','Selin'],n);
    const at=pick([{a:'uzun',i:'kısa'},{a:'hızlı',i:'yavaş'},{a:'yaşlı',i:'genç'},{a:'ağır',i:'hafif'}]);
    const cl=[];for(let i=0;i<n-1;i++){const x=names[i],y=names[i+1];cl.push(Math.random()<.5?`${x}, ${abl(y)} daha ${at.a}.`:`${y}, ${abl(x)} daha ${at.i}.`)}
    const top=Math.random()<.5;const ans=top?names[0]:names[n-1];
    return Object.assign(mk(ans,names.filter(x=>x!==ans)),{q:`<div class="qtext" style="text-align:left">${shuf(cl).map(c=>'• '+c).join('<br>')}</div><div class="qtext">En <b>${top?at.a:at.i}</b> kim?</div>`,cols:n===3?3:2,txt:true})}});

def({id:'sihirli',cat:'mantik',gl:'▦',name:'Denge Tablosu',mode:'quiz',pts:60,
  desc:'Tablodaki her satırın toplamı aynı. Soru işaretinin yerine hangi sayı gelmeli?',
  gen(lv){const S=ri(12,18+lv*3);const rows=[];for(let r=0;r<3;r++){const a=ri(1,S-2),b=ri(1,S-a-1);rows.push(shuf([a,b,S-a-b]))}
    const rr=ri(0,2),cc=ri(0,2);const ans=rows[rr][cc];
    return Object.assign(mk(ans,near(ans,3,4,0)),{q:`<div class="qsmall">Her satırın toplamı <b style="color:var(--h)">${S}</b></div><div class="tg" style="grid-template-columns:repeat(3,1fr);width:210px">${rows.map((r,i)=>r.map((v,j)=>`<div class="num" style="font-size:24px;font-family:var(--mono)">${i===rr&&j===cc?'<span style="color:var(--h)">?</span>':v}</div>`).join('')).join('')}</div>`,cols:4})}});

def({id:'dogrumu',cat:'mantik',gl:'∴?',name:'Kesin mi?',mode:'quiz',pts:70,time:60,
  desc:'Uydurma varlıklarla ilgili iki önerme okuyacaksın. Sonuç bunlardan KESİN olarak çıkıyor mu?',
  gen(){const w=sample(['blim','zerm','frim','telm','vizem','kirem','nerm'],3);const [A,B,C]=w;const x=pick(['Pip','Tik','Lem','Zu']);
    const T=[[`Tüm ${A}ler ${B}dir.`,`${x} bir ${A}dir.`,`${x} bir ${B}dir.`,1],[`Tüm ${A}ler ${B}dir.`,`${x} bir ${B}dir.`,`${x} bir ${A}dir.`,0],
      [`Hiçbir ${A} ${B} değildir.`,`${x} bir ${A}dir.`,`${x} bir ${B} değildir.`,1],[`Tüm ${A}ler ${B}dir.`,`Tüm ${B}ler ${C}dir.`,`Tüm ${A}ler ${C}dir.`,1],
      [`Bazı ${A}ler ${B}dir.`,`${x} bir ${A}dir.`,`${x} bir ${B}dir.`,0],[`Tüm ${A}ler ${B}dir.`,`${x} bir ${B} değildir.`,`${x} bir ${A} değildir.`,1],
      [`Tüm ${A}ler ${B}dir.`,`${x} bir ${A} değildir.`,`${x} bir ${B} değildir.`,0],[`Tüm ${A}ler ${B}dir.`,`Bazı ${B}ler ${C}dir.`,`Bazı ${A}ler ${C}dir.`,0],
      [`Hiçbir ${A} ${B} değildir.`,`Tüm ${C}ler ${A}dir.`,`Hiçbir ${C} ${B} değildir.`,1]];
    const t=pick(T);return{q:`<div class="qtext">${t[0]}<br>${t[1]}</div><div class="qsmall">Sonuç</div><div class="qtext" style="color:var(--h);font-weight:800">${t[2]}</div>`,opts:['Kesin değil','Kesin doğru'],ans:t[3],cls:['no','yes'],txt:true}}});
