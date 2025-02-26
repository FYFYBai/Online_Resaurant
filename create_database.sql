-- Drop tables if they exist (order matters due to foreign key constraints)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS components;
DROP TABLE IF EXISTS pizzas;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_level ENUM('user', 'admin') DEFAULT 'user' 
);

-- Pizzas table: stores the menu of available pizzas
CREATE TABLE pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL
);

-- Components table: stores extra components available for pizza customization
CREATE TABLE components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('cheese', 'meat') NOT NULL
);

-- Orders table: stores orders placed by users
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL,
    payment_code INT,                  
    status ENUM('Pending', 'accepeted', 'delivered', 'rejected') NOT NULL DEFAULT 'Pending',
    updated_at DATETIME,              
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items table: represents each pizza in an order
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    pizza_id INT NOT NULL,
    extra_components JSON,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (pizza_id) REFERENCES pizzas(id)	-- pizzas table will remain unaffected
);

INSERT INTO pizzas (name, description, base_price) VALUES
('Margherita Pizza', 'Margherita Pizza Description', 12.99),
('Con Patate Pizza', 'Con Patate Pizza Description', 14.99),
('Alla Bufala Pizza','Alla Bufala Pizza Description', 15.99),
('Quattro Stagioni Pizza', 'Quattro Stagioni Pizza Description', 16.99),
('Neopolitan Pizza', 'Neopolitan Pizza Description', 12.99),
('Capricciosa Pizza', 'Capricciosa Pizza Description', 10.99);

-- Sample data for toppings
INSERT INTO components (name, price, category) VALUES
('Extra Pancetta', 2.00, 'meat'),
('Extra Prosciutto', 2.00, 'meat'),
('Extra Salami', 2.00, 'meat'),
('Extra Speck', 2.25, 'meat'),
('Extra Pepperoni', 2.50, 'meat'),
('Extra Parmesan', 1.50, 'cheese'),
('Extra Fiore di Latte', 2.00, 'cheese'),
('Extra Gorgonzola', 2.50, 'cheese'),
('Extra Mozzarella di Bufala', 3.00, 'cheese'),
('Extra Pecorino', 3.00, 'cheese');

SELECT * from users;
select * from orders;
select * from order_items;
select * from components;
