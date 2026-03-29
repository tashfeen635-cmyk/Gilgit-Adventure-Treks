/* ============================================================
   ADMIN SHARED — Auth Guard, API Helper, Logout
   ============================================================ */

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/admin/login.html';
  }
}

function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_username');
  window.location.href = '/admin/login.html';
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

function initAdminLayout() {
  requireAuth();

  const username = localStorage.getItem('admin_username') || 'Admin';
  const userEl = document.getElementById('adminUser');
  if (userEl) userEl.textContent = username;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.admin-nav a').forEach(a => {
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

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PK', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatPKR(amount) {
  return 'PKR ' + Number(amount).toLocaleString('en-PK');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
