import { EventCatRepository } from "../repositories/event-category-repository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";

const client = new pg.Client(config);
client.connect();

// Crear una clase EventCatService para manejar operaciones relacionadas con categorías de eventos.
export class EventCatService {

    // Método para obtener todas las categorías de eventos con paginación.
    async getAllEventsCat(limit, offset) {
        try {
            // Crear una instancia de EventCatRepository para interactuar con la base de datos.
            const eventCatRepository = new EventCatRepository();
            // Llamar al método getAllEventsCat de EventCatRepository para obtener las categorías de eventos.
            return await eventCatRepository.getAllEventsCat(limit, offset);
        } catch (error) {
            console.error("Error al obtener eventos por filtros", error);
            // Mandar un error
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    // Método para obtener una categoría de evento por su ID.
    async getEventsCatById(id) {
        try {
            // Crear una instancia de EventCatRepository para interactuar con la base de datos.
            const eventCatRepository = new EventCatRepository();
            // Llamar al método getEventsCatById de EventCatRepository para obtener la categoría de evento por su ID.
            const respuesta = await eventCatRepository.getEventsCatById(id);
            return respuesta;
        } catch (error) {
            // Mandar un error
            throw new Error('Error al obtener eventos por filtros');
        }      
    }

    // Método para crear una nueva categoría de evento.
    async createEventCategory(nameCat, display_order) {
        try {
            // Crear una instancia de EventCatRepository para interactuar con la base de datos.
            const eventCatRepository = new EventCatRepository();
            // Llamar al método createEventCategory de EventCatRepository para crear una nueva categoría de evento.
            const respuesta = await eventCatRepository.createEventCategory(nameCat, display_order);
            return respuesta;
        } catch (error) {
            // Mandar un error
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    // Método para actualizar una categoría de evento existente.
    async updateEventCategory(id, nameCat, display_order) {
        try {
            // Crear una instancia de EventCatRepository para interactuar con la base de datos.
            const eventCatRepository = new EventCatRepository();
            // Llamar al método updateEventCategory de EventCatRepository para actualizar una categoría de evento.
            const respuesta = await eventCatRepository.updateEventCategory(id, nameCat, display_order);
            return respuesta;
        } catch (error) {
            // Mandar un error
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    // Método para eliminar una categoría de evento.
    async deleteEventCategory(id) {
        try {
            // Crear una instancia de EventCatRepository para interactuar con la base de datos.
            const eventCatRepository = new EventCatRepository();
            // Llamar al método deleteEventCategory de EventCatRepository para eliminar una categoría de evento.
            const respuesta = await eventCatRepository.deleteEventCategory(id);
            return respuesta;
        } catch (error) {
            // Mandar un error
            throw new Error('Error al obtener eventos por filtros');
        }
    }
}
