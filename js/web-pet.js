// Webpage Pet - cute companion
(function(){
  if (window.__petLoaded) return;
  window.__petLoaded = true;

  var container = document.createElement('div');
  container.id = 'webPet';
  container.style.cssText = 'position:fixed;bottom:80px;left:20px;z-index:9998;cursor:pointer;user-select:none;transition:transform .3s';

  var state = 'idle';
  var idleFrame = 0;
  var stateTimer = 0;
  var clickCount = 0;

  // Pet HTML - CSS-drawn cat
  container.innerHTML = '<div id="petBody" style="position:relative;width:60px;height:50px;transition:all .2s">'
    + '<div style="position:absolute;bottom:0;left:10px;width:40px;height:35px;background:linear-gradient(180deg,#fbbf24,#f59e0b);border-radius:50% 50% 45% 45%;box-shadow:0 4px 12px rgba(245,158,11,.3)"></div>'
    + '<div style="position:absolute;top:8px;left:14px;width:32px;height:22px;background:#fbbf24;border-radius:50%;box-shadow:0 2px 0 #f59e0b"></div>'
    + '<div style="position:absolute;top:14px;left:10px;width:7px;height:7px;background:#1e293b;border-radius:50%"></div>'
    + '<div style="position:absolute;top:14px;right:16px;width:7px;height:7px;background:#1e293b;border-radius:50%"></div>'
    + '<div style="position:absolute;top:19px;left:27px;width:3px;height:3px;background:#ef4444;border-radius:50%"></div>'
    + '<div style="position:absolute;top:19px;left:18px;width:3px;height:2px;background:#1e293b;border-radius:1px;transform:rotate(-15deg)"></div>'
    + '<div style="position:absolute;top:19px;right:18px;width:3px;height:2px;background:#1e293b;border-radius:1px;transform:rotate(15deg)"></div>'
    + '<div id="petTail" style="position:absolute;bottom:5px;right:-8px;width:14px;height:6px;background:#f59e0b;border-radius:0 8px 8px 0;transform-origin:left center;transition:transform .25s"></div>'
    + '<div style="position:absolute;bottom:-8px;left:16px;width:10px;height:10px;background:#f59e0b;border-radius:50%"></div>'
    + '<div style="position:absolute;bottom:-8px;right:16px;width:10px;height:10px;background:#f59e0b;border-radius:50%"></div>'
    + '</div>'
    + '<div id="petBubble" style="position:absolute;top:-36px;left:50%;transform:translateX(-50%);background:var(--surface,#fff);border:1px solid var(--border);border-radius:12px;padding:4px 10px;font-size:.75rem;white-space:nowrap;opacity:0;transition:opacity .3s;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.1)"></div>';

  document.body.appendChild(container);

  var body = document.getElementById('petBody');
  var tail = document.getElementById('petTail');
  var bubble = document.getElementById('petBubble');

  var messages = ['喵~','你好呀!','🐱','摸我!','咕噜咕噜','困了...','🖐️','喵呜!','❤️','好无聊'];

  function sayBubble(msg) {
    bubble.textContent = msg;
    bubble.style.opacity = '1';
    clearTimeout(bubble._timeout);
    bubble._timeout = setTimeout(function(){ bubble.style.opacity = '0'; }, 2000);
  }

  function wagTail() {
    tail.style.transform = 'rotate(25deg)';
    setTimeout(function(){ tail.style.transform = 'rotate(-25deg)'; }, 200);
    setTimeout(function(){ tail.style.transform = 'rotate(10deg)'; }, 400);
    setTimeout(function(){ tail.style.transform = 'rotate(0deg)'; }, 550);
  }

  function jumpAnim() {
    body.style.transform = 'translateY(-30px) scale(1.1)';
    setTimeout(function(){ body.style.transform = 'translateY(0) scale(1)'; }, 300);
  }

  function blinkAnim() {
    var eyes = body.querySelectorAll('div');
    // Find eye elements and blink
    var eyeEls = [];
    for(var i=0;i<body.children.length;i++) {
      var el = body.children[i];
      if (el.style.width === '7px' && el.style.height === '7px') eyeEls.push(el);
    }
    eyeEls.forEach(function(e){ e.style.height = '1px'; e.style.marginTop = '3px'; });
    setTimeout(function(){ eyeEls.forEach(function(e){ e.style.height = '7px'; e.style.marginTop = '0'; }); }, 120);
  }

  function idleAnim() {
    idleFrame++;
    if (idleFrame % 60 === 0) blinkAnim();
    if (idleFrame % 120 === 0) { wagTail(); }
    if (idleFrame % 300 === 0 && Math.random() < .3) {
      sayBubble(messages[Math.floor(Math.random() * messages.length)]);
    }
  }

  // Click interaction
  container.addEventListener('click', function(e) {
    e.stopPropagation();
    clickCount++;
    wagTail();
    jumpAnim();

    if (clickCount % 3 === 0) {
      sayBubble('喵呜~ 别戳了!');
      body.style.transform = 'rotate(15deg)';
      setTimeout(function(){ body.style.transform = 'rotate(0)'; }, 300);
    } else if (clickCount % 5 === 0) {
      sayBubble('❤️');
      // Create floating hearts
      for(var i=0;i<4;i++) {
        var heart = document.createElement('div');
        heart.textContent = ['❤️','💕','💛','✨'][i];
        heart.style.cssText = 'position:fixed;left:'+(container.getBoundingClientRect().left+20+Math.random()*30)+'px;'
          + 'bottom:'+(container.getBoundingClientRect().bottom-30)+'px;font-size:1rem;pointer-events:none;z-index:9999;'
          + 'animation:floatUp 1.2s ease-out forwards;';
        document.body.appendChild(heart);
        setTimeout(function(){ heart.remove(); }, 1300);
      }
    } else {
      sayBubble(messages[Math.floor(Math.random() * 5)]);
    }
  });

  // Idle loop
  setInterval(idleAnim, 200);

  // Float up animation for hearts
  var floatStyle = document.createElement('style');
  floatStyle.textContent = '@keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(1.5)}}';
  document.head.appendChild(floatStyle);

  // Welcome message
  setTimeout(function(){ sayBubble('喵~ 你好!'); }, 1500);
})();