import { query } from "express";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { UserRepository } from "../repositories/user-repository.js";

const client = new pg.Client(config);
client.connect();

export class UserService {
    
    // Método para verificar el usuario mediante su nombre de usuario y contraseña.
    async verificacionUsuario(username, password) {
        // Crear una nueva instancia de UserRepository para acceder a los métodos relacionados con los usuarios.
        const userRepository = new UserRepository(); 
        // Llamar al método verificacionUsuario de UserRepository para verificar el usuario.
        const resultadoV = await userRepository.verificacionUsuario(username, password);
        // Retornar el resultado de la verificación.
        return resultadoV;
    }

    // Método para crear un nuevo usuario con su información básica.
    async crearUsuario(first_name, last_name, username, password) {
        // Crear una nueva instancia de UserRepository para acceder a los métodos relacionados con los usuarios.
        const userRepository = new UserRepository();
        // Llamar al método crearUsuarioRep de UserRepository para crear un nuevo usuario.
        const resultadoC = await userRepository.crearUsuarioRep(first_name, last_name, username, password);
        // Retornar el resultado de la creación del usuario.
        return resultadoC;
    }
}
