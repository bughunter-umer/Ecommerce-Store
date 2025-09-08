const db = require('../db');

async function getAll(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function create(req, res) {
  // Very simple order creation: assume body has customer_id, total
  try {
    const { customer_id, total } = req.body;
    const q = `INSERT INTO orders (customer_id, total) VALUES ($1,$2) RETURNING *`;
    const { rows } = await db.query(q, [customer_id, total]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

module.exports = { getAll, create };
