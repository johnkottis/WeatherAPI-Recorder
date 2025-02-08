import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (endpoint, city) => {
    try {
      const response = await fetch(`http://localhost:5001/api/weather/${endpoint}?city=${city}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setResponseData(result);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCitySubmit = async () => {
    fetchWeatherData('current', city);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>OpenWeather API Interaction</h1>
        <div>
          {['London', 'Athens', 'Berlin', 'Washington'].map(fixedCity => (
            <button key={fixedCity} onClick={() => fetchWeatherData('current', fixedCity)}>Fetch Weather for {fixedCity}</button>
          ))}
        </div>
        <div>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
          <button onClick={handleCitySubmit}>Fetch Weather for Entered City</button>
        </div>
        <div>
          <button onClick={() => fetchWeatherData('forecast', city)}>Fetch Weather Forecast</button>
          <button onClick={() => fetchWeatherData('air_pollution', city)}>Fetch Air Pollution</button>
        </div>
        <div>
          <h2>Response Data</h2>
          {responseData ? <pre>{JSON.stringify(responseData, null, 2)}</pre> : <p>No response data fetched yet.</p>}
        </div>
        <div>
          <h2>Error</h2>
          {error ? <pre>{error}</pre> : <p>No errors.</p>}
        </div>
      </header>
    </div>
  );
}

export default App;