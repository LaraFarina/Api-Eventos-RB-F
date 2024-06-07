import { ProvinciasService } from "../service/provincias-service.js";
import express from "express";

const router = express.Router();
const provinciaService = new ProvinciasService();

// obtiene una provincia por su ID.
router.get('/:id', async (req, res) => {
  try {
    // Buscar una provincia por su ID utilizando el servicio de provincias.
    const provincia = await provinciaService.findProvByID(req.params.id);
    // Devolver la provincia encontrada con un estado 200.
    res.status(200).json(provincia);
  } catch (err) {
    // En caso de error, devolver un mensaje de error 404 con el mensaje del error.
    res.status(404).json({ message: err.message });
  }
});

// obtiene todas las provincias con paginación.
router.get('/', async (req, res) => {
  // Obtener el límite y el desplazamiento de la consulta.
  const limit = req.query.limit;
  const offset = req.query.offset;

  try {
    // Buscar todas las provincias con paginación utilizando el servicio de provincias.
    const provincias = await provinciaService.findProvPaginated(limit, offset);
    // Devolver las provincias encontradas con un estado 200.
    res.status(200).json(provincias);
  } catch (err) {
    // En caso de error, devolver un mensaje de error 500 con el mensaje del error.
    res.status(500).json({ message: err.message });
  }
});

// obtiene todas las ubicaciones de una provincia por su ID.
router.get('/:id/locations', async (req, res) => {
  const id = req.params.id;
  try {
    // Buscar todas las ubicaciones de una provincia por su ID utilizando el servicio de provincias.
    const locations = await provinciaService.findLocationsByProvince(id);
    // Devolver las ubicaciones encontradas con un estado 200.
    res.status(200).json(locations);
  } catch (err) {
    // En caso de error, devolver un mensaje de error 404 con el mensaje del error.
    res.status(404).json({ message: err.message });
  }
});

// inserta una nueva provincia.
router.post('/', async (req, res) => {
  // Obtener los datos de la solicitud.
  const name = req.body.name;
  const full_name = req.body.full_name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  try {
    // Insertar una nueva provincia utilizando los datos proporcionados.
    const provincia = await provinciaService.insertProvinceNew(name, full_name, latitude, longitude);
    // Devolver la provincia con un estado 201.
    res.status(201).json(provincia);
  } catch (err) {
    // En caso de error, devolver un mensaje de error 400 con el mensaje del error.
    res.status(400).json({ message: err.message });
  }
});

// elimina una provincia por su ID.
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Eliminar una provincia por su ID utilizando el servicio de provincias.
    const provincia = await provinciaService.deleteProvince(id);
    // Devolver la provincia eliminada con un estado 200.
    res.status(200).json(provincia);
  } catch (err) {
    // En caso de error, devolver un mensaje de error 404 si la provincia no se encuentra, de lo contrario, un mensaje de error 500.
    if (err.message === 'Not Found') {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

// actualiza una provincia por su ID.
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  // Obtener los datos de la solicitud.
  const name = req.body.name;
  const full_name = req.body.full_name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  try {
    // Actualizar una provincia por su ID utilizando los datos proporcionados.
    const provincia = await provinciaService.updateProvince(id, name, full_name, latitude, longitude);
    // Devolver la provincia actualizada con un estado 200.
    res.status(200).json(provincia);
  } catch (err) {
    // En caso de error, devolver un mensaje de error 404 si la provincia no se encuentra, de lo contrario, un mensaje de error 500.
    if (err.message === 'Not Found') {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

export default router;
