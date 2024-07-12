import express from "express";
import { Provinciasservices } from "../services/provincias-service.js";
import { authmiddleware } from "../auth/authmiddleware.js";
import { Pagination } from "../helpers/paginacion.js";

const router = express.Router();
const provinciaservices = new Provinciasservices();
const pagination = new Pagination();

router.get("/", async (req, res) => {
  let limit = req.query.limit;
  const page = req.query.page;
  let offset;
  [limit, offset] = verifyPaginationResources(limit, page);

  if (isNaN(limit)) {
    return res.status(400).send("El límite proporcionado no es válido");
  } else if (isNaN(offset)) {
    return res.status(400).send("El offset proporcionado no es válido");
  }

  const basePath = "api/province";

  try {
    const provincias = await provinciaservices.findProvPaginated(limit, offset);
    const total = await provinciaservices.getAllProvinces();
    const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);

    return res.status(200).json({
      collection: provincias,
      paginacion: paginatedResponse
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const provincia = await provinciaservices.findProvByID(req.params.id);
    if (!provincia) {
      return res.status(404).json({ error: 'No se ha encontrado una provincia con ese ID' });
    } else {
      return res.status(200).json(provincia);
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

router.get("/:id/locations", async (req, res) => {
  let limit = req.query.limit;
  const page = req.query.page;
  let offset;
  [limit, offset] = verifyPaginationResources(limit, page);

  if (isNaN(limit)) {
    return res.status(400).send("El límite proporcionado no es válido");
  } else if (isNaN(offset)) {
    return res.status(400).send("El offset proporcionado no es válido");
  }

  const basePath = "api/province/" + req.params.id + "/locations";

  try {
    const locations = await provinciaservices.findLocationsByProvincePaginated(req.params.id, limit, offset);
    const total = await provinciaservices.getAllLocations(req.params.id);
    const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);

    return res.status(200).json({
      collection: locations,
      paginacion: paginatedResponse
    });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const province = new Province(
    null,
    req.body.name,
    req.body.full_name,
    req.body.latitude,
    req.body.longitude,
    req.body.display_order
  );

  const verificacion = province.verifyObject(false);
  if (verificacion !== true) {
    return res.status(400).send(verificacion);
  }

  const [provincia, mensaje] = await provinciaservices.createProvince(province);
  if (provincia) {
    return res.status(201).send();
  } else {
    return res.status(400).send(mensaje);
  }
});

router.put("/:id", async (req, res) => {
  const province = new Province(
    req.body.id,
    req.body.name,
    req.body.full_name,
    req.body.latitude,
    req.body.longitude,
    req.body.display_order
  );

  const verificacion = province.verifyObject(true);
  if (verificacion !== true) {
    return res.status(400).send(verificacion);
  }

  if (province.id === undefined) {
    return res.status(400).send("El ID debe ser ingresado");
  } else {
    const [provincia, mensaje] = await provinciaservices.updateProvince(province);
    if (provincia) {
      return res.status(200).send();
    } else if (mensaje !== null) {
      return res.status(400).send(mensaje);
    } else {
      return res.status(404).send();
    }
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await provinciaservices.deleteProvince(id);
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

export default router;
