import { query } from "express";
import {LocationRepository} from "../repositories/location-repository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";
const client = new pg.Client(config);
const pagination = new Pagination();
client.connect();

export class LocationService{
    async getAllLocations(url){
        let returnEntity = null;
        console.log("Estoy en: getAllLocations");
        try {
            const query = {
                text: 'SELECT * FROM locations',
            };
            const result = await client.query(query);
            console.log(result);
            const rows = result.rows;
            returnEntity = rows.length
        } catch (error) {
            console.log(error);
        }

        return returnEntity;
    }

    async getLocationById(id) {
        let returnEntity = null;
        console.log("Estoy en: getLocationById");
        try {
            const query = {
                text: 'SELECT * FROM locations WHERE id = $1',
                values: [id]
            };
            const result = await client.query(query);
            returnEntity = result.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error("Error al buscar la ubicación");
        }
        if (!returnEntity) {
            throw new Error("location not found");
        }
        return returnEntity;
    }

    async getEventsLocationByLocations(id, user_id) {
        let returnEntity = null;
        try {
            const query = {
                text: 'SELECT * FROM event_locations WHERE id = $1 AND id_creator_user = $2',
                values: [id, user_id]
            };
            const result = await client.query(query);
            returnEntity = result.rows;
        } catch (error) {
            console.log(error);
            throw new Error("Error al buscar los eventos");
        }
        if (returnEntity.length === 0) {
            throw new Error("events not found");
        }
        return returnEntity;
    }

    async findLocationsByProvince(id) {
        let locations = null;
      
        try {
          const selectQuery = {
            text: 'SELECT * FROM locations WHERE id_province = $1',
            values: [id]
          };
          const selectResult = await client.query(selectQuery);
          locations = selectResult.rows;
        } catch (error) {
          console.error('Error al buscar localidades:', error);
          throw error;
        }
      
        return locations;  
      }
      
      async deleteLocationsByProvinceId(id) {
        let deletedLocationNames = null;
      
        try {
          const deleteQuery = {
            text: 'DELETE FROM locations WHERE id_province = $1 RETURNING name',
            values: [id]
          };
          const result = await client.query(deleteQuery);
          deletedLocationNames = result.rows.map(row => row.name);
        } catch (error) {
          console.error('Error al eliminar localidades:', error);
          throw error;
        }
      
        return deletedLocationNames;  
      }

      async findLocationsPaginated(limit, offset){
        let returnEntity = null;
        try {
          const query = {
            text: 'SELECT * FROM locations LIMIT $1 OFFSET $2',
            values: [limit, offset]
          };
          const result = await client.query(query);
          returnEntity = result.rows; 
          console.log(result);
        } catch (error) {
          console.log(error);
        }
        return returnEntity;
    }

}