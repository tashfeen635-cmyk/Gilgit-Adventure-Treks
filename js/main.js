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

  /* AI chat/planner responses stay hardcoded (UI logic, not admin content) */
  const aiResponses = {
    valleys: [
      'Based on your preferences, I recommend a **Hunza Valley & Passu** combo trip! You\'ll see Rakaposhi, Attabad Lake, and the famous Hussaini Bridge.',
      'For a valley experience, **Phander Valley** offers peaceful lakes and untouched natural beauty — perfect for a serene getaway.',
    ],
    trekking: [
      'For trekkers, the **Rakaposhi Base Camp** trek is a perfect day adventure with incredible mountain panoramas!',
      'If you\'re up for the ultimate challenge, the **K2 Base Camp** trek through Concordia is the adventure of a lifetime!',
    ],
    lakes: [
      'For lake lovers, I recommend **Attabad Lake + Naltar Lakes** — turquoise waters surrounded by dramatic peaks!',
      'The **Phander Lake & Sheosar Lake** combo offers the most peaceful and photogenic lake experience in the north.',
    ],
    culture: [
      'For cultural immersion, **Baltit & Altit Forts** in Hunza offer 700+ years of history with stunning architecture.',
      'Experience **Wakhi culture in Passu & Gulmit** — traditional music, local cuisine, and warmth of the mountain people.',
    ],
    camping: [
      'For the best camping, **Fairy Meadows** under Nanga Parbat is unbeatable — billions of stars above!',
      'Try camping at **Deosai National Park** — the highest plateau with wildflowers and wildlife.',
    ],
    photography: [
      'For photographers, **Passu Cones + Attabad Lake + Eagle\'s Nest** offer the most iconic shots in Pakistan!',
      'The **Deosai Plains** at sunrise offer otherworldly landscape photography opportunities!',
    ],
    default: [
      'I have some wonderful Northern Pakistan suggestions based on your preferences! Let me create a personalized itinerary.',
    ]
  };

  const chatResponses = {
    'hello': 'Assalam o Alaikum! Ready to explore Northern Pakistan? Tell me what interests you or click Generate My Trek!',
    'hi': 'Walaikum Assalam! What kind of Northern Pakistan adventure are you looking for?',
    'salam': 'Walaikum Assalam! Welcome to The Journey Team. How can I help plan your trip?',
    'help': 'I can help you plan a trek in Northern Pakistan! Set your preferences on the left panel, or ask me about Hunza, Skardu, K2, or any destination.',
    'hunza': 'Hunza Valley is our most popular destination! The best time is April-October. Must-sees include Baltit Fort, Eagle\'s Nest, Attabad Lake, and the stunning Passu Cones.',
    'skardu': 'Skardu is the gateway to K2 and the highest peaks! Don\'t miss Shangrila Resort, Upper Kachura Lake, the Cold Desert, and Deosai National Park.',
    'fairy': 'Fairy Meadows offers a front-row view of Nanga Parbat (8,126m)! It\'s a 2-3 hour trek from Tato Village. Camping under the stars here is absolutely magical.',
    'k2': 'The K2 Base Camp trek is the ultimate mountaineering adventure — 14-18 days through Concordia with views of four 8,000m peaks. Best season is June-August.',
    'naltar': 'Naltar Valley has incredible color-changing lakes surrounded by pine forests. It also has Pakistan\'s only ski resort! Best visited May-September.',
    'budget': 'For budget trips, Fairy Meadows (PKR 35,000) and Khunjerab Pass (PKR 25,000) offer incredible value. We also have group discounts!',
    'weather': 'Peak season is May-October. Summer (June-August) is best for treks. Autumn (September-October) has golden foliage. Winters are harsh but beautiful.',
    'best time': 'The best time to visit Northern Pakistan is May to October. June-August for treks, April-May for cherry blossoms, September-October for autumn colors.',
    'food': 'Northern Pakistan has amazing local food — Chapshuro (meat-filled bread), Diram Fiti, walnut cake, dried apricots, and the famous Hunza water!',
    'default': 'That sounds exciting! I\'d suggest setting your preferences and clicking Generate My Trek for a personalized Northern Pakistan itinerary. You can also ask me about specific destinations like Hunza, Skardu, or Fairy Meadows!'
  };

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
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
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

  $$('.reveal-up').forEach(el => revealObserver.observe(el));

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = $('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* --------------------------------------------------------
     DESTINATION CARDS
  -------------------------------------------------------- */
  const destGrid = $('#destinationsGrid');

  function renderDestinations(filter = 'all') {
    const filtered = filter === 'all' ? destinations : destinations.filter(d => d.category === filter);
    destGrid.innerHTML = '';

    filtered.forEach(dest => {
      const card = createEl('div', {
        className: 'dest-card',
        role: 'listitem',
        'data-id': String(dest.id)
      });
      card.innerHTML = `
        <div class="dest-card-img">
          <img src="${dest.image}" alt="${dest.name}" loading="lazy">
          <span class="dest-card-badge">${dest.category}</span>
          ${dest.featured ? '<span class="dest-card-top-badge">Top Pick</span>' : ''}
          <button class="dest-card-favorite" aria-label="Add ${dest.name} to favorites">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>
          </button>
        </div>
        <div class="dest-card-body">
          <span class="dest-card-location">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/></svg>
            ${dest.country}
          </span>
          <h3 class="dest-card-name">${dest.name}</h3>
          <div class="dest-card-rating">
            <span class="stars">${generateStars(dest.rating)}</span>
            <span class="rating-text">${dest.rating} (${dest.reviews.toLocaleString()})</span>
          </div>
          <div class="dest-card-footer">
            <div class="dest-card-price">
              <span class="price-amount">${formatPKR(dest.price)}</span>
              <span class="price-per"> /person</span>
            </div>
            <button class="dest-card-btn" data-id="${dest.id}">Explore</button>
          </div>
        </div>
      `;
      destGrid.appendChild(card);
    });

    $$('.dest-card-btn', destGrid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(parseInt(btn.dataset.id));
      });
    });

    $$('.dest-card', destGrid).forEach(card => {
      card.addEventListener('click', () => {
        openModal(parseInt(card.dataset.id));
      });
    });

    $$('.dest-card-favorite', destGrid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
      });
    });
  }

  function renderTopDestinations() {
    const topGrid = $('#topDestGrid');
    if (!topGrid) return;
    topGrid.innerHTML = '';
    const featured = destinations.filter(d => d.featured);
    featured.forEach(dest => {
      const card = createEl('div', { className: 'top-dest-card', role: 'button', tabindex: '0' });
      card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}" loading="lazy">
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

  function renderBookingDestinations() {
    const bookingDests = $('#bookingDestinations');
    if (!bookingDests) return;
    bookingDests.innerHTML = '';
    const bookingList = [...destinations.filter(d => d.featured), ...destinations.filter(d => !d.featured)].slice(0, 6);
    bookingList.forEach(dest => {
      const card = createEl('div', { className: 'booking-dest-card', 'data-id': String(dest.id) });
      card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}" loading="lazy">
        <h4>${dest.name}</h4>
        <p>From ${formatPKR(dest.price)}/person</p>
      `;
      card.addEventListener('click', () => {
        $$('.booking-dest-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        booking.destination = dest;
      });
      bookingDests.appendChild(card);
    });
  }

  // Filter tabs
  $$('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.filter-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderDestinations(tab.dataset.filter);
    });
  });

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
    $('#modalBookBtn').onclick = () => {
      closeModal();
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    };

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
     AI TRIP PLANNER
  -------------------------------------------------------- */
  const chatMessages = $('#chatMessages');
  const chatInput = $('#chatInput');
  const chatSendBtn = $('#chatSendBtn');
  const plannerGenerate = $('#plannerGenerate');

  $$('.planner-tag').forEach(tag => {
    tag.addEventListener('click', () => tag.classList.toggle('active'));
  });

  function addChatMessage(text, isUser = false) {
    const msg = createEl('div', { className: `chat-message ${isUser ? 'user' : 'ai'}` });
    msg.innerHTML = `
      <div class="chat-avatar">${isUser ? 'You' : 'AI'}</div>
      <div class="chat-bubble">${text}</div>
    `;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typing = createEl('div', { className: 'chat-message ai', id: 'typingIndicator' });
    typing.innerHTML = `
      <div class="chat-avatar">AI</div>
      <div class="chat-bubble">
        <div class="typing-indicator"><span></span><span></span><span></span></div>
      </div>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = $('#typingIndicator');
    if (el) el.remove();
  }

  function generateItinerary() {
    const budget = $('#plannerBudget').value;
    const duration = $('#plannerDuration').value;
    const style = $('#plannerStyle').value;
    const interests = $$('.planner-tag.active').map(t => t.dataset.interest);

    if (interests.length === 0) interests.push('valleys');

    const primaryInterest = interests[0];
    const responsePool = aiResponses[primaryInterest] || aiResponses.default;
    const intro = responsePool[Math.floor(Math.random() * responsePool.length)];

    const durationMap = { weekend: '3 Days', week: '7 Days', twoweeks: '14 Days', month: '30 Days' };
    const budgetMap = { budget: 'PKR 30,000–60,000', mid: 'PKR 60,000–150,000', luxury: 'PKR 150,000+' };

    const relevant = destinations.filter(d =>
      interests.includes(d.category) ||
      interests.some(i => d.highlights.some(h => h.toLowerCase().includes(i)))
    ).slice(0, 4);

    if (relevant.length === 0 && destinations.length >= 3) relevant.push(destinations[0], destinations[2]);

    const days = duration === 'weekend' ? 3 : duration === 'week' ? 7 : duration === 'twoweeks' ? 14 : 30;

    const itineraryDays = [];
    const dayActivities = [
      'Drive on the Karakoram Highway to',
      'Morning trek and explore',
      'Visit viewpoints and photograph',
      'Boat ride and picnic at',
      'Cultural walk and local food in',
      'Sunrise hike near',
      'Free exploration and shopping in'
    ];

    for (let i = 1; i <= Math.min(days, 7); i++) {
      if (relevant.length === 0) break;
      const dest = relevant[(i - 1) % relevant.length];
      const activity = dayActivities[(i - 1) % dayActivities.length];
      itineraryDays.push(`<div class="itinerary-day"><strong>Day ${i}:</strong> ${activity} ${dest.name} — ${dest.highlights[i % dest.highlights.length]}</div>`);
    }

    const itineraryHTML = `
      <p>${intro}</p>
      <div class="itinerary-card">
        <h4>Your ${durationMap[duration]} ${style === 'solo' ? 'Solo' : style === 'couple' ? 'Couple' : style === 'family' ? 'Family' : 'Group'} Northern Pakistan Itinerary</h4>
        <p style="font-size:12px; color:#64748b; margin-bottom:8px;">Budget: ${budgetMap[budget]} | Interests: ${interests.join(', ')}</p>
        ${itineraryDays.join('')}
        ${days > 7 ? '<div class="itinerary-day"><strong>Days 8–' + days + ':</strong> Extended exploration — Khunjerab Pass, hidden valleys, and off-the-beaten-path villages!</div>' : ''}
      </div>
      <p style="margin-top:12px; font-size:13px;">Would you like me to adjust anything or start booking? Contact us on WhatsApp for instant confirmation!</p>
    `;

    return itineraryHTML;
  }

  plannerGenerate.addEventListener('click', () => {
    const interests = $$('.planner-tag.active').map(t => t.textContent).join(', ') || 'Valleys';
    addChatMessage(`Generate a trek with interests: ${interests}`, true);

    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addChatMessage(generateItinerary());
    }, 1800);
  });

  function handleChatSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addChatMessage(text, true);
    chatInput.value = '';

    showTypingIndicator();

    const lower = text.toLowerCase();
    let response = chatResponses.default;
    for (const [key, val] of Object.entries(chatResponses)) {
      if (lower.includes(key)) {
        response = val;
        break;
      }
    }

    setTimeout(() => {
      removeTypingIndicator();
      addChatMessage(`<p>${response}</p>`);
    }, 1200);
  }

  chatSendBtn.addEventListener('click', handleChatSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleChatSend();
  });

  /* --------------------------------------------------------
     BOOKING WIZARD
  -------------------------------------------------------- */
  let wizardStep = 1;
  const totalSteps = 5;
  const booking = { destination: null, checkIn: '', checkOut: '', adults: 2, children: 0, infants: 0 };

  const wizardPrev = $('#wizardPrev');
  const wizardNext = $('#wizardNext');

  function updateWizard() {
    $$('.wizard-step').forEach((step, i) => {
      const num = i + 1;
      step.classList.remove('active', 'completed');
      if (num === wizardStep) step.classList.add('active');
      else if (num < wizardStep) step.classList.add('completed');
    });

    $$('.wizard-connector').forEach((conn, i) => {
      conn.classList.toggle('active', i + 1 < wizardStep);
    });

    $$('.wizard-panel').forEach(panel => {
      panel.classList.toggle('active', parseInt(panel.dataset.panel) === wizardStep);
    });

    wizardPrev.disabled = wizardStep === 1;
    wizardNext.textContent = wizardStep === totalSteps - 1 ? 'Confirm Booking' : wizardStep === totalSteps ? 'Book Another Trek' : 'Continue';

    if (wizardStep === 4) renderBookingReview();

    if (wizardStep === 5) {
      wizardPrev.style.display = 'none';
    } else {
      wizardPrev.style.display = '';
    }
  }

  // Step 3: Traveler counters
  $$('.counter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const isPlus = btn.classList.contains('plus');
      const current = booking[target];

      if (isPlus && current < 10) booking[target]++;
      else if (!isPlus && current > (target === 'adults' ? 1 : 0)) booking[target]--;

      $(`#${target}Count`).textContent = booking[target];
    });
  });

  const bookingCheckIn = $('#bookingCheckIn');
  const bookingCheckOut = $('#bookingCheckOut');

  function updateDateSummary() {
    const ci = bookingCheckIn.value;
    const co = bookingCheckOut.value;
    if (ci && co) {
      const days = Math.ceil((new Date(co) - new Date(ci)) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        $('#dateSummary').textContent = `${days} day${days > 1 ? 's' : ''} / ${days - 1} night${days - 1 > 1 ? 's' : ''} trek`;
        booking.checkIn = ci;
        booking.checkOut = co;
      } else {
        $('#dateSummary').textContent = 'End date must be after start date';
      }
    }
  }

  bookingCheckIn.addEventListener('change', updateDateSummary);
  bookingCheckOut.addEventListener('change', updateDateSummary);

  function renderBookingReview() {
    const review = $('#bookingReview');
    const dest = booking.destination;
    if (!dest) {
      review.innerHTML = '<p style="text-align:center; color:#94a3b8;">Please select a destination first.</p>';
      return;
    }

    const nights = booking.checkIn && booking.checkOut
      ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
      : 5;

    const basePrice = dest.price * booking.adults + dest.price * 0.5 * booking.children;
    const nightsTotal = basePrice * (nights / 5);
    const porterFee = booking.infants * 3000 * nights;
    const serviceFee = 2000;
    const total = nightsTotal + porterFee + serviceFee;

    // Store total for submission
    booking.totalPrice = Math.round(total);

    review.innerHTML = `
      <div class="review-line"><span class="label">Destination</span><span>${dest.name}</span></div>
      <div class="review-line"><span class="label">Region</span><span>${dest.country}</span></div>
      <div class="review-line"><span class="label">Dates</span><span>${booking.checkIn || 'Flexible'} → ${booking.checkOut || 'Flexible'}</span></div>
      <div class="review-line"><span class="label">Duration</span><span>${nights} days</span></div>
      <div class="review-line"><span class="label">Travelers</span><span>${booking.adults} adult${booking.adults > 1 ? 's' : ''}${booking.children ? ', ' + booking.children + ' child' + (booking.children > 1 ? 'ren' : '') : ''}</span></div>
      ${booking.infants > 0 ? `<div class="review-line"><span class="label">Porters</span><span>${booking.infants} porter${booking.infants > 1 ? 's' : ''}</span></div>` : ''}
      <div class="review-line"><span class="label">Base Package</span><span>${formatPKR(Math.round(nightsTotal))}</span></div>
      ${porterFee > 0 ? `<div class="review-line"><span class="label">Porter Fee</span><span>${formatPKR(porterFee)}</span></div>` : ''}
      <div class="review-line"><span class="label">Service Fee</span><span>${formatPKR(serviceFee)}</span></div>
      <div class="review-line total"><span>Total</span><span>${formatPKR(Math.round(total))}</span></div>
    `;
  }

  async function submitBooking() {
    const dest = booking.destination;
    if (!dest) return;

    const reference = 'TJT-2026-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          destination: dest.name,
          region: dest.country,
          checkIn: booking.checkIn || null,
          checkOut: booking.checkOut || null,
          adults: booking.adults,
          children: booking.children,
          infants: booking.infants,
          totalPrice: booking.totalPrice || 0
        })
      });
    } catch (err) {
      // Silently fail — booking UI still shows confirmation
    }

    $('#bookingRef').textContent = reference;
  }

  wizardNext.addEventListener('click', async () => {
    if (wizardStep === totalSteps) {
      wizardStep = 1;
      booking.destination = null;
      $$('.booking-dest-card').forEach(c => c.classList.remove('selected'));
      updateWizard();
      return;
    }
    if (wizardStep === totalSteps - 1) {
      // Confirm Booking — submit to API then advance
      await submitBooking();
      wizardStep++;
      updateWizard();
      return;
    }
    if (wizardStep < totalSteps) {
      wizardStep++;
      updateWizard();
    }
  });

  wizardPrev.addEventListener('click', () => {
    if (wizardStep > 1) {
      wizardStep--;
      updateWizard();
    }
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
    countdownEndTimes = deals.map(d => new Date(d.expiresAt).getTime());

    deals.forEach((deal, idx) => {
      const card = createEl('div', { className: 'deal-card' });
      const savePercent = Math.round((1 - deal.newPrice / deal.oldPrice) * 100);

      card.innerHTML = `
        <span class="deal-badge">${deal.badge}</span>
        <div class="deal-card-img">
          <img src="${deal.image}" alt="${deal.name}" loading="lazy">
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
          <a href="#booking" class="deal-book-btn">Book This Package</a>
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
    if (email) {
      try {
        await fetch('/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      } catch (err) {
        // Silently fail — UI still shows success
      }
      newsletterForm.style.display = 'none';
      newsletterSuccess.hidden = false;
    }
  });

  /* --------------------------------------------------------
     HERO SEARCH
  -------------------------------------------------------- */
  const heroSearchBtn = $('#heroSearchBtn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      const dest = $('#heroSearchDest').value.trim().toLowerCase();
      if (dest) {
        const match = destinations.find(d =>
          d.name.toLowerCase().includes(dest) ||
          d.country.toLowerCase().includes(dest) ||
          d.category.includes(dest)
        );
        if (match) {
          const category = match.category;
          $$('.filter-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.filter === category);
            t.setAttribute('aria-selected', t.dataset.filter === category ? 'true' : 'false');
          });
          renderDestinations(category);
        }
      }
      document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
    });
  }

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
  const galleryItems = $$('.gallery-item');
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

  galleryItems.forEach((item, i) => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View photo ${i + 1}`);
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

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

  $$('.video-card').forEach(card => videoObserver.observe(card));

  /* ── Reels-Style Fullscreen Viewer ── */
  const reelsViewer = $('#reelsViewer');
  const reelsTrack = $('#reelsTrack');
  const reelsClose = $('#reelsClose');
  const reelsCounter = $('#reelsCounter');
  let reelsObserver = null;

  const videoCards = $$('.video-card');
  const videoData = Array.from(videoCards).map(card => ({
    src: card.dataset.video || '',
    title: card.querySelector('.video-card-title')?.textContent || '',
    desc: card.querySelector('.video-card-desc')?.textContent || '',
    tag: card.querySelector('.video-card-tag')?.textContent || ''
  }));

  function openReels(startIndex) {
    if (!reelsViewer || videoData.length === 0) return;

    reelsTrack.innerHTML = '';
    videoData.forEach((v, i) => {
      const slide = document.createElement('div');
      slide.className = 'reel-slide' + (i !== startIndex ? ' paused' : '');
      slide.dataset.index = i;

      const video = document.createElement('video');
      video.playsInline = true;
      video.loop = true;
      video.preload = 'none';
      video.src = v.src;

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
      info.innerHTML = '<h3>' + v.title + '</h3><p>' + v.desc + '</p>';

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
    if (reelsCounter) reelsCounter.textContent = (index + 1) + ' / ' + videoData.length;
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

  videoCards.forEach((card, index) => {
    card.addEventListener('click', () => openReels(index));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReels(index); }
    });
  });

  if (reelsClose) reelsClose.addEventListener('click', closeReels);
  if (reelsViewer) {
    document.addEventListener('keydown', (e) => {
      if (!reelsViewer.hidden && e.key === 'Escape') closeReels();
    });
  }

  /* --------------------------------------------------------
     INITIAL SETUP — Date pickers
  -------------------------------------------------------- */
  const today = new Date().toISOString().split('T')[0];
  bookingCheckIn.min = today;
  bookingCheckOut.min = today;

  bookingCheckIn.addEventListener('change', () => {
    bookingCheckOut.min = bookingCheckIn.value;
  });

  /* --------------------------------------------------------
     ASYNC INIT — Fetch data from API, then render
  -------------------------------------------------------- */
  async function init() {
    try {
      const [destData, revData, dealData] = await Promise.all([
        fetch('/api/destinations').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json()),
        fetch('/api/deals').then(r => r.json())
      ]);
      destinations = destData;
      reviews = revData;
      deals = dealData;
    } catch (err) {
      console.warn('API not available, site will show empty sections:', err.message);
    }

    // Render data-dependent sections
    renderDestinations();
    renderTopDestinations();
    renderMapList();
    renderBookingDestinations();
    renderReviews();
    renderDeals();
  }

  init();

})();
