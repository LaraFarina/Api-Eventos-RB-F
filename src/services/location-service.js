import { query } from "express";
import {LocationRepository} from "../repositories/event-respository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";
const client = new pg.Client(config);
client.connect();

export class LocationService{
    
}