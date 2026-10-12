/* Deterministic corgi pup generator (front-end demo, no NFTs). */
(function(){
const T={
 Island:[['Biscuit Beach',30],['Fernwood Hollow',28],['Ember Peaks',22],['Moon Kennel',14],['Rainbow Reef',6]],
 Coat:[['Classic Red',40],['Sable',22],['Tricolor',18],['Cream',12],['Blue Merle',6],['Golden',2]],
 Hat:[['None',34],['Beanie',18],['Pirate Bandana',14],['Party Cone',12],['Sailor Cap',10],['Crown',4],['Halo',2]],
 Eyes:[['Happy',36],['Sleepy',22],['Wink',18],['Shades',14],['Star',7],['Laser',3]],
 Gear:[['None',38],['Red Collar',22],['Scarf',16],['Bone Pendant',12],['Bow Tie',8],['Jetpack',4]]};
const BG={'Biscuit Beach':['#7ed4f7','#ffe9c7'],'Fernwood Hollow':['#2f6b5a','#cfe7b0'],'Ember Peaks':['#7a2f4f','#ff9d5c'],'Moon Kennel':['#0b1030','#5a5aa8'],'Rainbow Reef':['#ff7aa8','#7ed4f7']};
const COAT={'Classic Red':['#e8893a','#b85a1b'],'Sable':['#a8642c','#5a3214'],'Tricolor':['#2b1d14','#120a06'],'Cream':['#f2d9a8','#c9a46a'],'Blue Merle':['#8a9ab0','#4a5468'],'Golden':['#ffd34d','#c99a1a']};
const TIERS=[['Legendary',.02,'#ffd34d'],['Epic',.06,'#b27bff'],['Rare',.12,'#58a9ff'],['Uncommon',.2,'#6fd17d'],['Common',1,'#a7b0c0']];
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%1e6)/1e6}}
function traits(n){const r=rng(n*2654435761);const out={};let score=0;
  for(const k in T){const tot=T[k].reduce((a,b)=>a+b[1],0);let x=r()*tot;for(const [v,w] of T[k]){if((x-=w)<0){out[k]=v;score+=-Math.log(w/tot);break}}}
  const tier=score>9.5?'Legendary':score>8?'Epic':score>6.8?'Rare':score>5.6?'Uncommon':'Common';
  return {n,t:out,score,tier,color:TIERS.find(x=>x[0]===tier)[2]}}
function draw(cv,p){const c=cv.getContext('2d'),W=cv.width;c.setTransform(1,0,0,1,0,0);const b=BG[p.t.Island];const g=c.createLinearGradient(0,0,0,W);g.addColorStop(0,b[0]);g.addColorStop(1,b[1]);c.fillStyle=g;c.fillRect(0,0,W,W);
  c.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<14;i++){c.beginPath();c.arc((i*73+p.n*7)%W,(i*131+p.n*3)%W,4+i%5*3,0,7);c.fill()}
  if(p.t.Island==='Moon Kennel'){c.fillStyle='#fff6c9';c.beginPath();c.arc(W*.78,W*.2,28,0,7);c.fill()}
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(W/2,W*.9,W*.32,14,0,0,7);c.fill();
  const [col,dk]=COAT[p.t.Coat];const s=W/200;c.save();c.scale(s,s);
  if(p.t.Gear==='Jetpack'){c.fillStyle='#8a9ab0';c.fillRect(30,110,24,50);c.fillStyle='#ffb03a';c.beginPath();c.moveTo(32,160);c.lineTo(42,185);c.lineTo(52,160);c.fill()}
  // ears
  c.fillStyle=col;c.strokeStyle=dk;c.lineWidth=3;c.lineJoin='round';
  c.beginPath();c.moveTo(52,104);c.bezierCurveTo(38,74,28,42,36,22);c.bezierCurveTo(40,12,50,12,57,18);c.bezierCurveTo(74,32,92,48,106,66);c.closePath();c.fill();c.stroke();
  c.beginPath();c.moveTo(148,104);c.bezierCurveTo(162,74,172,42,164,22);c.bezierCurveTo(160,12,150,12,143,18);c.bezierCurveTo(126,32,108,48,94,66);c.closePath();c.fill();c.stroke();
  c.fillStyle='#f7c9a8';c.beginPath();c.moveTo(58,88);c.bezierCurveTo(50,66,44,46,48,32);c.lineTo(92,64);c.fill();c.beginPath();c.moveTo(142,88);c.bezierCurveTo(150,66,156,46,152,32);c.lineTo(108,64);c.fill();
  c.fillStyle=col;c.beginPath();c.ellipse(100,116,66,56,0,0,7);c.fill();c.stroke();
  c.fillStyle=p.t.Coat==='Tricolor'?'#e8893a':'#fff6ea';c.beginPath();c.moveTo(100,62);c.quadraticCurveTo(91,62,89,82);c.quadraticCurveTo(86,102,70,116);c.quadraticCurveTo(52,132,60,150);c.quadraticCurveTo(74,172,100,172);c.quadraticCurveTo(126,172,140,150);c.quadraticCurveTo(148,132,130,116);c.quadraticCurveTo(114,102,111,82);c.quadraticCurveTo(109,62,100,62);c.fill();
  if(p.t.Coat==='Blue Merle'){c.fillStyle='rgba(40,50,70,.35)';[[60,100,10],[140,95,12],[75,80,7]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,7);c.fill()})}
  // eyes
  const E=p.t.Eyes;c.fillStyle='#2b1d14';c.strokeStyle='#2b1d14';c.lineWidth=4;c.lineCap='round';
  [76,124].forEach((x,i)=>{if(E==='Sleepy'||(E==='Wink'&&i===1)){c.beginPath();c.arc(x,110,7,.2,Math.PI-.2);c.stroke()}
    else if(E==='Star'){c.fillStyle='#ffd34d';c.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,r=k%2?4:10;c.lineTo(x+Math.cos(a)*r,112+Math.sin(a)*r)}c.fill();c.fillStyle='#2b1d14'}
    else if(E==='Laser'){c.fillStyle='#ff2a4a';c.beginPath();c.arc(x,112,8,0,7);c.fill();c.strokeStyle='rgba(255,40,70,.6)';c.lineWidth=5;c.beginPath();c.moveTo(x,112);c.lineTo(x+(i?90:-90),200);c.stroke();c.strokeStyle='#2b1d14';c.lineWidth=4}
    else{c.beginPath();c.arc(x,112,7.5,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x+2.5,109.5,2.6,0,7);c.fill();c.fillStyle='#2b1d14'}});
  if(E==='Shades'){c.fillStyle='#111';c.fillRect(58,102,36,18);c.fillRect(106,102,36,18);c.fillRect(92,106,16,4);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(62,105,10,4);c.fillRect(110,105,10,4)}
  c.fillStyle='#2b1d14';c.beginPath();c.moveTo(89,129);c.quadraticCurveTo(100,122,111,129);c.quadraticCurveTo(109,139,100,141);c.quadraticCurveTo(91,139,89,129);c.fill();
  c.lineWidth=2.6;c.beginPath();c.moveTo(100,141);c.quadraticCurveTo(100,150,91,151);c.moveTo(100,141);c.quadraticCurveTo(100,150,109,151);c.stroke();
  c.fillStyle='#f07c8a';c.beginPath();c.moveTo(94,151);c.quadraticCurveTo(95,162,100,162);c.quadraticCurveTo(105,162,106,151);c.fill();
  c.fillStyle='rgba(244,163,160,.6)';c.beginPath();c.ellipse(63,134,9,5.5,0,0,7);c.ellipse(137,134,9,5.5,0,0,7);c.fill();
  // gear
  const G=p.t.Gear;if(G==='Red Collar'||G==='Bone Pendant'){c.fillStyle='#d8323a';c.fillRect(66,166,68,9);if(G==='Bone Pendant'){c.save();c.translate(100,182);window.drawBone&&drawBone(c,0,0,1.2);c.restore()}}
  if(G==='Scarf'){c.fillStyle='#4aa3ff';c.fillRect(60,162,80,12);c.fillRect(120,170,12,26)}
  if(G==='Bow Tie'){c.fillStyle='#ff5aa0';c.beginPath();c.moveTo(100,172);c.lineTo(84,162);c.lineTo(84,184);c.closePath();c.moveTo(100,172);c.lineTo(116,162);c.lineTo(116,184);c.fill()}
  // hats
  const H=p.t.Hat;
  if(H==='Beanie'){c.fillStyle='#4a6cff';c.beginPath();c.ellipse(100,62,34,22,0,Math.PI,0);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(100,38,7,0,7);c.fill()}
  if(H==='Pirate Bandana'){c.fillStyle='#d8323a';c.beginPath();c.ellipse(100,66,40,16,0,Math.PI,0);c.fill();c.fillStyle='#fff';[[86,58],[104,54],[116,60]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,2.5,0,7);c.fill()})}
  if(H==='Party Cone'){c.fillStyle='#ff7aa8';c.beginPath();c.moveTo(80,66);c.lineTo(100,14);c.lineTo(120,66);c.fill();c.fillStyle='#ffd34d';c.beginPath();c.arc(100,14,6,0,7);c.fill()}
  if(H==='Sailor Cap'){c.fillStyle='#fff';c.beginPath();c.ellipse(100,60,32,12,0,0,7);c.fill();c.fillStyle='#2a4a8a';c.fillRect(70,60,60,6)}
  if(H==='Crown'){c.fillStyle='#ffd34d';c.strokeStyle='#b88a1a';c.lineWidth=2;c.beginPath();c.moveTo(74,68);c.lineTo(74,40);c.lineTo(87,54);c.lineTo(100,32);c.lineTo(113,54);c.lineTo(126,40);c.lineTo(126,68);c.closePath();c.fill();c.stroke();c.fillStyle='#ff2a4a';c.beginPath();c.arc(100,58,4,0,7);c.fill()}
  if(H==='Halo'){c.strokeStyle='#ffe98a';c.lineWidth=5;c.shadowColor='#fff3a0';c.shadowBlur=14;c.beginPath();c.ellipse(100,28,30,8,0,0,7);c.stroke();c.shadowBlur=0}
  c.restore()}
window.Pups={traits,draw,TIERS};
})();
