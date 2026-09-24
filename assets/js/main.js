/* =========================================================
   HSD Gazi — site betiği (kütüphanesiz)
   İçerik değişiklikleri için bu dosyaya değil veri.js'e bakın.
   ========================================================= */
(() => {
  'use strict';

  const D = window.HSD || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  const isHttp = u => typeof u === 'string' && /^https?:\/\//i.test(u.trim());
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`[HSD] ${name}:`, err); } };

  const INSTAGRAM = isHttp(D.instagram) ? D.instagram.trim() : 'https://www.instagram.com/hsdgazi/';
  const LINKEDIN = 'https://tr.linkedin.com/company/hsdc-gazi-university';
  const BOOTCAMP = 'https://hsdturkiyebootcamp.com/';
  const HSDTR_IG = 'https://www.instagram.com/hsdturkiye/';
  const BASVURU = isHttp(D.basvuruLinki) ? D.basvuruLinki.trim() : '';
  const AUTHOR_URL = 'https://github.com/DailyDana';
  const KOMITELER = ['Genel Sekreterlik', 'Organizasyon Komitesi', 'Sosyal Medya Komitesi', 'Teknik Etkinlik Komitesi', 'Tanıtım ve Tasarım Komitesi'];

  /* ---------- görünme animasyonu ---------- */
  let revealIO = null;
  const reveal = els => {
    els.forEach(el => {
      if (!revealIO) { el.classList.add('is-in'); return; }
      const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
      const delay = Math.min(Math.max(0, sibs.indexOf(el)), 6) * 70;
      el.style.transitionDelay = `${delay}ms`;
      el.dataset.delay = String(delay);
      revealIO.observe(el);
    });
  };
  safe('reveal', () => {
    if (!reduceMotion && hasIO) {
      revealIO = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          revealIO.unobserve(el);
          el.classList.add('is-in');
          // animasyon bitince sınıfı kaldır: öğenin kendi hover geçişleri bozulmasın
          setTimeout(() => { el.classList.remove('reveal', 'is-in'); el.style.transitionDelay = ''; }, 900 + Number(el.dataset.delay || 0));
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    reveal($$('.reveal'));
  });

  /* ---------- menü, ilerleme çubuğu, aktif bölüm ---------- */
  safe('nav', () => {
    const nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks'), bar = $('#progress');
    const setOpen = open => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
    links.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', e => { if (!nav.contains(e.target)) setOpen(false); });

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();

    if (!hasIO) return;
    const navLinks = new Map($$('[data-nav]').map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => a.classList.remove('is-current'));
        const a = navLinks.get(en.target.id);
        if (a) a.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(s => io.observe(s));
  });

  /* ---------- başvuru linki ---------- */
  safe('basvuru', () => {
    if (!BASVURU) return;
    $$('[data-basvuru]').forEach(a => {
      a.href = BASVURU;
      const label = $('[data-basvuru-label]', a);
      if (label) label.textContent = 'Başvuru formunu aç';
    });
  });

  /* ---------- etkinlik verisi ---------- */
  const AYLAR = ['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'];
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const parseDate = s => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d) ? null : d;
  };
  const parseTime = s => {
    const m = /^(\d{1,2})[:.](\d{2})$/.exec(String(s || '').trim());
    return m && +m[1] < 24 && +m[2] < 60 ? [+m[1], +m[2]] : null;
  };
  const sortKey = e => (e._d ? e._d.getTime() : 8.64e15);

  const events = (Array.isArray(D.etkinlikler) ? D.etkinlikler : [])
    .map(e => ({ ...e, _d: parseDate(e.tarih), _t: parseTime(e.saat) }));
  const upcoming = events.filter(e => !e._d || e._d >= today).sort((a, b) => sortKey(a) - sortKey(b));
  const past = events.filter(e => e._d && e._d < today).sort((a, b) => b._d - a._d);

  const calLink = e => {
    if (!e._d) return '';
    let dates;
    if (e._t) {
      const start = new Date(e._d); start.setHours(e._t[0], e._t[1], 0, 0);
      const end = new Date(start.getTime() + 2 * 3600e3);
      const f = d => `${ymd(d)}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
      dates = `${f(start)}/${f(end)}`;
    } else {
      const next = new Date(e._d); next.setDate(next.getDate() + 1);
      dates = `${ymd(e._d)}/${ymd(next)}`;
    }
    const p = new URLSearchParams({
      action: 'TEMPLATE',
      text: e.baslik || 'HSD Gazi etkinliği',
      dates,
      details: [e.aciklama, isHttp(e.link) ? e.link.trim() : ''].filter(Boolean).join('\n\n'),
      location: e.yer || '',
      ctz: 'Europe/Istanbul'
    });
    return `https://calendar.google.com/calendar/render?${p}`;
  };

  const countdown = e => {
    if (!e._d) return '';
    const days = Math.round((e._d - today) / 864e5);
    if (days === 0) return '<span class="event-badge is-today">BUGÜN</span>';
    if (days === 1) return '<span class="event-badge">YARIN</span>';
    if (days > 1 && days <= 30) return `<span class="event-badge">${days} GÜN KALDI</span>`;
    return '';
  };

  const eventCard = (e, isPast) => {
    const img = e.gorsel ? `<img class="event-img" src="${esc(e.gorsel)}" alt="" loading="lazy">` : '';
    const date = e._d
      ? `<div class="event-date"><span class="event-day">${pad(e._d.getDate())}</span><span class="event-mon">${AYLAR[e._d.getMonth()]}${e._d.getFullYear() !== today.getFullYear() ? ' ' + e._d.getFullYear() : ''}</span></div>`
      : '<div class="event-soon">YAKINDA</div>';
    const meta = [e.yer, e._t ? `${pad(e._t[0])}:${pad(e._t[1])}` : ''].filter(Boolean).map(esc).join(' · ');
    const actions = [];
    if (isHttp(e.link)) actions.push(`<a class="event-link" href="${esc(e.link.trim())}" target="_blank" rel="noopener">${isPast ? 'Göz at' : 'Detaylar ve kayıt'} ↗</a>`);
    if (!isPast && e._d) actions.push(`<a class="event-link is-muted" href="${esc(calLink(e))}" target="_blank" rel="noopener">Takvime ekle +</a>`);
    return `
      <article class="event reveal${isPast ? ' is-past' : ''}">
        ${img}
        <div class="event-top">${date}${e.tur ? `<span class="event-type">${esc(e.tur)}</span>` : ''}</div>
        <div class="event-body">
          ${isPast ? '' : countdown(e)}
          <h3>${esc(e.baslik || 'Etkinlik')}</h3>
          ${meta ? `<div class="event-meta">${meta}</div>` : ''}
          <p>${esc(e.aciklama || '')}</p>
          ${actions.length ? `<div class="event-actions">${actions.join('')}</div>` : ''}
        </div>
      </article>`;
  };

  safe('events', () => {
    const box = $('#events');
    if (!box) return;
    const tabs = $$('.tab');
    const counts = { yaklasan: upcoming.length, gecmis: past.length };
    $$('[data-n]').forEach(el => { el.textContent = counts[el.dataset.n] ? String(counts[el.dataset.n]) : ''; });

    const render = which => {
      const isPast = which === 'gecmis';
      const list = isPast ? past : upcoming;
      box.innerHTML = list.length
        ? list.map(e => eventCard(e, isPast)).join('')
        : `<p class="events-empty">${isPast
            ? 'Geçmiş etkinlikler burada listelenecek.'
            : `Şu an planlanmış bir etkinlik yok. Duyurular için Instagram'da <a href="${esc(INSTAGRAM)}" target="_blank" rel="noopener">@hsdgazi</a>'yi takip et.`}</p>`;
      reveal($$('.reveal', box));
    };
    const select = tab => {
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      render(tab.dataset.tab);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus(); select(next);
      });
    });
    select(tabs[0]);
  });

  /* ---------- ekip ---------- */
  safe('team', () => {
    const box = $('#team');
    if (!box) return;
    const list = Array.isArray(D.ekip) ? D.ekip : [];
    const initials = ad => String(ad || '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
      .map(w => w.charAt(0).toLocaleUpperCase('tr')).join('') || '?';
    const cards = list.map(m => `
      <article class="member reveal">
        <div class="member-photo">
          <svg class="member-sil" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="40" r="17"/><path d="M14 100C14 79 30 65 50 65s36 14 36 35Z"/></svg>
          <span class="member-ini">${esc(initials(m.ad))}</span>
          ${m.foto ? `<img src="${esc(m.foto)}" alt="${esc(m.ad)}" loading="lazy">` : ''}
        </div>
        <h3>${esc(m.ad)}</h3>
        <div class="member-role">${esc(m.gorev)}</div>
        ${isHttp(m.linkedin) ? `<a class="member-in" href="${esc(m.linkedin.trim())}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}
      </article>`);
    cards.push(`
      <a class="member member-join reveal" href="#basvur">
        <div class="member-photo">&lt;/&gt;</div>
        <h3>Bu koltuk boş.</h3>
        <div class="member-role">Sen olabilirsin → Başvur</div>
      </a>`);
    box.innerHTML = cards.join('');
    $$('.member-photo img', box).forEach(img => img.addEventListener('error', () => img.remove()));
    reveal($$('.reveal', box));
  });

  /* ---------- sayaçlar ---------- */
  safe('counters', () => {
    const els = $$('[data-count]');
    if (!els.length || reduceMotion || !hasIO) return;
    const fmt = n => n.toLocaleString('tr-TR');
    els.forEach(el => { el.textContent = '0'; });
    const run = el => {
      const target = Number(el.dataset.count), t0 = performance.now(), dur = 1700;
      let done = false;
      const step = now => {
        if (done) return;
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(step); else done = true;
      };
      requestAnimationFrame(step);
      setTimeout(() => { done = true; el.textContent = fmt(target); }, dur + 200);
    };
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { io.unobserve(en.target); run(en.target); }
    }), { threshold: 0.6 });
    els.forEach(el => io.observe(el));
  });

  /* ---------- karışık harf efekti (mono yazılarda) ---------- */
  const GLYPHS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ<>/{}[]=+*#_01';
  const scramble = (el, dur = 850) => {
    const final = el.dataset.final || el.textContent;
    el.dataset.final = final;
    if (reduceMotion) { el.textContent = final; return; }
    const chars = Array.from(final);
    const t0 = performance.now();
    let done = false;
    const finish = () => { done = true; el.textContent = final; };
    const tick = now => {
      if (done) return;
      const p = Math.min(1, (now - t0) / dur);
      const settled = Math.floor(p * chars.length);
      el.textContent = chars.map((c, i) => (i < settled || c === ' ' || c === '·')
        ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      if (p < 1) requestAnimationFrame(tick); else finish();
    };
    requestAnimationFrame(tick);
    setTimeout(finish, dur + 150); // kare döngüsü durursa (arka plan sekmesi vb.) yazı karışık kalmasın
  };
  safe('scramble', () => {
    const items = $$('[data-scramble]');
    const heroKicker = $('.hero [data-scramble]');
    if (heroKicker) setTimeout(() => scramble(heroKicker, 1100), 150);
    if (!hasIO) return;
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { io.unobserve(en.target); scramble(en.target); }
    }), { threshold: 1 });
    items.filter(el => el !== heroKicker).forEach(el => io.observe(el));
  });

  /* ---------- kesişen bantlar: ekranı dolduracak kadar içerik ---------- */
  // Kayma translateX(-50%) ile döner; boşluksuz olması için izin her yarısı bant genişliğinden
  // geniş olmalı. Bir tekrarın genişliği ölçülür, yeterince çoğaltılır ve iki kopya yan yana konur.
  safe('bands', () => {
    const tracks = $$('.band-track[data-items]');
    if (!tracks.length) return;
    const sets = new Map(tracks.map(tr => {
      const n = Number(tr.dataset.items) || tr.children.length;
      return [tr, Array.from(tr.children).slice(0, n).map(el => el.outerHTML).join('')];
    }));
    const build = () => {
      tracks.forEach(tr => {
        const band = tr.parentElement;
        const set = sets.get(tr);
        tr.classList.remove('is-ready');
        tr.innerHTML = set;
        const setW = tr.offsetWidth;
        const bandW = band.offsetWidth;
        if (!setW || !bandW) return;
        const reps = Math.max(1, Math.ceil((bandW + 80) / setW));
        const half = set.repeat(reps);
        tr.innerHTML = half + half;
        const halfW = setW * reps;
        const speed = Number(tr.dataset.speed) || 36; // piksel/saniye
        tr.style.setProperty('--band-dur', `${(halfW / speed).toFixed(2)}s`);
        tr.dataset.half = String(Math.round(halfW));
        tr.dataset.band = String(Math.round(bandW));
        void tr.offsetWidth; // animasyonu temiz başlat
        tr.classList.add('is-ready');
      });
    };
    build();
    // yazı tipi yüklenince genişlikler değişir: yeniden ölç
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    let timer = 0, lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === lastW) return; // mobilde adres çubuğu yüksekliği değişince tetiklenmesin
      lastW = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(build, 200);
    });
  });

  /* ---------- hero: fareyi izleyen ızgara ---------- */
  safe('hero-light', () => {
    const hero = $('#hero');
    if (!hero || reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0, x = 0, y = 0;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        hero.style.setProperty('--mx', `${x}px`);
        hero.style.setProperty('--my', `${y}px`);
        hero.classList.add('is-lit');
      });
    });
    hero.addEventListener('pointerleave', () => hero.classList.remove('is-lit'));
  });

  /* ---------- etkileşimli terminal ---------- */
  safe('terminal', () => {
    const term = $('#term'), body = $('#termBody'), out = $('#termOut');
    const form = $('#termForm'), input = $('#termIn'), chips = $('#termChips');
    if (!term || !body || !out || !form || !input) return;

    const PS = '<span class="term-ps">hsd@gazi:~$</span>';
    const CONFIG = [
      '<span class="c">// Gazi\'nin geliştirici topluluğu</span>',
      '<span class="k">export const</span> topluluk = {',
      '  ad: <span class="s">"HSD Gazi"</span>,',
      '  universite: <span class="s">"Gazi Üniversitesi"</span>,',
      '  odak: [<span class="s">"Cloud"</span>, <span class="s">"Yapay Zekâ"</span>, <span class="s">"DevOps"</span>],',
      '  komiteler: <span class="n">5</span>,',
      '  yeniUye: <span class="k">null</span>, <span class="c">// seni bekliyoruz</span>',
      '};'
    ];

    const scrollDown = () => { body.scrollTop = body.scrollHeight; };
    const line = html => {
      const d = document.createElement('div');
      d.className = 't-line';
      d.innerHTML = html;
      out.appendChild(d);
      while (out.childElementCount > 220) out.firstElementChild.remove();
      return d;
    };
    const print = lines => { (Array.isArray(lines) ? lines : [lines]).forEach(l => line(l)); scrollDown(); };
    const link = (href, text, external = true) =>
      `<a class="t-link" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${esc(text)}</a>`;
    const key = s => `<span class="t-key">${s}</span>`;
    const dim = s => `<span class="t-dim">${s}</span>`;
    const goTo = (id, msg) => {
      print(dim(`→ ${msg}`));
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }, 450);
    };

    const COMMANDS = {
      help: () => print([
        '<span class="t-hi">Kullanılabilir komutlar</span>',
        ...[
          ['hakkimizda', 'HSD Gazi nedir?'],
          ['komiteler', 'beş komiteyi listeler'],
          ['etkinlikler', 'yaklaşan etkinlikler'],
          ['ekip', 'ekip bölümüne gider'],
          ['sss', 'sıkça sorulan sorular'],
          ['basvur', 'ekibe katıl'],
          ['iletisim', 'sosyal medya hesapları'],
          ['hsdturkiye', 'HSD Türkiye ana sitesi'],
          ['neofetch', 'topluluk özeti'],
          ['credits', 'siteyi kim yaptı?'],
          ['clear', 'ekranı temizler']
        ].map(([c, d]) => `  ${key(c.padEnd(12))}${dim(d)}`),
        dim('ipucu: ↑ ↓ geçmiş · Tab tamamlar')
      ]),
      hakkimizda: () => print([
        'HSD Gazi, Huawei Student Developers programının Gazi Üniversitesi\'ndeki öğrenci topluluğu.',
        'Workshop, bootcamp, hackathon ve teknik söyleşiler düzenliyoruz.',
        '<span class="t-hi">Öğren. Üret. Bağlan.</span>',
        `${dim('→')} ${link('#hakkimizda', 'devamını oku', false)}`
      ]),
      komiteler: () => print([
        ...KOMITELER.map((k, i) => `${key(pad(i + 1))}  ${esc(k)}`),
        `${dim('→')} ${link('#komiteler', 'detaylar', false)} ${dim('·')} ${link('#basvur', 'başvur', false)}`
      ]),
      etkinlikler: () => {
        if (!upcoming.length) {
          print(['Şu an planlanmış bir etkinlik yok.', `${dim('→ duyurular:')} ${link(INSTAGRAM, '@hsdgazi')}`]);
          return;
        }
        print([
          `<span class="t-hi">${upcoming.length} yaklaşan etkinlik</span>`,
          ...upcoming.slice(0, 4).map(e =>
            `${key(`[${e._d ? `${pad(e._d.getDate())} ${AYLAR[e._d.getMonth()]}` : 'YAKINDA'}]`)} ${esc(e.baslik || 'Etkinlik')}${e.tur ? ` ${dim('· ' + esc(e.tur))}` : ''}`),
          `${dim('→')} ${link('#etkinlikler', 'tümünü gör', false)}`
        ]);
      },
      ekip: () => goTo('ekip', 'ekip bölümüne gidiliyor…'),
      sss: () => goTo('sss', 'SSS bölümüne gidiliyor…'),
      basvur: () => {
        print(`<span class="t-ok">✓</span> harika karar.${BASVURU ? ` ${link(BASVURU, 'başvuru formunu aç')}` : ''}`);
        goTo('basvur', 'başvuru bölümüne gidiliyor…');
      },
      iletisim: () => print([
        `instagram  ${link(INSTAGRAM, '@hsdgazi')}`,
        `linkedin   ${link(LINKEDIN, 'HSD Gazi')}`
      ]),
      hsdturkiye: () => print([
        `ana site   ${link(BOOTCAMP, 'hsdturkiyebootcamp.com')}`,
        `instagram  ${link(HSDTR_IG, '@hsdturkiye')}`,
        dim('Cloud, yapay zekâ ve DevOps bootcamp\'leri · ücretsiz')
      ]),
      neofetch: () => print(
        '<div class="nf">' +
          `<div class="nf-logo" aria-hidden="true">${['█ █ █▀▀ █▀▄', '█▀█ ▀▀█ █ █', '▀ ▀ ▀▀▀ ▀▀ '].join('\n')}</div>` +
          '<div class="nf-info">' + [
            '<span class="t-hi">hsd</span>@<span class="t-hi">gazi</span>',
            dim('────────────────'),
            `${key('okul    ')} Gazi Üniversitesi`,
            `${key('program ')} Huawei Student Developers`,
            `${key('odak    ')} Cloud · Yapay Zekâ · DevOps`,
            `${key('komite  ')} ${KOMITELER.length}`,
            `${key('durum   ')} <span class="t-ok">ekip arkadaşı arıyor</span>`
          ].join('\n') + '</div>' +
        '</div>'
      ),
      credits: () => print([
        `${key('tasarım ve kod')}  <span class="t-hi">İsmail Bilgehan Kazancı</span>`,
        `${key('github        ')}  ${link(AUTHOR_URL, 'github.com/DailyDana')}`,
        dim('// kütüphanesiz, elle yazıldı: HTML + CSS + JS')
      ]),
      whoami: () => print(`misafir ${dim('// henüz ekipte değilsin.')} ${key('basvur')} ${dim('yazarak değiştirebilirsin')}`),
      ls: () => print(`${key('hakkimizda/')}  ${key('komiteler/')}  ${key('etkinlikler/')}  ${key('ekip/')}  ${key('sss/')}  <span class="t-ok">basvur.sh*</span>  topluluk.js`),
      cat: args => {
        if (!args) { print(dim('kullanım: cat topluluk.js')); return; }
        if (/topluluk(\.js)?$/.test(args)) { print(CONFIG); return; }
        print(`<span class="t-err">cat: ${esc(args)}: böyle bir dosya yok</span>`);
      },
      date: () => print(new Date().toLocaleString('tr-TR', { dateStyle: 'full', timeStyle: 'short' })),
      echo: (args, raw) => print(esc(raw.replace(/^\s*\S+\s?/, ''))),
      sudo: () => print([
        '[sudo] misafir için parola: ********',
        `<span class="t-err">misafir, sudoers dosyasında değil.</span> ${dim('// yetki için önce')} ${key('basvur')}`
      ]),
      rm: () => print(`<span class="t-err">rm: 'hsd-gazi' silinemedi:</span> topluluklar silinmez, büyür.`),
      exit: () => print(dim('çıkış yok. zaten doğru yerdesin.')),
      merhaba: () => print(`Selam! Tanıştığımıza sevindik. ${key('help')} ile başlayabilirsin.`),
      huawei: () => print('Huawei Student Developers: teknoloji tutkusunu paylaşan üniversite öğrencilerine yönelik, Huawei tarafından desteklenen küresel bir program.'),
      git: () => print(`${dim('git clone hsd-gazi →')} erişim için önce ${key('basvur')}`),
      clear: () => { out.innerHTML = ''; }
    };
    const ALIASES = {
      yardim: 'help', '?': 'help', komutlar: 'help', h: 'help',
      hakkinda: 'hakkimizda', about: 'hakkimizda',
      komite: 'komiteler', etkinlik: 'etkinlikler', events: 'etkinlikler',
      team: 'ekip', faq: 'sss',
      katil: 'basvur', apply: 'basvur', './basvur.sh': 'basvur', 'basvur.sh': 'basvur',
      sosyal: 'iletisim', contact: 'iletisim', instagram: 'iletisim', linkedin: 'iletisim',
      bootcamp: 'hsdturkiye', turkiye: 'hsdturkiye',
      hsd: 'neofetch', fastfetch: 'neofetch',
      yapan: 'credits', gelistirici: 'credits', imza: 'credits', author: 'credits',
      tarih: 'date', cls: 'clear', temizle: 'clear',
      quit: 'exit', cikis: 'exit',
      selam: 'merhaba', hello: 'merhaba', hi: 'merhaba', hey: 'merhaba'
    };
    const COMPLETE = Object.keys(COMMANDS).filter(c => !['cat', 'echo', 'git', 'rm', 'sudo'].includes(c));
    const norm = s => s.toLocaleLowerCase('tr')
      .replace(/[çğıöşüâîû]/g, ch => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' }[ch]));

    const hist = [];
    let histIdx = 0;
    const run = raw => {
      line(`${PS}${esc(raw)}`);
      const v = raw.trim();
      if (!v) { scrollDown(); return; }
      if (hist[hist.length - 1] !== v) hist.push(v);
      histIdx = hist.length;

      const [first, ...rest] = v.split(/\s+/);
      let cmd = norm(first);
      const args = norm(rest.join(' '));
      if ((cmd === 'sh' || cmd === 'bash') && args.includes('basvur')) cmd = 'basvur';
      cmd = ALIASES[cmd] || cmd;
      const fn = COMMANDS[cmd];
      if (fn) fn(args, v);
      else print(`<span class="t-err">komut bulunamadı:</span> ${esc(first)} ${dim('//')} ${key('help')} ${dim('yazmayı dene')}`);
      scrollDown();
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = input.value;
      input.value = '';
      run(v);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        if (!hist.length) return;
        e.preventDefault();
        histIdx = Math.max(0, histIdx - 1);
        input.value = hist[histIdx];
      } else if (e.key === 'ArrowDown') {
        if (!hist.length) return;
        e.preventDefault();
        histIdx = Math.min(hist.length, histIdx + 1);
        input.value = hist[histIdx] || '';
      } else if (e.key === 'Tab') {
        const v = norm(input.value.trim());
        if (!v) return; // boşken Tab normal şekilde odağı taşısın
        e.preventDefault();
        const matches = COMPLETE.filter(c => c.startsWith(v));
        if (matches.length === 1) input.value = matches[0];
        else if (matches.length > 1) { line(`${PS}${esc(input.value)}`); print(dim(matches.join('  '))); }
      } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
        e.preventDefault();
        out.innerHTML = '';
      }
    });

    /* açılış animasyonu */
    let skipping = false, introDone = false;
    const wait = ms => (skipping ? Promise.resolve() : sleep(ms));
    const showPrompt = () => {
      if (introDone) return;
      introDone = true;
      print(`${dim('// bir komut yaz ya da dene:')} ${key('help')}`);
      form.hidden = false;
      if (chips) chips.hidden = false;
      scrollDown();
    };
    const intro = async () => {
      out.innerHTML = '';
      if (reduceMotion) {
        line(`${PS}cat topluluk.js`);
        CONFIG.forEach(l => line(l));
        showPrompt();
        return;
      }
      const cmdLine = line(`${PS}<span class="t-typed"></span><span class="t-caret"></span>`);
      const typed = $('.t-typed', cmdLine);
      await wait(650);
      for (const ch of 'cat topluluk.js') { typed.textContent += ch; await wait(45 + Math.random() * 55); }
      await wait(260);
      $('.t-caret', cmdLine)?.remove();
      for (const l of CONFIG) { line(l); scrollDown(); await wait(60); }
      await wait(200);
      showPrompt();
    };

    let introP = null;
    const startIntro = () => { if (!introP) introP = intro(); return introP; };
    const ensureReady = async () => { skipping = true; await startIntro(); };

    if (hasIO) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(en => en.isIntersecting)) { io.disconnect(); startIntro(); }
      }, { threshold: 0.3 });
      io.observe(term);
    } else {
      startIntro();
    }

    let busy = false;
    const typeAndRun = async cmd => {
      if (busy) return;
      busy = true;
      await ensureReady();
      input.value = '';
      for (const ch of cmd) { input.value += ch; await sleep(reduceMotion ? 0 : 38); }
      await sleep(reduceMotion ? 0 : 140);
      input.value = '';
      run(cmd);
      busy = false;
    };

    if (chips) chips.addEventListener('click', e => {
      const b = e.target.closest('[data-cmd]');
      if (b) typeAndRun(b.dataset.cmd);
    });
    body.addEventListener('click', async e => {
      if (e.target.closest('a')) return;
      if (String(window.getSelection?.() || '')) return;
      await ensureReady();
      input.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', async e => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t instanceof Element && t.closest('input, textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      await ensureReady();
      term.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      input.focus({ preventScroll: true });
    });
  });

  /* ---------- küçük dokunuşlar ---------- */
  safe('year', () => { const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear()); });
  safe('console', () => {
    console.log('%c<HSD/>%c Gazi', 'color:#C7000B;font:900 32px monospace', 'color:#111114;font:700 22px monospace');
    console.log(`%cKaynak koda bakıyorsan tam aradığımız kişisin.\nTeknik Etkinlik Komitesi seni bekliyor → ${BASVURU || INSTAGRAM}`, 'font:13px/1.6 monospace');
    console.log(`%cSite: İsmail Bilgehan Kazancı · ${AUTHOR_URL}`, 'font:12px monospace;color:#5E5E66');
  });
})();
