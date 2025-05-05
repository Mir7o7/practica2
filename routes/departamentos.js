const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los departamentos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departamentos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener departamentos' });
  }
});

// Crear un departamento
router.post('/', async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query('INSERT INTO departamentos (nombre) VALUES ($1) RETURNING *', [nombre]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear departamento' });
  }
});

// Actualizar un departamento
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    await pool.query('UPDATE departamentos SET nombre = $1 WHERE id = $2', [nombre, id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar departamento' });
  }
});

// Eliminar un departamento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM departamentos WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar departamento' });
  }
});

module.exports = router;
