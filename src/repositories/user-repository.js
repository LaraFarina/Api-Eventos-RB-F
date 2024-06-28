import pg from "pg";
import {config} from "./db.js"

import { createToken } from "../auth/jwt.js";

const client = new pg.Client(config);
client.connect();

export class UserRepository {
    async verificacionUsuario(username,password){
        try {
            const query = "SELECT id, username, password FROM users WHERE username = $1 AND password = $2"; 
            const values = [username, password];
            const respuesta = await client.query(query, values);
            if(respuesta){
                const token = createToken(respuesta.rows);
                console.log(token);
                return token;
            }
            else{
                return false;
            }
        }
        catch(error){
            console.log(error);
        }

    } 
    async crearUsuarioRep(first_name, last_name, username, password){
        try{
            const query = "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
            const values = [first_name, last_name, username, password];
            const respuesta = await client.query(query,values);
            return respuesta;
        }
        catch(error){
            console.log(error);
        }
    }
}




