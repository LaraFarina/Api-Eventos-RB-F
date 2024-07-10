import express, { Router, json, query } from "express";
import { EventService } from "../service/event-service.js";
import { LocationService } from "../service/location-service.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { Pagination } from "../utils/paginacion.js";
import { verifyPaginationResources } from "../utils/functions.js";

const router = express.Router();
const locationService = new LocationService();
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

    const basePath = "api/location";

    try { 
        const locations = await locationService.findLocationsPaginated(limit, offset);
        const total = await locationService.getAllLocations();
        const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);

        return res.status(200).json({
            coleccion: locations,
            paginacion: paginatedResponse
        }); 
    } catch (error) {
        console.error("Error al obtener las localizaciones:", error);
        return res.status(500).json({ error: "Ocurrió un error al obtener las localizaciones" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const location = await locationService.getLocationById(req.params.id);
        if (location) {
            return res.status(200).json(location);
        } else {
            return res.status(404).send("No se ha encontrado la localización con el ID proporcionado");
        }
    } catch (error) {
        console.error("Error al obtener la localización por ID:", error);
        return res.status(500).send("Ocurrió un error al obtener la localización");
    }
});

router.get("/:id/event-location", AuthMiddleware, async (req, res) => {
    let limit = req.query.limit;
    const page = req.query.page;
    let offset; 
    [limit, offset] = verifyPaginationResources(limit, page);
    
    if (isNaN(limit)) {
        return res.status(400).send("El límite proporcionado no es válido");
    } else if (isNaN(offset)) {
        return res.status(400).send("El offset proporcionado no es válido");
    }

    try {
        const eventLocations = await locationService.getEventLocationsByIdLocation(limit, offset, req.originalUrl, req.params.id);
        if (eventLocations !== false) {
            return res.status(200).json(eventLocations);
        } else {
            return res.status(404).send("No se encontraron eventos para la localización especificada");
        }
    } catch (error) {
        console.error("Error al obtener los eventos para la localización:", error);
        return res.status(500).send("Ocurrió un error al obtener los eventos para la localización");
    }
});

export default router;
