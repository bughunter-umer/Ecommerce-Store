const db = require('../db');

async function salesOverview(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT
        to_char(created_at::date, 'YYYY-MM-DD') as day,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at >= NOW() - interval '30 days'
      GROUP BY day
      ORDER BY day ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get report' });
  }
}

module.exports = { salesOverview };
