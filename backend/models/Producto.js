const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: ['CPU', 'GPU', 'RAM', 'Almacenamiento', 'Fuente', 'Placa Madre', 'Gabinete', 'Refrigeración'],
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    default: '',
  },
  especificaciones: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Producto', productoSchema);
