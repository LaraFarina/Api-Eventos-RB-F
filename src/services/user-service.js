import { query } from "express";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import {UserRepository} from "../repositories/user-repository.js";
const client = new pg.Client(config);
client.connect();


export class UserService {
    async verificacionUsuario(username, password){
        const userRepository = new UserRepository(); 
        const resultadoV = userRepository.verificacionUsuario(username, password);
        return resultadoV 
    }
    async crearUsuario(first_name, last_name, username, password){
        const userRepository = new UserRepository();
        const resultadoC = userRepository.crearUsuarioRep(first_name, last_name, username, password);
        return resultadoC;
    }


}

