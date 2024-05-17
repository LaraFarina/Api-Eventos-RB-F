import {ProvinciasService} from "../service/provincias-service.js";
import express from "express";
const router = express.Router();

const provinciaService = new ProvinciasService();

// Obtener una provincia por ID
router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const provincia = await provinciaService.findProvByID(req.params.id);
    res.status(200).json(provincia);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Obtener todas las provincias con paginación
router.get('/', async (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.offset;

  try {
    const provincias = await provinciaService.findProvPaginated(limit, offset);
    console.log(provincias);
    res.status(200).json(provincias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/locations', async (req, res) => {
  const id = req.params.id;
  try {
    const locations = await provinciaService.findLocationsByProvince(id);
    res.status(200).json(locations);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }

});


router.post('/', async (req, res) => {
  const name = req.body.name;
  const full_name = req.body.full_name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  try {
    const provincia = await provinciaService.insertProvinceNew(name,full_name, latitude, longitude);
    res.status(201).json(provincia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const provincia = await provinciaService.deleteProvince(id);
    res.status(200).json(provincia);
  } catch (err) {
    if(err.message === 'Not Found') {
      res.status(404).json({ message: err.message });
    } else{
      res.status(500).json({ message: err.message });
    }
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const full_name = req.body.full_name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  console.log(id, name, full_name, latitude, longitude);
  try {
    const provincia = await provinciaService.updateProvince(id, name, full_name, latitude, longitude);
    res.status(200).json(provincia);
  } catch (err) {
    if (err.message === 'Not Found') {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});



export default router;


