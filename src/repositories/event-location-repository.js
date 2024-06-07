import pg from "pg";
import { config } from "./db.js"; 
import res from "express/lib/response.js";
import { EventRepository } from "./event-respository.js";
// import { generarLimitOffset } from "../utils/paginaion.js";

const client = new pg.Client(config);
client.connect();

export class EventLocationRepository{

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
        // FALTA PONER UN THROW NEW ERROR SI EL USUARIO NO ESTA AUTENTICADO, PERO FALTA VER COMO SABER SI ESTA O NO AUTENTICADO.
        return returnEntity;
    }



    async putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user) {
        console.log("ESTOY EN EVENT-LOCATION-REPOSITORY");
        
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
            throw error; // Re-lanzar el error para que sea manejado en otro lugar
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
            // console.log(returnEntity)
            // if (result.rowCount > 0) {
            //     console.log('Evento actualizado:', result.rows[0]);
            //     return result.rows[0];
            // } else {
            //     return null;
            // }
        } catch(error){
            console.error("Error en deleteEventLocation:", error);
            throw error;
        }
        return returnEntity;
    }







}