import db from "../db.js";

// Get all orders
export async function getAll(req, res) {
  try {
    const q = `
      SELECT o.*, c.name as customer_name, p.name as product_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC`;
    const { rows } = await db.query(q);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// Get single order
export async function getById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM orders WHERE id=$1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

// Create new order
export async function create(req, res) {
  try {
    const { customer_id, product_id, quantity, total, status } = req.body;
    const q = `INSERT INTO orders (customer_id, product_id, quantity, total, status) 
               VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const { rows } = await db.query(q, [customer_id, product_id, quantity, total, status || "Pending"]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
}

// Update order
export async function update(req, res) {
  try {
    const { id } = req.params;
    const { customer_id, product_id, quantity, total, status } = req.body;
    const q = `UPDATE orders 
               SET customer_id=$1, product_id=$2, quantity=$3, total=$4, status=$5 
               WHERE id=$6 RETURNING *`;
    const { rows } = await db.query(q, [customer_id, product_id, quantity, total, status, id]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
}

// Delete order
export async function remove(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await db.query("DELETE FROM orders WHERE id=$1 RETURNING *", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, order: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
}
