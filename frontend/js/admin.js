document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();

  const token = getToken();
  const res = await fetch(`${API}/auth/perfil`, { headers: { Authorization: `Bearer ${token}` } });
  const user = await res.json();

  if (user.rol !== 'admin') {
    mostrarToast('Acceso denegado: se requiere rol admin', 'error');
    setTimeout(() => window.location.href = 'tienda.html', 1500);
    return;
  }

  inicializarNav();
  document.getElementById('adminContent').style.display = 'block';
  document.getElementById('loadingAdmin').style.display = 'none';
  cargarProductosAdmin();
});

async function cargarProductosAdmin() {
  try {
    const res = await fetch(`${API}/productos`);
    const productos = await res.json();
    const tbody = document.getElementById('tablaProductos');

    tbody.innerHTML = productos.map(p => `
      <tr>
        <td>${p.nombre}</td>
        <td><span class="detalle-categoria">${p.categoria}</span></td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>
          <div class="actions">
            <button class="btn btn-primary btn-sm" onclick="editarProducto('${p._id}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${p._id}')">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch {
    mostrarToast('Error al cargar productos', 'error');
  }
}

async function guardarProducto(e) {
  e.preventDefault();
  const id = document.getElementById('productoId').value;
  const data = {
    nombre: document.getElementById('pNombre').value.trim(),
    categoria: document.getElementById('pCategoria').value,
    precio: parseFloat(document.getElementById('pPrecio').value),
    stock: parseInt(document.getElementById('pStock').value),
    descripcion: document.getElementById('pDescripcion').value.trim(),
    imagen: document.getElementById('pImagen').value.trim(),
  };

  if (!data.nombre || !data.categoria || !data.precio || isNaN(data.stock) || !data.descripcion) {
    return mostrarToast('Completa todos los campos obligatorios', 'error');
  }

  const url = id ? `${API}/productos/${id}` : `${API}/productos`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.msg);
    }

    mostrarToast(id ? 'Producto actualizado' : 'Producto creado', 'success');
    document.getElementById('productoForm').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('formTitle').textContent = 'Nuevo Producto';
    document.getElementById('btnCancelar').style.display = 'none';
    cargarProductosAdmin();
  } catch (err) {
    mostrarToast(err.message, 'error');
  }
}

async function editarProducto(id) {
  try {
    const res = await fetch(`${API}/productos/${id}`);
    const p = await res.json();

    document.getElementById('productoId').value = p._id;
    document.getElementById('pNombre').value = p.nombre;
    document.getElementById('pCategoria').value = p.categoria;
    document.getElementById('pPrecio').value = p.precio;
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pDescripcion').value = p.descripcion;
    document.getElementById('pImagen').value = p.imagen || '';
    document.getElementById('formTitle').textContent = 'Editar Producto';
    document.getElementById('btnCancelar').style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    mostrarToast('Error al cargar producto', 'error');
  }
}

async function eliminarProducto(id) {
  if (!confirm('¿Eliminar este producto permanentemente?')) return;
  try {
    const res = await fetch(`${API}/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      mostrarToast('Producto eliminado', 'success');
      cargarProductosAdmin();
    } else {
      mostrarToast('Error al eliminar', 'error');
    }
  } catch {
    mostrarToast('Error al eliminar producto', 'error');
  }
}

function cancelarEdicion() {
  document.getElementById('productoForm').reset();
  document.getElementById('productoId').value = '';
  document.getElementById('formTitle').textContent = 'Nuevo Producto';
  document.getElementById('btnCancelar').style.display = 'none';
}
