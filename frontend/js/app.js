const API = '/api';
function getToken() { return localStorage.getItem('token'); }

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('regError').style.display = 'none';
}
function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('loginError').style.display = 'none';
}

function mostrarError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

function limpiarError(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}

function setFieldState(inputId, errorId, valid) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(errorId);
  input.classList.remove('error', 'success');
  if (valid === true) {
    input.classList.add('success');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
  } else if (valid === false) {
    input.classList.add('error');
    if (errEl) errEl.classList.add('show');
  } else {
    if (errEl) errEl.classList.remove('show');
  }
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarLongitud(val, min) {
  return val.length >= min;
}

function validarConfirmacion(pw, confirm) {
  return pw === confirm;
}

function validarCampoRegister() {
  const nombre = document.getElementById('regNombre').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPw = document.getElementById('regConfirmPassword').value;

  const nombreOk = validarLongitud(nombre, 2);
  const emailOk = validarEmail(email);
  const pwOk = validarLongitud(password, 6);
  const confirmOk = validarConfirmacion(password, confirmPw);

  setFieldState('regNombre', 'regNombreError', nombre ? nombreOk : null);
  document.getElementById('regNombreError').textContent = nombre && !nombreOk ? 'Mínimo 2 caracteres' : '';

  setFieldState('regEmail', 'regEmailError', email ? emailOk : null);
  document.getElementById('regEmailError').textContent = email && !emailOk ? 'Email inválido' : '';

  setFieldState('regPassword', 'regPasswordError', password ? pwOk : null);
  document.getElementById('regPasswordError').textContent = password && !pwOk ? 'Mínimo 6 caracteres' : '';

  setFieldState('regConfirmPassword', 'regConfirmError', confirmPw ? confirmOk : null);
  document.getElementById('regConfirmError').textContent = confirmPw && !confirmOk ? 'Las contraseñas no coinciden' : '';
}

function validarCampoLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const emailOk = validarEmail(email);
  const pwOk = password.length > 0;

  setFieldState('loginEmail', 'loginEmailError', email ? emailOk : null);
  document.getElementById('loginEmailError').textContent = email && !emailOk ? 'Email inválido' : '';

  setFieldState('loginPassword', 'loginPasswordError', password ? pwOk : null);
  document.getElementById('loginPasswordError').textContent = password && !pwOk ? 'Campo obligatorio' : '';
}

document.addEventListener('DOMContentLoaded', () => {
  ['regNombre', 'regEmail', 'regPassword', 'regConfirmPassword'].forEach(id => {
    document.getElementById(id).addEventListener('input', validarCampoRegister);
  });
  ['loginEmail', 'loginPassword'].forEach(id => {
    document.getElementById(id).addEventListener('input', validarCampoLogin);
  });
});

async function register() {
  const nombre = document.getElementById('regNombre').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const telefono = document.getElementById('regTelefono').value.trim();
  const direccion = document.getElementById('regDireccion').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPw = document.getElementById('regConfirmPassword').value;
  document.getElementById('regError').style.display = 'none';

  if (!nombre || !email || !password) return mostrarError('regError', 'Nombre, email y contraseña son obligatorios');
  if (password.length < 6) return mostrarError('regError', 'La contraseña debe tener al menos 6 caracteres');
  if (password !== confirmPw) return mostrarError('regError', 'Las contraseñas no coinciden');

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password, telefono, direccion }),
  });
  const data = await res.json();
  if (!res.ok) return mostrarError('regError', data.msg);

  localStorage.setItem('token', data.token);
  localStorage.setItem('rol', data.usuario.rol);
  window.location.href = 'tienda.html';
}

async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  document.getElementById('loginError').style.display = 'none';

  if (!email || !password) return mostrarError('loginError', 'Todos los campos son obligatorios');

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return mostrarError('loginError', data.msg);

  localStorage.setItem('token', data.token);
  localStorage.setItem('rol', data.usuario.rol);
  window.location.href = 'tienda.html';
}

if (getToken()) window.location.href = 'tienda.html';

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  if (isHidden) {
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  } else {
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
}
