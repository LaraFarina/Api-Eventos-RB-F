import { query } from "express";
import {EventRepository} from "../repositories/event-respository.js";

export class EventService {
  getAllEvents(name, category, startDate, tag, pageSize, requestedPage) {
    if(name){
      queryAgregado += ` WHERE name = ${name}`;
    }
    if(category){
      if(queryAgregado.includes("WHERE")){
        queryAgregado += ` AND event_categories.name = ${category}`;
      } else {
        queryAgregado += ` WHERE event_categories.name = ${category}`;
      }
    }
    if(startDate){
      if(queryAgregado.includes("WHERE")){
        queryAgregado += ` AND startDate = ${startDate}`;
      } else {
        queryAgregado += ` WHERE startDate = ${startDate}`;
      }
    }    
    if(tag){
      if(queryAgregado.includes("WHERE")){
        queryAgregado += ` AND event_tags.name = ${tag}`;
      } else {
        queryAgregado += ` WHERE event_tags.name = ${tag}`;
      }
    }
    const eventRepository = new EventRepository(); 
    const resultadoGet = eventRepository.getAllEvents(name, category, startDate, tag, pageSize, requestedPage); 
    return {
      query: queryAgregado,
      pageSize: pageSize,
      requestedPage: requestedPage, 
      nextPag
    }; //faltaria modificar el return para que muestre los parametros
  }
  getEventByFilters(name, category, startDate, tag, limit, offset) {
    if (!name && !category && !startDate && !tag) {
        throw new Error('Se necesita al menos un filtro para buscar eventos');
    }
    var queryAgregado;
    //tiene el 1=1 para que no haya dificultades con los and's que se le agregan (asi tenemos menos if's y es mas facil de leer)
    if(name){
        queryAgregado += ` AND name = '${name}'`;
    }
    if(category){
      queryAgregado += ` AND category = '${category}'`;
    }
    if(startDate){
      queryAgregado += ` AND startDate = '${startDate}'`;
    }
    if(tag){
      queryAgregado += ` AND tag = '${tag}'`;
    }

    const eventRepository = new EventRepository();
    const resultadoGet = eventRepository.getEventByFilters(name, category, startDate, tag, pageSize, requestedPage, limit, offset); 
    return {
      query: queryAgregado,
      pageSize: pageSize,
      requestedPage: requestedPage, 
      nextPage: requestedPage + 1,
    };
}
  getEventByID(id) {
    const eventRepository = new EventRepository();
    const resultadoGet = eventRepository.getEventByID(id);
    return resultadoGet;
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
    const resultadoPost = eventRepository.postInscripcionEvento(id, id_user);
    return resultadoPost;
  }


}