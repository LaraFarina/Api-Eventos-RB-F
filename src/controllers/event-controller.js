import express, { Router, json, query } from "express";
import { Eventservices } from "../services/event-service.js";
import { authmiddleware } from "../auth/authmiddleware.js";
import { Pagination } from "../helpers/paginacion.js";

const router = express.Router();
const eventservices = new Eventservices();
const pagination = new Pagination();

router.get("/", async (req, res) => {
    const limit = pagination.parseLimit(req.query.limit);
    const offset = pagination.parseOffset(req.query.offset);
    const basePath = "/api/event";
    const tag = req.query.tag;
    const startDate = req.query.startDate;
    let name = req.query.name;
    const category = req.query.category;

    if (name) {
        name = name.trim();
    }

    try {
        const events = await eventservices.getEventsByFilters(name, category, startDate, tag, limit, offset);
        const total = await eventservices.getAllEventsUnconfirmedName(name, category, startDate, tag);
        const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);

        const response = {
            collection: events,
            pagination: paginatedResponse
        };

        return res.status(200).json(response);
    } catch (error) {
        console.log("Error al buscar eventos:", error);
        return res.status(500).json({ error: "Se ha producido un problema" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const evento = await eventservices.getEventById(req.params.id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        return res.status(200).json(evento);
    } catch (error) {
        console.log("Error al buscar evento por ID:", error);
        return res.status(500).json({ error: 'Se ha producido un problema' });
    }
});

router.get("/:id/enrollment", async (req, res) => {
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const username = req.query.username;
    const attended = req.query.attended;
    const rating = req.query.rating;
    console.log("controller");
    try {
        const participantesEvento = await eventservices.getParticipantesEvento(req.params.id, first_name, last_name, username, attended, rating);
        
        if (!participantesEvento) {
            return res.status(200).json({ participantesEvento: [] });
        }
        return res.json(participantesEvento);
    } catch (error) {
        console.log("Error al buscar participantes del evento:", error);
        return res.status(500).json({ error: "Se ha producido un problema" });
    }
});

router.post("/", authmiddleware, async (req, res) => {
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
        const evento = await eventservices.createEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
        return res.status(200).json(evento);
    } catch (error) {
        console.log("Error al crear el evento:", error);
        if (error.message === 'Not Found') {
            return res.status(404).json({ message: 'No se encontró el recurso' });
        }
        if (error.message === 'Bad Request') {
            return res.status(400).json("Solicitud incorrecta");
        }
        return res.status(500).json({ error: "Se ha producido un problema" });
    }
});

router.put("/:id", authmiddleware, async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const start_date = req.body.start_date;
    const duration_in_minutes = req.body.duration_in_minutes;
    const id_event_category = req.body.id_event_category;
    const id_event_location = req.body.id_event_location;
    const price = req.body.price;
    const max_assistance = req.body.max_assistance;
    const enabled_for_enrollment = req.body.enabled_for_enrollment;
    const id_creator_user = req.user.id;

    try {
        console.log(start_date);
        const evento = await eventservices.updateEvent(id, name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
        if (evento) {
            return res.status(200).json({ message: 'Evento actualizado con éxito' });
        }
        return res.status(404).json({ error: 'Evento no encontrado' });
    } catch (error) {
        console.log("Error al editar el evento:", error);
        return res.status(500).json({ error: "Se ha producido un problema" });
    }
});

router.delete("/:id", authmiddleware, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;

    try {
        const event = await eventservices.getEventById(id);
        if (!event) {
            return res.status(404).json({ mensaje: 'Evento no encontrado' });
        }

        if (event.id_creator_user !== userId) {
            return res.status(403).json({ mensaje: 'No tienes permisos para eliminar este evento' });
        }

        const rowsAffected = await eventservices.deleteEvent(id);
        if (rowsAffected > 0) {
            return res.status(200).json({ mensaje: 'Evento eliminado con éxito' });
        } else {
            return res.status(400).json({ mensaje: 'No se pudo eliminar el evento' });
        }
    } catch (error) {
        console.log("Error al eliminar el evento:", error);
        return res.status(500).json({ mensaje: 'Error interno al eliminar el evento' });
    }
});

router.post("/:id/enrollment", authmiddleware, async (req, res) => {
    const id_user = req.user.id;
    const id_event = req.params.id;

    try {
        const event = await eventservices.getEventById(id_event);
        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        if (!event.enabled_for_enrollment) {
            return res.status(400).json({ error: 'El evento no está habilitado para inscripción' });
        }
        if (event.current_attendance >= event.max_assistance) {
            return res.status(400).json({ error: 'El evento ha alcanzado la capacidad máxima' });
        }
        const isEnrolled = await eventservices.isUserEnrolled(id_user, id_event);
        if (isEnrolled) {
            return res.status(400).json({ error: 'El usuario ya está inscrito en el evento' });
        }

        await eventservices.postInscripcionEvento(id_user, id_event);
        return res.status(201).json({ message: 'Usuario inscrito exitosamente' });

    } catch (error) {
        if (error.message === 'Not Found') {
            return res.status(404).json({ message: 'Evento no encontrado' });
        } else {
            return res.status(400).json({ error: 'Solicitud incorrecta', message: error.message });
        }
    }
});

router.delete("/:id/enrollment", authmiddleware, async (req, res) => {
    const id_user = req.user.id;
    const id_event = req.params.id;
    try {
        const event = await eventservices.deleteInscripcionEvento(id_event, id_user);
        if (!event) {
            return res.status(404).json({ error: 'El ID del evento en la inscripción no existe' });
        } else {
            return res.json("Se ha desinscripto del evento exitosamente");
        }
    } catch (error) {
        console.log("Error al desinscribir del evento:", error);
        return res.status(400).json({ error: "El usuario no se encuentra registrado o se está intentando borrar una inscripción para un evento que ya sucedió" });
    }
});

router.patch("/:id/enrollment/:entero", authmiddleware, async (req, res) => {
    const id = req.params.id; 
    const rating = req.params.entero; 
    const observations = req.body.observations;
    const userId = req.user.id; 

    if (rating < 1 || rating > 10) {
        return res.status(400).json({ error: 'La calificación debe ser un entero entre 1 y 10' });
    }
    
    try {
        const eventEnrollment = await eventservices.getEventEnrollment(id, userId);
        if (!eventEnrollment) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        const id_enrollment = eventEnrollment.id;
        console.log(id_enrollment, "holaa");
        const start_date = eventEnrollment.start_date;

        const hoy = new Date();
        if (new Date(start_date) > hoy) {
            return res.status(400).json({ error: 'El evento aún no ha finalizado' });
        }
        const updatedEnrollment = await eventservices.updateEventEnrollment(id_enrollment, rating, observations);
        console.log(updatedEnrollment);
        return res.status(200).json(updatedEnrollment);
    } catch (error) {
        if (error.message === 'Usuario no autenticado') {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        console.error('Error al actualizar la inscripción:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
