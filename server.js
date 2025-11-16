// server.js
require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const { Track, sequelize, setupDatabase } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Ensure database and tables exist before handling requests
(async () => {
  try {
    await setupDatabase(); // Creates tables if they don't exist
    console.log('Database ready.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
})();

// ----------- API Endpoints -----------

// GET /api/tracks - Return all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracks.' });
  }
});

// GET /api/tracks/:id - Return track by ID
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found.' });
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch track.' });
  }
});

// POST /api/tracks - Create a new track
app.post('/api/tracks', async (req, res) => {
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

  if (!songTitle || !artistName || !albumName || !genre) {
    return res.status(400).json({ error: 'songTitle, artistName, albumName, and genre are required.' });
  }

  try {
    const newTrack = await Track.create({ songTitle, artistName, albumName, genre, duration, releaseYear });
    res.status(201).json(newTrack);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create track.' });
  }
});

// PUT /api/tracks/:id - Update a track by ID
app.put('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found.' });

    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

    await track.update({
      songTitle: songTitle ?? track.songTitle,
      artistName: artistName ?? track.artistName,
      albumName: albumName ?? track.albumName,
      genre: genre ?? track.genre,
      duration: duration ?? track.duration,
      releaseYear: releaseYear ?? track.releaseYear
    });

    res.json(track);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update track.' });
  }
});

// DELETE /api/tracks/:id - Delete a track by ID
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found.' });

    await track.destroy();
    res.json({ message: 'Track deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete track.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
