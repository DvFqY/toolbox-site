(function(){
  if (window.__easterLoaded) return;
  window.__easterLoaded = true;

  // ===== CSS =====
  var s = document.createElement('style');
  s.textContent = '@keyframes efxFall{0%{transform:translateY(-10px) rotate(0)}100%{transform:translateY(105vh) rotate(900deg)}}'
    + '@keyframes efxPop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}'
    + '@keyframes efxFlash{0%{opacity:.35}100%{opacity:0}}'
    + '@keyframes efxFadeIn{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(s);

  function toast(html, dur) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:50%;left:50%;z-index:99999;background:var(--surface,#fff);border:2px solid var(--primary);padding:14px 28px;border-radius:14px;font-weight:700;font-size:.95rem;box-shadow:0 12px 40px rgba(0,0,0,.2);animation:efxPop .4s ease-out';
    el.innerHTML = html;
    document.body.appendChild(el);
    setTimeout(function(){ el.remove(); }, dur || 2500);
  }

  // ===== 1. KONAMI CODE: ↑↑↓↓←→←→BA =====
  (function(){
    var seq = [38,38,40,40,37,39,37,39,66,65];
    var idx = 0;
    document.addEventListener('keydown', function(e){
      if (e.keyCode === seq[idx]) { idx++; if (idx === seq.length) { idx = 0; fire(); } }
      else { idx = (e.keyCode === 38) ? 1 : 0; }
    });
    function fire(){
      for (var i=0;i<60;i++){var c=document.createElement('div');c.style.cssText='position:fixed;z-index:99999;pointer-events:none;width:'+(5+Math.random()*8)+'px;height:'+(4+Math.random()*8)+'px;background:hsl('+Math.random()*360+',80%,60%);border-radius:2px;left:'+Math.random()*window.innerWidth+'px;top:-20px;animation:efxFall '+(2+Math.random()*2.5)+'s linear forwards;';document.body.appendChild(c);setTimeout(function(){c.remove()},3500)}
      var f = document.createElement('div');f.style.cssText='position:fixed;inset:0;z-index:99998;pointer-events:none;animation:efxFlash .7s ease-out;background:linear-gradient(90deg,red,orange,yellow,green,blue,indigo,violet)';document.body.appendChild(f);setTimeout(function(){f.remove()},800);
      toast('🎮 <b>科乐美密技发现!</b><br><small>↑↑↓↓←→←→BA</small>', 3000);
      try{var a=new AudioContext();[523,659,784,1047].forEach(function(fr,i){var o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.value=fr;g.gain.setValueAtTime(.04,a.currentTime+i*.1);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+i*.1+.15);o.connect(g);g.connect(a.destination);o.start(a.currentTime+i*.1);o.stop(a.currentTime+i*.1+.2)})}catch(e){}
    }
  })();

  // ===== 2. PET EVOLUTION =====
  (function(){
    var clicks = parseInt(localStorage.getItem('pet_clicks')||'0');
    var levels = ['🐱 小猫咪','🎀 蝴蝶结猫','😎 墨镜猫','👑 皇冠猫','🌈 彩虹猫','🚀 宇宙猫'];
    var observer = new MutationObserver(function(){
      var pet = document.getElementById('webPet');
      if (pet && !pet.dataset.evoHooked) {
        pet.dataset.evoHooked = '1';
        pet.addEventListener('click', function(ev){
          ev.stopPropagation();
          clicks++;
          localStorage.setItem('pet_clicks', clicks);
          var lvl = Math.min(Math.floor(clicks/15), levels.length-1);
          if (clicks % 15 === 0 && lvl > 0) {
            toast(levels[lvl-1] + ' → <b>' + levels[lvl] + '</b>!<br><small>Lv.'+lvl+'</small>', 2800);
          }
        });
      }
    });
    observer.observe(document.body, {childList:true,subtree:true});
  })();

  // ===== 3. DOODLE PAD =====
  (function(){
    document.addEventListener('dblclick', function(e){
      if (e.target.closest('button,a,input,textarea,canvas,#webPet')) return;
      if (document.getElementById('doodleOverlay')) return;

      var overlay = document.createElement('div');
      overlay.id = 'doodleOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;animation:efxFadeIn .25s ease-out';
      overlay.addEventListener('click', function(ev){ if (ev.target === overlay) overlay.remove(); });

      var W = Math.min(520, window.innerWidth-40);
      var H = Math.min(420, window.innerHeight-120);
      var pad = document.createElement('div');
      pad.style.cssText = 'background:var(--surface,#fff);border-radius:16px;padding:12px;box-shadow:0 20px 60px rgba(0,0,0,.35)';
      pad.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px"><b>✏️ 涂鸦</b><div style="display:flex;gap:6px;align-items:center"><div id="dColor" style="width:22px;height:22px;border-radius:50%;border:2px solid #999;background:#1e293b;cursor:pointer"></div><button id="dClear" style="border:1px solid #ccc;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:.78rem;background:var(--surface);color:var(--text)">清空</button><button id="dClose" style="border:none;background:none;font-size:1.3rem;cursor:pointer;color:var(--text);padding:0 4px">×</button></div></div>';

      var cvs = document.createElement('canvas');
      cvs.width = W; cvs.height = H;
      cvs.style.cssText = 'border:1px solid var(--border);border-radius:8px;cursor:crosshair;display:block;background:#fff';
      pad.appendChild(cvs);
      overlay.appendChild(pad);
      document.body.appendChild(overlay);

      var ctx = cvs.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      var drawing = false;
      cvs.addEventListener('pointerdown', function(ev){ drawing=true; ctx.beginPath(); ctx.moveTo(ev.offsetX,ev.offsetY); ev.preventDefault(); });
      cvs.addEventListener('pointermove', function(ev){ if(!drawing)return; ctx.lineTo(ev.offsetX,ev.offsetY); ctx.stroke(); });
      cvs.addEventListener('pointerup', function(){ drawing=false; });
      cvs.addEventListener('pointerleave', function(){ drawing=false; });

      var colors = ['#1e293b','#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'];
      var ci = 0;
      pad.querySelector('#dColor').addEventListener('click', function(){ ci=(ci+1)%colors.length; ctx.strokeStyle=colors[ci]; this.style.background=colors[ci]; });
      pad.querySelector('#dClear').addEventListener('click', function(){ ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H); });
      pad.querySelector('#dClose').addEventListener('click', function(){ overlay.remove(); });
    });
  })();

  // ===== 4. DAILY FORTUNE =====
  (function(){
    var fortunes = ['🌟 今天是幸运的一天','🍀 好运藏在努力里','💪 再坚持一下','🎯 目标越来越近','🌈 雨过总会天晴','✨ 灵感就在转角','🦋 蝴蝶效应正在发生','🌻 向阳而生','🔥 热情是最好的燃料','💎 你就是宝藏','🚀 今天效率翻倍','🎨 创意源源不断','🌸 美好正在路上','⚡ 能量满满','🎪 生活像个游乐场','🌊 静水流深'];
    var today = new Date().toDateString();
    var saved = JSON.parse(localStorage.getItem('daily_fortune')||'{}');
    var fortune = (saved.date===today) ? saved.fortune : fortunes[Math.floor(Math.random()*fortunes.length)];
    if (saved.date !== today) localStorage.setItem('daily_fortune', JSON.stringify({date:today,fortune:fortune}));

    function show(){
      var w = document.createElement('div');
      w.id = 'fortuneWidget';
      w.style.cssText = 'position:fixed;top:80px;right:16px;z-index:9990;background:var(--surface,#fff);border:1px solid var(--border);border-radius:12px;padding:8px 14px;font-size:.78rem;box-shadow:0 2px 12px rgba(0,0,0,.08);cursor:pointer;opacity:.82;transition:opacity .2s;max-width:180px;animation:efxFadeIn .4s ease-out';
      w.innerHTML = '<span style="font-size:.65rem;color:var(--text-secondary)">🔮 今日签语</span><br>'+fortune;
      w.addEventListener('mouseenter',function(){w.style.opacity='1'});
      w.addEventListener('mouseleave',function(){w.style.opacity='.82'});
      w.addEventListener('click',function(){
        var nf = fortunes[Math.floor(Math.random()*fortunes.length)];
        w.innerHTML = '<span style="font-size:.65rem;color:var(--text-secondary)">🔮 今日签语</span><br>'+nf;
        localStorage.setItem('daily_fortune',JSON.stringify({date:today,fortune:nf}));
      });
      document.body.appendChild(w);
    }
    if (document.body) show();
    else document.addEventListener('DOMContentLoaded', show);
  })();

})();