import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'ecommerce_store',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected PG error', err);
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
