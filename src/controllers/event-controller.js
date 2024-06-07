import express, { Router, json, query } from "express";
import { EventService } from "../service/event-service.js";
import { AuthMiddleware } from "../auth/authmiddleware.js";
import { Pagination } from "../utils/paginacion.js";

const router = express.Router();
const eventService = new EventService();
const pagination = new Pagination();

// Listado y búsqueda de eventos
router.get("/", async (req, res) => {
    // Trae los parámetros de consulta
    const limit = pagination.parseLimit(req.query.limit);
    const offset = pagination.parseOffset(req.query.offset);
    const basePath = "api/event"
    const tag = req.query.tag;
    const startDate = req.query.startDate;
    const name = req.query.name;
    const category = req.query.category;

    try {
        // Obtiene los eventos filtrados por los parámetros de consulta
        const events = await eventService.getEventsByFilters(name, category, startDate, tag, limit, offset);
        const total = events.length; // Total de eventos encontrados
        // Objeto de paginación
        const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);
        // Devuelve lista de eventos y datos de paginación en formato JSON
        return res.status(200).json({
            eventos: events,
            paginacion: paginatedResponse
        });
    } catch (error) {
        // Devuelve un error si ocurre algún problema durante la búsqueda
        return res.status(500).json({ error: "Ha ocurrido un error." });
    }
});

// Detalle de un evento
router.get("/:id", async (req, res) => {
    try {
        // Obtiene detalles de un evento por su ID
        const evento = await eventService.getEventById(req.params.id);
        // Devuelve los detalles del evento en formato JSON
        return res.json(evento);
    } catch (error) {
        // Devuelve un mensaje de error si falla la obtención de los detalles del evento
        return res.json("Ha ocurrido un error.");
    }
});

// Listado de participantes de un evento
router.get("/:id/enrollment", (req, res) => {
    // Trae los datos de los parámetros de consulta
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const userName = req.query.userName;
    const attended = req.query.attended;
    const rating = req.query.rating;
    try {
        // Obtiene los participantes del evento según los parámetros de consulta
        const participantesEvento = eventService.getParticipantesEvento(req.params.id, first_name, last_name, userName, attended, rating);
        // Verifica si se obtienen participantes y los devuelve en formato JSON
        if (!participantesEvento) {
            return res.status(400).json({ error: 'El formato de attended no es valido' });
        }
        return res.json(participantesEvento);
    } catch (error) {
        // Devuelve un mensaje de error si ocurre algún problema durante la búsqueda de participantes
        console.log("Error al buscar");
        return res.json("Ha ocurrido un error.");
    }
});

// Crear un evento
router.post("/", AuthMiddleware, async (req, res) => {
    // Se traen los datos del cuerpo de la solicitud
    const name = req.body.name;
    const description = req.body.description;
    const id_event_category = req.body.id_event_category;
    const id_event_location = req.body.id_event_location;
    const start_date = req.body.start_date;
    const duration_in_minutes = req.body.duration_in_minutes;
    const price = req.body.price;
    const enabled_for_enrollment = req.body.enabled_for_enrollment;
    const max_assistance = req.body.max_assistance;
    const id_creator_user = req.user.id;

    try {
        // Crea un nuevo evento con los datos proporcionados
        const evento = await eventService.createEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
        // Devuelve el evento creado en formato JSON
        return res.status(200).json(evento);
    } catch (error) {
        // Devuelve un mensaje de error si ocurre algún problema durante la creación del evento
        console.log("Error al crear evento");
        if (error.message === 'Not Found') {
            return res.status(404).json({ message: error });
        }
        if (error.message === 'Bad request') {
            return res.status(400).json("Bad request");
        }
    }
});

// Actualizar un evento
router.put("/:id", AuthMiddleware, async (req, res) => {
    // Se traen los datos del cuerpo de la solicitud y el ID del evento
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const category = req.body.category;
    const capacity = req.body.capacity;
    const location = req.body.location;
    const image = req.body.image;
    const tag = req.body.tag;
    const price = req.body.price;
    const user_id = req.user.id;

    try {
        // Actualiza el evento con los nuevos datos
        const evento = await eventService.updateEvent(id, name, description, start_date, end_date, category, capacity, location, image, tag, price, user_id);
        // Devuelve un mensaje de éxito si se actualiza correctamente
        if (evento) {
            return res.status(200).json({ Message: 'Se ha actualizado correctamente' });
        }
    } catch (error) {
        // Devuelve un mensaje de error si falla la actualización del evento
        console.log("Error al editar el evento");
        return res.json("Ha ocurrido un error.");
    }
});

// Eliminar un evento
router.delete("/:id", AuthMiddleware, async (req, res) => {
    // Se traen los datos del ID del evento
    const id = req.params.id;
    try {
        // Elimina el evento con el ID proporcionado
        const rowsAffected = await eventService.deleteEvent(id);
        // Devuelve un mensaje de éxito si se elimina correctamente
        if (rowsAffected > 0) {
            return res.status(200).json({ 'mensaje': 'Se elimino el evento' });
        } else {
            return res.status(400).json({ 'mensaje': 'no se elimino' });
        }
    } catch (error) {
        // Devuelve un mensaje de error si falla la eliminación del evento
        console.log("Error al eliminar evento");
        return res.json("Un Error");
    }
});

// Inscripción a un evento
router.post("/:id/enrollment", AuthMiddleware, (req, res) => {
    // Se traen los datos del ID del usuario y del evento
    const id_user = req.user.id;
    const id_event = req.params.id;
    try {
        // Inscribir al usuario en el evento
        const event = eventService.postInscripcionEvento(id_event, id_user);
        // Devuelve un mensaje de éxito si se realiza la inscripción correctamente
        if (!event) {
            return res.status(400).json({ error: 'El formato de attended no es valido' });
        } else {
            return res.json("Se ha realizado la inscripción al evento correctamente.");
        }
    } catch (error) {
        // Devuelve un mensaje de error si falla la inscripción al evento
        if (error.message === 'Not Found') {
            res.status(404).json({ message: error.message })
        } else {
            res.status(400).json("Ha ocurrido un error.");
        }
        console.log("Ha ocurrido un error al intentar inscribirte.");
    }
});

// Cancelación de inscripción a un evento
router.delete("/:id/enrollment", AuthMiddleware, async (req, res) => {
    // Traen los datos del ID del usuario y del evento
    const id_user = req.user.id;
    const id_event = req.params.id;
    try {
        // Cancela la inscripción del usuario en el evento
        const event = await eventService.deleteInscripcionEvento(id_event, id_user);
        // Devuelve un mensaje de éxito si se cancela la inscripción correctamente
        if (!event) {
            return res.status(400).json({ error: 'El formato de attended no es valido' });
        } else {
            return res.json("Se ha desinscripto correctamente al evento");
        }
    } catch (error) {
        // Devuelve un mensaje de error si falla la cancelación de la inscripción al evento
        if (error.message === 'Not Found') {
            res.status(404).json({ message: error.message })
        } else {
            res.status(400).json("Ha ocurrido un error.");
        }
        console.log("Ha ocurrido un error al desinscribir.");
    }
});

// Calificación de un evento
router.patch("/:id/enrollment", (req, res) => {
    // Verifica el formato de los datos de calificación y asistencia
    if (!Number.isInteger(Number(req.body.rating)) && Number.isInteger(Number(req.body.attended))) {
        return res.status(400).json({ error: 'El formato de attended no es valido' });
    }
    // Se traen los datos del cuerpo de la solicitud
    const rating = req.body.rating;
    const descripcion = req.body.description;
    const attended = req.body.attended;
    const observation = req.body.observation;
    try {
        // Puntua el evento con los datos proporcionados
        const enrollment = eventService.patchEnrollment(rating, descripcion, attended, observation);
        // Devuelve la respuesta en formato JSON
        return res.json(enrollment);
    } catch (error) {
        // Devuelve un mensaje de error si falla la puntuación del evento
        console.log("Ha ocurrido un error al puntuar");
        return res.json("Ha ocurrido un error.");
    }
});

export default router;
