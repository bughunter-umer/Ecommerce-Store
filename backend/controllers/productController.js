import db from '../db.js';

async function getAll(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

async function create(req, res) {
  try {
    const { name, description, price, stock } = req.body;
    const q = `INSERT INTO products (name, description, price, stock) 
               VALUES ($1,$2,$3,$4) RETURNING *`;
    const { rows } = await db.query(q, [name, description, price, stock || 0]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const q = `UPDATE products 
               SET name=$1, description=$2, price=$3, stock=$4 
               WHERE id=$5 RETURNING *`;
    const { rows } = await db.query(q, [name, description, price, stock, id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await db.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
}

export { getAll, getById, create, update, remove };
