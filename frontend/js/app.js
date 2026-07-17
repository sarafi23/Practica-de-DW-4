const API = 'http://localhost:5000/api';

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

async function register() {
  const nombre = document.getElementById('regNombre').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  document.getElementById('regError').textContent = '';

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  });
  const data = await res.json();

  if (!res.ok) return document.getElementById('regError').textContent = data.msg;

  localStorage.setItem('token', data.token);
  window.location.href = 'dashboard.html';
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  document.getElementById('loginError').textContent = '';

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (!res.ok) return document.getElementById('loginError').textContent = data.msg;

  localStorage.setItem('token', data.token);
  window.location.href = 'dashboard.html';
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Si hay token en URL (OAuth callback)
const params = new URLSearchParams(window.location.search);
const tokenUrl = params.get('token');
if (tokenUrl) {
  localStorage.setItem('token', tokenUrl);
  window.location.href = 'dashboard.html';
}
