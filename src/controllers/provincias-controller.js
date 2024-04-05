import express from "express";
const router = express.Router();
import { Pool } from 'pg';
// Acá iría la conexión a la base de datos
const pool = new Pool({

});

//7. Crud de provincias
router.get("/provincias", async (req, res) => {
    try {
      const { page, limit } = req.query;
      const offset = (page - 1) * limit;
      const provinces = await pool.query(
        "SELECT * FROM provinces LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      res.json(provinces.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error de servidor");
    }
  });

  router.post("/provincias", async (req, res) => {
    const { name, full_name, latitude, longitude, display_order } = req.body;
    try {
      const newProvince = await pool.query(
        "INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, full_name, latitude, longitude, display_order]
      );
      res.json(newProvince.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error de servidor");
    }
  });
  
  router.put("/provincias/:id", async (req, res) => {
    const { id } = req.params;
    const { name, full_name, latitude, longitude, display_order } = req.body;
    try {
      const updatedProvince = await pool.query(
        "UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4, display_order = $5 WHERE id = $6 RETURNING *",
        [name, full_name, latitude, longitude, display_order, id]
      );
      res.json(updatedProvince.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error de servidor");
    }
  });
  
  router.delete("/provincias/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM provinces WHERE id = $1", [id]);
      res.json("Provincia eliminada");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error de servidor");
    }
  });
  
  export default router;