/* ============================================================
   DEVELOPER SHARED — Auth Guard, API Helper, Logout
   ============================================================ */

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('dev_token');
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/developer/login.html';
  }
}

function logout() {
  localStorage.removeItem('dev_token');
  localStorage.removeItem('dev_username');
  window.location.href = '/developer/login.html';
}

async function apiCall(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(API_BASE + endpoint, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  if (res.status === 401) {
    logout();
    return null;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}

function initDevLayout() {
  requireAuth();

  const username = localStorage.getItem('dev_username') || 'Developer';
  const userEl = document.getElementById('devUser');
  if (userEl) userEl.textContent = username;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.dev-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage) a.classList.add('active');
  });
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function showMsg(el, text, isError) {
  el.textContent = text;
  el.className = 'settings-msg ' + (isError ? 'settings-error' : 'settings-success');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function togglePassword(btn) {
  const input = btn.previousElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '&#128064;';
  } else {
    input.type = 'password';
    btn.innerHTML = '&#128065;';
  }
}

// Load settings helper
async function loadSettings() {
  return apiCall('/dev/settings');
}

// Save settings helper (partial update)
async function saveSettings(data) {
  return apiCall('/dev/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}
