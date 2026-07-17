require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
require('./middleware/passport');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/usuarios', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.json({ msg: 'API Practica4 funcionando' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
