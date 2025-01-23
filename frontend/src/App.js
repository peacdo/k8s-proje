import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '' });
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://backend-service:8080/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://backend-service:8080/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
      setNewBook({ title: '', author: '', year: '' });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const deleteBook = async (id) => {
    await fetch(`http://localhost:8080/api/books/${id}`, {
      method: 'DELETE'
    });
    fetchBooks();
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setNewBook(book);
  };

  return (
    <div className="App">
      <h1>Books Library</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          value={newBook.year}
          onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
        />
        <button type="submit">Add Book</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>
                <button onClick={() => startEdit(book)}>Edit</button>
                <button onClick={() => deleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App; 