import pg from 'pg';
import { config } from "../repositories/db";

const { Client } = pg;
const client = new Client(config);

client.connect();

export class LocationRepository {
    constructor() {
        this.DBClient = client;
    }

    async getAllLocations(limit, offset) {
        const query = "SELECT * FROM locations LIMIT $1 OFFSET $2";
        const values = [limit, offset * limit];
        
        try {
            const result = await this.DBClient.query(query, values);
            const totalCountQuery = "SELECT COUNT(id) AS total FROM locations";
            const totalCount = await this.DBClient.query(totalCountQuery);
            return [result.rows, totalCount.rows[0].total];
        } catch (error) {
            console.error("Error fetching locations:", error);
            throw new Error("Error fetching locations");
        }
    }

    async getLocationById(id) {
        const query = "SELECT * FROM locations WHERE id = $1";
        
        try {
            const result = await this.DBClient.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching location with ID ${id}:`, error);
            throw new Error(`Error fetching location with ID ${id}`);
        }
    }

    async getEventLocationsByLocationId(limit, offset, id) {
        const locationQuery = "SELECT id FROM locations WHERE id = $1";
        const locationValues = [id];
        
        try {
            const locationResult = await this.DBClient.query(locationQuery, locationValues);
            
            if (locationResult.rowCount > 0) {
                const query = "SELECT * FROM event_locations WHERE id_location = $1 LIMIT $2 OFFSET $3";
                const values = [id, limit, offset * limit];
                const result = await this.DBClient.query(query, values);
                
                const totalCountQuery = "SELECT COUNT(id) AS total FROM event_locations WHERE id_location = $1";
                const totalCountValues = [id];
                const totalCount = await this.DBClient.query(totalCountQuery, totalCountValues);
                
                return [result.rows, totalCount.rows[0].total];
            } else {
                return [null, null];
            }
        } catch (error) {
            console.error(`Error fetching event locations for location ID ${id}:`, error);
            throw new Error(`Error fetching event locations for location ID ${id}`);
        }
    }
}
