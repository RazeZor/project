document.addEventListener('DOMContentLoaded', function() {
  manejarEfectoHeaderScroll();
  manejarMenuHamburguesa();
  manejarCierreMenuMobile();
  manejarFiltradoPortafolio();
  manejarLightboxGaleria();
  manejarScrollSuave();
});

// Cambia el estilo del header al hacer scroll
// DOM  = DOCUMENT OBJET MODEL
function manejarEfectoHeaderScroll() {
  
  const header = document.getElementById('header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Alterna el menú hamburguesa
function manejarMenuHamburguesa() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Cierra el menú mobile al hacer clic en un enlace
function manejarCierreMenuMobile() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links li');

  navLinksItems.forEach(item => {
    item.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Maneja el filtrado de la galería del portafolio
function manejarFiltradoPortafolio() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tabBtns.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const categoria = this.getAttribute('data-category');
      
      galleryItems.forEach(item => {
        if (categoria === 'all' || item.classList.contains(categoria)) {
          item.classList.remove('hidden');
          setTimeout(() => item.classList.add('visible'), 0);
        } else {
          item.classList.add('hidden');
          item.classList.remove('visible');
        }
      });
    });
  });
}


// Muestra una imagen en modo lightbox al hacer clic
function manejarLightboxGaleria() {
  const imagenes = document.querySelectorAll('.gallery-item img');

  imagenes.forEach(img => {
    img.addEventListener('click', function() {
      const lightbox = document.createElement('div');
      lightbox.classList.add('lightbox');

      const imgGrande = document.createElement('img');
      imgGrande.src = this.src;

      const botonCerrar = document.createElement('span');
      botonCerrar.classList.add('lightbox-close');
      botonCerrar.innerHTML = '&times;';

      lightbox.appendChild(imgGrande);
      lightbox.appendChild(botonCerrar);
      document.body.appendChild(lightbox);

      const estilo = document.createElement('style');
      estilo.textContent = `
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease-in-out;
        }
        .lightbox img {
          max-width: 90%;
          max-height: 80vh;
          object-fit: contain;
          border: 8px solid white;
        }
        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 30px;
          color: white;
          font-size: 40px;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .lightbox-close:hover {
          color: #bbb;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(estilo);

      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === botonCerrar) {
          document.body.removeChild(lightbox);
          document.head.removeChild(estilo);
        }
      });
    });
  });
}

// Aplica scroll suave a los enlaces ancla
function manejarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', function(e) {
      e.preventDefault();
      const destinoID = this.getAttribute('href');
      if (destinoID === '#') return;

      const destino = document.querySelector(destinoID);
      if (destino) {
        window.scrollTo({
          top: destino.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}
