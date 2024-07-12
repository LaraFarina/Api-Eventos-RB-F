import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

const { Client } = pg;

export class EventCategoryRepository {
    constructor() {
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getAllEventCategories(limit, offset) {
        try {
            const query = `SELECT * FROM event_categories LIMIT $1 OFFSET $2`;
            const result = await this.DBClient.query(query, [limit, offset]);
            const totalCountQuery = await this.DBClient.query('SELECT COUNT(*) AS total FROM event_categories');
            const totalCount = parseInt(totalCountQuery.rows[0].total);
            return {
                collection: result.rows,
                total: totalCount
            };
        } catch (error) {
            console.error("Error al obtener todas las categorías de eventos", error);
            throw new Error('Error al obtener todas las categorías de eventos');
        }
    }

    async getEventCategoryById(id) {
        try {
            const query = `SELECT * FROM event_categories WHERE id = $1`;
            const result = await this.DBClient.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al obtener la categoría de evento por ID", error);
            throw error;
        }
    }

    async createEventCategory(name, display_order) {
        try {
            const query = `INSERT INTO event_categories (name, display_order) VALUES ($1, $2) RETURNING *`;
            const result = await this.DBClient.query(query, [name, display_order]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear la categoría de evento", error);
            throw error;
        }
    }

    async updateEventCategory(id, name, display_order) {
        try {
            const query = `UPDATE event_categories SET name = $1, display_order = $2 WHERE id = $3 RETURNING *`;
            const result = await this.DBClient.query(query, [name, display_order, id]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al actualizar la categoría de evento", error);
            throw error;
        }
    }

    async deleteEventCategory(id) {
        try {
            const query = `DELETE FROM event_categories WHERE id = $1 RETURNING *`;
            const result = await this.DBClient.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al eliminar la categoría de evento", error);
            throw error;
        }
    }
}
