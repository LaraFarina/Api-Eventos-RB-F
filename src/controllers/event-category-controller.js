import { Router, json, query } from "express";
import { EventCatService } from "../service/event-category-service.js"; 
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { Pagination } from "../utils/paginacion.js";
import e from "express";

const router = e.Router();
const eventCatService = new EventCatService();
const pagination = new Pagination();

router.get("/", AuthMiddleware, async (req, res) => {
    const { limit, offset } = { limit: pagination.parseLimit(req.query.limit), offset: pagination.parseOffset(req.query.offset) };
    const basePath = "api/event-category";
    try {
        const eventos = await eventCatService.getAllEventsCat(limit, offset);
        const paginatedResponse = pagination.buildPaginationDto(limit, offset, eventos.total, req.path, basePath);
        res.status(200).json({ collection: eventos.collection, paginacion: paginatedResponse });
    } catch (error) {
        console.error("Se ha producido un error al recuperar todas las categorías de eventos", error);
        res.status(500).json({ error: "Se ha producido un problema" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const evento = await eventCatService.getEventsCatById(req.params.id);
        if (evento) {
            res.status(200).json(evento);
        } else {
            res.status(404).json("No se encontró la categoría de evento con el ID proporcionado");
        }
    } catch (error) {
        console.log("Se ha producido un error al recuperar la categoría de evento por ID", error);
        res.status(500).json("Se ha producido un problema");
    }
});

router.post("/", async (req, res) => {
    const { nameCat, display_order } = req.body;
    const trimmedNameCat = nameCat.trim();
    if (trimmedNameCat.length < 3) {
        res.status(400).json(`El nombre: '${trimmedNameCat}' está vacío o tiene menos de tres (3) letras.`);
        return;
    }
    try {
        await eventCatService.createEventCategory(trimmedNameCat, display_order);
        res.status(200).json("Categoría de evento creada con éxito");
    } catch (error) {
        console.log("Se ha producido un error al crear la categoría de evento", error);
        res.status(500).json("Se ha producido un problema");
    }
});

router.put("/", async (req, res) => {
    const { id, nameCat, display_order } = req.body;
    const trimmedNameCat = nameCat.trim();
    if (trimmedNameCat.length < 3) {
        res.status(400).json(`El nombre: '${trimmedNameCat}' está vacío o tiene menos de tres (3) letras.`);
        return;
    }
    try {
        const evento = await eventCatService.updateEventCategory(id, trimmedNameCat, display_order);
        if (evento) {
            res.status(200).json({ message: "Categoría de evento actualizada con éxito", id, name: trimmedNameCat, display_order });
        } else {
            res.status(404).json(`ERROR 404: {id: ${id}} no encontrado`);
        }
    } catch (error) {
        console.log("Se ha producido un error al actualizar la categoría de evento", error);
        res.status(500).json("Se ha producido un problema");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const evento = await eventCatService.deleteEventCategory(req.params.id);
        if (evento) {
            res.status(200).json({ message: "Categoría de evento eliminada con éxito", evento });
        } else {
            res.status(404).json(`ERROR 404: {id: ${req.params.id}} no encontrado`);
        }
    } catch (error) {
        console.log("Se ha producido un error al eliminar la categoría de evento", error);
        res.status(500).json("Se ha producido un problema");
    }
});

export default router;
