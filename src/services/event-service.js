import { query } from "express";
import {EventRepository} from "../repositories/event-respository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
const sql = "SELECT * FROM events";
const client = new pg.Client(config);
client.connect();


export class EventService {

async getEventsByFilters(name, category, startDate, tag, pageSize, page) {
  try {
      const eventRepository = new EventRepository();
      const events = await eventRepository.getEventsByFilters(name, category, startDate, tag, pageSize, page);
      return events;
  } catch (error) {
      throw new Error('Error al obtener eventos a través de filtros');
  }
}



  async getEventById (id) {
    let returnEntity = null;
    console.log("Estoy en: getEventById");
    try {
      const query = {
        text: 'SELECT * FROM events WHERE id = $1',
        values: [id]
      };
      const result = await client.query(query);
      returnEntity = result.rows[0];
    } catch (error) {
      console.log(error);
    }
    return returnEntity;
  }
  


  getParticipantesEvento(id, first_name, last_name, userName, attended){
    if(attended || !attended) {
        return false;
    }
    var queryPrimero;
    if(first_name){
      queryPrimero += ` AND users.first_name = ${first_name}`;
    }    
    if(last_name){
      queryPrimero += ` AND users.last_name = ${last_name}`;
    }
    if(userName){
      queryPrimero += ` AND users.username = ${userName}`;
    }
    if(attended){
      queryPrimero += ` AND event_enrollments.attended = ${attended}`;
    }    
    const eventRepository = new EventRepository();
    const resultadoGet = eventRepository.getParticipantsEvent(id, queryPrimero);
    return resultadoGet;
  }
  postInscripcionEvento(id, id_user){
    const eventRepository = new EventRepository();
    const resultado = eventRepository.postInscripcionEvento(id, id_user);
    return resultado;
  }
  async patchEnrollment(rating, description, attended, observation, id_event, id_user){
    const enrollment={
      id_event: id_event,
      id_user: id_user,
      rating: rating,
      observation: observation,
      attended: attended,
      description: description,
    }
    const eventRepository = new EventRepository();
    const enrollmentResultado = eventRepository.patchEnrollment(enrollment);
    return enrollmentResultado;
  }

}