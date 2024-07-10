import pg from "pg";
import { config } from "../repositories/db.js";
import { EventRepository } from "../repositories/event-repository.js";
import { Pagination } from "../utils/pagination.js";

const client = new pg.Client(config);
client.connect();

export class EventService {

    constructor() {
        this.eventRepository = new EventRepository();
    }

    async getEventsByFilters(name, category, startDate, tag, limit, offset) {
        try {
            const events = await this.eventRepository.getEventsByFilters(name, category, startDate, tag, limit, offset);
            const formattedEvents = events.map(event => this.formatEvent(event));
            return formattedEvents;
        } catch (error) {
            console.error("Error en getEventsByFilters de EventService:", error);
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    async getEventById(id) {
        try {
            const event = await this.eventRepository.getEventById(id);
            if (!event) {
                return null;
            }
            const formattedEvent = this.formatEvent(event);
            return formattedEvent;
        } catch (error) {
            console.error("Error en getEventById de EventService:", error);
            throw new Error('Error al obtener el evento por ID');
        }
    }

    async getAllEventsUnconfirmedName(name, category, startDate, tag) {
        try {
            const events = await this.eventRepository.getAllEventsUnconfirmedName(name, category, startDate, tag);
            return events;
        } catch (error) {
            console.error("Error en getAllEventsUnconfirmedName de EventService:", error);
            throw new Error('Error al obtener eventos no confirmados por filtros');
        }
    }

    async getParticipantsEvent(id, firstName, lastName, username, attended, rating) {
        if (attended) {
            return false;
        }

        let queryCondition = "";
        const arrayParams = [id];

        if (firstName) {
            queryCondition += " AND u.first_name = $" + (arrayParams.length + 1);
            arrayParams.push(firstName);
        }
        if (lastName) {
            queryCondition += " AND u.last_name = $" + (arrayParams.length + 1);
            arrayParams.push(lastName);
        }
        if (username) {
            queryCondition += " AND u.username = $" + (arrayParams.length + 1);
            arrayParams.push(username);
        }
        if (attended) {
            queryCondition += " AND er.attended = $" + (arrayParams.length + 1);
            arrayParams.push(attended);
        }
        if (rating) {
            queryCondition += " AND er.rating >= $" + (arrayParams.length + 1);
            arrayParams.push(rating);
        }

        const participants = await this.eventRepository.getParticipantsEvent(id, queryCondition, arrayParams);
        return participants;
    }

    async enrollUserInEvent(id_user, id_event) {
        const result = await this.eventRepository.enrollUserInEvent(id_user, id_event);
        return result;
    }

    async isUserEnrolled(id_user, id_event) {
        const isEnrolled = await this.eventRepository.isUserEnrolled(id_user, id_event);
        return isEnrolled;
    }

    async deleteEnrollment(id_event, id_user) {
        const result = await this.eventRepository.deleteEnrollment(id_event, id_user);
        return result;
    }

    async updateEnrollment(rating, description, attended, observation, id_event, id_user) {
        const enrollmentResult = await this.eventRepository.updateEnrollment(rating, description, attended, observation, id_event, id_user);
        return enrollmentResult;
    }

    async createEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) {
        try {
            const createEvent = await this.eventRepository.createEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
            return createEvent;
        } catch (error) {
            console.error('Error al insertar nuevo evento:', error);
            throw new Error('Error al insertar nuevo evento');
        }
    }

    async updateEvent(id, name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) {
        try {
            const updateEvent = await this.eventRepository.updateEvent(id, name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
            return updateEvent;
        } catch (error) {
            console.error('Error al actualizar evento:', error);
            throw new Error('Error al actualizar evento');
        }
    }

    async deleteEvent(id) {
        try {
            const deleteEvent = await this.eventRepository.deleteEvent(id);
            return deleteEvent;
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            throw new Error('Error al eliminar evento');
        }
    }

    async getEventEnrollment(id, userId) {
        try {
            const enrollment = await this.eventRepository.getEventEnrollment(id, userId);
            return enrollment;
        } catch (error) {
            console.error('Error al obtener inscripción de evento:', error);
            throw new Error('Error al obtener inscripción de evento');
        }
    }

    async updateEventEnrollment(id_enrollment, rating, observations) {
        try {
            const updateEventEnrollment = await this.eventRepository.updateEventEnrollment(id_enrollment, rating, observations);
            return updateEventEnrollment;
        } catch (error) {
            console.error('Error al actualizar inscripción de evento:', error);
            throw new Error('Error al actualizar inscripción de evento');
        }
    }

    formatEvent(event) {
        return {
            id: event.id,
            name: event.name,
            description: event.description,
            event_category: {
                id: event.id_event_category,
                name: event.category_name
            },
            event_location: {
                id: event.id_event_location,
                name: event.event_location_name,
                full_address: event.full_address,
                latitude: event.event_location_latitude,
                longitude: event.event_location_longitude,
                max_capacity: event.event_location_max_capacity,
                location: {
                    id: event.location_id,
                    name: event.location_name,
                    latitude: event.location_latitude,
                    longitude: event.location_longitude,
                    province: {
                        id: event.province_id,
                        name: event.province_name,
                        full_name: event.province_full_name,
                        latitude: event.province_latitude,
                        longitude: event.province_longitude,
                        display_order: event.province_display_order
                    }
                }
            },
            start_date: event.start_date,
            duration_in_minutes: event.duration_in_minutes,
            price: event.price,
            enabled_for_enrollment: event.enabled_for_enrollment,
            max_assistance: event.max_assistance,
            creator_user: {
                id: event.id_creator_user,
                username: event.username,
                first_name: event.first_name,
                last_name: event.last_name
            },
            tags: event.tags ? event.tags.map(tag => ({
                id: tag.id,
                name: tag.name
            })) : []
        };
    }
}
