import express, { Router, json, query } from "express";
import { EventLocationService } from "../service/event-location-service.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { Pagination } from "../utils/paginacion.js";

const router = express.Router();
const eventLocationService = new EventLocationService();
const pagination = new Pagination();
router.get("/", AuthMiddleware, async (req, res) => {
    const limit = pagination.parseLimit(req.query.limit);
    const offset = pagination.parseOffset(req.query.offset);
    const basePath = "api/event-location";

    try {
        const locations = await eventLocationService.getAllLocationsPaginated(limit, offset);
        const total = await eventLocationService.getLocationsCount();
        
        if (total != null) {
            const paginatedResponse = pagination.buildPaginationDto(limit, offset, total, req.path, basePath);
            return res.status(200).json({
                collection: locations,
                paginacion: paginatedResponse
            });
        } else {
            return res.status(404).json({ message: "No hay locaciones" });
        }
    } catch (error) {
        console.error("Error al obtener la localización:", error);
        return res.status(500).json("Ha ocurrido un error");
    }
});



router.get("/:id", AuthMiddleware, async (req, res) => {
    try {
        const location = await eventLocationService.findLocationByID(req.params.id);
        console.log(location);
        if (location) {
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se ha encontrado la localización con el id proporcionado");
        }
    }
    catch(error){
        console.log("Error al obtener la localización por ID");
        return res.json("Ha ocurrido un error");
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const id_location = req.body.id_location;
    const name = req.body.name;
    const full_address = req.body.full_address;
    const max_capacity = req.body.max_capacity;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const id_creator_user = req.user.id;
    try {
        const location = await eventLocationService.createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        console.log("estoy en POST event-location-controller");
        return res.status(200).json("Localización creada con éxito");
    }
    catch(error){
        console.log("Error al crear la localización");
        if(error.message === 'Bad Request'){
            return res.status(400).json({message:error.message})
        }
    }
});

router.put("/", AuthMiddleware, async (req, res) => {
    const id = req.body.id;
    const id_location = req.body.id_location;
    const name = req.body.name.trim();
    const full_address = req.body.full_address.trim();
    const max_capacity = req.body.max_capacity;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const id_user = req.user.id;

    try {
        const location = await eventLocationService.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user);
        if (location) {
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se ha encontrado la localización con el id proporcionado o el id de usuario no es el correcto ");
        }
    } catch (error) {
        console.log("Error al actualizar evento:", error);
        if (error.message === 'Bad Request') {
            return res.status(400).json({ message: error.message });
        }   
    }
});

router.delete("/:id", AuthMiddleware, async (req,res) =>{
    const id = req.params.id;
    const id_user = req.user.id;
    try{
        const location = await eventLocationService.deleteEventLocation(id,id_user)
        if (location) {
            return res.status(200).json({message: 'Eliminado correctamente'});
        } else {
            return res.status(404).json("No se ha encontrado la localización con el id proporcionado o el id de usuario no es el correcto ");
        }
    } catch(error){
        console.log("Error al eliminar evento");
        return res.json("Un Error");
    }
});





export default router;