-- Vytvoření databáze
CREATE DATABASE IF NOT EXISTS shop_db;
USE shop_db;

-- Vytvoření tabulky kategorií
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Vytvoření tabulky dodavatelů
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(100)
);

-- Vytvoření tabulky produktů
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT,
  supplier_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Vložení ukázkových dat
INSERT INTO categories (name) VALUES 
  ('Elektronika'),
  ('Oblečení'),
  ('Potraviny');

INSERT INTO suppliers (name, contact) VALUES 
  ('ABC Elektronics', 'info@abc.cz'),
  ('Best Clothes', 'objednavky@clothes.cz'),
  ('Food Distribuce', 'info@food.cz');

INSERT INTO products (name, price, category_id, supplier_id) VALUES 
  ('Notebook Lenovo', 15990, 1, 1),
  ('Smartphone Samsung', 8990, 1, 1),
  ('Tričko červené', 299, 2, 2),
  ('Džíny modré', 799, 2, 2),
  ('Čokoláda', 49, 3, 3),
  ('Káva', 129, 3, 3);