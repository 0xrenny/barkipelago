/* Barkipelago — Canvas platformer engine. No libraries, all art drawn in code. */
(function(){
const T=32, H=17, VW=960, VH=544;
const GRAV=2300, JUMP=-800, RUN=310, ACC=2600, AIRACC=1700, FRIC=2400, COYOTE=.1, BUFFER=.13, MAXFALL=900;

/* ---------- level builder ---------- */
function Builder(w){
  const g=[...Array(H)].map(()=>Array(w).fill(' '));
  const L={w,g,bones:[],enemies:[],checks:[],springs:[],movers:[],key:null,goal:null,start:{x:2,y:13},hint:[]};
  const set=(x,y,c)=>{if(x>=0&&x<w&&y>=0&&y<H)g[y][x]=c};
  L.ground=(a,b,top=14)=>{for(let x=a;x<=b;x++)for(let y=top;y<H;y++)set(x,y,'#')};
  L.block=(x,y,bw,bh)=>{for(let i=0;i<bw;i++)for(let j=0;j<bh;j++)set(x+i,y+j,'#')};
  L.plat=(x,y,n)=>{for(let i=0;i<n;i++)set(x+i,y,'=')};
  L.spikes=(a,b,y)=>{for(let x=a;x<=b;x++)set(x,y,'^')};
  L.lava=(a,b)=>{for(let x=a;x<=b;x++){set(x,16,'~')}};
  L.bone=(x,y)=>L.bones.push({x:x*T+16,y:y*T+16,got:false});
  L.row=(x,y,n)=>{for(let i=0;i<n;i++)L.bone(x+i,y)};
  L.arc=(x,y,n)=>{for(let i=0;i<n;i++){const k=i/(n-1)*2-1;L.bones.push({x:x*T+16+i*T,y:(y-(1-k*k)*2.2)*T+16,got:false})}};
  L.enemy=(x,y,kind,range=3)=>L.enemies.push({kind,x:x*T,y:y*T,w:28,h:24,vx:-60,vy:0,alive:true,x0:x*T-range*T,x1:x*T+range*T,t:Math.random()*9,sq:0});
  L.check=(x,y)=>L.checks.push({x:x*T+16,y:y*T+32,on:false});
  L.spring=(x,y)=>L.springs.push({x:x*T,y:y*T+16,t:0});
  L.mover=(x,y,n,dx,dy,sp)=>L.movers.push({x:x*T,y:y*T,w:n*T,h:14,ox:x*T,oy:y*T,dx:dx*T,dy:dy*T,sp,ph:0,lx:x*T,ly:y*T});
  L.setKey=(x,y)=>L.key={x:x*T+16,y:y*T+16,got:false};
  L.setGoal=(x,y)=>L.goal={x:x*T,y:y*T};
  return L;
}

function level1(){ // Biscuit Beach
  const L=Builder(150);
  L.ground(0,24); L.row(5,13,7); L.plat(9,11,4); L.row(9,10,4); L.enemy(18,13,'crab');
  L.arc(24,12,5);
  L.ground(28,50); L.block(33,12,2,2); L.block(35,10,2,4); L.row(35,9,2); L.plat(39,9,4); L.row(39,8,4); L.enemy(44,13,'crab'); L.check(48,13);
  L.arc(50,12,5);
  L.ground(54,82); L.spikes(59,61,13); L.arc(58,12,5); L.enemy(66,13,'crab'); L.enemy(77,13,'crab');
  // secret climb to kennel key
  L.plat(69,11,3); L.plat(73,8,3); L.plat(77,5,3); L.row(73,7,3); L.setKey(78,3); L.bone(77,4); L.bone(79,4);
  L.ground(86,104); L.check(88,13); L.block(92,12,1,2); L.block(93,11,1,3); L.block(94,10,1,4); L.row(92,9,3);
  L.enemy(99,13,'crab'); L.row(97,12,6);
  L.arc(104,12,5);
  L.ground(108,150); L.plat(112,11,5); L.row(112,10,5); L.enemy(118,13,'crab'); L.enemy(126,13,'crab'); L.row(122,13,8);
  L.block(132,13,1,1);L.block(133,12,1,2); L.block(134,11,1,3); L.row(131,9,4);
  L.setGoal(142,14);
  return L;
}
function level2(){ // Fernwood Hollow
  const L=Builder(170);
  L.ground(0,20); L.row(4,13,6); L.enemy(14,13,'shroom');
  L.spring(20,13); L.ground(21,22,12); L.row(19,7,4);
  L.plat(26,10,4); L.row(26,9,4); L.ground(25,44); L.enemy(32,13,'shroom'); L.enemy(40,13,'shroom'); L.row(34,13,5);
  L.check(43,13);
  L.arc(44,12,5);
  // "pit" that hides a secret cave floor with the key
  L.ground(48,60); L.ground(64,82); L.ground(61,63,16);
  L.setKey(62,15); L.bone(61,15);L.bone(63,15);
  L.spring(52,13); L.plat(55,7,5); L.row(55,6,5);
  L.enemy(70,13,'shroom'); L.enemy(77,13,'shroom'); L.row(66,13,6); L.check(80,13);
  L.arc(82,12,5);
  L.ground(86,110); L.block(90,11,6,3); L.block(96,9,3,5); L.row(96,8,3); L.spring(100,13); L.row(100,6,1); L.row(101,5,3);
  L.enemy(104,13,'shroom'); L.enemy(108,13,'shroom'); L.check(109,13);
  L.plat(112,11,3); L.plat(117,10,3); L.plat(122,11,3); L.row(112,10,3); L.row(117,9,3); L.row(122,10,3);
  L.ground(127,170); L.enemy(133,13,'shroom'); L.enemy(141,13,'shroom'); L.enemy(148,13,'shroom'); L.row(130,13,10); L.row(144,11,6); L.plat(144,12,6);
  L.setGoal(160,14);
  return L;
}
function level3(){ // Ember Peaks
  const L=Builder(180); L.lava(0,179);
  L.ground(0,18); L.row(4,13,6); L.enemy(13,13,'ember');
  L.mover(20,12,3,6,0,.6); L.row(21,11,6);
  L.ground(31,48,13); L.enemy(37,12,'ember'); L.spikes(41,42,12); L.arc(40,11,4); L.check(46,12);
  L.mover(50,11,2,0,-4,.7); L.plat(53,6,4); L.row(53,5,4);
  L.ground(58,75,12); L.enemy(63,11,'ember'); L.enemy(70,11,'ember'); L.row(62,11,8);
  // secret: high ledge key reached by springs
  L.spring(74,11); L.plat(70,4,3); L.setKey(71,3); L.bone(70,3); L.bone(72,3);
  L.check(74,12);
  L.mover(77,11,3,7,0,.5); L.row(78,10,7);
  L.ground(88,104,13); L.block(92,11,2,2); L.block(97,9,2,4); L.row(97,8,2); L.enemy(101,12,'ember'); L.spikes(94,95,12);
  L.mover(106,12,2,0,-5,.6); L.mover(110,7,2,6,0,.55); L.row(110,6,8);
  L.ground(120,140,13); L.check(122,12); L.enemy(127,12,'ember'); L.enemy(134,12,'ember'); L.row(126,12,10);
  L.mover(142,12,3,6,0,.7); L.row(143,11,6);
  L.ground(152,180,13); L.enemy(158,12,'ember'); L.row(156,12,8); L.setGoal(170,13);
  return L;
}

const LEVELS=[
 {id:'beach',name:'Biscuit Beach',theme:'beach',build:level1,
  quests:[{id:'bones',text:'Collect 40 bones',n:40},{id:'key',text:'Find the hidden kennel key'},{id:'time',text:'Reach the kennel in under 60s',n:60}]},
 {id:'woods',name:'Fernwood Hollow',theme:'woods',build:level2,
  quests:[{id:'bones',text:'Collect 50 bones',n:50},{id:'key',text:'Find the kennel key (trust the pit)'},{id:'stomp',text:'Bonk 6 mushrooms',n:6}]},
 {id:'peaks',name:'Ember Peaks',theme:'peaks',build:level3,
  quests:[{id:'bones',text:'Collect 55 bones',n:55},{id:'key',text:'Find the kennel key high above the lava'},{id:'nohit',text:'Finish without getting hurt'}]},
];

/* ---------- save ---------- */
const SKEY='barki.save.v1';
function loadSave(){try{return JSON.parse(localStorage.getItem(SKEY))||{}}catch(e){return{}}}
function save(s){localStorage.setItem(SKEY,JSON.stringify(s))}
function progress(){const s=loadSave();s.levels=s.levels||{};return s}
function levelState(i){const s=progress();return s.levels[LEVELS[i].id]||{done:false,q:{},best:null,bestBones:0}}
function unlocked(i){return i===0||levelState(i-1).done||new URLSearchParams(location.search).has('unlockall')}

/* ---------- art helpers ---------- */
const THEMES={
 beach:{sky:['#7ed4f7','#c9f0ff','#ffe9c7'],far:'#9cd9e8',mid:'#5fbf9a',top:'#7fdc6a',topD:'#4fae4a',dirt:'#e9b97a',dirtD:'#c98f52',plat:'#d9a066',enemy:'#ff6b5a'},
 woods:{sky:['#284d4a','#4f8f74','#cfe7b0'],far:'#2f6b5a',mid:'#24533f',top:'#9be36b',topD:'#5aa43e',dirt:'#7a5a3e',dirtD:'#5a3f2a',plat:'#a0784e',enemy:'#d94f6b'},
 peaks:{sky:['#2a1638','#7a2f4f','#ff9d5c'],far:'#5a2a4a',mid:'#3a1a30',top:'#ffb35c',topD:'#d9733a',dirt:'#4a3040',dirtD:'#33202c',plat:'#8a5a6a',enemy:'#ffcf4a'}
};
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h)}
function drawBone(c,x,y,s=1,rot=0){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.fillStyle='#fff8ea';c.strokeStyle='#c99a5b';c.lineWidth=2;
  c.beginPath();c.rect(-7,-3,14,6);c.arc(-8,-3,4,0,7);c.arc(-8,3,4,0,7);c.arc(8,-3,4,0,7);c.arc(8,3,4,0,7);c.fill();
  c.beginPath();c.moveTo(-6,-3);c.lineTo(6,-3);c.moveTo(-6,3);c.lineTo(6,3);c.stroke();c.restore()}
function drawCorgi(c,x,y,face,t,st){ // x,y = feet center
  c.save();c.translate(x,y);c.scale(face,1);
  const run=st.run, sq=st.sq||0; c.scale(1+sq*.18,1-sq*.18);
  const bob=run?Math.abs(Math.sin(t*18))*-2:Math.sin(t*3)*-.6;
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,0,18,4,0,0,7);c.fill();
  // legs
  c.fillStyle='#b85a1b';const lp=run?Math.sin(t*18)*4:0;const air=st.air;
  [[-12,lp],[-6,-lp],[8,-lp],[13,lp]].forEach(([lx,o])=>{rr(c,lx-2.5+(air?o*.5:o*.4),-9,5,9-(air?3:0),2);c.fill()});
  c.translate(0,bob);
  // tail
  c.save();c.translate(-19,-16);c.rotate(Math.sin(t*(run?22:10))*.5);c.fillStyle='#e8893a';c.beginPath();c.ellipse(-3,-2,6,4,-.5,0,7);c.fill();c.restore();
  // body
  c.fillStyle='#e8893a';c.strokeStyle='#b85a1b';c.lineWidth=2;c.beginPath();c.ellipse(-2,-15,19,10,0,0,7);c.fill();c.stroke();
  c.fillStyle='#fff6ea';c.beginPath();c.ellipse(4,-11,11,5.5,0,0,7);c.fill();
  // head
  c.translate(15,-24);c.fillStyle='#e8893a';c.beginPath();c.ellipse(0,0,10,9,0,0,7);c.fill();c.stroke();
  // ears
  c.beginPath();c.moveTo(-7,-5);c.lineTo(-9,-17);c.lineTo(-1,-8);c.closePath();c.fill();c.stroke();
  c.beginPath();c.moveTo(1,-8);c.lineTo(5,-19);c.lineTo(8,-5);c.closePath();c.fill();c.stroke();
  c.fillStyle='#f7c9a8';c.beginPath();c.moveTo(3,-8);c.lineTo(5,-15);c.lineTo(6.5,-7);c.fill();
  c.fillStyle='#fff6ea';c.beginPath();c.ellipse(5,3,7,5,0,0,7);c.fill();
  c.fillStyle='#2b1d14';c.beginPath();c.ellipse(11,1,3,2.4,0,0,7);c.fill();
  if(st.hurt){c.strokeStyle='#2b1d14';c.lineWidth=1.6;c.beginPath();c.moveTo(1,-4);c.lineTo(5,0);c.moveTo(5,-4);c.lineTo(1,0);c.stroke()}
  else{c.beginPath();c.arc(3,-2,2.3,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(3.8,-2.8,.8,0,7);c.fill()}
  c.fillStyle='#f4a3a0';c.globalAlpha=.6;c.beginPath();c.ellipse(-1,4,2.6,1.6,0,0,7);c.fill();c.globalAlpha=1;
  if(run||st.air){c.fillStyle='#f07c8a';c.beginPath();c.ellipse(7,8,2.4,3.2,0,0,7);c.fill()}
  c.restore()}
function drawEnemy(c,e,th,t){c.save();c.translate(e.x+e.w/2,e.y+e.h);const s=e.alive?1:Math.max(0,1-e.sq);c.scale(1+(1-s)*.6,s||.01);
  const w=Math.sin(t*10+e.t)*2;
  if(e.kind==='crab'){c.fillStyle='#ff6b5a';c.strokeStyle='#b8392e';c.lineWidth=2;c.beginPath();c.ellipse(0,-10,14,9,0,0,7);c.fill();c.stroke();
    c.beginPath();c.arc(-15,-14+w,5,0,7);c.arc(15,-14-w,5,0,7);c.fill();
    c.fillStyle='#fff';[-5,5].forEach(ex=>{c.beginPath();c.arc(ex,-19,4,0,7);c.fill()});c.fillStyle='#222';[-5,5].forEach(ex=>{c.beginPath();c.arc(ex+(e.vx>0?1:-1),-19,2,0,7);c.fill()});}
  else if(e.kind==='shroom'){c.fillStyle='#f4e6cf';rr(c,-8,-12,16,12,4);c.fill();c.fillStyle='#d94f6b';c.beginPath();c.ellipse(0,-13,16,10,0,Math.PI,0);c.fill();
    c.fillStyle='#fff';[[-7,-17],[4,-19],[9,-14]].forEach(([a,b])=>{c.beginPath();c.arc(a,b,2.6,0,7);c.fill()});c.fillStyle='#2b1d14';[-3,3].forEach(ex=>{c.beginPath();c.arc(ex,-6,1.8,0,7);c.fill()});
    c.fillRect(-6+w,-1,4,2);c.fillRect(2-w,-1,4,2)}
  else{const g=c.createRadialGradient(0,-12,2,0,-12,16);g.addColorStop(0,'#fff3a0');g.addColorStop(.5,'#ffb03a');g.addColorStop(1,'#e2462a');c.fillStyle=g;
    c.beginPath();c.moveTo(-14,0);c.quadraticCurveTo(-16,-18,0,-24-w);c.quadraticCurveTo(16,-18,14,0);c.closePath();c.fill();
    c.fillStyle='#3a1a10';[-5,5].forEach(ex=>{c.beginPath();c.arc(ex,-10,2.2,0,7);c.fill()})}
  c.restore()}

/* ---------- audio (sfx) ---------- */
const SFX={ctx:null,
  get(){if(!window.Music)return null;return Music.ctx()},
  tone(f,d,type='square',v=.08,slide=0,delay=0){const a=this.get();if(!a||Music.muted())return;const t=a.currentTime+delay;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),t+d);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(Music.sfxBus());o.start(t);o.stop(t+d+.02)},
  jump(){this.tone(380,.16,'square',.05,420)},bone(){this.tone(988,.08,'triangle',.08);this.tone(1318,.12,'triangle',.07,0,.06)},
  stomp(){this.tone(220,.15,'square',.08,-150)},hurt(){this.tone(300,.35,'sawtooth',.06,-220)},spring(){this.tone(260,.3,'triangle',.1,700)},
  check(){[523,659,784].forEach((f,i)=>this.tone(f,.18,'triangle',.08,0,i*.08))},key(){[784,988,1175,1568].forEach((f,i)=>this.tone(f,.2,'triangle',.08,0,i*.07))},
  win(){[523,659,784,1047,784,1047].forEach((f,i)=>this.tone(f,.25,'triangle',.09,0,i*.11))}};

/* ---------- input ---------- */
const keys={};const pressed={};
addEventListener('keydown',e=>{if(!Game.active)return;const k=e.code;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault();if(!keys[k])pressed[k]=true;keys[k]=true;if(k==='KeyP'||k==='Escape')Game.togglePause();if(k==='KeyR'&&Game.st)Game.restart()});
addEventListener('keyup',e=>{keys[e.code]=false});
const inp={left:()=>keys.ArrowLeft||keys.KeyA||touch.l,right:()=>keys.ArrowRight||keys.KeyD||touch.r,jump:()=>keys.Space||keys.ArrowUp||keys.KeyW||keys.KeyZ||touch.j,
  jumpPressed:()=>{const p=pressed.Space||pressed.ArrowUp||pressed.KeyW||pressed.KeyZ||touch.jp;return p}};
const touch={l:false,r:false,j:false,jp:false};

/* ---------- game ---------- */
const Game={active:false,st:null,paused:false,
 init(canvas,hud){this.cv=canvas;this.c=canvas.getContext('2d');this.hud=hud;this.resize();addEventListener('resize',()=>this.resize());
   const bind=(el,k)=>{const on=e=>{e.preventDefault();touch[k]=true;if(k==='j')touch.jp=true};const off=e=>{e.preventDefault();touch[k]=false};
     el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off)};
   document.querySelectorAll('[data-touch]').forEach(el=>bind(el,el.dataset.touch));
   let last=performance.now();const loop=now=>{const dt=Math.min(.033,(now-last)/1000);last=now;if(this.active&&this.st&&!this.paused){this.update(dt)}if(this.active&&this.st)this.draw();requestAnimationFrame(loop)};requestAnimationFrame(loop)},
 resize(){const d=Math.min(2,devicePixelRatio||1);this.cv.width=VW*d;this.cv.height=VH*d;this.dpr=d},
 start(i){const def=LEVELS[i];const L=def.build();this.idx=i;this.def=def;this.L=L;
   this.st={t:0,bones:0,total:L.bones.length,stomps:0,hurt:0,hearts:3,key:false,done:false,
     p:{x:L.start.x*T,y:L.start.y*T,w:26,h:26,vx:0,vy:0,on:false,face:1,co:0,buf:0,inv:0,sq:0,dead:0},
     cp:{x:L.start.x*T,y:L.start.y*T},cam:0,parts:[],shake:0,msg:null};
   this.paused=false;this.active=true;this.emitHud();this.toast(def.name,'Go, Corgi! '+def.quests.map(q=>q.text).join(' · '))},
 restart(){this.start(this.idx)},
 stop(){this.active=false},
 togglePause(){if(!this.st||this.st.done)return;this.paused=!this.paused;this.hud&&this.hud({pause:this.paused})},
 toast(title,sub){this.hud&&this.hud({toast:{title,sub}})},
 solid(tx,ty){if(tx<0||tx>=this.L.w)return '#';if(ty<0)return ' ';if(ty>=H)return ' ';return this.L.g[ty][tx]},
 hurtPlayer(){const s=this.st,p=s.p;if(p.inv>0||p.dead>0)return;s.hurt++;s.hearts--;SFX.hurt();s.shake=.3;
   if(s.hearts<=0){this.toast('Bonked!','Out of hearts — restarting the island.');setTimeout(()=>this.st&&this.st.hearts<=0&&this.restart(),900);p.dead=1;return}
   p.dead=.7;this.emitHud()},
 respawn(){const s=this.st,p=s.p;p.x=s.cp.x;p.y=s.cp.y;p.vx=p.vy=0;p.inv=1.5;p.dead=0},
 burst(x,y,col,n=8,sp=160){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=sp*(.4+Math.random()*.8);this.st.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-60,l:.6,c:col,r:2+Math.random()*3})}},
 update(dt){const s=this.st,L=this.L,p=s.p;s.t+=s.done?0:dt;
   const jpNow=inp.jumpPressed();for(const k in pressed)delete pressed[k];
   // movers first
   for(const m of L.movers){m.ph+=dt*m.sp;const k=(1-Math.cos(m.ph))/2;m.lx=m.x;m.ly=m.y;m.x=m.ox+m.dx*k;m.y=m.oy+m.dy*k}
   if(p.dead>0){p.dead-=dt;if(p.dead<=0&&s.hearts>0)this.respawn();this.parts(dt);this.emitHudThrottled();return}
   if(s.done){p.vx*=.9;this.parts(dt);return}
   const l=inp.left(),r=inp.right();const dir=(r?1:0)-(l?1:0);
   const acc=p.on?ACC:AIRACC;
   if(dir){p.vx+=dir*acc*dt;p.face=dir;}else if(p.on){const f=FRIC*dt;p.vx=Math.abs(p.vx)<f?0:p.vx-Math.sign(p.vx)*f}
   p.vx=Math.max(-RUN,Math.min(RUN,p.vx));
   p.co=p.on?COYOTE:p.co-dt; p.buf=jpNow?BUFFER:p.buf-dt; this._jp=false; touch.jp=false;
   if(p.buf>0&&p.co>0){p.vy=JUMP;p.co=0;p.buf=0;p.on=false;p.sq=-.6;SFX.jump();this.burst(p.x+13,p.y+26,'#fff',5,80)}
   if(p.vy>=0)p.boost=false;if(!p.boost&&!inp.jump()&&p.vy<-280)p.vy=-280; // variable height
   p.vy=Math.min(MAXFALL,p.vy+GRAV*dt);
   // ride mover
   if(p.ride){p.x+=p.ride.x-p.ride.lx;p.y+=p.ride.y-p.ride.ly}
   // move x
   p.x+=p.vx*dt;this.collide(p,'x');
   const wasOn=p.on;p.on=false;p.ride=null;const prevBottom=p.y+p.h;p.y+=p.vy*dt;this.collide(p,'y',prevBottom);
   for(const m of L.movers){if(p.vy>=0&&p.x+p.w>m.x+2&&p.x<m.x+m.w-2&&prevBottom<=m.ly+6&&p.y+p.h>=m.y){p.y=m.y-p.h;p.vy=0;p.on=true;p.ride=m}}
   if(p.on&&!wasOn){p.sq=.5;this.burst(p.x+13,p.y+26,'rgba(255,255,255,.8)',4,60)}
   p.sq*=Math.pow(.0005,dt);p.inv-=dt;
   // hazards
   const cx0=Math.floor((p.x+4)/T),cx1=Math.floor((p.x+p.w-4)/T),cy=Math.floor((p.y+p.h-2)/T);
   for(let x=cx0;x<=cx1;x++){const c=this.solid(x,cy);if(c==='^'&&(p.y+p.h)>cy*T+14)this.hurtPlayer()}
   if(p.y>H*T-10){p.inv=0;this.hurtPlayer();p.vy=0;p.y=H*T-12}
   // springs
   for(const sp of L.springs){sp.t-=dt;if(p.vy>0&&p.x+p.w>sp.x+4&&p.x<sp.x+T-4&&p.y+p.h>=sp.y&&p.y+p.h<=sp.y+20){p.vy=-1180;p.boost=true;p.sq=-.8;sp.t=.3;SFX.spring();p.on=false}}
   // bones
   for(const b of L.bones){if(!b.got&&Math.abs(b.x-(p.x+13))<22&&Math.abs(b.y-(p.y+13))<24){b.got=true;s.bones++;SFX.bone();this.burst(b.x,b.y,'#ffe7a3',6,120);this.emitHud()}}
   if(L.key&&!L.key.got&&Math.abs(L.key.x-(p.x+13))<24&&Math.abs(L.key.y-(p.y+13))<26){L.key.got=true;s.key=true;SFX.key();this.burst(L.key.x,L.key.y,'#ffd34d',18,220);this.toast('Kennel key found!','Secret quest complete 🔑');this.emitHud()}
   for(const c of L.checks){if(!c.on&&Math.abs(c.x-(p.x+13))<28&&p.y+p.h>c.y-70&&p.y<c.y){c.on=true;s.cp={x:c.x-13,y:c.y-40};SFX.check();this.burst(c.x,c.y-40,'#9be36b',12,160);this.toast('Checkpoint','Corgi marked this spot 🐾')}}
   // enemies
   for(const e of L.enemies){e.t+=dt;if(!e.alive){e.sq+=dt*3;continue}
     if(e.kind==='ember'){e.vy+=GRAV*.6*dt;e.y+=e.vy*dt;const gy=this.groundBelow(e);if(e.y+e.h>=gy){e.y=gy-e.h;e.vy=Math.sin(e.t)>.6?-520:0}}
     else{const gy=this.groundBelow(e);e.y=gy-e.h}
     e.x+=e.vx*dt;if(e.x<e.x0||e.x>e.x1||this.wallAhead(e))e.vx*=-1,e.x+=e.vx*dt*2;
     if(p.x+p.w>e.x+3&&p.x<e.x+e.w-3&&p.y+p.h>e.y+4&&p.y<e.y+e.h){
       if(p.vy>60&&p.y+p.h-e.y<18){e.alive=false;s.stomps++;p.vy=-520;SFX.stomp();this.burst(e.x+14,e.y+12,THEMES[this.def.theme].enemy,10,180);s.shake=.12;this.emitHud()}
       else this.hurtPlayer()}}
   // goal
   const G=L.goal;if(G&&p.x+p.w>G.x&&p.x<G.x+64&&p.y+p.h>G.y*1-90){this.finish()}
   this.parts(dt);
   s.cam+=((p.x-VW*.4)-s.cam)*Math.min(1,dt*6);s.cam=Math.max(0,Math.min(L.w*T-VW,s.cam));s.shake=Math.max(0,s.shake-dt);
   this.emitHudThrottled()},
 parts(dt){const s=this.st;s.parts=s.parts.filter(q=>(q.l-=dt)>0);s.parts.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=500*dt})},
 groundBelow(e){const tx=Math.floor((e.x+e.w/2)/T);for(let y=Math.floor(e.y/T);y<H;y++){const c=this.solid(tx,y);if(c==='#'||c==='=')return y*T}return H*T+100},
 wallAhead(e){const fx=e.vx>0?e.x+e.w+2:e.x-2;const tx=Math.floor(fx/T),ty=Math.floor((e.y+e.h-4)/T);const c=this.solid(tx,ty);if(c==='#')return true;
   if(e.kind!=='ember'){const below=this.solid(tx,ty+1);if(below!=='#'&&below!=='=')return true}return false},
 collide(p,ax,prevBottom){const x0=Math.floor(p.x/T),x1=Math.floor((p.x+p.w-1)/T),y0=Math.floor(p.y/T),y1=Math.floor((p.y+p.h-1)/T);
   for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const c=this.solid(tx,ty);
     if(c==='#'){if(ax==='x'){if(p.vx>0)p.x=tx*T-p.w;else if(p.vx<0)p.x=tx*T+T;p.vx=0}else{if(p.vy>0){p.y=ty*T-p.h;p.on=true}else if(p.vy<0)p.y=ty*T+T;p.vy=0}return this.collide(p,ax,prevBottom)}
     if(c==='='&&ax==='y'&&p.vy>=0&&prevBottom<=ty*T+1){p.y=ty*T-p.h;p.vy=0;p.on=true}}},
 finish(){const s=this.st;if(s.done)return;s.done=true;SFX.win();const def=this.def;const res={};
   def.quests.forEach(q=>{res[q.id]= q.id==='bones'?s.bones>=q.n: q.id==='key'?s.key: q.id==='time'?s.t<=q.n: q.id==='stomp'?s.stomps>=q.n: q.id==='nohit'?s.hurt===0:false});
   const sv=progress();const prev=sv.levels[def.id]||{q:{}};const q={...prev.q};Object.keys(res).forEach(k=>{if(res[k])q[k]=true});
   sv.levels[def.id]={done:true,q,best:prev.best?Math.min(prev.best,s.t):s.t,bestBones:Math.max(prev.bestBones||0,s.bones)};save(sv);
   for(let i=0;i<40;i++)setTimeout(()=>this.st&&this.burst(this.L.goal.x+32,this.L.goal.y*1-60,['#ffd34d','#ff7aa8','#7fdc6a','#7ed4f7'][i%4],4,260),i*25);
   this.hud&&this.hud({finish:{res,time:s.t,bones:s.bones,total:s.total,stomps:s.stomps,def,idx:this.idx}})},
 _h:0,emitHudThrottled(){const n=performance.now();if(n-this._h>120){this._h=n;this.emitHud()}},
 emitHud(){const s=this.st;this.hud&&this.hud({stats:{bones:s.bones,total:s.total,hearts:s.hearts,key:s.key,t:s.t,stomps:s.stomps,name:this.def.name,quests:this.def.quests,hurt:s.hurt}})},
 /* ----- render ----- */
 draw(){const c=this.c,s=this.st,L=this.L,th=THEMES[this.def.theme],now=performance.now()/1000;c.setTransform(this.dpr,0,0,this.dpr,0,0);
   const cam=s.cam+(s.shake>0?(Math.random()-.5)*10*s.shake/.3:0);
   const g=c.createLinearGradient(0,0,0,VH);g.addColorStop(0,th.sky[0]);g.addColorStop(.6,th.sky[1]);g.addColorStop(1,th.sky[2]);c.fillStyle=g;c.fillRect(0,0,VW,VH);
   this.bg(c,cam,th,now);
   c.save();c.translate(-Math.round(cam),0);
   const x0=Math.max(0,Math.floor(cam/T)-1),x1=Math.min(L.w-1,Math.ceil((cam+VW)/T)+1);
   for(let y=0;y<H;y++)for(let x=x0;x<=x1;x++){const t=L.g[y][x];if(t===' ')continue;const px=x*T,py=y*T;
     if(t==='#'){const top=y===0||L.g[y-1][x]!=='#';c.fillStyle=(x+y)%2?th.dirt:th.dirtD;c.fillRect(px,py,T,T);c.fillStyle='rgba(0,0,0,.08)';c.fillRect(px+((x*7+y*3)%20),py+((x*5+y*11)%22),5,4);
       if(top){c.fillStyle=th.topD;rr(c,px-1,py-2,T+2,13,5);c.fill();c.fillStyle=th.top;rr(c,px-1,py-4,T+2,10,5);c.fill();
         if(this.def.theme!=='peaks'&&(x*13)%5===0){c.fillStyle=th.top;c.beginPath();c.moveTo(px+8,py-4);c.lineTo(px+11,py-11);c.lineTo(px+14,py-4);c.fill()}}}
     else if(t==='='){c.fillStyle=th.plat;rr(c,px,py,T,14,4);c.fill();c.fillStyle='rgba(255,255,255,.25)';c.fillRect(px+3,py+2,T-6,3);c.fillStyle='rgba(0,0,0,.15)';c.fillRect(px+T-2,py+2,2,10)}
     else if(t==='^'){c.fillStyle='#cfd6e6';c.strokeStyle='#7a8399';for(let i=0;i<3;i++){c.beginPath();c.moveTo(px+i*11,py+T);c.lineTo(px+i*11+5.5,py+12);c.lineTo(px+i*11+11,py+T);c.closePath();c.fill();c.stroke()}}
     else if(t==='~'){const w=Math.sin(now*3+x)*3;const lg=c.createLinearGradient(0,py-6,0,py+T);lg.addColorStop(0,'#ffe08a');lg.addColorStop(.3,'#ff7a2a');lg.addColorStop(1,'#b8201a');c.fillStyle=lg;c.fillRect(px,py-6+w,T,T+8)}}
   // movers
   for(const m of L.movers){c.fillStyle=th.plat;rr(c,m.x,m.y,m.w,m.h,6);c.fill();c.fillStyle='rgba(255,255,255,.3)';c.fillRect(m.x+4,m.y+3,m.w-8,3);c.fillStyle='#ffd34d';for(let i=8;i<m.w;i+=24){c.beginPath();c.arc(m.x+i,m.y+10,2,0,7);c.fill()}}
   // springs
   for(const sp of L.springs){const k=sp.t>0?6:0;c.fillStyle='#555';c.fillRect(sp.x+8,sp.y+6+k,16,10-k);c.fillStyle='#ff5aa0';rr(c,sp.x+3,sp.y+k,26,8,4);c.fill();c.fillStyle='#fff';c.fillRect(sp.x+8,sp.y+2+k,8,2)}
   // checkpoints
   for(const ck of L.checks){c.fillStyle='#6b4a2e';c.fillRect(ck.x-2,ck.y-60,4,60);c.fillStyle=ck.on?'#7fdc6a':'#b9b9b9';c.beginPath();const fl=Math.sin(now*6)*3;c.moveTo(ck.x+2,ck.y-60);c.quadraticCurveTo(ck.x+18,ck.y-56+fl,ck.x+30,ck.y-50);c.lineTo(ck.x+2,ck.y-40);c.fill();
     c.fillStyle='#fff';c.font='11px sans-serif';c.fillText('🐾',ck.x+6,ck.y-46)}
   // goal kennel
   const G=L.goal;if(G){const gx=G.x,gy=G.y*1;c.fillStyle='#b5562a';rr(c,gx,gy-64,64,64,4);c.fill();c.fillStyle='#e8893a';c.beginPath();c.moveTo(gx-8,gy-60);c.lineTo(gx+32,gy-96);c.lineTo(gx+72,gy-60);c.closePath();c.fill();
     c.fillStyle='#2b1d14';c.beginPath();c.arc(gx+32,gy-24,16,Math.PI,0);c.rect(gx+16,gy-24,32,24);c.fill();c.fillStyle='#fff';c.font='bold 11px Fredoka, sans-serif';c.textAlign='center';c.fillText('HOME',gx+32,gy-50);c.textAlign='left';
     c.fillStyle='#ffd34d';c.fillRect(gx+31,gy-130,3,36);c.beginPath();c.moveTo(gx+34,gy-130);c.lineTo(gx+56,gy-122+Math.sin(now*5)*2);c.lineTo(gx+34,gy-114);c.fill()}
   // bones
   L.bones.forEach((b,i)=>{if(!b.got)drawBone(c,b.x,b.y+Math.sin(now*3+i*.6)*3,1,Math.sin(now*2+i)*.2)});
   if(L.key&&!L.key.got){const k=L.key,y=k.y+Math.sin(now*3)*4;c.save();c.translate(k.x,y);c.shadowColor='#ffd34d';c.shadowBlur=18;c.fillStyle='#ffd34d';c.strokeStyle='#b88a1a';c.lineWidth=2;
     c.beginPath();c.arc(-6,0,7,0,7);c.fill();c.stroke();c.fillRect(0,-2.5,14,5);c.fillRect(9,2,3,5);c.fillRect(13,2,2,4);c.shadowBlur=0;c.fillStyle='#b88a1a';c.beginPath();c.arc(-6,0,2.5,0,7);c.fill();c.restore()}
   L.enemies.forEach(e=>{if(e.alive||e.sq<1)drawEnemy(c,e,th,now)});
   // player
   const p=s.p;if(!(p.inv>0&&Math.floor(now*20)%2)&&!(p.dead>0&&s.hearts>0&&p.dead<.35))drawCorgi(c,p.x+13,p.y+p.h,p.face,now,{run:p.on&&Math.abs(p.vx)>30,air:!p.on,sq:p.sq,hurt:p.dead>0});
   s.parts.forEach(q=>{c.globalAlpha=Math.min(1,q.l*2);c.fillStyle=q.c;c.beginPath();c.arc(q.x,q.y,q.r,0,7);c.fill()});c.globalAlpha=1;
   c.restore();
   // vignette
   const v=c.createRadialGradient(VW/2,VH/2,VH*.4,VW/2,VH/2,VH*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.25)');c.fillStyle=v;c.fillRect(0,0,VW,VH)},
 bg(c,cam,th,now){const t=this.def.theme;
   if(t==='peaks'){c.fillStyle='rgba(255,220,180,.8)';c.beginPath();c.arc(720-cam*.02,140,60,0,7);c.fill()}else{c.fillStyle=t==='woods'?'rgba(255,250,220,.55)':'#fff6c9';c.beginPath();c.arc(760-cam*.02,110,46,0,7);c.fill()}
   // clouds
   c.fillStyle=t==='peaks'?'rgba(255,180,160,.25)':'rgba(255,255,255,.75)';for(let i=0;i<7;i++){const x=((i*260-cam*.1+now*8)%(VW+300)+VW+300)%(VW+300)-150,y=60+(i*53)%140;c.beginPath();c.ellipse(x,y,50,16,0,0,7);c.ellipse(x+30,y-10,34,16,0,0,7);c.ellipse(x-30,y-4,30,12,0,0,7);c.fill()}
   const layer=(col,sp,base,amp,f)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,VH);for(let x=0;x<=VW;x+=16){const wx=x+cam*sp;c.lineTo(x,base-Math.abs(Math.sin(wx*f))*amp-Math.sin(wx*f*2.3)*amp*.3)}c.lineTo(VW,VH);c.fill()};
   if(t==='peaks'){layer(th.far,.15,380,170,.004);layer(th.mid,.3,440,110,.007)}
   else if(t==='woods'){layer(th.far,.15,360,60,.01);c.fillStyle=th.mid;for(let i=0;i<24;i++){const x=((i*70-cam*.35)%(VW+140)+VW+140)%(VW+140)-70;c.beginPath();c.moveTo(x,440);c.lineTo(x+30,210+(i*37)%90);c.lineTo(x+60,440);c.fill()}}
   else{layer('#5fc4e0',.1,400,14,.02);c.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<20;i++){const x=((i*90-cam*.1+now*20)%VW+VW)%VW;c.fillRect(x,392+(i%4)*12,18,2)}
     c.fillStyle='#4aa37a';for(let i=0;i<6;i++){const x=((i*330-cam*.25)%(VW+300)+VW+300)%(VW+300)-150;c.fillStyle='#8a6a4a';c.fillRect(x,300,6,120);c.fillStyle='#4aa37a';for(let k=0;k<5;k++){c.beginPath();c.ellipse(x+3+Math.cos(k*1.3)*24,300+Math.sin(k*1.3)*6,28,7,k*1.3,0,7);c.fill()}}}
 }
};
window.Game=Game;window.LEVELS=LEVELS;window.Prog={progress,levelState,unlocked,save,SKEY};window.drawCorgi=drawCorgi;window.drawBone=drawBone;
})();
