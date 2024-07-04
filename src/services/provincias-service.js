import { query } from "express";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";
import { LocationService} from "../service/location-service.js";

const pagination = new Pagination();
const client = new pg.Client(config);
const locationService = new LocationService();
client.connect();
export class ProvinciasService {


    async findProvByID (id) {
        let returnEntity = null;
        console.log("Estoy en: findProvByID");
        try {
          const query = {
            text: 'SELECT * FROM provinces WHERE id = $1',
            values: [id]
          };
          const result = await client.query(query);
          returnEntity = result.rows[0];

        } catch (error) {
          console.log(error);
        }
        return returnEntity;
    }


    
    async findProvPaginated (limit, offset) {
        let returnEntity = null;
        try {
          const query = {
            text: 'SELECT * FROM provinces LIMIT $1 OFFSET $2',
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

    async getAllProvinces () {
   let returnEntity = null;
      console.log("Estoy en: getAllProvinces");
      try {
        const query = {
          text: 'SELECT * FROM provinces',
        };
        const result = await client.query(query);
        const rows = result.rows;
        returnEntity = rows.length
      } catch (error) {
        console.log(error);
      }
      return returnEntity;
  }

    async insertProvinceNew(name, full_name, latitude, longitude){
        let insertedProvince = null;
        console.log(name, full_name, latitude, longitude)
        const query = {
            text: 'INSERT INTO provinces (name, full_name, latitude, longitude) VALUES ($1, $2, $3, $4)',
            values: [name, full_name, latitude, longitude],
        };
    
        try {
            const result = await client.query(query);
            insertedProvince = result.rows[0];
            console.log('Nueva provincia insertada:', insertedProvince);
        } catch (error) {
            console.error('Error al insertar nueva provincia:', error);
        }
        return insertedProvince;
    }

async deleteProvince(id) {
  let deletedProvince = null;
  let deletedLocationNames = [];

  try {
    const locations = await locationService.findLocationsByProvince(id);
    if (locations.length > 0) {
      console.log('Localidades encontradas:', locations);
      deletedLocationNames = await locationService.deleteLocationsByProvinceId(id);
      console.log('Localidades eliminadas:', deletedLocationNames);
    }
    const deleteQuery = {
      text: 'DELETE FROM provinces WHERE id = $1 RETURNING *',
      values: [id]
    };
    const result = await client.query(deleteQuery);
    deletedProvince = result.rows[0];

    console.log('Provincia eliminada:', deletedProvince);
  } catch (error) {
    console.error('Error al eliminar provincia:', error);
    throw error; 
  }

  return {
    province: deletedProvince,
    deletedLocationNames: deletedLocationNames
  }; 
}


  

async updateProvince(id, name, full_name, latitude, longitude) {
  const query = {
      text: 'UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4 WHERE id = $5',
      values: [name, full_name, latitude, longitude, id],
  };

  try {
      const result = await client.query(query);
      
      if (result.rowCount === 0) {
          throw new Error('Not Found');
      }

      console.log('Provincia actualizada:', { id, name, full_name, latitude, longitude });
      return { id, name, full_name, latitude, longitude };
  } catch (error) {
      console.error('Error al actualizar provincia:', error);
      throw error;
  }
}

    async findLocationsByProvincePaginated(id, limit, offset){
        let returnEntity = null;
        console.log("Estoy en: findLocationsByProvincePaginated");
        try {
          const query = {
            text: 'SELECT * FROM locations WHERE id_province = $1 LIMIT $2 OFFSET $3',
            values: [id, limit, offset]
          };
          const result = await client.query(query);

          returnEntity = result.rows;

        } catch (error) {
          console.log(error);
        }
        return returnEntity;

    }

    async getAllLocations(id){

      let returnEntity = null;
      console.log("Estoy en: findLocationsByProvince");
      try {
        const query = {
          text: 'SELECT * FROM locations WHERE id_province = $1',
          values: [id]
        };
        const result = await client.query(query);
        console.log("Result", result);
    
        returnEntity = result.rows;
        returnEntity = returnEntity.length; 

    
        return returnEntity;
      } catch (error) {
        console.log(error);
      }
      return returnEntity;

  }

}

