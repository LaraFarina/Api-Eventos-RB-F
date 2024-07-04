import express from "express";
import {UserService} from "../service/user-service.js";
import e from "express";
const router = express.Router();
const userService = new UserService();

/* PUNTO 6: Autenticacion de Usuarios */
router.post("/login", async (req,res)=>{
    const { username, password } = req.body;
    if(username && password){
        const token = await userService.verificacionUsuario(username, password);
        if(token){
            return res.status(200).send({
                success: true,
                message: "User Founded",
                token: token
            });
        }
        else{
            return res.status(401).send({
                success: false,
                message: "Username or password invalid",
                token: ""
            });
        }
    }
    else{
        return res.status(400);
    }
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    const userService = new UserService();
    const crearUsuario = verificadorDeRegistro(first_name, last_name, username, password);
    if(crearUsuario === true){
        if(await userService.crearUsuario(first_name, last_name, username, password)){
            return res.status(201).send({
                id: 0,
                first_name: first_name,
                last_name: last_name,
                username: username,
                message: 'User registered successfully',
            });
        } else {
            return res.status(400).send("Username ya existente");
        }    
    } else {
        return res.status(400).send(crearUsuario);
    }
});

const verificadorDeRegistro = (first_name, last_name, username, password) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!first_name || !last_name){
        return "El nombre y apellido son obligatorios";
    }
    else if(!regex.test(username)){
        return "El formato de correo electrónico no es válido";
    }
    else if(password.length < 3){
        return "La contraseña debe tener al menos 3 caracteres";
    }
    else{
        return true;
    }
}


export default router;

