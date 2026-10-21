(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* menu mobile */
  var btn = $('.nav-toggle'), nav = $('#menu');
  if (btn && nav) {
    var set = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  /* entrada suave ao rolar */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* orçamento pelo WhatsApp */
  var form = $('#quote'), go = $('#quote-go');
  if (form && go) {
    var build = function () {
      var tipo = ($('input[name="tipo"]:checked', form) || {}).value || 'obra';
      var bairro = $('#bairro', form).value.trim();
      var t = 'Olá! Gostaria de um orçamento para ' + tipo + (bairro ? ' no bairro ' + bairro : '') + '.';
      go.href = 'https://wa.me/5521993338565?text=' + encodeURIComponent(t);
    };
    form.addEventListener('input', build); form.addEventListener('change', build); build();
  }

  /* galeria ampliada */
  var lb = $('#lb');
  if (lb && lb.showModal) {
    var tiles = $$('[data-lb]'), cur = 0, img = $('img', lb), cap = $('p', lb);
    var visible = function () { return tiles.filter(function (t) { return !t.closest('[hidden]'); }); };
    var show = function (i) {
      var v = visible(); if (!v.length) return;
      cur = (i + v.length) % v.length;
      img.src = v[cur].dataset.full; img.alt = $('img', v[cur]).alt; cap.textContent = v[cur].dataset.cap;
    };
    var arrows = $('.lb__in', lb);
    if (tiles.length > 1) {
      arrows.insertAdjacentHTML('beforeend', '<button class="p" type="button" aria-label="Foto anterior">‹</button><button class="nx" type="button" aria-label="Próxima foto">›</button>');
      $('.p', lb).addEventListener('click', function () { show(cur - 1); });
      $('.nx', lb).addEventListener('click', function () { show(cur + 1); });
    }
    tiles.forEach(function (t) {
      t.addEventListener('click', function () { show(visible().indexOf(t)); lb.showModal(); });
    });
    $('.x', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb__in')) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
  }

  /* filtro da página de obras */
  var fs = $$('.filters button');
  fs.forEach(function (b) {
    b.addEventListener('click', function () {
      fs.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('#grid .tile').forEach(function (t) { t.hidden = !(b.dataset.f === 'all' || t.dataset.k === b.dataset.f); });
    });
  });
})();
