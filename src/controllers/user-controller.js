import express from "express";
import { UserService } from "../service/user-service.js";

const router = express.Router();
const userService = new UserService();

// 6. Autenticacion de Usuarios

// inicio de sesión de usuarios.
router.post("/login", async (req,res)=>{
    // Obtener el nombre de usuario y la contraseña de la solicitud.
    const { username, password } = req.body;
    if(username && password){
        // Verificar el usuario y generar un token de autenticación.
        const token = await userService.verificacionUsuario(username, password);
        if(token){
            // Si el usuario se encuentra y se genera un token, devolver un mensaje de éxito con el token.
            return res.status(200).send({
                success: true,
                message: "User encontrado",
                token: token
            });
        }
        else{
            // Si el usuario no se encuentra o la contraseña es incorrecta, devolver un mensaje de error de autenticación.
            return res.status(401).send({
                success: false,
                message: "Username o contraseña invalido",
                token: ""
            });
        }
    }
    else{
        // Si no se proporciona nombre de usuario o contraseña, devolver un error de solicitud incorrecta.
        return res.status(400);
    }
});

// registro de nuevos usuarios.
router.post("/register", async (req, res) => {
    // Obtener los datos del nuevo usuario de la solicitud.
    const { first_name, last_name, username, password } = req.body;
    // Crear una nueva instancia de UserService.
    const userService = new UserService();
    // Verificar y crear el usuario utilizando los datos proporcionados.
    const crearUsuario = verificadorDeRegistro(first_name, last_name, username, password);
    if(crearUsuario === true){
        if(await userService.crearUsuario(first_name, last_name, username, password)){
            // Si se crea el usuario correctamente, devolver un mensaje de éxito con los datos del usuario.
            return res.status(201).send({
                id: 0,
                first_name: first_name,
                last_name: last_name,
                username: username,
                message: 'User registrado correctamente.',
            });
        } else {
            // Si el nombre de usuario ya existe, devolver un mensaje de error.
            return res.status(400).send("Ese Username ya existe");
        }    
    } else {
        // Si hay algún error en la verificación de los datos del usuario, devolver un mensaje de error correspondiente.
        return res.status(400).send(crearUsuario);
    }
});

// Función para verificar los datos del usuario durante el registro.
const verificadorDeRegistro = (first_name, last_name, username, password) => {
    // Funciona para validar el formato de correo electrónico.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!first_name || !last_name){
        // Verificar si se proporcionan el nombre y apellido.
        return "El nombre y apellido son obligatorios";
    }
    else if(!regex.test(username)){
        // Verificar si el formato de correo electrónico es válido.
        return "El formato de correo electrónico no es válido";
    }
    else if(password.length < 3){
        // Verificar si la contraseña tiene al menos 3 caracteres.
        return "La contraseña debe tener al menos 3 caracteres";
    }
    else{
        // Si todas las verificaciones son exitosas, devolver verdadero.
        return true;
    }
}

export default router;
