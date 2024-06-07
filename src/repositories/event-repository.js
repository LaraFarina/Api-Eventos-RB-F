import pg from "pg";
import { config } from "./db.js"; 

// Crear un nuevo cliente de PostgreSQL usando la configuración de la base de datos.
const client = new pg.Client(config);
// Conectar el cliente a la base de datos.
client.connect();
console.log('config', config); // Muestra en pantalla la configuración de la base de datos.

// Consultar todos los eventos en la tabla de eventos.
const sql = "SELECT * FROM events";
const respuesta = await client.query(sql);

// Clase EventRepository para manejar operaciones relacionadas con eventos.
export class EventRepository {
    // Método para obtener eventos filtrados por varios criterios.
    async getEventsByFilters(name, category, startDate, tag, limit, offset) {
        console.log("Tag: ", tag);
        console.log("Category:", category);
        console.log("Name: ", name);
        console.log("startDate: ", startDate);

        let sqlQuery = "SELECT * FROM events WHERE 1=1";

        if (name) {
            sqlQuery += ` AND "name" LIKE '%${name}%'`;
        }
        if (category) {
            // Obtener el ID de la categoría del evento.
            const categoryIdQuery = `SELECT id FROM event_categories WHERE "name" = '${category}'`;
            const { rows: categoryRows } = await client.query(categoryIdQuery);
            const categoryId = categoryRows[0]?.id;
            console.log(categoryId);
            if (categoryId) {
                console.log("SOY UNA CATEGORIA Y EXISTO");
                sqlQuery += ` AND id_event_category = '${categoryId}'`;
            }
        }
        if (startDate) {
            sqlQuery += ` AND start_date::date = '${startDate}'::date`;
        }
        if (tag) {
            // Obtener el ID del tag.
            const tagIdQuery = `SELECT id FROM tags WHERE "name" = '${tag}'`;
            const { rows: tagRows } = await client.query(tagIdQuery);
            const tagId = tagRows[0]?.id;
            if (tagId) {
                sqlQuery += ` AND id IN (SELECT id_event FROM event_tags WHERE id_tag = '${tagId}')`;
            }
        }

        // Agregar paginación utilizando limit y offset.
        sqlQuery += ` LIMIT ${limit} OFFSET ${offset}`;

        try {
            const { rows } = await client.query(sqlQuery);
            return rows;
        } catch (error) {
            console.error("Error al ejecutar la consulta SQL:", error);
            throw new Error('Error al obtener eventos por filtros');
        }
    }

    // Método para obtener un evento por su ID.
    async getEventById(id) {
        const sqlQuery = `SELECT * FROM events WHERE id = ${id}`;
        const values = client.query(sqlQuery);
        console.log(values);
        return values;
    }

    // Método para obtener los participantes de un evento por su ID.
    async getParticipantesEvento(id, queryPrimero) {
        const sqlQuery = `SELECT er.*,u.first_name,u.last_name,u.username,e.name FROM event_enrollments er
        LEFT JOIN users u ON er.id_user = u.id
        LEFT JOIN events e ON er.id_event = e.id 
		LEFT JOIN event_tags et ON e.id = et.id_event
        LEFT JOIN tags ON et.id = tags.id
        WHERE e.id = ${id} + ${queryPrimero}`;
        const values = client.query(sqlQuery);
        console.log(values);
        return values;
    }

    // Método para registrar la inscripción de un usuario a un evento.
    async postInscripcionEvento(id_event,id_user) { 
        let inscripcionEvento;
        const query = {
            text: `INSERT INTO event_enrollments(id_event,id_user,registration_date_time) VALUES ($1, $2) `,
            values: [id_event, id_user],
        };
        try{
            const result = await client.query(query);
            inscripcionEvento = result.rows[0];
            console.log('Usuario Inscripto', inscripcionEvento);
        } catch(error){
            console.error('Error al insertar usuario:', error);
        }
        if(!inscripcionEvento){
            throw new Error('Not Found');
        } 
        const values = client.query(sqlQuery, vectorValores);
        return values;
    }

    // Método para actualizar la inscripción de un usuario a un evento.
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
    
    // Método para crear un nuevo evento.
    async createvent(name, description, start_date, end_date, location, id_event_category, online, image_url, id_user) {
        const query = `INSERT INTO events(name, description, start_date, end_date, location, id_event_category, online, image_url, id_user) VALUES ('${name}', '${description}', '${start_date}', '${end_date}', '${location}', ${id_event_category}, ${online}, '${image_url}', ${id_user})`;
        return await client.query(query);
    }

    // Método para actualizar un evento existente.
    async updateEvent(id, name, description, start_date, end_date, location, id_event_category, online, image_url) {
        const query = `UPDATE events SET name = '${name}', description = '${description}', start_date = '${start_date}', end_date = '${end_date}', location = '${location}', id_event_category = ${id_event_category}, online = ${online}, image_url = '${image_url}' WHERE id = ${id}`;
        return await client.query(query);
    }
}
