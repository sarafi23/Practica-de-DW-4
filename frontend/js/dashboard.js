const API = 'http://localhost:5000/api';

function getToken() {
  const t = localStorage.getItem('token');
  if (!t) window.location.href = 'index.html';
  return t;
}

async function cargarPerfil() {
  const res = await fetch(`${API}/auth/perfil`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const user = await res.json();

  document.getElementById('nombre').textContent = user.nombre;
  document.getElementById('email').textContent = user.email;
  document.getElementById('rol').textContent = user.rol;
}

async function cargarUsuarios() {
  const res = await fetch(`${API}/usuarios`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const usuarios = await res.json();
  const tbody = document.getElementById('tablaUsuarios');
  tbody.innerHTML = '';

  usuarios.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${u.rol}</td>
      <td><button class="btn-small" onclick="eliminar('${u._id}')">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function eliminar(id) {
  if (!confirm('¿Eliminar usuario?')) return;
  const res = await fetch(`${API}/usuarios/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (res.ok) cargarUsuarios();
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

cargarPerfil();
cargarUsuarios();
