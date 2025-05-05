const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const empleadosRoutes = require('./routes/empleados');
const departamentosRoutes = require('./routes/departamentos');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/empleados', empleadosRoutes);
app.use('/api/departamentos', departamentosRoutes);

// FRONTEND
app.use(express.static('views'));

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
