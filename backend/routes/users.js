const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { proteger, esAdmin } = require('../middleware/auth');

// CREATE - POST /api/usuarios
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    const usuario = await User.create({ nombre, email, password });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear usuario', error: error.message });
  }
});

// READ (todos) - GET /api/usuarios
router.get('/', proteger, async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});

// READ (uno) - GET /api/usuarios/:id
router.get('/:id', proteger, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
});

// UPDATE - PUT /api/usuarios/:id
router.put('/:id', proteger, async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const campos = { nombre, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      campos.password = await bcrypt.hash(password, salt);
    }

    const usuario = await User.findByIdAndUpdate(req.params.id, campos, {
      new: true,
      runValidators: true,
    });

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
});

// DELETE - DELETE /api/usuarios/:id (solo admin)
router.delete('/:id', proteger, esAdmin, async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

module.exports = router;
