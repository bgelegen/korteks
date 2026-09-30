/* ===================== DİL ===================== */
def({id:'anagram',cat:'dil',gl:'Aa',name:'Harf Karmaşası',mode:'quiz',pts:60,
  desc:'Harfleri karıştırılmış kelimenin aslını seçenekler arasından bul.',
  gen(){const w=pick(WORDS.filter(x=>x.length>=4&&x.length<=8&&!x.includes(' ')));let s;do{s=shuf([...w])}while(s.join('')===w);
    return Object.assign(mk(w,sample(WORDS.filter(x=>x!==w&&Math.abs(x.length-w.length)<=1),3)),{q:`<div class="row">${s.map(ch=>`<span style="width:40px;height:46px;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid var(--stroke);font-family:var(--display);font-weight:900;font-size:20px">${tl(ch)}</span>`).join('')}</div>`,txt:true})}});

def({id:'zit',cat:'dil',gl:'↔',name:'Zıt Kutuplar',mode:'quiz',
  desc:'Kelimenin zıt anlamlısını bul. Hızlı ol, seri yaptıkça çarpan artar.',
  gen(){const p=pick(ANT);const [a,b]=Math.random()<.5?p:[p[1],p[0]];return Object.assign(mk(b,sample(ANT.filter(x=>x!==p).flat(),3)),{q:`<div class="qbig">${a}</div><div class="qsmall">zıt anlamlısı?</div>`,txt:true})}});

def({id:'yanlisyazim',cat:'dil',gl:'✎',name:'Yazım Dedektifi',mode:'quiz',pts:60,
  desc:'Dört kelimeden biri yanlış yazılmış. Onu bul! Türkçenin en çok karıştırılan kelimeleri burada.',
  gen(){const p=pick(MIS);return Object.assign(mk(p[1],sample(MIS.filter(x=>x!==p).map(x=>x[0]),3)),{q:'<div class="qtext">Hangisi <b>yanlış</b> yazılmış?</div>',txt:true})}});

def({id:'esanlam',cat:'dil',gl:'=',name:'Eş Anlam',mode:'quiz',
  desc:'Kelimeyle aynı anlama gelen kelimeyi seç.',
  gen(){const p=pick(SYN);const [a,b]=Math.random()<.5?p:[p[1],p[0]];const pool=SYN.filter(x=>x!==p&&!x.includes(a)&&!x.includes(b)).flat();return Object.assign(mk(b,sample(pool,3)),{q:`<div class="qbig">${a}</div><div class="qsmall">eş anlamlısı?</div>`,txt:true})}});

def({id:'eksikharf',cat:'dil',gl:'K_T',name:'Eksik Harf',mode:'quiz',time:40,
  desc:'Kelimeden bir harf düşmüş. Boşluğa gelecek harfi seç.',
  gen(){const w=pick(WORDS.filter(x=>x.length>=4&&!x.includes(' ')));const i=ri(0,w.length-1);const c=w[i];const wr=sample([...ALPH].filter(x=>x!==c),3);
    const r=mk(c,wr);r.opts=r.opts.map(tl);return Object.assign(r,{q:`<div class="qbig" style="letter-spacing:.12em">${tl(w.slice(0,i))}<span style="color:var(--h)">_</span>${tl(w.slice(i+1))}</div>`,cols:4})}});

def({id:'kelimezinciri',cat:'dil',gl:'a→a',name:'Kelime Zinciri',mode:'quiz',time:40,
  desc:'Gösterilen kelimenin SON harfiyle BAŞLAYAN kelimeyi bul. Zinciri koparma!',
  gen(){let w,L,cands,g=0;do{w=pick(WORDS);L=w[w.length-1];cands=WORDS.filter(x=>x[0]===L&&x!==w);g++}while(!cands.length&&g<100);
    const c=pick(cands);return Object.assign(mk(c,sample(WORDS.filter(x=>x[0]!==L),3)),{q:`<div class="qbig">${w.slice(0,-1)}<span style="color:var(--h)">${w.slice(-1)}</span></div><div class="qsmall">Son harfle başlayan hangisi?</div>`,txt:true})}});
