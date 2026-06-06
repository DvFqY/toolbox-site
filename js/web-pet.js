// Webpage Pet v2 - pixel art cute cat
(function(){
  if (window.__petLoaded) return;
  window.__petLoaded = true;

  var container = document.createElement('div');
  container.id = 'webPet';
  container.style.cssText = 'position:fixed;bottom:80px;left:20px;z-index:9998;cursor:pointer;user-select:none;';

  var canvas = document.createElement('canvas');
  canvas.width = 96; canvas.height = 96;
  canvas.style.cssText = 'width:64px;height:64px;image-rendering:pixelated;transition:transform .3s';
  container.appendChild(canvas);

  var bubble = document.createElement('div');
  bubble.id = 'petBubble';
  bubble.style.cssText = 'position:absolute;top:-32px;left:50%;transform:translateX(-50%);background:var(--surface,#fff);border:1px solid var(--border);border-radius:10px;padding:3px 10px;font-size:.72rem;white-space:nowrap;opacity:0;transition:opacity .3s;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.1)';
  container.appendChild(bubble);
  document.body.appendChild(container);

  var ctx = canvas.getContext('2d');
  var frame = 0, blinkTimer = 0, tailPhase = 0;
  var isBlinking = false, blinkCount = 0;
  var clickCount = 0;
  var msgs = ['喵~','你好!','🐱','摸我!','呼噜噜','❤️','喵呜!'];

  function say(t){bubble.textContent=t;bubble.style.opacity='1';clearTimeout(bubble._t);bubble._t=setTimeout(function(){bubble.style.opacity='0'},2200)}

  function drawCat(blink){
    ctx.clearRect(0,0,96,96);
    var c=ctx;

    // Tail
    var tx=28+Math.sin(tailPhase)*8;
    var ty=70+Math.cos(tailPhase)*6;
    c.strokeStyle='#f59e0b';c.lineWidth=6;c.lineCap='round';
    c.beginPath();c.moveTo(40,68);c.quadraticCurveTo(52+Math.sin(tailPhase)*6,68+Math.cos(tailPhase)*8,tx,ty);c.stroke();
    c.strokeStyle='#fbbf24';c.lineWidth=3;
    c.beginPath();c.moveTo(40,68);c.quadraticCurveTo(52+Math.sin(tailPhase)*6,68+Math.cos(tailPhase)*8,tx,ty);c.stroke();

    // Body - round
    c.fillStyle='#fbbf24';c.beginPath();c.ellipse(40,60,22,20,0,0,Math.PI*2);c.fill();
    // Body shadow
    c.fillStyle='#f59e0b';c.beginPath();c.ellipse(40,66,20,12,0,0,Math.PI*2);c.fill();
    // Belly
    c.fillStyle='#fef3c7';c.beginPath();c.ellipse(40,62,13,12,0,0,Math.PI*2);c.fill();
    // Paws
    c.fillStyle='#fbbf24';c.beginPath();c.ellipse(24,72,8,5,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(56,72,8,5,0,0,Math.PI*2);c.fill();
    c.fillStyle='#fef3c7';c.beginPath();c.ellipse(24,72,4,3,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(56,72,4,3,0,0,Math.PI*2);c.fill();

    // Head
    c.fillStyle='#fbbf24';c.beginPath();c.ellipse(40,42,20,18,0,0,Math.PI*2);c.fill();
    // Ears
    c.fillStyle='#fbbf24';c.beginPath();c.moveTo(22,36);c.lineTo(18,18);c.lineTo(30,28);c.fill();
    c.beginPath();c.moveTo(58,36);c.lineTo(62,18);c.lineTo(50,28);c.fill();
    // Inner ears
    c.fillStyle='#fca5a5';c.beginPath();c.moveTo(24,34);c.lineTo(21,22);c.lineTo(29,30);c.fill();
    c.beginPath();c.moveTo(56,34);c.lineTo(59,22);c.lineTo(51,30);c.fill();

    // Eyes
    var eyeY = blink ? 42 : 38;
    c.fillStyle='#fff';c.beginPath();c.ellipse(32,eyeY,7,blink?1:8,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(48,eyeY,7,blink?1:8,0,0,Math.PI*2);c.fill();
    if (!blink) {
      c.fillStyle='#1e293b';c.beginPath();c.ellipse(33,40,4.5,5.5,0,0,Math.PI*2);c.fill();
      c.beginPath();c.ellipse(49,40,4.5,5.5,0,0,Math.PI*2);c.fill();
      // Eye shine
      c.fillStyle='#fff';c.beginPath();c.arc(35,37,2.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(51,37,2.5,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(32,40,1,0,Math.PI*2);c.fill();
      c.beginPath();c.arc(48,40,1,0,Math.PI*2);c.fill();
    }

    // Nose
    c.fillStyle='#fca5a5';c.beginPath();c.moveTo(40,45);c.lineTo(37,49);c.lineTo(43,49);c.fill();
    // Mouth
    c.strokeStyle='#92400e';c.lineWidth=1;c.beginPath();c.moveTo(40,49);c.lineTo(40,52);c.stroke();
    c.beginPath();c.moveTo(40,52);c.quadraticCurveTo(36,54,34,51);c.stroke();
    c.beginPath();c.moveTo(40,52);c.quadraticCurveTo(44,54,46,51);c.stroke();

    // Whiskers
    c.strokeStyle='#d97706';c.lineWidth=.8;
    c.beginPath();c.moveTo(24,47);c.lineTo(10,44);c.stroke();
    c.beginPath();c.moveTo(24,49);c.lineTo(10,49);c.stroke();
    c.beginPath();c.moveTo(24,51);c.lineTo(10,54);c.stroke();
    c.beginPath();c.moveTo(56,47);c.lineTo(70,44);c.stroke();
    c.beginPath();c.moveTo(56,49);c.lineTo(70,49);c.stroke();
    c.beginPath();c.moveTo(56,51);c.lineTo(70,54);c.stroke();

    // Blush
    c.fillStyle='rgba(252,165,165,.35)';c.beginPath();c.ellipse(26,50,5,3,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(54,50,5,3,0,0,Math.PI*2);c.fill();
  }

  function jump(){canvas.style.transform='translateY(-20px)';setTimeout(function(){canvas.style.transform=''},250)}

  function animate(){
    frame++;
    tailPhase+=.06;
    if (isBlinking){blinkCount++;if(blinkCount>4){isBlinking=false;blinkCount=0}}else if(frame%70===0)isBlinking=true;
    if(frame%150===0&&Math.random()<.25)say(msgs[Math.floor(Math.random()*msgs.length)]);
    drawCat(isBlinking);
    requestAnimationFrame(animate);
  }

  container.addEventListener('click',function(e){
    e.stopPropagation();clickCount++;jump();
    if(clickCount%4===0){say('别戳啦!');canvas.style.transform='rotate(15deg)';setTimeout(function(){canvas.style.transform=''},300)}
    else if(clickCount%6===0){
      say('❤️');
      for(var i=0;i<4;i++){var h=document.createElement('div');h.textContent=['❤️','💕','💛','✨'][i];
        var r=container.getBoundingClientRect();
        h.style.cssText='position:fixed;left:'+(r.left+15+Math.random()*25)+'px;bottom:'+(window.innerHeight-r.bottom+10)+'px;font-size:.9rem;pointer-events:none;z-index:9999;animation:petFloat 1.2s ease-out forwards;';
        document.body.appendChild(h);setTimeout(function(){h.remove()},1300)}
    }else say(msgs[Math.floor(Math.random()*3)]);
  });

  var fs=document.createElement('style');fs.textContent='@keyframes petFloat{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-70px) scale(1.4)}}';
  document.head.appendChild(fs);

  setTimeout(function(){say('喵~ 你好!')},1500);
  animate();
})();