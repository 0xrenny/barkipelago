(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* names from config */
$$('[data-name]').forEach(e=>e.textContent=CFG.NAME);$$('[data-tagline]').forEach(e=>e.textContent=CFG.TAGLINE);document.title=CFG.NAME+' — a corgi platformer';$('#supply').textContent=CFG.SUMMON_SUPPLY.toLocaleString();
if(CFG.X_HANDLE){$('#xfollow').href='https://x.com/'+CFG.X_HANDLE;$('#xfollow').textContent='Follow @'+CFG.X_HANDLE}

/* ---------- music: start on first gesture ---------- */
const syncMute=()=>{$('#mute').classList.toggle('off',Music.muted());$('#mute').textContent=Music.muted()?'♪̸':'♪';$('#mute').title=Music.muted()?'Music off':'Music on'};
const first=()=>{if(!Music.muted())Music.start();removeEventListener('pointerdown',first);removeEventListener('keydown',first)};
addEventListener('pointerdown',first);addEventListener('keydown',first);
$('#mute').onclick=e=>{e.stopPropagation();Music.toggle();syncMute()};syncMute();

/* ---------- router (same-page transitions) ---------- */
const views=Object.fromEntries($$('.view').map(v=>[v.dataset.view,v]));let cur=null;
function route(){const h=(location.hash.replace(/^#\/?/,'')||'home').split('/');const name=views[h[0]]?h[0]:'home';
  const go=()=>{Object.values(views).forEach(v=>v.classList.toggle('on',v.dataset.view===name));$$('#nav a').forEach(a=>a.classList.toggle('on',(a.getAttribute('href').slice(2)||'home')===name));
    const a=$$('#nav a').find(a=>a.classList.contains('on'));if(a){const r=a.getBoundingClientRect(),n=$('#nav').getBoundingClientRect();$('#navpill').style.cssText=`width:${r.width}px;transform:translateX(${r.left-n.left}px)`}
    scrollTo({top:0,behavior:'instant'});onEnter(name,h[1])};
  if(cur===name){onEnter(name,h[1]);return}
  if(cur&&cur==='play')Game.stop();cur=name;
  if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(go);else go()}
addEventListener('hashchange',route);
function onEnter(n,arg){if(n==='home')renderMap();if(n==='quests')renderQuests();if(n==='play')enterPlay(arg)}

/* ---------- star / ocean background ---------- */
(function stars(){const cv=$('#stars'),c=cv.getContext('2d');let pts=[];const rs=()=>{cv.width=innerWidth;cv.height=innerHeight;pts=[...Array(90)].map(()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.4+.3,p:Math.random()*6}))};rs();addEventListener('resize',rs);
  const f=t=>{c.clearRect(0,0,cv.width,cv.height);pts.forEach(s=>{c.globalAlpha=.25+.35*Math.sin(t/900+s.p)**2;c.fillStyle='#fff';c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill()});if(cur!=='play')requestAnimationFrame(f);else setTimeout(()=>requestAnimationFrame(f),500)};requestAnimationFrame(f)})();

/* ---------- island map ---------- */
const ISL=[
 {i:0,x:200,y:420,s:1,cols:['#7fdc6a','#e9b97a','#c98f52'],prop:'palm',blurb:'Warm sand, grumpy crabs, and a key hidden up in the clouds.'},
 {i:1,x:520,y:250,s:1.05,cols:['#9be36b','#7a5a3e','#5a3f2a'],prop:'pine',blurb:'Bouncy mushrooms, springy moss and a pit that is not what it seems.'},
 {i:2,x:860,y:410,s:1.08,cols:['#ffb35c','#4a3040','#33202c'],prop:'volcano',blurb:'Floating rocks over a lava sea. Do not touch the orange stuff.'},
 {i:3,x:1040,y:150,s:.8,cols:['#c9d2ff','#5a5aa8','#3a3a78'],prop:'moon',soon:true,name:'Moon Kennel',blurb:'Coming soon. Low gravity, high zoomies.'}];
function stars3(i){const st=Prog.levelState(i);return LEVELS[i].quests.map(q=>st.q[q.id]?'★':'☆').join('')}
function islandSVG(d){const [g,c1,c2]=d.cols;const lock=!d.soon&&!Prog.unlocked(d.i);let prop='';
  if(d.prop==='palm')prop=`<path d="M-30 -58 q4 -40 14 -62" stroke="#8a6a4a" stroke-width="7" fill="none"/><g fill="#4aa37a"><ellipse cx="-16" cy="-122" rx="30" ry="9" transform="rotate(-20 -16 -122)"/><ellipse cx="-12" cy="-118" rx="28" ry="8" transform="rotate(35 -12 -118)"/><ellipse cx="-20" cy="-120" rx="26" ry="8" transform="rotate(100 -20 -120)"/></g><g transform="translate(40,-64)"><rect x="-18" y="-26" width="36" height="26" fill="#b5562a" rx="3"/><path d="M-24 -24 L0 -44 L24 -24Z" fill="#e8893a"/><path d="M-7 0 v-12 a7 7 0 0 1 14 0 v12z" fill="#2b1d14"/></g>`;
  if(d.prop==='pine')prop=[-50,-10,34,64].map((x,k)=>`<path d="M${x} -58 l${22+k*2} 0 l-${11+k} -${54+k*12}z" fill="${k%2?'#2f6b5a':'#24533f'}"/>`).join('')+`<g fill="#d94f6b"><ellipse cx="10" cy="-62" rx="12" ry="8"/></g><rect x="6" y="-62" width="8" height="8" fill="#f4e6cf"/>`;
  if(d.prop==='volcano')prop=`<path d="M-60 -56 L-14 -130 L14 -130 L60 -56Z" fill="#5a2a4a"/><path d="M-14 -130 L14 -130 L8 -112 L-6 -118Z" fill="#ff7a2a"/><circle class="smoke" cx="0" cy="-150" r="12" fill="rgba(255,255,255,.35)"/><circle class="smoke s2" cx="10" cy="-170" r="9" fill="rgba(255,255,255,.25)"/>`;
  if(d.prop==='moon')prop=`<circle cx="0" cy="-110" r="34" fill="#fff6c9"/><circle cx="12" cy="-118" r="7" fill="#e8dca0"/><circle cx="-12" cy="-100" r="5" fill="#e8dca0"/>`;
  const name=d.name||LEVELS[d.i].name;
  return `<g class="isl ${lock?'locked':''} ${d.soon?'soon':''}" data-i="${d.i}" tabindex="0" role="button" aria-label="${esc(name)}" transform="translate(${d.x},${d.y}) scale(${d.s})">
   <g class="bob" style="animation-delay:${-d.i*1.3}s">
    <ellipse class="ring" cx="0" cy="18" rx="150" ry="34"/>
    <ellipse cx="0" cy="40" rx="130" ry="22" fill="rgba(0,10,40,.35)" class="shadow"/>
    <path d="M-120 -40 Q-100 60 -40 90 Q0 120 30 92 Q90 70 120 -40Z" fill="${c2}"/>
    <path d="M-120 -40 Q-90 20 -50 30 Q0 50 40 30 Q90 18 120 -40Z" fill="${c1}"/>
    <path d="M-128 -46 Q0 -86 128 -46 Q120 -26 0 -24 Q-120 -26 -128 -46Z" fill="${g}"/>
    ${prop}
    <g class="flag" transform="translate(0,64)"><rect x="-74" y="0" width="148" height="34" rx="17" fill="rgba(8,16,40,.78)" stroke="rgba(255,255,255,.18)"/>
     <text x="0" y="22" text-anchor="middle">${lock?'🔒 ':d.soon?'✦ ':''}${esc(name)}</text></g>
    ${!d.soon?`<text class="stars3" x="0" y="122" text-anchor="middle">${stars3(d.i)}</text>`:''}
   </g></g>`}
function renderMap(){const svg=$('#map');const path=ISL.slice(0,-1).map((d,k)=>{const n=ISL[k+1];const mx=(d.x+n.x)/2,my=Math.min(d.y,n.y)-90;return `<path class="route" d="M${d.x} ${d.y} Q${mx} ${my} ${n.x} ${n.y}"/>`}).join('');
  const waves=[...Array(16)].map((_,k)=>`<path class="wave" style="animation-delay:${-k*.7}s" d="M${(k*173)%1150} ${60+(k*97)%560} q12 -8 24 0 t24 0"/>`).join('');
  const curIdx=Math.max(0,[0,1,2].filter(i=>Prog.unlocked(i)).pop());
  svg.innerHTML=`<defs><radialGradient id="sea" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#1b5fa8"/><stop offset=".6" stop-color="#0f3a78"/><stop offset="1" stop-color="#0b1830"/></radialGradient></defs>
   <rect width="1200" height="640" rx="28" fill="url(#sea)"/>${waves}${path}${ISL.map(islandSVG).join('')}
   <g class="pin" transform="translate(${ISL[curIdx].x-10},${ISL[curIdx].y-150})"><g class="pinbob"><image href="corgi.svg" x="-28" y="-28" width="56" height="56"/></g></g>`;
  $$('#map .isl').forEach(g=>{const i=+g.dataset.i;const d=ISL.find(x=>x.i===i);
    const show=()=>{const card=$('#island-card');const lock=!d.soon&&!Prog.unlocked(i);const st=d.soon?null:Prog.levelState(i);
      card.innerHTML=d.soon?`<h4>✦ Moon Kennel</h4><p>${d.blurb}</p><span class="tag">Coming soon</span>`:
       `<h4>${esc(LEVELS[i].name)} <span class="st">${stars3(i)}</span></h4><p>${d.blurb}</p><ul>${LEVELS[i].quests.map(q=>`<li class="${st.q[q.id]?'ok':''}">${st.q[q.id]?'✓':'○'} ${esc(q.text)}</li>`).join('')}</ul>${st.best?`<small>Best: ${st.best.toFixed(1)}s</small>`:''}${lock?`<span class="tag">Clear ${esc(LEVELS[i-1].name)} to unlock</span>`:`<a class="btn sm" href="#/play/${i}">Play →</a>`}`;
      const r=g.getBoundingClientRect(),w=$('.map-wrap').getBoundingClientRect();card.hidden=false;
      let left=r.left-w.left+r.width/2-140;left=Math.max(8,Math.min(w.width-288,left));card.style.left=left+'px';card.style.top=Math.max(8,r.top-w.top-20)+'px';card.classList.add('in')};
    g.addEventListener('mouseenter',show);g.addEventListener('focus',show);
    g.addEventListener('click',()=>{if(!d.soon&&Prog.unlocked(i))location.hash='#/play/'+i;else show()})});
  $('.map-wrap').onmouseleave=()=>{$('#island-card').classList.remove('in')};
  const tot=[0,1,2].reduce((a,i)=>a+Object.values(Prog.levelState(i).q).filter(Boolean).length,0);
  $('#homeStats').innerHTML=`<span><b>3</b> islands live</span><span><b>${tot}/9</b> quests done</span><span><b>60</b> fps, zero downloads</span>`}

/* ---------- play ---------- */
let inited=false;
function enterPlay(arg){if(!inited){Game.init($('#game'),hud);inited=true}
  $('#doneOverlay').hidden=true;$('#pauseOverlay').hidden=true;
  if(arg!==undefined&&Prog.unlocked(+arg)&&LEVELS[+arg]){$('#pickOverlay').hidden=true;Game.start(+arg);Music.muted()||Music.start()}
  else{Game.stop();$('#pickOverlay').hidden=false;$('#pickList').innerHTML=LEVELS.map((l,i)=>`<a class="pk ${Prog.unlocked(i)?'':'locked'}" ${Prog.unlocked(i)?`href="#/play/${i}"`:''}><b>${i+1}. ${esc(l.name)}</b><span>${stars3(i)}</span></a>`).join('')}}
let toastT;
function hud(m){if(m.stats){const s=m.stats;$('#hName').textContent=s.name;$('#hHearts').textContent='❤'.repeat(Math.max(0,s.hearts))||'0';$('#hBones').textContent=s.bones;$('#hTotal').textContent='/'+s.total;
   $('#hKey').classList.toggle('got',s.key);$('#hKey b').textContent=s.key?'✓':'—';$('#hTime').textContent=s.t.toFixed(1);
   $('#questbar').innerHTML='<h4>Quests</h4>'+s.quests.map(q=>{let ok=false,pr='';if(q.id==='bones'){ok=s.bones>=q.n;pr=`${Math.min(s.bones,q.n)}/${q.n}`}if(q.id==='key'){ok=s.key;pr=ok?'found':'?'}if(q.id==='time'){ok=s.t<=q.n;pr=`${Math.max(0,q.n-s.t).toFixed(0)}s left`}if(q.id==='stomp'){ok=s.stomps>=q.n;pr=`${Math.min(s.stomps,q.n)}/${q.n}`}if(q.id==='nohit'){ok=s.hurt===0;pr=ok?'clean':'failed'}
     return `<div class="q ${ok?'ok':''} ${q.id==='nohit'&&!ok||q.id==='time'&&!ok?'fail':''}"><span>${ok?'✓':'○'}</span><p>${esc(q.text)}</p><em>${pr}</em></div>`}).join('')}
 if(m.toast){const t=$('#toast');t.innerHTML=`<b>${esc(m.toast.title)}</b><span>${esc(m.toast.sub)}</span>`;t.classList.remove('in');void t.offsetWidth;t.classList.add('in');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('in'),2600)}
 if('pause' in m)$('#pauseOverlay').hidden=!m.pause;
 if(m.finish){const f=m.finish,n=Object.values(f.res).filter(Boolean).length;const nextI=f.idx+1;
   setTimeout(()=>{$('#doneCard').innerHTML=`<div class="big-stars">${f.def.quests.map(q=>f.res[q.id]?'<i class="on">★</i>':'<i>★</i>').join('')}</div><h3>${esc(f.def.name)} cleared!</h3>
    <p class="muted">${f.time.toFixed(1)}s · ${f.bones}/${f.total} bones · ${f.stomps} bonks</p><ul class="res">${f.def.quests.map(q=>`<li class="${f.res[q.id]?'ok':''}">${f.res[q.id]?'✓':'✗'} ${esc(q.text)}</li>`).join('')}</ul>
    <p class="corgi-says">“${n===3?'Perfect run. I would like a treat now.':n===2?'Nice! One quest is still sniffing around.':'Home! But the quests are judging us.'}”</p>
    <div class="row"><button class="btn ghost" id="again">Replay</button>${LEVELS[nextI]?`<a class="btn" href="#/play/${nextI}">Next: ${esc(LEVELS[nextI].name)} →</a>`:`<a class="btn" href="#/waitlist">More islands soon →</a>`}<a class="btn ghost" href="#/">Map</a></div>`;
    $('#doneOverlay').hidden=false;$('#again').onclick=()=>{$('#doneOverlay').hidden=true;Game.restart()}},900)}}
$('#pauseBtn').onclick=()=>Game.togglePause();$('#resume').onclick=()=>Game.togglePause();$('#restart').onclick=()=>{Game.paused=false;$('#pauseOverlay').hidden=true;Game.restart()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&Game.active&&!Game.paused&&Game.st&&!Game.st.done)Game.togglePause()});

/* ---------- quest log ---------- */
function renderQuests(){$('#questlog').innerHTML=LEVELS.map((l,i)=>{const st=Prog.levelState(i),lock=!Prog.unlocked(i);return `<div class="qcard ${lock?'locked':''}" style="--d:${i*.08}s"><div class="qh"><b>${i+1}</b><h3>${esc(l.name)}</h3><span>${stars3(i)}</span></div>
  <ul>${l.quests.map(q=>`<li class="${st.q[q.id]?'ok':''}">${st.q[q.id]?'✓':'○'} ${esc(q.text)}</li>`).join('')}</ul><div class="qf"><small>${st.best?'Best '+st.best.toFixed(1)+'s · '+st.bestBones+' bones':lock?'Locked':'Not cleared yet'}</small>${lock?'':`<a class="btn sm" href="#/play/${i}">Play</a>`}</div></div>`}).join('')+
  `<div class="qcard soon"><div class="qh"><b>4</b><h3>Moon Kennel</h3><span>✦</span></div><ul><li>○ Coming soon — join the waitlist</li></ul></div>`}
$('#resetSave').onclick=()=>{if(confirm('Reset all island progress on this device?')){localStorage.removeItem(Prog.SKEY);renderQuests()}};

/* ---------- summon ---------- */
const KK='barki.kennel';const kennel=()=>{try{return JSON.parse(localStorage.getItem(KK))||[]}catch(e){return[]}};
function renderKennel(){$('#kennel').innerHTML=kennel().slice(-12).reverse().map(k=>{const p=Pups.traits(k.n);return `<button class="kp" data-n="${k.n}" style="--c:${p.color}" title="#${k.n} · ${p.tier}"><canvas width="72" height="72"></canvas></button>`}).join('')||'<span class="muted small">No pups yet.</span>';
  $$('#kennel .kp').forEach(b=>{const p=Pups.traits(+b.dataset.n);const cv=b.querySelector('canvas');Pups.draw(cv,p);b.onclick=()=>reveal(p,false)})}
function showTraits(p){$('#pupmeta').innerHTML=`<b>Pup #${p.n}</b><span style="color:${p.color}">${p.tier}</span>`;
  $('#traits').innerHTML=`<div class="tier" style="--c:${p.color}">${p.tier}</div>`+Object.entries(p.t).map(([k,v])=>`<div class="tr"><small>${k}</small><b>${esc(v)}</b></div>`).join('')}
function reveal(p,anim=true){const card=$('#card');Pups.draw($('#pup'),p);showTraits(p);card.style.setProperty('--c',p.color);if(!anim){card.classList.add('flip');return}}
let busy=false;
$('#summonBtn').onclick=async()=>{if(busy)return;busy=true;const n=1+Math.floor(Math.random()*CFG.SUMMON_SUPPLY);let tag='';
  if($('#signSummon').checked){try{await Wallet.signMessage(`${CFG.NAME} pup summon #${n}\nThis free signature only tags a demo pup to your address. It cannot move funds.`);tag=Wallet.addr}catch(e){alert('Signature skipped: '+(e.message||e))}}
  const p=Pups.traits(n);const card=$('#card'),portal=$('#portal');card.classList.remove('flip','pop');portal.classList.add('go');SFX_summon();$('#traits').innerHTML='<div class="muted">The portal is sniffing…</div>';
  setTimeout(()=>{Pups.draw($('#pup'),p);card.style.setProperty('--c',p.color);card.classList.add('flip','pop');portal.classList.remove('go');showTraits(p);
    const k=kennel();k.push({n,at:Date.now(),addr:tag||null});localStorage.setItem(KK,JSON.stringify(k.slice(-60)));renderKennel();busy=false},1500)};
function SFX_summon(){const a=Music.ctx();if(!a||Music.muted())return;[392,523,659,784,1047].forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+i*.22;o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.6);o.connect(g).connect(Music.sfxBus());o.start(t);o.stop(t+.7)})}
renderKennel();

/* ---------- waitlist ---------- */
const WK='barki.waitlist';
$('#wl').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const email=(f.get('email')||'').trim(),x=(f.get('x')||'').trim().replace(/^@?/,'@');const msg=$('#wlmsg');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){msg.className='msg err';msg.textContent='That email looks off — try again?';return}
  const entry={email,x:x==='@'?'':x,at:new Date().toISOString(),wallet:null,sig:null};
  if($('#signWl').checked){try{entry.sig=await Wallet.signMessage(`Join the ${CFG.NAME} waitlist\nEmail: ${email}\nFree signature. It cannot move funds or approve anything.`);entry.wallet=Wallet.addr}catch(err){msg.className='msg err';msg.textContent='Signature skipped — you can still join without it.';}}
  let remote=false;if(CFG.WAITLIST_ENDPOINT){try{const r=await fetch(CFG.WAITLIST_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(entry)});remote=r.ok}catch(_){}}
  const list=JSON.parse(localStorage.getItem(WK)||'[]');if(!list.some(l=>l.email===email))list.push(entry);localStorage.setItem(WK,JSON.stringify(list));
  msg.className='msg ok';msg.innerHTML=`🐾 You're on the boat, <b>${esc(email)}</b>${entry.wallet?' · wallet '+Wallet.short(entry.wallet)+' verified':''}. ${remote?'':'<small>(Saved on this device — the shared list goes live soon.)</small>'}`;e.target.reset();
  const t=$('#wl .btn');t.classList.add('pop');setTimeout(()=>t.classList.remove('pop'),600)};

/* ---------- wallet UI ---------- */
const wbtns=['#wallet','#wallet2'];
document.addEventListener('wallet',()=>{const a=Wallet.addr;wbtns.forEach(s=>{$(s).textContent=a?Wallet.short(a):'Connect wallet';$(s).classList.toggle('connected',!!a)});
  $('#wstatus').innerHTML=a?`Connected: <code>${Wallet.short(a)}</code><br>Network: <b>${Wallet.onRH()?'Robinhood Chain ✓':'chain '+parseInt(Wallet.chain,16)}</b>`:'Not connected.'});
wbtns.forEach(s=>$(s).onclick=async()=>{try{if(Wallet.addr){location.hash='#/connect';return}await Wallet.connect()}catch(e){alert(e.message||e)}});
$('#addChain').onclick=async()=>{try{await Wallet.addChain()}catch(e){alert(e.message||e)}};
Wallet.restore();

route();
})();
