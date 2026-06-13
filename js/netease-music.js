(function(){
if(window.__neteaseLoaded)return;
window.__neteaseLoaded=1;

var isOpen = false;
var iframe = null;

// Build UI
var wrapper = document.createElement('div');
wrapper.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:6px';

// Toggle button
var toggleBtn = document.createElement('div');
toggleBtn.innerHTML = '🎵';
toggleBtn.title = '网易云音乐 - Lucky (纯音乐)';
toggleBtn.style.cssText = 'width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ea580c);border:2px solid #fed7aa;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;transition:all .3s;box-shadow:0 2px 12px rgba(249,115,22,.3);user-select:none';
toggleBtn.onmouseenter = function(){toggleBtn.style.transform='scale(1.12)';toggleBtn.style.boxShadow='0 4px 20px rgba(249,115,22,.45)'};
toggleBtn.onmouseleave = function(){toggleBtn.style.transform='scale(1)';toggleBtn.style.boxShadow='0 2px 12px rgba(249,115,22,.3)'};

// Player panel
var panel = document.createElement('div');
panel.style.cssText = 'display:none;width:300px;background:rgba(255,255,255,.95);border-radius:14px;border:1px solid #fed7aa;box-shadow:0 8px 32px rgba(249,115,22,.2);overflow:hidden;backdrop-filter:blur(12px)';

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

// Song info
var infoEl = document.createElement('div');
infoEl.style.cssText = 'padding:14px 16px 8px;text-align:center';
var nameEl = document.createElement('div');
nameEl.textContent = '♫ Lucky';
nameEl.style.cssText = 'font-size:1.1rem;font-weight:700;color:#431407';
var artistEl = document.createElement('div');
artistEl.textContent = '徐梦圆 (纯音乐)';
artistEl.style.cssText = 'font-size:.85rem;color:#9a3412;margin-top:2px';
infoEl.appendChild(nameEl);
infoEl.appendChild(artistEl);
panel.appendChild(infoEl);

// Player iframe
var playerArea = document.createElement('div');
playerArea.style.cssText = 'padding:8px 12px 12px';
var iframeContainer = document.createElement('div');
iframeContainer.style.cssText = 'border-radius:8px;overflow:hidden;height:66px';
iframe = document.createElement('iframe');
iframe.src = 'https://music.163.com/outchain/player?type=2&id=536098339&auto=0&height=66';
iframe.style.cssText = 'width:100%;height:66px;border:none';
iframeContainer.appendChild(iframe);
playerArea.appendChild(iframeContainer);
panel.appendChild(playerArea);

// Footer
var footer = document.createElement('div');
footer.style.cssText = 'padding:6px 16px;font-size:.75rem;color:#9a3412;text-align:center;border-top:1px solid #fed7aa;background:#fffbeb';
footer.textContent = '🎵 点击播放按钮开始';
panel.appendChild(footer);

wrapper.appendChild(panel);
wrapper.appendChild(toggleBtn);

function togglePanel() {
  isOpen = !isOpen;
  panel.style.display = isOpen ? 'block' : 'none';
  toggleBtn.innerHTML = isOpen ? '✕' : '🎵';
  toggleBtn.style.background = isOpen ? 'linear-gradient(135deg,#ea580c,#dc2626)' : 'linear-gradient(135deg,#f97316,#ea580c)';
  // Reload iframe with auto=1 when opening
  if(isOpen) {
    iframe.src = 'https://music.163.com/outchain/player?type=2&id=536098339&auto=1&height=66';
    footer.textContent = '🎵 在播放器中点击 ▶ 播放';
  } else {
    iframe.src = 'https://music.163.com/outchain/player?type=2&id=536098339&auto=0&height=66';
  }
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