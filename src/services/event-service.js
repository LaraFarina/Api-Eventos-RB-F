import { query } from "express";
import {EventRepository} from "../repositories/event-respository.js";
import pg from "pg";
import { config } from "../repositories/db.js"; 
import { Pagination } from "../utils/paginacion.js";
import res from "express/lib/response.js";
const client = new pg.Client(config);
client.connect();


export class EventService {


    async getEventsByFilters(name, category, startDate, tag, limit, offset) {
      try {
          const eventRepository = new EventRepository();
          const events = await eventRepository.getEventsByFilters(name, category, startDate, tag, limit, offset);

          const formattedEvents = events.map(event => ({
              id: event.id,
              name: event.name,
              description: event.description,
              event_category: {
                  id: event.id_event_category,
                  name: event.category_name
              },
              event_location: {
                  id: event.id_event_location,
                  name: event.event_location_name,
                  full_address: event.full_address,
                  latitude: event.event_location_latitude,
                  longitude: event.event_location_longitude,
                  max_capacity: event.event_location_max_capacity,
                  location: {
                      id: event.location_id,
                      name: event.location_name,
                      latitude: event.location_latitude,
                      longitude: event.location_longitude,
                      province: {
                          id: event.province_id,
                          name: event.province_name,
                          full_name: event.province_full_name,
                          latitude: event.province_latitude,
                          longitude: event.province_longitude,
                          display_order: event.province_display_order
                      }
                  }
              },
              start_date: event.start_date,
              duration_in_minutes: event.duration_in_minutes,
              price: event.price,
              enabled_for_enrollment: event.enabled_for_enrollment,
              max_assistance: event.max_assistance,
              creator_user: {
                  id: event.id_creator_user,
                  username: event.username,
                  first_name: event.first_name,
                  last_name: event.last_name
              },
              tags: event.tags ? event.tags.map(tag => ({
                  id: tag.id,
                  name: tag.name
              })) : []
          }));

          return formattedEvents;
      } catch (error) {
          console.error("Error en getEventsByFilters de EventService:", error);
          throw new Error('Error al obtener eventos por filtros');
      }
  }





  async getEventById(id) {
    try {
        const eventRepository = new EventRepository();
        const event = await eventRepository.getEventById(id);

        if (!event) {
            return null;
        }

        const formattedEvent = {
            id: event.id,
            name: event.name,
            description: event.description,
            event_category: {
                id: event.id_event_category,
                name: event.category_name
            },
            event_location: {
                id: event.id_event_location,
                name: event.event_location_name,
                full_address: event.full_address,
                latitude: event.event_location_latitude,
                longitude: event.event_location_longitude,
                max_capacity: event.event_location_max_capacity,
                location: {
                    id: event.location_id,
                    name: event.location_name,
                    latitude: event.location_latitude,
                    longitude: event.location_longitude,
                    province: {
                        id: event.province_id,
                        name: event.province_name,
                        full_name: event.province_full_name,
                        latitude: event.province_latitude,
                        longitude: event.province_longitude,
                        display_order: event.province_display_order
                    }
                }
            },
            start_date: event.start_date,
            duration_in_minutes: event.duration_in_minutes,
            price: event.price,
            enabled_for_enrollment: event.enabled_for_enrollment,
            max_assistance: event.max_assistance,
            creator_user: {
                id: event.id_creator_user,
                username: event.username,
                first_name: event.first_name,
                last_name: event.last_name
            },
            tags: event.tags ? event.tags.map(tag => ({
                id: tag.id,
                name: tag.name
            })) : []
        };

        return formattedEvent;
    } catch (error) {
        console.error("Error en getEventById de EventService:", error);
        throw new Error('Error al obtener el evento por ID');
    }
}


  
  async getAllEventsUnconfirmedName(name, category, startDate, tag) {
    try {
      const eventRepository = new EventRepository();
      const events = await eventRepository.getAllEventsUnconfirmedName(name, category, startDate, tag);
      return events;
  } catch (error) {
      console.error("Error en getEventsByFilters de EventService:", error);
      throw new Error('Error al obtener eventos por filtros');
  }
}


  async getParticipantesEvento(id, first_name, last_name, username, attended, rating) {
    if (attended) {
        return false;
    }

    let queryPrimero = "";
    const arrayParams = [id];

    if (first_name) {
        queryPrimero += " AND u.first_name = $" + (arrayParams.length + 1);
        arrayParams.push(first_name);
    }
    if (last_name) {
        queryPrimero += " AND u.last_name = $" + (arrayParams.length + 1);
        arrayParams.push(last_name);
    }
    if (username) {
        queryPrimero += " AND u.username = $" + (arrayParams.length + 1);
        arrayParams.push(username);
    }
    if (attended) {
        queryPrimero += " AND er.attended = $" + (arrayParams.length + 1);
        arrayParams.push(attended);
    }
    if (rating) {
        queryPrimero += " AND er.rating >= $" + (arrayParams.length + 1);
        arrayParams.push(rating);
    }

    const eventRepository = new EventRepository();
    const resultadoGet = await eventRepository.getParticipantesEvento(id, queryPrimero, arrayParams);
    return resultadoGet;
}


  async postInscripcionEvento(id_user, id_event){
    const eventRepository = new EventRepository();
    const resultadoPost = await eventRepository.postInscripcionEvento(id_user, id_event);
    return resultadoPost;
  }
  
  async isUserEnrolled(id_user, id_event) {
    const eventRepository = new EventRepository();
    const isEnrolled = await eventRepository.isUserEnrolled(id_user, id_event);
    return isEnrolled;
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
    const enrollmentResultado = await eventRepository.patchEnrollment(enrollment);
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
        text: "UPDATE events SET name = $1, description = $2, id_event_category = $3, id_event_location = $4, start_date = $5, duration_in_minutes = $6, price = $7, enabled_for_enrollment = $8, max_assistance = $9, id_creator_user = $10 WHERE id = $11 RETURNING *",
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
        console.error('Error al eliminar evento:', error);
    }
    return registrosAfectados;
  }



  async getEventEnrollment(id, userId) {
    let obtenerEnrollment = null;
    const query = {
      text:`SELECT ee.id, e.start_date FROM event_enrollments ee INNER JOIN events e ON ee.id_event = e.id WHERE ee.id_event = $1 AND ee.id_user = $2`,
      values: [id, userId]
    } 
    try{
      const result = await client.query(query);
      obtenerEnrollment = result.rows[0];
    } catch(error){
      console.log("errorrrrr", error)
    }
    return obtenerEnrollment;  
  }

async updateEventEnrollment(id_enrollment, rating, observations) {
  let updateEventEnrollment = null;  
  const query = {
    text: `UPDATE event_enrollments SET rating = $1, observations = $2 WHERE id = $3 RETURNING *`,
    values: [rating, observations, id_enrollment]
  };
  try{
    const result = await client.query(query);
    updateEventEnrollment = result.rows[0];
  } catch(error){
    console.error('Error', error)
  }
  return updateEventEnrollment;
}





}

