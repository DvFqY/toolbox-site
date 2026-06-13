(function(){
if(window.__neteaseLoaded)return;
window.__neteaseLoaded=1;

var audio = null;
var isPlaying = false;
var isOpen = false;

function togglePlay() {
  if(!audio) {
    audio = new Audio('https://music.163.com/song/media/outer/url?id=536098339.mp3');
    audio.loop = false;
    audio.onended = function(){
      isPlaying = false;
      playBtn.innerHTML = '▶';
      playBtn.style.background = 'linear-gradient(135deg,#f97316,#ea580c)';
    };
    audio.onerror = function(){
      statusEl.textContent = '⚠ 加载失败，请重试';
      isPlaying = false;
      playBtn.innerHTML = '▶';
    };
    audio.oncanplay = function(){
      statusEl.textContent = '♫ Lucky - 徐梦圆';
    };
  }
  
  if(isPlaying) {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '▶';
    playBtn.style.background = 'linear-gradient(135deg,#f97316,#ea580c)';
  } else {
    audio.currentTime = 0;
    audio.play().then(function(){
      isPlaying = true;
      playBtn.innerHTML = '⏸';
      playBtn.style.background = 'linear-gradient(135deg,#ea580c,#dc2626)';
      statusEl.textContent = '♫ 正在播放: Lucky - 徐梦圆';
    }).catch(function(e){
      statusEl.textContent = '⚠ 播放失败: ' + e.message;
    });
  }
}

// Build UI
var wrapper = document.createElement('div');
wrapper.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:6px';

// Main button - play/pause
var playBtn = document.createElement('div');
playBtn.innerHTML = '▶';
playBtn.title = '播放 Lucky - 徐梦圆 (纯音乐)';
playBtn.style.cssText = 'width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ea580c);border:2px solid #fed7aa;display:flex;align-items:center;justify-content:center;font-size:1.3rem;cursor:pointer;transition:all .3s;box-shadow:0 2px 12px rgba(249,115,22,.3);user-select:none';
playBtn.onmouseenter = function(){playBtn.style.transform='scale(1.12)';playBtn.style.boxShadow='0 4px 20px rgba(249,115,22,.45)'};
playBtn.onmouseleave = function(){playBtn.style.transform='scale(1)';playBtn.style.boxShadow='0 2px 12px rgba(249,115,22,.3)'};
playBtn.onclick = function(e){e.stopPropagation();togglePlay()};

// Status tooltip
var statusEl = document.createElement('div');
statusEl.textContent = '♫ Lucky - 徐梦圆';
statusEl.style.cssText = 'position:absolute;bottom:54px;right:0;background:rgba(255,255,255,.9);border:1px solid #fed7aa;border-radius:8px;padding:4px 10px;font-size:.75rem;color:#9a3412;white-space:nowrap;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.08)';

wrapper.style.position = 'relative';
wrapper.appendChild(statusEl);
wrapper.appendChild(playBtn);

function mount(){
  if(document.body){
    document.body.appendChild(wrapper);
  }
}
if(document.readyState !== 'loading') mount();
else document.addEventListener('DOMContentLoaded', mount);
})();