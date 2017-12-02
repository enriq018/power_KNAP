const http = require('http');
const express = require('express');
const youtubeApi = require('./youtubeService');
const db = require('../database/postgres');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoutes = require('./auth-routes');
const passportSetup = require('../passport-setup');

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const roomSpace = {};

server.listen(port, () => console.log(`listening on port ${port}`));
app.use(express.static(`${__dirname}./../client`));
// const lobbySpace = io.of('/lobby');

app.use(cookieSession({
  keys: process.env.COOKIEKEY,
  maxAge: 24 * 60 * 60 * 1000, // one day
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

// Room HTTP Requests
app.get('/allrooms', (req, res) => {
  console.log('a room request was received');
  const allRoomNames = [];
  db.getRoomNames()
    .then((rooms) => {
      rooms.forEach((room) => {
        // console.log('----------------------', room.dataValues.roomName, '-----------------------------');
        allRoomNames.push(room);
      })
    })
    .then(() => {res.end(JSON.stringify(allRoomNames))});
})

app.get('/renderRoom/:roomId', (req, res) => {
  console.log(`RENDER ROOM ${req.params.roomId}`)

  const roomProperties = {};
  db.findVideos(req.params.roomId)
    .then((videos) => { roomProperties.videos = videos; })
    .then(() => db.getRoomProperties(req.params.roomId))
    .then(({ indexKey, startTime }) => {
      roomProperties.index = indexKey;
      roomProperties.start = startTime;
    })
    .then(() => res.json(roomProperties))
    .catch(() => res.sendStatus(404));
});

app.get('/search', (req, res) => {
  youtubeApi.grabVideos(req.query.query)
    .then(searchResults => res.json(searchResults))
    .catch(() => res.sendStatus(404));
});

app.patch('/playNext/:roomId/:length', (req, res) => {
  const roomPlaylistLength = Number(req.params.length);
  // console.log('here', req.params.length)
  const sendIndex = ({ indexKey }) => {
    roomSpace[req.params.roomId].emit('playNext', indexKey);
  };

  const queueNextVideo = (playlistLength, currentIndex) => {
    if (playlistLength === currentIndex) return db.resetRoomIndex(req.params.roomId);
    return db.incrementIndex(req.params.roomId);
  };

  db.getIndex(req.params.roomId)
    .then(currentSongIndex => queueNextVideo(roomPlaylistLength, currentSongIndex))
    .then(room => sendIndex(room.dataValues))
    .then(() => db.setStartTime(req.params.roomId))
    .then(() => res.end())
    .catch(err => res.send(err));
});

app.post('/createRoom/:roomName', (req, res) => {
  db.createRoom(req.params.roomName, (data) => {
    res.sendStatus(201)
    res.send(data);
  })
})

// Room Socket Events
app.get('/openRoomConnection/:userId/:roomId', (req, res) => {
// console.log(`HELLO FROM ROOM ${req.params.roomId}`)
if (roomSpace[req.params.roomId] !== undefined) {
  console.log('test')
  // res.send(`Room Connected to RoomId: ${req.params.roomId}`);
}

  roomSpace[req.params.roomId] = io.of(`/room${req.params.roomId}`);
  // console.log(roomSpace[req.params.roomId])

  let roomHost;
  const giveHostStatus = host => roomSpace[req.params.roomId].to(host).emit('host');

  roomSpace[req.params.roomId].on('connection', (socket) => {
    // console.log(`connected to ${Object.keys(socket.nsp.sockets).length} socket(s)`);
    roomSpace[req.params.roomId].to(socket.id).emit('id', socket.id);
    if (Object.keys(socket.nsp.sockets).length === 1) {
      // roomHost = socket.id;  //original line
      roomHost = req.params.userId;
      giveHostStatus(roomHost);
    }

    const sendPlaylist = () => (
      db.findVideos(req.params.roomId)
        .then((videos) => {
          roomSpace[req.params.roomId].emit('retrievePlaylist', videos);
          if (videos.length === 0) throw videos;
          if (videos.length === 1) db.setStartTime(req.params.roomId);
        })
        .catch((emptyPlaylist) => {
          if (Array.isArray(emptyPlaylist)) { // Check if the thrown item is an array rather than an Error
            roomSpace[req.params.roomId].emit('default');
          } else {
            throw emptyPlaylist;
          }
        })
        .catch(err => roomSpace[req.params.roomId].emit('error', err))
    );

    socket.on('saveToPlaylist', (video) => {
      const videoData = {
        title: video.snippet.title,
        creator: video.snippet.channelTitle,
        url: video.id.videoId,
        description: video.snippet.description,
      };
      return db.createVideoEntry(videoData, req.params.roomId)
        .then(() => sendPlaylist());
    });

    socket.on('removeFromPlaylist', (videoName) => {
      db.removeFromPlaylist(videoName, req.params.roomId)
        .then(() => sendPlaylist())
        .catch(err => roomSpace[req.params.roomId].emit('error', err));
    });

    socket.on('emitMessage', (message) => {
      message.userName = message.userName.split('#')[1].substring(0, 8); // Pluck Socket ID
      let sum = 0;
      for (let i = 0; i < 3; i += 1) {
        sum += message.userName.charCodeAt(i);
      }
      const colors = ['#ffb3ba', '#ffd2b3', '#fff8b3', '#baffb3', '#bae1ff', '#e8baff'];
      const userColor = colors[(sum % colors.length)];
      message.userColor = userColor;
      roomSpace[req.params.roomId].emit('pushingMessage', message);
    });

    socket.on('disconnect', () => {
      if (Object.keys(socket.nsp.sockets).length > 0) {
        const newHost = Object.keys(socket.nsp.sockets)[0];
        console.log(`A user has disconnected from ${roomSpace[req.params.roomId].name}`);
        return (newHost === roomHost) ? null : giveHostStatus(newHost);
      }
      delete roomSpace[req.params.roomId]; // might not need
    });
  });
  res.send(`Room Connected to RoomId: ${req.params.roomId}`);
});


