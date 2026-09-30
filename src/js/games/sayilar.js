/* ===================== SAYILAR ===================== */
def({id:'zincirhesap',cat:'sayi',gl:'+×−',name:'Zincir Hesap',mode:'rounds',pts:30,
  desc:'Bir başlangıç sayısı ve ardından işlemler tek tek görünecek. Hepsini kafanda uygula ve sonucu bul.',
  gen(lv){let v=ri(2,9);const fr=[`<div class="qbig" style="font-size:72px">${v}</div>`];const n=Math.min(7,1+lv);
    for(let i=0;i<n;i++){let o=pick(['+','−','×']);if(o==='×'&&v>25)o='+';if(o==='−'&&v<3)o='+';let x;
      if(o==='+'){x=ri(1,9);v+=x}else if(o==='−'){x=ri(1,Math.min(9,v-1));v-=x}else{x=pick([2,3]);v*=x}fr.push(`<div class="qbig" style="font-size:64px;color:var(--h)">${o} ${x}</div>`)}
    return Object.assign(mk(v,near(v,3,5,0)),{seq:fr,ms:Math.max(650,1100-lv*50),p1:'İşlemleri <b>takip et</b>',q:'<div class="qsmall">Sonuç kaç?</div>',cols:2})}});

def({id:'kesir',cat:'sayi',gl:'½',name:'Kesir Düellosu',mode:'quiz',time:40,pts:40,
  desc:'İki kesirden daha büyük olana dokun. Paydalar büyüdükçe iş zorlaşır.',
  gen(lv){const hi=lv<3?9:14;let a,b,c,d;do{b=ri(2,hi);d=ri(2,hi);a=ri(1,b-1);c=ri(1,d-1)}while(a*d===b*c);
    return{q:'<div class="qsmall">Hangisi daha büyük?</div>',opts:[frac(a,b),frac(c,d)].map(f=>`<span style="font-size:34px">${f}</span>`),ans:a*d>b*c?0:1,cols:2}}});

def({id:'yuzde',cat:'sayi',gl:'%',name:'Yüzde Avcısı',mode:'quiz',pts:60,
  desc:'Bir sayının yüzdesini kafadan hesapla. İndirim hesaplamanın en hızlı yolu!',
  gen(lv){const ps=lv<3?[10,25,50]:[5,10,15,20,25,30,40,50,75];const p=pick(ps);const step=p%10===5?20:p===25||p===75?4:10;const n=step*ri(2,lv<3?20:50);const ans=n*p/100;
    return Object.assign(mk(ans,near(ans,3,Math.max(3,Math.round(ans*.3)),0)),{q:`<div class="qmono" style="font-size:40px"><span style="color:var(--h)">%${p}</span> × ${n}</div><div class="qsmall">kaç eder?</div>`,cols:2})}});

def({id:'tahmin',cat:'sayi',gl:'≈',name:'Göz Kararı',mode:'quiz',time:40,
  desc:'Tam hesaplamaya vaktin yok. Çarpımın sonucuna en yakın seçeneği hızlıca tahmin et.',
  gen(lv){const a=ri(11,lv<3?49:99),b=ri(3,lv<3?19:59);const ex=a*b;const r2=v=>{const p=Math.pow(10,Math.max(0,String(Math.round(v)).length-2));return Math.round(v/p)*p};
    const fs=pick([[.45,1.7,2.6],[.6,1.5,2.2],[.35,.65,1.8]]);const ans=r2(ex);const w=[...new Set(fs.map(f=>r2(ex*f)))].filter(x=>x!==ans);let k=3;while(w.length<3)w.push(ans*k++);
    const r=mk(ans,w.slice(0,3));r.opts=r.opts.map(v=>'≈ '+v);return Object.assign(r,{q:`<div class="qmono" style="font-size:40px">${a} × ${b}</div><div class="qsmall">yaklaşık kaç eder?</div>`,cols:2})}});

def({id:'paraustu',cat:'sayi',gl:'₺',name:'Para Üstü',mode:'quiz',pts:60,
  desc:'Kasadasın. Ürünün fiyatını ve verilen parayı gör, doğru para üstünü seç.',
  gen(lv){const price=ri(3,lv<3?45:180)+pick(lv<2?[0,.5]:[0,.25,.5,.75]);const paid=[10,20,50,100,200].find(v=>v>price);const ch=paid-price;
    const w=new Set();[1,-1,.5,-.5,10,-10,5].sort(()=>Math.random()-.5).forEach(d=>{const v=ch+d;if(v>0&&w.size<3)w.add(v)});
    const r=mk(ch,[...w]);r.opts=r.opts.map(v=>money(+v));
    return Object.assign(r,{q:`<div class="qtext">Fiyat: <b class="num">${money(price)}</b></div><div class="qtext">Verilen: <b class="num">${paid},00 ₺</b></div><div class="qsmall">Para üstü?</div>`,cols:2})}});

def({id:'eksikisaret',cat:'sayi',gl:'□',name:'Kayıp İşaret',mode:'quiz',
  desc:'İşlemin ortasındaki işaret kaybolmuş. Eşitliği doğru yapan işareti bul.',
  gen(lv){const ops=['+','−','×','÷'];let a,b,o,c,g=0;const calc=(o,a,b)=>o==='+'?a+b:o==='−'?a-b:o==='×'?a*b:a/b;
    do{o=pick(ops);b=ri(2,lv<3?9:12);a=o==='÷'?b*ri(2,9):ri(2,lv<3?15:30);c=calc(o,a,b);g++}while((c<0||ops.filter(x=>calc(x,a,b)===c).length>1)&&g<50);
    return{q:`<div class="qmono" style="font-size:40px">${a} <span style="color:var(--h)">?</span> ${b} = ${c}</div>`,opts:ops,ans:ops.indexOf(o),cols:4}}});

def({id:'sayidogrusu',cat:'sayi',gl:'0—∞',name:'Sayı Doğrusu',mode:'quiz',
  desc:'Doğru üzerindeki işaret hangi sayıyı gösteriyor? Uç noktalara bakarak tahmin et.',
  gen(lv){const max=lv<3?100:lv<6?500:1000;const step=max/20;const v=step*ri(2,18);const x=20+v/max*260;
    const w=new Set();while(w.size<3){const d=pick([-3,-2,2,3,-4,4])*step;const u=v+d;if(u>0&&u<max)w.add(u)}
    return Object.assign(mk(v,[...w]),{q:`<svg viewBox="0 0 300 70" style="width:100%;max-width:340px"><line x1="20" y1="40" x2="280" y2="40" stroke="rgba(255,255,255,.4)" stroke-width="3"/><line x1="20" y1="30" x2="20" y2="50" stroke="#fff" stroke-width="3"/><line x1="280" y1="30" x2="280" y2="50" stroke="#fff" stroke-width="3"/>${lv<3?'<line x1="150" y1="34" x2="150" y2="46" stroke="rgba(255,255,255,.5)" stroke-width="2"/>':''}<text x="20" y="66" fill="#9AA3C7" font-size="12" text-anchor="middle" font-family="monospace">0</text><text x="280" y="66" fill="#9AA3C7" font-size="12" text-anchor="middle" font-family="monospace">${max}</text><path d="M${x} 36 l-8 -14 h16z" fill="var(--h)"/></svg><div class="qsmall">İşaret hangi sayıda?</div>`,cols:2})}});
