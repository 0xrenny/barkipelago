/* Original generative lo-fi island music, synthesized live with WebAudio. No audio files, no licenses needed.
   Starts only after a user gesture; mute state remembered in localStorage. */
(function(){
let A=null,master,music,sfx,rev,playing=false,next=0,step=0,timer=null;
const MK='barki.muted';let muted=localStorage.getItem(MK)==='1';
const prog=[[57,60,64,67],[53,57,60,64],[48,52,55,59],[55,59,62,65]]; // Am7 Fmaj7 Cmaj7 G7
const scale=[69,72,74,76,79,81,84];
const hz=m=>440*Math.pow(2,(m-69)/12);
function ensure(){if(A)return A;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;A=new C();
  master=A.createGain();master.gain.value=muted?0:1;master.connect(A.destination);
  music=A.createGain();music.gain.value=.22;sfx=A.createGain();sfx.gain.value=.9;sfx.connect(master);
  rev=A.createConvolver();const len=A.sampleRate*2.4,b=A.createBuffer(2,len,A.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}rev.buffer=b;
  const wet=A.createGain();wet.gain.value=.45;music.connect(master);music.connect(rev);rev.connect(wet).connect(master);
  return A}
function note(f,t,d,type,v,dest=music,cut=2400){const o=A.createOscillator(),g=A.createGain(),fl=A.createBiquadFilter();fl.type='lowpass';fl.frequency.value=cut;o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+Math.min(.04,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(fl).connect(g).connect(dest);o.start(t);o.stop(t+d+.05)}
const BPM=84,S=60/BPM/2; // eighth notes
function sched(){while(next<A.currentTime+.25){const bar=Math.floor(step/8)%4,s8=step%8,ch=prog[bar];
  if(s8===0)ch.forEach((m,i)=>{note(hz(m),next,S*8.5,'triangle',.07,music,1200);note(hz(m)*1.004,next,S*8.5,'sine',.05,music,900)});
  if(s8===0||s8===5)note(hz(ch[0]-12),next,S*3,'sine',.22,music,500);
  // gentle pluck melody: pentatonic random walk, seeded by step so it repeats every 32 bars
  const r=Math.sin(step*12.9898)*43758.5453%1;if(Math.abs(r)>.35){const m=scale[Math.floor(Math.abs(r)*97)%scale.length];note(hz(m),next,S*2.5,'triangle',.06,music,3000)}
  if(s8%2===0){const n=A.createBufferSource(),b=A.createBuffer(1,A.sampleRate*.05,A.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const g=A.createGain();g.gain.value=s8%4===0?.02:.012;const hp=A.createBiquadFilter();hp.type='highpass';hp.frequency.value=6000;n.connect(hp).connect(g).connect(music);n.start(next)}
  if(s8===0||s8===4){const o=A.createOscillator(),g=A.createGain();o.frequency.setValueAtTime(110,next);o.frequency.exponentialRampToValueAtTime(40,next+.15);g.gain.setValueAtTime(.18,next);g.gain.exponentialRampToValueAtTime(.001,next+.2);o.connect(g).connect(music);o.start(next);o.stop(next+.25)}
  next+=S;step++}}
const M={ctx:()=>ensure(),sfxBus:()=>sfx,muted:()=>muted,
  start(){if(!ensure())return;A.resume();if(playing)return;playing=true;next=A.currentTime+.1;timer=setInterval(sched,60)},
  setMuted(v){muted=v;localStorage.setItem(MK,v?'1':'0');if(A)master.gain.setTargetAtTime(v?0:1,A.currentTime,.05);if(!v)this.start();document.dispatchEvent(new Event('mutechange'))},
  toggle(){this.setMuted(!muted)}};
window.Music=M;
})();
