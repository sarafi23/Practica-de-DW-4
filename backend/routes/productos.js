const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { proteger, esAdmin } = require('../middleware/auth');

// CREATE - POST /api/productos (admin)
router.post('/', proteger, esAdmin, async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear producto', error: error.message });
  }
});

// READ (todos) - GET /api/productos (público)
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.categoria) filtro.categoria = req.query.categoria;
    if (req.query.busqueda) {
      filtro.nombre = { $regex: req.query.busqueda, $options: 'i' };
    }
    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener productos' });
  }
});

// READ (uno) - GET /api/productos/:id (público)
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener producto' });
  }
});

// UPDATE - PUT /api/productos/:id (admin)
router.put('/:id', proteger, esAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar producto' });
  }
});

// DELETE - DELETE /api/productos/:id (admin)
router.delete('/:id', proteger, esAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json({ msg: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar producto' });
  }
});

module.exports = router;
