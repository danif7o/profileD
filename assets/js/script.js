document.addEventListener('DOMContentLoaded', function() {  
  // Recopilar todas las imágenes de los proyectos
  const allProjectImages = [];
  document.querySelectorAll('.gallery-img').forEach((gallery, index) => {
    const img = gallery.querySelector('img');
    if (img) {
      allProjectImages.push({
        src: img.src,
        alt: img.alt || `Imagen del proyecto ${index + 1}`,
        element: gallery
      });
    }
  });
  
  // Solo crear lightbox si hay imágenes
  if (allProjectImages.length > 0) {
    // Crear estructura del lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <div class="lightbox-counter" id="lightboxCounter">1 / ${allProjectImages.length}</div>
        <button class="lightbox-close" aria-label="Cerrar">✕</button>
        <div class="lightbox-image-container">
          <img src="" alt="" id="lightboxImg">
        </div>
        <div class="lightbox-nav">
          <button class="lightbox-prev" aria-label="Anterior">◀</button>
          <button class="lightbox-next" aria-label="Siguiente">▶</button>
        </div>
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    
    // Función para abrir lightbox
    function openLightbox(index) {
      if (index < 0) index = 0;
      if (index >= allProjectImages.length) index = allProjectImages.length - 1;
      
      currentIndex = index;
      const image = allProjectImages[currentIndex];
      
      if (image) {
        // Precargar la imagen
        const tempImg = new Image();
        tempImg.onload = function() {
          lightboxImg.src = image.src;
          lightboxImg.alt = image.alt;
          lightboxCaption.textContent = image.alt;
          lightboxCounter.textContent = `${currentIndex + 1} / ${allProjectImages.length}`;
        };
        tempImg.src = image.src;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Actualizar visibilidad de navegación
        if (allProjectImages.length <= 1) {
          lightboxCounter.style.display = 'none';
          prevBtn.style.display = 'none';
          nextBtn.style.display = 'none';
        } else {
          lightboxCounter.style.display = 'block';
          prevBtn.style.display = 'flex';
          nextBtn.style.display = 'flex';
        }
        
        // Precargar imágenes adyacentes
        preloadAdjacentImages(currentIndex);
      }
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (lightboxImg.src !== '#') {
          // Mantener la imagen por si se vuelve a abrir
        }
      }, 300);
    }
    
    function nextImage() {
      if (currentIndex < allProjectImages.length - 1) {
        openLightbox(currentIndex + 1);
      }
    }
    
    function prevImage() {
      if (currentIndex > 0) {
        openLightbox(currentIndex - 1);
      }
    }
    
    function preloadAdjacentImages(index) {
      const prevIndex = index - 1;
      const nextIndex = index + 1;
      
      if (prevIndex >= 0) {
        const prevImg = new Image();
        prevImg.src = allProjectImages[prevIndex].src;
      }
      
      if (nextIndex < allProjectImages.length) {
        const nextImg = new Image();
        nextImg.src = allProjectImages[nextIndex].src;
      }
    }
    
    // Eventos para las imágenes de la galería
    document.querySelectorAll('.gallery-img').forEach((gallery, idx) => {
      gallery.addEventListener('click', function(e) {
        e.stopPropagation();
        openLightbox(idx);
      });
      gallery.style.cursor = 'pointer';
    });
    
    // Eventos del lightbox
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Teclado
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    });
    
    // Touch events para móviles (swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const diff = touchEndX - touchStartX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          prevImage();
        } else {
          nextImage();
        }
      }
    });
  }
  
  // ========== ANIMACIÓN AL HACER SCROLL ==========
  const observerOptions = { 
    threshold: 0.3, 
    rootMargin: '0px 0px -50px 0px' 
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observar elementos con animate-on-scroll
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
});