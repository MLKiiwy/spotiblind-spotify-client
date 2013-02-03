var Game = {
	CONNECTION_STATE_CONNECTED: 'connected',
	CONNECTION_STATE_DISCONNECTED: 'disconnected',

	sp:null,
	models:null,
	views:null,
	currentScreen:'start',
	connectionState:'disconnected',
	connectionWantedState:null,

	init: function() {
		var self = Game;

		self.sp = getSpotifyApi();
		self.models = self.sp.require('$api/models');
		self.views = self.sp.require('$api/views');

		self._bindInterface();
		self._bindSpotifyEvents();
	},
	_bindInterface: function() {
		var self = Game;

		$('[data-rel="startButton"]').unbind('click').click(self.onStartClick);
		self._initPlaylistDroping();
	},
	_bindSpotifyEvents: function() {
		var self = Game,
			player = self.models.player;

		// Listen song changes
		player.observe(self.models.EVENT.CHANGE, function (e) {
			if (e.data.curtrack === true) {
				var currentTrack = player.track;
				self.setCurrentTrack(currentTrack);
			}
		});
	},
	_initPlaylistDroping: function() {
		var self = Game,
			dropBox = document.querySelector('playlist-drop');

		dropBox.addEventListener('dragstart', function(e) {
			e.dataTransfer.setData('text/html', this.innerHTML);
			e.dataTransfer.effectAllowed = 'copy';
		}, false);

		dropBox.addEventListener('dragenter', function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
			this.classList.add('over');
		}, false);

		dropBox.addEventListener('dragover', function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
			return false;
		}, false);

		dropBox.addEventListener('dragleave', function(e) {
			e.preventDefault();
			this.classList.remove('over');
		}, false);

		dropBox.addEventListener('drop', function(e) {
			e.preventDefault();
			var URI = e.dataTransfer.getData('text');
			this.classList.remove('over');
			self.setPlaylist(URI);

			// Hide dropper
			$(this).hide();
		}, false);

	},
	connect : function() {
		var self = Game;

		if(self.connectionState == self.CONNECTION_STATE_CONNECTED || self.connectionWantedState == self.CONNECTION_STATE_CONNECTED) {
			return false;
		}

		// Create connexion to server
		self.socket = io.connect('http://localhost:8080');
		self.socket.on('connect', self._onSocketConnected);
		self.socket.on('disconnect', self._onSocketDisconnected);

		self.connectionWantedState = self.CONNECTION_STATE_CONNECTED;
		self.showScreen('waiting');

	},
	disconnect: function() {
		var self = Game;

		// TODO
	},
	_onSocketConnected: function(e) {
		var self = Game;

		self.connectionWantedState = null;
		self.connectionState = self.CONNECTION_STATE_CONNECTED;

		console.log('connected');
	},
	_onSocketDisconnected: function(e) {
		var self = Game;

		self.connectionWantedState = null;
		self.connectionState = self.CONNECTION_STATE_DISCONNECTED;

		console.log('disconnected');
	},
	setCurrentTrack: function(currentTrack) {
		var self = Game;

		// TODO
	},
	setPlaylist: function(URI) {
		var self = Game,
			playlist = self.models.Playlist.fromURI(URI),
			list = new self.views.List(playlist),
			playlistContainer = $('[data-rel="playlist"]');

		playlistContainer.show();
		playlistContainer.append($(list.node));
	},
	showScreen: function(screen) {
		var self = Game;

		if(self.currentScreen == screen) {
			return false;
		}

		$('[data-rel="' + self.currentScreen + 'Screen"]').hide();
		$('[data-rel="' + screen + 'Screen"]').show();
		self.currentScreen = screen;
	},
	onStartClick: function(e) {
		var self = Game;

		self.connect();
	}
};


window.onload = function() {

	Game.init();

	/*
	var simplify = function(str) {
		var str = str.toLowerCase();
		str = str.replace(' ', '');
		str = str.replace('é', 'e');
		str = str.replace('\'', '');
		str = str.replace(',', '');
		return str;
	};

	socket.on('update-users', function (players) {
		globalPlayers = players;
		updatePlayerList();

		// Launch an update of currentSong
		var currentTrack = player.track;
		if(currentTrack && typeof(currentTrack) !== 'undefined') {
			socket.emit('refresh-song', currentTrack.name, currentTrack.uri);
		}

		sendRefreshPlaylist();
	});

	socket.on('add-song-playlist', function (playerKey, uri, name) {
		var newPlaylist = false;
		// Create playlist
		if(!jukeboxPlaylist && typeof(jukeboxPlaylist) === 'undefined') {
			jukeboxPlaylist = new models.Playlist();
			newPlaylist = true;
		}

		var track = models.Track.fromURI(uri);
		jukeboxPlaylist.add(track);

		console.log('add track : ' + name);

		if(newPlaylist) {
			player.play(track,jukeboxPlaylist);
		}

		sendRefreshPlaylist();
	});

	socket.on('response-given', function (playerKey, response) {
		// Get current played track
		var currentTrack = player.track;
		response = simplify(response);
		var find = false;
		if(typeof(currentTrack) != 'undefined') {
			// test on current track name
			var currentTrackName = simplify(currentTrack.name);
			console.log('Compare : ' + response + " <> " + currentTrackName);
			if(currentTrackName == response) {
				find = true;
			} else {
				for(var i=0; i < currentTrack.artists.length; i++) {
					var currentArtist = simplify(currentTrack.artists[i].name);
					console.log('Compare : ' + response + " <> " + currentArtist);
					if(currentArtist == response) {
						find = true;
						break;
					}
				}
			}

			if(find) {
				console.log('GOOD !');
				var artists = '';
				for(var i=0; i < currentTrack.artists.length; i++) {
					artists+=currentTrack.artists[i].name;
				}
				socket.emit('good-response-given', playerKey, currentTrack.name, artists);
			} else {
				console.log('BAD !');
				socket.emit('bad-response-given', playerKey);
			}
		}
	});
	*/
};
