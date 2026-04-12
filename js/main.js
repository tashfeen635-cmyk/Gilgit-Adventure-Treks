/* ============================================================
   THE JOURNEY TEAM — MAIN JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     DATA — loaded from API (fallbacks to empty arrays)
  -------------------------------------------------------- */
  let destinations = [];
  let reviews = [];
  let deals = [];
  let videos = [];
  let galleryImages = [];
  let teamMembers = [];

  /* --------------------------------------------------------
     UTILITIES
  -------------------------------------------------------- */
  function $(selector, context = document) {
    return context.querySelector(selector);
  }

  function $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  }

  function createEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'className') el.className = val;
      else if (key === 'innerHTML') el.innerHTML = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key.startsWith('data')) el.setAttribute(key.replace(/([A-Z])/g, '-$1').toLowerCase(), val);
      else el.setAttribute(key, val);
    }
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else el.appendChild(child);
    });
    return el;
  }

  function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = '';
    for (let i = 0; i < full; i++) html += '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/></svg>';
    if (half) html += '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" opacity="0.4"/></svg>';
    for (let i = 0; i < empty; i++) html += '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" opacity="0.15"/></svg>';
    return html;
  }

  function formatPKR(amount) {
    return 'PKR ' + amount.toLocaleString('en-PK');
  }

  /* --------------------------------------------------------
     NAVIGATION
  -------------------------------------------------------- */
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  $$('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // On mobile, toggle dropdown instead of closing menu
      if (link.classList.contains('nav-link--dropdown') && window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
        return;
      }
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      // Close any open dropdowns
      $$('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    });
  });

  /* --------------------------------------------------------
     HERO CAROUSEL
  -------------------------------------------------------- */
  const heroSlides = $$('.hero-slide');
  const heroDots = $$('.carousel-dot');
  let currentSlide = 0;
  let heroInterval;

  function setHeroSlide(index) {
    heroSlides[currentSlide].classList.remove('active');
    heroDots[currentSlide].classList.remove('active');
    heroDots[currentSlide].setAttribute('aria-selected', 'false');
    currentSlide = index;
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
    heroDots[currentSlide].setAttribute('aria-selected', 'true');
  }

  function nextHeroSlide() {
    setHeroSlide((currentSlide + 1) % heroSlides.length);
  }

  heroInterval = setInterval(nextHeroSlide, 6000);

  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(heroInterval);
      setHeroSlide(i);
      heroInterval = setInterval(nextHeroSlide, 6000);
    });
  });

  /* --------------------------------------------------------
     STAT COUNTER ANIMATION
  -------------------------------------------------------- */
  function animateCounters() {
    $$('.stat-number').forEach(el => {
      const target = parseFloat(el.dataset.target);
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  /* --------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  -------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  // NOTE: .reveal-up observers are started inside init() AFTER applySiteSettings()
  // to prevent flash of old hardcoded content before dynamic settings are applied.

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  /* --------------------------------------------------------
     DESTINATION CARDS
  -------------------------------------------------------- */
  function renderTopDestinations() {
    const topGrid = $('#topDestGrid');
    if (!topGrid) return;
    topGrid.innerHTML = '';
    const featured = destinations.filter(d => d.featured);
    featured.forEach(dest => {
      const card = createEl('div', { className: 'top-dest-card', role: 'button', tabindex: '0' });
      card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name} — top destination in ${dest.country} | Gilgit Adventure Treks" loading="lazy" width="600" height="400">
        <div class="top-dest-overlay">
          <span class="top-dest-tag">Top Destination</span>
          <h3 class="top-dest-name">${dest.name}</h3>
          <p class="top-dest-region">${dest.country}</p>
          <div class="top-dest-meta">
            <span class="top-dest-rating">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/></svg>
              ${dest.rating}
            </span>
            <span class="top-dest-price">From ${formatPKR(dest.price)}</span>
          </div>
          <button class="top-dest-btn" data-id="${dest.id}">Explore</button>
        </div>
      `;
      card.addEventListener('click', () => openModal(dest.id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(dest.id); }
      });
      topGrid.appendChild(card);
    });
  }

  function renderMapList() {
    const mapDestList = $('#mapDestList');
    if (!mapDestList) return;
    mapDestList.innerHTML = '';
    destinations.forEach(dest => {
      const item = createEl('div', { className: 'map-dest-item', role: 'button', tabindex: '0' });
      item.innerHTML = `
        <div class="map-dest-pin">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/></svg>
        </div>
        <div class="map-dest-info">
          <div class="map-dest-name">${dest.name}</div>
          <div class="map-dest-detail">From ${formatPKR(dest.price)}</div>
        </div>
      `;
      item.addEventListener('click', () => openModal(dest.id));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(dest.id);
        }
      });
      mapDestList.appendChild(item);
    });
  }

  /* --------------------------------------------------------
     DESTINATION MODAL
  -------------------------------------------------------- */
  const modal = $('#destinationModal');
  const modalClose = $('#modalClose');

  function openModal(id) {
    const dest = destinations.find(d => d.id === id);
    if (!dest) return;

    $('#modalImage').src = dest.image;
    $('#modalImage').alt = dest.name;
    $('#modalTitle').textContent = dest.name;
    $('#modalRating').innerHTML = `<span class="stars">${generateStars(dest.rating)}</span> ${dest.rating} (${dest.reviews.toLocaleString()} reviews)`;
    $('#modalDescription').textContent = dest.description;
    $('#modalHighlights').innerHTML = dest.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('');
    $('#modalPrice').innerHTML = `${formatPKR(dest.price)} <span>/person</span>`;
    $('#modalBookBtn').href = 'book.html?destination=' + dest.id;

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.hidden = true;
      document.body.style.overflow = '';
    }, 300);
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* --------------------------------------------------------
     REVIEWS CAROUSEL
  -------------------------------------------------------- */
  const reviewsTrack = $('#reviewsTrack');
  const reviewsPrev = $('#reviewsPrev');
  const reviewsNext = $('#reviewsNext');
  const reviewsDots = $('#reviewsDots');
  let reviewIndex = 0;

  function renderReviews() {
    reviewsTrack.innerHTML = '';
    reviews.forEach(rev => {
      const card = createEl('div', { className: 'review-card' });
      card.innerHTML = `
        <div class="review-card-header">
          <img class="review-avatar" src="${rev.avatar}" alt="${rev.name}" loading="lazy">
          <div>
            <div class="review-author">${rev.name}</div>
            <div class="review-meta">
              ${rev.location}
              ${rev.verified ? '<span class="verified-badge"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg> Verified</span>' : ''}
            </div>
          </div>
        </div>
        <div class="review-stars">${generateStars(rev.rating)}</div>
        <p class="review-text">"${rev.text}"</p>
        <span class="review-destination">${rev.destination}</span>
      `;
      reviewsTrack.appendChild(card);
    });
    reviewIndex = 0;
    updateReviewsCarousel();
  }

  function getReviewsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxReviewIndex() {
    return Math.max(0, reviews.length - getReviewsPerView());
  }

  function updateReviewsCarousel() {
    const cardWidth = reviewsTrack.children[0]?.offsetWidth || 300;
    const gap = 24;
    reviewsTrack.style.transform = `translateX(-${reviewIndex * (cardWidth + gap)}px)`;

    const totalDots = getMaxReviewIndex() + 1;
    reviewsDots.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
      const dot = createEl('button', {
        className: `carousel-dot${i === reviewIndex ? ' active' : ''}`,
        'aria-label': `Review group ${i + 1}`
      });
      dot.addEventListener('click', () => {
        reviewIndex = i;
        updateReviewsCarousel();
      });
      reviewsDots.appendChild(dot);
    }
  }

  reviewsPrev.addEventListener('click', () => {
    reviewIndex = Math.max(0, reviewIndex - 1);
    updateReviewsCarousel();
  });

  reviewsNext.addEventListener('click', () => {
    reviewIndex = Math.min(getMaxReviewIndex(), reviewIndex + 1);
    updateReviewsCarousel();
  });

  window.addEventListener('resize', () => {
    reviewIndex = Math.min(reviewIndex, getMaxReviewIndex());
    updateReviewsCarousel();
  });

  /* --------------------------------------------------------
     DEALS & COUNTDOWNS
  -------------------------------------------------------- */
  const dealsGrid = $('#dealsGrid');
  let countdownEndTimes = [];

  function renderDeals() {
    dealsGrid.innerHTML = '';
    const previewDeals = deals.slice(0, 3);
    countdownEndTimes = previewDeals.map(d => new Date(d.expiresAt).getTime());

    previewDeals.forEach((deal, idx) => {
      const card = createEl('div', { className: 'deal-card' });
      const savePercent = Math.round((1 - deal.newPrice / deal.oldPrice) * 100);

      card.innerHTML = `
        <span class="deal-badge">${deal.badge}</span>
        <div class="deal-card-img">
          <img src="${deal.image}" alt="${deal.name} — limited time adventure deal | Gilgit Adventure Treks" loading="lazy" width="400" height="250">
        </div>
        <div class="deal-card-body">
          <h3 class="deal-card-name">${deal.name}</h3>
          <p class="deal-card-desc">${deal.description}</p>
          <div class="deal-pricing">
            <span class="deal-old-price">${formatPKR(deal.oldPrice)}</span>
            <span class="deal-new-price">${formatPKR(deal.newPrice)}</span>
            <span class="deal-save">Save ${savePercent}%</span>
          </div>
          <div class="deal-countdown" data-idx="${idx}">
            <div class="countdown-unit"><span class="countdown-value" data-unit="days">0</span><span class="countdown-label">Days</span></div>
            <div class="countdown-unit"><span class="countdown-value" data-unit="hours">0</span><span class="countdown-label">Hours</span></div>
            <div class="countdown-unit"><span class="countdown-value" data-unit="mins">0</span><span class="countdown-label">Mins</span></div>
            <div class="countdown-unit"><span class="countdown-value" data-unit="secs">0</span><span class="countdown-label">Secs</span></div>
          </div>
          <a href="book.html" class="deal-book-btn">Book This Package</a>
        </div>
      `;
      dealsGrid.appendChild(card);
    });

    updateCountdowns();
  }

  function updateCountdowns() {
    $$('.deal-countdown').forEach((el, idx) => {
      const remaining = Math.max(0, countdownEndTimes[idx] - Date.now());
      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);

      const vals = el.querySelectorAll('.countdown-value');
      vals[0].textContent = String(days).padStart(2, '0');
      vals[1].textContent = String(hours).padStart(2, '0');
      vals[2].textContent = String(mins).padStart(2, '0');
      vals[3].textContent = String(secs).padStart(2, '0');
    });
  }

  setInterval(updateCountdowns, 1000);

  /* --------------------------------------------------------
     NEWSLETTER — POST to API
  -------------------------------------------------------- */
  const newsletterForm = $('#newsletterForm');
  const newsletterSuccess = $('#newsletterSuccess');

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#newsletterEmail').value;
    const nameInput = $('#newsletterName');
    const name = nameInput ? nameInput.value : '';
    if (email) {
      try {
        await fetch('/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name })
        });
      } catch (err) {
        // Silently fail — UI still shows success
      }
      newsletterForm.style.display = 'none';
      newsletterSuccess.hidden = false;
    }
  });

  /* --------------------------------------------------------
     GALLERY SEE MORE
  -------------------------------------------------------- */
  const gallerySeeMore = $('#gallerySeeMore');
  const galleryGrid = $('#galleryGrid');

  if (gallerySeeMore && galleryGrid) {
    gallerySeeMore.addEventListener('click', () => {
      const expanded = galleryGrid.classList.toggle('expanded');
      gallerySeeMore.classList.toggle('active', expanded);
      gallerySeeMore.innerHTML = expanded
        ? 'See Less <svg viewBox="0 0 24 24" width="18" height="18"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" fill="currentColor"/></svg>'
        : 'See More <svg viewBox="0 0 24 24" width="18" height="18"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" fill="currentColor"/></svg>';
    });
  }

  /* --------------------------------------------------------
     GALLERY LIGHTBOX
  -------------------------------------------------------- */
  const lightbox = $('#galleryLightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxCounter = $('#lightboxCounter');
  let galleryItems = [];
  let lightboxIndex = 0;

  function getGalleryImageUrl(el) {
    const bg = el.style.backgroundImage;
    return bg.replace(/url\(['"]?/, '').replace(/['"]?\)/, '').replace('w=400', 'w=1200');
  }

  function openLightbox(index) {
    lightboxIndex = index;
    const url = getGalleryImageUrl(galleryItems[index]);
    lightboxImg.src = url;
    lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  function lightboxNav(dir) {
    lightboxIndex = (lightboxIndex + dir + galleryItems.length) % galleryItems.length;
    lightboxImg.src = getGalleryImageUrl(galleryItems[lightboxIndex]);
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryItems.length}`;
  }

  function initLightboxBindings() {
    galleryItems = $$('.gallery-item');
    galleryItems.forEach((item, i) => {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `View photo ${i + 1}`);
      item.addEventListener('click', () => openLightbox(i));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });
  }

  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxPrev').addEventListener('click', () => lightboxNav(-1));
  $('#lightboxNext').addEventListener('click', () => lightboxNav(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });

  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    galleryImages.forEach(img => {
      const item = createEl('div', {
        className: img.hidden ? 'gallery-item gallery-hidden' : 'gallery-item'
      });
      item.style.backgroundImage = `url('${img.imageUrl}')`;
      // Hidden img tag for SEO crawlability (background-image isn't indexed)
      const seoImg = createEl('img', {
        src: img.imageUrl,
        alt: img.altText || 'Northern Pakistan adventure photo — Gilgit Adventure Treks',
        loading: 'lazy',
        width: '400',
        height: '300',
        style: 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);'
      });
      item.appendChild(seoImg);
      galleryGrid.appendChild(item);
    });

    initLightboxBindings();
  }

  function renderTeam() {
    const teamGrid = $('#teamGrid');
    if (!teamGrid) return;
    teamGrid.innerHTML = '';

    const fbSvg = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/></svg>';
    const igSvg = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/></svg>';

    teamMembers.forEach(m => {
      const card = createEl('div', { className: 'team-card' });
      card.innerHTML = `
        <div class="team-card-img">
          <img src="${m.image}" alt="${m.name} — ${m.role} at Gilgit Adventure Treks" loading="lazy" width="300" height="300">
          <div class="team-card-socials">
            ${m.facebook ? `<a href="${m.facebook}" aria-label="Facebook">${fbSvg}</a>` : ''}
            ${m.instagram ? `<a href="${m.instagram}" aria-label="Instagram">${igSvg}</a>` : ''}
          </div>
        </div>
        <div class="team-card-body">
          <h3 class="team-card-name">${m.name}</h3>
          <span class="team-card-role">${m.role}</span>
          <p class="team-card-bio">${m.bio}</p>
        </div>
      `;
      teamGrid.appendChild(card);
    });
  }

  /* --------------------------------------------------------
     VIDEO SHOWCASE
  -------------------------------------------------------- */

  // Autoplay muted previews on cards when visible
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const vid = card.querySelector('video');
      const src = card.dataset.video;
      if (!vid || !src) return;

      if (entry.isIntersecting) {
        if (!vid.src || vid.src === '') vid.src = src;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.3 });

  /* ── Reels-Style Fullscreen Viewer ── */
  const reelsViewer = $('#reelsViewer');
  const reelsTrack = $('#reelsTrack');
  const reelsClose = $('#reelsClose');
  const reelsCounter = $('#reelsCounter');
  let reelsObserver = null;

  function openReels(startIndex) {
    if (!reelsViewer || videos.length === 0) return;

    reelsTrack.innerHTML = '';
    videos.forEach((v, i) => {
      const slide = document.createElement('div');
      slide.className = 'reel-slide' + (i !== startIndex ? ' paused' : '');
      slide.dataset.index = i;

      const video = document.createElement('video');
      video.playsInline = true;
      video.loop = true;
      video.preload = 'none';
      video.src = v.videoUrl;

      video.addEventListener('click', () => {
        if (video.paused) {
          video.play().catch(() => {});
          slide.classList.remove('paused');
        } else {
          video.pause();
          slide.classList.add('paused');
        }
      });

      const playBtn = document.createElement('div');
      playBtn.className = 'reel-play-btn';
      playBtn.innerHTML = '<svg viewBox="0 0 48 48" width="48" height="48"><path d="M19 15v18l15-9z" fill="white"/></svg>';

      const info = document.createElement('div');
      info.className = 'reel-info';
      info.innerHTML = '<h3>' + v.title + '</h3><p>' + v.description + '</p>';

      slide.appendChild(video);
      slide.appendChild(playBtn);
      slide.appendChild(info);
      reelsTrack.appendChild(slide);
    });

    reelsViewer.hidden = false;
    requestAnimationFrame(() => reelsViewer.classList.add('open'));
    document.body.style.overflow = 'hidden';

    const targetSlide = reelsTrack.children[startIndex];
    if (targetSlide) targetSlide.scrollIntoView({ behavior: 'instant' });

    updateReelsCounter(startIndex);

    const initialVideo = targetSlide?.querySelector('video');
    if (initialVideo) {
      initialVideo.play().catch(() => {});
      targetSlide.classList.remove('paused');
    }

    reelsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const slide = entry.target;
        const vid = slide.querySelector('video');
        if (!vid) return;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
          slide.classList.remove('paused');
          updateReelsCounter(parseInt(slide.dataset.index, 10));
        } else {
          vid.pause();
          slide.classList.add('paused');
        }
      });
    }, { root: reelsTrack, threshold: 0.7 });

    reelsTrack.querySelectorAll('.reel-slide').forEach(s => reelsObserver.observe(s));
  }

  function updateReelsCounter(index) {
    if (reelsCounter) reelsCounter.textContent = (index + 1) + ' / ' + videos.length;
  }

  function closeReels() {
    if (!reelsViewer) return;
    reelsTrack.querySelectorAll('video').forEach(v => { v.pause(); v.src = ''; });
    if (reelsObserver) { reelsObserver.disconnect(); reelsObserver = null; }
    reelsViewer.classList.remove('open');
    setTimeout(() => {
      reelsViewer.hidden = true;
      reelsTrack.innerHTML = '';
      document.body.style.overflow = '';
    }, 300);
  }

  if (reelsClose) reelsClose.addEventListener('click', closeReels);
  if (reelsViewer) {
    document.addEventListener('keydown', (e) => {
      if (!reelsViewer.hidden && e.key === 'Escape') closeReels();
    });
  }

  function renderVideos() {
    const videoGrid = $('#videoGrid');
    if (!videoGrid) return;
    videoGrid.innerHTML = '';

    videos.forEach((v, index) => {
      const tagClass = v.tag === 'Client Story' ? 'video-card-tag video-card-tag--client' : 'video-card-tag';
      const card = createEl('div', {
        className: 'video-card',
        role: 'button',
        tabindex: '0',
        'data-video': v.videoUrl
      });
      card.innerHTML = `
        <video muted loop playsinline preload="none"></video>
        <div class="video-card-overlay">
          <span class="${tagClass}">${v.tag}</span>
          <h3 class="video-card-title">${v.title}</h3>
          <p class="video-card-desc">${v.description}</p>
        </div>
      `;
      card.addEventListener('click', () => openReels(index));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReels(index); }
      });
      videoGrid.appendChild(card);
    });

    // Re-observe video cards for autoplay
    $$('.video-card', videoGrid).forEach(card => videoObserver.observe(card));
  }

  /* --------------------------------------------------------
     ASYNC INIT — Fetch data from API, then render
  -------------------------------------------------------- */
  /* --------------------------------------------------------
     NAVBAR AUTH — login / user info toggle
  -------------------------------------------------------- */
  function updateNavAuth() {
    const container = document.getElementById('navAuthLinks');
    if (!container) return;

    const token = localStorage.getItem('user_token');
    const name = localStorage.getItem('user_name');

    if (token && name) {
      var avatar = localStorage.getItem('user_avatar');
      var avatarSrc = avatar || '';
      container.innerHTML =
        '<a href="profile.html" class="nav-link" style="display:inline-flex;align-items:center;padding:0.25rem;" title="' + name + '">' +
          (avatarSrc
            ? '<img src="' + avatarSrc + '" alt="' + name + '" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.4);" onerror="this.outerHTML=\'<svg viewBox=\\\'0 0 24 24\\\' width=\\\'24\\\' height=\\\'24\\\' style=\\\'fill:currentColor\\\'><path d=\\\'M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z\\\'/></svg>\'">'
            : '<svg viewBox="0 0 24 24" width="24" height="24" style="fill:currentColor;"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>') +
        '</a>';
    } else {
      container.innerHTML =
        '<a href="login.html" class="nav-link" style="display:inline-flex;align-items:center;padding:0.25rem;" title="Login">' +
          '<svg viewBox="0 0 24 24" width="24" height="24" style="fill:currentColor;"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>' +
        '</a>';
    }
  }

  /* --------------------------------------------------------
     SEO — Inject destination-level TouristAttraction schema
  -------------------------------------------------------- */
  function injectDestinationSchema() {
    if (!destinations.length && !reviews.length) return;
    const items = destinations.map(d => ({
      '@type': 'TouristAttraction',
      'name': d.name,
      'description': d.description,
      'image': d.image,
      'address': { '@type': 'PostalAddress', 'addressRegion': d.country, 'addressCountry': 'PK' },
      'isAccessibleForFree': false,
      'touristType': d.category,
      'offers': {
        '@type': 'Offer',
        'price': d.price,
        'priceCurrency': 'PKR',
        'availability': 'https://schema.org/InStock'
      }
    }));
    // Aggregate rating from reviews
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length;
      items.push({
        '@type': 'TravelAgency',
        'name': 'Gilgit Adventure Treks',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': avg.toFixed(1),
          'reviewCount': reviews.length,
          'bestRating': '5',
          'worstRating': '1'
        }
      });
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': items });
    document.head.appendChild(script);
  }

  /* --------------------------------------------------------
     APPLY SITE SETTINGS — Dynamic content from developer panel
  -------------------------------------------------------- */
  function applySiteSettings(s) {
    if (!s) return;

    // Branding
    if (s.branding) {
      const b = s.branding;
      if (b.logoUrl) {
        $$('.logo-img').forEach(img => {
          img.src = b.logoUrl;
          img.alt = b.companyName || '';
          if (b.logoSize) { img.style.width = b.logoSize + 'px'; img.style.height = b.logoSize + 'px'; }
          if (b.logoBorderRadius != null) img.style.borderRadius = b.logoBorderRadius + '%';
        });
      }
      if (b.companyName) {
        const logoSpan = $('.nav-logo span');
        if (logoSpan) logoSpan.textContent = b.companyName;
        document.title = b.companyName;
      }
      if (b.faviconUrl) {
        // Apply border-radius by rendering favicon through canvas
        if (b.faviconBorderRadius > 0) {
          const fImg = new Image();
          fImg.crossOrigin = 'anonymous';
          fImg.onload = function() {
            const size = 64;
            const c = document.createElement('canvas');
            c.width = size; c.height = size;
            const ctx = c.getContext('2d');
            const r = (b.faviconBorderRadius / 100) * (size / 2);
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(size - r, 0);
            ctx.quadraticCurveTo(size, 0, size, r);
            ctx.lineTo(size, size - r);
            ctx.quadraticCurveTo(size, size, size - r, size);
            ctx.lineTo(r, size);
            ctx.quadraticCurveTo(0, size, 0, size - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(fImg, 0, 0, size, size);
            const favicon = $('link[rel="icon"]');
            if (favicon) favicon.href = c.toDataURL('image/png');
          };
          fImg.src = b.faviconUrl;
        } else {
          const favicon = $('link[rel="icon"]');
          if (favicon) favicon.href = b.faviconUrl;
        }
      }
      if (b.companyShortName) {
        const footerLogoSpan = $('.footer-brand .nav-logo span');
        if (footerLogoSpan) footerLogoSpan.textContent = b.companyShortName;
      }
    }

    // Hero text
    if (s.hero) {
      const h = s.hero;
      const heroSubtitle = $('.hero-subtitle');
      const heroTitle = $('.hero-title');
      const heroDesc = $('.hero-description');
      if (heroSubtitle && h.subtitle) heroSubtitle.textContent = h.subtitle;
      if (heroTitle && h.title) heroTitle.innerHTML = h.title;
      if (heroDesc && h.description) heroDesc.textContent = h.description;
    }

    // Section headers
    if (s.sectionHeaders) {
      const sectionMap = {
        gallery: '#gallery',
        videos: '#videos',
        team: '#team',
        topDestinations: '#top-destinations',
        map: '#map',
        reviews: '#reviews',
        deals: '#deals'
      };
      for (const [key, selector] of Object.entries(sectionMap)) {
        const section = s.sectionHeaders[key];
        if (!section) continue;
        const el = $(selector);
        if (!el) continue;
        const tag = $('.section-tag', el);
        const title = $('.section-title', el);
        const desc = $('.section-description', el);
        if (tag && section.tag) tag.textContent = section.tag;
        if (title && section.title) title.textContent = section.title;
        if (desc && section.description) desc.textContent = section.description;
      }
    }

    // Footer
    if (s.footer) {
      const f = s.footer;
      const footerDesc = $('.footer-brand > p');
      if (footerDesc && f.description) footerDesc.textContent = f.description;
      const copyright = $('.footer-bottom p');
      if (copyright && f.copyrightText) copyright.innerHTML = f.copyrightText;
      // Update social links from SEO social profiles
      if (s.seo && s.seo.socialProfiles) {
        const sp = s.seo.socialProfiles;
        const socialLinks = $$('.social-links .social-link');
        const socialMap = ['facebook', 'instagram', 'whatsapp', 'youtube'];
        socialLinks.forEach((link, i) => {
          const platform = socialMap[i];
          if (platform === 'whatsapp' && s.contact && s.contact.whatsappUrl) {
            link.href = s.contact.whatsappUrl;
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('target', '_blank');
          } else if (sp[platform]) {
            link.href = sp[platform];
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('target', '_blank');
          }
        });
      }
    }

    // Newsletter
    if (s.newsletter) {
      const n = s.newsletter;
      const nlHeading = $('.newsletter-content h2');
      const nlDesc = $('.newsletter-content > p');
      const nlNote = $('.newsletter-note');
      if (nlHeading && n.heading) nlHeading.textContent = n.heading;
      if (nlDesc && n.description) nlDesc.textContent = n.description;
      if (nlNote && n.subscriberNote) nlNote.textContent = n.subscriberNote;
    }

    // Loading screen
    if (s.loadingScreen) {
      const lt = $('.loading-title');
      const ltxt = $('.loading-text');
      if (lt && s.loadingScreen.title) lt.textContent = s.loadingScreen.title;
      if (ltxt && s.loadingScreen.text) ltxt.textContent = s.loadingScreen.text;
    }

    // SEO: Update meta tags from settings
    if (s.seo) {
      const seo = s.seo;
      if (seo.siteTitle) document.title = seo.siteTitle;
      const setMeta = (attr, val, content) => {
        const el = document.querySelector('meta[' + attr + '="' + val + '"]');
        if (el && content) el.setAttribute('content', content);
      };
      if (seo.metaDescription) setMeta('name', 'description', seo.metaDescription);
      if (seo.keywords) setMeta('name', 'keywords', seo.keywords);
      if (seo.canonicalUrl) {
        const canon = document.querySelector('link[rel="canonical"]');
        if (canon) canon.href = seo.canonicalUrl + '/';
        setMeta('property', 'og:url', seo.canonicalUrl + '/');
      }
      if (seo.siteTitle) {
        setMeta('property', 'og:title', seo.siteTitle);
        setMeta('name', 'twitter:title', seo.siteTitle);
      }
      if (seo.metaDescription) {
        setMeta('property', 'og:description', seo.metaDescription);
        setMeta('name', 'twitter:description', seo.metaDescription);
      }
      if (seo.ogImage) {
        const baseUrl = seo.canonicalUrl || '';
        const imgUrl = seo.ogImage.startsWith('http') ? seo.ogImage : baseUrl + '/' + seo.ogImage;
        setMeta('property', 'og:image', imgUrl);
        setMeta('name', 'twitter:image', imgUrl);
      }
      if (seo.geoLatitude && seo.geoLongitude) {
        setMeta('name', 'geo.position', seo.geoLatitude + ';' + seo.geoLongitude);
        setMeta('name', 'ICBM', seo.geoLatitude + ', ' + seo.geoLongitude);
      }

      // Update JSON-LD schema with dynamic SEO values
      const ldScript = document.querySelector('script[type="application/ld+json"]');
      if (ldScript) {
        try {
          const schema = JSON.parse(ldScript.textContent);
          const org = schema['@graph'] && schema['@graph'].find(n => n['@type'] === 'TravelAgency');
          if (org) {
            if (seo.founderName) org.founder = { '@type': 'Person', 'name': seo.founderName };
            if (seo.foundingYear) org.foundingDate = seo.foundingYear;
            if (seo.priceRange) org.priceRange = seo.priceRange;
            if (seo.officeAddress) org.address.streetAddress = seo.officeAddress;
            if (seo.geoLatitude) org.geo.latitude = seo.geoLatitude;
            if (seo.geoLongitude) org.geo.longitude = seo.geoLongitude;
            // Social profiles
            const profiles = seo.socialProfiles || {};
            const sameAs = Object.values(profiles).filter(v => v && v.trim());
            if (sameAs.length > 0) org.sameAs = sameAs;
            if (s.contact && s.contact.phone) org.telephone = s.contact.phone;
            if (s.contact && s.contact.email) org.email = s.contact.email;
          }
          ldScript.textContent = JSON.stringify(schema);
        } catch (e) { /* schema parse error — keep static version */ }
      }

      // Inject analytics & tracking scripts
      if (seo.ga4MeasurementId) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + seo.ga4MeasurementId;
        document.head.appendChild(gaScript);
        const gaInit = document.createElement('script');
        gaInit.textContent = 'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + seo.ga4MeasurementId + '");';
        document.head.appendChild(gaInit);
      }
      if (seo.gtmContainerId) {
        const gtmScript = document.createElement('script');
        gtmScript.textContent = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" + seo.gtmContainerId + "');";
        document.head.appendChild(gtmScript);
      }
      if (seo.fbPixelId) {
        const fbScript = document.createElement('script');
        fbScript.textContent = "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','" + seo.fbPixelId + "');fbq('track','PageView');";
        document.head.appendChild(fbScript);
      }
      if (seo.clarityId) {
        const clarityScript = document.createElement('script');
        clarityScript.textContent = "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','" + seo.clarityId + "');";
        document.head.appendChild(clarityScript);
      }

      // Inject verification meta tags
      if (seo.googleVerification) {
        const gvMeta = document.createElement('meta');
        gvMeta.name = 'google-site-verification';
        gvMeta.content = seo.googleVerification;
        document.head.appendChild(gvMeta);
      }
      if (seo.bingVerification) {
        const bvMeta = document.createElement('meta');
        bvMeta.name = 'msvalidate.01';
        bvMeta.content = seo.bingVerification;
        document.head.appendChild(bvMeta);
      }
    }
  }

  async function init() {
    try {
      // Reuse pre-fetched data from loading screen script, or fetch fresh
      const data = (window.__publicDataPromise && await window.__publicDataPromise) || await fetch('/api/public-data').then(r => r.json());
      delete window.__publicDataPromise;
      destinations = data.destinations || [];
      reviews = data.reviews || [];
      deals = data.deals || [];
      videos = data.videos || [];
      galleryImages = data.gallery || [];
      teamMembers = data.team || [];

      // Apply site settings before rendering
      if (data.settings) {
        applySiteSettings(data.settings);
      }
    } catch (err) {
      console.warn('API not available, site will show empty sections:', err.message);
    }

    // Render data-dependent sections
    renderTopDestinations();
    renderMapList();
    renderReviews();
    renderDeals();
    renderVideos();
    renderGallery();
    renderTeam();
    updateNavAuth();
    injectDestinationSchema();

    // Start reveal animations NOW — after settings are applied and content rendered
    // This prevents flash of old hardcoded text before dynamic settings replace it
    $$('.reveal-up').forEach(el => revealObserver.observe(el));
    const heroStats = $('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // Hide loading screen
    const loader = document.getElementById('loadingScreen');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }
  }

  init();

})();
