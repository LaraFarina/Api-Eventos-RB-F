import express, { json, query } from "express";
import { EventService } from "../service/event-service.js";
// import { EventRepository } from "../repositories/event-respository.js";
const router = express.Router();
const eventService = new EventService();

//Busqueda de un Evento


//PUNTO 2: LISTADO 
router.get("/", (req, res) => {
    const pageSize = req.query.pageSize;
    const page = req.query.page;
    const tag = req.query.tag;
    const startDate = req.query.startDate;
    const name = req.query.name;
    const category = req.query.category;
    
    try{
        const allEvents = eventService.getAllEvents(page, pageSize, tag, startDate, name, category, req.url);
        return res.json(allEvents);
    }catch(error){ 
        console.log("Error al buscar");
        return res.json("Error");
    }    
});

//PUNTO 3: BUSQUEDA DE EVENTO
// Busqueda de un evento
router.get("/event}", (req,res) => {
    const pageSize = req.query.pageSize;
    const page = req.query.page;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    var sqlQuery = `SELECT * FROM events LIMIT ${limit} OFFSET ${offset} WHERE id = ${req.params.id}`;
});


// Listado participantes
// router.get("/event/{id}", (req,res) => {
//     const pageSize = req.query.pageSize;
//     const page = req.query.page;
//     const offset = (page - 1) * pageSize;
//     const limit = pageSize;
//     var sqlQuery = `SELECT * FROM events LIMIT ${limit} OFFSET ${offset} WHERE id = ${req.params.id}`;
    



// });
router.get("/:id", (req, res) => {
    const pageSize = req.query.pageSize;
    const page = req.query.page;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const eventId = req.params.id;

    // Consulta SQL para obtener el detalle del evento y su localización completa
    const sqlQuery = ` SELECT e.*, l.*, p.* 
    FROM events e 
    JOIN event_locations el ON el.id = e.id_event_location
    JOIN locations l ON el.id_location = l.id 
    JOIN provinces p ON l.id_province = p.id  
    LIMIT 1 OFFSET 1`;
    
    res.json(sqlQuery);
    //falta agregar el que te haga la query
});


// PUNTO 5: LISTADO DE PARTICIPANTES DE UN EVENTO.
router.get("/{id}/enrollment", (req, res) => {
    const pageSize = req.query.pageSize;
    const page = req.query.page;
    const { first_name, last_name, username, attended } = req.query;


    res.send(filteredParticipants);
});


router.post("/{id}/enrollment", (req,res) => {
    const body = req.body;
    console.log(body);


    // aca van los eventos que se crean, se cargarian a la BD

});

// PUNTO 8: Creación, Edición, Eliminación de Eventos (CRUD)

router.get("/event", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const provinces = await pool.query(
      "SELECT * FROM events LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.json(provinces.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de servidor");
  }
});


router.post("/event", async (req, res) => {
  const { name, full_name, latitude, longitude, display_order } = req.body;
  try {
    const newProvince = await pool.query(
      "INSERT INTO events (name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING *",
      [name, full_name, latitude, longitude, display_order]
    );
    res.json(newProvince.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de servidor");
  }
});

router.put("/event/:id", async (req, res) => {
  const { id } = req.params;
  const { name, full_name, latitude, longitude, display_order } = req.body;
  try {
    const updatedProvince = await pool.query(
      "UPDATE events SET name = $1, description = $2, latitude = $3, longitude = $4, display_order = $5 WHERE id = $6 RETURNING *",
      [name, full_name, latitude, longitude, display_order, id]
    );
    res.json(updatedProvince.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de servidor");
  }
});

router.delete("/event/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    res.json("Evento eliminado");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de servidor");
  }
});

export default router;

