/* ──────────────────────────────────────────────────────────────────────────
   UrbanCore — Landing Empresa (Zoom)
   Vanilla port of the Claude Design component logic.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var CONFIG = {
    formspreeId: 'mnjrpwnv',
  };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ── Nav: solid background past 40px ─────────────────────────────────── */
  (function nav() {
    var el = document.querySelector('[data-nav]');
    if (!el) return;
    var apply = function () { el.classList.toggle('is-scrolled', window.scrollY > 40); };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
  })();

  /* ── Mobile menu ─────────────────────────────────────────────────────── */
  (function menu() {
    var menuEl = document.querySelector('[data-menu]');
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!menuEl || !toggle) return;

    var setOpen = function (open) {
      menuEl.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      if (open) menuEl.querySelector('a').focus();
      else toggle.focus();
    };

    toggle.addEventListener('click', function () { setOpen(menuEl.hidden); });
    menuEl.querySelectorAll('[data-menu-close]').forEach(function (n) {
      n.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menuEl.hidden) setOpen(false);
    });
  })();

  /* ── Hero particle field ─────────────────────────────────────────────── */
  (function particles() {
    var canvas = document.querySelector('[data-particles]');
    if (!canvas || reducedMotion) return;
    var ctx = canvas.getContext('2d');
    var W, H, points;

    var resize = function () {
      var hero = canvas.parentElement;
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    var make = function () {
      var count = Math.min(65, Math.floor((W * H) / 14000));
      points = Array.from({ length: count }, function () {
        return {
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.4 + 0.7,
        };
      });
    };

    resize(); make();
    window.addEventListener('resize', function () { resize(); make(); });

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < points.length; k++) {
        var p = points[k];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(55,138,221,0.5)';
        ctx.fill();
      }
      for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var dx = points[i].x - points[j].x, dy = points[i].y - points[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = 'rgba(55,138,221,' + ((1 - d / 150) * 0.18) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  })();

  /* ── Hero orbit: pointer tilt + scroll zoom, and the scroll-progress ring ─ */
  (function heroAndProgress() {
    var wrap = document.querySelector('[data-hero-orbit]');
    var ring = document.querySelector('[data-progress-ring]');
    var progressWrap = document.querySelector('[data-progress-wrap]');
    var heroSvg = wrap ? wrap.querySelector('svg') : null;
    var circumference = 2 * Math.PI * 18;

    var cx = 0, cy = 0, tx = 0, ty = 0;
    if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.addEventListener('mousemove', function (e) {
        tx = (e.clientX / window.innerWidth - 0.5) * 12;
        ty = (e.clientY / window.innerHeight - 0.5) * -9;
      });
    }
    if (wrap) wrap.style.transformOrigin = '18% 50%';

    (function loop() {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;

      var doc = document.documentElement;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var frac = clamp(window.scrollY / max, 0, 1);
      var hp = clamp(window.scrollY / (window.innerHeight * 0.92), 0, 1);

      if (wrap && !reducedMotion) {
        var scale = 1 + hp * 6.5;
        wrap.style.transform =
          'perspective(1000px) translateY(-50%) rotateY(' + cx.toFixed(3) + 'deg) rotateX(' + cy.toFixed(3) +
          'deg) scale(' + scale.toFixed(3) + ') rotate(' + (hp * 26).toFixed(2) + 'deg)';
        wrap.style.opacity = (1 - clamp((hp - 0.12) / 0.72, 0, 1)).toFixed(3);
        if (heroSvg) {
          heroSvg.style.filter =
            'drop-shadow(0 0 ' + (40 + hp * 56).toFixed(0) + 'px rgba(55,138,221,' + (0.46 + hp * 0.44).toFixed(2) + '))';
        }
      }
      if (ring) ring.style.strokeDashoffset = String(circumference * (1 - frac));
      if (progressWrap) progressWrap.style.opacity = frac > 0.03 ? '1' : '0';

      requestAnimationFrame(loop);
    })();

    var top = document.querySelector('[data-scroll-top]');
    if (top) {
      top.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    }
  })();

  /* ── Reveal on scroll ────────────────────────────────────────────────── */
  (function reveal() {
    var items = document.querySelectorAll('.uc-reveal');
    if (!items.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ── FAQ accordion (one open at a time) ──────────────────────────────── */
  (function faq() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-faq]'));
    if (!items.length) return;

    var setOpen = function (item, open) {
      item.dataset.open = String(open);
      item.querySelector('[data-faq-toggle]').setAttribute('aria-expanded', String(open));
      item.querySelector('.uc-faq-answer').hidden = !open;
    };

    items.forEach(function (item) {
      item.querySelector('[data-faq-toggle]').addEventListener('click', function () {
        var willOpen = item.dataset.open !== 'true';
        items.forEach(function (other) { setOpen(other, false); });
        setOpen(item, willOpen);
      });
    });
  })();

  /* ── Legal modals ────────────────────────────────────────────────────── */
  (function legal() {
    var dialogs = {};
    document.querySelectorAll('[data-legal]').forEach(function (el) { dialogs[el.dataset.legal] = el; });
    var lastFocus = null;

    var close = function () {
      Object.keys(dialogs).forEach(function (k) { dialogs[k].hidden = true; });
      document.body.style.overflow = '';
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var open = function (key) {
      if (!dialogs[key]) return;
      lastFocus = document.activeElement;
      dialogs[key].hidden = false;
      document.body.style.overflow = 'hidden';
      dialogs[key].querySelector('[data-legal-close]').focus();
    };

    document.querySelectorAll('[data-open-legal]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open(link.dataset.openLegal);
      });
    });

    Object.keys(dialogs).forEach(function (k) {
      var dialog = dialogs[k];
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) close();
      });
      dialog.querySelector('[data-legal-close]').addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var anyOpen = Object.keys(dialogs).some(function (k) { return !dialogs[k].hidden; });
      if (anyOpen) close();
    });
  })();

  /* ── Contact form ────────────────────────────────────────────────────── */
  (function contact() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var submit = form.querySelector('[data-submit]');
    var status = form.querySelector('[data-form-status]');
    var fields = ['nombre', 'correo', 'mensaje'];
    var touched = {};

    var validate = function (field, value) {
      if (field === 'nombre') return value.trim().length >= 2 ? '' : 'Por favor escribe tu nombre.';
      if (field === 'correo') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Necesitamos un correo válido para responderte.';
      if (field === 'mensaje') return value.trim().length >= 10 ? '' : 'Cuéntanos un poco sobre lo que necesitas.';
      return '';
    };

    var showError = function (field, message) {
      var slot = form.querySelector('[data-error-for="' + field + '"]');
      slot.textContent = message;
      slot.hidden = !message;
      form.elements[field].setAttribute('aria-invalid', message ? 'true' : 'false');
    };

    fields.forEach(function (field) {
      var input = form.elements[field];
      input.addEventListener('blur', function () {
        touched[field] = true;
        showError(field, validate(field, input.value));
      });
      input.addEventListener('input', function () {
        if (touched[field]) showError(field, validate(field, input.value));
      });
    });

    var setStatus = function (message, ok) {
      status.textContent = message;
      status.hidden = !message;
      status.style.color = ok ? 'var(--text-tertiary-on-dark)' : 'var(--color-error-text)';
    };

    var FAILURE = 'No pudimos enviar tu mensaje. Escríbenos directo a contacto@urbancore.com.mx.';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (field) {
        touched[field] = true;
        var message = validate(field, form.elements[field].value);
        showError(field, message);
        if (message && !firstInvalid) firstInvalid = form.elements[field];
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      submit.disabled = true;
      submit.textContent = 'Enviando…';
      setStatus('', true);

      fetch('https://formspree.io/f/' + CONFIG.formspreeId, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (r) {
          if (!r.ok) throw new Error('rejected');
          form.reset();
          touched = {};
          fields.forEach(function (field) { showError(field, ''); });
          setStatus('¡Mensaje enviado! Te respondemos pronto.', true);
        })
        .catch(function () { setStatus(FAILURE, false); })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = 'Enviar mensaje';
        });
    });
  })();
})();
