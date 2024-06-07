// Importar el módulo pg para interactuar con PostgreSQL y la configuración de la base de datos desde el archivo db.js.
import pg from "pg";
import { config } from "./db.js"; 

// Crear un nuevo cliente de PostgreSQL utilizando la configuración de la base de datos.
const client = new pg.Client(config);
// Conectar el cliente a la base de datos.
client.connect();

// Consultar todos los eventos en la tabla de eventos.
const sql = "SELECT * FROM events";
const respuesta = await client.query(sql);

// Crear una clase LocationRepository para manejar operaciones relacionadas con ubicaciones.
export class LocationRepository{
    
}
