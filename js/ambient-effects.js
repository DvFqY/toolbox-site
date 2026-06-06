// 氛围特效：柔和粒子背景 + 鼠标拖尾 + 点击音效
(function(){
  if (window.__ambientLoaded) return;
  window.__ambientLoaded = true;

  // ===== 点击音效 =====
  function playClickSound() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var t = ctx.currentTime;

      // Soft chime - two quick sine tones
      [800, 1200].forEach(function(freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.12, t + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + 0.3);
      });
    } catch(e) {}
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('#musicPlayerBtn')) return;
    playClickSound();
    // Ripple at click position
    spawnRipple(e.clientX, e.clientY);
  });

  // ===== 点击涟漪 =====
  function spawnRipple(x, y) {
    var ripple = document.createElement('div');
    ripple.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;'
      + 'left:' + (x - 12) + 'px;top:' + (y - 12) + 'px;'
      + 'width:24px;height:24px;border-radius:50%;'
      + 'border:1.5px solid rgba(99,102,241,.4);'
      + 'animation:rippleOut .6s ease-out forwards;';
    document.body.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 700);
  }

  // Ripple keyframes
  var rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleOut{0%{transform:scale(0);opacity:1}100%{transform:scale(3);opacity:0}}';
  document.head.appendChild(rippleStyle);

  // ===== 鼠标拖尾 =====
  var trailDots = [];
  var maxTrail = 12;
  var mouseX = -100, mouseY = -100;
  var trailContainer = document.createElement('div');
  trailContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9997;';
  document.body.appendChild(trailContainer);

  // Create trail dot elements
  for (var i = 0; i < maxTrail; i++) {
    var dot = document.createElement('div');
    dot.style.cssText = 'position:fixed;width:6px;height:6px;border-radius:50%;'
      + 'background:rgba(99,102,241,.25);pointer-events:none;'
      + 'transform:translate(-50%,-50%);transition:opacity .3s;opacity:0;'
      + 'box-shadow:0 0 8px rgba(99,102,241,.15);';
    trailContainer.appendChild(dot);
    trailDots.push({ el: dot, x: -100, y: -100 });
  }

  var trailIdx = 0;
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trailDots[trailIdx].x = mouseX;
    trailDots[trailIdx].y = mouseY;
    trailDots[trailIdx].el.style.opacity = '0.6';
    trailIdx = (trailIdx + 1) % maxTrail;
  });

  function updateTrail() {
    for (var i = 0; i < trailDots.length; i++) {
      var dot = trailDots[i];
      var dx = mouseX - dot.x;
      var dy = mouseY - dot.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 3) {
        dot.x += dx * 0.25;
        dot.y += dy * 0.25;
      }
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top = dot.y + 'px';
      dot.el.style.opacity = Math.max(0, parseFloat(dot.el.style.opacity) - 0.015);
    }
    requestAnimationFrame(updateTrail);
  }
  updateTrail();

  // ===== 柔和粒子背景（canvas） =====
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 30;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create soft floating particles
  for (var i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: 0.08 + Math.random() * 0.12,
      hue: 230 + Math.random() * 30
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle gradient background
    var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, 'rgba(238,242,255,0.15)');
    grad.addColorStop(0.5, 'rgba(248,250,252,0.1)');
    grad.addColorStop(1, 'rgba(238,242,255,0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ',70%,65%,' + p.opacity + ')';
      ctx.fill();

      // Soft glow
      var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      glow.addColorStop(0, 'hsla(' + p.hue + ',70%,65%,' + (p.opacity * 0.5) + ')');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ===== 卡片悬停微光 =====
  document.addEventListener('mouseover', function(e) {
    var card = e.target.closest('.tool-card');
    if (!card) return;
    card.style.transition = 'all .3s ease, box-shadow .3s ease';
  });

})();