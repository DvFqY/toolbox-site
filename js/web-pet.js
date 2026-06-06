// Webpage Pet v4 - smooth vector cat, fully draggable
(function(){
  if (window.__petLoaded) return;
  window.__petLoaded = true;

  var container = document.createElement('div');
  container.id = 'webPet';
  container.style.cssText = 'position:fixed;bottom:80px;left:20px;top:auto;z-index:9998;cursor:grab;user-select:none;touch-action:none';

  var canvas = document.createElement('canvas');
  canvas.width = 140; canvas.height = 140;
  canvas.style.cssText = 'width:85px;height:85px;display:block';
  container.appendChild(canvas);

  var bubble = document.createElement('div');
  bubble.id = 'petBubble';
  bubble.style.cssText = 'position:absolute;top:-36px;left:50%;transform:translateX(-50%);background:var(--surface,#fff);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:3px 12px;font-size:.72rem;white-space:nowrap;opacity:0;transition:opacity .3s;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.12)';
  container.appendChild(bubble);
  document.body.appendChild(container);

  var ctx = canvas.getContext('2d');
  var frame = 0, isBlinking = false, blinkF = 0, clickCount = 0;
  var msgs = ['喵~','你好呀!','呼噜噜...','摸摸我!','❤️','好开心!','喵呜~','一起玩!'];

  function say(t){bubble.textContent=t;bubble.style.opacity='1';clearTimeout(bubble._t);bubble._t=setTimeout(function(){bubble.style.opacity='0'},2200)}

  function drawCat(blink){
    ctx.clearRect(0,0,140,140);
    var c=ctx;

    // Shadow
    c.fillStyle='rgba(0,0,0,.08)';c.beginPath();c.ellipse(70,132,40,6,0,0,Math.PI*2);c.fill();

    // === TAIL (behind) ===
    c.save();c.translate(40,105);c.rotate(.3+Math.sin(frame*.06)*.3);
    c.fillStyle='#f59e0b';c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-20,-10,-30,-25);c.quadraticCurveTo(-25,-30,-15,-20);c.quadraticCurveTo(-5,-5,0,0);c.fill();
    c.fillStyle='#fbbf24';c.beginPath();c.moveTo(-2,0);c.quadraticCurveTo(-18,-5,-28,-18);c.quadraticCurveTo(-24,-22,-15,-16);c.quadraticCurveTo(-5,-3,-2,0);c.fill();
    c.restore();

    // === BODY ===
    var bodyGrad=c.createLinearGradient(50,80,50,125);
    bodyGrad.addColorStop(0,'#fbbf24');bodyGrad.addColorStop(1,'#f59e0b');
    c.fillStyle=bodyGrad;c.beginPath();c.ellipse(70,108,30,24,0,0,Math.PI*2);c.fill();
    // Belly
    c.fillStyle='#fef3c7';c.beginPath();c.ellipse(70,112,20,15,0,0,Math.PI*2);c.fill();

    // === BACK PAWS ===
    c.fillStyle='#fbbf24';c.beginPath();c.ellipse(48,125,14,8,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(92,125,14,8,0,0,Math.PI*2);c.fill();
    c.fillStyle='#fef3c7';c.beginPath();c.ellipse(48,125,7,4,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(92,125,7,4,0,0,Math.PI*2);c.fill();
    // Toe beans
    c.fillStyle='#fca5a5';c.beginPath();c.arc(43,125,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(48,128,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(53,125,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(87,125,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(92,128,2.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(97,125,2.5,0,Math.PI*2);c.fill();

    // === FRONT PAWS ===
    c.fillStyle='#fbbf24';c.beginPath();c.ellipse(55,118,10,7,.2,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(85,118,10,7,-.2,0,Math.PI*2);c.fill();
    c.fillStyle='#fef3c7';c.beginPath();c.ellipse(55,118,5,3.5,.2,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(85,118,5,3.5,-.2,0,Math.PI*2);c.fill();

    // === HEAD ===
    var headGrad=c.createRadialGradient(65,60,5,70,65,40);
    headGrad.addColorStop(0,'#fef3c7');headGrad.addColorStop(.3,'#fde68a');headGrad.addColorStop(1,'#fbbf24');
    c.fillStyle=headGrad;c.beginPath();c.ellipse(70,65,32,30,0,0,Math.PI*2);c.fill();

    // === EARS ===
    c.fillStyle='#fbbf24';c.beginPath();c.moveTo(42,55);c.lineTo(28,20);c.lineTo(55,42);c.fill();
    c.beginPath();c.moveTo(98,55);c.lineTo(112,20);c.lineTo(85,42);c.fill();
    c.fillStyle='#fca5a5';c.beginPath();c.moveTo(46,52);c.lineTo(36,28);c.lineTo(54,45);c.fill();
    c.beginPath();c.moveTo(94,52);c.lineTo(104,28);c.lineTo(86,45);c.fill();

    // === EYES ===
    if (blink) {
      c.strokeStyle='#1e293b';c.lineWidth=2.5;c.lineCap='round';
      c.beginPath();c.moveTo(53,63);c.lineTo(67,63);c.stroke();
      c.beginPath();c.moveTo(73,63);c.lineTo(87,63);c.stroke();
    } else {
      // Eye whites
      c.fillStyle='#fff';c.beginPath();c.ellipse(60,62,11,12,0,0,Math.PI*2);c.fill();
      c.beginPath();c.ellipse(80,62,11,12,0,0,Math.PI*2);c.fill();
      // Irises
      var irisGrad=c.createRadialGradient(58,60,2,60,62,9);
      irisGrad.addColorStop(0,'#1e293b');irisGrad.addColorStop(.6,'#334155');irisGrad.addColorStop(1,'#475569');
      c.fillStyle=irisGrad;c.beginPath();c.ellipse(60,62,7.5,9,0,0,Math.PI*2);c.fill();
      c.fillStyle=irisGrad;c.beginPath();c.ellipse(80,62,7.5,9,0,0,Math.PI*2);c.fill();
      // Pupils
      c.fillStyle='#000';c.beginPath();c.arc(60,62,4,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(80,62,4,0,Math.PI*2);c.fill();
      // Shine
      c.fillStyle='#fff';c.beginPath();c.arc(63,57,3.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(83,57,3.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(57,64,1.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(77,64,1.5,0,Math.PI*2);c.fill();
    }

    // === NOSE ===
    c.fillStyle='#fca5a5';c.beginPath();c.moveTo(70,73);c.lineTo(65,78);c.lineTo(75,78);c.fill();
    // Nose shine
    c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.arc(68,74,1.5,0,Math.PI*2);c.fill();

    // === MOUTH ===
    c.strokeStyle='#92400e';c.lineWidth=1.2;c.lineCap='round';
    c.beginPath();c.moveTo(70,78);c.lineTo(70,82);c.stroke();
    c.beginPath();c.moveTo(70,82);c.quadraticCurveTo(62,85,58,80);c.stroke();
    c.beginPath();c.moveTo(70,82);c.quadraticCurveTo(78,85,82,80);c.stroke();

    // === WHISKERS ===
    c.strokeStyle='#d97706';c.lineWidth=.8;c.lineCap='round';
    c.beginPath();c.moveTo(42,72);c.quadraticCurveTo(25,68,16,65);c.stroke();
    c.beginPath();c.moveTo(40,76);c.quadraticCurveTo(22,76,14,76);c.stroke();
    c.beginPath();c.moveTo(42,80);c.quadraticCurveTo(25,84,16,87);c.stroke();
    c.beginPath();c.moveTo(98,72);c.quadraticCurveTo(115,68,124,65);c.stroke();
    c.beginPath();c.moveTo(100,76);c.quadraticCurveTo(118,76,126,76);c.stroke();
    c.beginPath();c.moveTo(98,80);c.quadraticCurveTo(115,84,124,87);c.stroke();

    // === BLUSH ===
    c.fillStyle='rgba(252,165,165,.3)';c.beginPath();c.ellipse(48,74,7,4,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(92,74,7,4,0,0,Math.PI*2);c.fill();

    // === FOREHEAD STRIPES ===
    c.strokeStyle='#f59e0b';c.lineWidth=1.5;c.lineCap='round';
    c.beginPath();c.moveTo(64,45);c.lineTo(66,40);c.stroke();
    c.beginPath();c.moveTo(70,43);c.lineTo(70,37);c.stroke();
    c.beginPath();c.moveTo(76,45);c.lineTo(74,40);c.stroke();
  }

  function jumpAnim(){canvas.style.transform='translateY(-12px) scale(1.08)';setTimeout(function(){canvas.style.transform=''},200)}

  // ===== DRAG (fixed) =====
  var dragging=false,startX=0,startY=0,petX=20,petTop=0;
  function updatePos(){
    container.style.left=petX+'px';
    container.style.top=petTop+'px';
    container.style.bottom='auto';
  }
  // Get initial top position
  petTop=window.innerHeight-80-85;
  updatePos();

  container.addEventListener('pointerdown',function(e){
    dragging=true;container.style.cursor='grabbing';container.setPointerCapture(e.pointerId);
    var rect=container.getBoundingClientRect();
    startX=e.clientX-rect.left;
    startY=e.clientY-rect.top;
    e.preventDefault();e.stopPropagation();
  });

  container.addEventListener('pointermove',function(e){
    if(!dragging)return;
    petX=e.clientX-startX;
    petTop=e.clientY-startY;
    petX=Math.max(-30,Math.min(window.innerWidth-60,petX));
    petTop=Math.max(60,Math.min(window.innerHeight-100,petTop));
    updatePos();
    e.preventDefault();
  });

  container.addEventListener('pointerup',function(e){
    if(!dragging)return;
    dragging=false;container.style.cursor='grab';container.releasePointerCapture(e.pointerId);
    // Return to bottom if too high
    if(petTop<window.innerHeight-180){var startTop=petTop;var targetTop=window.innerHeight-165;var animStart=performance.now();
      function bounceBack(ts){var p=(ts-animStart)/400;if(p>=1){petTop=targetTop;updatePos();return}
        petTop=startTop+(targetTop-startTop)*p;updatePos();requestAnimationFrame(bounceBack)}
      requestAnimationFrame(bounceBack)
    }
  });

  // Click (only if not dragged)
  var moved=false;
  container.addEventListener('pointerdown',function(){moved=false});
  container.addEventListener('pointermove',function(){if(dragging&&(Math.abs(petX-20)>5||Math.abs(petTop-(window.innerHeight-165))>5))moved=true});
  container.addEventListener('pointerup',function(e){
    if(moved)return;
    clickCount++;jumpAnim();
    if(clickCount%4===0){say('别戳啦!');canvas.style.transform='rotate(8deg)';setTimeout(function(){canvas.style.transform=''},250)}
    else if(clickCount%7===0){say('❤️');
      for(var i=0;i<5;i++){var h=document.createElement('div');h.textContent=['❤️','💕','💛','✨','🌟'][i];
        var r=container.getBoundingClientRect();
        h.style.cssText='position:fixed;left:'+(r.left+20+Math.random()*40)+'px;bottom:'+(window.innerHeight-r.bottom+10)+'px;font-size:.85rem;pointer-events:none;z-index:9999;animation:petF2 1.1s ease-out forwards;';
        document.body.appendChild(h);setTimeout(function(){h.remove()},1200)}
    }else say(msgs[Math.floor(Math.random()*3)]);
  });

  var sty=document.createElement('style');sty.textContent='@keyframes petF2{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px) scale(1.3)}}';
  document.head.appendChild(sty);

  function animate(){
    frame++;
    if(isBlinking){blinkF++;if(blinkF>5){isBlinking=false;blinkF=0}}else if(frame%90===0)isBlinking=true;
    if(frame%250===0&&Math.random()<.15)say(msgs[Math.floor(Math.random()*msgs.length)]);
    drawCat(isBlinking);requestAnimationFrame(animate);
  }

  setTimeout(function(){say('喵~ 你好!')},1500);
  animate();
})();