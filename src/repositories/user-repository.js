import pg from "pg";
import { config } from "./db.js";
import { createToken } from "../auth/jwt.js";

// Crear un nuevo cliente de PostgreSQL utilizando la configuración de la base de datos.
const client = new pg.Client(config);
// Conectar el cliente a la base de datos.
client.connect();

// Crear una clase UserRepository para manejar operaciones relacionadas con usuarios.
export class UserRepository {
    // Método para verificar si las credenciales de usuario son válidas.
    async verificacionUsuario(username, password) {
        try {
            // Consultar en la tabla de usuarios para encontrar un usuario con el nombre de usuario y contraseña proporcionados.
            const query = "SELECT id, username, password FROM users WHERE username = $1 AND password = $2";
            const values = [username, password];
            // Ejecutar la consulta en la base de datos.
            const respuesta = await client.query(query, values);
            // Si se encuentra un usuario con las credenciales proporcionadas, crear un token JWT usando la función createToken.
            if (respuesta) {
                const token = createToken(respuesta.rows);
                console.log(token);
                return token;
            } else {
                return false; // Devolver falso si no se encuentra ningún usuario con las credenciales proporcionadas.
            }
        } catch (error) {
            console.log(error); // Manejar cualquier error que pueda ocurrir durante la consulta.
        }
    }

    // Método para crear un nuevo usuario en la base de datos.
    async crearUsuarioRep(first_name, last_name, username, password) {
        try {
            // Insertar un nuevo usuario en la tabla de usuarios con los datos proporcionados.
            const query = "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
            const values = [first_name, last_name, username, password];
            // Ejecutar la consulta en la base de datos.
            const respuesta = await client.query(query, values);
            return respuesta; // Devolver la respuesta de la inserción.
        } catch (error) {
            console.log(error); // Manejar cualquier error que pueda ocurrir durante la inserción.
        }
    }
}
