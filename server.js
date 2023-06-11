const express = require('express');
const app = express();
const server = require('http').Server(app); // Create server for socket.io
const io = require('socket.io')(server);
const { v4: generateRoomName } = require('uuid'); // Use UUID's V4 function to generate unique room name

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${generateRoomName()}`);
});

app.get('/:room', (req, res) => {
  const { roomId } = req.params
  res.render('room', { roomId });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
