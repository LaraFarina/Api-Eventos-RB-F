import express from "express";
// import { JsonWebTokenError } from "jsonwebtoken";
import {UserService} from "../service/user-service.js";
const router = express.Router();
const userService = new UserService();

/* PUNTO 6: Autenticacion de Usuarios */
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Aquí puedes agregar la lógica para verificar el nombre de usuario y la contraseña con la base de datos
    const verificadorUsuario = userService.verificacionUsuario(username, password);
    if (!verificadorUsuario) {
        // Si la autenticación es exitosa, puedes enviar una respuesta con el estado 200
        // falta agregar aca TOKEN con JWT

        return res.status(200).send({
            id: 0,
            username: username,
            password: password,
        });
    }
});




router.post("/register", (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    const userService = new UserService();
    const crearUsuario = userService.crearUsuario(first_name, last_name, username, password);
    // Aquí puedes agregar la lógica para guardar el nuevo usuario en la base de datos
    if(crearUsuario = true){
        return res.status(201).send({
            id: 0,
            first_name: first_name,
            last_name: last_name,
            username: username,
            message: 'User registered successfully',
        });
    
    } else {
        return res.status(400).send({
            message: 'Error registering user',
        });
    }
});

export default router;

