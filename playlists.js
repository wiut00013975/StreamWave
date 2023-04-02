const express = require('express');
const router = express.Router();
const fs = require('fs');
const { body, validationResult } = require('express-validator');


const playlists = require('../Data/playlists.json');

router.get('/', (req, res) => {
  res.render('playlists', { playlists: playlists.list });
});

router.post('/', (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const playlist = {
    id: playlists.nextId++,
    name: name,
    description: description,
    songs: []
  };
  playlists.list.push(playlist);
  res.redirect('/playlists');
});

router.get('/create', (req, res) => {
  res.render('createPlaylist');
});



// ...

// Create a new playlist
router.post('/', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty'),
  body('description').trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, render the form again with error messages
    return res.render('playlists/new', { title: 'Create Playlist', playlist: req.body, errors: errors.array() });
  }

  // Otherwise, create the new playlist and redirect to the playlists index page
  try {
    const playlist = await Playlist.create({
      name: req.body.name,
      description: req.body.description,
      user_id: req.user.id
    });
    res.redirect('/playlists');
  } catch (err) {
    next(err);
  }
});



router.delete('/:id', async (req, res) => {
  const playlistId = req.params.id;
  try {
    await playlists.findByIdAndRemove(playlistId).exec();
    res.redirect('/playlists');
  } catch (err) {
    console.error(err);
    res.redirect('/playlists');
  }
});




router.get('/:id', (req, res) => {
  const playlistId = parseInt(req.params.id);
  const playlist = playlists.list.find(p => p.id === playlistId);
  if (playlist) {
    res.render('playlistDetail', { playlist: playlist, playlists: playlists.list });
  } else {
    res.redirect('/playlists');
  }
});



router.get('/:id/edit', (req, res) => {
  const playlistId = req.params.id;
  const playlist = playlists.list.find(p => p.id === parseInt(playlistId));

  console.log(playlists);
  if (playlist) {
    res.render('editPlaylist', { playlist: playlist, playlists: playlists.list });
  } else {
    res.redirect('/playlists');
  }
});


// router.put('/:id/edit', (req, res) => {
//   const playlistId = req.params.id;
//   const index = playlists.list.findIndex(p => p.id === parseInt(playlistId));
//   if (index !== -1) {
//     playlists.list[index].name = req.body.name;
//     playlists.list[index].description = req.body.description;
//   }
//   res.redirect('/playlists');
// });

router.post('/:id', (req, res) => {
  const playlistId = parseInt(req.params.id);
  const index = playlists.list.findIndex(p => p.id === playlistId);
  if (index !== -1) {
    playlists.list[index].name = req.body.name;
    playlists.list[index].description = req.body.description;
  }
  res.redirect('/playlists');
});

console.log('Playlists router initialized');


module.exports = router;
