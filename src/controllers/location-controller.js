import express, { Router, json, query } from "express";
import { EventService } from "../service/event-service.js";
import { LocationService } from "../service/location-service.js";
import { AuthMiddleware } from "../auth/authmiddleware.js";
// import { EventRepository } from "../repositories/event-respository.js";
const router = express.Router();
const locationService = new LocationService();
// PUNTO 11: Locations
router.get("/", AuthMiddleware, async (req, res) => {
    // debe devolver todas las locations
    const url = req.originalUrl;
    try {
        const locations = await locationService.getAllLocations(url);
        return res.status(200).json(locations);
    } catch (error) {
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const location = await locationService.getLocationById(id);
        return res.status(200).json(location);
    } catch (error) {
        console.log("Error al buscar");
        if (error.message === "not found") {
            return res.status(404).json("Location not found");
        } else {
            return res.json("Un Error");
        }
    }
});

router.get("/:id/event-location", async (req, res) => {
    const id = req.params.id;
    try {
        const events = await locationService.getEventsLocationByLocations(id);
        return res.status(200).json(events);
    } catch (error) {
        console.log("Error al buscar");
         if(error === "not found"){
            return res.status(400).json("Not Found");
        } else{
            return res.json("Hubo un Error");
        }
    }
});

export default router;