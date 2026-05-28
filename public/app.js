/*
   Shere Can by Thunder Bully — Interactive Client Logic
   Navigation, Theme Toggle, Before/After Slider, Service Quiz,
   Boarding Calculator, Testimonial Carousel, FAQ Accordion, Form Validation
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation & Theme Toggle
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const themeToggle = document.querySelector('.theme-toggle');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll for all anchor links (supplement native scroll-behavior)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Theme Toggle (Dark / Light Mode)
  const savedTheme = localStorage.getItem('sherecantheme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sherecantheme', newTheme);
    });
  }

  // ==========================================
  // 2. Before / After Image Slider
  // ==========================================
  const sliderContainer = document.querySelector('.comparison-slider');
  const afterImage = document.querySelector('.image-after');
  const handle = document.querySelector('.slider-handle');

  if (sliderContainer && afterImage && handle) {
    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      let percentage = ((clientX - rect.left) / rect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      handle.style.left = `${percentage}%`;
    };

    // Mouse events
    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    sliderContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Touch events
    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) moveSlider(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });
  }

  // ==========================================
  // 3. Service Advisor Quiz
  // ==========================================
  const quizData = [
    {
      question: "¿Cuál es tu necesidad principal?",
      options: [
        { text: "Me voy de viaje y necesito cuidado para mi perro", score: "residencia" },
        { text: "Quiero un cachorro de raza de calidad", score: "cria" },
        { text: "Tengo un ejemplar y quiero competir en exposiciones", score: "handling" },
        { text: "Busco información general", score: "general" }
      ]
    },
    {
      question: "¿Cuánto tiempo necesitarías el servicio?",
      options: [
        { text: "Unos días o semanas (vacaciones, viaje)", score: "residencia" },
        { text: "Quiero un nuevo miembro permanente de la familia", score: "cria" },
        { text: "De forma periódica para competiciones", score: "handling" },
        { text: "No estoy seguro/a", score: "general" }
      ]
    },
    {
      question: "¿Has utilizado antes una residencia o criadero?",
      options: [
        { text: "Es mi primera vez", score: "residencia" },
        { text: "Sí, tengo experiencia", score: "cria" },
        { text: "No, pero me han recomendado este", score: "residencia" },
        { text: "Tengo perro de raza pero nunca he competido", score: "handling" }
      ]
    },
    {
      question: "¿Cómo prefieres contactar?",
      options: [
        { text: "Por WhatsApp ahora mismo", score: "residencia" },
        { text: "Me llaman a mí", score: "general" },
        { text: "Prefiero visitar las instalaciones", score: "residencia" },
        { text: "Quiero más información por email", score: "general" }
      ]
    }
  ];

  const quizResults = {
    residencia: {
      title: "¡La Residencia es para ti!",
      desc: "Tu perro estará en las mejores manos en nuestra finca de 5.800m². Manuel y su familia le cuidarán como uno más.",
      plan: "Residencia Canina",
      waText: "Hola,%20el%20consultor%20de%20Shere%20Can%20me%20ha%20recomendado%20la%20residencia%20y%20quiero%20consultar%20disponibilidad."
    },
    cria: {
      title: "¡Te ayudamos a encontrar tu cachorro ideal!",
      desc: "Llevamos desde 1990 criando AmStaff y American Bully con afijo Thunder Bully reconocido mundialmente.",
      plan: "Cría y Selección",
      waText: "Hola,%20el%20consultor%20me%20ha%20recomendado%20informarme%20sobre%20cachorros%20disponibles%20en%20Shere%20Can."
    },
    handling: {
      title: "¡Preparamos a tu ejemplar para competir!",
      desc: "Somos handler profesionales con décadas de experiencia en rings nacionales e internacionales.",
      plan: "Handling & Exposiciones",
      waText: "Hola,%20el%20consultor%20me%20ha%20recomendado%20el%20servicio%20de%20handling%20y%20quiero%20más%20información."
    },
    general: {
      title: "¡Contáctanos sin compromiso!",
      desc: "Cuéntanos tu situación y te orientamos sobre el mejor servicio para ti y tu perro.",
      plan: "Consulta General",
      waText: "Hola,%20me%20gustaría%20más%20información%20sobre%20los%20servicios%20de%20Shere%20Can."
    }
  };

  let currentStep = 0;
  const userAnswers = [];

  const quizStep = document.getElementById('quiz-step');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const progressFill = document.getElementById('progress-fill');
  const stepCount = document.getElementById('step-count');
  const quizResult = document.getElementById('quiz-result');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const recTitle = document.getElementById('rec-title');
  const recDesc = document.getElementById('rec-desc');
  const btnRestart = document.getElementById('btn-restart');
  const btnWaResult = document.getElementById('btn-whatsapp-result');

  function initQuiz() {
    if (!quizStep) return;
    currentStep = 0;
    userAnswers.length = 0;
    quizResult.classList.remove('active');
    quizStep.classList.add('active');
    if (btnPrev) btnPrev.style.visibility = 'hidden';
    if (btnNext) btnNext.innerText = 'Siguiente';
    showQuestion();
  }

  function showQuestion() {
    if (!quizStep) return;
    const questionInfo = quizData[currentStep];
    if (!questionInfo) return;

    quizQuestion.innerText = questionInfo.question;
    quizOptions.innerHTML = '';

    const progressPercent = (currentStep / quizData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    stepCount.innerText = `Paso ${currentStep + 1} de ${quizData.length}`;

    questionInfo.options.forEach((option, idx) => {
      const optionEl = document.createElement('div');
      optionEl.classList.add('quiz-option');
      if (userAnswers[currentStep] === idx) optionEl.classList.add('selected');

      optionEl.innerHTML = `
        <div class="quiz-radio"></div>
        <div class="quiz-option-text">${option.text}</div>
      `;

      optionEl.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
        optionEl.classList.add('selected');
        userAnswers[currentStep] = idx;
        if (btnNext) btnNext.disabled = false;
      });

      quizOptions.appendChild(optionEl);
    });

    if (btnNext) btnNext.disabled = (userAnswers[currentStep] === undefined);
    if (btnPrev) btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

    if (btnNext) {
      btnNext.innerText = currentStep === quizData.length - 1 ? 'Ver resultado' : 'Siguiente';
    }
  }

  function showResults() {
    if (!quizStep || !quizResult) return;
    quizStep.classList.remove('active');
    quizResult.classList.add('active');
    progressFill.style.width = '100%';
    stepCount.innerText = 'Resultado';

    // Tally scores
    const scores = { residencia: 0, cria: 0, handling: 0, general: 0 };
    userAnswers.forEach((ansIdx, qIdx) => {
      if (quizData[qIdx] && quizData[qIdx].options[ansIdx]) {
        const scoreType = quizData[qIdx].options[ansIdx].score;
        scores[scoreType] = (scores[scoreType] || 0) + 1;
      }
    });

    // Determine winner
    let finalRec = 'residencia';
    let maxScore = -1;
    Object.entries(scores).forEach(([key, val]) => {
      if (val > maxScore) { maxScore = val; finalRec = key; }
    });

    const result = quizResults[finalRec];
    if (resultTitle) resultTitle.innerText = result.title;
    if (resultDesc) resultDesc.innerText = result.desc;
    if (recTitle) {
      recTitle.innerHTML = `
        <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;flex-shrink:0;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        Servicio sugerido: ${result.plan}
      `;
    }
    if (recDesc) recDesc.innerText = result.desc;

    // Update WhatsApp link
    if (btnWaResult) {
      btnWaResult.href = `https://wa.me/34639291714?text=${result.waText}`;
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < quizData.length - 1) {
        currentStep++;
        showQuestion();
      } else {
        showResults();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showQuestion();
      }
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => initQuiz());
  }

  initQuiz();

  // ==========================================
  // 4. Boarding Calculator
  // ==========================================
  const pkg1dog = document.getElementById('pkg-1dog');
  const pkg2dogs = document.getElementById('pkg-2dogs');
  const pkg3dogs = document.getElementById('pkg-3dogs');
  const rangeSessions = document.getElementById('range-sessions');
  const sessionCountVal = document.getElementById('session-count-val');
  const addonBano = document.getElementById('addon-bano');
  const addonRecogida = document.getElementById('addon-recogida');

  const summaryPackageName = document.getElementById('summary-package-name');
  const summaryPackagePrice = document.getElementById('summary-package-price');
  const summarySessionsCount = document.getElementById('summary-sessions-count');
  const summarySessionsPrice = document.getElementById('summary-sessions-price');
  const summaryAddonsList = document.getElementById('summary-addons-list');
  const summaryAddonsPrice = document.getElementById('summary-addons-price');
  const summaryTotalPrice = document.getElementById('summary-total-price');

  const dogPackages = {
    '1dog':  { name: '1 Perro',         pricePerNight: 15, dogs: 1 },
    '2dogs': { name: '2 Perros',         pricePerNight: 13, dogs: 2 },
    '3dogs': { name: '3 o más perros',   pricePerNight: 11, dogs: 3 }
  };

  let activeDogsPackage = '1dog';

  function selectDogPackage(pkgKey) {
    activeDogsPackage = pkgKey;
    [pkg1dog, pkg2dogs, pkg3dogs].forEach(el => { if (el) el.classList.remove('selected'); });
    const el = document.getElementById(`pkg-${pkgKey}`);
    if (el) el.classList.add('selected');
    calculateBoardingCost();
  }

  function calculateBoardingCost() {
    if (!rangeSessions || !summaryTotalPrice) return;

    const pkg = dogPackages[activeDogsPackage];
    const nights = parseInt(rangeSessions.value);
    if (sessionCountVal) sessionCountVal.innerText = nights;

    // Boarding subtotal (price per night × number of dogs × nights)
    const boardingSubtotal = pkg.pricePerNight * pkg.dogs * nights;

    // Add-ons
    let addonsTotal = 0;
    const activeAddonNames = [];

    // Free addon (fotos) — always included, no cost
    activeAddonNames.push('Fotos WhatsApp (gratis)');

    if (addonBano && addonBano.classList.contains('selected')) {
      addonsTotal += 35;
      activeAddonNames.push('Baño y aseo (+35€)');
    }

    if (addonRecogida && addonRecogida.classList.contains('selected')) {
      addonsTotal += 40;
      activeAddonNames.push('Recogida/entrega (+40€)');
    }

    const grandTotal = boardingSubtotal + addonsTotal;

    // Update UI
    if (summaryPackageName) summaryPackageName.innerText = pkg.name;
    if (summaryPackagePrice) summaryPackagePrice.innerText = `${pkg.pricePerNight}€ / noche${pkg.dogs > 1 ? ` / perro (×${pkg.dogs})` : ''}`;
    if (summarySessionsCount) summarySessionsCount.innerText = `${nights} noche${nights !== 1 ? 's' : ''}`;
    if (summarySessionsPrice) summarySessionsPrice.innerText = `${boardingSubtotal}€`;
    if (summaryAddonsList) summaryAddonsList.innerText = activeAddonNames.join(', ');
    if (summaryAddonsPrice) summaryAddonsPrice.innerText = `+${addonsTotal}€`;

    // Animate total
    if (summaryTotalPrice) {
      summaryTotalPrice.style.opacity = '0.5';
      setTimeout(() => {
        summaryTotalPrice.innerText = `${grandTotal}€`;
        summaryTotalPrice.style.opacity = '1';
      }, 120);
    }
  }

  // Wire up calculator events
  if (pkg1dog) pkg1dog.addEventListener('click', () => selectDogPackage('1dog'));
  if (pkg2dogs) pkg2dogs.addEventListener('click', () => selectDogPackage('2dogs'));
  if (pkg3dogs) pkg3dogs.addEventListener('click', () => selectDogPackage('3dogs'));

  if (rangeSessions) {
    rangeSessions.addEventListener('input', () => calculateBoardingCost());
  }

  // Paid add-ons
  [addonBano, addonRecogida].forEach(addon => {
    if (addon) {
      addon.addEventListener('click', () => {
        addon.classList.toggle('selected');
        // Sync checkbox visibility
        const checkbox = addon.querySelector('.addon-checkbox');
        calculateBoardingCost();
      });
    }
  });

  // Initial calculation
  calculateBoardingCost();

  // ==========================================
  // 5. Testimonial Carousel
  // ==========================================
  const track = document.querySelector('.reviews-track');
  const slides = Array.from(document.querySelectorAll('.review-slide'));
  const dotsContainer = document.querySelector('.reviews-nav');

  if (track && slides.length > 0 && dotsContainer) {
    let currentSlideIdx = 0;

    // Create dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('review-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(idx);
        clearInterval(autoPlayInterval);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.review-dot'));

    function goToSlide(idx) {
      currentSlideIdx = idx;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      if (dots[idx]) dots[idx].classList.add('active');
    }

    let autoPlayInterval = setInterval(() => {
      goToSlide((currentSlideIdx + 1) % slides.length);
    }, 6000);
  }

  // ==========================================
  // 6. FAQ Accordion
  // ==========================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        const body = el.querySelector('.faq-body');
        if (body) body.style.maxHeight = null;
      });

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 7. Contact Form
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formStatus.innerText = 'Por favor, rellena los campos obligatorios (Nombre, Email y Mensaje).';
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.innerText = '¡Gracias por ponerte en contacto con nosotros! Manuel te responderá en la mayor brevedad posible.';
      formStatus.className = 'form-status success';
      contactForm.reset();

      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
      }, 6000);
    });
  }

});
