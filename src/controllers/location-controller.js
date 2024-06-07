import express, { Router, json, query } from "express";
import { EventService } from "../service/event-service.js";
import { LocationService } from "../service/location-service.js";
import { AuthMiddleware } from "../auth/authmiddleware.js";

const router = express.Router();
const locationService = new LocationService();

//  devuelve todas las ubicaciones utilizando el middleware de autenticación.
router.get("/", AuthMiddleware, async (req, res) => {
    // Obtener la URL original de la solicitud.
    const url = req.originalUrl;
    try {
        // Obtener todas las ubicaciones.
        const locations = await locationService.getAllLocations(url);
        // Devolver las ubicaciones con un estado 200.
        return res.status(200).json(locations);
    } catch (error) {
        console.log("Ha ocurrido un error al buscar");
        // En caso de error, devolver un mensaje genérico.
        return res.json("Ha ocurrido un error.");
    }
});

//  busca una ubicación por su ID.
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        // Buscar una ubicación por su ID.
        const location = await locationService.getLocationById(id);
        // Devolver la ubicación encontrada con un estado 200.
        return res.status(200).json(location);
    } catch (error) {
        console.log("Error al buscar");
        // Si la ubicación no se encuentra, devolver un mensaje de error 404, de lo contrario, devolver un mensaje genérico.
        if (error.message === "not found") {
            return res.status(404).json("Location not found");
        } else {
            return res.json("Ha ocurrido un error");
        }
    }
});

// busca eventos relacionados con una ubicación por su ID.
router.get("/:id/event-location", async (req, res) => {
    const id = req.params.id;
    try {
        // Obtener eventos relacionados con la ubicación por su ID.
        const events = await locationService.getEventsLocationByLocations(id);
        // Devolver los eventos encontrados con un estado 200.
        return res.status(200).json(events);
    } catch (error) {
        console.log("Error al buscar");
        // Si no se encuentran eventos relacionados, devolver un mensaje de error 400, de lo contrario, devolver un mensaje genérico.
         if(error === "not found"){
            return res.status(400).json("Not found");
        } else{
            return res.json("Ha ocurrido un error");
        }
    }
});

export default router;
