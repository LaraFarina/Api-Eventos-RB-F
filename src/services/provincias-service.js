import { query } from "express";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../helpers/paginacion.js";
import { Locationservices } from "../services/location-service.js";
import { ProvinceRepository } from "../repositories/provincias-repository.js";

const client = new pg.Client(config);
const pagination = new Pagination();
const locationservices = new Locationservices();
const provinceRepository = new ProvinceRepository();
client.connect();

export class Provincesservices {
  
  async findProvByID(id) {
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
      throw new Error("Error al buscar provincia por ID");
    }
    return returnEntity;
  }

  async findProvPaginated(limit, offset) {
    let returnEntity = null;
    try {
      const query = {
        text: 'SELECT * FROM provinces LIMIT $1 OFFSET $2',
        values: [limit, offset]
      };
      const result = await client.query(query);
      returnEntity = result.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Error al buscar provincias paginadas");
    }
    return returnEntity;
  }

  async getAllProvinces() {
    let returnEntity = null;
    console.log("Estoy en: getAllProvinces");
    try {
      const query = {
        text: 'SELECT * FROM provinces',
      };
      const result = await client.query(query);
      const rows = result.rows;
      returnEntity = rows.length;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener todas las provincias");
    }
    return returnEntity;
  }

  async insertProvinceNew(name, full_name, latitude, longitude) {
    let insertedProvince = null;
    console.log(name, full_name, latitude, longitude);
    const query = {
      text: 'INSERT INTO provinces (name, full_name, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [name, full_name, latitude, longitude],
    };

    try {
      const result = await client.query(query);
      insertedProvince = result.rows[0];
      console.log('Nueva provincia insertada:', insertedProvince);
    } catch (error) {
      console.error('Error al insertar nueva provincia:', error);
      throw new Error('Error al insertar nueva provincia');
    }
    return insertedProvince;
  }

  async deleteProvince(id) {
    let deletedProvince = null;
    let deletedLocationNames = [];

    try {
      const locations = await locationservices.findLocationsByProvince(id);
      if (locations.length > 0) {
        console.log('Localidades encontradas:', locations);
        deletedLocationNames = await locationservices.deleteLocationsByProvinceId(id);
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
      text: 'UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4 WHERE id = $5 RETURNING *',
      values: [name, full_name, latitude, longitude, id],
    };

    try {
      const result = await client.query(query);
      const updatedProvince = result.rows[0];
      
      if (!updatedProvince) {
        throw new Error('No se encontró la provincia');
      }

      console.log('Provincia actualizada:', updatedProvince);
      return updatedProvince;
    } catch (error) {
      console.error('Error al actualizar provincia:', error);
      throw new Error('Error al actualizar provincia');
    }
  }

  async findLocationsByProvincePaginated(id, limit, offset) {
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
      throw new Error("Error al buscar localidades por provincia paginadas");
    }
    return returnEntity;
  }

  async getAllLocations(id) {
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
      throw new Error("Error al obtener todas las localidades por provincia");
    }
  }

  async createProvince(province) {
    const [verificacion, mensaje] = this.verificarProvince(province);
    if (verificacion) {
      const resultado = await this.bd.createProvince(province);
      return [resultado, null];
    } else {
      return [false, mensaje];
    }
  }

  async updateProvince(province) {
    const [verificacion, mensaje] = this.verificarProvince(province);
    if (verificacion) {
      const resultado = await this.bd.updateProvince(province);
      if (resultado > 0) {
        return [true, null];
      } else {
        return [false, null];
      }
    } else {
      return [false, mensaje];
    }
  }

  verificarProvince(province) {
    if (province.name !== undefined && province.name.length < 3) {
      return [false, "El campo name está vacío o tiene menos de tres (3) letras."];
    } else if (province.latitude !== undefined && isNaN(province.latitude) || province.longitude !== undefined && isNaN(province.longitude)) {
      return [false, "Los campos latitude y longitude no son números."];
    } else {
      return [true, null];
    }
  }

  async getAllProvinces(limit, offset, url) {
    const [provinces, totalCount] = await this.bd.getAllProvinces(limit, offset);
    return Pagination.BuildPagination(provinces, limit, offset, url, totalCount);
  }

  async getProvinceById(id) {
    const resultado = await this.bd.getProvinceById(id);
    return resultado;
  }

  async getLocationsByProvinceId(limit, offset, url, id) {
    const [locations, totalCount] = await this.bd.getLocationsByProvince(limit, offset, id);
    if (locations === null) {
      return null;
    }
    return Pagination.BuildPagination(locations, limit, offset, url, totalCount);
  }
}
