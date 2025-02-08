const express = require('express');
const axios = require('axios');
const { logRequest, logResponse, deleteAllSimilarLogs } = require('./middleware');
const router = express.Router();

router.use(logRequest);
router.use(logResponse);

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_API_KEY = 'XXX'; // Replace with your OpenWeather API key

router.get('/api/weather/current', async (req, res) => {
  const { city } = req.query;
  try {
    deleteAllSimilarLogs(req, 'current');
    const response = await axios.get(`${OPENWEATHER_API_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current weather data' });
  }
});

router.get('/api/weather/forecast', async (req, res) => {
  const { city } = req.query;
  try {
    deleteAllSimilarLogs(req, 'forecast');
    const response = await axios.get(`${OPENWEATHER_API_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather forecast data' });
  }
});

router.get('/api/weather/air_pollution', async (req, res) => {
  const { city } = req.query;
  try {
    deleteAllSimilarLogs(req, 'air_pollution');
    const locationResponse = await axios.get(`${OPENWEATHER_API_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
      },
    });
    const { coord } = locationResponse.data;
    const response = await axios.get(`${OPENWEATHER_API_URL}/air_pollution`, {
      params: {
        lat: coord.lat,
        lon: coord.lon,
        appid: OPENWEATHER_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch air pollution data' });
  }
});

module.exports = router;