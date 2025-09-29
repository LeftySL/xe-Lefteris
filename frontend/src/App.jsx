// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';

function App() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Rent');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placeId, setPlaceId] = useState(null);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (area.length < 3) {
        setSuggestions([]);
        return;
      }
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/autocomplete?input=${area}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [area]);

  const handleSuggestionClick = (suggestion) => {
    setArea(suggestion.mainText);
    setPlaceId(suggestion.placeId);
    setSuggestions([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!placeId) {
      alert('Please select a valid area from the suggestions list.');
      return;
    }

    const adData = {
      title,
      type,
      area,
      placeId,
      price,
      description,
    };
    
    try {
      const response = await axios.post('http://localhost:5000/api/ads', adData);
      console.log('Ad saved successfully:', response.data);
      alert('Your ad was created successfully!');

      setTitle('');
      setType('Rent');
      setArea('');
      setPlaceId(null);
      setPrice('');
      setDescription('');
      
    } catch (error) {
      console.error('Error submitting ad:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <h1>XE Ad Creation Form</h1>
      <form className="ad-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength="155" />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="Rent">Rent</option> <option value="Buy">Buy</option> <option value="Exchange">Exchange</option> <option value="Donation">Donation</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="area">Area</label>
          <input
            id="area"
            type="text"
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setPlaceId(null);
            }}
            required
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li key={suggestion.placeId} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.mainText}, {suggestion.secondaryText}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="price">Price in Euros</label>
          <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Extra description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
        </div>
        <button type="submit" className="submit-btn">Submit Ad</button>
      </form>
    </div>
  );
}

export default App;