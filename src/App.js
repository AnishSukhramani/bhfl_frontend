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
      if (!parsedData || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid data format: data should be an array');
      }

      // Call the API
      const apiResponse = await fetch('https://bfhl-backend-gb6a.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!apiResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await apiResponse.json();
      console.log('API Response:', result); // Log the API response

      // Apply filters to the response data
      const filteredData = filterResponse(result);
      setResponse(filteredData);
      setError('');
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const filterResponse = (data) => {
    if (!data || !data.data) {
      return { numbers: [], alphabets: [], highest_lowercase_alphabet: [] };
    }

    let filteredData = {
      numbers: data.numbers || [],
      alphabets: data.alphabets || [],
      highest_lowercase_alphabet: data.highest_lowercase_alphabet || []
    };

    if (selectedFilters.alphabets && !selectedFilters.numbers && !selectedFilters.highestLowercase) {
      return { numbers: [], alphabets: filteredData.alphabets, highest_lowercase_alphabet: [] };
    }

    if (selectedFilters.numbers && !selectedFilters.alphabets && !selectedFilters.highestLowercase) {
      return { numbers: filteredData.numbers, alphabets: [], highest_lowercase_alphabet: [] };
    }

    if (selectedFilters.highestLowercase) {
      return { numbers: [], alphabets: [], highest_lowercase_alphabet: filteredData.highest_lowercase_alphabet };
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
