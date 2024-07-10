import pg from 'pg';
import { config } from './db.js'; // Asumiendo que config es el objeto de configuración correcto
import { DBConfig } from './dbconfig.js';
import { makeUpdate } from '../src/utils/functions.js'; // Asumiendo la ruta correcta a makeUpdate

const { Client } = pg;
const client = new Client(config);

client.connect();

export class ProvinceRepository {
    constructor() {
        this.DBClient = client;
    }

    async createProvince(province) {
        try {
            const sql = "INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5)"; 
            const values = [province.name, province.full_name, province.latitude, province.longitude, province.display_order || null];
            const respuesta = await this.DBClient.query(sql, values);
            return respuesta.rowCount === 1;
        } catch (error) {
            console.error("Error creating province:", error);
            throw new Error("Error creating province");
        }
    }

    async deleteProvince(id) {
        try {
            let sql = "SELECT id FROM locations WHERE id_province = $1";
            let values = [id];
            const locationResult = await this.DBClient.query(sql, values);

            if (locationResult.rowCount > 0) {
                const locationIds = locationResult.rows.map(row => row.id);

                sql = "SELECT id FROM event_locations WHERE id_location = ANY($1)";
                const eventLocationResult = await this.DBClient.query(sql, [locationIds]);

                if (eventLocationResult.rowCount > 0) {
                    const eventLocationIds = eventLocationResult.rows.map(row => row.id);

                    sql = "UPDATE events SET id_event_location = null WHERE id_event_location = ANY($1)";
                    await this.DBClient.query(sql, [eventLocationIds]);
                }

                sql = "DELETE FROM event_locations WHERE id_location = ANY($1)";
                await this.DBClient.query(sql, [locationIds]);
            }

            sql = "DELETE FROM locations WHERE id_province = $1";
            await this.DBClient.query(sql, [id]);

            sql = "DELETE FROM provinces WHERE id = $1";
            const respuesta = await this.DBClient.query(sql, [id]);

            return respuesta.rowCount > 0;
        } catch (error) {
            console.error(`Error deleting province with ID ${id}:`, error);
            throw new Error(`Error deleting province with ID ${id}`);
        }
    }

    async updateProvince(province) {
        try {
            const [attributes, valuesSet] = makeUpdate(province, { id: province.id });

            let query;
            if (attributes.length > 0) {
                query = `UPDATE provinces SET ${attributes.join(', ')} WHERE id = $${valuesSet.length + 1}`;
            } else {
                query = `SELECT id FROM provinces WHERE id = $${valuesSet.length + 1}`;
            }

            const values = [...valuesSet, province.id];
            const respuesta = await this.DBClient.query(query, values);

            return respuesta.rowCount;
        } catch (error) {
            console.error(`Error updating province with ID ${province.id}:`, error);
            throw new Error(`Error updating province with ID ${province.id}`);
        }
    }

    async getAllProvinces(limit, offset) {
        try {
            const sql = "SELECT * FROM provinces LIMIT $1 OFFSET $2";
            const values = [limit, offset * limit];
            const result = await this.DBClient.query(sql, values);

            const totalCountQuery = "SELECT COUNT(id) AS total FROM provinces";
            const totalCount = await this.DBClient.query(totalCountQuery);

            return [result.rows, totalCount.rows[0].total];
        } catch (error) {
            console.error("Error fetching all provinces:", error);
            throw new Error("Error fetching all provinces");
        }
    }

    async getProvinceById(id) {
        try {
            const sql = "SELECT * FROM provinces WHERE id = $1";
            const values = [id];
            const result = await this.DBClient.query(sql, values);

            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching province with ID ${id}:`, error);
            throw new Error(`Error fetching province with ID ${id}`);
        }
    }

    async getLocationsByProvince(limit, offset, id) {
        try {
            const sql = "SELECT id FROM provinces WHERE id = $1";
            const values = [id];
            const exists = await this.DBClient.query(sql, values);

            if (exists.rows.length === 0) {
                return [null, 0];
            }

            const locationSql = "SELECT id, name, id_province, latitude, longitude FROM locations WHERE id_province = $1 LIMIT $2 OFFSET $3";
            const locationValues = [id, limit, offset * limit];
            const locationResult = await this.DBClient.query(locationSql, locationValues);

            const totalCountSql = "SELECT COUNT(id) AS total FROM locations WHERE id_province = $1";
            const totalCountValues = [id];
            const totalCountResult = await this.DBClient.query(totalCountSql, totalCountValues);

            return [locationResult.rows, totalCountResult.rows[0].total];
        } catch (error) {
            console.error(`Error fetching locations for province with ID ${id}:`, error);
            throw new Error(`Error fetching locations for province with ID ${id}`);
        }
    }
}
