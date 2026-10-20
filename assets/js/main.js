// Carruseles: cada .carousel lee la carpeta de imágenes (data-images) y cuántas hay (data-count).
// Las imágenes se llaman 01.webp, 02.webp, ...
document.querySelectorAll('.post .carousel').forEach((carousel) => buildCarousel(carousel));

function buildCarousel(carousel, startIndex = 0) {
  const base = carousel.dataset.images;
  const count = Number(carousel.dataset.count);
  const label = carousel.dataset.label;
  const tall = carousel.classList.contains('carousel-tall');

  carousel.replaceChildren();
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
    img.loading = i === 1 || i === startIndex + 1 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.dataset.index = i - 1;
    slide.append(img);
    track.append(slide);
  }
  carousel.append(track);

  if (count < 2 || tall) return { go: () => {}, current: () => 0, update: () => {} };

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

  const current = () => (track.clientWidth ? Math.round(track.scrollLeft / track.clientWidth) : 0);
  const go = (i, behavior = 'smooth') => {
    i = Math.max(0, Math.min(count - 1, i));
    track.scrollTo({ left: i * track.clientWidth, behavior });
  };
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
  return { go, current, update };
}

function button(className, text, ariaLabel, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  if (className) b.className = className;
  b.textContent = text;
  b.setAttribute('aria-label', ariaLabel);
  if (onClick) b.addEventListener('click', onClick);
  return b;
}

// Ventana emergente: al tocar una imagen, la publicación se abre en grande como carrusel
const modal = document.querySelector('.post-modal');
const modalCarousel = modal.querySelector('.carousel');
const modalTitle = modal.querySelector('.post-modal-title');
const modalText = modal.querySelector('.post-modal-text');
let modalControls = null;

document.querySelector('.posts').addEventListener('click', (e) => {
  const img = e.target.closest('.carousel-slide img');
  if (!img) return;
  const post = img.closest('.post');
  const source = post.querySelector('.carousel');

  modalCarousel.dataset.images = source.dataset.images;
  modalCarousel.dataset.count = source.dataset.count;
  modalCarousel.dataset.label = source.dataset.label;
  modalCarousel.classList.toggle('carousel-tall', source.classList.contains('carousel-tall'));
  modalTitle.textContent = post.querySelector('h3').textContent;
  modalText.textContent = post.querySelector('.post-body p').textContent;

  const start = Number(img.dataset.index);
  modalControls = buildCarousel(modalCarousel, start);
  modal.showModal();
  document.body.classList.add('modal-open');
  modalControls.go(start, 'instant');
  modalControls.update();
  modalCarousel.querySelector('.carousel-track').focus({ preventScroll: true });
});

modal.addEventListener('keydown', (e) => {
  if (!modalControls) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); modalControls.go(modalControls.current() + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); modalControls.go(modalControls.current() - 1); }
});
modal.querySelector('.post-modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
});
