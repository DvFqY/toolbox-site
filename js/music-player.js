(function(){
if(window.__musicLoaded)return;
window.__musicLoaded=1;

var ctx=null,gain=null,playing=false,notes=[],timer=null,trackIdx=0;

// 6 ambient tracks - each has name, tempo(ms), scale(frequencies), progression
var tracks=[
 {name:"\u84DD\u8272\u68A6\u5883",tempo:4200,scale:[261,293,329,349,392,440,494],prog:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2],[4,6,1,3],[5,0,2,4]]},
 {name:"\u661F\u7A7A\u6F2B\u6B65",tempo:5000,scale:[220,262,294,330,392,440],prog:[[0,2,4],[1,3,5],[2,4,0],[3,5,1],[4,0,2],[5,1,3]]},
 {name:"\u96E8\u540E\u82B1\u56ED",tempo:3800,scale:[294,330,370,392,440,494,523],prog:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2]]},
 {name:"\u6DF1\u6D77\u4F4E\u8BED",tempo:6000,scale:[131,147,165,196,220,262],prog:[[0,2,4],[1,3,5],[2,4,0],[3,5,1],[0,2,5],[1,4,0]]},
 {name:"\u6E05\u6668\u5FAE\u5149",tempo:4500,scale:[196,220,247,262,294,330,349],prog:[[0,2,4],[1,3,5],[2,4,6],[3,5,0],[4,6,1],[2,5,0]]},
 {name:"\u8584\u66AE\u65F6\u5206",tempo:5500,scale:[175,196,220,262,294,330,392],prog:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2],[1,4,6,3]]}
];

var progStep=0;

function stopAllNotes(){
 notes.forEach(function(o){try{o.stop()}catch(e){}});
 notes=[];
}

function playProgression(){
 stopAllNotes();
 if(!playing)return;
 var t=tracks[trackIdx];
 var chordIdx=progStep%t.prog.length;
 var chord=t.prog[chordIdx];
 var sc=t.scale;
 var nw=ctx.currentTime;
 var dur=t.tempo/1000*0.85;
 chord.forEach(function(si,ii){
  var f=sc[si%sc.length];
  // layer two oscillators per note for richness
  for(var j=0;j<2;j++){
   var o=ctx.createOscillator();
   var g=ctx.createGain();
   o.type=j===0?'sine':'triangle';
   o.frequency.setValueAtTime(f*(j?1.002:1),nw);
   o.detune.setValueAtTime(j?4:-3,nw);
   var vol=0.04/(j+1);
   g.gain.setValueAtTime(0,nw);
   g.gain.linearRampToValueAtTime(vol,nw+0.3);
   g.gain.setValueAtTime(vol,nw+dur-0.15);
   g.gain.linearRampToValueAtTime(0,nw+dur);
   o.connect(g);
   g.connect(gain);
   o.start(nw+ii*0.02);
   o.stop(nw+dur+0.1);
   notes.push(o);
  }
 });
 progStep++;
 timer=setTimeout(playProgression,t.tempo);
}

function startMusic(){
 if(!ctx){
  ctx=new(window.AudioContext||window.webkitAudioContext)();
  gain=ctx.createGain();
  gain.gain.value=0.22;
  gain.connect(ctx.destination);
 }
 if(ctx.state==='suspended')ctx.resume();
 playing=true;
 progStep=0;
 playProgression();
 updateUI();
}

function stopMusic(){
 playing=false;
 clearTimeout(timer);
 stopAllNotes();
 updateUI();
}

function nextTrack(){
 trackIdx=(trackIdx+1)%tracks.length;
 if(playing){
  clearTimeout(timer);
  progStep=0;
  playProgression();
 }
 updateUI();
}

function updateUI(){
 if(playing){
  iconBtn.innerHTML='\uD83C\uDFB6';
  iconBtn.style.background='#eef2ff';
  iconBtn.style.animation='mpul 2s infinite';
  labelEl.textContent='\uD83C\uDFB6 '+tracks[trackIdx].name;
 }else{
  iconBtn.innerHTML='\uD83C\uDFB5';
  iconBtn.style.background='var(--surface)';
  iconBtn.style.animation='';
  labelEl.textContent='\uD83C\uDFB5';
 }
}

// Build UI
var wrapper=document.createElement('div');
wrapper.style.cssText='position:fixed;bottom:20px;right:80px;z-index:9999;display:flex;align-items:center;gap:6px';

var labelEl=document.createElement('span');
labelEl.style.cssText='font-size:.68rem;color:var(--text-secondary);background:var(--surface);padding:2px 8px;border-radius:10px;border:1px solid var(--border);opacity:.85;max-width:100px;overflow:hidden;white-space:nowrap;user-select:none';
labelEl.textContent='\uD83C\uDFB5';
wrapper.appendChild(labelEl);

var iconBtn=document.createElement('div');
iconBtn.innerHTML='\uD83C\uDFB5';
iconBtn.title='\u64AD\u653E\u97F3\u4E50';
iconBtn.style.cssText='width:40px;height:40px;border-radius:50%;background:var(--surface);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;transition:all .2s;opacity:.85;user-select:none';
iconBtn.onmouseenter=function(){iconBtn.style.opacity='1';iconBtn.style.transform='scale(1.1)'};
iconBtn.onmouseleave=function(){iconBtn.style.opacity='.85';iconBtn.style.transform='scale(1)'};
iconBtn.onclick=function(e){e.stopPropagation();
 if(!playing){startMusic();}
 else{stopMusic();}
};
wrapper.appendChild(iconBtn);

var nextBtn=document.createElement('div');
nextBtn.innerHTML='\u23ED';
nextBtn.title='\u4E0B\u4E00\u9996';
nextBtn.style.cssText='width:26px;height:26px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.7rem;cursor:pointer;opacity:.7;user-select:none';
nextBtn.onmouseenter=function(){nextBtn.style.opacity='1'};
nextBtn.onmouseleave=function(){nextBtn.style.opacity='.7'};
nextBtn.onclick=function(e){e.stopPropagation();nextTrack()};
wrapper.appendChild(nextBtn);

function mount(){
 if(document.body){
  document.body.appendChild(wrapper);
  var s=document.createElement('style');
  s.textContent='@keyframes mpul{0%,100%{box-shadow:0 2px 12px rgba(99,102,241,.15)}50%{box-shadow:0 2px 24px rgba(99,102,241,.35)}}';
  document.head.appendChild(s);
 }
}
if(document.readyState!=='loading')mount();
else document.addEventListener('DOMContentLoaded',mount);
})();