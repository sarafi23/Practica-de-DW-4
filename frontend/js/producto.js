document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  inicializarNav();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) cargarDetalle(id); else document.getElementById('errorProducto').style.display = 'block';
});

async function cargarDetalle(id) {
  const detalle = document.getElementById('productoDetalle');
  const loading = document.getElementById('loadingProducto');
  const error = document.getElementById('errorProducto');

  try {
    const res = await fetch(`${API}/productos/${id}`);
    if (!res.ok) throw new Error('No encontrado');
    const p = await res.json();

    const relacion = await fetch(`${API}/productos?categoria=${p.categoria}`);
    const relacionados = (await relacion.json()).filter(r => r._id !== p._id).slice(0, 4);

    loading.style.display = 'none';

    detalle.innerHTML = `
      <a href="tienda.html" class="back-link">← Volver a la tienda</a>

      <div class="card detalle-card">
        <div class="detalle-grid">
          <div class="detalle-img-section">
            <div class="detalle-img-main">
              <span class="detalle-badge">${p.categoria}</span>
              ${p.imagen
                ? `<img src="${p.imagen}" alt="${p.nombre}" onerror="this.outerHTML='<span style=color:#94a3b8;font-size:60px;>🖥</span>'" />`
                : `<span style="color:#94a3b8;font-size:60px;">🖥</span>`}
            </div>
          </div>
          <div class="detalle-info-section">
            <span class="detalle-categoria">${p.categoria}</span>
            <h2 class="detalle-titulo">${p.nombre}</h2>
            <div class="detalle-precio">$${p.precio.toFixed(2)}</div>
            <p class="detalle-desc">${p.descripcion}</p>

            <div class="detalle-stock ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}">
              <span class="stock-dot"></span>
              ${p.stock > 0 ? `En stock — ${p.stock} unidades disponibles` : 'Agotado temporalmente'}
            </div>

            ${Object.keys(p.especificaciones || {}).length > 0 ? `
              <div class="specs-section">
                <h3>Especificaciones técnicas</h3>
                <table class="specs-table">
                  ${Object.entries(p.especificaciones).map(([k, v]) =>
                    `<tr><td>${k}</td><td>${v}</td></tr>`
                  ).join('')}
                </table>
              </div>
            ` : ''}

            <div class="detalle-actions">
              <div class="qty-selector">
                <button onclick="cambiarCant(-1)" class="qty-btn">−</button>
                <input type="number" id="cantidadInput" value="1" min="1" max="${p.stock}" readonly />
                <button onclick="cambiarCant(1)" class="qty-btn">+</button>
              </div>
              <button class="btn btn-primary btn-lg" onclick="agregarAlCarritoDesdeDetalle('${p._id}')" ${p.stock === 0 ? 'disabled' : ''}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      ${relacionados.length > 0 ? `
        <div class="card relacionados-card">
          <h2>Productos relacionados</h2>
          <div class="relacionados-grid">
            ${relacionados.map(r => `
              <div class="relacionado-item" onclick="window.location.href='producto.html?id=${r._id}'">
                <div class="relacionado-img">
                  ${r.imagen
                    ? `<img src="${r.imagen}" alt="${r.nombre}" onerror="this.outerHTML='<span style=color:#94a3b8;font-size:30px;>🖥</span>'" />`
                    : `<span style="color:#94a3b8;font-size:30px;">🖥</span>`}
                </div>
                <div class="relacionado-info">
                  <h4>${r.nombre}</h4>
                  <span class="relacionado-precio">$${r.precio.toFixed(2)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
    detalle.style.display = 'block';
  } catch {
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}

function cambiarCant(delta) {
  const input = document.getElementById('cantidadInput');
  let val = parseInt(input.value) + delta;
  const max = parseInt(input.max);
  if (val < 1) val = 1;
  if (val > max) val = max;
  input.value = val;
}

async function agregarAlCarritoDesdeDetalle(productoId) {
  const res = await fetch(`${API}/productos/${productoId}`);
  const p = await res.json();
  const cant = parseInt(document.getElementById('cantidadInput').value);
  agregarAlCarrito(p, cant);
}
