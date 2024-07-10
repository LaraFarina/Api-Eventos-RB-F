import express from "express";
import { UserService } from "../service/user-service.js";
import { User } from "../entities/user.js";
import { verifyLength } from "../utils/functions.js";

const router = express.Router();
const userService = new UserService();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!validarFormatoEmail(username)) {
        return res.status(400).send({
            success: false,
            message: "El email es inválido.",
            token: ""
        });
    } else {
        if (username && password) {
            const [success, token, statusCode, mensaje] = await userService.ValidarUsuario(username, password);
            return res.status(statusCode).send({
                success: success,
                message: mensaje,
                token: token
            });
        } else {
            return res.status(400).send("El nombre de usuario y la contraseña son obligatorios.");
        }
    }
});

router.post("/register", async (req, res) => {
    const user = new User(
        null,
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.password
    );

    const verificacion = user.verifyObject();
    if (verificacion !== true) {
        return res.status(400).send(verificacion);
    }

    if (!validarFormatoEmail(user.username)) {
        return res.status(400).send("El email es inválido.");
    }

    const mensaje = revisarCampos(user);
    if (mensaje !== null) {
        return res.status(400).send(mensaje);
    } else {
        const respuesta = await userService.ValidarRegistro(user);
        if (respuesta === true) {
            return res.status(201).send({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                message: 'Usuario registrado exitosamente',
            });
        } else {
            return res.status(400).send("Ya existe el nombre de usuario.");
        }
    }
});

const validarFormatoEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

const revisarCampos = (user) => {
    if (!verifyLength(user.first_name) || !verifyLength(user.last_name)) {
        return "El nombre y apellido deben tener al menos 3 caracteres";
    } else if (!verifyLength(user.password)) {
        return "La contraseña debe tener al menos 3 caracteres";
    }
    return null;
}

export default router;
