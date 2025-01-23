const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Starting backend application...');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres-service',
  database: 'books_db',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

console.log('Database configuration loaded...');

// Initialize database
pool.query(`
  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INTEGER
  )
`).then(() => {
  console.log('Database table created/verified successfully');
}).catch(err => {
  console.error('Error initializing database:', err);
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new book
app.post('/api/books', async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *',
      [title, author, year]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a book
app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  try {
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *',
      [title, author, year, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
}); 