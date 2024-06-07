import { query } from "express";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";

const sql = "SELECT * FROM provinces";

const pagination = new Pagination();

const client = new pg.Client(config);
client.connect();

export class ProvinciasService {

    // Método para encontrar una provincia por su ID.
    async findProvByID(id) {
        let returnEntity = null;
        console.log("Estoy en: findProvByID");
        try {
            // Definir la consulta SQL para seleccionar una provincia por su ID.
            const query = {
                text: 'SELECT * FROM provinces WHERE id = $1',
                values: [id]
            };
            // Ejecutar la consulta SQL y obtener el resultado.
            const result = await client.query(query);
            // Asignar el resultado al objeto de retorno.
            returnEntity = result.rows; // No es necesario usar "[0]" ya que se espera un solo resultado.
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        // Retornar la provincia encontrada.
        return returnEntity;
    }

    // Método para encontrar las provincias paginadas.
    async findProvPaginated(limit, offset) {
        // Parsear el límite y el desplazamiento de la paginación.
        const parseLimit = pagination.parseLimit(limit);
        const parseOffset = pagination.parseOffset(offset);
        let returnEntity = null;
        console.log("Estoy en: findProvPaginated");
        try {
            // Definir la consulta SQL para seleccionar provincias con paginación.
            const query = {
                text: 'SELECT * FROM provinces LIMIT $1 OFFSET $2',
                values: [parseLimit, parseOffset]
            };
            // Ejecutar la consulta SQL y obtener el resultado.
            const result = await client.query(query);
            // Asignar el resultado al objeto de retorno.
            returnEntity = result.rows[0];
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        // Retornar las provincias con paginación.
        return returnEntity;
    }

    // Método para insertar una nueva provincia.
    async insertProvinceNew(name, full_name, latitude, longitude) {
        let insertedProvince = null;
        console.log(name, full_name, latitude, longitude)
        const query = {
            text: 'INSERT INTO provinces (name, full_name, latitude, longitude) VALUES ($1, $2, $3, $4)',
            values: [name, full_name, latitude, longitude],
        };
        try {
            // Ejecutar la consulta SQL para insertar una nueva provincia.
            const result = await client.query(query);
            // Asignar el resultado al objeto de retorno.
            insertedProvince = result.rows[0];
            console.log('Nueva provincia insertada:', insertedProvince);
        } catch (error) {
            console.error('Error al insertar nueva provincia:', error);
        }
        // Retornar la provincia insertada.
        return insertedProvince;
    }

    // Método para eliminar una provincia por su ID.
    async deleteProvince(id) {
        let deletedProvince = null;
        const query = {
            text: 'DELETE FROM provinces WHERE id = $1',
            values: [id],
        };
        try {
            // Ejecutar la consulta SQL para eliminar una provincia.
            const result = await client.query(query);
            // Asignar el resultado al objeto de retorno.
            deletedProvince = result.rows[0];
            console.log('Provincia eliminada:', deletedProvince);
        } catch (error) {
            console.error('Error al eliminar provincia:', error);
        }
        // Mandar un error si la provincia no se encontró.
        if (!deletedProvince) {
            throw new Error('Not Found');
        }
        // Retornar la provincia eliminada.
        return deletedProvince;
    }

    // Método para actualizar una provincia por su ID.
    async updateProvince(id, name, full_name, latitude, longitude) {
        let updatedProvince = null;
        const query = {
            text: 'UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4 WHERE id = $5',
            values: [name, full_name, latitude, longitude, id],
        };
        try {
            // Ejecutar la consulta SQL para actualizar una provincia.
            const result = await client.query(query);
            // Asignar el resultado al objeto de retorno.
            updatedProvince = result.rows[0];
            console.log('Provincia actualizada:', updatedProvince);
        } catch (error) {
            console.error('Error al actualizar provincia:', error);
        }
        // Mandar un error si la provincia no se encontró.
        if (!updatedProvince) {
            throw new Error('Not Found');
        }
        // Retornar la provincia actualizada.
        return updatedProvince;
    }

    // Método para encontrar ubicaciones por el ID de la provincia.
    async findLocationsByProvince(id) {
        let returnEntity = null;
        console.log("Estoy en: findLocationsByProvince");
        try {
            // Definir la consulta SQL para seleccionar ubicaciones por el ID de la provincia.
            const query = {
                text: 'SELECT * FROM locations WHERE id_province = $1',
                values: [id]
            };
            // Ejecutar la consulta SQL y obtener el resultado.
            const result = await client.query(query);
            console.log(result);
            // Asignar el resultado al objeto de retorno.
            returnEntity = result.rows;
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        // Retornar las ubicaciones encontradas.
        return returnEntity;
    }
}
