import express from "express";

const router = express.Router();

// PUNTO 6:  Autenticación de Usuarios

router.get("/user/login", (req, res) => {
    const body = req.body;
    console.log(body);
    return res.status(201).send({
        id:1,
        username: body.username,
        password: body.password,
    });

});


router.post("/user/register", (req, res) => {
    const body = req.body;
    console.log(body);
    return res.status(201).send({
        id: 1,
        first_name: body.first_name,
        last_name: body.last_name,
        username: body.username,
        password: body.password,
    });
    //requiere first_name, last_name, username, password
    // aca van los usuarios que se crean, se guardarian a la BD
});



export default router;