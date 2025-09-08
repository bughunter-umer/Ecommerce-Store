import express from 'express';
import db from '../db.js';

const router = express.Router();

// Simple login demo
router.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    const { rows } = await db.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
