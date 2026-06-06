// Music Player v3 - rich ambient with reverb
(function(){
  if (window.__musicPlayerLoaded) return;
  window.__musicPlayerLoaded = true;

  var audioCtx = null, playing = false, masterGain = null, reverbGain = null;
  var activeNodes = [], chordTimer = null, currentTrack = 0;

  var tracks = [
    { name:"\u84DD\u8272\u68A6\u5883", bpm:4200, scale:[261.63,293.66,329.63,349.23,392.00,440.00,493.88],
      chords:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2],[4,6,1,3],[5,0,2,4],[6,1,3,5]] },
    { name:"\u661F\u7A7A\u6F2B\u6B65", bpm:5000, scale:[220.00,261.63,293.66,329.63,392.00,440.00],
      chords:[[0,2,4],[1,3,5],[2,4,0],[3,5,1],[4,0,2],[5,1,3]] },
    { name:"\u96E8\u540E\u82B1\u56ED", bpm:3800, scale:[293.66,329.63,369.99,392.00,440.00,493.88,523.25],
      chords:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2],[4,6,1,3]] },
    { name:"\u6DF1\u6D77\u4F4E\u8BED", bpm:6000, scale:[110.00,130.81,146.83,164.81,196.00,220.00],
      chords:[[0,2,4],[1,3,5],[2,4,0],[3,5,1],[4,0,2],[5,1,3]] },
    { name:"\u6E05\u6668\u5FAE\u5149", bpm:4500, scale:[196.00,220.00,246.94,261.63,293.66,329.63,349.23],
      chords:[[0,2,4],[1,3,5],[2,4,6],[3,5,0],[4,6,1],[5,0,2],[6,1,3]] },
    { name:"\u8584\u66AE\u65F6\u5206", bpm:5500, scale:[174.61,196.00,220.00,261.63,293.66,329.63],
      chords:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2]] }
  ];

  function getTrack(){ return tracks[currentTrack]; }

  function makeReverb(ctx) {
    var input = ctx.createGain();
    var output = ctx.createGain();
    var dry = ctx.createGain(); dry.gain.value = 0.55;
    var wet = ctx.createGain(); wet.gain.value = 0.3;
    input.connect(dry); dry.connect(output);
    for (var i = 0; i < 6; i++) {
      var delay = ctx.createDelay(1.5);
      delay.delayTime.value = 0.025 + Math.random() * 0.05;
      var fb = ctx.createGain(); fb.gain.value = 0.15;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500 + i * 800;
      input.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(wet);
    }
    wet.connect(output);
    return { input: input, output: output };
  }

  function playChord() {
    stopChord();
    if (!playing) return;
    var t = getTrack();
    var chord = t.chords[currentChord % t.chords.length];
    var scale = t.scale;
    var now = audioCtx.currentTime;
    var dur = t.bpm / 1000 * 0.9;
    var nodes = [];
    chord.forEach(function(idx) {
      var freq = scale[idx % scale.length];
      [1, 1.002, 2, 0.5].forEach(function(mult, j) {
        if (j === 2 && Math.random() > 0.5) return;
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = j < 2 ? 'sine' : 'triangle';
        osc.frequency.value = freq * mult;
        osc.detune.value = j * 4 - 6;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.025 / (j + 1), now + 0.6);
        gain.gain.setValueAtTime(0.025 / (j + 1), now + dur - 0.3);
        gain.gain.linearRampToValueAtTime(0, now + dur);
        osc.connect(gain);
        gain.connect(reverbGain.input);
        osc.start(now + j * 0.05);
        osc.stop(now + dur + 0.2);
        nodes.push(osc);
      });
    });
    activeNodes = nodes;
    currentChord++;
  }

  function stopChord() {
    activeNodes.forEach(function(n) { try { n.stop(); } catch(e) {} });
    activeNodes = [];
  }

  function startMusic() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      reverbGain = makeReverb(audioCtx);
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.2;
      reverbGain.output.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.3);
    playing = true;
    playChord();
    chordTimer = setInterval(playChord, getTrack().bpm);
  }

  function stopMusic() {
    playing = false;
    clearInterval(chordTimer);
    stopChord();
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
    }
  }

  function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    if (playing) { clearInterval(chordTimer); playChord(); chordTimer = setInterval(playChord, getTrack().bpm); }
    updateLabel();
  }

  function updateLabel() { trackLabel.textContent = playing ? '\uD83C\uDFB6 ' + getTrack().name : '\uD83C\uDFB5'; }

  var wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;align-items:center;gap:6px';
  var trackLabel = document.createElement('span');
  trackLabel.style.cssText = 'font-size:.68rem;color:var(--text-secondary);background:var(--surface);padding:2px 8px;border-radius:10px;border:1px solid var(--border);opacity:.8;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis';
  trackLabel.textContent = '\uD83C\uDFB5';
  wrap.appendChild(trackLabel);

  var btn = document.createElement('div');
  btn.innerHTML = '\uD83C\uDFB5'; btn.title = '\u64AD\u653E\u97F3\u4E50';
  btn.style.cssText = 'width:40px;height:40px;border-radius:50%;background:var(--surface,#fff);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;transition:all .25s;box-shadow:0 2px 12px rgba(0,0,0,.1);opacity:.85';
  btn.addEventListener('mouseenter', function(){ btn.style.opacity='1'; btn.style.transform='scale(1.1)'; });
  btn.addEventListener('mouseleave', function(){ btn.style.opacity='.85'; btn.style.transform='scale(1)'; });
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    if (playing) { stopMusic(); btn.innerHTML = '\uD83C\uDFB5'; btn.style.background = 'var(--surface,#fff)'; btn.style.animation = ''; trackLabel.textContent = '\uD83C\uDFB5'; }
    else { startMusic(); btn.innerHTML = '\uD83C\uDFB6'; btn.style.background = '#eef2ff'; btn.style.animation = 'mpv3 2s infinite'; updateLabel();
      var s = document.createElement('style'); s.textContent = '@keyframes mpv3{0%,100%{box-shadow:0 2px 12px rgba(99,102,241,.15)}50%{box-shadow:0 2px 24px rgba(99,102,241,.35)}}'; document.head.appendChild(s); }
  });
  wrap.appendChild(btn);

  var nextBtn = document.createElement('div');
  nextBtn.innerHTML = '\u23ED'; nextBtn.title = '\u4E0B\u4E00\u9996';
  nextBtn.style.cssText = 'width:26px;height:26px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.7rem;cursor:pointer;transition:all .2s;opacity:.7';
  nextBtn.addEventListener('mouseenter', function(){ nextBtn.style.opacity = '1'; });
  nextBtn.addEventListener('mouseleave', function(){ nextBtn.style.opacity = '.7'; });
  nextBtn.addEventListener('click', function(e){ e.stopPropagation(); nextTrack(); });
  wrap.appendChild(nextBtn);

  function place() { if (document.body) document.body.appendChild(wrap); }
  if (document.readyState !== 'loading') place();
  else document.addEventListener('DOMContentLoaded', place);
  updateLabel();
})();