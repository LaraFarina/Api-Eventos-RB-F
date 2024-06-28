import express, { Router, json, query } from "express";
import { EventService } from "../service/event-service.js";
import { LocationService } from "../service/location-service.js";
import { AuthMiddleware } from "../auth/authmiddleware.js";
import { Pagination } from "../utils/paginacion.js";

const router = express.Router();
const locationService = new LocationService();
const pagination = new Pagination();

// PUNTO 11: Locations
router.get("/", async (req, res) => {
    const limit = pagination.parseLimit(req.query.limit);
    const offset = pagination.parseOffset(req.query.offset);
    const basePath = "api/location";
    const url = req.originalUrl;
    try {
        const location = await locationService.findLocationsPaginated(limit, offset)
        const total = await locationService.getAllLocations()
        const paginatedResponse = await pagination.buildPaginationDto(limit, offset, total, req.path, basePath);

        return res.status(200).json({
            locacion: location,
            paginacion: paginatedResponse
          }); 
    
    } catch (error) {
        console.log("Error al buscar");
        return res.json("Ocurrió un error");
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const location = await locationService.getLocationById(id);
        return res.status(200).json(location);
    } catch (error) {
        console.log("Error al buscar");
        if (error.message === "location not found") {
            return res.status(404).json({ message: "Location not found" });
        }
        else {
        return res.status(500).json({ message: "Ocurrió un error" });
        }
    }
});

router.get("/:id/event-location", AuthMiddleware, async (req, res) => {
    const id = req.params.id; // location id
    const user_id = req.user.id;

    try {
        // Verifica si la ubicación existe
        const location = await locationService.getLocationById(id);

        // Si la ubicación existe, busca los eventos asociados a esa ubicación y usuario
        const events = await locationService.getEventsLocationByLocations(id, user_id);
        
        return res.status(200).json(events);
    } catch (error) {
        console.log("Error al buscar");
        if (error.message === "location not found") {
            return res.status(404).json({ message: "Location not found" });
        } else if (error.message === "events not found") {
            return res.status(404).json({ message: "No events found for the specified location and user" });
        } else {
            return res.status(500).json({ message: "Ocurrió un error" });
        }
    }
});


export default router;