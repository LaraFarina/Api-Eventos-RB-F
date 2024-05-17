import pg from "pg";
import {config} from "./db.js"

const client = new pg.Client(config);
client.connect();

export class UserRepository {
    verificacionUsuario(username,password){
        var sqlQuery = `SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
        const values = client.query(sqlQuery);
        return values.rows;
    } 
    crearUsuario(first_name, last_name, username, password){
        var sqlQuery = `INSERT INTO users (first_name, last_name, username, password) VALUES (${first_name}, ${last_name}, ${username}, ${password})`;
        const values = client.query(sqlQuery);
        return values.rows;
    }
}




