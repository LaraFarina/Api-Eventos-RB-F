import pg from "pg";
import { config } from "./db.js";

const client = new pg.Client(config);
client.connect();

export class EventCatRepository {
  async getAllEventsCat(limit, offset) {
    console.log("Estoy en event-category-repository");
    try {
        const query = {
            text: 'SELECT * FROM event_categories LIMIT $1 OFFSET $2',
            values: [limit, offset]
        };
        const result = await client.query(query);
        const totalQuery = await client.query('SELECT COUNT(*) FROM event_categories');
        const total = parseInt(totalQuery.rows[0].count); // El total de eventos
        return {
            collection: result.rows,
            total: total
        };
    } catch (error) {
        console.error("Error al obtener todas las categorías de eventos", error);
        throw new Error('Error al obtener todas las categorías de eventos');
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