// Webpage Pet v3 - cute pixel cat, draggable
(function(){
  if (window.__petLoaded) return;
  window.__petLoaded = true;

  var container = document.createElement('div');
  container.id = 'webPet';
  container.style.cssText = 'position:fixed;bottom:80px;left:20px;z-index:9998;cursor:grab;user-select:none;';

  var canvas = document.createElement('canvas');
  canvas.width = 120; canvas.height = 120;
  canvas.style.cssText = 'width:80px;height:80px;image-rendering:pixelated;transition:transform .25s;pointer-events:none';
  container.appendChild(canvas);

  var bubble = document.createElement('div');
  bubble.id = 'petBubble';
  bubble.style.cssText = 'position:absolute;top:-34px;left:50%;transform:translateX(-50%);background:var(--surface,#fff);border:1px solid var(--border);border-radius:10px;padding:3px 10px;font-size:.7rem;white-space:nowrap;opacity:0;transition:opacity .3s;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.1)';
  container.appendChild(bubble);
  document.body.appendChild(container);

  var ctx = canvas.getContext('2d');
  var frame = 0, isBlinking = false, blinkF = 0, tailF = 0;
  var clickCount = 0;
  var msgs = ['喵~','你好!','呼噜噜','摸我!','❤️','喵呜!','好困'];

  function say(t){bubble.textContent=t;bubble.style.opacity='1';clearTimeout(bubble._t);bubble._t=setTimeout(function(){bubble.style.opacity='0'},2200)}

  // ===== PIXEL ART CAT (chibi style) =====
  // Each "pixel" is 6x6 on the 120x120 canvas = 20x20 grid
  var PX = 6;

  function rect(x,y,w,h,color){
    ctx.fillStyle=color;ctx.fillRect(x*PX,y*PX,(w||1)*PX,(h||1)*PX);
  }

  function drawPixelCat(blink){
    ctx.clearRect(0,0,120,120);

    // Shadow under cat
    ctx.fillStyle='rgba(0,0,0,.1)';ctx.beginPath();ctx.ellipse(60,114,30,5,0,0,Math.PI*2);ctx.fill();

    // === TAIL (behind body) ===
    var tx = 14 + Math.sin(tailF)*3;
    var ty = 12 + Math.cos(tailF)*2;
    rect(13,12,1,1,'#f59e0b');rect(12,12,1,1,'#f59e0b');
    rect(11-Math.floor(Math.sin(tailF)*2),12-Math.floor(Math.cos(tailF)*1),1,1,'#fbbf24');

    // === BODY ===
    // Main body (chibi - small, round)
    rect(8,13,5,4,'#fbbf24'); // body top
    rect(7,14,7,4,'#fbbf24'); // body mid
    rect(8,18,5,1,'#f59e0b'); // body bottom shadow

    // Belly
    rect(9,15,3,2,'#fef3c7');

    // === PAWS ===
    // Front paws
    rect(7,17,2,2,'#fbbf24'); // left paw
    rect(12,17,2,2,'#fbbf24'); // right paw
    rect(7,18,2,1,'#fef3c7'); // left paw pad
    rect(12,18,2,1,'#fef3c7'); // right paw pad

    // Back paws (peeking out)
    rect(6,17,1,1,'#f59e0b');
    rect(14,17,1,1,'#f59e0b');

    // === HEAD (large - chibi proportion) ===
    rect(6,6,9,1,'#fbbf24'); // top of head
    rect(5,7,11,4,'#fbbf24'); // main head
    rect(6,11,9,2,'#fbbf24'); // lower head
    // Head outline/shadow bottom
    rect(6,12,9,1,'#f59e0b');

    // === EARS ===
    rect(5,5,1,2,'#fbbf24'); // left ear outer
    rect(4,4,2,2,'#fbbf24');
    rect(6,5,1,1,'#fca5a5'); // left ear inner

    rect(15,5,1,2,'#fbbf24'); // right ear outer
    rect(15,4,2,2,'#fbbf24');
    rect(14,5,1,1,'#fca5a5'); // right ear inner

    // === EYES ===
    if (blink) {
      // Blink - flat line
      rect(7,8,3,1,'#1e293b');
      rect(11,8,3,1,'#1e293b');
    } else {
      // Big cute eyes
      // Left eye - white
      rect(7,7,3,3,'#fff');
      rect(7,6,1,1,'#fff');
      // Left eye - iris
      rect(8,8,2,2,'#1e293b');
      // Left eye - shine
      rect(8,7,1,1,'#fff');
      rect(9,9,1,1,'#fff');

      // Right eye - white
      rect(11,7,3,3,'#fff');
      rect(12,6,1,1,'#fff');
      // Right eye - iris
      rect(12,8,2,2,'#1e293b');
      // Right eye - shine
      rect(12,7,1,1,'#fff');
      rect(13,9,1,1,'#fff');
    }

    // === NOSE ===
    rect(10,10,1,1,'#fca5a5');

    // === MOUTH ===
    rect(9,11,1,1,'#92400e');
    rect(11,11,1,1,'#92400e');
    rect(10,11,1,1,'#d97706');

    // === WHISKERS ===
    ctx.fillStyle='#d97706';
    ctx.fillRect(4*PX,9*PX,2*PX,1); // left whisker 1
    ctx.fillRect(4*PX,10*PX,2*PX,1); // left whisker 2
    ctx.fillRect(15*PX,9*PX,2*PX,1); // right whisker 1
    ctx.fillRect(15*PX,10*PX,2*PX,1); // right whisker 2

    // === BLUSH ===
    ctx.fillStyle='rgba(252,165,165,.4)';
    ctx.fillRect(6*PX,10*PX,2*PX,1); // left blush
    ctx.fillRect(13*PX,10*PX,2*PX,1); // right blush

    // === CHEEK FLUFF ===
    rect(5,10,1,1,'#fbbf24');
    rect(15,10,1,1,'#fbbf24');
  }

  function jump(){canvas.style.transform='translateY(-15px)';setTimeout(function(){canvas.style.transform=''},220)}

  // ===== DRAG =====
  var dragging = false, dragOX = 0, dragOY = 0, petX = 20, petY = 0;
  function updatePos(){container.style.left=petX+'px';container.style.bottom=(80-petY)+'px'}

  container.addEventListener('mousedown',function(e){
    if (e.button !== 0) return;
    dragging = true;
    container.style.cursor = 'grabbing';
    dragOX = e.clientX - container.getBoundingClientRect().left;
    dragOY = e.clientY - container.getBoundingClientRect().top;
    e.preventDefault();
  });

  document.addEventListener('mousemove',function(e){
    if (!dragging) return;
    petX = e.clientX - dragOX;
    petY = -(e.clientY - dragOY) + window.innerHeight - 80;
    petX = Math.max(-20, Math.min(window.innerWidth-60, petX));
    petY = Math.max(-window.innerHeight+100, Math.min(200, petY));
    updatePos();
  });

  document.addEventListener('mouseup',function(){
    if (dragging) {
      dragging = false;
      container.style.cursor = 'grab';
      // Bounce back to bottom area
      if (petY < -60) {
        petY = 0;
        var ani = container.animate([{bottom:container.style.bottom},{bottom:'80px'}],{duration:400,easing:'ease-out'});
        ani.onfinish = function(){petY=0;updatePos()};
      }
    }
  });

  // Click interaction
  container.addEventListener('click',function(e){
    if (dragging) return;
    clickCount++; jump();
    if (clickCount % 4 === 0) { say('别戳啦!'); canvas.style.transform='rotate(10deg)'; setTimeout(function(){canvas.style.transform=''},250) }
    else if (clickCount % 7 === 0) {
      say('❤️');
      for(var i=0;i<5;i++){var h=document.createElement('div');h.textContent=['❤️','💕','💛','✨','🌟'][i];
        var r=container.getBoundingClientRect();
        h.style.cssText='position:fixed;left:'+(r.left+15+Math.random()*30)+'px;bottom:'+(window.innerHeight-r.bottom+15)+'px;font-size:.85rem;pointer-events:none;z-index:9999;animation:petFloat2 1.1s ease-out forwards;';
        document.body.appendChild(h);setTimeout(function(){h.remove()},1200)}
    } else say(msgs[Math.floor(Math.random()*3)]);
  });

  var fs = document.createElement('style');
  fs.textContent = '@keyframes petFloat2{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px) scale(1.3)}}';
  document.head.appendChild(fs);

  // Animation loop
  function animate(){
    frame++;
    tailF += 0.08;
    if (isBlinking) { blinkF++; if (blinkF > 5) { isBlinking = false; blinkF = 0; } }
    else if (frame % 80 === 0) isBlinking = true;
    if (frame % 200 === 0 && Math.random() < .2) say(msgs[Math.floor(Math.random()*msgs.length)]);
    drawPixelCat(isBlinking);
    requestAnimationFrame(animate);
  }

  setTimeout(function(){say('喵~ 你好!')}, 1500);
  updatePos();
  animate();
})();