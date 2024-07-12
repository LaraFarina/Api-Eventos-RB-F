import pg from 'pg';
import { config } from "../repositories/db";
import { createToken } from '../src/auth/jwt.js'; 

const { Client } = pg;
const client = new Client(config);

client.connect();

export class UserRepository {
    constructor() {
        this.DBClient = client;
    }

    async verificacionUsuario(username, password) {
        try {
            const query = "SELECT id, username, password FROM users WHERE username = $1 AND password = $2"; 
            const values = [username, password];
            const respuesta = await this.DBClient.query(query, values);
            if (respuesta.rowCount > 0) {
                const token = createToken(respuesta.rows);
                console.log(token);
                return token;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error verifying user:", error);
            throw new Error("Error verifying user");
        }
    }

    async crearUsuarioRep(first_name, last_name, username, password) {
        try {
            const query = "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
            const values = [first_name, last_name, username, password];
            const respuesta = await this.DBClient.query(query, values);
            return respuesta;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Error creating user");
        }
    }

    async getUser(username, password) {
        try {
            const query = "SELECT id, username, password FROM users WHERE username = $1 AND password = $2"; 
            const values = [username, password];
            const respuesta = await this.DBClient.query(query, values);
            if (respuesta.rowCount > 0) {
                const token = createToken(respuesta.rows);
                console.log(token);
                return [true, token, 200, "Usuario encontrado"];
            } else {
                return [false, "", 401, "Usuario o clave inválida."];
            }
        } catch (error) {
            console.error("Error getting user:", error);
            throw new Error("Error getting user");
        }
    }

    async validateUsername(user) {
        try {
            let query = "SELECT * FROM users WHERE username = $1";
            let values = [user.username];
            let respuesta = await this.DBClient.query(query, values);
            if (respuesta.rowCount > 0) {
                return false;
            } else {
                query = "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
                values = [user.first_name, user.last_name, user.username, user.password];
                respuesta = await this.DBClient.query(query, values);
                return true;
            }
        } catch (error) {
            console.error("Error validating username:", error);
            throw new Error("Error validating username");
        }
    }
}
