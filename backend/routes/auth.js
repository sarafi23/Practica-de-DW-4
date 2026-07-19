const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('../middleware/passport');
const { proteger } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const generarToken = (usuario) => {
  return jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    const usuario = await User.create({ nombre, email, password, telefono, direccion });
    const token = generarToken(usuario);

    res.status(201).json({ token, usuario });
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    if (!usuario.password) {
      return res.status(400).json({ msg: 'Esta cuenta usa Google. Inicia con Google.' });
    }

    const coincide = await usuario.compararPassword(password);
    if (!coincide) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ msg: 'Error al iniciar sesión', error: error.message });
  }
});

// GET /api/auth/perfil (ruta protegida)
router.get('/perfil', proteger, async (req, res) => {
  const usuario = await User.findById(req.usuario._id).populate('compras.producto');
  res.json(usuario);
});

// PUT /api/auth/perfil (actualizar datos personales)
router.put('/perfil', proteger, async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body;
    const usuario = await User.findByIdAndUpdate(
      req.usuario._id,
      { nombre, telefono, direccion },
      { new: true, runValidators: true }
    );
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar perfil', error: error.message });
  }
});

// POST /api/auth/avatar (subir avatar)
router.post('/avatar', proteger, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Selecciona una imagen' });
    }
    const foto = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.usuario._id, { foto });
    res.json({ foto });
  } catch (error) {
    res.status(500).json({ msg: 'Error al subir avatar', error: error.message });
  }
});

// GET /api/auth/stats (estadísticas de compras)
router.get('/stats', proteger, async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);
    const compras = usuario.compras || [];

    const totalCompras = compras.length;
    const totalGastado = compras.reduce((sum, c) => sum + (c.precio || 0), 0);

    const catCount = {};
    const brandCount = {};
    compras.forEach(c => {
      if (c.categoria) catCount[c.categoria] = (catCount[c.categoria] || 0) + 1;
      if (c.marca) brandCount[c.marca] = (brandCount[c.marca] || 0) + 1;
    });

    const categoriaFavorita = Object.keys(catCount).length
      ? Object.entries(catCount).sort((a, b) => b[1] - a[1])[0][0]
      : null;
    const marcaFavorita = Object.keys(brandCount).length
      ? Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    res.json({ totalCompras, totalGastado, categoriaFavorita, marcaFavorita });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener estadísticas', error: error.message });
  }
});

// GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generarToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/tienda.html?token=${token}`);
  }
);

module.exports = router;
