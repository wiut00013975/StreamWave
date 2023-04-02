let deletePlaylist = document.querySelectorAll('.delete-btn')



deletePlaylist.forEach(btn => {
    btn.addEventListener('click', e => {
    	fetch('/playlists/delete', {
    		method: 'DELETE',
    		headers: {
    			'Content-Type': 'application/json'
    		},
    		body: JSON.stringify({ id: e.target.dataset.id })
    	})
    	.then(res => res.json())
    	.then(data => {
    		if (data.deleted) {
    			e.target.parentElement.parentElement.remove()
    		}
    	})
    })
})

// Make an AJAX request to retrieve the playlist data
const xhr = new XMLHttpRequest();
xhr.open('GET', './Data/playlists.json');
xhr.onload = function() {
  if (xhr.status === 200) {
    const playlistData = JSON.parse(xhr.responseText);

    // Loop through the playlist data and create HTML elements
    const playlistsContainer = document.getElementById('playlists-container');
    for (let i = 0; i < playlistData.length; i++) {
      const playlist = playlistData[i];
      const playlistElement = document.createElement('div');
      playlistElement.innerHTML = `
        <div>${playlist.name}</div>
        <div>${playlist.description}</div>
        <div>${playlist.tracks.length} tracks</div>
      `;
      playlistsContainer.appendChild(playlistElement);
    }
  }
};
xhr.send();

  