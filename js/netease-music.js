(function(){
if(window.__neteaseLoaded)return;
window.__neteaseLoaded=1;

var songs = [
  {id:"1901371647", name:"Lucky", artist:"Jason Mraz"},
  {id:"4153518",   name:"Lucky", artist:"Britney Spears"},
  {id:"29828366",  name:"Lucky", artist:"王源"},
  {id:"27591817",  name:"Lucky", artist:"李祥祥"},
  {id:"1373760780",name:"Lucky", artist:"队长"}
];

var currentIdx = 0;
var iframe = null;
var isOpen = false;

// Build UI
var wrapper = document.createElement('div');
wrapper.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:6px';

// Toggle button
var toggleBtn = document.createElement('div');
toggleBtn.innerHTML = '🎵';
toggleBtn.title = '网易云音乐 - Lucky';
toggleBtn.style.cssText = 'width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ea580c);border:2px solid #fed7aa;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;transition:all .3s;box-shadow:0 2px 12px rgba(249,115,22,.3);user-select:none';
toggleBtn.onmouseenter = function(){toggleBtn.style.transform='scale(1.12)';toggleBtn.style.boxShadow='0 4px 20px rgba(249,115,22,.45)'};
toggleBtn.onmouseleave = function(){toggleBtn.style.transform='scale(1)';toggleBtn.style.boxShadow='0 2px 12px rgba(249,115,22,.3)'};

// Player panel
var panel = document.createElement('div');
panel.style.cssText = 'display:none;width:320px;background:rgba(255,255,255,.95);border-radius:14px;border:1px solid #fed7aa;box-shadow:0 8px 32px rgba(249,115,22,.2);overflow:hidden;backdrop-filter:blur(12px)';

// Header
var header = document.createElement('div');
header.style.cssText = 'background:linear-gradient(135deg,#f97316,#ea580c);padding:12px 16px;display:flex;align-items:center;justify-content:space-between';
var titleEl = document.createElement('span');
titleEl.textContent = '🍊 网易云音乐';
titleEl.style.cssText = 'color:white;font-weight:700;font-size:.95rem';
var closeBtn = document.createElement('span');
closeBtn.innerHTML = '✕';
closeBtn.style.cssText = 'color:rgba(255,255,255,.7);cursor:pointer;font-size:1.1rem;padding:0 4px';
closeBtn.onclick = function(){togglePanel()};
header.appendChild(titleEl);
header.appendChild(closeBtn);
panel.appendChild(header);

// Song list
var listEl = document.createElement('div');
listEl.style.cssText = 'max-height:200px;overflow-y:auto;padding:4px 0';

songs.forEach(function(s, i){
  var item = document.createElement('div');
  item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 16px;cursor:pointer;transition:background .15s;border-left:3px solid transparent';
  item.dataset.idx = i;
  
  var num = document.createElement('span');
  num.textContent = (i+1);
  num.style.cssText = 'width:20px;text-align:center;color:#9a3412;font-size:.8rem;font-weight:600';
  
  var info = document.createElement('div');
  info.style.cssText = 'flex:1;min-width:0';
  var nameEl = document.createElement('div');
  nameEl.textContent = s.name;
  nameEl.style.cssText = 'font-size:.88rem;font-weight:600;color:#431407';
  var artistEl = document.createElement('div');
  artistEl.textContent = s.artist;
  artistEl.style.cssText = 'font-size:.75rem;color:#9a3412';
  info.appendChild(nameEl);
  info.appendChild(artistEl);
  
  var playIcon = document.createElement('span');
  playIcon.innerHTML = '▶';
  playIcon.style.cssText = 'color:#f97316;font-size:.8rem';
  
  item.appendChild(num);
  item.appendChild(info);
  item.appendChild(playIcon);
  
  item.onmouseenter = function(){this.style.background='#fff7ed'};
  item.onmouseleave = function(){this.style.background='transparent'};
  item.onclick = function(){playSong(parseInt(this.dataset.idx))};
  
  listEl.appendChild(item);
});
panel.appendChild(listEl);

// Player area
var playerArea = document.createElement('div');
playerArea.style.cssText = 'padding:8px 12px;background:#fff7ed;border-top:1px solid #fed7aa';
var playerTitle = document.createElement('div');
playerTitle.textContent = '▶ 正在播放: Lucky - Jason Mraz';
playerTitle.style.cssText = 'font-size:.8rem;color:#9a3412;margin-bottom:6px;font-weight:500';
playerArea.appendChild(playerTitle);

var iframeContainer = document.createElement('div');
iframeContainer.style.cssText = 'border-radius:8px;overflow:hidden;height:66px';
var iframeEl = document.createElement('iframe');
iframeEl.src = 'https://music.163.com/outchain/player?type=2&id=1901371647&auto=0&height=66';
iframeEl.style.cssText = 'width:100%;height:66px;border:none';
iframeContainer.appendChild(iframeEl);
playerArea.appendChild(iframeContainer);
panel.appendChild(playerArea);

// Now playing bar
var nowPlaying = document.createElement('div');
nowPlaying.style.cssText = 'padding:6px 16px;font-size:.75rem;color:#9a3412;text-align:center;border-top:1px solid #fed7aa;background:#fffbeb';
nowPlaying.textContent = '🎵 共5首 Lucky 歌曲';
panel.appendChild(nowPlaying);

wrapper.appendChild(panel);
wrapper.appendChild(toggleBtn);

function playSong(idx) {
  currentIdx = idx;
  var s = songs[idx];
  iframeEl.src = 'https://music.163.com/outchain/player?type=2&id=' + s.id + '&auto=1&height=66';
  playerTitle.textContent = '▶ 正在播放: ' + s.name + ' - ' + s.artist;
  
  // Highlight active
  listEl.querySelectorAll('div[data-idx]').forEach(function(el, i){
    if(i === idx) {
      el.style.background = '#fff7ed';
      el.style.borderLeftColor = '#f97316';
    } else {
      el.style.background = 'transparent';
      el.style.borderLeftColor = 'transparent';
    }
  });
  
  if(!isOpen) togglePanel();
}

function togglePanel() {
  isOpen = !isOpen;
  panel.style.display = isOpen ? 'block' : 'none';
  toggleBtn.innerHTML = isOpen ? '✕' : '🎵';
  toggleBtn.style.background = isOpen ? 'linear-gradient(135deg,#ea580c,#dc2626)' : 'linear-gradient(135deg,#f97316,#ea580c)';
}

toggleBtn.onclick = function(e){
  e.stopPropagation();
  togglePanel();
};

// Mount
function mount(){
  if(document.body){
    document.body.appendChild(wrapper);
  }
}
if(document.readyState !== 'loading') mount();
else document.addEventListener('DOMContentLoaded', mount);
})();