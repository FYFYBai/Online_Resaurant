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
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
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
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items table: represents each pizza in an order
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    pizza_id INT NOT NULL,
    extra_components JSON,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (pizza_id) REFERENCES pizzas(id)
);

INSERT INTO users (
    email, 
    first_name, 
    middle_name, 
    last_name, 
    street, 
    city, 
    state, 
    postal_code, 
    country, 
    password, 
    admin_level
) 
VALUES
(
    'john@example.com',
    'John',
    NULL,
    'Doe',
    '123 Elm Street',
    'Springfield',
    'IL',
    '62704',
    'USA',
    'hashedpassword123',
    'user'
),
(
    'admin@example.com',
    'Admin',
    NULL,
    'User',
    '456 Oak Street',
    'Metropolis',
    'NY',
    '10001',
    'USA',
    'secureadminpass',
    'admin'
);

INSERT INTO pizzas (
    name,
    description,
    base_price
)
VALUES
(
    'Margherita',
    'Classic tomato sauce, cheese, and basil',
    9.99
),
(
    'Pepperoni',
    'Tomato sauce, cheese, and pepperoni',
    12.50
);

INSERT INTO orders (
    user_id,
    order_date,
    total_price,
    payment_code,
    status
)
VALUES
(
    1,               -- references user with id=1
    NOW(),           -- current date/time
    12.99,
    NULL,
    'Pending'
);

INSERT INTO order_items (
    order_id,
    pizza_id,
    extra_components,
    price
)
VALUES
(
    1,         -- references the order with id=1
    1,         -- references the pizza with id=1 (Margherita)
    '{"cheese": true, "basil": true}',
    12.99
),
(
    1,         -- same order
    2,         -- references pizza with id=2 (Pepperoni)
    '{"extraPepperoni": true}',
    14.50
);

INSERT INTO components (
    name,
    price,
    category
)
VALUES
(
    'Extra Cheese',
    2.00,
    'cheese'
),
(
    'Bacon',
    3.50,
    'meat'
);

