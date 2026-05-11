-- Создание таблиц
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER,
    order_date TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Добавление товаров
INSERT INTO products (name, category, price) VALUES
('Ноутбук', 'Техника', 65000),
('Мышь', 'Аксессуары', 800),
('Монитор', 'Техника', 12000),
('Клавиатура', 'Аксессуары', 2500),
('Наушники', 'Аксессуары', 3200),
('Принтер', 'Техника', 17000);

-- Добавление заказов
INSERT INTO orders (product_id, quantity, order_date) VALUES
(1, 2, '2025-10-10'),
(2, 5, '2025-10-11'),
(3, 1, '2025-10-12'),
(4, 3, '2025-10-12'),
(5, 4, '2025-10-13'),
(1, 1, '2025-10-14'),
(6, 2, '2025-10-15');
