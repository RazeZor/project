/**
 * Alejandro Fotografía — Main Application Logic
 * Interactive Quote Builder, Lightbox Gallery, Responsive Nav & Smooth States
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initPortfolioFilter();
  initLightbox();
  initQuoteCalculator();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   Header Scroll State & Active Section Tracking
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active navigation link tracking via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

/* ==========================================================================
   Mobile Navigation Drawer & Accessibility
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navContainer = document.querySelector('.nav-container');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (!hamburger || !navContainer) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !hamburger.classList.contains('active');
    hamburger.classList.toggle('active', isOpen);
    navContainer.classList.toggle('active', isOpen);
    if (backdrop) backdrop.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());

  if (backdrop) {
    backdrop.addEventListener('click', () => toggleMenu(false));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('active')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   Portfolio Filtering with Smooth Transitions
   ========================================================================== */
function initPortfolioFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!tabBtns.length || !galleryItems.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      galleryItems.forEach(item => {
        const matches = category === 'all' || item.classList.contains(category);
        if (matches) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   Portfolio Lightbox with Keyboard & Touch Support
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const titleEl = modal.querySelector('.lightbox-title');
  const catEl = modal.querySelector('.lightbox-category');
  const counterEl = modal.querySelector('.lightbox-counter');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next');

  let activeIndex = 0;
  let currentItems = [];

  const getVisibleItems = () => {
    return Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
  };

  const updateLightbox = (index) => {
    currentItems = getVisibleItems();
    if (!currentItems.length) return;

    if (index < 0) index = currentItems.length - 1;
    if (index >= currentItems.length) index = 0;
    activeIndex = index;

    const item = currentItems[activeIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-overlay h3')?.textContent || 'Fotografía Profesional';
    const category = item.querySelector('.gallery-overlay-badge')?.textContent || 'Alejandro Fotografía';

    modalImg.src = img.src;
    modalImg.alt = img.alt || title;
    if (titleEl) titleEl.textContent = title;
    if (catEl) catEl.textContent = category;
    if (counterEl) counterEl.textContent = `${activeIndex + 1} de ${currentItems.length}`;
  };

  const openLightbox = (item) => {
    currentItems = getVisibleItems();
    const idx = currentItems.indexOf(item);
    updateLightbox(idx >= 0 ? idx : 0);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => updateLightbox(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateLightbox(activeIndex + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(activeIndex + 1);
  });
}

/* ==========================================================================
   The Live Thing: Real-Time Interactive Quote Builder (Cotizador en Vivo)
   ========================================================================== */
function initQuoteCalculator() {
  const selectService = document.getElementById('quote-service');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  const summaryList = document.getElementById('quote-summary-list');
  const totalAmountEl = document.getElementById('quote-total-amount');
  const whatsappBtn = document.getElementById('quote-whatsapp-btn');

  if (!selectService || !totalAmountEl) return;

  const services = {
    matrimonio: { name: 'Matrimonio Completo (Hasta 8h)', price: 450000 },
    evento: { name: 'Evento Social o Corporativo (4-6h)', price: 300000 },
    bautizo: { name: 'Bautizo (3-4h)', price: 220000 },
    preboda: { name: 'Sesión Pre / Post Boda (1.5-2h)', price: 160000 },
    marca: { name: 'Redes Sociales / Marca Personal (2h)', price: 140000 },
    familiar: { name: 'Sesión Familiar (1-1.5h)', price: 120000 },
    personal: { name: 'Sesión Personal / Lifestyle (1h)', price: 90000 },
    video: { name: 'Video Terrenos / Propiedades (1 día)', price: 400000 }
  };

  const addons = {
    express: { name: 'Entrega Express (48 horas)', price: 40000 },
    album: { name: 'Álbum Fotográfico Personalizado', price: 70000 },
    reel: { name: 'Reel para Redes (30s editado)', price: 60000 }
  };

  const formatCLP = (amount) => {
    return '$' + amount.toLocaleString('es-CL');
  };

  const calculateTotal = () => {
    const serviceKey = selectService.value;
    const selectedService = services[serviceKey] || services.matrimonio;
    let total = selectedService.price;
    const selectedAddons = [];

    addonCheckboxes.forEach(cb => {
      if (cb.checked && addons[cb.value]) {
        total += addons[cb.value].price;
        selectedAddons.push(addons[cb.value]);
      }
    });

    // Render Summary List
    if (summaryList) {
      let html = `
        <div class="quote-summary-row">
          <span>${selectedService.name}</span>
          <span style="font-weight: 600;">${formatCLP(selectedService.price)}</span>
        </div>
      `;

      selectedAddons.forEach(ad => {
        html += `
          <div class="quote-summary-row" style="color: var(--color-accent);">
            <span>+ ${ad.name}</span>
            <span>${formatCLP(ad.price)}</span>
          </div>
        `;
      });

      summaryList.innerHTML = html;
    }

    // Update Total Display
    totalAmountEl.textContent = formatCLP(total);

    // Update WhatsApp Direct Link
    if (whatsappBtn) {
      let addonText = selectedAddons.length
        ? `%0A*Adicionales:* ${selectedAddons.map(a => a.name + ' (' + formatCLP(a.price) + ')').join(', ')}`
        : '';
      
      const msg = `Hola Alejandro! 👋 Estuve revisando tu tarifario 2025 y preparé una cotización:%0A%0A` +
        `*Servicio:* ${selectedService.name} (${formatCLP(selectedService.price)})` +
        addonText +
        `%0A*Total estimado:* ${formatCLP(total)} CLP%0A%0A` +
        `¿Tienes disponibilidad para mi fecha? Gracias!`;

      whatsappBtn.href = `https://wa.me/56985015586?text=${msg}`;
    }
  };

  selectService.addEventListener('change', calculateTotal);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', calculateTotal));
  calculateTotal();
}

/* ==========================================================================
   Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#contact-name')?.value.trim();
    const email = form.querySelector('#contact-email')?.value.trim();
    const phone = form.querySelector('#contact-phone')?.value.trim();
    const type = form.querySelector('#contact-type')?.value;
    const date = form.querySelector('#contact-date')?.value;
    const message = form.querySelector('#contact-message')?.value.trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.textContent = 'Por favor completa todos los campos requeridos (*).';
        statusEl.className = 'form-status';
        statusEl.style.display = 'block';
        statusEl.style.backgroundColor = '#fce8e6';
        statusEl.style.color = '#c5221f';
        statusEl.style.borderColor = '#fad2cf';
      }
      return;
    }

    // Success response
    if (statusEl) {
      statusEl.textContent = '¡Gracias por contactar! Te redirigiremos a WhatsApp para confirmar inmediatamente tu fecha.';
      statusEl.className = 'form-status success';
      statusEl.style.display = 'block';
    }

    // Optional direct WhatsApp redirect with details
    setTimeout(() => {
      const msg = `Hola Alejandro! Mi nombre es *${encodeURIComponent(name)}*.%0A` +
        `Email: ${encodeURIComponent(email)}%0A` +
        (phone ? `Teléfono: ${encodeURIComponent(phone)}%0A` : '') +
        (type ? `Tipo de evento: ${encodeURIComponent(type)}%0A` : '') +
        (date ? `Fecha estimada: ${encodeURIComponent(date)}%0A` : '') +
        `Mensaje: ${encodeURIComponent(message)}`;

      window.open(`https://wa.me/56985015586?text=${msg}`, '_blank');
      form.reset();
    }, 1200);
  });
}

/* ==========================================================================
   Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
