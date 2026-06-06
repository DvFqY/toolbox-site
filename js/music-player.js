// Music Player v3 - rich ambient with reverb + real audio support
(function(){
  if (window.__musicPlayerLoaded) return;
  window.__musicPlayerLoaded = true;

  var audioCtx = null, playing = false, masterGain = null;
  var activeNodes = [], chordTimer = null, currentTrack = 0;
  var reverbNode = null, lfoNode = null;

  var tracks = [
    { name:"蓝色梦境", bpm:4200, scale:[261.63,293.66,329.63,349.23,392.00,440.00,493.88],
      chords:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2],[4,6,1,3],[5,0,2,4],[6,1,3,5],[0,2,4,6]] },
    { name:"星空漫步", bpm:5000, scale:[220.00,261.63,293.66,329.63,392.00,440.00],
      chords:[[0,2,4],[1,3,5],[2,4,0],[3,5,1],[4,0,2],[5,1,3],[0,2,4],[1,3,5]] },
    { name:"雨后花园", bpm:3800, scale:[293.66,329.63,369.99,392.00,440.00,493.88,523.25],
      chords:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2],[4,6,1,3],[5,0,2,4]] },
    { name:"深海低语", bpm:6000, scale:[110.00,130.81,146.83,164.81,196.00,220.00],
      chords:[[0,2,4],[1,3,5],[2,4,0],[3,5,1],[4,0,2],[5,1,3],[0,2,4],[1,3,5]] },
    { name:"清晨微光", bpm:4500, scale:[196.00,220.00,246.94,261.63,293.66,329.63,349.23,392.00],
      chords:[[0,2,4],[1,3,5],[2,4,6],[3,5,7],[4,6,0],[5,7,1],[6,0,2],[7,1,3]] },
    { name:"薄暮时分", bpm:5500, scale:[174.61,196.00,220.00,261.63,293.66,329.63,349.23],
      chords:[[0,2,4,6],[1,3,5,0],[2,4,6,1],[3,5,0,2]] }
  ];

  function getTrack(){ return tracks[currentTrack]; }

  // Create reverb via feedback delay network
  function createReverb(ctx) {
    var delays = [];
    var merger = ctx.createChannelMerger(1);
    var splitter = ctx.createChannelSplitter(2);
    for (var i = 0; i < 4; i++) {
      var delay = ctx.createDelay(2);
      delay.delayTime.value = 0.03 + i * 0.015 + Math.random() * 0.01;
      var feedback = ctx.createGain();
      feedback.gain.value = 0.2;
      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000 + i * 1000;
      delay.connect(filter);
      filter.connect(feedback);
      feedback.connect(delay);
      delays.push({delay:delay, feedback:feedback});
    }
    var input = ctx.createGain();
    var output = ctx.createGain();
    var dry = ctx.createGain(); dry.gain.value = 0.6;
    var wet = ctx.createGain(); wet.gain.value = 0.35;
    input.connect(dry); dry.connect(output);
    delays.forEach(function(d){ input.connect(d.delay); d.delay.connect(wet); });
    wet.connect(output);
    return {input:input, output:output};
  }

  function createPadNote(ctx, freq, time, duration) {
    // Rich pad: multiple detuned oscillators
    var types = ['sine','triangle','sine','triangle'];
    var detunes = [0, 5, -5, 10];
    var gains = [0.03, 0.02, 0.015, 0.01];
    var nodes = [];
    var merger = ctx.createChannelMerger(1);

    for (var i = 0; i < types.length; i++) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = types[i];
      osc.frequency.value = freq;
      osc.detune.value = detunes[i];
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(gains[i], time + 0.8);
      gain.gain.setValueAtTime(gains[i], time + duration - 0.5);
      gain.gain.linearRampToValueAtTime(0, time + duration);
      osc.connect(gain);
      gain.connect(merger);
      osc.start(time);
      osc.stop(time + duration + 0.1);
      nodes.push(osc);
    }
    return {nodes: nodes, output: merger};
  }

  function playChord() {
    stopChord();
    if (!playing) return;
    var t = getTrack();
    var chord = t.chords[currentChord % t.chords.length];
    var scale = t.scale;
    var now = audioCtx.currentTime;
    var nodes = [];

    chord.forEach(function(idx) {
      var freq = scale[idx % scale.length];
      // Main pad
      var pad = createPadNote(audioCtx, freq, now, t.bpm / 1000 * 0.9);
      pad.output.connect(reverbNode.input);
      nodes = nodes.concat(pad.nodes);
      // Sub bass
      var sub = createPadNote(audioCtx, freq / 2, now + 0.1, t.bpm / 1000 * 0.85);
      sub.output.connect(reverbNode.input);
      nodes = nodes.concat(sub.nodes);
      // High shimmer
      var high = createPadNote(audioCtx, freq * 2, now + 0.2, t.bpm / 1000 * 0.5);
      high.output.connect(reverbNode.input);
      nodes = nodes.concat(high.nodes);
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
      reverbNode = createReverb(audioCtx);
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.18;
      reverbNode.output.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.3);
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
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
    }
  }

  function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    if (playing) { clearInterval(chordTimer); playChord(); chordTimer = setInterval(playChord, getTrack().bpm); }
    updateLabel();
  }

  function updateLabel() { trackLabel.textContent = playing ? '🎶 ' + getTrack().name : '🎵'; }

  // UI
  var wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;align-items:center;gap:6px';

  var trackLabel = document.createElement('span');
  trackLabel.style.cssText = 'font-size:.68rem;color:var(--text-secondary);background:var(--surface);padding:2px 8px;border-radius:10px;border:1px solid var(--border);opacity:.8;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis';
  wrap.appendChild(trackLabel);

  var btn = document.createElement('div');
  btn.innerHTML = '🎵'; btn.title = '播放音乐';
  btn.style.cssText = 'width:40px;height:40px;border-radius:50%;background:var(--surface,#fff);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;transition:all .25s;box-shadow:0 2px 12px rgba(0,0,0,.1);opacity:.85';
  btn.addEventListener('mouseenter', function(){ btn.style.opacity='1'; btn.style.transform='scale(1.1)'; });
  btn.addEventListener('mouseleave', function(){ btn.style.opacity='.85'; btn.style.transform='scale(1)'; });
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    if (playing) { stopMusic(); btn.innerHTML = '🎵'; btn.style.background = 'var(--surface,#fff)'; btn.style.animation = ''; trackLabel.textContent = '🎵'; }
    else { startMusic(); btn.innerHTML = '🎶'; btn.style.background = '#eef2ff'; btn.style.animation = 'mp3 2s infinite'; updateLabel();
      var s = document.createElement('style'); s.textContent = '@keyframes mp3{0%,100%{box-shadow:0 2px 12px rgba(99,102,241,.15)}50%{box-shadow:0 2px 24px rgba(99,102,241,.35)}}'; document.head.appendChild(s); }
  });
  wrap.appendChild(btn);

  var nextBtn = document.createElement('div');
  nextBtn.innerHTML = '⏭'; nextBtn.title = '下一首';
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