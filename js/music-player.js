// 氛围音乐播放器 - Web Audio API
(function(){
  if (window.__musicPlayerLoaded) return;
  window.__musicPlayerLoaded = true;

  var audioCtx = null;
  var playing = false;
  var masterGain = null;
  var oscillators = [];
  var filterNode = null;
  var chordTimer = null;
  var currentChord = 0;

  // Soft ambient chord progressions (Cmaj7, Am7, Fmaj7, G7 frequencies)
  var chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 349.23], // Fmaj7
    [196.00, 246.94, 293.66, 349.23], // G7
    [261.63, 311.13, 392.00, 466.16], // Cmaj7 alt
    [220.00, 277.18, 329.63, 440.00], // Am7 alt
    [174.61, 220.00, 293.66, 349.23], // F
    [246.94, 311.13, 369.99, 466.16], // Dm7
  ];

  function createOscillator(freq, type, detune) {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(filterNode);
    osc.start();
    gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.5);
    return { osc: osc, gain: gain };
  }

  function playChord() {
    stopChord();
    if (!playing) return;
    var notes = chords[currentChord % chords.length];
    oscillators = [];
    notes.forEach(function(freq, i) {
      // Main tone
      oscillators.push(createOscillator(freq, 'sine', i === 0 ? -5 : i * 3));
      // Sub harmonic for warmth
      oscillators.push(createOscillator(freq / 2, 'sine', -3));
    });
    currentChord++;
  }

  function stopChord() {
    oscillators.forEach(function(o) {
      try {
        o.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
        setTimeout(function() { try { o.osc.stop(); } catch(e) {} }, 2000);
      } catch(e) {}
    });
    oscillators = [];
  }

  function startMusic() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.15;
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 600;
      filterNode.Q.value = 0.5;
      filterNode.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playing = true;
    playChord();
    chordTimer = setInterval(playChord, 4000);
  }

  function stopMusic() {
    playing = false;
    clearInterval(chordTimer);
    stopChord();
    if (masterGain) {
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    }
  }

  // Create floating UI
  var btn = document.createElement('div');
  btn.id = 'musicPlayerBtn';
  btn.innerHTML = '🎵';
  btn.title = '播放背景音乐';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:44px;height:44px;'
    + 'border-radius:50%;background:var(--surface,#fff);border:1.5px solid var(--border,#e2e8f0);'
    + 'display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;'
    + 'z-index:9999;transition:all .25s;box-shadow:0 2px 12px rgba(0,0,0,.1);user-select:none;'
    + 'opacity:.85;';

  btn.addEventListener('mouseenter', function() { btn.style.opacity = '1'; btn.style.transform = 'scale(1.1)'; });
  btn.addEventListener('mouseleave', function() { btn.style.opacity = '.85'; btn.style.transform = 'scale(1)'; });

  btn.addEventListener('click', function() {
    if (playing) {
      stopMusic();
      btn.innerHTML = '🎵';
      btn.title = '播放背景音乐';
      btn.style.background = 'var(--surface,#fff)';
    } else {
      startMusic();
      btn.innerHTML = '🎶';
      btn.title = '暂停背景音乐';
      btn.style.background = '#eef2ff';
      // pulse animation
      btn.style.animation = 'musicPulse 2s infinite';
      var style = document.createElement('style');
      style.id = 'musicPulseStyle';
      style.textContent = '@keyframes musicPulse{0%,100%{box-shadow:0 2px 12px rgba(99,102,241,.15)}50%{box-shadow:0 2px 24px rgba(99,102,241,.35)}}';
      document.head.appendChild(style);
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(btn);
  });
  if (document.readyState !== 'loading') {
    document.body.appendChild(btn);
  }
})();