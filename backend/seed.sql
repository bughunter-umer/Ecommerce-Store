-- seeded admin: password = password123 (bcrypt hash)
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@store.com', '$2b$10$KIXn1L2wXHk2j9c0Z0Q6ZeNCeVhCk7vf5MLkQ1n7X2O0Y6YtEJpO2', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO customers (name, email, phone, address)
VALUES
('Acme Corp', 'contact@acme.com', '0300-1234567', 'Street 1, City'),
('Beta LLC', 'info@beta.com', '0311-7654321', 'Street 2, City');

INSERT INTO products (name, description, price, stock)
VALUES
('Wireless Mouse', 'Ergonomic wireless mouse', 20.99, 150),
('Mechanical Keyboard', 'Blue switches mechanical keyboard', 89.50, 40),
('USB-C Cable', '1.5m braided cable', 7.99, 500);

INSERT INTO orders (customer_id, total, status)
VALUES
(1, 41.98, 'completed'),
(2, 97.50, 'pending');

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 1, 2, 20.99),
(2, 2, 1, 89.50),
(2, 3, 1, 7.99);
