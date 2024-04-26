import express from "express";

const router = express.Router();

// 6. Autenticación de Usuarios

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const userService = new UserService();
    const verificarUsuario = userService.verificarUsuario(username, password);
    
    if (!verificarUsuario) {
       
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