import express from "express";
const router = express.Router();
import { Pool } from 'pg';
// Acá iría la conexión a la base de datos
const pool = new Pool({

});

//6. Autenticacion de usuario
router.post("/user/register", async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    try {
      const newUser = await pool.query(
        "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, username, password]
      );
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error de servidor");
    }
  });
  router.post("/user/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await pool.query(
        "SELECT * FROM users WHERE username = $1 AND password = $2",
        [username, password]
      );
      if (user.rows.length === 0) {
        return res.status(401).json("Nombre de usuario o contraseña incorrectos");
      }
      const token = generateAuthToken(user.rows[0].id); 
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error de servidor");
    }
  });
  
  export default router;