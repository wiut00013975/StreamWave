const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const songsFilePath = path.join(__dirname, '..', 'Data', 'songs.json');

router.get('/', (req, res) => {
  const searchQuery = req.query.q ? req.query.q.trim().toLowerCase() : '';
  fs.readFile(songsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.render('search', { results: [], error: 'Failed to fetch songs data.' });
    }
    const songs = JSON.parse(data);
    const filteredSongs = songs.filter(song => {
      return song.title.toLowerCase().includes(searchQuery) ||
             song.artist.toLowerCase().includes(searchQuery) ||
             song.album.toLowerCase().includes(searchQuery);
    });
    res.render('search', { results: filteredSongs, error: null });
  });
});

module.exports = router;
