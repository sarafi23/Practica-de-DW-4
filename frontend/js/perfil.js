let esAdmin = false;

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  inicializarNav();
  cargarPerfil();

  document.getElementById('avatarInput').addEventListener('change', subirAvatar);
});

async function cargarPerfil() {
  const loading = document.getElementById('loadingPerfil');
  const content = document.getElementById('perfilContent');

  try {
    const res = await fetch(`${API}/auth/perfil`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const user = await res.json();

    esAdmin = user.rol === 'admin';

    loading.style.display = 'none';
    content.style.display = 'block';

    document.getElementById('perfilNombre').textContent = user.nombre;
    document.getElementById('perfilEmail').textContent = user.email;

    const rolBadge = document.getElementById('perfilRol');
    rolBadge.textContent = esAdmin ? 'Administrador' : 'Usuario';

    document.getElementById('editNombre').value = user.nombre;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editTelefono').value = user.telefono || '';
    document.getElementById('editDireccion').value = user.direccion || '';

    if (user.foto) {
      const img = document.getElementById('avatarPreview');
      img.src = user.foto.startsWith('http') ? user.foto : user.foto;
      img.style.display = 'block';
      document.getElementById('avatarLetra').style.display = 'none';
    } else {
      document.getElementById('avatarLetra').textContent = user.nombre.charAt(0).toUpperCase();
    }

    if (esAdmin) {
      document.getElementById('usersCard').style.display = 'block';
      cargarUsuarios();
    }

    cargarStats();
  } catch {
    loading.style.display = 'none';
    mostrarToast('Error al cargar perfil', 'error');
  }
}

async function subirAvatar(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const res = await fetch(`${API}/auth/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return mostrarToast(data.msg, 'error');

    const img = document.getElementById('avatarPreview');
    img.src = data.foto;
    img.style.display = 'block';
    document.getElementById('avatarLetra').style.display = 'none';
    mostrarToast('Avatar actualizado', 'success');
  } catch {
    mostrarToast('Error al subir avatar', 'error');
  }
}

async function guardarPerfil(e) {
  e.preventDefault();
  const nombre = document.getElementById('editNombre').value.trim();
  const telefono = document.getElementById('editTelefono').value.trim();
  const direccion = document.getElementById('editDireccion').value.trim();

  try {
    const res = await fetch(`${API}/auth/perfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ nombre, telefono, direccion }),
    });
    if (!res.ok) return mostrarToast('Error al guardar', 'error');
    const user = await res.json();
    document.getElementById('perfilNombre').textContent = user.nombre;
    mostrarToast('Perfil actualizado', 'success');
  } catch {
    mostrarToast('Error al guardar', 'error');
  }
}

async function cargarStats() {
  try {
    const res = await fetch(`${API}/auth/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const stats = await res.json();
    document.getElementById('statCompras').textContent = stats.totalCompras;
    document.getElementById('statGastado').textContent = `$${stats.totalGastado}`;
    document.getElementById('statCategoria').textContent = stats.categoriaFavorita || '—';
    document.getElementById('statMarca').textContent = stats.marcaFavorita || '—';
  } catch {
    document.getElementById('statsContent').innerHTML = '<p style="color:var(--text-light)">No hay datos disponibles</p>';
  }
}

async function cargarUsuarios() {
  try {
    const res = await fetch(`${API}/usuarios`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const usuarios = await res.json();
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = usuarios.map(u => {
      const esOtroAdmin = u.rol === 'admin';
      return `
      <tr>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td><span class="detalle-categoria" style="background:${esOtroAdmin ? '#fef3c7' : '#dbeafe'};color:${esOtroAdmin ? '#92400e' : '#2563eb'}">${u.rol}</span></td>
        <td>${esAdmin && !esOtroAdmin ? `<button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${u._id}')">Eliminar</button>` : '—'}</td>
      </tr>
    `}).join('');
  } catch {
    mostrarToast('Error al cargar usuarios', 'error');
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Eliminar este usuario?')) return;
  try {
    const res = await fetch(`${API}/usuarios/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      mostrarToast('Usuario eliminado', 'success');
      cargarUsuarios();
    } else {
      const err = await res.json();
      mostrarToast(err.msg || 'Error al eliminar', 'error');
    }
  } catch {
    mostrarToast('Error al eliminar usuario', 'error');
  }
}
