(function initializeThemeWhenReady() {
  let initialized = false;

  function initializeTheme() {
    if (initialized) return;
    initialized = true;

    const body = document.body;
    const header = document.querySelector('#header');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    mobileToggle?.addEventListener('click', () => {
      body.classList.toggle('mobile-nav-active');
      mobileToggle.classList.toggle('bi-list');
      mobileToggle.classList.toggle('bi-x');
    });
    document.querySelectorAll('#navmenu a').forEach((link) => link.addEventListener('click', () => {
      body.classList.remove('mobile-nav-active');
      mobileToggle?.classList.add('bi-list');
      mobileToggle?.classList.remove('bi-x');
    }));

    const scrollTop = document.querySelector('#scroll-top');
    const toggleScrolled = () => {
      body.classList.toggle('scrolled', window.scrollY > 100);
      scrollTop?.classList.toggle('active', window.scrollY > 100);
      header?.classList.toggle('header-scrolled', window.scrollY > 100);
    };
    scrollTop?.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', toggleScrolled, { passive: true });
    toggleScrolled();

    if (window.AOS) window.AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    const typed = document.querySelector('.typed');
    if (typed && window.Typed) {
      const values = (typed.dataset.typedItems || '').split(',').map((item) => item.trim()).filter(Boolean);
      if (values.length) new window.Typed('.typed', { strings: values, loop: true, typeSpeed: 100, backSpeed: 50, backDelay: 2000 });
    }
    if (window.PureCounter) new window.PureCounter();
    window.setTimeout(() => document.querySelector('#preloader')?.remove(), 100);
  }

  document.addEventListener('resume:rendered', initializeTheme, { once: true });
  window.addEventListener('load', () => window.setTimeout(() => document.querySelector('#preloader')?.remove(), 3000));
})();
