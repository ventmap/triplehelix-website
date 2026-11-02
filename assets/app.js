(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var AZ = window.TH_AZ || {};
  var EN = {};
  var nodes = doc.querySelectorAll('[data-i18n]');
  nodes.forEach(function (n) { var k = n.getAttribute('data-i18n'); if (!(k in EN)) EN[k] = n.innerHTML; });
  EN.aria_menu = 'Menu'; EN.f_status = 'Your email app should now open with the message ready. If it does not, write to info@triplehelix.az.';
  EN.f_copied = 'Copied'; EN.f_invalid = 'Please fill in the required fields.'; EN.f_sub = 'Subject';
  var lang = 'en';

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function t(k) { return lang === 'az' ? (AZ[k] || EN[k] || '') : (EN[k] || ''); }

  function setLang(l) {
    lang = l === 'az' ? 'az' : 'en';
    root.lang = lang;
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      var v = lang === 'az' ? AZ[k] : EN[k];
      if (v != null) n.innerHTML = v;
    });
    doc.querySelectorAll('[data-i18n-aria]').forEach(function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-aria'))); });
    var b = doc.body;
    doc.title = b.getAttribute(lang === 'az' ? 'data-title-az' : 'data-title-en') || doc.title;
    doc.querySelectorAll('.lang button').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    store('th-lang', lang);
  }
  doc.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
  var saved = store('th-lang');
  var pref = saved || ((navigator.language || '').toLowerCase().indexOf('az') === 0 ? 'az' : 'en');
  if (pref === 'az') setLang('az');

  // mobile nav
  var tg = doc.getElementById('navToggle'), links = doc.getElementById('navLinks');
  function closeNav() { if (!tg) return; links.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); }
  if (tg) {
    tg.addEventListener('click', function () { var o = links.classList.toggle('open'); tg.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  // header shadow
  var hd = doc.querySelector('.site-header');
  function onScroll() { if (hd) hd.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // reveal
  var rev = [].slice.call(doc.querySelectorAll('.card,.step,.slot,.section-head,.statement,.form-card,.faq details,.asks,.hero .container > *'));
  rev.forEach(function (n) { n.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    rev.forEach(function (n) { io.observe(n); });
  } else rev.forEach(function (n) { n.classList.add('in'); });

  // active nav (in-page anchors)
  var anchors = [].slice.call(doc.querySelectorAll('.nav-links a[href^="#"]'));
  var secs = anchors.map(function (a) { return doc.querySelector(a.getAttribute('href')); });
  if (anchors.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var i = secs.indexOf(e.target); anchors.forEach(function (a, j) { a.classList.toggle('active', j === i); }); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }
  var path = location.pathname.replace(/\/$/, '');
  doc.querySelectorAll('.nav-links a:not([href^="#"])').forEach(function (a) {
    var h = a.getAttribute('href').replace('.html', '');
    if (h && path.slice(-h.length) === h && h !== 'index') a.classList.add('active');
  });

  // buttons that preselect a form role
  doc.querySelectorAll('[data-role]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = doc.querySelector('form[data-mailto] select[name="role"]');
      if (sel) { sel.value = a.getAttribute('data-role'); }
    });
  });

  // forms -> mailto
  doc.querySelectorAll('form[data-mailto]').forEach(function (f) {
    var st = f.querySelector('.form-status');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f), role = f.elements.role, ok = f.checkValidity();
      if (!ok) { st.hidden = false; st.textContent = t('f_invalid'); var bad = f.querySelector(':invalid'); if (bad) bad.focus(); return; }
      var rl = role.selectedOptions[0] ? role.selectedOptions[0].textContent : '';
      var subj = 'TripleHelix — ' + rl + ' — ' + d.get('name');
      var body = d.get('msg') + '\n\n— ' + d.get('name') + (d.get('org') ? ', ' + d.get('org') : '') + '\n' + d.get('email') + '\n(' + rl + ')';
      location.href = 'mailto:' + f.getAttribute('data-mailto') + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
      st.hidden = false; st.textContent = t('f_status');
    });
  });
  doc.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy'), orig = b.innerHTML;
      function done() { b.textContent = t('f_copied'); setTimeout(function () { b.innerHTML = orig; }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, function () {});
    });
  });
})();
