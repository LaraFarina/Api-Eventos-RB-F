import { query } from "express";
import {EventCatRepository} from "../repositories/event-category-repository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";
const client = new pg.Client(config);
client.connect();


export class EventCatService {
    async getAllEventsCat(limit, offset) {
      console.log("Estoy en event-category-service");
      try {
        const eventCatRepository = new EventCatRepository();
        return await eventCatRepository.getAllEventsCat(limit, offset);
      } catch (error) {
        console.error("Error al obtener eventos por filtros", error);
        throw new Error('Error al obtener eventos por filtros');
      }
    }
  


   async getEventsCatById(id){
                //Habrá que añadir el middleware
                console.log("Estoy en GET event-category-service")
                try {
                    const eventCatRepository = new EventCatRepository();
                    const respuesta = await eventCatRepository.getEventsCatById(id);
                    // console.log("Estoy en:  DE event-category-service", events);
                    return respuesta;
                } catch (error) {
                    throw new Error('Error al obtener eventos por filtros');
                }      
    }


    async createEventCategory(nameCat, display_order){

        try {
            console.log("Estoy en POST event-category-service")
            const eventCatRepository = new EventCatRepository();
            const respuesta = await eventCatRepository.createEventCategory(nameCat, display_order);
            return respuesta;
        } catch (error) {
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    async updateEventCategory(id, nameCat, display_order){
            
            try {
                console.log("Estoy en PUT event-category-service")
                const eventCatRepository = new EventCatRepository();
                const respuesta = await eventCatRepository.updateEventCategory(id, nameCat, display_order);
                return respuesta;
            } catch (error) {
                throw new Error('Error al obtener eventos por filtros');
            }
    }


    async deleteEventCategory(id){
            
            try {
                console.log("Estoy en DELETE event-category-service")
                const eventCatRepository = new EventCatRepository();
                const respuesta = await eventCatRepository.deleteEventCategory(id);
                return respuesta;
            } catch (error) {
                throw new Error('Error al obtener eventos por filtros');
            }
    }

}