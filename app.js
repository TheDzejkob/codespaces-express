const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// připojení k databázi
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'heslo', 
  database: 'shop_db',
  port: 3307
});

// Připojení k databázi
connection.connect(err => {
  if (err) {
    console.error('Chyba připojení k databázi:', err);
    return;
  }
  console.log('Připojeno k MySQL databázi');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Hlavní stránka
app.get('/', (req, res) => {
  res.render('index');
});

// JOIN
app.get('/products', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name, s.name as supplier_name 
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN suppliers s ON p.supplier_id = s.id
  `;
  
  connection.query(query, (err, products) => {
    if (err) throw err;
    res.render('products', { products });
  });
});

// WHERE
app.get('/products/category/:id', (req, res) => {
  const categoryId = req.params.id;
  const query = `
    SELECT p.*, c.name as category_name, s.name as supplier_name 
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.category_id = ?
  `;
  
  connection.query(query, [categoryId], (err, products) => {
    if (err) throw err;
    res.render('products', { products });
  });
});

// přidání produktu
app.get('/products/new', (req, res) => {
  connection.query('SELECT * FROM categories', (err, categories) => {
    if (err) throw err;
    connection.query('SELECT * FROM suppliers', (err, suppliers) => {
      if (err) throw err;
      res.render('product_form', { categories, suppliers });
    });
  });
});

// INSERT
app.post('/products', (req, res) => {
  const { name, price, category_id, supplier_id } = req.body;
  const query = `
    INSERT INTO products (name, price, category_id, supplier_id) 
    VALUES (?, ?, ?, ?)
  `;
  
  connection.query(query, [name, price, category_id, supplier_id], (err, result) => {
    if (err) throw err;
    res.redirect('/products');
  });
});

// editace produktu
app.get('/products/edit/:id', (req, res) => {
  const productId = req.params.id;
  
  connection.query('SELECT * FROM products WHERE id = ?', [productId], (err, products) => {
    if (err) throw err;
    connection.query('SELECT * FROM categories', (err, categories) => {
      if (err) throw err;
      connection.query('SELECT * FROM suppliers', (err, suppliers) => {
        if (err) throw err;
        res.render('product_edit', { product: products[0], categories, suppliers });
      });
    });
  });
});

// UPDATE
app.post('/products/update/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price, category_id, supplier_id } = req.body;
  const query = `
    UPDATE products 
    SET name = ?, price = ?, category_id = ?, supplier_id = ? 
    WHERE id = ?
  `;
  
  connection.query(query, [name, price, category_id, supplier_id, productId], (err, result) => {
    if (err) throw err;
    res.redirect('/products');
  });
});

// DELETE
app.get('/products/delete/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE id = ?';
  
  connection.query(query, [productId], (err, result) => {
    if (err) throw err;
    res.redirect('/products');
  });
});

// start more
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});