/* ==========================================================================
   Robertson Chiropractic — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully and every
   motion effect is disabled when the visitor prefers reduced motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- header */
  var header = $('#header');
  var progressBar = $('#progressBar');

  function onScroll() {
    var y = window.pageYOffset;
    header.classList.toggle('is-stuck', y > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }

  /* ----------------------------------------------------------- mobile menu */
  var burger = $('#burger');
  var menu = $('#mobileMenu');
  $$('a', menu).forEach(function (a, i) { a.style.setProperty('--i', i); });

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
    } else {
      menu.classList.remove('is-open');
      window.setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 400);
    }
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  /* ------------------------------------------------- split headlines by word */
  $$('.split').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (word, i) {
      var outer = document.createElement('span');
      outer.className = 'w';
      var inner = document.createElement('span');
      inner.textContent = word;
      inner.style.setProperty('--wi', i);
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ------------------------------------------------------ reveal on scroll */
  $$('.reveal[data-d]').forEach(function (el) { el.style.setProperty('--d', el.dataset.d); });

  var revealables = $$('.reveal, .split, .step');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* -------------------------------------------------- nav section highlight */
  var sections = $$('main section[id]');
  var navLinks = $$('.nav-desktop a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------- parallax  */
  var parallax = $$('.parallax');
  var stepFill = $('#stepFill');
  var stepList = $('#stepList');
  var ticking = false;

  function frame() {
    ticking = false;
    onScroll();

    if (!reduced) {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var mid = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = 'translate3d(0,' + (mid * parseFloat(el.dataset.speed || -0.05)).toFixed(2) + 'px,0)';
      });
    }

    if (stepList && stepFill) {
      var b = stepList.getBoundingClientRect();
      var anchor = window.innerHeight * 0.55;
      var pct = (anchor - b.top) / b.height;
      stepFill.style.height = Math.max(0, Math.min(1, pct)) * 100 + '%';
    }
  }

  function requestFrame() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
  }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  frame();

  /* ------------------------------------------------------ card spotlight  */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* magnetic buttons */
    if (!reduced) {
      $$('.magnetic').forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.22;
          var y = (e.clientY - r.top - r.height / 2) * 0.32;
          el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
        });
        el.addEventListener('pointerleave', function () { el.style.transform = ''; });
      });
    }
  }

  /* ------------------------------------------------------------- tabs ---- */
  var tabs = $$('.tab');
  var pill = $('.tab-pill');

  function movePill(tab) {
    if (!pill || !tab || !tabs.length) return;
    var origin = tabs[0].getBoundingClientRect();
    var rect = tab.getBoundingClientRect();
    pill.style.width = rect.width + 'px';
    pill.style.transform = 'translateX(' + (rect.left - origin.left) + 'px)';
  }

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.classList.toggle('is-active', on);
      panel.hidden = !on;
    });
    movePill(tab);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });
  if (tabs.length) {
    movePill(tabs[0]);
    window.addEventListener('resize', function () { movePill($('.tab.is-active')); });
    window.addEventListener('load', function () { movePill($('.tab.is-active')); });
  }

  /* --------------------------------------------------------- testimonials  */
  var slides = $$('.slide');
  var dotsWrap = $('#dots');
  var current = 0;
  var timer = null;

  if (slides.length) {
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      b.setAttribute('aria-selected', String(i === 0));
      b.addEventListener('click', function () { go(i, true); });
      dotsWrap.appendChild(b);
    });

    var dots = $$('button', dotsWrap);

    function go(i, stop) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === current); });
      dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === current)); });
      if (stop) restart();
    }
    function restart() {
      window.clearInterval(timer);
      if (!reduced) timer = window.setInterval(function () { go(current + 1); }, 7000);
    }

    $('#nextBtn').addEventListener('click', function () { go(current + 1, true); });
    $('#prevBtn').addEventListener('click', function () { go(current - 1, true); });

    var slider = $('#slider');
    slider.addEventListener('mouseenter', function () { window.clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    var startX = null;
    slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(current + (dx < 0 ? 1 : -1), true);
      startX = null;
    });

    restart();
  }

  /* ------------------------------------------------------ hours / open now */
  var now = new Date();
  var day = now.getDay();
  var hoursList = $('#hoursList');
  if (hoursList) {
    var todayLi = $('li[data-day="' + day + '"]', hoursList);
    if (todayLi) todayLi.classList.add('is-today');

    var schedule = { 1: [600, 1020], 2: [600, 1020], 3: [600, 1020], 4: [600, 1110] };
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = schedule[day];
    var statusEl = $('#openStatus');
    var textEl = $('#openText');

    if (today && mins >= today[0] && mins < today[1]) {
      statusEl.classList.add('open');
      textEl.textContent = 'Open now — closing at ' + (day === 4 ? '6:30pm' : '5:00pm');
    } else {
      var order = [1, 2, 3, 4];
      var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var nextDay = null;
      if (today && mins < today[0]) {
        nextDay = day;
      } else {
        for (var k = 1; k <= 7; k++) {
          var d = (day + k) % 7;
          if (order.indexOf(d) !== -1) { nextDay = d; break; }
        }
      }
      textEl.textContent = 'Closed now — opens ' +
        (nextDay === day ? 'today' : nextDay === (day + 1) % 7 ? 'tomorrow' : names[nextDay]) + ' at 10:00am';
    }
  }

  /* --------------------------------------------------------------- form --- */
  var form = $('#contactForm');
  if (form) {
    var note = $('#formNote');
    var originalNote = note.innerHTML;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#f-name');
      var phone = $('#f-phone');
      var ok = true;

      [name, phone].forEach(function (f) {
        var bad = !f.value.trim();
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });

      if (!ok) {
        note.classList.remove('ok');
        note.textContent = 'Please add your name and a phone number so we can reach you.';
        return;
      }

      /* No backend is wired up yet — hand the request off to email so that
         nothing a patient types is ever lost. Swap this for a form service
         or practice-management endpoint when one is chosen. */
      var body =
        'Name: ' + name.value + '\n' +
        'Phone: ' + phone.value + '\n' +
        'Email: ' + $('#f-email').value + '\n' +
        'Reason: ' + $('#f-reason').value + '\n\n' +
        $('#f-msg').value;

      window.location.href = 'mailto:danielle@robertsonchiro.com' +
        '?subject=' + encodeURIComponent('Appointment request — ' + name.value) +
        '&body=' + encodeURIComponent(body);

      note.classList.add('ok');
      note.textContent = 'Opening your email app with the request ready to send…';
      window.setTimeout(function () {
        note.classList.remove('ok');
        note.innerHTML = originalNote;
      }, 8000);
    });

    $$('input, textarea', form).forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('invalid'); });
    });
  }

  /* ---------------------------------------------------------------- misc -- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
