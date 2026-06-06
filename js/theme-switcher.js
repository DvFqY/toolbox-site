// Theme Switcher - Dark/Light toggle
(function(){
  if (window.__themeLoaded) return;
  window.__themeLoaded = true;

  var theme = localStorage.getItem('site_theme') || 'light';

  function applyTheme(t) {
    theme = t;
    localStorage.setItem('site_theme', t);
    var root = document.documentElement;
    if (t === 'dark') {
      root.style.setProperty('--bg', '#0f172a');
      root.style.setProperty('--surface', 'rgba(30,41,59,.92)');
      root.style.setProperty('--surface-hover', 'rgba(51,65,85,.95)');
      root.style.setProperty('--border', '#334155');
      root.style.setProperty('--text', '#e2e8f0');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--primary', '#818cf8');
      root.style.setProperty('--primary-hover', '#6366f1');
      root.style.setProperty('--primary-light', 'rgba(99,102,241,.15)');
      root.style.setProperty('--shadow', '0 1px 3px rgba(0,0,0,.3)');
      root.style.setProperty('--shadow-md', '0 4px 6px rgba(0,0,0,.35)');
      root.style.setProperty('--shadow-lg', '0 10px 25px rgba(0,0,0,.4)');
      document.querySelectorAll('.ad-slot').forEach(function(el){el.style.background='rgba(255,255,255,.04)'});
      btn.innerHTML = '☀️';
      btn.title = '切换浅色模式';
    } else {
      root.style.setProperty('--bg', '#f8fafc');
      root.style.setProperty('--surface', 'rgba(255,255,255,.85)');
      root.style.setProperty('--surface-hover', 'rgba(255,255,255,.95)');
      root.style.setProperty('--border', '#e2e8f0');
      root.style.setProperty('--text', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--primary', '#6366f1');
      root.style.setProperty('--primary-hover', '#4f46e5');
      root.style.setProperty('--primary-light', '#eef2ff');
      root.style.setProperty('--shadow', '0 1px 3px rgba(0,0,0,.08)');
      root.style.setProperty('--shadow-md', '0 4px 6px rgba(0,0,0,.07)');
      root.style.setProperty('--shadow-lg', '0 10px 25px rgba(0,0,0,.1)');
      document.querySelectorAll('.ad-slot').forEach(function(el){el.style.background=''});
      btn.innerHTML = '🌙';
      btn.title = '切换深色模式';
    }
  }

  var btn = document.createElement('div');
  btn.id = 'themeToggle';
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  btn.title = theme === 'dark' ? '切换浅色模式' : '切换深色模式';
  btn.style.cssText = 'position:fixed;bottom:20px;right:74px;width:44px;height:44px;'
    + 'border-radius:50%;background:var(--surface,#fff);border:1.5px solid var(--border,#e2e8f0);'
    + 'display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;'
    + 'z-index:9999;transition:all .25s;box-shadow:0 2px 12px rgba(0,0,0,.1);user-select:none;'
    + 'opacity:.85;';

  btn.addEventListener('mouseenter', function(){ btn.style.opacity='1'; btn.style.transform='scale(1.1)'; });
  btn.addEventListener('mouseleave', function(){ btn.style.opacity='.85'; btn.style.transform='scale(1)'; });
  btn.addEventListener('click', function(){ applyTheme(theme==='dark'?'light':'dark'); });

  function place() { if (document.body) document.body.appendChild(btn); }
  if (document.readyState !== 'loading') place();
  else document.addEventListener('DOMContentLoaded', place);

  applyTheme(theme);
})();