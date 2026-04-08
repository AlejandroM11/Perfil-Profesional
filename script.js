'use strict';

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      revealObserver.unobserve(target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  el.style.transitionDelay = `${siblings.indexOf(el) * 90}ms`;
  revealObserver.observe(el);
});

// ============================================================
// CURSOR GLOW + HERO PARALLAX  (single mousemove listener)
// ============================================================
const glow = Object.assign(document.createElement('div'), { className: 'cursor-glow' });
document.body.appendChild(glow);

const hero = document.querySelector('.hero');
const halfW = () => window.innerWidth  / 2;
const halfH = () => window.innerHeight / 2;

document.addEventListener('mousemove', ({ clientX, clientY }) => {
  glow.style.left = `${clientX}px`;
  glow.style.top  = `${clientY}px`;

  if (hero) {
    const dx = (clientX - halfW()) / halfW();
    const dy = (clientY - halfH()) / halfH();
    hero.style.backgroundPosition = `${50 + dx * 4}% ${50 + dy * 4}%`;
  }
});

// ============================================================
// SKILL MODAL
// ============================================================
const modal     = document.getElementById('skillModal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle= document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeBtn  = modal.querySelector('.skill-modal__close');
const backdrop  = modal.querySelector('.skill-modal__backdrop');

function openModal(card) {
  modalIcon.textContent  = card.dataset.modalIcon;
  modalTitle.textContent = card.dataset.modalTitle;
  modalBody.textContent  = card.dataset.modalDetail;
  modal.classList.remove('is-closing');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  modal.classList.add('is-closing');
  modal.addEventListener('animationend', () => {
    modal.hidden = true;
    modal.classList.remove('is-closing');
    document.body.style.overflow = '';
  }, { once: true });
}

document.querySelectorAll('.skill-card').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openModal(card));
  card.addEventListener('keydown', ({ key }) => {
    if (key === 'Enter' || key === ' ') openModal(card);
  });
});

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', ({ key }) => {
  if (key === 'Escape' && !modal.hidden) closeModal();
});

// ============================================================
// SKILL CARD 3D TILT
// ============================================================
document.querySelectorAll('.skill-card').forEach((card) => {
  card.addEventListener('mousemove', ({ clientX, clientY }) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (clientX - left) / width  - 0.5;
    const y = (clientY - top)  / height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
    card.style.transform  = '';
  });
});
