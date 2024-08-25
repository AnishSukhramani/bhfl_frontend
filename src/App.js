import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    alphabets: false,
    numbers: false,
    highestLowercase: false
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilters({
      ...selectedFilters,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const parsedData = JSON.parse(inputValue);
      if (!Array.isArray(parsedData.data)) {
        throw new Error('Invalid data format');
      }

      // Call the API
      const res = await fetch('http://localhost:4000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });
      const result = await res.json();
      setResponse(result);
      setError('');

      // Apply filters to the response data
      const filteredData = filterResponse(result);
      setResponse(filteredData);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const filterResponse = (data) => {
    let filteredData = { data: [...data.data] };

    if (selectedFilters.alphabets) {
      filteredData.data = filteredData.data.filter(item => /^[a-zA-Z]+$/.test(item));
    }
    if (selectedFilters.numbers) {
      filteredData.data = filteredData.data.filter(item => /^[0-9]+$/.test(item));
    }
    if (selectedFilters.highestLowercase) {
      const lowercaseAlphabets = filteredData.data.filter(item => /^[a-z]+$/.test(item));
      const highest = lowercaseAlphabets.reduce((max, current) => (current > max ? current : max), 'a');
      filteredData.data = [highest];
    }

    return filteredData;
  };

  return (
    <div className="App">
      <h1>21BCE10893</h1>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        placeholder='Enter JSON here'
        rows={5}
      />
      <div className="filters">
        <label>
          <input
            type="checkbox"
            name="alphabets"
            checked={selectedFilters.alphabets}
            onChange={handleFilterChange}
          />
          Alphabets
        </label>
        <label>
          <input
            type="checkbox"
            name="numbers"
            checked={selectedFilters.numbers}
            onChange={handleFilterChange}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            name="highestLowercase"
            checked={selectedFilters.highestLowercase}
            onChange={handleFilterChange}
          />
          Highest lowercase alphabet
        </label>
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {error && <div className="error">{error}</div>}
      {response && (
        <div className="response">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
