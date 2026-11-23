(function () {
  'use strict';
  var d = document;
  function all(sel, root) { return [].slice.call((root || d).querySelectorAll(sel)); }
  all('.lang-menu a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () { try { localStorage.setItem('np-lang', a.getAttribute('data-lang')); } catch (e) {} });
  });
  all('details.mnav a').forEach(function (a) {
    a.addEventListener('click', function () { var m = a.closest('details.mnav'); if (m) m.removeAttribute('open'); });
  });
  d.addEventListener('click', function (e) {
    all('details.lang[open]').forEach(function (x) { if (!x.contains(e.target)) x.removeAttribute('open'); });
  });
  var h = d.querySelector('.site-h.over');
  if (h) {
    var f = function () { h.classList.toggle('solid', (window.scrollY || 0) > 40); };
    window.addEventListener('scroll', f, { passive: true }); f();
  }
  try {
    if ('IntersectionObserver' in window && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) && d.querySelector('.rv')) {
      d.documentElement.classList.add('rv-on');
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -6% 0px' });
      all('.rv').forEach(function (el) { io.observe(el); });
    }
  } catch (err) {}
  all('.hs-track').forEach(function (trk) {
    var box = trk.parentElement;
    var upd = function () {
      box.classList.toggle('at-end', trk.scrollLeft + trk.clientWidth >= trk.scrollWidth - 8);
      box.classList.toggle('no-scroll', trk.scrollWidth <= trk.clientWidth + 8);
    };
    trk.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); setTimeout(upd, 60);
    var sx = 0, sl = 0, down = false, moved = false;
    trk.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = trk.scrollLeft; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; trk.classList.add('drag'); } if (moved) trk.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () {
      if (!down) return; down = false;
      if (moved) {
        trk.classList.remove('drag');
        var gl = trk.getBoundingClientRect().left + parseFloat(getComputedStyle(trk).paddingLeft), best = null, bd = 1e9;
        all('.hs-item', trk).forEach(function (c) { var x = Math.abs(c.getBoundingClientRect().left - gl); if (x < bd) { bd = x; best = c; } });
        if (best) trk.scrollBy({ left: best.getBoundingClientRect().left - gl, behavior: 'smooth' });
      }
    });
    trk.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });
  var ts = all('[role=tab]');
  function sel(t) {
    ts.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1;
      var p = d.getElementById(x.getAttribute('aria-controls')); if (p) p.style.display = on ? '' : 'none';
    });
  }
  ts.forEach(function (t, i) {
    t.addEventListener('click', function () { sel(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (k) { var n = ts[(i + k + ts.length) % ts.length]; sel(n); n.focus(); }
    });
  });
  var bs = all('.flt button[data-f],.flt-m button[data-f]');
  if (bs.length) {
    var cs = all('.cards .card[data-tags]'), fh = d.getElementById('flt-h'), fd = d.getElementById('flt-d');
    var go = function (f) {
      var b = null;
      bs.forEach(function (x) { var on = x.getAttribute('data-f') === f; x.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on && !b) b = x; });
      if (!b) return;
      cs.forEach(function (c) { c.style.display = (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') >= 0 ? '' : 'none'; });
      if (fh) fh.textContent = b.getAttribute('data-label');
      if (fd) fd.textContent = b.getAttribute('data-desc');
      var sb = d.querySelector('.flt-m>summary b'); if (sb) sb.textContent = b.getAttribute('data-label');
      var dm = d.querySelector('.flt-m'); if (dm) dm.removeAttribute('open');
    };
    bs.forEach(function (b) {
      b.addEventListener('click', function () { var f = b.getAttribute('data-f'); go(f); try { history.replaceState(null, '', '#' + f); } catch (e) {} });
    });
    var x = location.hash.slice(1); if (x) go(x);
    window.addEventListener('hashchange', function () { go(location.hash.slice(1)); window.scrollTo(0, 0); });
  }
})();
