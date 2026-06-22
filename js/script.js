/* ============================================================
   script.js — PontoGO Landing Page (revisão 2)
   Funcionalidades:
     1. Menu mobile (hamburger)
     2. Scroll suave nos links de âncora
     3. Header shadow on scroll
     4. Seletor de planos interativo
     5. Formulário — previne reload + exibe sucesso apenas após envio
        (estrutura preparada para Formspree)
   ============================================================ */

/* ----------------------------------------------------------
   DADOS DOS PLANOS
   ---------------------------------------------------------- */
const plansData = [
  {
    name:     'Startup',
    users:    '1 a 10 usuários',
    monthly:  { prefix: 'R$', amount: '79,90',    suffix: '/ mês' },
    yearly:   { prefix: 'R$', amount: '878,00',   suffix: '/ ano' },
    isCustom: false,
  },
  {
    name:     'Essencial',
    users:    '11 a 25 usuários',
    monthly:  { prefix: 'R$', amount: '149,90',   suffix: '/ mês' },
    yearly:   { prefix: 'R$', amount: '1.648,00', suffix: '/ ano' },
    isCustom: false,
  },
  {
    name:     'Profissional',
    users:    '26 a 50 usuários',
    monthly:  { prefix: 'R$', amount: '249,90',   suffix: '/ mês' },
    yearly:   { prefix: 'R$', amount: '2.748,00', suffix: '/ ano' },
    isCustom: false,
  },
  {
    name:     'Business',
    users:    '51 a 100 usuários',
    monthly:  { prefix: 'R$', amount: '399,90',   suffix: '/ mês' },
    yearly:   { prefix: 'R$', amount: '4.398,00', suffix: '/ ano' },
    isCustom: false,
  },
  {
    name:     'Enterprise',
    users:    'Acima de 100 usuários',
    monthly:  { prefix: '', amount: 'Sob consulta', suffix: '' },
    yearly:   { prefix: '', amount: 'Sob consulta', suffix: '' },
    isCustom: true,
  },
];

/* ----------------------------------------------------------
   1. MENU MOBILE
   ---------------------------------------------------------- */
(function initMobileMenu() {
  const btn       = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (!btn || !mobileNav) return;

  function toggleMenu(forceClose) {
    const willOpen = forceClose ? false : !btn.classList.contains('open');
    btn.classList.toggle('open', willOpen);
    mobileNav.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
    mobileNav.setAttribute('aria-hidden', String(!willOpen));
    document.body.style.overflow = willOpen ? 'hidden' : '';
  }

  btn.addEventListener('click', () => toggleMenu());
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(true)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(true); });
})();

/* ----------------------------------------------------------
   2. SCROLL SUAVE
   ---------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id     = this.getAttribute('href');
      const target = document.querySelector(id);
      if (!target || id === '#') return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ----------------------------------------------------------
   3. HEADER SHADOW NO SCROLL
   ---------------------------------------------------------- */
(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ----------------------------------------------------------
   4. SELETOR DE PLANOS
   ---------------------------------------------------------- */
(function initPlanSelector() {
  const rangeBtns = document.querySelectorAll('.range-btn');
  if (!rangeBtns.length) return;

  // Referências dos elementos a atualizar
  const els = {
    tierMonthly:   document.getElementById('planTierMonthly'),
    usersMonthly:  document.getElementById('planUsersMonthly'),
    prefixMonthly: document.getElementById('planPriceMonthlyPrefix'),
    amtMonthly:    document.getElementById('planPriceMonthly'),
    sufMonthly:    document.getElementById('planPriceMonthlySuffix'),
    ctaMonthly:    document.getElementById('planCtaMonthly'),

    tierYearly:    document.getElementById('planTierYearly'),
    usersYearly:   document.getElementById('planUsersYearly'),
    prefixYearly:  document.getElementById('planPriceYearlyPrefix'),
    amtYearly:     document.getElementById('planPriceYearly'),
    sufYearly:     document.getElementById('planPriceYearlySuffix'),
    ctaYearly:     document.getElementById('planCtaYearly'),
  };

  function updatePlans(index) {
    const plan = plansData[index];
    if (!plan) return;

    // Fade out
    const targets = [els.tierMonthly, els.amtMonthly, els.tierYearly, els.amtYearly, els.usersMonthly, els.usersYearly];
    targets.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(5px)'; } });

    setTimeout(() => {
      // Actualiza textos
      if (els.tierMonthly)   els.tierMonthly.textContent   = plan.name;
      if (els.usersMonthly)  els.usersMonthly.textContent  = plan.users;
      if (els.prefixMonthly) els.prefixMonthly.textContent = plan.monthly.prefix;
      if (els.amtMonthly)    els.amtMonthly.textContent    = plan.monthly.amount;
      if (els.sufMonthly)    els.sufMonthly.textContent    = plan.monthly.suffix;

      if (els.tierYearly)    els.tierYearly.textContent    = plan.name;
      if (els.usersYearly)   els.usersYearly.textContent   = plan.users;
      if (els.prefixYearly)  els.prefixYearly.textContent  = plan.yearly.prefix;
      if (els.amtYearly)     els.amtYearly.textContent     = plan.yearly.amount;
      if (els.sufYearly)     els.sufYearly.textContent     = plan.yearly.suffix;

      const ctaLabel = plan.isCustom ? 'Falar com consultor' : 'Começar agora';
      if (els.ctaMonthly) els.ctaMonthly.textContent = ctaLabel;
      if (els.ctaYearly)  els.ctaYearly.textContent  = ctaLabel;

      // Fade in
      targets.forEach(el => {
        if (el) {
          el.style.transition = 'opacity 200ms ease, transform 200ms ease';
          el.style.opacity    = '1';
          el.style.transform  = 'translateY(0)';
        }
      });
    }, 140);
  }

  rangeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      rangeBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      updatePlans(parseInt(this.dataset.range, 10));
    });
  });

  updatePlans(0); // estado inicial
})();

/* ----------------------------------------------------------
   5. FORMULÁRIO — ENVIO FALSO / PREPARADO PARA FORMSPREE
   ---------------------------------------------------------- */
(function initContactForm() {
  const form    = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  /*
   * INTEGRAÇÃO FORMSPREE:
   * Para ativar o envio real, siga os passos:
   *   1. Crie uma conta em https://formspree.io
   *   2. Crie um novo formulário e copie o endpoint (ex.: https://formspree.io/f/xpzgkwlb)
   *   3. No index.html, substitua: action="URL_FORMSPREE_AQUI"  pelo endpoint real
   *   4. Altere o submit handler abaixo para enviar via fetch (ver comentário ao final)
   */

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // evita reload da página

    // Validação HTML5 nativa
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('.form__submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    /*
     * --- MODO SEM BACKEND (padrão atual) ---
     * Simula delay de resposta e exibe mensagem de sucesso.
     * Para usar Formspree, remova este bloco setTimeout e descomente o bloco fetch abaixo.
     */
    setTimeout(function () {
      showSuccess();
    }, 700);

    /*
     * --- MODO COM FORMSPREE (descomentado quando integrar) ---
     *
     * const formData = new FormData(form);
     * fetch(form.action, {
     *   method: 'POST',
     *   body: formData,
     *   headers: { 'Accept': 'application/json' }
     * })
     * .then(response => {
     *   if (response.ok) {
     *     showSuccess();
     *   } else {
     *     if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar e receber contato'; }
     *     alert('Erro ao enviar. Tente novamente.');
     *   }
     * })
     * .catch(() => {
     *   if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar e receber contato'; }
     *   alert('Erro de conexão. Tente novamente.');
     * });
     */
  });

  function showSuccess() {
    // Oculta todos os campos do formulário
    Array.from(form.children).forEach(function (child) {
      if (child !== success) child.style.display = 'none';
    });
    // Exibe mensagem de sucesso
    success.hidden = false;
    success.focus();
  }
})();
