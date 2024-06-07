import pg from "pg";
import { config } from "./db.js"; 
import { EventRepository } from "./event-respository.js";

// Crear un nuevo cliente de PostgreSQL utilizando la configuración de la base de datos.
const client = new pg.Client(config);
// Conectar el cliente a la base de datos.
client.connect();

// Clase para manejar operaciones relacionadas con ubicaciones de eventos.
export class EventLocationRepository{
    // Método para encontrar una ubicación de evento por su ID.
    async findLocationByID(id){
        let returnEntity = null;
        try {
            // Consultar la ubicación de evento por su ID en la base de datos.
            const query = {
                text: "SELECT * FROM event_locations WHERE id = $1",
                values: [id]
            };
            const result = await client.query(query);
            returnEntity = result.rows[0];
        } catch (error) {
            // En caso de error, registrar el error y continuar.
            console.log(error);
        }
        return returnEntity;
    }    

    // Método para crear una nueva ubicación de evento.
    async createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user){
        let returnEntity = null;
        // Verificar si los campos obligatorios son nulos o no válidos.
        if(name === null || full_address === null || name.length < 3 || full_address.length < 3 || max_capacity <= 0){
            // Si alguno de los campos es nulo o no válido, mandar un error de solicitud incorrecta.
            throw new Error('Bad Request')
        } 
        try{
            // Insertar una nueva ubicación de evento en la base de datos.
            const query={
                text:"INSERT INTO event_locations (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                values:[id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user]
            }
            console.log(id_location);
            const result = await client.query(query);
            returnEntity = result.rows[0];
            console.log("Nuevo Event-Location creado:", returnEntity);
        } catch(error){
            // En caso de error, registrar el error y continuar.
            console.log(error);
        }
        return returnEntity;
    }

    // Método para actualizar una ubicación de evento existente.
    async putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user) {
        console.log("ESTOY EN EVENT-LOCATION-REPOSITORY");
        
        // Verificar si los campos obligatorios son nulos o no válidos.
        if (!name || !full_address || name.length < 3 || full_address.length < 3 || max_capacity <= 0) {
            // Si alguno de los campos es nulo o no válido, manda un error de solicitud incorrecta.
            throw new Error('Bad Request');
        }

        try {
            // Actualizar la ubicación de evento en la base de datos.
            const query = {
                text: "UPDATE event_locations SET id_location=$1, name=$2, full_address=$3, max_capacity=$4, latitude=$5, longitude=$6 WHERE id=$7 AND id_creator_user=$8 RETURNING *;",
                values: [id_location, name, full_address, max_capacity, latitude, longitude, id, id_user]
            };
            const result = await client.query(query);
            if (result.rowCount > 0) {
                // Si se actualiza la ubicación de evento correctamente, devolver la ubicación actualizada.
                console.log('Evento actualizado:', result.rows[0]);
                return result.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            // En caso de error, registrar el error y mandar un error.
            console.error("Error en putEventLocation:", error);
            throw error; // Mandar el error para que sea manejado en otro lugar
        }
    }

    // Método para eliminar una ubicación de evento por su ID.
    async deleteEventLocation(id,id_user){
        let returnEntity = null;
        
        try{
            // Eliminar la ubicación de evento de la base de datos.
            const query = {
                text:"DELETE FROM event_locations WHERE id = $1 AND id_creator_user = $2",
                values:[id,id_user]
            }
            const result = await client.query(query);
            returnEntity = result.rowCount;
        } catch(error){
            // En caso de error, registrar el error y mandar un error.
            console.error("Error en deleteEventLocation:", error);
            throw error;
        }
        return returnEntity;
    }
}
