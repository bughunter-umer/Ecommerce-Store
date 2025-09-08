// backend/server.js
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import reportRoutes from './routes/reports.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => res.send('Ecommerce API running'));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
