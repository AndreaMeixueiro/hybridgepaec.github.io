// Carruseles: cada .carousel lee la carpeta de imágenes (data-images) y cuántas hay (data-count).
// Las imágenes se llaman 01.webp, 02.webp, ...
document.querySelectorAll('.carousel').forEach((carousel) => {
  const base = carousel.dataset.images;
  const count = Number(carousel.dataset.count);
  const label = carousel.dataset.label;
  const tall = carousel.classList.contains('carousel-tall');

  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carrusel');
  carousel.setAttribute('aria-label', label);

  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.tabIndex = 0;
  for (let i = 1; i <= count; i++) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = `${base}${String(i).padStart(2, '0')}.webp`;
    img.alt = count > 1 ? `${label}, imagen ${i} de ${count}` : label;
    img.loading = i === 1 ? 'eager' : 'lazy';
    img.decoding = 'async';
    slide.append(img);
    track.append(slide);
  }
  carousel.append(track);

  if (count < 2 || tall) return;

  const prev = button('carousel-btn carousel-prev', '‹', 'Imagen anterior');
  const next = button('carousel-btn carousel-next', '›', 'Imagen siguiente');
  const counter = document.createElement('span');
  counter.className = 'carousel-count';
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  for (let i = 0; i < count; i++) {
    dots.append(button('', '', `Ir a la imagen ${i + 1}`, () => go(i)));
  }
  carousel.append(prev, next, counter, dots);

  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = (i) => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  prev.addEventListener('click', () => go(current() - 1));
  next.addEventListener('click', () => go(current() + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
  });

  const update = () => {
    const i = current();
    prev.disabled = i === 0;
    next.disabled = i === count - 1;
    counter.textContent = `${i + 1} / ${count}`;
    [...dots.children].forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
  };
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();
});

function button(className, text, ariaLabel, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  if (className) b.className = className;
  b.textContent = text;
  b.setAttribute('aria-label', ariaLabel);
  if (onClick) b.addEventListener('click', onClick);
  return b;
}

// Imagen ampliada al tocar una diapositiva
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
document.addEventListener('click', (e) => {
  const img = e.target.closest('.carousel-slide img');
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.showModal();
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
