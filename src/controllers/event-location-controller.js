import express, { Router, json, query } from "express";
import { EventLocationService } from "../service/event-location-service.js";
import { AuthMiddleware } from "../auth/authmiddleware.js";

const router = express.Router();
const eventLocationService = new EventLocationService();

// recibe un parámetro ID y utiliza el middleware de autenticación.
router.get("/:id", AuthMiddleware, async (req, res) => {
    try {
        // Buscar la localización por ID utilizando el servicio de localización de eventos.
        const location = await eventLocationService.findLocationByID(req.params.id);
        // Si se encuentra la localización, devolverla con un estado 200, de lo contrario, devolver un mensaje de error 404.
        if (location) {
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se ha encontrado la localización con el id proporcionado");
        }
    }
    catch(error){
        console.log("Ha ocurrido un error al intentar obtener la localización por ID");
        // En caso de error, devolver un mensaje genérico.
        return res.json("Ha ocurrido un error.");
    }
});

// utiliza el middleware de autenticación.
router.post("/", AuthMiddleware, async (req, res) => {
    // Obtener los datos de la solicitud.
    const id_location = req.body.id_location;
    const name = req.body.name;
    const full_address = req.body.full_address;
    const max_capacity = req.body.max_capacity;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const id_creator_user = req.user.id;
    try {
        // Crear una nueva localización de evento usando los datos proporcionados.
        const location = await eventLocationService.createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        console.log("estoy en POST event-location-controller");
        // Devolver un mensaje de éxito con un estado 200.
        return res.status(200).json("Localización creada con éxito");
    }
    catch(error){
        console.log("Error al crear la localización");
        // En caso de error, devolver un mensaje de error 400 si es un error de solicitud incorrecta.
        if(error.message === 'Bad Request'){
            return res.status(400).json({message:error.message})
        }
        // De lo contrario, no se maneja el error de usuario no autenticado.
    }
});

// utiliza el middleware de autenticación.
router.put("/", AuthMiddleware, async (req, res) => {
    // Obtener los datos de la solicitud.
    const id = req.body.id;
    const id_location = req.body.id_location;
    const name = req.body.name.trim();
    const full_address = req.body.full_address.trim();
    const max_capacity = req.body.max_capacity;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const id_user = req.user.id;

    try {
        // Actualizar la localización del evento utilizando los datos proporcionados.
        const location = await eventLocationService.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user);
        // Si se encuentra la localización, devolverla con un estado 200, de lo contrario, devolver un mensaje de error 404.
        if (location) {
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se ha encontrado la localización con el id proporcionado o el id de usuario no es el correcto ");
        }
    } catch (error) {
        console.log("Error al actualizar evento:", error);
        // En caso de error, devolver un mensaje de error 400 si es un error de solicitud incorrecta.
        if (error.message === 'Bad Request') {
            return res.status(400).json({ message: error.message });
        }   
    }
});

// recibe un parámetro ID y utiliza el middleware de autenticación.
router.delete("/:id", AuthMiddleware, async (req,res) =>{
    const id = req.params.id;
    const id_user = req.user.id;
    try{
        // Eliminar la localización del evento utilizando el ID proporcionado y el ID de usuario.
        const location = await eventLocationService.deleteEventLocation(id,id_user)
        // Si se encuentra la localización, devolverla con un estado 200, de lo contrario, devolver un mensaje de error 404.
        if (location) {
            return res.status(200).json(location);
        } else {
            return res.status(404).json("No se ha encontrado la localización con el id proporcionado o el id de usuario no es el correcto ");
        }
    } catch(error){
        // En caso de error, devuelve un mensaje genérico.
        return res.json("Ha ocurrido un error.");
    }
});

export default router;
