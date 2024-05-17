import { query } from "express";
import {UserRepository} from "../repositories/user-repository.js";



export class UserService {
    verificacionUsuario(username, password){
        const userRepository = new UserRepository(); 
        return resultadoV = userRepository.verificacionUsuario(username, password);
    }
    crearUsuario(first_name, last_name, username, password){
        const userRepository = new UserRepository(); 
        return resultadoC = userRepository.crearUsuario(first_name, last_name, username, password);
    }

}

