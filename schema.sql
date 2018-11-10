DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR (30),
department_name VARCHAR (30),
price DECIMAL (10,2),
stock_quantity INTEGER (11),
PRIMARY KEY (item_id)
);

SELECT * FROM products;

