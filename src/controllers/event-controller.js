import express from "express";
const router = express.Router();
import { Pool } from 'pg';
// Acá iría la conexión a la base de datos
const pool = new Pool({

});

// 2. Listado de eventos
router.get('/', async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const query = `
    SELECT e.*, c.name AS category_name, u.username, u.first_name, u.last_name, l.name AS location_name, l.full_address, l.latitude, l.longitude
    FROM events e
    JOIN categories c ON e.category_id = c.id
    JOIN users u ON e.creator_user_id = u.id
    JOIN locations l ON e.location_id = l.id
    ORDER BY e.start_date DESC
    LIMIT $1 OFFSET $2
  `;
    const { rows, rowCount } = await pool.query(query, [limit, offset]);

    res.json({
        collection: rows,
        pagination: {
            limit,
            offset,
            nextPage: rowCount > offset + limit ? offset + limit : null,
            total: rowCount,
        },
    });
});

// 3. Busqueda de un evento
router.get('/search', async (req, res) => {
    const { name, category, startDate, tag } = req.query;
    const filters = [];
    const values = [];

    if (name) {
        filters.push(`e.name ILIKE $${values.length + 1}`);
        values.push(`%${name}%`);
    }

    if (category) {
        filters.push(`c.name ILIKE $${values.length + 1}`);
        values.push(`%${category}%`);
    }

    if (startDate) {
        filters.push(`e.start_date::DATE = $${values.length + 1}`);
        values.push(startDate);
    }

    if (tag) {
        filters.push(`e.tags @> ARRAY[$${values.length + 1}]`);
        values.push(tag);
    }

    const query = `
    SELECT e.*, c.name AS category_name, u.username, u.first_name, u.last_name, l.name AS location_name, l.full_address, l.latitude, l.longitude
    FROM events e
    JOIN categories c ON e.category_id = c.id
    JOIN users u ON e.creator_user_id = u.id
    JOIN locations l ON e.location_id = l.id
    ${filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''}
    ORDER BY e.start_date DESC
  `;
    const { rows } = await pool.query(query, values);

    res.json(rows);
});

// 4. Detalle de un evento
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT e.*, c.name AS category_name, u.username, u.first_name, u.last_name, l.name AS location_name, l.full_address, l.latitude, l.longitude
    FROM events e
    JOIN categories c ON e.category_id = c.id
    JOIN users u ON e.creator_user_id = u.id
    JOIN locations l ON e.location_id = l.id
    WHERE e.id = $1
  `;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.json(rows[0]);
});

// 5. Listado de participantes
router.get('/:id/enrollments', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, username, attended } = req.query;
    const filters = [];
    const values = [id];

    if (firstName) {
        filters.push(`u.first_name ILIKE $${values.length + 1}`);
        values.push(`%${firstName}%`);
    }

    if (lastName) {
        filters.push(`u.last_name ILIKE $${values.length + 1}`);
        values.push(`%${lastName}%`);
    }

    if (username) {
        filters.push(`u.username ILIKE $${values.length + 1}`);
        values.push(`%${username}%`);
    }

    if (attended !== undefined) {
        filters.push(`e.attended = $${values.length + 1}`);
        values.push(attended);
    }

    const query = `
    SELECT u.id, u.username, u.first_name, u.last_name, e.attended, e.rating, e.description
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    WHERE e.event_id = $1
    ${filters.length > 0 ? `AND ${filters.join(' AND ')}` : ''}
  `;
    const { rows } = await pool.query(query, values);

    res.json(rows);
});

// 9. Inscripcion a un evento
router.post('/:id/enrollments', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    const eventQuery = `
    SELECT enabled_for_enrollment, max_assistance
    FROM events
    WHERE id = $1
  `;
    const { rows: eventRows } = await pool.query(eventQuery, [id]);

    if (eventRows.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
    }

    const { enabled_for_enrollment, max_assistance } = eventRows[0];

    if (!enabled_for_enrollment) {
        return res.status(400).json({ message: 'Enrollment is not enabled for this event' });
    }

    const enrollmentQuery = `
    SELECT COUNT(*) AS count
    FROM enrollments
    WHERE event_id = $1
  `;
    const { rows: enrollmentRows } = await pool.query(enrollmentQuery, [id]);
    const currentEnrollments = enrollmentRows[0].count;

    if (currentEnrollments >= max_assistance) {
        return res.status(400).json({ message: 'Event has reached maximum capacity' });
    }

    const insertQuery = `
    INSERT INTO enrollments (event_id, user_id)
    VALUES ($1, $2)
    RETURNING *
  `;
    const { rows: enrollmentResult } = await pool.query(insertQuery, [id, userId]);

    res.status(201).json(enrollmentResult[0]);
});

export default router;