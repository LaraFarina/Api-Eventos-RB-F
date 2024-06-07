import pg from "pg";
import { config } from "./db.js";

// Crear un nuevo cliente de PostgreSQL usando la configuración de la base de datos.
const client = new pg.Client(config);
// Conectar el cliente a la base de datos.
client.connect();

// Clase EventCatRepository para manejar operaciones relacionadas con eventos y categorías.
export class EventCatRepository {
    // Método para obtener eventos filtrados por nombre, categoría, fecha de inicio y etiqueta.
    async getEventsByFilters(name, category, startDate, tag, limit, offset) {
        // Imprimir los filtros recibidos para depuración.
        console.log("Tag: ", tag);
        console.log("Category:", category);
        console.log("Name: ", name);
        console.log("startDate: ", startDate);

        // Consulta SQL inicial.
        let sqlQuery = "SELECT * FROM events WHERE 1=1";
        const queryParams = [];

        // Agregar condiciones a la consulta según los filtros proporcionados.
        if (name) {
            sqlQuery += ` AND "name" ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${name}%`);
        }

        if (category) {
            // Obtener el ID de la categoría según el nombre de la categoría proporcionado.
            const categoryIdQuery = `SELECT id FROM event_categories WHERE "name" = $1`;
            const { rows: categoryRows } = await client.query(categoryIdQuery, [category]);
            const categoryId = categoryRows[0]?.id;
            // Si se encuentra la categoría, agregarla como condición a la consulta.
            if (categoryId) {
                console.log("SOY UNA CATEGORIA Y EXISTO");
                sqlQuery += ` AND id_event_category = $${queryParams.length + 1}`;
                queryParams.push(categoryId);
            }
        }

        if (startDate) {
            // Agregar la fecha de inicio como condición a la consulta.
            sqlQuery += ` AND start_date::date = $${queryParams.length + 1}`;
            queryParams.push(startDate);
        }

        if (tag) {
            // Obtener el ID de la etiqueta según el nombre de la etiqueta proporcionado.
            const tagIdQuery = `SELECT id FROM tags WHERE "name" = $1`;
            const { rows: tagRows } = await client.query(tagIdQuery, [tag]);
            const tagId = tagRows[0]?.id;
            // Si se encuentra la etiqueta, agregarla como condición a la consulta.
            if (tagId) {
                sqlQuery += ` AND id IN (SELECT id_event FROM event_tags WHERE id_tag = $${queryParams.length + 1})`;
                queryParams.push(tagId);
            }
        }

        // Agregar paginación utilizando limit y offset a la consulta.
        sqlQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        try {
            // Ejecutar la consulta SQL y devolver los resultados.
            const { rows } = await client.query(sqlQuery, queryParams);
            return rows;
        } catch (error) {
            // En caso de error, registrar el error y mandar un error.
            console.error("Error al ejecutar la consulta SQL:", error);
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    // Método para obtener una categoría de evento por su ID.
    async getEventsCatById(id) {
        try {
            // Consultar la categoría de evento por su ID.
            console.log("Estoy en event-category-repository");
            const query = "SELECT name FROM event_categories WHERE id = $1";
            const values = [id];
            const respuesta = await client.query(query, values);
            return respuesta.rows[0];
        } catch (error) {
            // En caso de error, registrar el error y mandar un error.
            console.error("Error en getEventsCatById", error);
            throw error;
        }
    }

    // Método para crear una nueva categoría de evento.
    async createEventCategory(nameCat, display_order) {
        try {
            // Insertar una nueva categoría de evento en la base de datos.
            console.log("Estoy en event-category-repository");
            const query = "INSERT INTO event_categories (name, display_order) VALUES ($1, $2) RETURNING *";
            const values = [nameCat, display_order];
            const respuesta = await client.query(query, values);
            return respuesta.rows[0];
        } catch (error) {
            // En caso de error, registrar el error y mandar un error.
            console.error("Error en createEventCategory", error);
            throw error;
        }
    }

    // Método para actualizar una categoría de evento existente.
    async updateEventCategory(id, nameCat, display_order) {
        try {
            // Actualizar la categoría de evento en la base de datos.
            const query = "UPDATE event_categories SET name = $1, display_order = $2 WHERE id = $3 RETURNING *";
            const values = [nameCat, display_order, id];
            const respuesta = await client.query(query, values);
            if (respuesta.rowCount > 0) {
                return respuesta.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            // En caso de error, registrar el error y mandar un error.
            console.error("Error en updateEventCategory", error);
            throw error;
        }
    }

    // Método para eliminar una categoría de evento por su ID.
    async deleteEventCategory(id) {
        try {
            // Eliminar la categoría de evento de la base de datos.
            const elementoBorrado = await this.getEventsCatById(id);
            const query = "DELETE FROM event_categories WHERE id = $1 RETURNING *";
            const values = [id];
            const respuesta = await client.query(query, values);
            if (respuesta.rowCount > 0) {
                return elementoBorrado;
            } else {
                return null;
            }
        } catch (error) {
            // En caso de error, registrar el error y mandar un error.
            console.error("Error en deleteEventCategory", error);
            throw error;
        }
    }
}
