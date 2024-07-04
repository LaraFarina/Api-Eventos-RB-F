import pg from "pg";
import { config } from "./db.js"; 

const client = new pg.Client(config);

client.connect();
console.log('config', config)

const sql = "SELECT * FROM events";
const respuesta = await client.query(sql);

export class EventRepository{


async getEventsByFilters(name, category, startDate, tag, limit, offset) {
    let sqlQuery = `
        SELECT 
            e.*, 
            ec.name as category_name, 
            el.name as event_location_name, 
            el.full_address, 
            el.latitude as event_location_latitude, 
            el.longitude as event_location_longitude, 
            el.max_capacity as event_location_max_capacity,
            loc.id as location_id,
            loc.name as location_name,
            loc.latitude as location_latitude,
            loc.longitude as location_longitude,
            prov.id as province_id,
            prov.name as province_name,
            prov.full_name as province_full_name,
            prov.latitude as province_latitude,
            prov.longitude as province_longitude,
            prov.display_order as province_display_order
        FROM events e
        LEFT JOIN event_categories ec ON e.id_event_category = ec.id
        LEFT JOIN event_locations el ON e.id_event_location = el.id
        LEFT JOIN locations loc ON el.id_location = loc.id
        LEFT JOIN provinces prov ON loc.id_province = prov.id
        WHERE 1=1`;

    if (name) {
        sqlQuery += ` AND e.name LIKE '%${name}%'`;
    }
    if (category) {
        const categoryIdQuery = `SELECT id FROM event_categories WHERE name = '${category}'`;
        const { rows: categoryRows } = await client.query(categoryIdQuery);
        const categoryId = categoryRows[0]?.id;
        if (categoryId) {
            sqlQuery += ` AND e.id_event_category = '${categoryId}'`;
        }
    }
    if (startDate) {
        sqlQuery += ` AND e.start_date::date = '${startDate}'::date`;
    }
    if (tag) {
        const tagIdQuery = `SELECT id FROM tags WHERE name = '${tag}'`;
        const { rows: tagRows } = await client.query(tagIdQuery);
        const tagId = tagRows[0]?.id;
        if (tagId) {
            sqlQuery += ` AND e.id IN (SELECT id_event FROM event_tags WHERE id_tag = '${tagId}')`;
        }
    }

    sqlQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
        const { rows } = await client.query(sqlQuery);
        return rows;
    } catch (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        throw new Error('Error al obtener eventos por filtros');
    }
}

async getEventById(id) {
    const sqlQuery = `
        SELECT 
            e.*, 
            ec.name as category_name, 
            el.name as event_location_name, 
            el.full_address, 
            el.latitude as event_location_latitude, 
            el.longitude as event_location_longitude, 
            el.max_capacity as event_location_max_capacity,
            loc.id as location_id,
            loc.name as location_name,
            loc.latitude as location_latitude,
            loc.longitude as location_longitude,
            prov.id as province_id,
            prov.name as province_name,
            prov.full_name as province_full_name,
            prov.latitude as province_latitude,
            prov.longitude as province_longitude,
            prov.display_order as province_display_order
        FROM events e
        LEFT JOIN event_categories ec ON e.id_event_category = ec.id
        LEFT JOIN event_locations el ON e.id_event_location = el.id
        LEFT JOIN locations loc ON el.id_location = loc.id
        LEFT JOIN provinces prov ON loc.id_province = prov.id
        WHERE e.id = $1`;

    try {
        const { rows } = await client.query({
            text: sqlQuery,
            values: [id]
        });
        return rows[0];
    } catch (error) {
        console.error("Error al ejecutar la consulta SQL:", error);
        throw new Error('Error al obtener el evento por ID');
    }
}


 async getAllEventsUnconfirmedName(name, category, startDate, tag, limit, offset) {



       let sqlQuery = "SELECT * FROM events WHERE 1=1";
       
       if (name) {
           sqlQuery += ` AND "name" LIKE '%${name}%'`;
        }
       if (category) {
           const categoryIdQuery = `SELECT id FROM event_categories WHERE "name" = '${category}'`;
           const { rows: categoryRows } = await client.query(categoryIdQuery);
           const categoryId = categoryRows[0]?.id;
           if (categoryId) {
               sqlQuery += ` AND id_event_category = '${categoryId}'`;
           }
       }
      if (startDate) {
           sqlQuery += ` AND start_date::date = '${startDate}'::date`;
       }
       if (tag) {
        const tagIdQuery = `SELECT id FROM tags WHERE "name" = '${tag}'`;
           const { rows: tagRows } = await client.query(tagIdQuery);
           const tagId = tagRows[0]?.id;
          if (tagId) {
                sqlQuery += ` AND id IN (SELECT id_event FROM event_tags WHERE id_tag = '${tagId}')`;
            }
        }

try {
const { rows } = await client.query(sqlQuery);
const length = rows.length;
console.log("length", length);
return length;
} catch (error) {
console.error("Error al ejecutar la consulta SQL:", error);
throw new Error('Error al obtener eventos por filtros');
}
}

    async getParticipantesEvento(id, queryPrimero, arrayParams) {
        let obtenerEventosParticipantes;
    
        const sqlQuery = {
            text: 'SELECT er.*, u.first_name, u.last_name, u.username, e.name ' +
                  'FROM event_enrollments er ' +
                  'LEFT JOIN users u ON er.id_user = u.id ' +
                  'LEFT JOIN events e ON er.id_event = e.id ' +
                  'LEFT JOIN event_tags et ON e.id = et.id_event ' +
                  'LEFT JOIN tags ON et.id = tags.id ' +
                  'WHERE e.id = $1' + queryPrimero,
            values: arrayParams
        };
    
        try {
            const result = await client.query(sqlQuery);
            obtenerEventosParticipantes = result.rows[0];
            console.log(obtenerEventosParticipantes);
        } catch (error) {
            console.error("error al obtener", error);
            throw error;  
        }
    
        return obtenerEventosParticipantes;
    }
    

    async postInscripcionEvento(id_user,id_event) { 
        let inscipcionEvento;
        const query = {
            text: `INSERT INTO event_enrollments(id_event,id_user) VALUES ($1, $2) `,
            values: [id_event, id_user],
        }
        try{
            console.log(id_event)
            const result = await client.query(query);
            inscipcionEvento = result.rows[0];
            console.log('Usuario Inscripto');
        } catch(error){
            console.error('Error al insertar usuario:', error)
        }
        return inscipcionEvento;
    }
    

    async isUserEnrolled(id_user, id_event) { 
        let isEnrolled = false;
        const query = {
            text: `SELECT COUNT(*) FROM event_enrollments WHERE id_user = $1 AND id_event = $2`,
            values: [id_user, id_event],
        }
        try {
            const result = await client.query(query);
            const count = parseInt(result.rows[0].count);
            isEnrolled = count > 0;
        } catch(error) {
            console.error('Error al verificar inscripción del usuario:', error);
            throw error;
        }
        return isEnrolled;
    }

    async patchEnrollment(rating, description, attended, observation, id_event, id_user) {
        const existe = await client.query((`SELECT ee.id, e.start_date FROM event_enrollments ee INNER JOIN events e ON ee.id_event = e.id_event WHERE ee.id_event =${id_event} AND ee.id_user = ${id_user}`));
        const hoy = new Date();
        if(existe != null && existe.start_date < hoy){
            const query = `UPDATE event_enrollments SET description = ${description}, attended = ${attended}, observations = ${observation}, rating = ${rating} WHERE id_event = ${id_event} AND id_user = ${id_user}`;
            console.log("entró a la query update");
            return await client.query(query);
        }
        return false;
    }
    

    async createvent(name, description, start_date, end_date, location, id_event_category, online, image_url, id_user) {
        const query = `INSERT INTO events(name, description, start_date, end_date, location, id_event_category, online, image_url, id_user) VALUES ('${name}', '${description}', '${start_date}', '${end_date}', '${location}', ${id_event_category}, ${online}, '${image_url}', ${id_user})`;
        return await client.query(query);
    }

    async updateEvent(id, name, description, start_date, end_date, location, id_event_category, online, image_url) {
        const query = `UPDATE events SET name = '${name}', description = '${description}', start_date = '${start_date}', end_date = '${end_date}', location = '${location}', id_event_category = ${id_event_category}, online = ${online}, image_url = '${image_url}' WHERE id = ${id}`;
        return await client.query(query);
    }





}

