import React, { useState, useEffect } from 'react';
import './App.css';

// Use the domain name
const API_BASE = 'http://esb.staj/api';  // For development

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [serverInfo, setServerInfo] = useState({ pod: '', server: '' });

  useEffect(() => {
    fetchBooks();
    fetchServerInfo();
  }, []);

  const fetchServerInfo = async () => {
    try {
      const response = await fetch(`${API_BASE}/info`);
      const data = await response.json();
      setServerInfo(data);
    } catch (error) {
      console.error('Error fetching server info:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      console.log('Fetching books...');  // Debug log
      const response = await fetch(`${API_BASE}/books`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);  // Debug log
      console.log('Response headers:', response.headers);  // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();  // Get raw response
      console.log('Raw response:', text);  // Debug log
      
      const data = text ? JSON.parse(text) : [];  // Parse if not empty
      console.log('Parsed data:', data);  // Debug log
      
      setBooks(data);
    } catch (error) {
      console.error('Detailed error:', {  // Detailed error logging
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting book:', newBook);  // Debug log
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
      
      console.log('Response status:', response.status);  // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);  // Debug log
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Success response:', result);  // Debug log
      
      setNewBook({ title: '', author: '', year: '' });
      fetchBooks();
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
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

      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        fontSize: '0.9em',
        color: '#666'
      }}>
        <div>Pod: {serverInfo.pod}</div>
        <div>Server: {serverInfo.server}</div>
        <div>Last Updated: {new Date(serverInfo.timestamp).toLocaleString()}</div>
      </footer>
    </div>
  );
}

export default App; 