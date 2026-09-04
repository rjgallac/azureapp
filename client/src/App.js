import React, { useState, useEffect } from 'react';
import './App.css';

// Assume your API runs on a specific port/local URL
const API_URL = 'http://localhost:7071/api/items'; 

function App() {
  const [items, setItems] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data from the backend.');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (event) => {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;

    try {
      setError(null);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('Failed to add todo.');
      const item = await response.json();
      setItems(currentItems => [item, ...currentItems]);
      setNewTodo('');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (item) => {
    try {
      setError(null);
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, completed: !item.completed })
      });
      if (!response.ok) throw new Error('Failed to update todo.');
      const updatedItem = await response.json();
      setItems(currentItems => currentItems.map(currentItem =>
        currentItem.id === updatedItem.id ? updatedItem : currentItem
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="status">Loading your todos...</div>;

  return (
    <div className="App">
      <main className="todo-shell">
        <header>
          <p className="eyebrow">Today</p>
          <h1>Things to do</h1>
          <p className="subtitle">A small list for the next right thing.</p>
        </header>
        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={event => setNewTodo(event.target.value)}
            placeholder="Add a todo"
            aria-label="New todo"
          />
          <button type="submit">Add</button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
      <div className="item-list">
          {items.length === 0 && <p className="empty-state">Nothing here yet.</p>}
          {items.map(item => (
            <label key={item.id} className={`item-card ${item.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={Boolean(item.completed)}
                onChange={() => toggleTodo(item)}
              />
              <span>{item.text}</span>
            </label>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;