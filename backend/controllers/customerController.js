const db = require('../db');

async function getAll(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM customers ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

async function create(req, res) {
  try {
    const { name, email, phone, address, password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const q = `
      INSERT INTO customers (name, email, phone, address, password) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const { rows } = await db.query(q, [name, email, phone, address, password]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}

module.exports = { getAll, create };
