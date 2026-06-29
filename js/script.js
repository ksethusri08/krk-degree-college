/* =============================================
   KRK DEGREE COLLEGE — MAIN SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Preloader ──────────────────────────────── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('done'), 2200);
    });
    setTimeout(() => preloader.classList.add('done'), 3000); // fallback
  }

  /* ── Custom Cursor (desktop only) ───────────── */
  const dot  = document.querySelector('.cur-dot');
  const ring = document.querySelector('.cur-ring');
  if (dot && ring && window.innerWidth > 900) {
    let rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
      setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 90);
    });
    document.querySelectorAll('a,button,.dept-card,.why-card,.ev-card,.glass-card,.testi-card').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('big'); ring.classList.add('big'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('big'); ring.classList.remove('big'); });
    });
  }

  /* ── Sticky Navbar ──────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Menu ────────────────────────────── */
  const burger   = document.querySelector('.hamburger');
  const mobileNv = document.querySelector('.mobile-nav');
  if (burger && mobileNv) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNv.classList.toggle('open');
      document.body.style.overflow = mobileNv.classList.contains('open') ? 'hidden' : '';
    });
    /* Close mobile nav on any link click (including mob-sub links) */
    mobileNv.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNv.classList.remove('open');
        document.body.style.overflow = '';
        document.querySelectorAll('.mob-group').forEach(g => g.classList.remove('open'));
      });
    });
  }

  /* ── Particles Canvas ───────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) initParticles(canvas);

  /* ── Typewriter ─────────────────────────────── */
  const tw = document.getElementById('tw');
  if (tw) {
    const phrases = [
      'Excellence in Education',
      'Shaping Future Leaders',
      'Empowering Young Minds',
      'Knowledge · Growth · Success',
      'Building Bright Futures'
    ];
    let pi = 0, ci = 0, del = false, speed = 85;
    const type = () => {
      const p = phrases[pi];
      if (del) { tw.textContent = p.slice(0, --ci); speed = 42; }
      else      { tw.textContent = p.slice(0, ++ci); speed = 85; }
      if (!del && ci === p.length) { del = true; speed = 1600; }
      else if (del && ci === 0)    { del = false; pi = (pi + 1) % phrases.length; speed = 450; }
      setTimeout(type, speed);
    };
    setTimeout(type, 2600);
  }

  /* ── Ticker duplicate for infinite loop ──────── */
  const track = document.querySelector('.ticker-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ── Intersection Observer: reveal + counters ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');
      el.querySelectorAll('[data-count]').forEach(animateCount);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));

  /* Counter trigger separately for stat section */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      countIO.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stats-grid,.hero-mini-stats').forEach(el => countIO.observe(el));

  /* ── Testimonial Slider ─────────────────────── */
  const testiTrack = document.querySelector('.testi-track');
  const dots       = document.querySelectorAll('.tdot');
  const prevBtn    = document.querySelector('.testi-prev');
  const nextBtn    = document.querySelector('.testi-next');
  if (testiTrack) {
    let cur = 0;
    const cards = testiTrack.querySelectorAll('.testi-card');
    const total = Math.max(0, cards.length - (window.innerWidth > 900 ? 3 : 1));

    const slideTo = (n) => {
      cur = Math.max(0, Math.min(n, total));
      const pct = -(100 / cards.length) * cur;
      testiTrack.style.transform = `translateX(${pct}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    };
    slideTo(0);
    dots.forEach((d, i) => d.addEventListener('click', () => slideTo(i)));
    if (prevBtn) prevBtn.addEventListener('click', () => slideTo(cur - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => slideTo(cur + 1));

    /* Auto-advance */
    let autoT = setInterval(() => slideTo((cur + 1 > total ? 0 : cur + 1)), 5000);
    testiTrack.addEventListener('mouseenter', () => clearInterval(autoT));
    testiTrack.addEventListener('mouseleave', () => {
      clearInterval(autoT);
      autoT = setInterval(() => slideTo((cur + 1 > total ? 0 : cur + 1)), 5000);
    });
  }

  /* ── Staggered children ─────────────────────── */
  document.querySelectorAll('.stagger > *').forEach((child, i) => {
    child.classList.add('reveal');
    child.style.transitionDelay = `${i * 0.1}s`;
  });

  /* ── Active nav link ────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#nav .nav-links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Smooth anchor scrolling ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Parallax hero orbs ─────────────────────── */
  const heroOrb1 = document.querySelector('.hero-orb-1');
  const heroOrb2 = document.querySelector('.hero-orb-2');
  if (heroOrb1 && heroOrb2) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroOrb1.style.transform = `translateY(${y * .15}px)`;
      heroOrb2.style.transform = `translateY(${y * -.12}px)`;
    }, { passive: true });
  }

});

/* =============================================
   MOBILE ACCORDION TOGGLE
   ============================================= */
window.toggleMob = function(btn) {
  const group = btn.closest('.mob-group');
  const isOpen = group.classList.contains('open');
  document.querySelectorAll('.mob-group').forEach(g => g.classList.remove('open'));
  if (!isOpen) group.classList.add('open');
};

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function animateCount(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = '1';
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const dur    = 2000;
  const t0     = performance.now();
  const update = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + suffix;
  };
  requestAnimationFrame(update);
}

/* =============================================
   PARTICLES SYSTEM
   ============================================= */
function initParticles(canvas) {
  const ctx = canvas.getContext('2d');
  let pts = [];

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', () => { resize(); build(); });

  class P {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 1.8 + .4;
      this.vx = (Math.random() - .5) * .35;
      this.vy = (Math.random() - .5) * .35;
      this.a  = Math.random() * .45 + .08;
      this.c  = Math.random() > .65 ? '#ffd700' : '#4fc3f7';
      this.ph = Math.random() * Math.PI * 2;
      this.ps = .005 + Math.random() * .008;
    }
    tick() {
      this.x += this.vx; this.y += this.vy; this.ph += this.ps;
      const ca = this.a * (.7 + (Math.sin(this.ph) + 1) * .3);
      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) this.init();
      return ca;
    }
    draw(ca) {
      ctx.save();
      ctx.globalAlpha = ca;
      ctx.fillStyle   = this.c;
      ctx.shadowColor = this.c;
      ctx.shadowBlur  = 5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const build = () => {
    const n = Math.min(110, Math.floor(canvas.width * canvas.height / 8500));
    pts = Array.from({ length: n }, () => new P());
  };
  build();

  const MAX_D = 110;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => { const ca = p.tick(); p.draw(ca); });
    // connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_D) {
          ctx.save();
          ctx.globalAlpha = (1 - d / MAX_D) * .12;
          ctx.strokeStyle = '#4fc3f7';
          ctx.lineWidth   = .5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
}
