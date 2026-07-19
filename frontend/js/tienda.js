document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  inicializarNav();

  // Cargar productos solo si estamos en tienda.html
  if (document.getElementById('productosGrid')) cargarProductos();

  // Cargar detalle solo si estamos en producto.html
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (document.getElementById('productoDetalle') && id) cargarDetalle(id);
});

async function cargarProductos() {
  const categoria = document.getElementById('filtroCategoria').value;
  const busqueda = document.getElementById('busqueda').value.trim();
  const params = new URLSearchParams();
  if (categoria) params.append('categoria', categoria);
  if (busqueda) params.append('busqueda', busqueda);

  const grid = document.getElementById('productosGrid');
  const loading = document.getElementById('loadingTienda');
  const sinResultados = document.getElementById('sinResultados');
  loading.style.display = 'block';
  grid.style.display = 'none';
  sinResultados.style.display = 'none';

  try {
    const res = await fetch(`${API}/productos?${params}`);
    const productos = await res.json();

    loading.style.display = 'none';

    if (productos.length === 0) {
      sinResultados.style.display = 'block';
      return;
    }

    grid.innerHTML = productos.map(p => `
      <div class="producto-card" onclick="window.location.href='producto.html?id=${p._id}'">
        <div class="producto-img">
          <span class="producto-badge">${p.categoria}</span>
          ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" onerror="this.outerHTML='<span style=color:#94a3b8;font-size:40px;>🖥</span>'" />` : `<span style="color:#94a3b8;font-size:40px;">🖥</span>`}
        </div>
        <div class="producto-info">
          <h3>${p.nombre}</h3>
          <p class="producto-precio">$${p.precio.toFixed(2)}</p>
          <p class="producto-stock ${p.stock > 0 ? 'en-stock' : 'sin-stock'}">
            ${p.stock > 0 ? `En stock (${p.stock} uds.)` : 'Agotado'}
          </p>
        </div>
      </div>
    `).join('');
    grid.style.display = 'grid';
  } catch {
    loading.style.display = 'none';
    mostrarToast('Error al cargar productos', 'error');
  }
}

async function cargarDetalle(id) {
  const detalle = document.getElementById('productoDetalle');
  const loading = document.getElementById('loadingProducto');
  const error = document.getElementById('errorProducto');

  try {
    const res = await fetch(`${API}/productos/${id}`);
    if (!res.ok) throw new Error('No encontrado');
    const p = await res.json();

    loading.style.display = 'none';

    detalle.innerHTML = `
      <a href="tienda.html" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-light);text-decoration:none;margin-bottom:20px;font-size:14px;">← Volver a la tienda</a>
      <div class="card">
        <div class="producto-detalle">
          <div class="detalle-img">
            ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" onerror="this.outerHTML='<span style=color:#94a3b8;font-size:60px;>🖥</span>'" />` : `<span style="color:#94a3b8;font-size:60px;">🖥</span>`}
          </div>
          <div class="detalle-info">
            <span class="detalle-categoria">${p.categoria}</span>
            <h2>${p.nombre}</h2>
            <div class="detalle-precio">$${p.precio.toFixed(2)}</div>
            <p class="producto-stock" style="font-size:15px;${p.stock > 0 ? 'color:var(--accent)' : 'color:var(--danger)'}">
              ${p.stock > 0 ? `✅ ${p.stock} unidades en stock` : '❌ Agotado'}
            </p>
            <p class="detalle-desc">${p.descripcion}</p>
            ${Object.keys(p.especificaciones || {}).length > 0 ? `
              <h3 style="margin-top:20px;font-size:16px;">Especificaciones</h3>
              <table class="specs-table">
                ${Object.entries(p.especificaciones).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
              </table>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    detalle.style.display = 'block';
  } catch {
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}
