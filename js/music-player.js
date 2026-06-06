// Music Player v2 - multiple ambient tracks
(function(){
  if (window.__musicPlayerLoaded) return;
  window.__musicPlayerLoaded = true;

  var audioCtx = null, playing = false, masterGain = null, filterNode = null;
  var oscillators = [], chordTimer = null, currentChord = 0, currentTrack = 0;

  var tracks = [
    { name:'蓝色梦境', tempo:4200, chords:[
      [261.63,329.63,392.00,493.88],[220.00,261.63,329.63,392.00],
      [174.61,220.00,261.63,349.23],[196.00,246.94,293.66,349.23],
      [261.63,311.13,392.00,466.16],[220.00,277.18,329.63,440.00],
      [174.61,220.00,293.66,349.23],[246.94,311.13,369.99,466.16]
    ]},
    { name:'星空漫步', tempo:5000, chords:[
      [293.66,369.99,440.00],[261.63,329.63,392.00],
      [220.00,277.18,349.23],[246.94,311.13,369.99],
      [174.61,220.00,293.66],[196.00,246.94,311.13],
      [293.66,369.99,440.00],[261.63,329.63,392.00]
    ]},
    { name:'雨后花园', tempo:3800, chords:[
      [349.23,440.00,523.25],[329.63,415.30,493.88],
      [293.66,369.99,466.16],[261.63,329.63,392.00],
      [220.00,277.18,349.23],[246.94,311.13,369.99],
      [196.00,246.94,311.13],[174.61,220.00,293.66]
    ]},
    { name:'深海低语', tempo:5500, chords:[
      [130.81,164.81,196.00],[146.83,185.00,220.00],
      [110.00,138.59,174.61],[123.47,155.56,196.00],
      [87.31,110.00,138.59],[98.00,123.47,155.56],
      [130.81,164.81,196.00],[146.83,185.00,220.00]
    ]}
  ];

  function getTrack(){return tracks[currentTrack]}

  function createOsc(freq,type,detune){
    var o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type=type||'sine';o.frequency.value=freq;if(detune)o.detune.value=detune;
    g.gain.value=0;o.connect(g);g.connect(filterNode);o.start();
    g.gain.linearRampToValueAtTime(0.04,audioCtx.currentTime+.5);return{osc:o,gain:g}
  }

  function playChord(){
    stopChord();if(!playing)return;
    var t=getTrack(),n=t.chords[currentChord%t.chords.length];
    oscillators=[];
    n.forEach(function(f,i){
      oscillators.push(createOsc(f,'sine',i===0?-5:i*3));
      oscillators.push(createOsc(f/2,'sine',-3));
      // Soft pad
      oscillators.push(createOsc(f*1.005,'triangle',2));
    });
    currentChord++;
  }

  function stopChord(){
    oscillators.forEach(function(o){
      try{o.gain.gain.linearRampToValueAtTime(0,audioCtx.currentTime+1.5);setTimeout(function(){try{o.osc.stop()}catch(e){}},2000)}catch(e){}
    });
    oscillators=[];
  }

  function startMusic(){
    if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)()}
    if(!masterGain||!filterNode){
      masterGain=audioCtx.createGain();masterGain.gain.value=.15;
      filterNode=audioCtx.createBiquadFilter();filterNode.type='lowpass';
      filterNode.frequency.value=600;filterNode.Q.value=.5;
      filterNode.connect(masterGain);masterGain.connect(audioCtx.destination)
    }
    if(audioCtx.state==='suspended')audioCtx.resume();
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value,audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(.15,audioCtx.currentTime+.3);
    playing=true;playChord();var t=getTrack();
    chordTimer=setInterval(playChord,t.tempo)
  }

  function stopMusic(){
    playing=false;clearInterval(chordTimer);stopChord();
    if(masterGain)masterGain.gain.linearRampToValueAtTime(0,audioCtx.currentTime+.5)
  }

  function nextTrack(){
    currentTrack=(currentTrack+1)%tracks.length;
    if(playing){clearInterval(chordTimer);var t=getTrack();playChord();chordTimer=setInterval(playChord,t.tempo)}
    updateTrackLabel()
  }

  function updateTrackLabel(){
    trackLabel.textContent=playing?'🎶 '+getTrack().name:'🎵';
  }

  // Floating button group
  var wrap=document.createElement('div');
  wrap.style.cssText='position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;align-items:center;gap:8px';

  var trackLabel=document.createElement('span');
  trackLabel.style.cssText='font-size:.7rem;color:var(--text-secondary);background:var(--surface);padding:3px 8px;border-radius:10px;border:1px solid var(--border);opacity:.8;white-space:nowrap;max-width:80px;overflow:hidden;text-overflow:ellipsis';
  trackLabel.textContent='🎵';
  wrap.appendChild(trackLabel);

  var btn=document.createElement('div');
  btn.innerHTML='🎵';btn.title='播放音乐';
  btn.style.cssText='width:40px;height:40px;border-radius:50%;background:var(--surface,#fff);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;transition:all .25s;box-shadow:0 2px 12px rgba(0,0,0,.1);opacity:.85';
  btn.addEventListener('mouseenter',function(){btn.style.opacity='1';btn.style.transform='scale(1.1)'});
  btn.addEventListener('mouseleave',function(){btn.style.opacity='.85';btn.style.transform='scale(1)'});
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    if(playing){stopMusic();btn.innerHTML='🎵';btn.style.background='var(--surface,#fff)';btn.style.animation='';trackLabel.textContent='🎵'}
    else{startMusic();btn.innerHTML='🎶';btn.style.background='#eef2ff';btn.style.animation='musicPulse 2s infinite';updateTrackLabel();var s=document.createElement('style');s.textContent='@keyframes musicPulse{0%,100%{box-shadow:0 2px 12px rgba(99,102,241,.15)}50%{box-shadow:0 2px 24px rgba(99,102,241,.35)}}';document.head.appendChild(s)}
  });
  wrap.appendChild(btn);

  var nextBtn=document.createElement('div');
  nextBtn.innerHTML='⏭';
  nextBtn.title='下一首';
  nextBtn.style.cssText='width:28px;height:28px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.75rem;cursor:pointer;transition:all .2s;opacity:.7';
  nextBtn.addEventListener('mouseenter',function(){nextBtn.style.opacity='1'});
  nextBtn.addEventListener('mouseleave',function(){nextBtn.style.opacity='.7'});
  nextBtn.addEventListener('click',function(e){e.stopPropagation();nextTrack()});
  wrap.appendChild(nextBtn);

  function place(){if(document.body)document.body.appendChild(wrap)}
  if(document.readyState!=='loading')place();else document.addEventListener('DOMContentLoaded',place);
})();