import {EventRepository} from "../repositories/event-respository.js";

export class EventService {
  getAllEvents(name, category, startDate, tag, pageSize, requestedPage) {
    const eventRepository = new EventRepository(); 
    //aqui inicia la segunda parte de la travesia, donde se ingresan los datos y se obtiene la respuesta
    const [events, allevents] = eventRepository.getAllEvents(name, category, startDate, tag, pageSize, requestedPage); 
    var queryPrimero = "SELECT * FROM events";
    if(name){
      queryPrimero += ` WHERE name = ${name}`;
    }
    if(category){
      queryPrimero += `INNER JOIN event_categories ON event.id_event_category = event_categories.id`;
      if(queryPrimero.includes("WHERE")){
        queryPrimero += ` AND event_categories.name = ${category}`;
      } else {
        queryPrimero += ` WHERE event_categories.name = ${category}`;
      }
    }
    if(startDate){
      if(queryPrimero.includes("WHERE")){
        queryPrimero += ` AND startDate = ${startDate}`;
      } else {
        queryPrimero += ` WHERE startDate = ${startDate}`;
      }
    }    
    if(tag){
      queryPrimero += `INNER JOIN event_tags ON event.id_event_tag = event_tags.id`;
      if(queryPrimero.includes("WHERE")){
        queryPrimero += ` AND event_tags.name = ${tag}`;
      } else {
        queryPrimero += ` WHERE event_tags.name = ${tag}`;
      }
    }
    
    return {
      collection: "query",
      pagination: {
        limit: pageSize,
        offset: requestedPage,
        nextPage: "http://localhost:7777/event?limit=15&offset=1",
        total: "query2",
        name: name,
        category: category,
        startDate: startDate,
        tag: tag,
      },
    }; //faltaria modificar el return para que muestre los parametros
  }
}

