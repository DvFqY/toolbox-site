// Creative Easter Eggs & Surprises
(function(){
  if (window.__easterLoaded) return;
  window.__easterLoaded = true;

  // ===== 1. KONAMI CODE =====
  var konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  var konamiIdx = 0;
  document.addEventListener('keydown', function(e) {
    if (e.code === konamiCode[konamiIdx]) { konamiIdx++; }
    else { konamiIdx = (e.code === 'ArrowUp') ? 1 : 0; }
    if (konamiIdx === konamiCode.length) {
      konamiIdx = 0;
      triggerKonami();
    }
  });

  function triggerKonami() {
    // Confetti explosion
    var colors = ['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#f368e0','#ff6348','#7bed9f'];
    for (var i = 0; i < 80; i++) {
      var confetti = document.createElement('div');
      confetti.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;width:'+(6+Math.random()*10)+'px;height:'+(6+Math.random()*10)+'px;'
        + 'background:'+colors[Math.floor(Math.random()*colors.length)]+';border-radius:'+(Math.random()>.5?'50%':'2px')+';'
        + 'left:'+(Math.random()*window.innerWidth)+'px;top:-20px;'
        + 'animation:konamiFall '+(2+Math.random()*3)+'s ease-in forwards;'
        + 'animation-delay:'+(Math.random()*.5)+'s;';
      document.body.appendChild(confetti);
      setTimeout(function(){ confetti.remove(); }, 4000);
    }

    // Big message
    var msg = document.createElement('div');
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100000;'
      + 'background:linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);color:#fff;padding:20px 40px;border-radius:16px;'
      + 'font-size:1.4rem;font-weight:800;text-align:center;box-shadow:0 20px 60px rgba(99,102,241,.4);'
      + 'animation:konamiPop .5s ease-out;';
    msg.innerHTML = '🎮 科乐美密技发现!<br><span style="font-size:.85rem;font-weight:400">你找到了隐藏彩蛋 ✨</span>';
    document.body.appendChild(msg);

    // Rainbow background flash
    var flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;z-index:99998;pointer-events:none;'
      + 'background:linear-gradient(90deg,red,orange,yellow,green,blue,indigo,violet);opacity:0;'
      + 'animation:konamiRainbow .8s ease-out;';
    document.body.appendChild(flash);

    setTimeout(function(){ msg.remove(); flash.remove(); }, 3500);

    // Sound
    try{var a=new AudioContext(),notes=[523,659,784,1047];
      notes.forEach(function(f,i){var o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.value=f;
        g.gain.setValueAtTime(.06,a.currentTime+i*.12);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+i*.12+.2);
        o.connect(g);g.connect(a.destination);o.start(a.currentTime+i*.12);o.stop(a.currentTime+i*.12+.25)})}catch(e){}
  }

  // ===== 2. PET EVOLUTION =====
  var petClicks = parseInt(localStorage.getItem('pet_evolution')||'0');
  var evolutions = [
    {name:'小猫咪',color:'#fbbf24',accessory:''},
    {name:'蝴蝶结猫',color:'#fbbf24',accessory:'🎀'},
    {name:'墨镜猫',color:'#fbbf24',accessory:'😎'},
    {name:'皇冠猫',color:'#f59e0b',accessory:'👑'},
    {name:'彩虹猫',color:'#fbbf24',accessory:'🌈'},
    {name:'宇宙猫',color:'#8b5cf6',accessory:'🚀'}
  ];

  function checkEvolution() {
    petClicks++;
    localStorage.setItem('pet_evolution', petClicks);
    var lvl = Math.min(Math.floor(petClicks / 15), evolutions.length - 1);
    var evo = evolutions[lvl];

    // Show evolution toast on level up
    if (petClicks % 15 === 0 && lvl > 0) {
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:100000;'
        + 'background:var(--surface,#fff);border:2px solid #fbbf24;padding:12px 24px;border-radius:12px;'
        + 'font-weight:700;box-shadow:0 8px 30px rgba(251,191,36,.3);animation:konamiPop .4s ease-out;';
      toast.innerHTML = evo.accessory + ' 猫咪进化! <b>' + evo.name + '</b> Lv.' + lvl;
      document.body.appendChild(toast);
      setTimeout(function(){ toast.remove(); }, 3000);
    }

    // Add accessory to pet bubble area on next message
    window.__petAccessory = evolutions[Math.min(Math.floor(petClicks/15), evolutions.length-1)].accessory;
  }

  // Hook into pet clicks via DOM observation
  setInterval(function() {
    var pet = document.getElementById('webPet');
    if (pet && !pet.__hooked) {
      pet.__hooked = true;
      pet.addEventListener('click', function() { checkEvolution(); });
    }
  }, 1000);

  // ===== 3. DOODLE PAD (double-click empty area) =====
  var doodleActive = false;
  document.addEventListener('dblclick', function(e) {
    if (e.target.closest('button,a,input,textarea,canvas,#webPet,#musicPlayerBtn,#themeToggle')) return;
    if (doodleActive) return;
    doodleActive = true;

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;';
    overlay.addEventListener('click', function(ev) { if (ev.target === overlay) closeDoodle(); });

    var pad = document.createElement('div');
    pad.style.cssText = 'background:var(--surface,#fff);border-radius:16px;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);max-width:90vw;';
    pad.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>✏️ 随手涂鸦</b><div><button id="doodleColor" style="width:24px;height:24px;border-radius:50%;border:2px solid #ccc;background:#1e293b;cursor:pointer;margin-right:6px"></button><button id="doodleClear" style="background:none;border:1px solid #ccc;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:.8rem">清空</button><button id="doodleClose" style="background:none;border:none;font-size:1.2rem;cursor:pointer;margin-left:6px">✕</button></div></div>';

    var dCanvas = document.createElement('canvas');
    dCanvas.width = Math.min(500, window.innerWidth - 60);
    dCanvas.height = Math.min(400, window.innerHeight - 160);
    dCanvas.style.cssText = 'border:1px solid var(--border);border-radius:8px;cursor:crosshair;display:block;';
    pad.appendChild(dCanvas);
    overlay.appendChild(pad);
    document.body.appendChild(overlay);

    var dCtx = dCanvas.getContext('2d');
    dCtx.fillStyle = '#fff';
    dCtx.fillRect(0, 0, dCanvas.width, dCanvas.height);
    dCtx.strokeStyle = '#1e293b';
    dCtx.lineWidth = 2;
    dCtx.lineCap = 'round';
    dCtx.lineJoin = 'round';

    var drawing = false;
    dCanvas.addEventListener('pointerdown', function(ev) { drawing = true; dCtx.beginPath(); dCtx.moveTo(ev.offsetX, ev.offsetY); ev.preventDefault(); });
    dCanvas.addEventListener('pointermove', function(ev) { if (!drawing) return; dCtx.lineTo(ev.offsetX, ev.offsetY); dCtx.stroke(); });
    dCanvas.addEventListener('pointerup', function() { drawing = false; });
    dCanvas.addEventListener('pointerleave', function() { drawing = false; });

    var colorPicker = pad.querySelector('#doodleColor');
    var colors = ['#1e293b','#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#fff'];
    var colorIdx = 0;
    colorPicker.addEventListener('click', function() { colorIdx = (colorIdx + 1) % colors.length; dCtx.strokeStyle = colors[colorIdx]; colorPicker.style.background = colors[colorIdx]; });

    pad.querySelector('#doodleClear').addEventListener('click', function() { dCtx.fillStyle = '#fff'; dCtx.fillRect(0, 0, dCanvas.width, dCanvas.height); });
    pad.querySelector('#doodleClose').addEventListener('click', closeDoodle);

    function closeDoodle() { overlay.remove(); doodleActive = false; }
  });

  // ===== 4. DAILY FORTUNE =====
  var fortunes = [
    '🌟 今天是幸运的一天','🍀 好运藏在努力里','💪 再坚持一下','🎯 目标越来越近',
    '🌈 雨过总会天晴','✨ 灵感就在转角','🦋 蝴蝶效应正在发生','🌻 向阳而生',
    '🔥 热情是最好的燃料','💎 你就是宝藏','🚀 今天效率翻倍','🎨 创意源源不断',
    '🌸 美好正在路上','⚡ 能量满满','🎪 生活像个游乐场','🌊 静水流深',
    '🍕 吃点好的犒劳自己','🎵 音乐是最好的解药','📚 书中自有黄金屋','🧘 深呼吸'
  ];

  function showFortune() {
    var today = new Date().toDateString();
    var saved = JSON.parse(localStorage.getItem('daily_fortune') || '{}');
    var fortune;
    if (saved.date === today) {
      fortune = saved.fortune;
    } else {
      fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      localStorage.setItem('daily_fortune', JSON.stringify({date: today, fortune: fortune}));
    }

    var fWidget = document.createElement('div');
    fWidget.id = 'fortuneWidget';
    fWidget.style.cssText = 'position:fixed;top:80px;right:16px;z-index:9990;'
      + 'background:var(--surface,#fff);border:1px solid var(--border);border-radius:12px;padding:8px 14px;'
      + 'font-size:.78rem;box-shadow:0 2px 12px rgba(0,0,0,.08);cursor:pointer;opacity:.8;transition:opacity .2s;max-width:180px';
    fWidget.innerHTML = '<span style="font-size:.65rem;color:var(--text-secondary)">今日签语</span><br>' + fortune;
    fWidget.addEventListener('mouseenter', function() { fWidget.style.opacity = '1'; });
    fWidget.addEventListener('mouseleave', function() { fWidget.style.opacity = '.8'; });
    fWidget.addEventListener('click', function() {
      var newF = fortunes[Math.floor(Math.random() * fortunes.length)];
      fWidget.innerHTML = '<span style="font-size:.65rem;color:var(--text-secondary)">今日签语</span><br>' + newF;
      localStorage.setItem('daily_fortune', JSON.stringify({date: today, fortune: newF}));
      // Tiny sparkle
      var spark = document.createElement('div');
      spark.textContent = '✨'; spark.style.cssText = 'position:fixed;top:'+(parseFloat(fWidget.style.top)-20)+'px;right:40px;font-size:1.2rem;pointer-events:none;animation:konamiPop .6s ease-out';
      document.body.appendChild(spark);
      setTimeout(function(){ spark.remove(); }, 700);
    });
    document.body.appendChild(fWidget);
  }

  // ===== CSS ANIMATIONS =====
  var style = document.createElement('style');
  style.textContent = '@keyframes konamiFall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(100vh) rotate(720deg)}}'
    + '@keyframes konamiPop{0%{transform:translate(-50%,-50%) scale(0);opacity:0}60%{transform:translate(-50%,-50%) scale(1.1)}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}'
    + '@keyframes konamiRainbow{0%{opacity:.3}100%{opacity:0}}';
  document.head.appendChild(style);

  function place() {
    if (document.body) {
      showFortune();
    }
  }
  if (document.readyState !== 'loading') place();
  else document.addEventListener('DOMContentLoaded', place);

})();