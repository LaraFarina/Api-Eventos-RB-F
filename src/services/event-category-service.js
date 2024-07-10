import { EventCategoryRepository } from "../../repositories/event_category-repository.js";
import { Pagination } from "../entities/pagination.js";
import { verifyLength } from "../utils/functions.js";
import pg from "pg";
import { config } from "../../repositories/db.js";

const client = new pg.Client(config);
const eventCategoryRepository = new EventCategoryRepository(client);

export class EventCategoryService {
    constructor() {
        this.eventCategoryRepository = eventCategoryRepository;
    }

    // Métodos del primer código
    async getAllEvent_Category(limit, offset, url) {
        const [event_categories, totalCount] = await this.eventCategoryRepository.getAllEvent_Category(limit, offset);
        return Pagination.BuildPagination(event_categories, limit, offset, url, totalCount);
    }

    async getEvent_CategoryById(id) {
        return await this.eventCategoryRepository.getEvent_CategoryById(id);
    }

    async createEventCategory(event_category) {
        if (!verifyLength(event_category.name)) {
            throw new Error("El nombre (name) está vacío o tiene menos de tres (3) letras");
        }
        return await this.eventCategoryRepository.createEventCategory(event_category);
    }

    async updateEventCategory(event_category) {
        if (!verifyLength(event_category.name)) {
            throw new Error("El nombre (name) está vacío o tiene menos de tres (3) letras");
        }
        return await this.eventCategoryRepository.updateEventCategory(event_category);
    }

    async deleteEventCategory(id) {
        return await this.eventCategoryRepository.deleteEventCategory(id);
    }

    // Métodos del segundo código
    async getAllEventsCat(limit, offset) {
        try {
            return await eventCategoryRepository.getAllEventsCat(limit, offset);
        } catch (error) {
            console.error("Error al obtener eventos por filtros", error);
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    async getEventsCatById(id) {
        try {
            return await eventCategoryRepository.getEventsCatById(id);
        } catch (error) {
            console.error("Error al obtener eventos por filtros", error);
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    async createEventCategory(nameCat, display_order) {
        try {
            return await eventCategoryRepository.createEventCategory(nameCat, display_order);
        } catch (error) {
            console.error("Error al crear categoría de evento", error);
            throw new Error('Error al crear categoría de evento');
        }
    }

    async updateEventCategory(id, nameCat, display_order) {
        try {
            return await eventCategoryRepository.updateEventCategory(id, nameCat, display_order);
        } catch (error) {
            console.error("Error al actualizar categoría de evento", error);
            throw new Error('Error al actualizar categoría de evento');
        }
    }

    async deleteEventCategory(id) {
        try {
            return await eventCategoryRepository.deleteEventCategory(id);
        } catch (error) {
            console.error("Error al eliminar categoría de evento", error);
            throw new Error('Error al eliminar categoría de evento');
        }
    }
}
