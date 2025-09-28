// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const Ad = require('./src/models/Ad');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const XE_API_URL = 'https://oapaiqtgkr6wfbum252tswprwa0ausnb.lambda-url.eu-central-1.on.aws/'; //
const cache = {};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from the XE Backend Server!');
});

app.get('/api/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    if (!input || input.length < 3) { return res.json([]); }
    if (cache[input]) {
      console.log(`Serving from cache for: ${input}`);
      return res.json(cache[input]);
    }
    console.log(`Fetching from API for: ${input}`);
    const response = await axios.get(`${XE_API_URL}?input=${input}`);
    cache[input] = response.data;
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching autocomplete data:', error.message);
    res.status(500).json({ message: 'Error fetching data from external API' });
  }
});

app.post('/api/ads', async (req, res) => {
  try {
    const { title, type, area, placeId, price, description } = req.body;

    const newAd = new Ad({
      title,
      type,
      area,
      placeId,
      price,
      description,
    });

    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (error) {
    console.error('Error creating ad:', error.message);
    res.status(400).json({ message: 'Error creating ad', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});