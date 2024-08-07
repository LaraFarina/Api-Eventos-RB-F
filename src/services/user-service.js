import { query } from "express";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { UserRepository } from "../../repositories/user-repository.js";

const client = new pg.Client(config);
client.connect();

export class Userservices {
    constructor() {
        this.config = new UserRepository();
    }

    async verificacionUsuario(username, password) {
        const resultadoV = await this.config.verificacionUsuario(username, password);
        return resultadoV;
    }

    async crearUsuario(first_name, last_name, username, password) {
        const resultadoC = await this.config.crearUsuarioRep(first_name, last_name, username, password);
        return resultadoC;
    }

    async ValidarUsuario(username, password) {
        const [success, token, statusCode, mensaje] = await this.config.getUser(username, password);
        return [success, token, statusCode, mensaje];
    }

    async ValidarRegistro(user) {
        const resultado = await this.config.validateUsername(user);
        return resultado;
    }
}
