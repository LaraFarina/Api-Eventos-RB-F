import pg from "pg";
import { config } from "./db.js"; 

const client = new pg.Client(config);
client.connect();


const sql = "SELECT * FROM events";
const respuesta = await client.query(sql);

//tercera parte de la travesia, aquí se ingresa la query y se obtiene la respuesta en rows
export class EventRepository{
    getAllEvents(name, category, startDate, tag, pageSize, requestedPage) {
        var sqlQuery = "SELECT * FROM events JOIN event_categories ON events.id_event_category = event_categories.id JOIN event_tags ON event_tags.id_event = events.id JOIN tags ON event_tags.id_tag = tags.id" + queryAgregado + `limit ${pageSize} offset ${requestedPage+1}"`; 
        const values = client.query(sqlQuery);
        return values.rows;
    }
    getEventByFilters(name, category, startDate, tag, limit, offset) {
        var sqlQuery = "SELECT * FROM events JOIN event_categories ON events.id_event_category = event_categories.id JOIN event_tags ON event_tags.id_event = events.id JOIN tags ON event_tags.id_tag = tags.id" + queryAgregado + `limit ${limit} offset ${offset+1}"`; 
        const values = client.query(sqlQuery);
        return values.rows;
    }
    getEventById(id) {
        var sqlQuery = `SELECT * FROM events WHERE id = ${id}`;
        const values = client.query(sqlQuery);
        return values.rows;
    }
    getParticipantesEvento(id, first_name, last_name, userName, attended) {
        var sqlQuery = `SELECT * FROM event_enrollment WHERE id_event = ${id}`;
        const values = client.query(sqlQuery);
        return values.rows;
    }
    postInscripcionEvento(id_event,id_user) { 
        var vectorValores = [id_event, id_user];
        var sqlQuery = `INSERT INTO event_enrollments(id_event,id_user,registration_date_time) VALUES ($1, $2) `;
        const values = client.query(sqlQuery, vectorValores);
        return values.rows;
    }

    



}