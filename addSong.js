const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/:id/add-song', (req, res) => {
  const playlistId = req.params.id;
  const song = req.body;

  fs.readFile('playlists.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading playlists file');
      return;
    }

    const playlists = JSON.parse(data);

    const playlistIndex = playlists.list.findIndex(p => p.id === parseInt(playlistId));

    if (playlistIndex === -1) {
      res.status(404).send('Playlist not found');
      return;
    }

    playlists.list[playlistIndex].songs.push(song);

    fs.writeFile('playlists.json', JSON.stringify(playlists), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing to playlists file');
        return;
      }

      res.redirect(`/playlists/${playlistId}`);
    });
  });
});

module.exports = router;
