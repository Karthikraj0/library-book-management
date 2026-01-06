import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    publishedYear: "",
    availableCopies: ""
  });
  const [editBook, setEditBook] = useState(null);
  const [error, setError] = useState("");

 const API = "https://library-backend-4n7l.onrender.com/books";


  const fetchBooks = () => {
    axios.get(API)
      .then(res => setBooks(res.data))
      .catch(() => setError("Failed to fetch books"));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addBook = () => {
    if (
      !form.title ||
      !form.author ||
      !form.category ||
      !form.publishedYear ||
      !form.availableCopies
    ) {
      setError("All fields are required");
      return;
    }

    axios.post(API, {
      title: form.title,
      author: form.author,
      category: form.category,
      publishedYear: Number(form.publishedYear),
      availableCopies: Number(form.availableCopies)
    })
      .then(() => {
        setForm({
          title: "",
          author: "",
          category: "",
          publishedYear: "",
          availableCopies: ""
        });
        setError("");
        fetchBooks();
      })
      .catch(() => setError("Failed to add book"));
  };

  const startEdit = (book) => {
    setEditBook({ ...book });
  };

  const handleEditChange = (e) => {
    setEditBook({ ...editBook, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    if (
      !editBook.title ||
      !editBook.author ||
      !editBook.category ||
      !editBook.publishedYear ||
      editBook.availableCopies < 0
    ) {
      alert("Invalid update");
      return;
    }

    axios.put(`${API}/${editBook._id}`, {
      title: editBook.title,
      author: editBook.author,
      category: editBook.category,
      publishedYear: Number(editBook.publishedYear),
      availableCopies: Number(editBook.availableCopies)
    })
      .then(() => {
        setEditBook(null);
        fetchBooks();
      });
  };

  const deleteBook = (id, copies) => {
    if (copies !== 0) {
      alert("Book can be deleted only if copies = 0");
      return;
    }

    axios.delete(`${API}/${id}`)
      .then(() => fetchBooks());
  };

  return (
    <div className="container">
      <h1>Library Book Management</h1>

      <h3>Add Book</h3>
      {error && <p className="error">{error}</p>}

      <div className="form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="publishedYear" placeholder="Year" value={form.publishedYear} onChange={handleChange} />
        <input name="availableCopies" placeholder="Copies" value={form.availableCopies} onChange={handleChange} />
        <button className="add" onClick={addBook}>Add Book</button>
      </div>

      <div className="grid">
        {books.map(book => (
          <div className="card" key={book._id}>

            {editBook && editBook._id === book._id ? (
              <>
                <input name="title" value={editBook.title} onChange={handleEditChange} />
                <input name="author" value={editBook.author} onChange={handleEditChange} />
                <input name="category" value={editBook.category} onChange={handleEditChange} />
                <input name="publishedYear" value={editBook.publishedYear} onChange={handleEditChange} />
                <input name="availableCopies" value={editBook.availableCopies} onChange={handleEditChange} />

                <div className="actions">
                  <button className="add" onClick={saveEdit}>Save</button>
                  <button className="dec" onClick={() => setEditBook(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>{book.title}</h3>
                <p className="meta">{book.author}</p>
                <p className="meta">{book.category} • {book.publishedYear}</p>
                <p><strong>Copies:</strong> {book.availableCopies}</p>

                <div className="actions">
                  <button className="add" onClick={() => startEdit(book)}>Edit</button>
                  <button className="del" onClick={() => deleteBook(book._id, book.availableCopies)}>Delete</button>
                </div>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
