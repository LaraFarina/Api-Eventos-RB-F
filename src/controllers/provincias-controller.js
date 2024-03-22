import express from "express";
const router = express.Router();

//listado
router.get('/', async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const query = `SELECT * FROM provinces LIMIT $1 OFFSET $2`
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
})