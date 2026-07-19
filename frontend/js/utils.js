const API = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getRol() {
  return localStorage.getItem('rol');
}

function guardarRol(rol) {
  localStorage.setItem('rol', rol);
}

function requireAuth() {
  if (!getToken()) window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  window.location.href = 'index.html';
}

function mostrarToast(msg, tipo = 'info') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${tipo}`;
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 3500);
}

function mostrarAdminLink() {
  const adminLink = document.getElementById('navAdmin');
  if (adminLink) adminLink.style.display = 'inline';
}

function inicializarNav() {
  const token = getToken();
  if (!token) {
    window.location.href = 'index.html';
    return;
  }
  if (getRol() === 'admin') mostrarAdminLink();
  actualizarBadgeCarrito();
  fetch(`${API}/auth/perfil`, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.json())
    .then(user => {
      guardarRol(user.rol);
      if (user.rol === 'admin') mostrarAdminLink();
    })
    .catch(() => logout());
}

function getCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  } catch {
    return [];
  }
}

function guardarCarrito(items) {
  localStorage.setItem('carrito', JSON.stringify(items));
}

function actualizarBadgeCarrito() {
  const items = getCarrito();
  const total = items.reduce((s, i) => s + i.cantidad, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function agregarAlCarrito(producto, cantidad = 1) {
  const items = getCarrito();
  const idx = items.findIndex(i => i.producto._id === producto._id);
  if (idx >= 0) {
    items[idx].cantidad += cantidad;
  } else {
    items.push({ producto, cantidad });
  }
  guardarCarrito(items);
  actualizarBadgeCarrito();
  mostrarToast(`${producto.nombre} agregado al carrito`, 'success');
}

function eliminarDelCarrito(productoId) {
  const items = getCarrito().filter(i => i.producto._id !== productoId);
  guardarCarrito(items);
  actualizarBadgeCarrito();
}

const params = new URLSearchParams(window.location.search);
const tokenUrl = params.get('token');
if (tokenUrl) {
  localStorage.setItem('token', tokenUrl);
  console.log('✅ Token JWT (OAuth):', tokenUrl);
  window.history.replaceState({}, document.title, window.location.pathname);
}
