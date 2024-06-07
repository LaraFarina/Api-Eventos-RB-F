import express, { Router, json, query } from "express";
import { EventLocationService } from "../service/event-location-service.js";
import { AuthMiddleware } from "../auth/authmiddleware.js";
const router = express.Router();
const eventLocationService = new EventLocationService();

router.get("/:id", AuthMiddleware, async (req, res) => {

    
    try {
        const location = await eventLocationService.findLocationByID(req.params.id);
        console.log("estoy en GET event-location-controller por id");
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
        // falta throw error de usuario no autenticado :p
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
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se ha encontrado la localización con el id proporcionado o el id de usuario no es el correcto ");
        }
    } catch(error){
        console.log("Error al eliminar evento");
        return res.json("Un Error");
    }
});





export default router;