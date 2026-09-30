/* ===================== HAFIZA ===================== */
def({id:'sinaps',cat:'hafiza',gl:'◇',name:'Sinaps Zinciri',mode:'custom',par:1400,tags:['3 hak','Zincir uzar'],
  desc:'Nöron ağında bir sinyal yol alacak. Ateşlenen nöronları aynı sırayla takip et. Her başarılı turda zincir bir halka uzar.',
  run(g){
    shell(g,[['Zincir','lv','3'],['Hak','lf','3'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let len=3,lives=3,score=0,rounds=0,maxLen=3;const rnd=(a,b)=>a+Math.random()*(b-a);
    const P=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)P.push({x:55+c*105+rnd(-20,20),y:55+r*105+rnd(-20,20)});
    const adj=P.map(()=>new Set()),E=[];const link=(a,b)=>{if(a===b||adj[a].has(b))return;adj[a].add(b);adj[b].add(a);E.push([a,b])};
    for(let i=0;i<9;i++){const r=Math.floor(i/3),c=i%3;if(c<2)link(i,i+1);if(r<2)link(i,i+3)}
    shuf([[0,4],[2,4],[4,6],[4,8],[1,3],[5,7]]).slice(0,3).forEach(([a,b])=>link(a,b));
    const eid=(a,b)=>'e'+Math.min(a,b)+'-'+Math.max(a,b);
    $('#stage').innerHTML=`<div class="prompt" id="pm">Sinyali izle…</div><div class="seqdots" id="dots"></div><div class="net glass"><svg viewBox="0 0 320 320">${E.map(([a,b])=>`<line class="edge" id="${eid(a,b)}" x1="${P[a].x}" y1="${P[a].y}" x2="${P[b].x}" y2="${P[b].y}"/>`).join('')}${P.map((p,i)=>`<g class="node" data-i="${i}"><circle class="halo" cx="${p.x}" cy="${p.y}" r="30"/><circle class="core" cx="${p.x}" cy="${p.y}" r="20"/></g>`).join('')}</svg></div><div class="feedback" id="fb"></div>`;
    const nodes=$$('.node'),edge=(a,b)=>document.getElementById(eid(a,b));let seq=[],idx=0,active=false;
    const clear=()=>{nodes.forEach(n=>n.classList.remove('fire','ok','bad'));$$('.edge').forEach(e=>e.classList.remove('lit'))};
    const dots=()=>{$('#dots').innerHTML=seq.map((_,i)=>`<i class="${i<idx?'on':''}"></i>`).join('')};
    function round(){clear();active=false;idx=0;$('#lv').textContent=len;$('#lf').textContent=lives;$('#sc').textContent=score;
      seq=[ri(0,8)];while(seq.length<len){const cur=seq[seq.length-1],prev=seq[seq.length-2];let o=[...adj[cur]].filter(n=>n!==prev);if(!o.length)o=[...adj[cur]];seq.push(pick(o))}
      dots();$('#pm').innerHTML='Sinyali <b>izle</b>…';const step=Math.max(380,640-len*22);
      seq.forEach((n,i)=>{later(()=>{nodes[n].classList.add('fire');if(i>0){const e=edge(seq[i-1],n);e&&e.classList.add('lit')}},500+i*step);later(()=>{nodes[n].classList.remove('fire');if(i>0){const e=edge(seq[i-1],n);e&&e.classList.remove('lit')}},500+i*step+step*.75)});
      later(()=>{active=true;$('#pm').innerHTML='Aynı yolu <b>takip et</b>'},500+len*step)}
    nodes.forEach(nd=>nd.addEventListener('click',()=>{if(!active)return;const i=+nd.dataset.i;
      if(i===seq[idx]){nodes.forEach(n=>n.classList.remove('fire'));nd.classList.add('fire');if(idx>0){const e=edge(seq[idx-1],i);e&&e.classList.add('lit')}later(()=>nd.classList.remove('fire'),260);idx++;score+=10*len;$('#sc').textContent=score;dots();buzz(10);
        if(idx===seq.length){active=false;rounds++;const b=20*len;score+=b;$('#sc').textContent=score;fb(true,'Zincir tamam!',b,$('.net'));len++;maxLen=Math.max(maxLen,len);later(round,950)}}
      else{active=false;nd.classList.add('bad');nodes[seq[idx]].classList.add('ok');lives--;$('#lf').textContent=lives;fb(false,'Sinyal koptu');len=Math.max(3,len-1);
        if(lives<=0)later(()=>finish(g.id,score,[['Tur',rounds],['En uzun',maxLen],['Hak',0]]),1300);else later(round,1300)}}));
    later(round,300);
  }});

def({id:'kayip',cat:'hafiza',gl:'?',name:'Kayıp Parça',mode:'rounds',
  desc:'Bir dizi şekil göreceksin. Sonra biri eksilecek. Hangisinin kaybolduğunu bul.',
  gen(lv){const n=Math.min(8,2+lv);const pool=sample(TOK,n);const miss=ri(0,n-1);
    const rest=pool.filter((_,i)=>i!==miss);const shown=lv>3?shuf(rest):rest;
    const wr=[];while(wr.length<3){const s=similar(pool[miss],[...pool,...wr]);wr.push(s)}
    const r=mk(pool[miss],wr);r.opts=r.opts.map(t=>tok(t,38));
    return Object.assign(r,{show:`<div class="row">${pool.map(t=>tok(t,38)).join('')}</div>`,ms:1100+n*380,
      q:`<div class="row" style="opacity:.9">${shown.map(t=>tok(t,32)).join('')}</div><div class="qsmall">Hangisi eksik?</div>`,cols:4})}});

def({id:'degisen',cat:'hafiza',gl:'⇆',name:'Değişen Kare',mode:'rounds',
  desc:'Kutulardaki şekilleri ezberle. Tekrar göründüklerinde biri değişmiş olacak. Değişen kutuya dokun.',
  gen(lv){const n=Math.min(12,3+lv);const cols=n<=4?n:n<=9?3:4;const pool=sample(TOK,n);const ch=ri(0,n-1);const nw=similar(pool[ch],pool);
    const grid=(arr,tap)=>`<div class="tg" style="grid-template-columns:repeat(${cols},1fr);width:min(100%,${cols*78}px)">${arr.map((t,i)=>tap?`<button data-a="${i}">${tok(t,34)}</button>`:`<div>${tok(t,34)}</div>`).join('')}</div>`;
    const after=[...pool];after[ch]=nw;
    return{show:grid(pool,false),ms:1200+n*350,q:grid(after,true),ans:ch,p2:'Hangi kutu <b>değişti?</b>'}}});

def({id:'raf',cat:'hafiza',gl:'≡',name:'Kelime Rafı',mode:'rounds',
  desc:'Raftaki kelimeleri oku ve aklında tut. Sonra sana sorulan kelimeyi bul: listede olanı ya da olmayanı.',
  gen(lv){const n=Math.min(9,2+lv);const list=sample(WORDS,n);const others=sample(WORDS.filter(w=>!list.includes(w)),3);
    const mode=lv>2&&Math.random()<.5?'yok':'var';
    let r;if(mode==='var'){r=mk(list[ri(0,n-1)],sample(others,3))}else{r=mk(others[0],sample(list,3))}
    return Object.assign(r,{show:`<div class="chipline">${list.map(w=>`<span>${w}</span>`).join('')}</div>`,ms:1400+n*550,
      q:`<div class="qtext">${mode==='var'?'Hangisi rafta <b>vardı?</b>':'Hangisi rafta <b>yoktu?</b>'}</div>`,txt:true})}});

def({id:'renksira',cat:'hafiza',gl:'◐',name:'Renk Sırası',mode:'rounds',
  desc:'Renkler tek tek yanıp sönecek. Sonra sana belirli bir sıradaki rengi soracağım.',
  gen(lv){const n=Math.min(8,2+lv);const s=[];while(s.length<n){const c=pick(CN);if(c!==s[s.length-1])s.push(c)}
    const k=ri(0,n-1);const wr=sample(CN.filter(c=>c!==s[k]),3);const r=mk(s[k],wr);r.opts=r.opts.map(c=>swatch(c));
    return Object.assign(r,{seq:s.map(c=>`<span class="swatch" style="width:110px;height:110px;background:${COLV[c]};color:${COLV[c]}"></span>`),ms:Math.max(550,900-lv*30),
      p1:'Renkleri <b>izle</b>',q:`<div class="qbig">${k+1}.</div><div class="qsmall">sıradaki renk hangisiydi?</div>`,cols:4})}});

def({id:'kasa',cat:'hafiza',gl:'#',name:'Şifre Kasası',mode:'rounds',
  desc:'Kasanın şifresi kısa bir süre görünecek. Sonra dört benzer şifre arasından doğrusunu seç.',
  gen(lv){const len=Math.min(9,3+lv);const A='ABCDEFGHKMNPRSTXYZ23456789';let code='';for(let i=0;i<len;i++)code+=pick([...A]);
    const mut=()=>{let c=[...code];const t=ri(0,2);const i=ri(0,len-2);if(t===0){[c[i],c[i+1]]=[c[i+1],c[i]]}else{c[ri(0,len-1)]=pick([...A])}return c.join('')};
    const w=new Set();let g=0;while(w.size<3&&g<200){g++;const m=mut();if(m!==code)w.add(m)}
    return Object.assign(mk(code,[...w]),{show:`<div class="qmono">${code}</div>`,ms:900+len*320,q:'<div class="qsmall">Doğru şifre hangisiydi?</div>',cols:1})}});

def({id:'tersten',cat:'hafiza',gl:'⇤',name:'Tersten Sayı',mode:'rounds',
  desc:'Rakamlar tek tek görünecek. Hepsini aklında tut ve diziyi TERSTEN yazılmış haliyle bul.',
  gen(lv){const n=Math.min(8,2+lv);const d=[];while(d.length<n){const x=ri(0,9);if(x!==d[d.length-1])d.push(x)}
    const rev=[...d].reverse().join(' ');const w=new Set();{const fw=d.join(' ');if(n>2&&fw!==rev)w.add(fw)}
    let g=0;while(w.size<3&&g<300){g++;const c=[...d].reverse();if(Math.random()<.5){const i=ri(0,n-2);[c[i],c[i+1]]=[c[i+1],c[i]]}else{c[ri(0,n-1)]=ri(0,9)}const s=c.join(' ');if(s!==rev)w.add(s)}
    return Object.assign(mk(rev,[...w].slice(0,3)),{seq:d.map(x=>`<div class="qbig" style="font-size:80px">${x}</div>`),ms:Math.max(600,950-lv*30),p1:'Rakamları <b>izle</b>',q:'<div class="qsmall">Dizinin tersi hangisi?</div>',cols:1})}});

def({id:'eslesme',cat:'hafiza',gl:'▣',name:'Eşleşme İzi',mode:'custom',par:1600,tags:['60 sn','Tahta tahta'],
  desc:'Kartları ikişer ikişer çevir, aynı şekilleri eşleştir. Tahta bitince yenisi gelir. Seri eşleşmeler çarpan kazandırır.',
  run(g){
    shell(g,[['Çift','ok','0'],['Çarpan','mx','x1'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let score=0,pairs=0,miss=0,run=0,boards=0,live=false,open=[];
    $('#stage').innerHTML=`<div class="prompt">Aynı şekilleri <b>eşleştir</b></div><div class="mgrid" id="mg"></div><div class="feedback" id="fb"></div>`;
    const mult=()=>1+Math.min(4,Math.floor(run/2));
    function board(){const t=sample(TOK,8);const cards=shuf([...t,...t]);const mg=$('#mg');mg.innerHTML='';open=[];let left=8;
      cards.forEach(tk=>{const b=document.createElement('button');b.className='mcard';b.innerHTML=tok(tk,34);b.dataset.t=tk;mg.appendChild(b);
        b.onclick=()=>{if(!live||b.classList.contains('up')||b.classList.contains('done')||open.length>=2)return;b.classList.add('up');open.push(b);
          if(open.length===2){const [a,c]=open;if(a.dataset.t===c.dataset.t){later(()=>{a.classList.add('done');c.classList.add('done');a.classList.remove('up');c.classList.remove('up')},200);open=[];pairs++;run++;const p=40*mult();score+=p;fb(true,null,p,c);left--;
              if(left===0){boards++;score+=150;fb(true,'Tahta temiz! +150');later(board,700)}}
            else{miss++;run=0;later(()=>{a.classList.remove('up');c.classList.remove('up');open=[]},650)}
            $('#ok').textContent=pairs;$('#mx').textContent='x'+mult();$('#sc').textContent=score}}})}
    board();countdown(()=>{live=true;runTimer(60,()=>{live=false;finish(g.id,score,[['Çift',pairs],['Hata',miss],['Tahta',boards]])})});
  }});
