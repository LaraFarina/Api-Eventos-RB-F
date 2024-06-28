import pg from "pg";
import { config } from "./db.js"; 

const client = new pg.Client(config);
client.connect();

const sql = "SELECT * FROM events";
const respuesta = await client.query(sql);

export class LocationRepository{
    
}