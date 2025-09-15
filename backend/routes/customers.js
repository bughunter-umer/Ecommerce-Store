// backend/routes/customers.js
import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ✅ Get all customers
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, phone, address FROM customers ORDER BY id DESC"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching customers:", err.message);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// ✅ Get single customer
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT id, name, email, phone, address FROM customers WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Customer not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Error fetching customer:", err.message);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// ✅ Create new customer
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO customers (name, email, phone, address, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, address`,
      [name, email, phone, address, hashedPassword]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Error creating customer:", err.message);
    res.status(500).json({ success: false, error: "Database error: " + err.message });
  }
});

// ✅ Update customer
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, password } = req.body;

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await db.query(
      `UPDATE customers
       SET name=$1, email=$2, phone=$3, address=$4, password=COALESCE($5, password)
       WHERE id=$6
       RETURNING id, name, email, phone, address`,
      [name, email, phone, address, hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Customer not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating customer:", err.message);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// ✅ Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM customers WHERE id=$1 RETURNING id, name, email",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Customer not found" });
    }

    res.json({ success: true, message: "Customer deleted", data: result.rows[0] });
  } catch (err) {
    console.error("❌ Error deleting customer:", err.message);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
