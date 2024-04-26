import express, {Request, Response} from "express";
const express = require('express');
const router = express.Router();

// 7. Creación, Edición, Eliminación y Listado de Provincias (CRUD)

//  obtener por id de provincias.

  router.get('/Provincias/:id', async (req, res) => {
  try {
    const provincia = await Provincia.findByPk(req.params.id);
    res.json(provincia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// obtener todos(paginado)

  router.get('/Provincias', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const provincias = await Provincia.findAndCountAll({
      limit: limit,
      offset: offset,
    });
    res.json({
      total: provincias.count,
      results: provincias.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creación de provincia
  router.post('/Provincias', async (req, res) => {
  try {
    const provincia = await Provincia.create(req.body);
    res.status(201).json(provincia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar provincia por id
  router.put('/Provincias/:id', async (req, res) => {
  try {
    const provincia = await Provincia.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    res.json(provincia[1][0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar provincia por id

  router.delete('/Provincias/:id', async (req, res) => {
  try {
    await Provincia.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Provincia eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;