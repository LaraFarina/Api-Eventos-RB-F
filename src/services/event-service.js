import { query } from "express";
import {EventRepository} from "../repositories/event-respository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";
const client = new pg.Client(config);
client.connect();


export class EventService {

    async getEventsByFilters(name, category, startDate, tag, limit, offset) {
        try {
            const eventRepository = new EventRepository();
            const events = await eventRepository.getEventsByFilters(name, category, startDate, tag, limit, offset);
            return events;
        } catch (error) {
            console.error("Error en getEventsByFilters de EventService:", error);
            throw new Error('Error al obtener eventos por filtros');
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
      // console.log(returnEntity);
    } catch (error) {
      console.log(error);
    }
    return returnEntity;
  }
  


  getParticipantesEvento(id, first_name, last_name, userName, attended, rating){
    if(attended || !attended) {
        return false;
    }
    var queryPrimero = "";
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
    if(rating){
      queryPrimero += ` AND event_enrollments.rating >= ${rating}`;
    }
    const eventRepository = new EventRepository();
    const resultadoGet =  eventRepository.getParticipantesEvento(id, queryPrimero);
    return resultadoGet;
  }
  postInscripcionEvento(id, id_user){
    const eventRepository = new EventRepository();
    const resultadoPost = eventRepository.postInscripcionEvento(id, id_user);
    return resultadoPost;
  }

  async deleteInscripcionEvento(id_event, id_user){
    let deleteInscipt;
    const query ={
      text: 'DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2 RETURNING *',
      values: [id_event, id_user],
    };
    try {
      const result = await client.query(query);
      deleteInscipt = result.rows[0];
      console.log('Inscripcion eliminada:', deleteInscipt);
    } catch (error) {
      console.error('Error al eliminar inscripcion:', error);
    }
    return deleteInscipt;
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

  async createEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user){
    let createEvent = null;
    const maxCapacity1 = 84567;
    
    const query = {
        text: 'INSERT INTO events (name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        values: [name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user], 
    };
    if(name === null || description === null || id_event_category === null || id_event_location === null || start_date === null || duration_in_minutes === null || price === null || enabled_for_enrollment === null || max_assistance === null || id_creator_user === null || max_assistance < maxCapacity1 || price < 0 || duration_in_minutes < 0){
      console.log('Bad Request')
      throw new Error('Bad Request');
      
    }
    try {
        const result = await client.query(query);
        createEvent = result.rows[0];
        console.log('Nuevo evento insertado:', createEvent);
    } catch (error) {
        console.error('Error al insertar nuevo evento:', error);
    }
   
    return createEvent;

  }
  async updateEvent(id, name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user){
    let updateEvent = null;
    const query = {
        text: 'UPDATE events SET name = $1, description = $2, id_event_category = $3, id_event_location = $4, start_date = $5, duration_in_minutes = $6, price = $7, enabled_for_enrollment = $8, max_assistance = $9, id_creator_user = $10 WHERE id = $11 RETURNING *',
        values: [name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, id],
    };
    try {
        const result = await client.query(query);
        updateEvent = result.rows[0];
        console.log('Evento actualizado:', updateEvent);
    } catch (error) {
        console.error('Error al actualizar evento:', error);
    }
    return updateEvent;
  }

  async deleteEvent(id){
    let registrosAfectados = 0;
    const query = {
        text: 'DELETE FROM events WHERE id = $1 RETURNING *',
        values: [id],
    };
    try {
        const result = await client.query(query);
        registrosAfectados = result.rowCount;
        console.log('rowCount:', registrosAfectados);
    } catch (error) {
        //console.error('Error al eliminar evento:', error);
    }
    return registrosAfectados;
  }




}

