/* ===================== HIZ ===================== */
def({id:'refleks',cat:'hiz',gl:'⚡',name:'Refleks Işığı',mode:'custom',par:3200,tags:['5 deneme','ms ölçümü'],
  desc:'Daire yeşile döndüğü an dokun. Erken dokunursan deneme geçersiz olur. Beş denemedeki hızın puanını belirler.',
  run(g){
    shell(g,[['Deneme','lv','1/5'],['Son','ms','—'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let trial=0,score=0,times=[],early=0,state='idle',t0=0;
    $('#stage').innerHTML=`<div class="prompt" id="pm">Daire yeşile dönünce dokun</div><button class="bigbtn" id="bb">Hazır</button><div class="feedback" id="fb"></div>`;
    const bb=$('#bb');
    function arm(){state='wait';bb.className='bigbtn';bb.textContent='Bekle…';$('#lv').textContent=(trial+1)+'/5';later(()=>{if(state!=='wait')return;state='go';bb.className='bigbtn go';bb.textContent='DOKUN!';t0=performance.now()},ri(1100,3200))}
    bb.onpointerdown=()=>{
      if(state==='wait'){stopAll();early++;state='idle';bb.className='bigbtn early';bb.textContent='Erken!';fb(false,'Çok erken');later(arm,1100);return}
      if(state==='go'){const rt=Math.round(performance.now()-t0);state='idle';times.push(rt);trial++;const p=Math.max(0,Math.round((650-rt)*2.2));score+=p;
        bb.className='bigbtn';bb.innerHTML=`<span class="num">${rt} ms</span>`;$('#ms').textContent=rt;$('#sc').textContent=score;fb(true,rt<250?'Şimşek gibi!':'Güzel',p,bb);
        if(trial>=5)later(()=>finish(g.id,score,[['En iyi',Math.min(...times)+' ms'],['Ortalama',Math.round(times.reduce((a,b)=>a+b,0)/5)+' ms'],['Erken',early]]),1000);else later(arm,1000)}};
    later(arm,600);
  }});

def({id:'siraavcisi',cat:'hiz',gl:'1→9',name:'Sıra Avcısı',mode:'custom',par:2200,tags:['45 sn','Tahta büyür'],
  desc:'Ekrana dağılmış sayıları 1\'den başlayarak sırayla, olabildiğince hızlı patlat. Her tahtada sayı artar.',
  run(g){
    shell(g,[['Tahta','lv','1'],['Sıradaki','nx','1'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let score=0,boards=0,hits=0,miss=0,live=false,N=6,next=1;
    $('#stage').innerHTML=`<div class="prompt">Sayıları <b>sırayla</b> patlat</div><div class="field glass" id="fd"></div><div class="feedback" id="fb"></div>`;
    function board(){const fd=$('#fd');fd.innerHTML='';const W=fd.clientWidth||320,H=fd.clientHeight||320;next=1;$('#nx').textContent=1;$('#lv').textContent=boards+1;const ps=[];
      for(let i=1;i<=N;i++){let x,y,t=0;do{x=ri(30,W-30);y=ri(30,H-30);t++}while(t<80&&ps.some(p=>Math.hypot(p.x-x,p.y-y)<58));ps.push({x,y});
        const b=document.createElement('button');b.className='bub';b.textContent=i;b.style.left=x+'px';b.style.top=y+'px';fd.appendChild(b);
        b.onclick=()=>{if(!live||b.classList.contains('gone'))return;if(i===next){b.classList.add('gone');hits++;next++;score+=15;$('#sc').textContent=score;$('#nx').textContent=next>N?'✓':next;
          if(next>N){boards++;const bn=N*12;score+=bn;fb(true,'Tahta tamam!',bn,fd);N=Math.min(16,N+2);later(board,500)}}else{miss++;fb(false)}}}}
    board();countdown(()=>{live=true;runTimer(45,()=>{live=false;finish(g.id,score,[['Tahta',boards],['Doğru',hits],['Hata',miss]])})});
  }});

def({id:'buyukolan',cat:'hiz',gl:'7>2',name:'Büyük Olan',mode:'quiz',time:30,pts:30,
  desc:'İki sayıdan değeri büyük olana dokun. Dikkat: yazı boyutu seni yanıltmaya çalışacak.',
  gen(lv){const hi=lv<3?9:lv<6?99:999;let a=ri(1,hi),b;do{b=ri(1,hi)}while(b===a);const big=Math.max(a,b);const inc=Math.random()<.65;
    const sz=v=>(inc?(v===big?26:70):(v===big?70:26));return{q:'<div class="qsmall">Değeri büyük olan hangisi?</div>',opts:[a,b].map(v=>`<span style="font-size:${sz(v)}px;line-height:1">${v}</span>`),ans:a>b?0:1,cols:2}}});

def({id:'kalabalik',cat:'hiz',gl:'⁘',name:'Nokta Kalabalığı',mode:'quiz',time:30,pts:30,
  desc:'İki kutudaki noktaları saymadan karşılaştır. Daha kalabalık olan kutuya hızlıca dokun.',
  gen(lv){const d=Math.max(2,8-lv);const a=ri(8,24);const b=Math.random()<.5?a+d+ri(0,2):Math.max(3,a-d-ri(0,2));
    const panel=n=>{const ps=[];for(let i=0;i<n;i++){let x,y,t=0;do{x=ri(10,130);y=ri(10,130);t++}while(t<40&&ps.some(p=>Math.hypot(p.x-x,p.y-y)<13));ps.push({x,y})}
      const r=ri(4,7);return `<svg viewBox="0 0 140 140" style="width:100%">${ps.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="var(--h)"/>`).join('')}</svg>`};
    return{q:'<div class="qsmall">Hangi kutuda daha çok nokta var?</div>',opts:[panel(a),panel(b)],ans:a>b?0:1,cols:2}}});

def({id:'tamzaman',cat:'hiz',gl:'|◁▷|',name:'Tam Zamanında',mode:'custom',par:2000,tags:['3 hak','Hızlanır'],
  desc:'İbre bir o yana bir bu yana gidiyor. Işıklı bölgenin içindeyken DUR\'a bas. Merkeze ne kadar yakınsa o kadar puan.',
  run(g){
    shell(g,[['Sv','lv','1'],['Hak','lf','3'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let lv=1,lives=3,score=0,hits=0,perfect=0,pos=0,dir=1,zone={c:.5,w:.22},live=false,last=0;
    $('#stage').innerHTML=`<div class="prompt">İbre <b>bölgenin içindeyken</b> durdur</div><div class="track glass" id="tr"><div class="zone" id="zn"><i></i></div><div class="needle" id="nd"></div></div><div class="feedback" id="fb"></div><button class="bigbtn" id="stop" style="width:170px;height:170px">DUR</button>`;
    function setZone(){zone.w=Math.max(.07,.24-lv*.017);zone.c=zone.w/2+Math.random()*(1-zone.w);const z=$('#zn');z.style.left=((zone.c-zone.w/2)*100)+'%';z.style.width=(zone.w*100)+'%'}
    function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;const sp=.55+lv*.12;pos+=dir*sp*dt;if(pos>1){pos=1;dir=-1}if(pos<0){pos=0;dir=1}$('#nd').style.left=(pos*100)+'%';moveRaf=requestAnimationFrame(loop)}
    $('#stop').onclick=()=>{if(!live)return;const d=Math.abs(pos-zone.c);
      if(d<=zone.w/2){const q=1-d/(zone.w/2);const p=Math.round((40+60*q)*lv);score+=p;hits++;if(q>.8)perfect++;fb(true,q>.8?'Mükemmel!':'İsabet',p,$('#tr'));lv++}
      else{lives--;fb(false,'Kaçtı');$('#lf').textContent=lives;if(lives<=0){live=false;later(()=>finish(g.id,score,[['İsabet',hits],['Mükemmel',perfect],['Max sv.',lv]]),900);return}}
      $('#lv').textContent=lv;$('#sc').textContent=score;setZone()};
    setZone();countdown(()=>{live=true;last=performance.now();moveRaf=requestAnimationFrame(loop)});
  }});

def({id:'isikavi',cat:'hiz',gl:'◈',name:'Işık Avı',mode:'custom',par:2200,tags:['45 sn','Kırmızıya dokunma'],
  desc:'Kutularda ışıklar yanıp sönecek. Renkli olanlara sönmeden dokun, kırmızılara asla dokunma.',
  run(g){
    shell(g,[['Yakalanan','ok','0'],['Çarpan','mx','x1'],['Skor','sc','0']]);$('#timerwrap').hidden=true;
    let score=0,hit=0,missed=0,red=0,run=0,live=false,elapsed=0;
    $('#stage').innerHTML=`<div class="prompt">Renkliye dokun, <b style="color:var(--bad)">kırmızıya</b> dokunma</div><div class="lgrid" id="lg"></div><div class="feedback" id="fb"></div>`;
    const cells=[];for(let i=0;i<16;i++){const b=document.createElement('button');b.setAttribute('aria-label','Kutu');$('#lg').appendChild(b);cells.push({b,st:null,t:null})}
    const mult=()=>1+Math.min(4,Math.floor(run/5));
    cells.forEach(c=>c.b.onclick=()=>{if(!live||!c.st)return;clearTimeout(c.t);
      if(c.st==='g'){hit++;run++;const p=25*mult();score+=p;fb(true,null,p,c.b)}else{red++;run=0;fb(false,'Kırmızı!')}
      c.st=null;c.b.className='';$('#ok').textContent=hit;$('#mx').textContent='x'+mult();$('#sc').textContent=score});
    function spawn(){if(!live)return;const free=cells.filter(c=>!c.st);if(free.length){const c=pick(free);c.st=Math.random()<.24?'r':'g';c.b.className=c.st;const life=Math.max(650,1200-elapsed*12);
        c.t=setTimeout(()=>{if(c.st==='g'){missed++;run=0;$('#mx').textContent='x1'}c.st=null;c.b.className=''},life);timers.push(c.t)}
      elapsed++;later(spawn,Math.max(380,780-elapsed*8))}
    countdown(()=>{live=true;spawn();runTimer(45,()=>{live=false;finish(g.id,score,[['Yakalanan',hit],['Kaçan',missed],['Kırmızı',red]])})});
  }});
