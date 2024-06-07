import pg from "pg";
import { config } from "./db.js";

const client = new pg.Client(config);
client.connect();

export class EventCatRepository {
    async getEventsByFilters(name, category, startDate, tag, limit, offset) {
        console.log("Tag: ", tag);
        console.log("Category:", category);
        console.log("Name: ", name);
        console.log("startDate: ", startDate);

        let sqlQuery = "SELECT * FROM events WHERE 1=1";
        const queryParams = [];

        if (name) {
            sqlQuery += ` AND "name" ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${name}%`);
        }

        if (category) {
            const categoryIdQuery = `SELECT id FROM event_categories WHERE "name" = $1`;
            const { rows: categoryRows } = await client.query(categoryIdQuery, [category]);
            const categoryId = categoryRows[0]?.id;
            if (categoryId) {
                console.log("SOY UNA CATEGORIA Y EXISTO");
                sqlQuery += ` AND id_event_category = $${queryParams.length + 1}`;
                queryParams.push(categoryId);
            }
        }

        if (startDate) {
            sqlQuery += ` AND start_date::date = $${queryParams.length + 1}`;
            queryParams.push(startDate);
        }

        if (tag) {
            const tagIdQuery = `SELECT id FROM tags WHERE "name" = $1`;
            const { rows: tagRows } = await client.query(tagIdQuery, [tag]);
            const tagId = tagRows[0]?.id;
            if (tagId) {
                sqlQuery += ` AND id IN (SELECT id_event FROM event_tags WHERE id_tag = $${queryParams.length + 1})`;
                queryParams.push(tagId);
            }
        }

        // Agregar paginación utilizando limit y offset
        sqlQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        try {
            const { rows } = await client.query(sqlQuery, queryParams);
            return rows;
        } catch (error) {
            console.error("Error al ejecutar la consulta SQL:", error);
            throw new Error('Error al obtener eventos por filtros');
        }
    }


  async getEventsCatById(id) {
    try {
      console.log("Estoy en event-category-repository");
      const query = "SELECT name FROM event_categories WHERE id = $1";
      const values = [id];
      const respuesta = await client.query(query, values);
      return respuesta.rows[0];
    } catch (error) {
      console.error("Error en getEventsCatById", error);
      throw error;
    }
  }

  async createEventCategory(nameCat, display_order) {
    try {
      console.log("Estoy en event-category-repository");
      const query = "INSERT INTO event_categories (name, display_order) VALUES ($1, $2) RETURNING *";
      const values = [nameCat, display_order];
      const respuesta = await client.query(query, values);
      return respuesta.rows[0];
    } catch (error) {
      console.error("Error en createEventCategory", error);
      throw error;
    }
  }

  async updateEventCategory(id, nameCat, display_order) {
    try {
      console.log("Estoy en event-category-repository");
      const query = "UPDATE event_categories SET name = $1, display_order = $2 WHERE id = $3 RETURNING *";
      const values = [nameCat, display_order, id];
      const respuesta = await client.query(query, values);
      if (respuesta.rowCount > 0) {
        return respuesta.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error en updateEventCategory", error);
      throw error;
    }
  }

  async deleteEventCategory(id) {
    try {
      console.log("Estoy en event-category-repository");
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
      console.error("Error en deleteEventCategory", error);
      throw error;
    }
  }
}