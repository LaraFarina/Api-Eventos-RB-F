import { query } from "express";
import { LocationRepository } from "../repositories/location-repository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";

const client = new pg.Client(config);
client.connect();

export class LocationService {
    constructor() {
        this.bd = new LocationRepository();
    }

    async getAllLocations(offset, limit, url) {
        try {
            const [locations, totalCount] = await this.bd.getAllLocations(limit, offset);
            return Pagination.BuildPagination(locations, limit, offset, url, totalCount);
        } catch (error) {
            console.error("Error en getAllLocations:", error);
            throw new Error("Error al obtener todas las ubicaciones");
        }
    }

    async getLocationById(id) {
        try {
            const location = await this.bd.getLocationById(id);
            if (!location) {
                throw new Error("Location not found");
            }
            return location;
        } catch (error) {
            console.error("Error en getLocationById:", error);
            throw new Error("Error al obtener la ubicación por ID");
        }
    }

    async getEventLocationsByIdLocation(limit, offset, url, id) {
        try {
            const [event_locations, totalCount] = await this.bd.getEventLocationsByLocationId(limit, offset, id);
            return Pagination.BuildPagination(event_locations, limit, offset, url, totalCount);
        } catch (error) {
            console.error("Error en getEventLocationsByIdLocation:", error);
            throw new Error("Error al obtener los eventos por ID de ubicación");
        }
    }

    async findLocationsByProvince(id) {
        try {
            const locations = await this.bd.findLocationsByProvince(id);
            return locations;
        } catch (error) {
            console.error('Error en findLocationsByProvince:', error);
            throw new Error('Error al buscar localidades por provincia');
        }
    }

    async deleteLocationsByProvinceId(id) {
        try {
            const deletedLocationNames = await this.bd.deleteLocationsByProvinceId(id);
            return deletedLocationNames;
        } catch (error) {
            console.error('Error en deleteLocationsByProvinceId:', error);
            throw new Error('Error al eliminar localidades por ID de provincia');
        }
    }

    async findLocationsPaginated(limit, offset) {
        try {
            const locations = await this.bd.findLocationsPaginated(limit, offset);
            return locations;
        } catch (error) {
            console.error('Error en findLocationsPaginated:', error);
            throw new Error('Error al buscar localidades paginadas');
        }
    }
}
