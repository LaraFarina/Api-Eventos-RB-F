import pg from "pg";
import { config } from "./db.js"; 
import res from "express/lib/response.js";
import { EventRepository } from "./event-respository.js";

const client = new pg.Client(config);
client.connect();

export class EventLocationRepository{

    async getAllLocationsPaginated(limit, offset) {
        try {
            const query = {
                text: "SELECT * FROM event_locations LIMIT $1 OFFSET $2",
                values: [limit, offset]
            };
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error en getAllLocationsPaginated:", error);
            throw error;
        }
    }

    async getLocationsCount() {
        try {
            const query = "SELECT COUNT(*) FROM event_locations";
            const result = await client.query(query);
            return parseInt(result.rows[0].count, 10);
        } catch (error) {
            console.error("Error en getLocationsCount:", error);
            throw error;
        }
    }


    async findLocationByID(id){
        let returnEntity = null;
        try {
            const query = {
                text: "SELECT * FROM event_locations WHERE id = $1",
                values: [id]
            };
            const result = await client.query(query);
            returnEntity = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return returnEntity;
    }    

    async createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user){
        let returnEntity = null;
        if(name === null || full_address === null || name.length < 3 || full_address.length < 3 || max_capacity <= 0){
            throw new Error('Bad Request')
        } 
        try{
            const query={
                text:"INSERT INTO event_locations (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                values:[id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user]
            }
            console.log(id_location);
            const result = await client.query(query);
            returnEntity = result.rows[0];
            console.log("Nuevo Event-Location creado:", returnEntity);
        } catch(error){
            console.log(error);
        }
        return returnEntity;
    }



    async putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user) {
        
        if (!name || !full_address || name.length < 3 || full_address.length < 3 || max_capacity <= 0) {
            throw new Error('Bad Request');
        }

        try {
            const query = {
                text: "UPDATE event_locations SET id_location=$1, name=$2, full_address=$3, max_capacity=$4, latitude=$5, longitude=$6 WHERE id=$7 AND id_creator_user=$8 RETURNING *;",
                values: [id_location, name, full_address, max_capacity, latitude, longitude, id, id_user]
            };
            const result = await client.query(query);
            if (result.rowCount > 0) {
                console.log('Evento actualizado:', result.rows[0]);
                return result.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error en putEventLocation:", error);
            throw error;
        }
    }

    async deleteEventLocation(id,id_user){
        let returnEntity = null;
        
        try{
            const query = {
                text:"DELETE FROM event_locations WHERE id = $1 AND id_creator_user = $2",
                values:[id,id_user]
            }
            const result = await client.query(query);
            returnEntity = result.rowCount;
            console.log(returnEntity)
        } catch(error){
            console.error("Error en deleteEventLocation:", error);
            throw error;
        }
        return returnEntity;
    }







}