CREATE USER 'admin'@'localhost' IDENTIFIED with mysql_native_password by 'password';
GRANT ALL PRIVILEGES ON online_restaurant.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
