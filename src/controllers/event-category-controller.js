import express, { Router, json, query } from "express";
import { EventCatService } from "../service/event-category-service.js"; 
import { AuthMiddleware } from "../auth/authmiddleware.js";
import { Pagination } from "../utils/paginacion.js";
import e from "express";

const router = express.Router();

// Creación de instancias de los servicios necesarios
const eventCatService = new EventCatService(); 
const pagination = new Pagination();

// Sirve para obtener todas las categorías de eventos
router.get("/", AuthMiddleware, async (req, res) => {
    // Se traen los parámetros de paginación de la solicitud
    const limit = pagination.parseLimit(req.query.limit);
    const offset = pagination.parseOffset(req.query.offset);
    const basePath = "api/event-category"
  
    try {
        // Llamada al servicio para obtener todas las categorías de eventos
        const eventos = await eventCatService.getAllEventsCat(limit, offset);
        console.log("Estoy en GET evento-category-controller");
        // Se trae la información de paginación
        const total = eventos.pagination.total;
        const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);
        // Respuesta exitosa con las categorías de eventos y datos de paginación
        return res.status(200).json({
            eventos: eventos.collection,
            paginacion: paginatedResponse
        });
    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener todas las categorías de eventos", error);
        return res.status(500).json({ error: "Ha ocurrido un error" });
    }
});

// Sirve para obtener una categoría de evento por su ID
router.get("/:id", async (req, res) => {
    try {
        // Llamada al servicio para obtener una categoría de evento por su ID
        const evento = await eventCatService.getEventsCatById(req.params.id);
        if (evento != null) {
            // Si se encuentra la categoría, se devuelve en la respuesta
            return res.status(200).json(evento);
        } else {
            // Si no se encuentra, se devuelve un mensaje de error
            return res.status(404).json("No se ha encontrado la categoria de evento con el ID proporcionado.");
        }
    }
    catch(error){
        // Manejo de errores
        return res.json("Ha ocurrido un error");
    }
});

// Sirve para crear una nueva categoría de evento
router.post("/", async (req, res) => {
    try {
        // Se traen los datos necesarios
        const nameCat = req.body.nameCat.trim();
        const display = req.body.display_order;

        // Validación de los datos
        if (nameCat.length < 3 || nameCat === "") {
            return res.status(400).json(`El nombre: '${nameCat}' está vacío o tiene menos de tres caracteres.`);
        }
        
        // Creación de la categoría de evento
        const evento = await eventCatService.createEventCategory(nameCat, display);
        // Respuesta exitosa
        return res.status(200).json("Evento creado con éxito");
    }
    catch(error){
        // Manejo de errores
        return res.status(404).json("Ha ocurrido un error");
    }
});

// Sirve para actualizar una categoría de evento existente
router.put("/", async (req, res) => {
    try {
        // Se traen los datos necesarios
        const id = req.body.id;
        const nameCat = req.body.nameCat.trim();
        const display = req.body.display_order;

        // Validación de los datos
        if (nameCat.length < 3 || nameCat === "") {
            return res.status(400).json(`El nombre: '${nameCat}' está vacío o tiene menos de tres (3) letras.`);
        }
        
        // Actualización de la categoría de evento
        const evento = await eventCatService.updateEventCategory(id, nameCat, display);
        if (evento === null) {
            // Si no se encuentra la categoría, se devuelve un mensaje de error
            const response = {
                message: "Evento actualizado con éxito",
                name: nameCat,
                display_order: display,
                id: id
            };
            return res.status(200).json(response);
        } else {
            return res.status(404).json(`ERROR 404: {id: ${id}} not found`);
        }        
    }
    catch(error){
        // Manejo de errores
        return res.status(500).json("Ha ocurrido un error");
    }
});

// Esto sirve para eliminar una categoría de evento por su ID
router.delete("/:id", async (req, res) => {
    try {
        // Extracción del ID de la solicitud
        const id = req.params.id;
        // Eliminación de la categoría de evento
        const evento = await eventCatService.deleteEventCategory(id);

        if (evento != null) {
            // Si la eliminación funciona, se devuelve un mensaje de éxito
            return res.status(200).json("Evento eliminado con éxito: ", evento);
        } else {
            // Si la categoría no se encuentra, se devuelve un mensaje de error
            return res.status(404).json(`ERROR 404: {id: ${id}} not found`);
        }        
    }
    catch(error){
        // Manejo de errores
        return res.status(500).json("Ha ocurrido un error");
    }
});

export default router;
