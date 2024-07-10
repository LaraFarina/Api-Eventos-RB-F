import express, { Router, json, query } from "express";
import { EventLocationService } from "../service/event-location-service.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { Pagination } from "../utils/paginacion.js";

const router = express.Router();
const eventLocationService = new EventLocationService();
const pagination = new Pagination();

router.get("/", AuthMiddleware, async (req, res) => {
    const limit = pagination.parseLimit(req.query.limit);
    const offset = pagination.parseOffset(req.query.offset);
    const basePath = "api/event-location";

    try {
        const locations = await eventLocationService.getAllLocationsPaginated(limit, offset);
        const total = await eventLocationService.getLocationsCount();

        if (total != null) {
            const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);
            return res.status(200).json({
                collection: locations,
                paginacion: paginatedResponse
            });
        } else {
            return res.status(404).json({ message: "No se encontraron locaciones" });
        }
    } catch (error) {
        console.error("Error al obtener las locaciones:", error);
        return res.status(500).json("Ha ocurrido un problema al buscar las locaciones");
    }
});

router.get("/:id", AuthMiddleware, async (req, res) => {
    try {
        const location = await eventLocationService.findLocationByID(req.params.id);
        if (location) {
            console.log("Localización encontrada:", location);
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se encontró la localización con el ID proporcionado");
        }
    } catch (error) {
        console.error("Error al obtener la localización por ID:", error);
        return res.status(500).json("Ha ocurrido un problema al buscar la localización");
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const { id_location, name, full_address, max_capacity, latitude, longitude } = req.body;
    const id_creator_user = req.user.id;

    try {
        const location = await eventLocationService.createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        console.log("Localización creada:", location);
        return res.status(200).json("Localización creada con éxito");
    } catch (error) {
        console.error("Error al crear la localización:", error);
        if (error.message === 'Bad Request') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json("Ha ocurrido un problema al crear la localización");
    }
});

router.put("/", AuthMiddleware, async (req, res) => {
    const { id, id_location, name, full_address, max_capacity, latitude, longitude } = req.body;
    const id_user = req.user.id;

    try {
        const location = await eventLocationService.putEventLocation(id, id_location, name.trim(), full_address.trim(), max_capacity, latitude, longitude, id_user);
        if (location) {
            console.log("Localización actualizada:", location);
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se encontró la localización con el ID proporcionado o el ID de usuario no es correcto");
        }
    } catch (error) {
        console.error("Error al actualizar la localización:", error);
        if (error.message === 'Bad Request') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json("Ha ocurrido un problema al actualizar la localización");
    }
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
    const id = req.params.id;
    const id_user = req.user.id;

    try {
        const location = await eventLocationService.deleteEventLocation(id, id_user);
        if (location) {
            console.log("Localización eliminada:", location);
            return res.status(200).json({ message: 'Localización eliminada correctamente' });
        } else {
            return res.status(404).json("No se encontró la localización con el ID proporcionado o el ID de usuario no es correcto");
        }
    } catch (error) {
        console.error("Error al eliminar la localización:", error);
        return res.status(500).json("Ha ocurrido un problema al eliminar la localización");
    }
});

export default router;
