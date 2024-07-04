import {ProvinciasService} from "../service/provincias-service.js";
import express from "express";
import { Pagination } from "../utils/paginacion.js";

const router = express.Router();
const pagination = new Pagination();


const provinciaService = new ProvinciasService();

router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const provincia = await provinciaService.findProvByID(req.params.id);
    if (!provincia) {
      return res.status(404).json({error: 'No se ha encontrado una provincia con ese id'});
    } else {
      return res.status(200).json(provincia);
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const limit = pagination.parseLimit(req.query.limit);
  const offset = pagination.parseOffset(req.query.offset);
  const basePath = "api/province";

  try {
    const provincias = await provinciaService.findProvPaginated(limit, offset);
    const total = await provinciaService.getAllProvinces()
    const paginatedResponse = await pagination.buildPaginationDto(limit, offset, total, req.path, basePath);

    return res.status(200).json({
      collection: provincias,
      paginacion: paginatedResponse
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id/locations', async (req, res) => {
  const basePath = ("api/province/" + req.params.id + "/locations")
  const limit = pagination.parseLimit(req.query.limit);
  const offset = pagination.parseOffset(req.query.offset);

  try {
    const locations = await provinciaService.findLocationsByProvincePaginated(req.params.id, limit, offset);
    const total = await provinciaService.getAllLocations(req.params.id)
    console.log(total)
    const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);
    return res.status(200).json({
      collection: locations,
      paginacion: paginatedResponse
    });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }

});


router.post('/', async (req, res) => {
  const name = req.body.name;
  const full_name = req.body.full_name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  if(name.length < 3 || isNaN(Number(longitude)) || isNaN(Number(latitude))) {
    return res.status(400).json({ ERROR: "ESTA MAL XD" });
  } else{
    try {
      const provincia = await provinciaService.insertProvinceNew(name,full_name, latitude, longitude);
      return res.status(201).json({message: "Provincia insertada correctamente ;)"});
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await provinciaService.deleteProvince(id);
    const provincia = result.province;
    const localidades = result.deletedLocationNames;

    if (provincia) {
      return res.status(200).json({
        message: "Borrado correctamente",
        provinceName: provincia.name,
        deletedLocations: localidades
      });
    } else {
      return res.status(404).json({ message: "Provincia no encontrada" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error al eliminar provincia" });
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
    return res.status(200).json(provincia);
  } catch (err) {
    if (err.message === 'Not Found') {
      return res.status(404).json({ message: err.message });
    } else {
      return res.status(500).json({ message: err.message });
    }
  }
});



export default router;


