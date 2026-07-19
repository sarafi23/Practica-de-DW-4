document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  inicializarNav();
  renderCarrito();
});

function renderCarrito() {
  const items = getCarrito();
  const vacio = document.getElementById('carritoVacio');
  const content = document.getElementById('carritoContent');

  if (items.length === 0) {
    vacio.style.display = 'block';
    content.style.display = 'none';
    return;
  }

  vacio.style.display = 'none';
  content.style.display = 'block';

  const container = document.getElementById('carritoItems');
  container.innerHTML = items.map((item, idx) => `
    <div class="carrito-item">
      <div class="carrito-item-img" onclick="window.location.href='producto.html?id=${item.producto._id}'" style="cursor:pointer">
        ${item.producto.imagen
          ? `<img src="${item.producto.imagen}" alt="${item.producto.nombre}" onerror="this.outerHTML='<span style=font-size:30px;>🖥</span>'" />`
          : `<span style="font-size:30px;">🖥</span>`}
      </div>
      <div class="carrito-item-info">
        <h4 onclick="window.location.href='producto.html?id=${item.producto._id}'" style="cursor:pointer">${item.producto.nombre}</h4>
        <span class="carrito-item-categoria">${item.producto.categoria}</span>
        <span class="carrito-item-precio">$${item.producto.precio.toFixed(2)} c/u</span>
      </div>
      <div class="carrito-item-qty">
        <button class="qty-btn" onclick="cambiarCantCarrito(${idx}, -1)">−</button>
        <span class="qty-value">${item.cantidad}</span>
        <button class="qty-btn" onclick="cambiarCantCarrito(${idx}, 1)">+</button>
      </div>
      <div class="carrito-item-subtotal">
        $${(item.producto.precio * item.cantidad).toFixed(2)}
      </div>
      <button class="carrito-item-remove" onclick="eliminarItem(${idx})">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  `).join('');

  actualizarResumen();
}

function cambiarCantCarrito(idx, delta) {
  const items = getCarrito();
  items[idx].cantidad += delta;
  if (items[idx].cantidad < 1) items[idx].cantidad = 1;
  guardarCarrito(items);
  actualizarBadgeCarrito();
  renderCarrito();
}

function eliminarItem(idx) {
  const items = getCarrito();
  items.splice(idx, 1);
  guardarCarrito(items);
  actualizarBadgeCarrito();
  renderCarrito();
  mostrarToast('Producto eliminado', 'info');
}

function vaciarCarrito() {
  guardarCarrito([]);
  actualizarBadgeCarrito();
  renderCarrito();
  mostrarToast('Carrito vaciado', 'info');
}

function actualizarResumen() {
  const items = getCarrito();
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);
  const subtotal = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0);

  document.getElementById('resumenItems').textContent = items.length;
  document.getElementById('resumenSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('resumenTotal').textContent = `$${subtotal.toFixed(2)}`;
}

async function mostrarCheckout() {
  const items = getCarrito();
  if (items.length === 0) return mostrarToast('Carrito vacío', 'error');

  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);
  const total = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0);
  document.getElementById('checkoutItems').textContent = `${totalItems} productos`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;

  try {
    const res = await fetch(`${API}/auth/perfil`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const user = await res.json();
    document.getElementById('checkoutDireccion').value = user.direccion || '';
  } catch {}

  document.getElementById('checkoutOverlay').style.display = 'flex';
}

function cerrarCheckout(e) {
  if (e && e.target !== e.currentTarget && !e.currentTarget) return;
  document.getElementById('checkoutOverlay').style.display = 'none';
}

async function confirmarCompra(e) {
  e.preventDefault();
  const direccion = document.getElementById('checkoutDireccion').value.trim();
  if (!direccion) return mostrarToast('La dirección es obligatoria', 'error');

  const items = getCarrito();
  const payload = {
    items: items.map(i => ({ productoId: i.producto._id, cantidad: i.cantidad })),
    direccion,
  };

  const btn = document.getElementById('btnConfirmarCompra');
  btn.disabled = true;
  btn.textContent = 'Procesando...';

  try {
    const res = await fetch(`${API}/compras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return mostrarToast(data.msg, 'error');

    guardarCarrito([]);
    actualizarBadgeCarrito();
    cerrarCheckout();
    mostrarToast('¡Compra realizada con éxito!', 'success');
    setTimeout(() => window.location.href = 'perfil.html', 1500);
  } catch {
    mostrarToast('Error al procesar compra', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirmar compra';
  }
}
