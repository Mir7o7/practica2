const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, d.nombre as departamento 
       FROM empleados e 
       JOIN departamentos d ON e.departamento_id = d.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empleados WHERE id=$1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('imagen'), async (req, res) => {
  const { nombre, cargo, salario, departamento_id } = req.body;
  const imagen = req.file?.filename || null;
  if (!nombre || !cargo || !salario || !departamento_id) {
    return res.status(400).json({ error: "Campos obligatorios" });
  }
  try {
    await pool.query(
      'INSERT INTO empleados (nombre, cargo, salario, imagen, departamento_id) VALUES ($1, $2, $3, $4, $5)',
      [nombre, cargo, salario, imagen, departamento_id]
    );
    res.status(201).redirect('/');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { nombre, cargo, salario, departamento_id } = req.body;
  const imagen = req.file?.filename || null;
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE empleados SET nombre=$1, cargo=$2, salario=$3, imagen=COALESCE($4, imagen), departamento_id=$5 WHERE id=$6`,
      [nombre, cargo, salario, imagen, departamento_id, id]
    );
    res.json({ message: "Empleado actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM empleados WHERE id=$1', [req.params.id]);
    res.json({ message: "Empleado eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;