import { query } from "express";
import {EventLocationRepository} from "../repositories/event-location-repository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";
const client = new pg.Client(config);
client.connect();

export class EventLocationService{

    async getAllLocationsPaginated(limit, offset) {
        const eventLocationRepository = new EventLocationRepository();
        return await eventLocationRepository.getAllLocationsPaginated(limit, offset);
    }

    async getLocationsCount() {
        const eventLocationRepository = new EventLocationRepository();
        return await eventLocationRepository.getLocationsCount();
    }


    async findLocationByID(id){
        const eventLocationRepository = new EventLocationRepository();
        const location = await eventLocationRepository.findLocationByID(id);
        return location;
    }

    async createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user){
        const eventLocationRepository = new EventLocationRepository();
        const location = await eventLocationRepository.createEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user)
        return location;
    }

    async putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude,id_user){
        console.log("ESTOY EN EVENT-LOCATION-SERVICE");
        const eventLocationRepository = new EventLocationRepository();
        return await eventLocationRepository.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_user);
    }

    async deleteEventLocation(id,id_user){
        const eventLocationRepository = new EventLocationRepository();
        return await eventLocationRepository.deleteEventLocation(id,id_user);
    }

}