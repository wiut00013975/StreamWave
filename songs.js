const fs = require('fs');
const express = require('express');
const router = express.Router();

const songsData = fs.readFileSync('./Data/songs.json');
const songs = JSON.parse(songsData);

router.get('/', (req, res) => {
  res.render('browse', { songs });
});

module.exports = router;
