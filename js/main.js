(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  const COL = ['#ff8a2a', '#ff9ec1', '#8fd3f4', '#b8a5f5', '#ffd84d', '#567732'];

  /* konfeti iz loptica oko tačke */
  const burst = (x, y, n = 22) => {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('i');
      const a = Math.random() * Math.PI * 2, r = 80 + Math.random() * 180;
      d.className = 'dot';
      d.style.cssText = `left:${x}px;top:${y}px;background:${COL[i % COL.length]};--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r}px`;
      document.body.append(d);
      setTimeout(() => d.remove(), 1000);
    }
  };

  /* splash: jednom po sesiji, može da se preskoči */
  const splash = $('#splash');
  let started = false;
  const start = () => { if (started) return; started = true; document.body.classList.add('go'); $('.hero').classList.add('go'); };
  const closeSplash = () => {
    if (splash.hidden) return;
    splash.classList.add('out');
    setTimeout(() => { splash.hidden = true; }, 850);
    start();
  };
  let seen = false;
  try { seen = sessionStorage.getItem('cc') === '1'; sessionStorage.setItem('cc', '1'); } catch (e) {}
  if (seen || reduce) { splash.hidden = true; start(); }
  else {
    setTimeout(() => { const r = $('.splash .hand-badge').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 26); }, 700);
    setTimeout(closeSplash, 1700);
    $('#skip').addEventListener('click', closeSplash);
  }

  /* hand sticker: mahni nazad */
  const wave = $('#wave');
  wave.addEventListener('click', () => {
    wave.classList.remove('w'); void wave.offsetWidth; wave.classList.add('w');
    const r = wave.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 16);
  });

  /* header, progress, parallax (rAF) */
  const hdr = $('#hdr'), bar = $('#progress'), himg = $('#heroimg');
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      hdr.classList.toggle('s', y > 20);
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (!reduce && y < innerHeight) himg.style.transform = `translateY(${-y * 0.04}px)`;
      tick = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobilni meni sa focus trap-om */
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = o => {
    burger.setAttribute('aria-expanded', o); nav.classList.toggle('open', o); hdr.classList.toggle('menu', o);
    document.body.style.overflow = o ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => {
    if (burger.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') { setMenu(false); burger.focus(); }
    if (e.key === 'Tab') {
      const f = [burger, ...$$('a', nav)], i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* anchor skrol bez # u URL-u; logo vodi na vrh */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    e.preventDefault(); setMenu(false);
    const t = id === '#top' ? null : $(id);
    scrollTo({ top: t ? t.getBoundingClientRect().top + scrollY - 56 : 0, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname + location.search);
  }));
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);

  /* reveal + scrollspy */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));
  const links = $$('.nav a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(l => { const s = $(l.getAttribute('href')); s && spy.observe(s); });

  /* radno vreme uživo (Europe/Belgrade). 0 = nedelja */
  const H = { 0: [11, 0], 1: [14, 0], 2: [14, 0], 3: [14, 0], 4: [14, 0], 5: [14, 0], 6: [11, 0] }, CLOSE = 21.5;
  const hours = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Belgrade', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const d = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday], t = +p.hour + p.minute / 60;
    const chip = $('#open-status'), open = t >= H[d][0] && t < CLOSE;
    chip.classList.toggle('open', open); chip.classList.toggle('closed', !open);
    chip.textContent = open ? 'Otvoreno do 21:30' : t < H[d][0] ? `Danas otvaramo u ${H[d][0]}:00` : `Zatvoreno, otvaramo sutra`;
    $$('#hrs tr').forEach(r => r.classList.toggle('today', +r.dataset.d === d));
  };
  try { hours(); setInterval(hours, 60000); } catch (e) {}

  /* slike koje fale: tema placeholder */
  $$('img').forEach(img => {
    const miss = () => img.parentElement.classList.add('miss');
    img.addEventListener('error', miss);
    if (img.complete && img.naturalWidth === 0) miss();
  });

  /* lightbox */
  const lb = $('#lb'), lbi = $('#lbi'), items = $$('#gal .g'); let cur = 0, opener;
  const show = i => { cur = (i + items.length) % items.length; const im = $('img', items[cur]); lbi.src = im.src; lbi.alt = im.alt; };
  const open = i => { opener = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lbx').focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
  items.forEach((b, i) => b.addEventListener('click', () => open(i)));
  $('#lbx').onclick = close; $('#lbp').onclick = () => show(cur - 1); $('#lbn').onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'Tab') { const f = $$('button', lb), i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); }, { passive: true });

  /* forma: otvara WhatsApp (web na računaru, aplikacija na telefonu) u novom tabu */
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `Zdravo, ovde ${f.get('ime')}${f.get('tel') ? ' (' + f.get('tel') + ')' : ''}.
${f.get('msg')}`;
    window.open('https://wa.me/381631360713?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  $('#yr').textContent = new Date().getFullYear();
})();
