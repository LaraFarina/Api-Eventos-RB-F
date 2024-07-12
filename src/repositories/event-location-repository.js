import pg from 'pg';
import { config } from '../repositories/db';

const { Client } = pg;
const client = new Client(config);
client.connect();

export class EventLocationRepository {
    constructor() {
        this.DBClient = client;
    }

    async getAllEventLocations(userId, limit, offset) {
        try {
            const query = `SELECT * FROM event_locations WHERE id_creator_user = $1 LIMIT $2 OFFSET $3`;
            const result = await this.DBClient.query(query, [userId, limit, offset * limit]);

            const countQuery = `SELECT COUNT(id) AS total FROM event_locations WHERE id_creator_user = $1`;
            const totalCount = await this.DBClient.query(countQuery, [userId]);

            return [result.rows, parseInt(totalCount.rows[0].total)];
        } catch (error) {
            console.error('Error en getAllEventLocations:', error);
            throw error;
        }
    }

    async getEventLocationById(id, userId) {
        try {
            const query = `SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2`;
            const result = await this.DBClient.query(query, [id, userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en getEventLocationById:', error);
            throw error;
        }
    }

    async createEventLocation(eventLocation) {
        try {
            const checkLocationQuery = `SELECT * FROM locations WHERE id = $1`;
            const existsLocation = await this.DBClient.query(checkLocationQuery, [eventLocation.id_location]);

            if (existsLocation.rowCount > 0) {
                const insertQuery = `INSERT INTO event_locations (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
                const insertValues = [
                    eventLocation.id_location,
                    eventLocation.name,
                    eventLocation.full_address,
                    eventLocation.max_capacity,
                    eventLocation.latitude,
                    eventLocation.longitude,
                    eventLocation.id_creator_user
                ];
                const result = await this.DBClient.query(insertQuery, insertValues);
                return result.rowCount > 0;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error en createEventLocation:', error);
            throw error;
        }
    }

    async updateEventLocation(eventLocation) {
        try {
            const checkEventLocationQuery = `SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2`;
            const existsEventLocation = await this.DBClient.query(checkEventLocationQuery, [eventLocation.id, eventLocation.id_creator_user]);

            if (existsEventLocation.rowCount > 0) {
                const checkLocationQuery = `SELECT * FROM locations WHERE id = $1`;
                const existsLocation = await this.DBClient.query(checkLocationQuery, [eventLocation.id_location]);

                if (existsLocation.rowCount > 0) {
                    const [attributes, valuesSet] = makeUpdate(eventLocation, { "id": eventLocation.id, "id_creator_user": eventLocation.id_creator_user });

                    if (attributes.length > 0) {
                        const updateQuery = `UPDATE event_locations SET ${attributes.join(', ')} WHERE id = $${valuesSet.length + 1} AND id_creator_user = $${valuesSet.length + 2}`;
                        const updateValues = [...valuesSet, eventLocation.id, eventLocation.id_creator_user];
                        const result = await this.DBClient.query(updateQuery, updateValues);
                        return result.rowCount > 0;
                    } else {
                        return true; // No changes to update
                    }
                } else {
                    return [400, "El id_location es inexistente"];
                }
            } else {
                return [404, "El id del event_location es inexistente o no pertenece al usuario autenticado."];
            }
        } catch (error) {
            console.error('Error en updateEventLocation:', error);
            throw error;
        }
    }

    async deleteEventLocation(id, userId) {
        try {
            const deleteQuery = `DELETE FROM event_locations WHERE id = $1 AND id_creator_user = $2`;
            const result = await this.DBClient.query(deleteQuery, [id, userId]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error en deleteEventLocation:', error);
            throw error;
        }
    }
}
