import { query } from "express";
import {ProvinciasRepository} from "../repositories/event-respository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
const sql = "SELECT * FROM provinces";
const client = new pg.Client(config);
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
          console.log(result);
        } catch (error) {
          console.log(error);
        }
        return returnEntity;
    }
    async findProvPaginated (limit, offset) {
        let returnEntity = null;
        console.log("Estoy en: findProvPaginated");
        try {
          const query = 'SELECT * FROM provinces LIMIT $1 OFFSET $2'
            const values = [limit, offset]
          
          const result = await client.query(query, values);
          returnEntity = result.rows[0];
          console.log(result);
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

}