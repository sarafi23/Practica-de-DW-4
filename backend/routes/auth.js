const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('../middleware/passport');
const { proteger } = require('../middleware/auth');

const generarToken = (usuario) => {
  return jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    const usuario = await User.create({ nombre, email, password });
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
  res.json(req.usuario);
});

// GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generarToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?token=${token}`);
  }
);

module.exports = router;
