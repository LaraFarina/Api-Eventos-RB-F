import pg from "pg";
import { DBConfig } from "./db.js.js";

const client = new pg.Client(DBConfig);
client.connect();

const sql = "SELECT * FROM events";
const respuesta = await client.query(sql);
