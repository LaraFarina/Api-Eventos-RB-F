import { query } from "express";
import { EventLocationRepository } from "../repositories/event-location-repository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";

const client = new pg.Client(config);
client.connect();

export class EventLocationService {

    // Método para encontrar una ubicación de evento por su ID.
    async findLocationByID(id) {
        // Crear una instancia de EventLocationRepository.
        const eventLocationRepository = new EventLocationRepository();
        // Llamar al método findLocationByID de EventLocationRepository para obtener la ubicación correspondiente al ID proporcionado.
        const location = await eventLocationRepository.findLocationByID(id);
        // Retornar la ubicación encontrada.
        return location;
    }

    // Método para crear una nueva ubicación de evento.
    async createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) {
        // Crear una instancia de EventLocationRepository.
        const eventLocationRepository = new EventLocationRepository();
        // Llamar al método createEventLocation de EventLocationRepository para crear una nueva ubicación de evento con los datos proporcionados.
        const location = await eventLocationRepository.createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        // Retornar la ubicación creada.
        return location;
    }

    // Método para actualizar una ubicación de evento existente.
    async putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user) {
        // Crear una instancia de EventLocationRepository.
        const eventLocationRepository = new EventLocationRepository();
        // Llamar al método putEventLocation de EventLocationRepository para actualizar la ubicación de evento con los datos proporcionados.
        return await eventLocationRepository.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user);
    }

    // Método para eliminar una ubicación de evento por su ID.
    async deleteEventLocation(id, id_user) {
        // Crear una instancia de EventLocationRepository.
        const eventLocationRepository = new EventLocationRepository();
        // Llamar al método deleteEventLocation de EventLocationRepository para eliminar la ubicación de evento correspondiente al ID proporcionado.
        return await eventLocationRepository.deleteEventLocation(id, id_user);
    }
}
