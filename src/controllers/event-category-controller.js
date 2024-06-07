import express, { Router, json, query } from "express";
import { EventCatService } from "../service/event-category-service.js"; //ESTO TAMBIEN LO DEJAMOS ASI??
import { AuthMiddleware } from "../auth/authmiddleware.js";
import { Pagination } from "../utils/paginacion.js";
import e from "express";
// import { EventRepository } from "../repositories/event-respository.js";
const router = express.Router();
const eventCatService = new EventCatService(); //Esto lo dejamos asi??????
const pagination = new Pagination();


router.get("/", AuthMiddleware, async (req, res) => {
    const limit = pagination.parseLimit(req.query.limit);
    const offset = pagination.parseOffset(req.query.offset);
    const basePath = "api/event-category"
    console.log("El path: ", req.path);
  
    try {
      const eventos = await eventCatService.getAllEventsCat(limit, offset);
      console.log("Estoy en GET evento-category-controller");
      const total = eventos.pagination.total;
      const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);
      return res.status(200).json({
        eventos: eventos.collection,
        paginacion: paginatedResponse
      });
    } catch (error) {
      console.error("Error al obtener todas las categorías de eventos", error);
      return res.status(500).json({ error: "Ha ocurrido un error" });
    }
  });

router.get("/:id", async (req, res) => {
    try {
        const evento = await eventCatService.getEventsCatById(req.params.id);
        //Para comprobar si funciona el evento
        console.log("estoy en GET evento-category-controller por id");
        console.log(evento);
        if (evento != null) {
            return res.status(200).json(evento);
        } else {
            return res.status(404).json("No se ha encontrado la categoria de evento con el id proporcionado");

        }

    }
    catch(error){
        console.log("Error al obtener la categoria de evento por ID");
        return res.json("Ha ocurrido un error");
    }
});


router.post("/", async (req, res) => {

    try {
        const nameCat = req.body.nameCat.trim();
        const display = req.body.display_order;
        console.log(nameCat);
        console.log(display);

        if (nameCat.length < 3 || nameCat === "") {
            return res.status(400).json(`El nombre: '${nameCat}' está vacío o tiene menos de tres (3) letras.`);
        }
        
        const evento = await eventCatService.createEventCategory(nameCat, display);
        //Para comprobar si funciona el evento
        console.log("estoy en POST evento-category-controller");

         return res.status(200).json("Evento creado con éxito");
    }
    catch(error){
        console.log("Error al crear la categoria de evento");
        return res.status(404).json("Ha ocurrido un error");
    }
});


router.put("/", async (req, res) => {
    try {
        const id = req.body.id;
        const nameCat = req.body.nameCat.trim();
        const display = req.body.display_order;
        console.log(nameCat);
        console.log(display);

        if (nameCat.length < 3 || nameCat === "") {
            return res.status(400).json(`El nombre: '${nameCat}' está vacío o tiene menos de tres (3) letras.`);
        }
        
        const evento = await eventCatService.updateEventCategory(id, nameCat, display);
        //Para comprobar si funciona el evento
        console.log("estoy en POST evento-category-controller");

        if (evento === null)
        {
            const response = {
                message: "Evento actualizado con éxito",
                name: nameCat,
                display_order: display,
                id: id
            };
            return res.status(200).json(response);
        }
        else
        {
            return res.status(404).json(`ERROR 404: {id: ${id}} not found`);

        }        
    }
    catch(error){
        console.log("Error al crear la categoria de evento");
        return res.status(500).json("Ha ocurrido un error");
    }
});




router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const evento = await eventCatService.deleteEventCategory(id);
        //Para comprobar si funciona el evento
        console.log("estoy en DELETE evento-category-controller");
        console.log(evento);

        if (evento != null)
        {
            return res.status(200).json("evento eliminado con éxito: ", evento);
        }
        else
        {
            return res.status(404).json(`ERROR 404: {id: ${id}} not found`);

        }        
    }
    catch(error){
        console.log("Error al crear la categoria de evento");
        return res.status(500).json("Ha ocurrido un error");
    }
});















export default router;