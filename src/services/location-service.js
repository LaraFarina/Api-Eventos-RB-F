import { query } from "express";
import { LocationRepository } from "../repositories/location-repository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";

const client = new pg.Client(config);
client.connect();

export class LocationService {

    // Método para obtener todas las ubicaciones.
    async getAllLocations(url) {
        let returnEntity = null;
        console.log("Estoy en: getAllLocations");
        try {
            // Definir la consulta SQL para seleccionar todas las ubicaciones.
            const query = {
                text: 'SELECT * FROM locations',
            };
            // Ejecutar la consulta SQL y obtener el resultado.
            const result = await client.query(query);
            console.log(result);
            // Asignar el resultado al objeto de retorno.
            returnEntity = result.rows;
            // Parsear el límite y el desplazamiento de la paginación.
            const limit = Pagination.ParseLimit(15);
            const offset = Pagination.ParseOffset(0);
            // Construir la paginación.
            returnEntity = Pagination.BuildPagination(returnEntity, limit, offset, url, returnEntity.length);
        } catch (error) {
            console.log(error);
        }
        // Retornar las ubicaciones con paginación.
        return returnEntity;
    }

    // Método para obtener una ubicación por su ID.
    async getLocationById(id) {
        let returnEntity = null;
        console.log("Estoy en: getLocationById");
        try {
            // Definir la consulta SQL para seleccionar una ubicación por su ID.
            const query = {
                text: 'SELECT * FROM locations WHERE id = $1',
                values: [id]
            };
            // Ejecutar la consulta SQL y obtener el resultado.
            const result = await client.query(query);
            // Asignar el resultado al objeto de retorno.
            returnEntity = result.rows[0];
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        // Mandar un error si la ubicación no se encuentra.
        if (!returnEntity) {
            throw new Error("Not found");
        }
        // Retornar la ubicación encontrada.
        return returnEntity;
    }

    // Método para obtener los eventos de una ubicación por su ID.
    async getEventsLocationByLocations(id) {
    }
}
