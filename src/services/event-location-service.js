import { EventLocationRepository } from "../../repositories/event-location-repository.js";
import { Pagination } from "../helpers/paginacion.js";
import pg from "pg";
import { config } from "../../repositories/db.js";

const client = new pg.Client(config);
client.connect();

export class EventLocationservices {
    constructor() {
        this.eventLocationRepository = new EventLocationRepository(client);
    }

    // Métodos del primer código
    async getAllLocationsPaginated(limit, offset) {
        return await this.eventLocationRepository.getAllLocationsPaginated(limit, offset);
    }

    async getLocationsCount() {
        return await this.eventLocationRepository.getLocationsCount();
    }

    async findLocationByID(id) {
        return await this.eventLocationRepository.findLocationByID(id);
    }

    async createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) {
        return await this.eventLocationRepository.createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
    }

    async putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user) {
        console.log("ESTOY EN EVENT-LOCATION-services");
        return await this.eventLocationRepository.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user);
    }

    async deleteEventLocation(id, id_user) {
        return await this.eventLocationRepository.deleteEventLocation(id, id_user);
    }

    // Métodos del segundo código
    async getAllEventLocations(userId, limit, offset, url) {
        const [eventLocations, totalCount] = await this.eventLocationRepository.getAllEventLocations(userId, limit, offset);
        return Pagination.BuildPagination(eventLocations, limit, offset, url, totalCount);
    }

    async getEventLocationById(id, userId) {
        return await this.eventLocationRepository.getEventLocationById(id, userId);
    }

    async createEventLocation(eventLocation) {
        // Implementa las validaciones necesarias antes de crear la ubicación del evento
        let creation = this.verifyEventLocation(eventLocation);
        if (creation === true) {
            creation = await this.eventLocationRepository.createEventLocation(eventLocation);
        }
        return creation;
    }

    verifyEventLocation(eventLocation) {
        if (!verifyLength(eventLocation.name) || !verifyLength(eventLocation.full_address)) {
            return "El nombre  (name) o la dirección (full_address) están vacíos o tienen menos de tres (3) letras";
        } else if (eventLocation.max_capacity <= 0) {
            return "El max_capacity es el número 0 (cero) o negativo";
        } else {
            return true;
        }
    }

    async updateEventLocation(eventLocation) {
        let message = this.verifyEventLocation(eventLocation);
        let statusCode;
        if (message === true) {
            [statusCode, message] = await this.eventLocationRepository.updateEventLocation(eventLocation);
            return [statusCode, message];
        }
        return [400, message];
    }

    async deleteEventLocation(id, userId) {
        return await this.eventLocationRepository.deleteEventLocation(id, userId);
    }
}
