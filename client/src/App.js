import React, { useState, useEffect } from 'react';
import './App.css';

// Assume your API runs on a specific port/local URL
const API_URL = 'http://localhost:7071/api/items'; 

function App() {
  const [items, setItems] = useState([]);
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

  if (loading) return <div>Loading data from Azure backend...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="App">
      <h1>My Simple Web App</h1>
      <div className="item-list">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <small>Price: ${item.price}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;