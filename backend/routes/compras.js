const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Producto = require('../models/Producto');
const { proteger } = require('../middleware/auth');

router.post('/', proteger, async (req, res) => {
  try {
    const { items, direccion } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'El carrito está vacío' });
    }
    if (!direccion || !direccion.trim()) {
      return res.status(400).json({ msg: 'La dirección de envío es obligatoria' });
    }

    const compras = [];

    for (const item of items) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        return res.status(404).json({ msg: `Producto no encontrado: ${item.productoId}` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ msg: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` });
      }

      const marca = producto.nombre.split(' ')[0];

      compras.push({
        producto: producto._id,
        categoria: producto.categoria,
        marca,
        precio: producto.precio,
      });

      producto.stock -= item.cantidad;
      await producto.save();
    }

    await User.findByIdAndUpdate(req.usuario._id, {
      $push: { compras: { $each: compras } },
      direccion,
    });

    res.json({ msg: 'Compra realizada con éxito', total: compras.reduce((s, c) => s + c.precio, 0) });
  } catch (error) {
    res.status(500).json({ msg: 'Error al procesar compra', error: error.message });
  }
});

module.exports = router;
